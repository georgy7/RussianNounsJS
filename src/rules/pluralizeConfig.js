/**
 * Configuration data for pluralize.js.
 *
 * This module contains all hard-coded word lists, suffix patterns,
 * and trie data that were previously embedded in the pluralize logic.
 * The goal is to separate data from logic while preserving the
 * priority-based matching order.
 *
 * Bitmask note: bitmasks use the order of Russian alphabet letters backwards (without Ё):
 * 1=A, 2=B, 4=V, 8=G, ... etc. This is a performance optimization for fast suffix matching.
 */

import { createReversedTrie, endsWithSuffix } from '../utils/trie.js';
import { endsWithAny } from '../utils/strings.js';

// ============================================================
// Data: Words that take soft stem + "я" in nominative plural
// for declension 1, masculine gender.
// ============================================================
export const YA_D1_SOFT_STEM = [
    'зять', 'деверь',
    'друг',
    'брат', 'собрат',
    'стул',
    'брус',
    'обод', 'полоз',
    'струп',
    'подмастерье',
    'якорь',

    'перо',
    'шило'
];

// ============================================================
// Data: Masculine words that end in -а/-я in plural.
// These are checked by exact match.
// ============================================================
export const A_YA_WORDS = new Set([
    'берег', 'бок', 'борт',
    'век', 'вес',
    'веер',
    'вексель',
    'вечер',
    'глаз', 'голос', 'город',
    'доктор', 'дом', 'детдом',
    'егерь',
    'жемчуг',
    'катер', 'колокол', 'концлагерь', 'корм', 'короб', 'кузов', 'купол',
    'лес', 'луг', 'мастер', 'номер',
    'пояс', 'провод', 'рог',
    'сахар', 'снег', 'сорт', 'стог', 'счет', 'счёт',
    'спецсчет', 'спецсчёт', 'субсчет', 'субсчёт',
    'терем',
    'том',
    'холод', 'цвет', 'череп'
]);

// ============================================================
// Data: Suffix-based matching for masculine -а/-я words.
// Words ending with these suffixes are treated as -а/-я words.
// ============================================================
export const A_YA_WORDS2_SUFFIXES = createReversedTrie([
    'округ', 'остров', 'отпуск',
    'паспорт', 'парус', 'поезд', 'повар', 'погреб',
    'рукав',
    'цех',
    'юнкер'
]);

// ============================================================
// Data: Words where -а/-я is MORE common, but -и/-ы is also valid.
// These get both forms.
// ============================================================
export const A_YA_WORDS3 = new Set([
    'адрес',
    'договор',
    'буфер',
    'ворох',
    'директор',
    'инспектор', 'инструктор',
    'корпус',
    'крейсер',
    'орден', 'ордер', 'прожектор', 'пропуск', 'род',
    'свитер', 'сервер',
    'тенор', 'тон', 'трактор',
    'тормоз',
    'ветер',
    'верх',
    'китель',
    'мех',
    'хлеб',
    'юнкер',
    'ястреб'
]);

// ============================================================
// Data: Words where -и/-ы is MORE common, but -а/-я is also valid.
// -и/-ы is checked first.
// ============================================================
export const A_YA_WORDS4 = new Set([
    'бункер',
    'вымпел',
    'год',
    'образ',
    'омут',
    'токарь', 'тополь',
    'шторм', 'штуцер'
]);

// ============================================================
// Data: Special masculine words with irregular plural stems.
// ============================================================
export const YA2_SOFT_STEM_WORDS = [
    'крюк',
    'лист',
    'лоскут',
    'повод',
    'прут',
    'сук',
    'учитель',
    'флигель',
    'штабель'
];

export const YA3_SOFT_STEM_WORDS = [
    'клин', 'колос', 'ком', 'край', 'соболь'
];

// ============================================================
// Data: Specific words with unique plural handling.
// ============================================================
export const SYN_CHILDREN = ['сын', 'человек'];

export const YA2_YA3_WORDS = {
    YA2: ['соболь'],
    YA3: ['клин', 'колос', 'ком', 'край']
};

// ============================================================
// Data: Words ending in -енок/-ёнок with special plural forms.
// ============================================================
export const YONOK_WORDS = [
    'дерево', 'звено', 'крыло'
];

// ============================================================
// Data: Neuter words ending in -ье/-ьё that take -ья/-ия.
// Soft sign only words (не takes -ия).
// ============================================================
export const SOFT_SIGN_ONLY_NEUTER = [
    'безделье', 'варенье', 'воскресенье',
    'жалованье',
    'запястье', 'застолье', 'затишье', 'здоровье', 'зелье',
    'изголовье', 'новоселье', 'одночасье',
    'печенье', 'платье', 'побережье', 'поголовье', 'подворье',
    'подземелье', 'подполье', 'поместье', 'предплечье', 'раздумье',
    'сиденье',
    'средневековье', 'увечье', 'угодье', 'устье'
];

