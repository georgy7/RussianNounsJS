export function lcBit(lcChar) {
    // Relative to "а"
    const offset = lcChar.charCodeAt(0) - 1072;

    // Without ё, the Russian alphabet consists of 32 letters.
    return (offset === 33) ? 0b100000 : // ё → е
            ((offset === (0x1F & offset)) ? (1 << offset) : 0);
}

export function bincludes(mask, lcChar) {
    return (mask & lcBit(lcChar)) !== 0;
}

export const vowels = 0b11101000000010000100000100100001;
export const consonants = (~vowels) & ((1 << 26) - 1);
export const consonantsExceptJ = consonants ^ (1 << 9);

function isVowel(lcChar) {
    return bincludes(vowels, lcChar);
}

export function vowelCount(lcString) {
    return lcString.split('').filter(isVowel).length;
}
