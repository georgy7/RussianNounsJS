import {
    UNICODE,
    LOWERCASE_A, UPPERCASE_A,
    UPPERCASE_RANGE2_START,
    UPPERCASE_RANGE2_END,
    LOWERCASE_RANGE2_START,
    LOWERCASE_RANGE2_END,
    RANGE2_DIFF
} from "./alphabet.js";

export function toLowerCaseRu(s) {
    // Fast path: if no uppercase Cyrillic chars, return the string as-is.
    // This is 5-6x faster for already-lowercase strings (the common case),
    // and neutral for strings that need conversion.
    for (let i = 0; i < s.length; i++) {
        const ch = s.charCodeAt(i);
        if ((ch >= UPPERCASE_A && ch <= (UPPERCASE_A + 0x1F)) || (ch >= UPPERCASE_RANGE2_START && ch <= UPPERCASE_RANGE2_END)) {
            // Found uppercase Cyrillic — fall through to full conversion
            break;
        }
        if (i === s.length - 1) {
            return s; // All lowercase or non-Cyrillic
        }
    }

    // Full conversion: only touches Cyrillic, faster than native toLowerCase
    let codes = new Array(s.length);

    for (let i = 0; i < s.length; i++) {
        let ch = s.charCodeAt(i);

        if ((ch >= UPPERCASE_A) && (ch <= (UPPERCASE_A + 0x1F))) {
            ch += 0x20;
        } else if ((ch >= UPPERCASE_RANGE2_START) && (ch <= UPPERCASE_RANGE2_END)) {
            ch += RANGE2_DIFF;
        }

        codes[i] = ch;
    }

    return String.fromCharCode.apply(null, codes);
}

export function toLowerCasePortable(s) {
    if (UNICODE) {
        return s.toLowerCase();
    }

    let codes = new Array(s.length);

    for (let i = 0; i < s.length; i++) {
        let ch = s.charCodeAt(i);

        if (((ch >= UPPERCASE_A) && (ch <= (UPPERCASE_A + 0x1F))) || ((ch >= 0x41) && (ch <= 0x5A))) {
            ch += 0x20;
        } else if ((ch >= UPPERCASE_RANGE2_START) && (ch <= UPPERCASE_RANGE2_END)) {
            ch += RANGE2_DIFF;
        }

        codes[i] = ch;
    }

    return String.fromCharCode.apply(null, codes);
}

export function toUpperCaseRu(s) {
    let codes = new Array(s.length);

    for (let i = 0; i < s.length; i++) {
        let ch = s.charCodeAt(i);

        if ((ch >= LOWERCASE_A) && (ch <= (LOWERCASE_A + 0x1F))) {
            ch -= 0x20;
        } else if ((ch >= LOWERCASE_RANGE2_START) && (ch <= LOWERCASE_RANGE2_END)) {
            ch -= RANGE2_DIFF;
        }

        codes[i] = ch;
    }

    return String.fromCharCode.apply(null, codes);
}

export function upperLike(aCyrillicString, pattern) {
    return (pattern === toLowerCasePortable(pattern))
        ? aCyrillicString
        : toUpperCaseRu(aCyrillicString);
}

export function capitalizeRu(str) {
    if (str.length === 0) {
        return "";
    }

    const ch = str.charCodeAt(0);

    if ((ch >= LOWERCASE_A) && (ch <= (LOWERCASE_A + 0x1F))) {
        return String.fromCharCode(ch - 0x20) + str.slice(1);
    } else if ((ch >= LOWERCASE_RANGE2_START) && (ch <= LOWERCASE_RANGE2_END)) {
        return String.fromCharCode(ch - RANGE2_DIFF) + str.slice(1);
    }

    return str;
}

export function capitalizeAll(doIt, list) {
    return doIt ? list.map(capitalizeRu) : list;
}

