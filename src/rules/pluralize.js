/**
 * Plural form generation for Russian nouns.
 *
 * This module handles nominative plural forms for all declensions
 * and genders. It uses a "priority rules" pattern: a series of
 * test/handler pairs evaluated in order. The first matching rule wins.
 *
 * Performance: Bloom filters and reversed tries ensure O(1) lookup
 * for suffix matching and exception lists. The critical path remains
 * fast because rules are ordered by frequency.
 *
 * Bitmask note: bitmasks use the order of Russian alphabet letters
 * backwards (without Ё). This is a performance optimization for fast
 * suffix matching.
 */

import { FEM, MASC, NEU, COM } from '../Gender.js';
import { getIntGender } from '../Lemma.js';
import { getNounStem, okWord, egoEndings, egoSoftM, tsStem, eStem } from './common.js';
import { softD1, isAdjectiveLike } from './decline1.js';
import { specialD3 } from './decline3.js';
import { createReversedTrie, endsWithSuffix } from '../utils/trie.js';
import { unique } from '../utils/lists.js';
import { bincludes, vowels } from '../utils/alphabet.js';
import { toLowerCaseRu, upperLike } from '../utils/letterCase.js';
import { init, last, takeLast, dropLast, charFromEnd, hasChar, endsWithAny, unYo } from '../utils/strings.js';
import { getPluralForms } from '../settings/irregularNouns.js';
import {
    YA_D1_SOFT_STEM,
    A_YA_WORDS,
    A_YA_WORDS2_SUFFIXES,
    A_YA_WORDS3,
    A_YA_WORDS4,
    YA2_SOFT_STEM_WORDS,
    YA3_SOFT_STEM_WORDS,
    SOFT_SIGN_ONLY_NEUTER,
    YI_WORDS,
    YONOK_WORDS,
    matchesAYaWords2,
    getAYaWordsCategory,
    isYa2Pattern,
    isYa3Pattern,
    isSynChelovek,
    isAnimateYonok,
    isAnimateOnok,
    isYiWord,
    isBarin,
    isBoyar,
    isTset,
    isShchenok,
    isRebenok,
    isZarya,
    isAyaWord,
    isKoChoWord,
    isImoyeWord,
    isEeeWord,
    isOieWithHardStem,
    isIieWord,
    isVyeWord,
    isSoftSignOnlyNeuter,
    isLeReWord,
    isTransportSudno,
    isYonokFamily,
    isShchupaltsye
} from '../settings/pluralizeConfig.js';

const NOMINATIVE = 0;

// ============================================================
// Helper: Yo-stem generator
// ============================================================

/**
 * Generate yo/unYo variants based on stress pattern.
 * @param {Object} engine - Engine instance
 * @param {Object} lemma - Lemma object
 * @param {function} f - Transform function (receives stem)
 * @returns {Array<string>}
 */
const singleEYo = s => (s.replace(/[^её]/g, '').length === 1);

const reYo = s => {
    const index = Math.max(
        s.toLowerCase().lastIndexOf('е'),
        s.toLowerCase().lastIndexOf('ё')
    );
    const r = upperLike('ё', s[index]);
    return s.substring(0, index) + r + s.substring(index + 1);
};

function yoStem(engine, lemma, stem, lcStem, f) {
    const stressedStem = engine.sd
        .hasStressedEndingPlural(lemma, NOMINATIVE).map(x => !x);

    if (!stressedStem.length) {
        return [f(stem)];
    }

    return stressedStem.map(b => b
        ? (singleEYo(lcStem) ? f(reYo(stem)) : f(stem))
        : f(unYo(stem))
    );
}

// ============================================================
// Helper: Yeru or Ii stem generator
// ============================================================

/**
 * Generate Yeru (ы/и) variants based on phonetic constraints.
 * @param {Object} engine - Engine instance
 * @param {Object} lemma - Lemma object
 * @param {string} stem - Noun stem
 * @param {string} lcStem - Lowercase stem
 * @param {string} lcWord - Lowercase word
 * @param {Array} stressedEnding - Stress pattern
 * @param {string} simpleFirstPart - Simplified first part of stem
 * @returns {string[]}
 */
