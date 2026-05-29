import { FEM, MASC, NEU, COM } from "../Gender.js";
import { getIntGender } from "../Lemma.js";
import { BloomFilter } from "../utils/bloom.js";
import { calculateHash } from "../utils/hash.js";

/**
 * Exception entries organized by gender category.
 * Each entry maps lemma (lowercase) -> array of plural forms.
 *
 * Structure:
 *   EXCEPTIONS[gender] = {
 *     all: { word -> forms },  // matches both animate and inanimate
 *     animateOnly: { word -> forms }  // matches only animate=true
 *   }
 */
const EXCEPTIONS = {
    [MASC]: {
        all: {
            'аргивянин': ['аргивянины'],
            'арианин': ['арианины'],
            'болгарин': ['болгары'],
            'вайцех': ['вайцехи'],
            'войцех': ['войцехи'],
            'господин': ['господа'],
            'дядя': ['дяди', 'дядья'],
            'зуб': ['зубы', 'зубья'],
            'клок': ['клочья', 'клоки'],
            'князь': ['князи', 'князья'],
            'кол': ['колы', 'колья'],
            'месяц': ['месяцы'],
            'полдень': ['полдни', 'полудни'],
            'татарин': ['татары'],
            'хозяин': ['хозяева'],
            'цветок': ['цветки', 'цветы'],
            'черт': ['черти'],
            'чёрт': ['черти'],
            'электротрактор': ['электротракторы', 'электротрактора'],
            'мини-трактор': ['мини-трактора']
        },
        animateOnly: {
            'авиаконструктор': ['авиаконструктора', 'авиаконструкторы'],
            'автоинспектор': ['автоинспектора', 'автоинспекторы'],
            'арт-директор': ['арт-директора'],
            'бесёнок': ['бесенята'],
            'вице-директор': ['вице-директора'],
            'госавтоинспектор': ['госавтоинспектора', 'госавтоинспекторы'],
            'госинспектор': ['госинспектора'],
            'кондуктор': ['кондуктора', 'кондукторы'],
            'конструктор': ['конструктора', 'конструкторы'],
            'кум': ['кумовья'],
            'корректор': ['корректора', 'корректоры'],
            'муж': ['мужья', 'мужи'],
            'охотинспектор': ['охотинспектора'],
            'пристав': ['пристава', 'приставы'],
            'проспектор': ['проспектора'],
            'редактор': ['редактора', 'редакторы'],
            'ректор': ['ректора', 'ректоры'],
            'санинструктор': ['санинструктора', 'санинструкторы'],
            'слесарь': ['слесари', 'слесаря'],
            'сторож': ['сторожа', 'сторожи'],
            'вахтер': ['вахтера', 'вахтёры'],
            'фельдшер': ['фельдшера', 'фельдшеры'],
            'член-корреспондент': ['член-корреспонденты', 'члены-корреспонденты'],
            'цыган': ['цыгане', 'цыганы']
        }
    },
    [FEM]: {
        all: {
            'гроздь': ['грозди', 'гроздья'],
            'курица': ['курицы', 'куры'],
            'стая': ['стаи'],
            'щека': ['щёки'],
            'береста': ['берёсты'],
            'верста': ['вёрсты'],
            'десна': ['дёсны'],
            'жена': ['жёны'],
            'звезда': ['звёзды'],
            'кинозвезда': ['кинозвёзды'],
            'медсестра': ['медсёстры'],
            'метла': ['мётлы'],
            'пчела': ['пчёлы'],
            'сестра': ['сёстры'],
            'слеза': ['слёзы']
        }
    },
    [NEU]: {
        all: {
            'брюхо': ['брюхи'],
            'колено': ['колена', 'колени', 'коленья'],
            'древо': ['древа', 'древеса'],
            'ухо': ['уши'],
            'око': ['очи'],
            'дно': ['донья'],
            'чудо': ['чудеса', 'чуда'],
            'небо': ['небеса'],
            'бревно': ['брёвна'],
            'ведро': ['вёдра'],
            'веретено': ['веретёна'],
            'весло': ['вёсла'],
            'гнездо': ['гнёзда'],
            'зерно': ['зёрна'],
            'знамя': ['знамёна'],
            'колесо': ['колёса'],
            'облачко': ['облачка'],
            'озеро': ['озёра'],
            'полсотни': ['полусотни'],
            'ребро': ['рёбра'],
            'ремесло': ['ремёсла'],
            'седло': ['сёдла'],
            'село': ['сёла']
        }
    }
};

// Build bloom filter from all exception words
const highPriorityBloomFilter = new BloomFilter();
for (const genderMap of Object.values(EXCEPTIONS)) {
    for (const entry of Object.values(genderMap)) {
        for (const word of Object.keys(entry)) {
            highPriorityBloomFilter.addInteger(calculateHash(word));
        }
    }
}

/**
 * Get plural forms for a lemma, checking exception lists.
 * @param {RussianNouns.Lemma} lemma - The lemma object
 * @param {string} lcWord - Lowercase word
 * @returns {string[]|undefined} - Array of plural forms or undefined
 */
export function getPluralForms(lemma, lcWord) {
    if (!highPriorityBloomFilter.hasInteger(lemma._hash)) {
        return undefined;
    }

    const gender = getIntGender(lemma);
    const animate = lemma.isAnimate();

    const genderMap = EXCEPTIONS[gender];
    if (!genderMap) return undefined;

    // Using `slice()` here eliminates the need for `Object.freeze`.

    // Check animate-specific entries first (more specific)
    const animateOnly = genderMap.animateOnly;
    if (animate && animateOnly && animateOnly.hasOwnProperty(lcWord)) {
        return animateOnly[lcWord].slice();
    }

    // Check gender-specific entry (matches both animate and inanimate)
    const all = genderMap.all;
    if (all && all.hasOwnProperty(lcWord)) {
        return all[lcWord].slice();
    }

    return undefined;
}

/**
 * Check if a word has any exception forms.
 * @param {string} lcWord - lowercase word
 * @returns {boolean}
 */
export function hasException(lcWord) {
    return highPriorityBloomFilter.hasInteger(calculateHash(lcWord));
}
