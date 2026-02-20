import { Gender } from "../Gender.js";
import { createReversedTrie, endsWithSuffix } from "../utils/trie.js";
import { BloomFilter } from "../utils/bloom.js";
import { calculateHash } from "../utils/hash.js";
import { bincludes, lcBit, vowels, consonantsExceptJ } from "../utils/letters.js";
import { init, last, nInit, nLast, lastOfNInitial, endsWithAny, upperLike } from "../utils/strings.js";

export const ogoEndings = createReversedTrie([
    'ое',
    'нький', 'ский', 'ской',
    'лстой', 'отой', 'утой', 'евой', 'овой', 'живой']);
export const ogoEndings2 = createReversedTrie([
    'ее', 'ое',
    'нький', 'ский', 'ской',
    'лстой', 'отой', 'утой']);
export const ogoEndings3 = createReversedTrie([
    'евой', 'овой', 'отой', 'живой']);

export const egoEndings = createReversedTrie(['шний', 'жний', 'щий', 'ший', 'жий', 'чий']);

export const egoSoftM = [
    'божий', 'ажий', 'яжий', 'ужий', 'южий',
    'бульдожий', 'кабарожий', 'медвежий', 'носорожий', 'миножий'
];

export const egoSoftMTree = createReversedTrie(egoSoftM);

export const egoSoftPlural = createReversedTrie(egoSoftM.map(x => nInit(x, 2) + 'ьи'));

// Stemmer data
const mobileVowelA = new Set(['бубен', 'бугор',
    'ветер', 'вошь', 'вымысел', 'горшок',
    'деготь', 'дёготь',
    'дятел', 'домысел', 'замысел',
    'кашель', 'коготь',
    'лапоть', 'лоб', 'локоть', 'ломоть', 'молебен', 'мох', 'ноготь', 'овен',
    'пепел', 'пес', 'пёс', 'петушок', 'помысел', 'порошок',
    'промысел', 'псалом', 'пушок', 'ров', 'рожь', 'рот',
    'сон', 'стебель', 'стишок',
    'угол', 'умысел', 'хребет', 'церковь', 'шов',
    'ковер', 'овес', 'костер'
].map(calculateHash));

const mobileVowelABloom = new BloomFilter();
mobileVowelA.forEach(hash => mobileVowelABloom.addInteger(hash));

const mobileVowelB = createReversedTrie([
    'овёс', 'ковёр', 'костёр',
    'шатер', 'шатёр', 'козел', 'козёл', 'котел', 'котёл',
    'орел', 'орёл', 'осел', 'осёл',
    'узел', 'уголь', 'чок', 'ешок', 'хол'
]);

export function getNounStem0(word, lcWord) {
    const lcLastChar = last(lcWord);

    if (bincludes(vowels | 512, lcLastChar)) { // vowels + й
        if (bincludes(vowels, lastOfNInitial(lcWord, 1))) {
            const head = nInit(word, 2);
            if (endsWithSuffix(lcWord, egoSoftMTree)) {
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
    } else if (lcWord.endsWith('ёк') && bincludes(vowels, lastOfNInitial(lcWord, 2))) {
        return nInit(word, 2) + 'йк';
    }
}

const en2a2b = [
    'ясень', 'бюллетень', 'олень', 'тюлень',
    'гордень', 'пельмень',
    'ячмень'
];

export function getStemSoftSign(lemma, word, lcWord) {
    if (mobileVowelA.has(lemma._hash) || endsWithSuffix(lcWord, mobileVowelB)) {
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
            endsWithSuffix(lcWord, mobileVowelB) &&
            !(['новосел', 'новосёл'].includes(lcWord))
        ) ||
        (
            ((0b1001110011110000000110 & lcLastBit) !== 0) &&
            (
                (mobileVowelABloom.hasInteger(lemma._hash) && mobileVowelA.has(lemma._hash)) ||
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
            .every(l => bincludes(consonantsExceptJ, l))
        || lemma.isAName()
    ) {
        return head;
    } else if (nLast(lcHead, 2) === 'ле') {
        const beforeLe = lastOfNInitial(lcHead, 2);
        if (bincludes(vowels, beforeLe) || ('л' === beforeLe)) {
            return init(head) + 'ь';
        } else {
            return head;
        }
    } else if (bincludes(vowels, last(lcHead)) && (last(lcHead) !== 'и')) {
        if (bincludes(vowels, last(init(lcHead)))) {
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

const ok1 = createReversedTrie([
    'лапоток', 'желток', 'нишок', 'ришок', 'ишек'
]);
const ok2 = [
    'поток', 'приток', 'переток', 'проток', 'биоток', 'электроток',
    'восток', 'водосток', 'водоток', 'воток',
    'знаток'
];
const okExceptions = [
    'инок', 'исток',
    'обморок', 'порок', 'пророк', 'сток', 'урок'
];

export function okWord(lcWord) {
    return (endsWithAny(lcWord, ['чек', 'шек']) && (lcWord.length >= 6))
        || endsWithSuffix(lcWord, ok1) || (lcWord.endsWith('ок') && (
            !lcWord.endsWith('шок') && !okExceptions.includes(lcWord)
            && !endsWithAny(lcWord, ok2)
            && !bincludes(vowels, lastOfNInitial(lcWord, 2))
            && (bincludes(vowels, lastOfNInitial(lcWord, 3)) || endsWithAny(nInit(lcWord, 2), ['ст', 'рт']))
            && lcWord.length >= 4
        ));
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