// ============================================================
// Data: Words with -ьи plural form.
// ============================================================
export const YI_WORDS = [
    'воробей', 'муравей', 'ручей', 'соловей', 'улей',
    'жеребей',
    'ирей',
    'репей', 'чирей'
];

// ============================================================
// Data: Words ending in -ок/-ёк with special -ка plural.
// ============================================================
export const OK_WORDS_PREFIXES = [
    'лапоток', 'желток'
];

export const OK_WORDS_SUFFIXES = [
    'нишок', 'ришок', 'ишек'
];

export const OK_WORDS_EXACT = [
    'поток', 'приток', 'переток', 'проток', 'биоток', 'электроток',
    'восток', 'водосток', 'водоток', 'воток',
    'знаток'
];

export const OK_WORDS_EXCEPTIONS = [
    'инок', 'исток',
    'обморок', 'порок', 'пророк', 'сток', 'урок'
];

// ============================================================
// Data: Helper functions for the configuration.
// ============================================================

/**
 * Check if a word is a "сын/человек" type word.
 * @param {string} lcWord - lowercase word
 * @param {Object} lemma - Lemma object
 * @returns {string|null} - 'сын' or 'человек' if matched, null otherwise
 */
export function isSynChelovek(lcWord, lemma) {
    if (lcWord === 'сын') return 'сын';
    if (lcWord === 'человек') return 'человек';
    return null;
}

/**
 * Check if a word matches the "ya2" pattern (soft stem + я).
 * @param {string} lcWord - lowercase word
 * @param {Object} lemma - Lemma object
 * @returns {boolean}
 */
export function isYa2Pattern(lcWord, lemma) {
    if (YA2_SOFT_STEM_WORDS.includes(lcWord)) return true;
    if (lcWord === 'соболь' && lemma.isAnimate()) return true;
    return false;
}

/**
 * Check if a word matches the "ya3" pattern (soft stem only).
 * @param {string} lcWord - lowercase word
 * @returns {boolean}
 */
export function isYa3Pattern(lcWord) {
    return YA3_SOFT_STEM_WORDS.includes(lcWord);
}

/**
 * Check if a word is in the aYaWords family (any of the 4 sets).
 * @param {string} lcWord - lowercase word
 * @returns {number} - 0 if not in any aYaWords set, 1 if aYaWords, 3 if aYaWords3, 4 if aYaWords4
 */
export function getAYaWordsCategory(lcWord) {
    if (A_YA_WORDS.has(lcWord)) return 1;
    if (A_YA_WORDS3.has(lcWord)) return 3;
    if (A_YA_WORDS4.has(lcWord)) return 4;
    return 0;
}

/**
 * Check if a word matches aYaWords2 suffix pattern.
 * @param {string} lcWord - lowercase word
 * @returns {boolean}
 */
export function matchesAYaWords2(lcWord) {
    return endsWithSuffix(lcWord, A_YA_WORDS2_SUFFIXES);
}

/**
 * Check if a word is in the yonok (ёнок/енок) family.
 * @param {string} lcWord - lowercase word
 * @param {Object} lemma - Lemma object
 * @returns {string|null} - 'ёнок', 'енок', 'ёночек', 'онок' or null
 */
export function getYonokType(lcWord, lemma) {
    if (lcWord.endsWith('ёнок') && lemma.isAnimate()) return 'ёнок';
    if (lcWord.endsWith('енок') && lemma.isAnimate()) return 'енок';
    if (lcWord.endsWith('ёночек') && lemma.isAnimate()) return 'ёночек';
    if (lcWord.endsWith('онок') && endsWithAny(lcWord, ['ж', 'ш', 'ч']) && lemma.isAnimate()) return 'онок';
    return null;
}

/**
 * Check if a word ends in -енок/-ёнок that takes -ята.
 * @param {string} lcWord - lowercase word
 * @param {Object} lemma - Lemma object
 * @returns {boolean}
 */
export function isAnimateYonok(lcWord, lemma) {
    return (lcWord.endsWith('ёнок') || lcWord.endsWith('енок')) && lemma.isAnimate();
}

/**
 * Check if a word ends in -онок with hard sign constraint.
 * @param {string} lcWord - lowercase word
 * @param {Object} lemma - Lemma object
 * @returns {boolean}
 */
export function isAnimateOnok(lcWord, lemma) {
    return lcWord.endsWith('онок') &&
        endsWithAny(lcWord, ['ж', 'ш', 'ч']) &&
        lemma.isAnimate();
}

/**
 * Check if a word is in the YI_WORDS list.
 * @param {string} lcWord - lowercase word
 * @returns {boolean}
 */
export function isYiWord(lcWord) {
    return YI_WORDS.includes(lcWord);
}

/**
 * Check if a word is a "barin" type word.
 * @param {string} lcWord - lowercase word
 * @returns {boolean}
 */
