export function toLetterTree(endingArray) {
    // Корень — конец всех строк массива.
    // В качестве ключей выступают последние буквы строк, а в качестве значений —
    // объекты, ключами в которых будут уже предпоследние буквы, и так далее.
    // Значение 0 вместо объекта означает начало строки.

    // При этом часть информации отбрасывается:
    // если в исходном массиве есть строки "ый" и "итый", достаточно проверить
    // две последние буквы, чтобы убедиться, что слово заканчивается на одно
    // из перечисленных окончаний.

    // Деревья используются с функцией endsWithLeaf.

    let result = new Map();

    for (let ending of endingArray) {
        let cursor = result;

        for (let i = ending.length - 1; i >= 0; i--) {
            const ch = ending.charCodeAt(i);

            if (i > 0) {
                const previous = cursor.get(ch);

                if (previous === 0) {
                    break;
                } else if (previous === undefined) {
                    cursor.set(ch, new Map());
                }

                cursor = cursor.get(ch);
            } else {
                cursor.set(ch, 0);
            }
        }
    }

    return result;
}

export function endsWithLeaf(word, tree) {
    let cursor = tree;

    for (let i = word.length - 1; i >= 0; i--) {
        const ch = word.charCodeAt(i);

        if (!cursor.has(ch)) {
            return false;
        } else {
            const value = cursor.get(ch);
            if (0 === value) {
                return true;
            } else {
                cursor = value;
            }
        }

    }
}

