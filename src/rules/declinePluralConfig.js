/**
 * Configuration data for declinePlural.js.
 *
 * This module contains all hard-coded word lists, suffix patterns,
 * and trie data for plural declension. Separated from logic to
 * improve maintainability while preserving O(1) lookup speed.
 *
 * Bitmask note: bitmasks use the order of Russian alphabet letters backwards (without Ё).
 * This is a performance optimization for fast suffix matching.
 */

import { createReversedTrie, endsWithSuffix } from '../utils/trie.js';
import { BloomFilter, toFakeHash } from '../utils/bloom.js';
import { endsWithAny } from '../utils/strings.js';

// ============================================================
// Data: Soft ending trie for plural declension.
// Words ending with these suffixes get special treatment.
// ============================================================
export const SOFT_ENDINGS_TRIE = createReversedTrie([
    'ли', 'си', 'би', 'ви', 'ди', 'ти', 'пи', 'ри', 'ни', 'фи', 'зи',
    'ьи', 'ья', 'ия', 'ря', 'ля', 'ая',
    'аи', 'ои', 'уи', 'эи', 'ыи', 'яи', 'ёи', 'юи', 'еи', 'ии'
]);

// ============================================================
// Data: Words ending in -и that take -ей in genitive plural.
// These are checked by exact match.
// ============================================================
export const EY_WORDS = [
    'беготни',
    'болтовни',
    'будни',
    'вожжи',
    'возни',
    'доли',
    'лапши',
    'левши',
    'люди',
    'марли',
    'моря',
    'мощи',
    'ноздри',
    'пени',
    'пятерни',
    'распри',
    'родни',
    'сакли',
    'сени',
    'ступни',
    'судьи',
    'фигни',
    'чукчи'
];

// ============================================================
// Data: Common gender / surname-like words with zero genitive ending.
// ============================================================
export const EXPLICIT_ZERO_COMMON_SURNAMES = [
    'головы', 'громадины', 'детины', 'деревенщины', 'дохлятины', 'дубины',
    'ехидины', 'жадины', 'зверины', 'идиотины', 'кислятины', 'молодчины',
    'орясины', 'остолопины',
    'сиротины', 'скотины', 'старейшины', 'старины', 'старшины',
    'уродины'
];

export const EXPLICIT_ZERO_SURNAMES_TREE = createReversedTrie(
    EXPLICIT_ZERO_COMMON_SURNAMES
);

// ============================================================
// Data: Words ending in -а that easily merge with other roots.
// These take -ов in genitive plural.
// ============================================================
export const EXPLICIT_OV1 = [
    'адреса', 'паспорта', 'поезда', 'цеха', 'снега',
    'бункера', 'буфера',
    'берега', 'вымпела', 'голоса', 'города',
    'директора', 'договора', 'доктора', 'жемчуга',
    'инспектора', 'инструктора',
    'колокола', 'кондуктора', 'короба', 'корпуса', 'крейсера', 'кузова',
    'леса', 'мастера', 'номера',
    'облачка', 'острова', 'отпуска',
    'паруса', 'повара', 'погреба', 'пояса', 'провода',
    'прожектора', 'пропуска', 'рукава',
    'сахара', 'свитера', 'сервера', 'счета', 'трактора', 'тормоза',
    'холода', 'цвета', 'черепа', 'шторма', 'штуцера',
    'юнкера', 'ястреба',
    'суда', 'корм'
];

export const EXPLICIT_OV1_TREE = createReversedTrie(EXPLICIT_OV1);

