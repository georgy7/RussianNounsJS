// Корень — конец всех строк массива.
// В качестве ключей выступают последние буквы строк, а в качестве значений —
// объекты, ключами в которых будут уже предпоследние буквы, и так далее.
// Значение 0 вместо объекта означает начало строки.

// При этом часть информации отбрасывается на этапе построения дерева:
// если в массиве суффиксов есть строки "ый" и "итый", достаточно проверить
// две последние буквы "ый", чтобы убедиться, что слово заканчивается на одно
// из перечисленных окончаний.

export function createReversedTrie(suffixList) {
    let result = new Map();

    for (let suffix of suffixList) {
        let cursor = result;

        for (let i = suffix.length - 1; i >= 0; i--) {
            const ch = suffix.charCodeAt(i);

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

export function endsWithSuffix(word, reversedTrie) {
    let cursor = reversedTrie;

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

export function extendAllSuffixes(withString, trie) {
    let result = trie;

    for (let i = 0; i < withString.length; i++) {
        const ch = withString.charCodeAt(i);
        const earlier = result;
        result = new Map();
        result.set(ch, earlier);
    }

    return result;
}
