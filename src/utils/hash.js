import { LOWERCASE_A } from "./alphabet.js";

/**
 * Fast, lightweight hash producing ~32-bit output.
 * Uses the DJB2 inner loop without the 5-bit packing overhead of calculateHash.
 * Suitable for strings that need a quick hash for bloom filter lookups
 * where computing calculateHash would be too expensive.
 */
export function fastHash(str) {
    let h = 5381;
    const len = str.length;
    for (let i = 0; i < len; i++) {
        h = (h * 33 + str.charCodeAt(i)) | 0;
    }
    return h >>> 0;
}

export function calculateHash(lowerCaseUnicodeString) {
    const preparedString = lowerCaseUnicodeString.replaceAll('ё', 'е');

    // When data is so densely packed and some letters are encoded as zero bits,
    // e.g., if the first letter is "А", a word starting with that letter and one
    // without it would be expressed by the same set of bits.
    // So this kind of blinking LED signals that something is changing.
    // This is one way to slightly reduce collisions.
    let state = preparedString.length % 2;
    let readyBits = 1;

    // Daniel J. Bernstein's hash function
    // http://www.cse.yorku.ca/~oz/hash.html
    // https://theartincode.stanis.me/008-djb2/
    // The result is the same as if the hash were of type uint32_t.
    let hash = 5381;
    function flushBits() {
        // Multiplication instead of shifting is used in order
        // to ensure that the result is unsigned.
        hash = (hash * 33 + (state & 0xFF)) % 0x100000000;
        state = state >> 8;
        readyBits -= 8;
    }

    for (let ch of preparedString) {

        // Packing the five-bit letters.
        const chCode = (ch.charCodeAt(0) - LOWERCASE_A) & 0x1F;
        state |= chCode << readyBits;
        readyBits += 5;

        if (readyBits >= 8) {
            flushBits();
        }
    }

    if (readyBits > 0) {
        flushBits();
    }

    // But short strings of the same length with adjacent
    // first letter codes still have collisions.
    const start = preparedString.charCodeAt(0) % 2;
    return ((0x7fffffff & hash) * 2) + start;
}
