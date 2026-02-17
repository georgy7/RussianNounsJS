export function toLowerCaseRu(s) {

    // Это на самом деле быстрее, чем нативный toLowerCase, во всяком случае в Chrome,
    // поскольку нативный toLowerCase преобразует все алфавиты, а здесь только кириллица.

    let codes = new Array(s.length);

    for (let i = 0; i < s.length; i++) {
        let ch = s.charCodeAt(i);

        if ((ch >= 0x0410) && (ch <= 0x042F)) {
            ch += 0x20;
        } else if ((ch >= 0x0400) && (ch <= 0x040F)) {
            ch += 0x50;
        }

        codes[i] = ch;
    }

    // Функция apply может вызвать RangeError при очень длинных
    // массивах (лимит аргументов), но для слов — это не проблема.

    return String.fromCharCode.apply(null, codes);
}


// -------------------------------------------------

// Without ё, the Russian alphabet consists of 32 letters.
export function lcBit(lcChar) {
    const x = lcChar.charCodeAt(0) - 1072;
    return (x === 33) ? 0b100000 : ((x === (0x1F & x)) ? (1 << x) : 0);
}

export function bincludes(mask, lcChar) {
    return (mask & lcBit(lcChar)) !== 0;
}

export const vowels = 0b11101000000010000100000100100001;
export const consonants = (~vowels) & ((1 << 26) - 1);
export const consonantsExceptJ = consonants ^ (1 << 9);

function isVowel(ch) {
    return bincludes(vowels, toLowerCaseRu(ch));
}

const upperLike = (str, pattern) =>
    (pattern === pattern.toUpperCase()) ? str.toUpperCase() : str;

const vowelCount = s => s.split('').filter(isVowel).length;

export function unYo(s) {
    return s.replaceAll('ё', 'е').replaceAll('Ё', 'Е');
}


// -------------------------------------------------

export function nInit(str, n) {
    return str.substring(0, str.length - n);
}

export function nLast(str, n) {
    return str.substring(str.length - n);
}

export function init(str) {
    return nInit(str, 1);
}

export function last(str) {
    return nLast(str, 1);
}

export function lastOfNInitial(str, n) {
    const index = str.length - n - 1;
    return str.substring(index, index+1);
}

// Attention!
// It has O(n) complexity,
// where n is the number of characters in the array
export function endsWithAny(w, arr) {
    return arr.some(a => w.endsWith(a));
}

/**
 * В русском языке практически не бывает безударных букв Ё.
 * Поэтому при ударном окончании, буква Ё должна исчезать из основы слова.
 * Данная функция подготавливает несколько вариантов основы слова, в зависимости от ударения.
 *
 * @param {Array} stressedEnding Булевые значения, означающие ударное окончание
 * @param {string} stem Основа слова (может содержать ё)
 * @param {function} transform Функция постобработки получившихся строк (принимает флаг ударного окончания вторым аргументом)
 * @return {Array} Список основ, зависящих от ударения — в том порядке, в котором идут булевые значения в аргументах
 */
export function eStem(stressedEnding, stem, transform) {
    const stressList = stressedEnding.length ? stressedEnding : [false];
    return stressList.map(ending => ending ? transform(unYo(stem), ending) : transform(stem, ending));
}
