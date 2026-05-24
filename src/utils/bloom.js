export class BloomFilter {
    constructor() {
        this._filter = new Uint8ClampedArray(512); // 4096 bits
    }

    addInteger(x) {
        this._filter[bytePos(_h1(x))] |= bitMask(_h1(x));
        this._filter[bytePos(_h2(x))] |= bitMask(_h2(x));
    }

    hasInteger(x) {
        return !!(this._filter[bytePos(_h1(x))] & bitMask(_h1(x)))
            && !!(this._filter[bytePos(_h2(x))] & bitMask(_h2(x)));
    }

    clone() {
        const result = new BloomFilter();
        result._filter = Uint8ClampedArray.from(this._filter);
        return result;
    }
}

/**
 * Two independent 12-bit hash derivations from a 32-bit DJB2 hash.
 * _h1 uses the lower 12 bits; _h2 folds the upper 20 bits.
 * Together they cover all 32 bits of the input, maximising independence.
 */
function _h1(h) {
    return h & 0x0FFF;
}
function _h2(h) {
    return ((h >>> 12) ^ (h >>> 24)) & 0x0FFF;
}

function bytePos(index) {
    return index >>> 3;
}

function bitMask(index) {
    return 1 << (7 - (index & 7));
}
