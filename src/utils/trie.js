// The root is the end of all strings in the array.
// Keys are the last letters of strings, and values are
// objects whose keys are the second-to-last letters, and so on.
// A value of 0 instead of an object means the start of a string.

// At the same time, some information is discarded during tree construction:
// if the suffix array contains strings "ый" and "итый", it is enough to check
// the last two letters "ый" to be sure that the word ends in one
// of the listed endings.

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