function yeruOrI(engine, lemma, word, stem, lcStem, lcWord, stressedEnding, simpleFirstPart) {
    const result = [];
    const softPatronymic = () => (lcWord.endsWith('евич') || lcWord.endsWith('евна'))
        && (lcWord.indexOf('ье') >= 0);

    function softPatronymicForm2() {
        const part = simpleFirstPart;
        const index = toLowerCaseRu(part).indexOf('ье');
        const r = upperLike('и', part[index]);
        return part.substring(0, index) + r + part.substring(index + 1);
    }

    if (bincludes(0b11101000000000010001001000, last(lcStem))  // sibilant or velar
        || hasChar('яйь', last(lcWord))
        || endsWithAny(lcWord, ['сосед'])) {

        if (softPatronymic()) {
            result.push(softPatronymicForm2() + 'и');
            result.push(simpleFirstPart + 'и');
        } else {
            result.push(...eStem(stressedEnding, simpleFirstPart, s => s + 'и'));
        }

    } else if (last(lcWord) === 'ц') {
        result.push(tsStem(word, lemma) + 'цы');

    } else {

        if (softPatronymic()) {
            result.push(softPatronymicForm2() + 'ы');
            result.push(simpleFirstPart + 'ы');
        } else {
            result.push(...eStem(stressedEnding, simpleFirstPart, s => s + 'ы'));
        }

    }

    return result;
}

// ============================================================
// Main: Pluralize function
// ============================================================

/**
 * Generate nominative plural forms for a Russian noun.
 *
 * @param {RussianNouns.Engine} engine - The declension engine
 * @param {RussianNouns.Lemma} lemma - The lemma to pluralize
 * @returns {string[]} Array of plural forms
 */
export function pluralize(engine, lemma) {
    const word = lemma.text();
    const lcWord = toLowerCaseRu(word);

    // Step 1: Check for stressed ending override
    const stressedEnding = engine.sd
        .hasStressedEndingPlural(lemma, NOMINATIVE);

    // Step 2: Get the noun stem
    const stem = getNounStem(lemma, lcWord, stressedEnding[0]);
    const lcStem = toLowerCaseRu(stem);

    // Step 3: Handle special cases first

    // Rule 0: Words ending in -яя take -ие
    if (lcWord.endsWith('яя')) {
        return unique([dropLast(word, 2) + 'ие']);
    }

    // Rule 1: Simple stem for vowel clusters
    const simpleFirstPart = (('й' === last(lcWord) || bincludes(vowels, last(lcWord))) && bincludes(vowels, last(init(lcWord))))
        ? init(word)
        : stem;

    // Rule 2: Get irregular forms (high priority)
    const irregularPluralForms = getPluralForms(lemma, lcWord);
    if (irregularPluralForms) {
        return irregularPluralForms;
    }

    // Rule 3: Get gender and declension
    const gender = getIntGender(lemma);
    const declension = lemma.getDeclension();

    // ============================================================
    // Declension -1: Indeclinable words
    // ============================================================
    if (declension === -1) {
        return unique([word]);
    }

    // ============================================================
    // Declension 0: Mixed declension (путь, дитя)
    // ============================================================
    if (declension === 0) {
        if (lcWord === 'путь') {
            return unique(['пути']);
        } else if (lcWord.endsWith('дитя')) {
            return unique([dropLast(word, 3) + 'ети']);
        }
        throw new Error('unsupported mixed declension word');
    }

    // ============================================================
    // Declension 1: Masculine & Neuter (no ending or short ending)
    // ============================================================
    if (declension === 1) {
        return pluralizeDeclension1(engine, lemma, word, lcWord, stem, lcStem,
            stressedEnding, simpleFirstPart, gender);
    }

    // ============================================================
    // Declension 2: Feminine (ending in -а/-я)
    // ============================================================
    if (declension === 2) {
        return pluralizeDeclension2(engine, lemma, word, lcWord, stem, lcStem,
            stressedEnding, simpleFirstPart, gender);
    }

    // ============================================================
    // Declension 3: Soft declension (мать, дочь, -мя words)
    // ============================================================
    if (declension === 3) {
        return pluralizeDeclension3(engine, lemma, word, lcWord, stem, lcStem,
            stressedEnding, simpleFirstPart, gender);
    }

    // Fallback
    return unique([word]);
}

// ============================================================
// Declension 1 pluralization
// ============================================================

/**
 * Pluralize declension 1 words (masculine & neuter).
 */
