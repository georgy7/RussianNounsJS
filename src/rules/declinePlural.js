import { FEM, MASC, NEU, COM } from "../Gender.js";
import { getIntGender } from "../Lemma.js";
import { getNounStem0, egoSoftPlural } from "./common.js";
import { surnameType1Plural } from "./names.js";
import { endsWithSuffix } from "../utils/trie.js";
import { bincludes, lcBit, vowels, consonantsExceptJ, LOWERCASE_A, UPPERCASE_A } from "../utils/alphabet.js";
import { toLowerCaseRu, upperLike } from "../utils/letterCase.js";
import { init, last, dropLast, charFromEnd, hasChar, endsWithAny, unYo } from "../utils/strings.js";
import {
    SOFT_ENDINGS_TRIE,
    EXPLICIT_ZERO_SURNAMES_TREE,
    EXPLICIT_OV1_TREE,
    OV_BLOOM,
    ZERO_BLOOM,
    EXPLICIT_ZERO_ENDING,
    BORSCHEE_TRIE,
    BRATJA_TRIE,
    MASC_SIMILAR_TO_COMMON_TRIE,
    KI_WORDS_TRIE,
    KI_EXCEPTIONS_TRIE,
    DNA_VTSA_TRIE,
    isInOvBloom,
    isInZeroBloom,
    isInExplicitOv,
    isInExplicitZeroAndOv,
    isInExplicitOvAndZero,
    isInExplicitZeroEnding,
    isEyWord,
    endsInAiOiEi,
    isSvechi,
    isPigorshni,
    isTihoni,
    endsInYiIi,
    endsInNiWithConsonant,
    isBaryshni,
    isKuhni,
    isSotni,
    getMenaEnding,
    getSemenaEnding,
    isUlii,
    endsInYaIa,
    isZYaFamily,
    getYtsyEnding,
    isYiki,
    endsInNe,
    isGrozdia,
    isMessii,
    isChaKleFamily,
} from '../settings/declinePluralConfig.js';

// --- Module-level constants (hoisted from per-call allocation) ---

// Plural declension endings: [hard, mid, soft] per case
// Row 0: genitive (2), 1: dative (3), 2: accusative (4), 3: instrumental (5), 4: prep/loc (6-7)
const PLURAL_ENDINGS = [
    ['х', 'ых', 'их'],    // genitive
    ['м', 'ым', 'им'],    // dative
    ['х', 'ых', 'их'],    // accusative
    ['ми', 'ыми', 'ими'], // instrumental
    ['х', 'ых', 'их']     // prepositional / locative
];

// grCaseNumber (2-7) → row index; locative (7) shares with prepositional (6)
const PLURAL_ENDING_ROW = { 2: 0, 3: 1, 4: 2, 5: 3, 6: 4, 7: 4 };

// Stem-vowel endings: [soft, hard] per case
// Row 0: dative (3), 1: instrumental (5), 2: prep/loc (6-7)
const PLURAL_ENDINGS_STEM = [
    ['ям', 'ам'],  // dative
    ['ями', 'ами'], // instrumental
    ['ях', 'ах']   // prepositional / locative
];

// grCaseNumber (3,5,6,7) → row index; locative (7) shares with prepositional (6)
const PLURAL_STEM_ROW = { 3: 0, 5: 1, 6: 2, 7: 2 };

const GENITIVE_STRESS_DEPENDENT = ['жки', 'шки', 'чки', 'ножны'];
const GENITIVE_CONSONANT_CLUSTERS = ['кн', 'кл', 'дк', 'нк', 'пк', 'зк', 'рк', 'тк', 'вк', 'лк', 'мк'];
const GENITIVE_SESTRY = ['сестры', 'сёстры', 'серьги'];
const GENITIVE_SOFT_CLUSTERS = ['льц', 'сьм', 'деньг', 'ьк', 'йк', 'дьб'];
const GENITIVE_ZEMLI = ['земли', 'петли', 'пли', 'вли'];
const GENITIVE_YAT_DEVER = ['зять', 'деверь'];