// ============================================================
// Data: Extended set of words that take -ов in genitive plural.
// Includes EXPLICIT_OV1 plus additional entries.
// ============================================================
export const EXPLICIT_OV = new Set([
    ...EXPLICIT_OV1,
    'бега', 'беглецы', 'близнецы', 'бойцы', 'бока', 'борта', 'борцы', 'бруствера', 'брюшки',
    'веера', 'века', 'венцы', 'верха', 'веса', 'весы', 'вечера', 'вороха',
    'глупцы', 'года', 'гонцы', 'дворцы', 'дельцы',
    'детдома', 'детдомы', 'дома', 'жеребцы', 'жильцы', 'жрецы',
    'затишки', 'зубцы', 'излишки', 'истцы', 'катера',
    'концы', 'корма', 'кузнецы', 'купола', 'купцы',
    'лишки', 'луга', 'мертвецы', 'меха', 'мудрецы',
    'облака', 'образа', 'образцы', 'огурцы', 'округа', 'омута',
    'ордена', 'ордера', 'отцы', 'очки',
    'певцы', 'песцы', 'пловцы', 'подлецы',
    'продавцы', 'птенцы', 'резцы', 'рога', 'рода', 'рубцы', 'самцы',
    'свинцы',
    'сорта', 'соуса', 'спецы', 'стога', 'столбцы', 'стрельцы',
    'творцы', 'тельцы', 'тенора', 'терема', 'тома', 'тона', 'торцы',
    'хлеба', 'штришки', 'юнцы'
]);

// ============================================================
// Data: Words that can take BOTH -ов AND the default genitive stem.
// ============================================================
export const EXPLICIT_ZERO_AND_OV = new Set([
    'авары',
    'аланы', 'аршины', 'баклажаны', 'буквы', 'гольфы', 'граммы', 'гусары',
    'дела', 'кадеты', 'килограммы', 'омы', 'помидоры', 'рентгены',
    'ботинки', 'человеки', 'чулки', 'шорты'
]);

// ============================================================
// Data: Words that take -ов FIRST, then the default genitive stem.
// ============================================================
export const EXPLICIT_OV_AND_ZERO = new Set([
    'гектары', 'рельсы'
]);

// ============================================================
// Data: Full list of words with zero genitive plural ending.
// ============================================================
export const EXPLICIT_ZERO_ENDING = new Set([
    ...EXPLICIT_ZERO_COMMON_SURNAMES,
    'абазины', 'авы', 'аввы',
    'бедняги', 'бедолаги', 'болгары', 'бродяги', 'брызги', 'брюки', 'брюхи', 'будды', 'бусы',
    'валенки', 'веки', 'вельможи', 'верзилы', 'вилы', 'владыки', 'воеводы', 'волосы', 'вояки',
    'главы', 'грузины', 'задворки', 'задиры',
    'железы',
    'жилы', 'зануды', 'зеваки',
    'именины', 'калеки', 'кальсоны', 'каникулы', 'колготки', 'коллеги', 'крохи', 'курицы', 'куры',
    'ладоши', 'ламы', 'лыки', 'макароны', 'мужчины',
    'нападки', 'нары', 'непоседы', 'носилки', 'ножны',
    'папы', 'папаши', 'таты', 'падлы', 'партизаны', 'погоны', 'поминки', 'посиделки', 'похороны',
    'предтечи', 'работяги', 'разы', 'ребятки', 'румыны', 'самоубийцы', 'санки', 'убийцы',
    'сапоги', 'сатаны', 'сироты', 'сливки', 'слуги', 'солдаты',
    'старосты', 'сумерки', 'сутки',
    'татары', 'телеса',
    'хитрюги', 'четвереньки', 'шляпы', 'шмотки', 'яблоки',
    'дядьки', 'дяденьки', 'зайки', 'кроссовки', 'малютки', 'малолетки',
    'попки', 'турки', 'узы', 'хлопоты', 'шахматы'
]);

// ============================================================
// Data: Bloom filters for fast O(1) membership checks.
// These are built from the sets above for performance.
// ============================================================
export const OV_BLOOM = new BloomFilter();
EXPLICIT_OV.forEach(s => OV_BLOOM.addRaw(toFakeHash(s)));
EXPLICIT_ZERO_AND_OV.forEach(s => OV_BLOOM.addRaw(toFakeHash(s)));
EXPLICIT_OV_AND_ZERO.forEach(s => OV_BLOOM.addRaw(toFakeHash(s)));

export const ZERO_BLOOM = new BloomFilter();
EXPLICIT_ZERO_ENDING.forEach(s => ZERO_BLOOM.addRaw(toFakeHash(s)));

