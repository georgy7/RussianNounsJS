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



export function upperLike(str, pattern) {
    return (pattern === pattern.toUpperCase()) ? str.toUpperCase() : str;
}

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
