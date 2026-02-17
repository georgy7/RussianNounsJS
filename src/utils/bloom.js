export class BloomFilter {
    constructor() {
        this._filter = new Uint8ClampedArray(256);
    }

    addInteger(x) {
        this.addRaw(to11Bit(x));
    }

    hasInteger(x) {
        return this.hasRaw(to11Bit(x));
    }

    addRaw(x) {
        const index = x & 0x7ff;
        const byteIndex = index >>> 3;
        this._filter[byteIndex] = this._filter[byteIndex] | (1 << (7 - (index % 8)));
    }

    hasRaw(x) {
        const index = x & 0x7ff;
        return !!((this._filter[index >>> 3] >>> (7 - (index % 8))) & 1);
    }

    clone() {
        return cloneFilter(this._filter);
    }
}

function cloneFilter(filter) {
    const result = new BloomFilter();
    result._filter = Uint8ClampedArray.from(filter);
    return result;
}

function to11Bit(intValue) {
    return ((intValue >>> 22) & 0x7ff) ^
            ((intValue >>> 11) & 0x7ff) ^
            (intValue & 0x7ff);
}

export function toFakeHash(lcString) {
    const prepared = lcString.padStart(3, 'а');
    return ((prepared.charCodeAt(0) & 0x7) << 8) |
            ((prepared.charCodeAt(1) & 0xF) << 4) |
            (prepared.charCodeAt(2) & 0xF);
}
