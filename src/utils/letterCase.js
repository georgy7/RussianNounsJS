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

export function upperLike(str, pattern) {
    return (pattern === pattern.toUpperCase()) ? str.toUpperCase() : str;
}

export function capitalizeRu(str) {
    if (str.length === 0) {
        return "";
    }

    const ch = str.charCodeAt(0);

    if ((ch >= 0x0430) && (ch <= 0x044F)) {
        return String.fromCharCode(ch - 0x20) + str.slice(1);
    } else if ((ch >= 0x0450) && (ch <= 0x045F)) {
        return String.fromCharCode(ch - 0x50) + str.slice(1);
    }

    return str;
}

export function capitalizeAll(doIt, list) {
    return doIt ? list.map(capitalizeRu) : list;
}

