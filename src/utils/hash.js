export function calculateHash(lowerCaseUnicodeString) {
    const preparedString = lowerCaseUnicodeString.replaceAll('ё', 'е');

    // Дело в том, что когда данные так плотно упакованы, и у нас
    // некоторые буквы кодируются нулевыми битами, если, например,
    // первая буква - А, слово с этой буквой вначале и без неё
    // будет выражено одним и тем же набором бит.
    // Так что этот своего рода мигающий светодиод говорит, что что-то
    // меняется. Это один из способов немного уменьшить коллизию.
    let state = preparedString.length % 2;
    let readyBits = 1;

    // Daniel J. Bernstein's hash function
    // http://www.cse.yorku.ca/~oz/hash.html
    // https://theartincode.stanis.me/008-djb2/
    // The result is the same as if the hash were of type uint32_t.
    let hash = 5381;
    function flushBits() {
        // Multiplication instead of shifting is used in order
        // to ensure that the result is unsigned.
        hash = (hash * 33 + (state & 0xFF)) % 0x100000000;
        state = state >> 8;
        readyBits -= 8;
    }

    for (let ch of preparedString) {

        // Packing the five-bit letters.
        const chCode = (ch.charCodeAt(0) - 1072) & 0x1F;
        state |= chCode << readyBits;
        readyBits += 5;

        if (readyBits >= 8) {
            flushBits();
        }
    }

    if (readyBits > 0) {
        flushBits();
    }

    // Но теперь у коротких строк одинаковой длины с соседними
    // кодами первой буквы всё еще встречаются коллизии.
    const start = preparedString.charCodeAt(0) % 2;
    return ((0x7fffffff & hash) * 2) + start;
}