// ============================================================
// Data: Words ending in -и/-ы that take special genitive handling.
// ============================================================
export const BORSCHEE_TRIE = createReversedTrie([
    'жи', 'ши', 'чи',
    'ля', 'ли', 'чи', 'ри', 'ти', 'ди',
    'сани',
    'борщи', 'клещи',
    'товарищи',
    'плащи', 'прыщи', 'хрящи'
]);

export const BRATJA_TRIE = createReversedTrie([
    'братья', 'брусья', 'деревья', 'донья', 'звенья',
    'клинья', 'клочья', 'коленья', 'колосья', 'колья', 'комья', 'крылья', 'крючья',
    'листья', 'лоскутья', 'лохмотья', 'перья', 'платья', 'поводья', 'прутья',
    'стулья', 'сучья', 'хлопья', 'шилья'
]);

// ============================================================
// Data: Surname-like suffixes for flat ending derivation.
// ============================================================
export const MASC_SIMILAR_TO_COMMON_TRIE = createReversedTrie([
    'ишки', 'дружки', 'тки',
    'папочки', 'дедушки', 'дядюшки', 'батюшки',
    'катанки', 'петрушки', 'шестерки'
]);

export const KI_WORDS_TRIE = createReversedTrie([
    'жки', 'шки', 'чки', 'рки',
    'натки', 'хатки', 'ятки', 'етки', 'чётки',
    'мки', 'нки', 'педки', 'илки'
]);

export const KI_EXCEPTIONS_TRIE = createReversedTrie([
    'шок', 'щок', 'жок', 'зок',
    'аток', 'яток', 'еток'
]);

// ============================================================
// Data: dnaVtsa suffixes for genitive stem derivation.
// ============================================================
export const DNA_VTSA_TRIE = createReversedTrie([
    'вна', 'вца', 'вцы', 'пла', 'дца', 'дра', 'судна',
    'рки', 'рцы', 'тлы', 'рна', 'тна', 'енца',
    'десны', 'дёсны',
    'рёбра', 'ребра',
    'сосны'
]);

// ============================================================
// Data: Helper functions for the configuration.
// ============================================================

/**
 * Check if a plural form is in the OV bloom filter.
 * @param {string} lcPlural - lowercase plural word
 * @param {BloomFilter} bloom - bloom filter instance
 * @returns {boolean}
 */
export function isInOvBloom(lcPlural, bloom) {
    return bloom.hasRaw(toFakeHash(lcPlural));
}

/**
 * Check if a plural form is in the zero-ending bloom filter.
 * @param {string} lcPlural - lowercase plural word
 * @param {BloomFilter} bloom - bloom filter instance
 * @returns {boolean}
 */
export function isInZeroBloom(lcPlural, bloom) {
    return bloom.hasRaw(toFakeHash(lcPlural));
}

/**
 * Check if a word is in EXPLICIT_OV set.
 * @param {string} lcPlural - lowercase plural word
 * @returns {boolean}
 */
export function isInExplicitOv(lcPlural) {
    return EXPLICIT_OV.has(lcPlural);
}

/**
 * Check if a word is in EXPLICIT_ZERO_AND_OV set.
 * @param {string} lcPlural - lowercase plural word
 * @returns {boolean}
 */
export function isInExplicitZeroAndOv(lcPlural) {
    return EXPLICIT_ZERO_AND_OV.has(lcPlural);
}

/**
 * Check if a word is in EXPLICIT_OV_AND_ZERO set.
 * @param {string} lcPlural - lowercase plural word
 * @returns {boolean}
 */
export function isInExplicitOvAndZero(lcPlural) {
    return EXPLICIT_OV_AND_ZERO.has(lcPlural);
}

/**
 * Check if a word is in EXPLICIT_ZERO_ENDING set.
 * @param {string} lcPlural - lowercase plural word
 * @returns {boolean}
 */
export function isInExplicitZeroEnding(lcPlural) {
    return EXPLICIT_ZERO_ENDING.has(lcPlural);
}

