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
const EXCEPTIONS = Object.freeze({
    [MASC]: Object.freeze({
        all: Object.freeze({
            'болгарин': Object.freeze(['болгары']),
            'господин': Object.freeze(['господа']),
            'дядя': Object.freeze(['дяди', 'дядья']),
            'зуб': Object.freeze(['зубы', 'зубья']),
            'клок': Object.freeze(['клочья', 'клоки']),
            'князь': Object.freeze(['князи', 'князья']),
            'кол': Object.freeze(['колы', 'колья']),
            'месяц': Object.freeze(['месяцы']),
            'полдень': Object.freeze(['полдни', 'полудни']),
            'татарин': Object.freeze(['татары']),
            'хозяин': Object.freeze(['хозяева']),
            'цветок': Object.freeze(['цветки', 'цветы']),
            'черт': Object.freeze(['черти']),
            'чёрт': Object.freeze(['черти'])
        }),
        animateOnly: Object.freeze({
            'кондуктор': Object.freeze(['кондуктора', 'кондукторы']),
            'кум': Object.freeze(['кумовья']),
            'муж': Object.freeze(['мужья', 'мужи'])
        })
    }),
    [FEM]: Object.freeze({
        all: Object.freeze({
            'гроздь': Object.freeze(['грозди', 'гроздья']),
            'курица': Object.freeze(['курицы', 'куры']),
            'стая': Object.freeze(['стаи']),
            'щека': Object.freeze(['щёки']),
            'береста': Object.freeze(['берёсты']),
            'верста': Object.freeze(['вёрсты']),
            'десна': Object.freeze(['дёсны']),
            'жена': Object.freeze(['жёны']),
            'звезда': Object.freeze(['звёзды']),
            'кинозвезда': Object.freeze(['кинозвёзды']),
            'медсестра': Object.freeze(['медсёстры']),
            'метла': Object.freeze(['мётлы']),
            'пчела': Object.freeze(['пчёлы']),
            'сестра': Object.freeze(['сёстры']),
            'слеза': Object.freeze(['слёзы'])
        })
    }),
    [NEU]: Object.freeze({
        all: Object.freeze({
            'брюхо': Object.freeze(['брюхи']),
            'колено': Object.freeze(['колена', 'колени', 'коленья']),
            'древо': Object.freeze(['древа', 'древеса']),
            'ухо': Object.freeze(['уши']),
            'око': Object.freeze(['очи']),
            'дно': Object.freeze(['донья']),
            'чудо': Object.freeze(['чудеса', 'чуда']),
            'небо': Object.freeze(['небеса']),
            'бревно': Object.freeze(['брёвна']),
            'ведро': Object.freeze(['вёдра']),
            'веретено': Object.freeze(['веретёна']),
            'весло': Object.freeze(['вёсла']),
            'гнездо': Object.freeze(['гнёзда']),
            'зерно': Object.freeze(['зёрна']),
            'знамя': Object.freeze(['знамёна']),
            'колесо': Object.freeze(['колёса']),
            'облачко': Object.freeze(['облачка']),
            'озеро': Object.freeze(['озёра']),
            'полсотни': Object.freeze(['полусотни']),
            'ребро': Object.freeze(['рёбра']),
            'ремесло': Object.freeze(['ремёсла']),
            'седло': Object.freeze(['сёдла']),
            'село': Object.freeze(['сёла'])
        })
    })
});

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
