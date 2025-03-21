function djb2Hash32(byteArray) {
    let hash = 5381;
    for (let i = 0; i < byteArray.length; i++) {
        hash = (hash * 33 + byteArray[i]) % 0x100000000;
    }
    return hash;
}

function getHash(unicodeString) {
    function toByte(ch) {
        const chCode = ch.charCodeAt(0);
        return (chCode <= 127) ? (0x80 + chCode) : (0x7F & (chCode-1072));
    }

    return djb2Hash32(unicodeString.toLowerCase().replaceAll('ё', 'е').split('').map(toByte));
}

// -----------------------------------------

const unYo = s => s.replace('ё', 'е').replace('Ё', 'Е');

function makeHashes(commaSeparatedWords) {
    let result = [];
    const words = commaSeparatedWords.split(',');
    for (let word of words) {
        const processedWord = unYo(word.toLowerCase().trim());
        if (processedWord.length < 1) {
            continue;
        }

        result.push(getHash(processedWord));
    }

    return result;
}

function makeFilter(commaSeparatedWords) {
    const hashes = makeHashes(commaSeparatedWords);
    hashes.sort((a, b) => a-b);

    const delta = [hashes[0]];
    for (var i = 1; i < hashes.length; i++) {
        delta.push(hashes[i] - hashes[i-1])
    }

    return delta.join(', ');
}

// -----------------------------------------

function assertEquals(a, b) {
    if (a !== b) {
        throw(`${a} !== ${b}`);
    }
}

console.log("Hello!");

assertEquals(223289465, djb2Hash32("Hello".split('').map(x => x.charCodeAt(0))));
assertEquals(3073585082, djb2Hash32("Hello!".split('').map(x => x.charCodeAt(0))));

console.log("Run makeFilter('word1,word2,word3,etc')");
