function djb2Hash32(str) {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
        hash = (hash * 33 + str.charCodeAt(i)) % 0x100000000;
    }
    return hash;
}

function getHash(unicodeString) {
    return djb2Hash32(encodeURI(unicodeString));
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