export function isBarin(lcWord) {
    return lcWord === 'барин';
}

/**
 * Check if a word is a "boyar" type word.
 * @param {string} lcWord - lowercase word
 * @returns {boolean}
 */
export function isBoyar(lcWord) {
    return lcWord === 'боярин';
}

/**
 * Check if a word is a "tset" type word (цыган).
 * @param {string} lcWord - lowercase word
 * @returns {boolean}
 */
export function isTset(lcWord) {
    return lcWord === 'цыган';
}

/**
 * Check if a word is a "shchenok" type word.
 * @param {string} lcWord - lowercase word
 * @returns {boolean}
 */
export function isShchenok(lcWord) {
    return lcWord === 'щенок';
}

/**
 * Check if a word is a "rebenok" type word.
 * @param {string} lcWord - lowercase word
 * @returns {boolean}
 */
export function isRebenok(lcWord) {
    if (lcWord.endsWith('ребёнок') || lcWord.endsWith('ребенок')) {
        if (!(lcWord.endsWith('жеребёнок') || lcWord.endsWith('жеребенок'))) {
            if (!(lcWord.endsWith('ястребёнок') || lcWord.endsWith('ястребенок'))) {
                return true;
            }
        }
    }
    return false;
}

/**
 * Check if a word is a "zarja" type word.
 * @param {string} lcWord - lowercase word
 * @returns {boolean}
 */
export function isZarja(lcWord) {
    return lcWord === 'заря';
}

/**
 * Check if a word ends in -ая (feminine adjective-like).
 * @param {string} lcWord - lowercase word
 * @returns {boolean}
 */
export function isAyaWord(lcWord) {
    return lcWord.endsWith('ая') && !lcWord.endsWith('свая');
}

/**
 * Check if a word ends in -ко/-чо (neuter diminutive).
 * @param {string} lcWord - lowercase word
 * @returns {boolean}
 */
export function isKoChoWord(lcWord) {
    return endsWithAny(lcWord, ['ко', 'чо']) &&
        !endsWithAny(lcWord, ['войско', 'облако']);
}

/**
 * Check if a word ends in -имое.
 * @param {string} lcWord - lowercase word
 * @returns {boolean}
 */
export function isImoyeWord(lcWord) {
    return lcWord.endsWith('имое');
}

/**
 * Check if a word ends in -ее.
 * @param {string} lcWord - lowercase word
 * @returns {boolean}
 */
export function isEeeWord(lcWord) {
    return lcWord.endsWith('ее');
}

/**
 * Check if a word ends in -ое with hard sign constraint.
 * @param {string} lcStem - lowercase stem
 * @returns {boolean}
 */
export function isOieWithHardStem(lcStem) {
    return endsWithAny(lcStem, ['г', 'к', 'ж', 'ш', 'х']);
}

/**
 * Check if a word ends in -ие/-иё.
 * @param {string} lcWord - lowercase word
 * @returns {boolean}
 */
export function isIieWord(lcWord) {
    return endsWithAny(lcWord, ['ие', 'иё']);
}

/**
 * Check if a word ends in -ье/-ьё.
 * @param {string} lcWord - lowercase word
 * @returns {boolean}
 */
export function isVyeWord(lcWord) {
    return endsWithAny(lcWord, ['ье', 'ьё']);
}

/**
 * Check if a word is a soft sign only neuter word.
 * @param {string} lcWord - lowercase word
 * @returns {boolean}
 */
export function isSoftSignOnlyNeuter(lcWord) {
    return SOFT_SIGN_ONLY_NEUTER.includes(lcWord);
}

/**
 * Check if a word ends in -ле/-ре.
 * @param {string} lcWord - lowercase word
 * @returns {boolean}
 */
export function isLeReWord(lcWord) {
    return endsWithAny(lcWord, ['ле', 'ре']);
}

/**
 * Check if a word is a transport судно.
 * @param {string} lcWord - lowercase word
 * @param {Object} lemma - Lemma object
 * @returns {boolean}
 */
export function isTransportSudno(lcWord, lemma) {
    return lcWord.endsWith('судно') && lemma.isATransport();
}

/**
 * Check if a word ends in -дерево/-звено/-крыло.
 * @param {string} lcWord - lowercase word
 * @returns {boolean}
 */
export function isYonokFamily(lcWord) {
    return endsWithAny(lcWord, YONOK_WORDS);
}

/**
 * Check if a word is a "shchupaltsye" word.
 * @param {string} lcWord - lowercase word
 * @returns {boolean}
 */
export function isShchupaltsye(lcWord) {
    return lcWord.endsWith('щупальце');
}

/**
 * Check if a word is a "zarya" type word.
 * @param {string} lcWord - lowercase word
 * @returns {boolean}
 */
export function isZarya(lcWord) {
    return lcWord === 'заря';
}