function pluralizeDeclension1(engine, lemma, word, lcWord, stem, lcStem,
    stressedEnding, simpleFirstPart, gender) {

    const result = [];
    const softStemD1 = (last(lcStem) === 'ь')
        ? stem
        : (
            (last(lcStem) === 'к') ? (init(stem) + 'чь') : (
                (last(lcStem) === 'г') ? (init(stem) + 'зь') : (
                    (last(lcWord) === 'й') ? init(word) : (
                        (endsWithAny(lcWord, ['рь', 'ль'])) ? stem : (stem + 'ь')
                    )
                )
            )
        );

    // Rule M1: yaD1 soft stem words
    if (YA_D1_SOFT_STEM.includes(lcWord)) {
        result.push(softStemD1 + 'я');
        return unique(result);
    }

    // --- Masculine gender ---
    if (gender === MASC) {
        // Rule M2: Syn/Chelovek type words
        const synChelovek = isSynChelovek(lcWord, lemma);
        if (synChelovek === 'сын') {
            result.push('сыновья');
            result.push(...yeruOrI(engine, lemma, word, stem, lcStem, lcWord, stressedEnding, simpleFirstPart));
            return unique(result);
        }
        if (synChelovek === 'человек') {
            result.push('люди');
            result.push(...yeruOrI(engine, lemma, word, stem, lcStem, lcWord, stressedEnding, simpleFirstPart));
            return unique(result);
        }

        // Rule M3: ya2 pattern (soft stem + я)
        if (isYa2Pattern(lcWord, lemma)) {
            result.push(...yeruOrI(engine, lemma, word, stem, lcStem, lcWord, stressedEnding, simpleFirstPart));
            result.push(softStemD1 + 'я');
            return unique(result);
        }

        // Rule M4: ya3 pattern (soft stem only)
        if (isYa3Pattern(lcWord)) {
            result.push(softStemD1 + 'я');
            return unique(result);
        }

        // Rule M5: aYaWords family (words ending in -а/-я in plural)
        const aYaCategory = getAYaWordsCategory(lcWord);
        const matchesAYaWords2Flag = matchesAYaWords2(lcWord);

        if (aYaCategory !== 0 || matchesAYaWords2Flag) {
            if (aYaCategory === 4) {
                result.push(...yeruOrI(engine, lemma, word, stem, lcStem, lcWord, stressedEnding, simpleFirstPart));
            }

            if (softD1(lcWord)) {
                result.push(...yoStem(engine, lemma, stem, lcStem, s => s + 'я'));
            } else if (stressedEnding.includes(true)) {
                result.push(unYo(stem) + 'а');
            } else {
                result.push(stem + 'а');
            }

            if (aYaCategory === 3) {
                result.push(...yeruOrI(engine, lemma, word, stem, lcStem, lcWord, stressedEnding, simpleFirstPart));
            }

            return unique(result);
        }

        // Rule M6: Barin/Boyar type words
        if (
            (((lcWord.endsWith('анин') && lcWord.length > 5) || lcWord.endsWith('янин')) && !lemma.isAName())
            || isBoyar(lcWord) || isBarin(lcWord)
        ) {
            result.push(dropLast(word, 2) + 'е');
            if (isBarin(lcWord)) {
                result.push(dropLast(word, 2) + 'ы');
            }
            return unique(result);
        }

        // Rule M7: Tset (цыган)
        if (isTset(lcWord)) {
            result.push(word + 'е');
            return unique(result);
        }

        // Rule M8: Shchenok (щенок)
        if (isShchenok(lcWord)) {
            result.push(dropLast(word, 2) + 'ки');
            result.push(dropLast(word, 2) + 'ята');
            return unique(result);
        }

        // Rule M9: Rebenok type
        if (isRebenok(lcWord)) {
            result.push(dropLast(word, 7) + 'дети');
            return unique(result);
        }

        // Rule M10: Animate yonok type
        if (isAnimateYonok(lcWord, lemma)) {
            result.push(dropLast(word, 4) + 'ята');
            return unique(result);
        }

        // Rule M11: Animate yonochek type
        if (lcWord.endsWith('ёночек') && lemma.isAnimate()) {
            result.push(dropLast(word, 6) + 'ятки');
            return unique(result);
        }

        // Rule M12: Animate onok with hard sign constraint
        if (isAnimateOnok(lcWord, lemma)) {
            result.push(dropLast(word, 4) + 'ата');
            return unique(result);
        }

        // Rule M13: okWord pattern (-ок/-ёк → -ки)
        if (okWord(lcWord)) {
            result.push(dropLast(word, 2) + 'ки');
            return unique(result);
        }

        // Rule M14: egoEndings pattern
        if (endsWithSuffix(lcWord, egoEndings)) {
            if (endsWithAny(lcWord, egoSoftM)) {
                result.push(dropLast(word, 2) + 'ьи');
            } else {
                result.push(init(word) + 'е');
            }
            return unique(result);
        }

        // Rule M15: Adjective-like words
        if (isAdjectiveLike(lemma, lcWord)) {
            if (lcWord.endsWith('ый') || lcWord.endsWith('ий')) {
                result.push(init(word) + 'е');
            } else if (lcWord.endsWith('ой') && !endsWithAny(lcWord, ['хой', 'ской'])) {
                result.push(dropLast(word, 2) + 'ые');
            } else {
                result.push(dropLast(word, 2) + 'ие');
            }
            return unique(result);
        }

        // Rule M16: -его ending
        if (lcWord.endsWith('его')) {
            result.push(dropLast(word, 3) + 'ие');
            return unique(result);
        }

        // Rule M17: Yi words (воробей type)
        if (isYiWord(lcWord)) {
            result.push(dropLast(word, 2) + 'ьи');
            return unique(result);
        }

        // Rule M18: Default -ы/-и
        result.push(...yeruOrI(engine, lemma, word, stem, lcStem, lcWord, stressedEnding, simpleFirstPart));
        return unique(result);
    }

    // --- Neuter gender ---
    if (gender === NEU) {
        // Rule N1: -ко/-чо ending
        if (isKoChoWord(lcWord)) {
            result.push(init(word) + 'и');
            return unique(result);
        }

        // Rule N2: -имое ending
        if (isImoyeWord(lcWord)) {
            result.push(stem + 'ые');
            return unique(result);
        }

        // Rule N3: -ее ending
        if (isEeeWord(lcWord)) {
            result.push(stem + 'ие');
            return unique(result);
        }

        // Rule N4: -ое ending with hard sign constraint
        if (lcWord.endsWith('ое')) {
            if (isOieWithHardStem(lcStem)) {
                result.push(stem + 'ие');
            } else {
                result.push(stem + 'ые');
            }
            return unique(result);
        }

        // Rule N5: -ие/-иё ending
        if (isIieWord(lcWord)) {
            result.push(dropLast(word, 2) + 'ия');
            return unique(result);
        }

        // Rule N6: -ье/-ьё ending
        if (isVyeWord(lcWord)) {
            const w = dropLast(word, 2);

            if ((last(lcWord) === 'е') && !isSoftSignOnlyNeuter(lcWord)) {
                result.push(w + 'ия');
            }

            result.push(w + 'ья');
            return unique(result);
        }

        // Rule N7: Yonok family (дерево, звено, крыло)
        if (isYonokFamily(lcWord)) {
            result.push(stem + 'ья');
            return unique(result);
        }

        // Rule N8: -ле/-ре ending
        if (isLeReWord(lcWord)) {
            result.push(stem + 'я');
            return unique(result);
        }

        // Rule N9: Transport судно
        if (isTransportSudno(lcWord, lemma)) {
            result.push(dropLast(word, 2) + 'а');
            return unique(result);
        }

        // Rule N10: Default yoStem + а
        result.push(...yoStem(engine, lemma, stem, lcStem, s => s + 'а'));

        // Rule N11: Shchupaltsye special case
        if (isShchupaltsye(lcWord)) {
            result.push(...yeruOrI(engine, lemma, word, stem, lcStem, lcWord, stressedEnding, simpleFirstPart));
        }

        return unique(result);
    }

    // --- Common gender (fallback) ---
    result.push(stem + 'и');
    return unique(result);
}