/**
 * Check if a word is in EY_WORDS list.
 * @param {string} lcPlural - lowercase plural word
 * @returns {boolean}
 */
export function isEyWord(lcPlural) {
    return EY_WORDS.includes(lcPlural);
}

/**
 * Check if a word ends in -аи/-ои/-еи/-эи/-уи.
 * @param {string} lcPlural - lowercase plural word
 * @returns {boolean}
 */
export function endsInAiOiEi(lcPlural) {
    return endsWithAny(lcPlural, ['аи', 'ои', 'еи', 'эи', 'уи']);
}

/**
 * Check if a word is 'свечи'.
 * @param {string} lcPlural - lowercase plural word
 * @returns {boolean}
 */
export function isSvechi(lcPlural) {
    return lcPlural === 'свечи';
}

/**
 * Check if a word is 'пригоршни'.
 * @param {string} lcPlural - lowercase plural word
 * @returns {boolean}
 */
export function isPigorshni(lcPlural) {
    return lcPlural === 'пригоршни';
}

/**
 * Check if a word is 'тихони'.
 * @param {string} lcPlural - lowercase plural word
 * @returns {boolean}
 */
export function isTihoni(lcPlural) {
    return lcPlural === 'тихони';
}

/**
 * Check if a word ends in -ьи/-ии.
 * @param {string} lcPlural - lowercase plural word
 * @returns {boolean}
 */
export function endsInYiIi(lcPlural) {
    return endsWithAny(lcPlural, ['ьи', 'ии']);
}

/**
 * Check if a word ends in -ни with a consonant before it.
 * @param {string} lcPlural - lowercase plural word
 * @returns {boolean}
 */
export function endsInNiWithConsonant(lcPlural) {
    return lcPlural.endsWith('ни') && lcPlural.length >= 3;
}

/**
 * Check if a word is 'барышни', 'боярышни', 'деревни'.
 * @param {string} lcPlural - lowercase plural word
 * @returns {boolean}
 */
export function isBaryshniFamily(lcPlural) {
    return ['барышни', 'боярышни', 'деревни'].includes(lcPlural);
}

/**
 * Check if a word is 'кухни'.
 * @param {string} lcPlural - lowercase plural word
 * @returns {boolean}
 */
export function isKuhni(lcPlural) {
    return lcPlural === 'кухни';
}

/**
 * Check if a word is 'сотни'.
 * @param {string} lcPlural - lowercase plural word
 * @returns {boolean}
 */
export function isSotni(lcPlural) {
    return lcPlural === 'сотни';
}

/**
 * Check if a word ends in -семры/-сёстры/-ерьги.
 * @param {string} lcPlural - lowercase plural word
 * @returns {boolean}
 */
export function isSestryFamily(lcPlural) {
    return endsWithAny(lcPlural, ['сестры', 'сёстры', 'серьги']);
}

/**
 * Check if a word ends in -мена but not -семена/-стремена.
 * @param {string} lcPlural - lowercase plural word
 * @returns {string|null} - 'мена' or null
 */
export function getMenaEnding(lcPlural) {
    if (lcPlural.endsWith('мена') && !lcPlural.endsWith('семена') && !lcPlural.endsWith('стремена')) {
        return 'мена';
    }
    return null;
}

/**
 * Check if a word ends in -ян/-ён from seeds.
 * @param {string} lcPlural - lowercase plural word
 * @returns {string|null} - 'семена' or 'стремена' or null
 */
export function getSemenaEnding(lcPlural) {
    if (lcPlural.endsWith('семена')) return 'семена';
    if (lcPlural.endsWith('стремена')) return 'стремена';
    return null;
}

/**
 * Check if a word ends in -уйли.
 * @param {string} lcPlural - lowercase plural word
 * @returns {boolean}
 */
export function isUlii(lcPlural) {
    return lcPlural.endsWith('ульи');
}

/**
 * Check if a word ends in -ья/-ия for masculine.
 * @param {string} lcPlural - lowercase plural word
 * @returns {boolean}
 */
export function endsInYaIa(lcPlural) {
    return endsWithAny(lcPlural, ['ья', 'ия']);
}

