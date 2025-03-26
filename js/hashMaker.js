function djb2Hash32(byteArray) {
    let hash = 5381;
    for (let i = 0; i < byteArray.length; i++) {
        hash = (hash * 33 + byteArray[i]) % 0x100000000;
    }
    return hash;
}

function getHash(unicodeString) {
    // У нас в зашитом в скрипт словаре ударений довольно много коротких
    // строк (от трёх до шести букв). Если представлять эти строки очень компактно,
    // хэши считаются без многократных переполнений, не превращаются в белый шум
    // и намного лучше жмутся.

    function toBits(ch) {
        const chCode = (ch.charCodeAt(0) - 1072) & 0x1F;
        const bits = chCode.toString(2);
        return '0'.repeat(5 - bits.length) + bits;
    }

    // Биты я наполняю справа налево, потому что так числа растут медленнее.
    // Допустим, для строки 'яяяя', если заполнять справа налево,
    // получится ['00001111', '11111111', '11111111'], т.е. [15, 255, 255].
    // Если бы я наполнял слева направо, получилось бы
    // ['11111111', '11111111', '11110000'], т.е. [255, 255, 240].
    // Так что, даже вне зависимости от порядка дальнейшей обработки байтов,
    // заполнение бит справа налево даёт меньшую хэш-сумму
    // и её более компактную запись.

    const preparedString = unicodeString.toLowerCase().replaceAll('ё', 'е');
    let allBits = preparedString.split('').toReversed().map(toBits).join('');

    if (allBits.length % 8) {
        allBits = '0'.repeat(8 - allBits.length % 8) + allBits;
    }

    const byteArray = [];
    for (var i = 0; i < allBits.length; i += 8) {
        byteArray.push(parseInt(allBits.substring(i, i+8), 2));
    }

    return djb2Hash32(byteArray.toReversed());
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
