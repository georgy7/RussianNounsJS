export function unYo(s) {
    return s.replaceAll('ё', 'е').replaceAll('Ё', 'Е');
}

export function dropLast(str, n) {
    return str.substring(0, str.length - n);
}

export function takeLast(str, n) {
    return str.substring(str.length - n);
}

export function init(str) {
    return dropLast(str, 1);
}

export function last(str) {
    return charFromEnd(str, 1);
}

export function charFromEnd(str, n) {
    return str[str.length - n] || '';
}

// Attention!
// It has O(n) complexity,
// where n is the number of characters in the array
export function endsWithAny(w, arr) {
    return arr.some(a => w.endsWith(a));
}
