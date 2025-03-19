function djb2Hash32(ansiString) {
    let hash = 5381;
    for (let i = 0; i < ansiString.length; i++) {
        hash = (hash * 33 + ansiString.charCodeAt(i)) % 0x100000000;
    }
    return hash;
}

function getHash(unicodeString) {
    return djb2Hash32(encodeURI(unicodeString));
}

function inBloom(a, b, c, d, hash) {
    const index = hash % 128;
    const part = [d,c,b,a][Math.floor(index / 32)];
    return (part & (1 << (index%32))) !== 0;
}

// -----------------------------------------

const unYo = s => s.replace('ё', 'е').replace('Ё', 'Е');

function makeBloomFilter128(commaSeparatedWords) {
    const result = [0, 0, 0, 0];
    const words = commaSeparatedWords.split(',');
    for (let word of words) {
        const processedWord = unYo(word.toLowerCase().trim());
        if (processedWord.length < 1) {
            continue;
        }
        const hash = getHash(processedWord) % 128;
        const mask = 1 << (hash%32);
        const partIndex = Math.floor(hash / 32);
        result[partIndex] = result[partIndex] | mask;
    }
    result.reverse();
    return result;
}

// -----------------------------------------

function assertEquals(a, b) {
    if (a !== b) {
        throw(`${a} !== ${b}`);
    }
}

console.log("Hello!");

assertEquals(223289465, djb2Hash32("Hello"));
assertEquals(3073585082, djb2Hash32("Hello!"));
assertEquals(1076131345, getHash("Привет"));

assertEquals(true, inBloom(0, 0, 0, 0b10, 1));
assertEquals(false, inBloom(0, 0, 0, 0b100, 1));

assertEquals(true, inBloom(0, 0, 0b10, 0, 33));
assertEquals(false, inBloom(0, 0, 0b100, 0, 33));

assertEquals(true, inBloom(0, 0b10, 0, 0, 65));
assertEquals(false, inBloom(0, 0b100, 0, 0, 65));

assertEquals(true, inBloom(0b10, 0, 0, 0, 97));
assertEquals(false, inBloom(0b100, 0, 0, 0, 97));

assertEquals(true, inBloom(0xffffffff|0, 0xAB, 0xCD, 0xEF, 127));
assertEquals(false, inBloom(0xffffffff|0, 0xAB, 0xCD, 0xEF, 95));
assertEquals(false, inBloom(0xffffffff|0, 0xAB, 0xCD, 0xEF, 63));
assertEquals(false, inBloom(0xffffffff|0, 0xAB, 0xCD, 0xEF, 31));

function testBloom(commaSeparatedWords, wordToFind) {
    const f = makeBloomFilter128(commaSeparatedWords);
    const rawHash = getHash(unYo(wordToFind.toLowerCase()));
    return inBloom(f[0], f[1], f[2], f[3], rawHash);
}

assertEquals(true, testBloom('собака,кошка', 'собака'));
assertEquals(true, testBloom('собака,кошка', 'кошка'));
assertEquals(false, testBloom('собака,кошка', 'птица'));
assertEquals(false, testBloom('собака,кошка', 'самолёт'));

assertEquals(true, testBloom('ёж', 'еж'));
assertEquals(true, testBloom('стрижка,причёска', 'причёска'));
assertEquals(true, testBloom('стрижка,причёска', 'прическа'));
assertEquals(false, testBloom('стрижка,причёска', 'причесон'));

assertEquals(true, testBloom('собака,собака', 'собака'));
assertEquals(true, testBloom('собака,собака,собака', 'собака'));
assertEquals(true, testBloom('кошка,кошка', 'кошка'));
assertEquals(true, testBloom('кошка,кошка,кошка', 'кошка'));

console.log("Run makeBloomFilter128('word1,word2,word3,etc')");