/**
 * Check if a word is in the ZYa family (зятья, кумовья, etc.).
 * @param {string} lcPlural - lowercase plural word
 * @returns {boolean}
 */
export function isZYaFamily(lcPlural) {
    return endsWithAny(lcPlural, ['зятья', 'кумовья', 'деверья', 'края', 'острия']);
}

/**
 * Check if a word ends in -ыцы/-ицы/-лицы/-пицы/-бицы.
 * @param {string} lcPlural - lowercase plural word
 * @returns {string|null} - the ending or null
 */
export function getYtsyEnding(lcPlural) {
    if (lcPlural.endsWith('ницы') || lcPlural.endsWith('лицы') || lcPlural.endsWith('пицы') || lcPlural.endsWith('бицы')) {
        return lcPlural.slice(-3);
    }
    return null;
}

/**
 * Check if a word ends in -ки with specific constraints.
 * @param {string} lcPlural - lowercase plural word
 * @param {string} lastOf2Initial - second to last character
 * @returns {boolean}
 */
export function isKiWord(lcPlural, lastOf2Initial) {
    if (!lcPlural.endsWith('ки')) return false;
    if (lastOf2Initial === 'ь') return true;
    if (lastOf2Initial && ['ж', 'ш', 'ч'].includes(lastOf2Initial)) return true;
    return false;
}

/**
 * Check if a word ends in -йки.
 * @param {string} lcPlural - lowercase plural word
 * @returns {boolean}
 */
export function isYiki(lcPlural) {
    return lcPlural.endsWith('йки');
}

/**
 * Check if a word ends in -не.
 * @param {string} lcPlural - lowercase plural word
 * @returns {boolean}
 */
export function endsInNe(lcPlural) {
    return lcPlural.endsWith('не');
}

/**
 * Check if a word ends in -гроздья.
 * @param {string} lcPlural - lowercase plural word
 * @returns {boolean}
 */
export function isGrozdia(lcPlural) {
    return lcPlural === 'гроздья';
}

/**
 * Check if a word ends in -ии with a vowel before it.
 * @param {string} lcPlural - lowercase plural word
 * @returns {boolean}
 */
export function endsInIiAfterVowel(lcPlural) {
    return lcPlural.endsWith('ии') && lcPlural.length >= 3;
}

/**
 * Check if a word ends in -мессии.
 * @param {string} lcPlural - lowercase plural word
 * @returns {boolean}
 */
export function isMessii(lcPlural) {
    return lcPlural.endsWith('мессии');
}

/**
 * Check if a word ends in -ча/-кле/-холу/-ху + и.
 * @param {string} lcPlural - lowercase plural word
 * @returns {boolean}
 */
export function isChaKleFamily(lcPlural) {
    return ['ча', 'кле', 'холу', 'ху'].includes(lcPlural.slice(0, -1));
}

/**
 * Check if a word ends in -овичи/-евичи.
 * @param {string} lcPlural - lowercase plural word
 * @returns {boolean}
 */
export function endsInOvichi(lcPlural) {
    return lcPlural.endsWith('овичи') || lcPlural.endsWith('евичи');
}

/**
 * Check if a word ends in -дети/-люди (but not нелюди).
 * @param {string} lcPlural - lowercase plural word
 * @returns {boolean}
 */
export function endsInDetiLiudi(lcPlural) {
    return (lcPlural.endsWith('дети') || lcPlural.endsWith('люди')) && !lcPlural.endsWith('нелюди');
}

/**
 * Check if a word ends in -вери/-дочери.
 * @param {string} lcPlural - lowercase plural word
 * @returns {boolean}
 */
export function endsInVeriDocheri(lcPlural) {
    return lcPlural.endsWith('вери') || lcPlural.endsWith('дочери');
}

/**
 * Check if a word ends in -вны/-полусотни (but not овны).
 * @param {string} lcPlural - lowercase plural word
 * @returns {boolean}
 */
export function endsInVny(lcPlural) {
    return (lcPlural.endsWith('вны') || lcPlural === 'полусотни') && lcPlural !== 'овны';
}