// ============================================================
// Declension 2 pluralization
// ============================================================

/**
 * Pluralize declension 2 words (feminine, ending in -а/-я).
 */
function pluralizeDeclension2(engine, lemma, word, lcWord, stem, lcStem,
    stressedEnding, simpleFirstPart, gender) {

    const result = [];

    // Rule F1: Zarya type
    if (isZarya(lcWord)) {
        result.push('зори');
        return unique(result);
    }

    // Rule F2: Feminine adjective-like (-ая ending)
    if (isAyaWord(lcWord)) {
        if (hasChar('жхчшщ', last(lcStem)) || endsWithAny(lcStem, ['вк', 'гк', 'ск', 'цк', 'ньк'])) {
            result.push(stem + 'ие');
        } else {
            result.push(stem + 'ые');
        }
        return unique(result);
    }

    // Rule F3: Default -ы/-и
    result.push(...yeruOrI(engine, lemma, word, stem, lcStem, lcWord, stressedEnding, simpleFirstPart));
    return unique(result);
}

// ============================================================
// Declension 3 pluralization
// ============================================================

/**
 * Pluralize declension 3 words (soft declension, -мя, мать, дочь).
 */
function pluralizeDeclension3(engine, lemma, word, lcWord, stem, lcStem,
    stressedEnding, simpleFirstPart, gender) {

    const result = [];

    // Rule S1: -мя words
    if (takeLast(lcWord, 2) === 'мя') {
        result.push(stem + 'ена');
        return unique(result);
    }

    // Rule S2: Special words (мать, дочь)
    if (Object.keys(specialD3).includes(lcWord)) {
        result.push(init(specialD3[lcWord]) + 'и');
        return unique(result);
    }

    // Rule S3: Feminine gender
    if (FEM === gender) {
        result.push(simpleFirstPart + 'и');
        return unique(result);
    }

    // Rule S4: Default masculine ending
    if (last(simpleFirstPart) === 'и') {
        result.push(simpleFirstPart + 'я');
    } else {
        result.push(simpleFirstPart + 'а');
    }
    return unique(result);
}
