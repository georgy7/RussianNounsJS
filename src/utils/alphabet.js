export const LOWERCASE_A = 'а'.charCodeAt(0);
export const UPPERCASE_A = 'А'.charCodeAt(0);

export const LOWERCASE_YO = 'ё'.charCodeAt(0);
export const UPPERCASE_YO = 'Ё'.charCodeAt(0);

export const UNICODE = 0x0401 === UPPERCASE_YO;

export const UPPERCASE_RANGE2_START = UNICODE ? 0x0400 : UPPERCASE_YO;
export const UPPERCASE_RANGE2_END = UNICODE ? 0x040F : UPPERCASE_YO;

export const LOWERCASE_RANGE2_START = UNICODE ? 0x0450 : LOWERCASE_YO;
export const LOWERCASE_RANGE2_END = UNICODE ? 0x045F : LOWERCASE_YO;

export const RANGE2_DIFF = LOWERCASE_RANGE2_START - UPPERCASE_RANGE2_START;

export function lcBit(lcChar) {
    const code = lcChar.charCodeAt(0);
    const offset = code - LOWERCASE_A;

    // Without ё, the Russian alphabet consists of 32 letters.
    return (code === LOWERCASE_YO) ? 0b100000 : // ё → е
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
