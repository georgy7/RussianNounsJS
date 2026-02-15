export function getNounStem0(word, lcWord) {
    const lcLastChar = last(lcWord);

    if (bincludes(vowels | 512, lcLastChar)) { // vowels + й
        if (bincludes(vowels, lastOfNInitial(lcWord, 1))) {
            const head = nInit(word, 2);
            if (endsWithLeaf(lcWord, egoSoftMTree)) {
                return head + upperLike('ь', head);
            }
            return head;
        } else if ('й' !== lcLastChar) {
            return init(word);
        }
    }

    return word;
}

export function getStemDefault(word, lcWord, lcLastChar) {
    const lcLastInit = lastOfNInitial(lcWord, 1);

    if (('ь' === lcLastInit) ||
            ('о' === lcLastChar && bincludes(0b1001100011100000000100, lcLastInit))) { // влмнстх
        return init(word);
    }

    return getNounStem0(word, lcWord);
}

export function getStemK(word, lcWord, stressedEnging) {
    if ((word.length >= 4) && 
        (endsWithAny(lcWord, ['рёк', 'нёк', 'лёк']) && stressedEnging !== false)
    ) {
        return nInit(word, 2) + 'ьк';
    } else if (lcWord.endsWith('ёк') && isVowel(lastOfNInitial(word, 2))) {
        return nInit(word, 2) + 'йк';
    }
}

export function getStemSoftSign(lemma, word, lcWord) {
    if (mobileVowelA.has(lemma._hash) || endsWithLeaf(lcWord, mobileVowelB)) {
        return nInit(word, 3) + lastOfNInitial(word, 1);
    } else if (lcWord.endsWith('ень') &&
            (lemma.getGender() === Gender.MASCULINE) &&
            !endsWithAny(lcWord, en2a2b)) {
        return nInit(word, 3) + 'н';
    } else {
        return init(word);
    }
}

export function hasMobileVowel(lemma, lcWord, lcLastBit) {
    // Case 1: кл рс
    // Case 2: бв клмн рст х
    return (
            ((0b0000110000110000000000 & lcLastBit) !== 0) &&
            endsWithLeaf(lcWord, mobileVowelB) &&
            !(['новосел', 'новосёл'].includes(lcWord))
        ) ||
        (
            ((0b1001110011110000000110 & lcLastBit) !== 0) &&
            (
                (inBloom(mobileVowelABloom, to11BitHash(lemma._hash)) && mobileVowelA.has(lemma._hash)) ||
                (lemma.isAnimate() && lcWord.endsWith('посол'))
            )
        );
}

export function getNounStem(lemma, lcWord, stressedEnging) {
    const word = lemma.text();
    const lcLastChar = last(lcWord);
    const lcLastBit = lcBit(lcLastChar);

    let result;

    if ((vowels | 512 | 1024 | 16 | 8192 | 4 | (1 << 28)) & lcLastBit) {    // vowels + йкднвь
        if ((vowels | 512) & lcLastBit) {   // vowels + й
            result = getStemDefault(word, lcWord, lcLastChar);
        } else if ('к' === lcLastChar) {
            result = getStemK(word, lcWord, stressedEnging);
        } else if ('ь' === lcLastChar) {
            result = getStemSoftSign(lemma, word, lcWord);
        } else if (['лёд', 'лед', 'лён'].includes(lcWord) ||
                (('лев' === lcWord) && lemma.isAnimate())) {
            result = nInit(word, 2) + upperLike('ь', lastOfNInitial(word, 1)) + last(word);
        }
    }

    if (!result) {
        if (hasMobileVowel(lemma, lcWord, lcLastBit)) {
            result = nInit(word, 2) + last(word);
        } else {
            result = word;
        }
    }

    return result;
}

export function tsStem(word, lemma) {
    const head = init(word);
    const lcHead = init(lemma.lower());
    if ('а' === last(lcHead)) {
        return head;
    } else if (endsWithAny(lcHead, ['зне', 'жне', 'гре', 'спе', 'мудре'])
        || nLast(init(lcHead), 3).split('')
            .every(l => isConsonantNotJ(l))
        || lemma.isAName()
    ) {
        return head;
    } else if (nLast(lcHead, 2) === 'ле') {
        const beforeLe = lastOfNInitial(lcHead, 2);
        if (isVowel(beforeLe) || ('л' === beforeLe)) {
            return init(head) + 'ь';
        } else {
            return head;
        }
    } else if (isVowel(last(lcHead)) && (last(lcHead) !== 'и')) {
        if (isVowel(last(init(lcHead)))) {
            return nInit(word, 2) + 'й';
        } else if (endsWithAny(lemma.lower(), ['месяц'])) {
            return head;
        } else {
            return nInit(word, 2);
        }
    } else {
        return head;
    }
}

export function okWord(w) {
    return (endsWithAny(w, ['чек', 'шек']) && (w.length >= 6))
        || endsWithLeaf(w, ok1) || (w.endsWith('ок') && (
            !w.endsWith('шок') && !okExceptions.includes(w)
            && !endsWithAny(w, ok2)
            && !isVowel(lastOfNInitial(w, 2))
            && (isVowel(lastOfNInitial(w, 3)) || endsWithAny(nInit(w, 2), ['ст', 'рт']))
            && w.length >= 4
        ));
}

