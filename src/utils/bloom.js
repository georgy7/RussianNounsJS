export function to11BitHash(hash) {
    return ((hash >>> 22) & 0x7ff) ^
            ((hash >>> 11) & 0x7ff) ^
            (hash & 0x7ff);
}

export function to11BitFakeHash(lcString) {
    const prepared = lcString.padStart(3, 'а');
    return ((prepared.charCodeAt(0) & 0x7) << 8) |
            ((prepared.charCodeAt(1) & 0xF) << 4) |
            (prepared.charCodeAt(2) & 0xF);
}

/**
 * @param {Uint8ClampedArray} filter - 256 bytes
 * @param {number} index - Eleven bits
 * @returns {boolean}
 */
export function inBloom(filter, index) {
    return !!((filter[index >>> 3] >>> (7 - (index % 8))) & 1);
}

export function bloomAdd(filter, index) {
    const byteIndex = index >>> 3;
    filter[byteIndex] = filter[byteIndex] | (1 << (7 - (index % 8)));
}