export function declinePlural(engine, lemma, caseIndex, plural) {
    const lcPlural = toLowerCaseRu(plural);

    const lcLastChar = last(lcPlural);
    const lcLastBit = lcBit(lcLastChar);

    const grCaseNumber = caseIndex + 1;

    if ((grCaseNumber === 1) || ((grCaseNumber === 4) && !lemma.isAnimate())) {
        return plural;
    } else if (0b1000000000000000000100000000 & lcLastBit) {
        if ((grCaseNumber === 2) || (grCaseNumber === 4)) {
            if (lcPlural.endsWith('овичи') || lcPlural.endsWith('евичи')) {
                return init(plural) + 'ей';
            } else if ((lcPlural.endsWith('вны') || lcPlural.endsWith('полусотни')) && lcPlural !== 'овны') {
                return dropLast(plural, 2) + 'ен';
            }
        } else if (grCaseNumber === 5) {
            if ((lcPlural.endsWith('дети') || lcPlural.endsWith('люди'))
                    && !lcPlural.endsWith('нелюди')) {
                return init(plural) + 'ьми';
            } else if (lcPlural.endsWith('вери') || lcPlural.endsWith('дочери')) {
                return [init(plural) + 'ями', init(plural) + 'ьми'];
            }
        }
    }

    const gender = getIntGender(lemma);
    const stem = lcPlural.endsWith('цы') ? init(plural) : getNounStem0(plural, lcPlural);

    const isSurnameType1 =
        endsWithSuffix(lcPlural, surnameType1Plural) &&
        (lemma.isASurname() || (gender === COM)) &&
        !endsWithSuffix(lcPlural, EXPLICIT_ZERO_SURNAMES_TREE);

    // grCaseNumber >= 2 here; locative (7) shares endings with prepositional (6)
    const endings = PLURAL_ENDINGS[PLURAL_ENDING_ROW[grCaseNumber]];

    if (isSurnameType1 || lcPlural.endsWith('ничьи')) {
        return plural + endings[0];
    } else if (lcPlural.endsWith('ые')) {
        return dropLast(plural, 2) + endings[1];
    } else if (lcPlural.endsWith('ие') || endsWithSuffix(lcPlural, egoSoftPlural)) {
        return stem + endings[2];

    } else if ((grCaseNumber > 2) && (grCaseNumber !== 4)) {
        const stemEndings = PLURAL_ENDINGS_STEM[PLURAL_STEM_ROW[grCaseNumber]];

        if (endsWithSuffix(lcPlural, SOFT_ENDINGS_TRIE)) {
            return init(plural) + stemEndings[0];
        } else if (engine.sd.hasStressedEndingPlural(lemma, caseIndex).includes(true)) {
            return unYo(stem) + stemEndings[1];
        } else {
            return stem + stemEndings[1];
        }

    } else {
        const declension = lemma.getDeclension();

        const genitiveStem = () => {
            const lcStem = toLowerCaseRu(stem);

            if ((
                endsWithAny(lcStem, GENITIVE_CONSONANT_CLUSTERS) &&
                !lcPlural.endsWith('сумерки')
            ) || (
                lcStem === 'зл'
            ) || (
                endsWithAny(lcPlural, GENITIVE_STRESS_DEPENDENT) &&
                engine.sd.hasStressedEndingPlural(lemma, caseIndex).includes(true)
            )) {
                const end = last(stem);
                return init(stem) + upperLike('о', end) + end;
            } else if ((
                endsWithSuffix(lcPlural, DNA_VTSA_TRIE) &&
                !lcPlural.endsWith('недра')
            ) || (
                endsWithAny(lcPlural, GENITIVE_STRESS_DEPENDENT)
            )) {
                const end = charFromEnd(plural, 2);
                return dropLast(plural, 2) + upperLike('е', end) + end;
            } else if (
                endsWithAny(lcPlural, GENITIVE_SESTRY)
            ) {
                const end = charFromEnd(plural, 2);
                const h = (charFromEnd(lcPlural, 3) === 'ь')
                    ? unYo(dropLast(plural, 3))
                    : unYo(dropLast(plural, 2));
                return h + upperLike('ё', end) + end;
            } else if (endsWithAny(lcStem, GENITIVE_SOFT_CLUSTERS)) {
                const end = last(stem);
                return dropLast(stem, 2) + upperLike('е', end) + end;
            } else if (lcPlural.endsWith('сла') || lcPlural.endsWith('слы')) {
                return init(stem) + 'ел';
            } else {
                return stem;
            }
        };

        if ([3, 0].includes(declension)) {
            if (lcPlural.endsWith('и')) {
                return init(plural) + 'ей';
            } else if (isGrozdia(lcPlural)) {
                return init(plural) + 'ев';
            }
        }

        const lastOf2Initial = charFromEnd(lcPlural, 3);

        if (FEM !== gender) {
            const inOvBloomCheck = isInOvBloom(lcPlural, OV_BLOOM);

            if (inOvBloomCheck && isInExplicitOv(lcPlural)) {
                return init(plural) + 'ов';
            } else if (inOvBloomCheck && isInExplicitZeroAndOv(lcPlural) && !lemma.isAName()) {
                return [
                    genitiveStem(),
                    init(plural) + 'ов'
                ];
            } else if (inOvBloomCheck && isInExplicitOvAndZero(lcPlural)) {
                return [
                    init(plural) + 'ов',
                    genitiveStem()
                ];
            } else if (((gender === COM)
                    && !isEyWord(lcPlural)
                    && !hasChar('жшч', lastOf2Initial))
                || (isInZeroBloom(lcPlural, ZERO_BLOOM) && isInExplicitZeroEnding(lcPlural))
                || (lemma.isAName() && (gender === MASC) && lemma.lower().endsWith('а'))
                || (lemma.lower() === 'барин')) {
                return genitiveStem();
            }

            switch (lcLastChar) {
                case 'и':
                case 'я':

                    if ((
                            endsWithSuffix(lcPlural, BORSCHEE_TRIE) ||
                            ('щи' === lcPlural) ||
                            isEyWord(lcPlural)) ||
                        (lemma.lower().endsWith('ь') && !endsWithAny(lemma.lower(), GENITIVE_YAT_DEVER))) {

                        let s = ('ь' === last(init(lcPlural))) ? dropLast(plural, 2) : init(plural);
                        return s + 'ей';
                    }

                    if (lcLastChar === 'и') {
                        if (isUlii(lcPlural)) {
                            return init(plural) + 'ев';
                        } else if (lcPlural.endsWith('ьи')) {
                            if (MASC === gender) {
                                return init(plural) + 'ёв';
                            } else {
                                return dropLast(plural, 2) + 'ей';
                            }
                        } else if (isChaKleFamily(lcPlural)) {
                            return init(plural) + 'ёв';
                        } else if (lcPlural.endsWith('ищи')) {
                            return genitiveStem();
                        } else if (isMessii(lcPlural)) {
                            return init(plural) + 'й';
                        } else if (bincludes(vowels, charFromEnd(lcPlural, 2))) {
                            return init(plural) + 'ев';
                        } else if (endsWithSuffix(lcPlural, KI_WORDS_TRIE)
                            && ((MASC !== gender) || endsWithSuffix(unYo(lcPlural), MASC_SIMILAR_TO_COMMON_TRIE))
                            && !endsWithSuffix(lemma.lower(), KI_EXCEPTIONS_TRIE)) {
                            return genitiveStem();
                        }
                        return init(plural) + 'ов';
                    } else {
                        if (endsWithSuffix(lcPlural, BRATJA_TRIE)) {
                            return init(plural) + 'ев';
                        } else if (isZYaFamily(lcPlural)) {
                            return init(plural) + 'ёв';
                        } else if (endsInYaIa(lcPlural)) {
                            if (MASC === gender) {
                                return dropLast(plural, 2) + 'ей';
                            } else {
                                return dropLast(plural, 2) + 'ий';
                            }
                        }
                    }

                    break;

                case 'а':
                    const semena = getSemenaEnding(lcPlural);
                    if (semena) {
                        return dropLast(plural, 3) + 'ян';
                    } else if (getMenaEnding(lcPlural)) {
                        return dropLast(plural, 3) + 'ён';
                    } else if (lemma.lower().endsWith('яйцо')) {
                        return upperLike('яиц', init(plural));
                    } else if (lcPlural.endsWith('нца')) {
                        return [genitiveStem(), init(plural) + 'ев'];
                    } else if (!endsWithSuffix(lcPlural, EXPLICIT_OV1_TREE)) {
                        return genitiveStem();
                    }

                    return init(plural) + 'ов';

                case 'ы':
                    if (getYtsyEnding(lcPlural)) {
                        return init(plural);
                    } else if (lcPlural.endsWith('цы')) {
                        return init(plural) + 'ев';
                    }

                    return init(plural) + 'ов';

                default:
                    if (endsInNe(lcPlural)) {
                        return genitiveStem();
                    }
            }
        }

        if (isYiki(lcPlural)) {
            return dropLast(plural, 3) + 'ек';
        } else if (lcPlural.endsWith('ки')) {
            if (lastOf2Initial === 'ь') {
                const end = last(init(plural));
                return dropLast(plural, 3) + upperLike('е', end) + end;
            } else if (hasChar('жшч', lastOf2Initial)) {
                return genitiveStem();
            } else if (bincludes(consonantsExceptJ, lastOf2Initial)) {
                return dropLast(plural, 2) + 'ок';
            }
        }

        if (isEyWord(lcPlural)) {
            return init(plural) + 'ей';
        } else if (endsInAiOiEi(lcPlural)) {
            return init(plural) + 'й';
        } else if (isSvechi(lcPlural)) {
            return [init(plural), init(plural) + 'ей'];
        } else if (isPigorshni(lcPlural)) {
            return [init(plural) + 'ей', dropLast(plural, 2) + 'ен'];
        } else if (isTihoni(lcPlural)) {
            return [dropLast(plural, 2) + 'нь', init(plural) + 'ей'];
        }

        if (endsInYiIi(lcPlural)) {
            if (engine.sd.hasStressedEndingSingular(lemma, caseIndex).includes(true)) {
                return dropLast(plural, 2) + 'ей';
            } else {
                return dropLast(plural, 2) + 'ий';
            }
        }

        if (endsInNiWithConsonant(lcPlural)) {
            if (isBaryshni(lcPlural)) {
                return dropLast(plural, 2) + 'ень';
            } else if (isKuhni(lcPlural)) {
                return dropLast(plural, 2) + 'онь';
            } else if (isSotni(lcPlural)) {
                return [dropLast(plural, 2), dropLast(plural, 2) + 'ен'];
            } else {
                return dropLast(plural, 2) + 'ен';
            }
        }

        if (toLowerCaseRu(stem).endsWith('ийк')) {
            return dropLast(stem, 2) + 'ек';
        }

        if ((stem.length === lcPlural.length - 1) && endsWithSuffix(lcPlural, SOFT_ENDINGS_TRIE)) {

            const ch2 = charFromEnd(stem, 2).charCodeAt(0);

            if (
                (ch2 === LOWERCASE_A + 9        // й
                || ch2 === LOWERCASE_A + 28     // ь
                || ch2 === UPPERCASE_A + 9      // Й
                || ch2 === UPPERCASE_A + 28)    // Ь
                && !lemma.isAnimate()
            ) {
                const end = last(stem);
                return dropLast(stem, 2) + upperLike('е', end) + end;
            } else if (endsWithAny(lcPlural, GENITIVE_ZEMLI)) {
                return init(stem) + 'ель';
            } else {
                return stem + 'ь';
            }

        } else {
            return genitiveStem();
        }

    }

    return plural;
}
