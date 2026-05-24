import { FEM, MASC, NEU, COM } from "../Gender.js";
import { getIntGender } from "../Lemma.js";
import { getNounStem0, egoSoftPlural } from "./common.js";
import { surnameType1Plural } from "./names.js";
import { toFakeHash } from "../utils/bloom.js";
import { endsWithSuffix } from "../utils/trie.js";
import { bincludes, lcBit, vowels, consonantsExceptJ } from "../utils/alphabet.js";
import { toLowerCaseRu, upperLike } from "../utils/letterCase.js";
import { init, last, dropLast, charFromEnd, hasChar, endsWithAny, unYo } from "../utils/strings.js";
import {
    SOFT_ENDINGS_TRIE,
    EY_WORDS,
    EXPLICIT_ZERO_SURNAMES_TREE,
    EXPLICIT_OV1_TREE,
    EXPLICIT_OV,
    EXPLICIT_ZERO_AND_OV,
    EXPLICIT_OV_AND_ZERO,
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
    isSestryFamily,
    getMenaEnding,
    getSemenaEnding,
    isUlii,
    endsInYaIa,
    isZYaFamily,
    getYtsyEnding,
    isKiWord,
    isYiki,
    endsInNe,
    isGrozdia,
    isMessii,
    isChaKleFamily,
    endsInOvichi,
    endsInDetiLiudi,
    endsInVeriDocheri,
    endsInVny
} from '../settings/declinePluralConfig.js';


export function declinePlural(engine, lemma, caseIndex, plural) {
    const lcPlural = toLowerCaseRu(plural);

    const lcLastChar = last(lcPlural);
    const lcLastBit = lcBit(lcLastChar);

    const grCaseNumber = caseIndex + 1;

    if ((grCaseNumber === 1) || ((grCaseNumber === 4) && !lemma.isAnimate())) {
        return plural;
    } else if (0b1000000000000000000100000000 & lcLastBit) {
        if ((grCaseNumber === 2) || (grCaseNumber === 4)) {
            if (endsWithAny(lcPlural, ['овичи', 'евичи'])) {
                return init(plural) + 'ей';
            } else if (endsWithAny(lcPlural, ['вны', 'полусотни']) && (lcPlural !== 'овны')) {
                return dropLast(plural, 2) + 'ен';
            }
        } else if (grCaseNumber === 5) {
            if (endsWithAny(lcPlural, ['дети', 'люди'])
                    && !endsWithAny(lcPlural, ['нелюди'])) {
                return init(plural) + 'ьми';
            } else if (endsWithAny(lcPlural, ['вери', 'дочери'])) {
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

    // Из-за ветвления вверху функции, здесь grCaseNumber >= 2.
    // Через Math.min локатив приравниваем к предложному падежу.
    const declinePluralFlatEndings = [
        'х', 'ых', 'их',
        'м', 'ым', 'им',
        'х', 'ых', 'их',
        'ми', 'ыми', 'ими',
        'х', 'ых', 'их'
    ];

    const itemsPerCase = 3;
    const flatEndingIndex = itemsPerCase * Math.min(
        Math.round(declinePluralFlatEndings.length / itemsPerCase - 1),
        grCaseNumber - 2
    );

    if (isSurnameType1 || lcPlural.endsWith('ничьи')) {
        return plural + declinePluralFlatEndings[flatEndingIndex];
    } else if (lcPlural.endsWith('ые')) {
        return dropLast(plural, 2) + declinePluralFlatEndings[flatEndingIndex + 1];
    } else if (lcPlural.endsWith('ие') || endsWithSuffix(lcPlural, egoSoftPlural)) {
        return stem + declinePluralFlatEndings[flatEndingIndex + 2];

    } else if ((grCaseNumber > 2) && (grCaseNumber !== 4)) {
        const declinePluralEndings2 = [
            'ям', 'ам',
            '', '',
            'ями', 'ами',
            'ях', 'ах'
        ];

        const itemsPerCase2 = 2;
        const flatIndex2 = itemsPerCase2 * Math.min(
            Math.round(declinePluralEndings2.length / itemsPerCase2 - 1),
            grCaseNumber - 3
        );

        if (endsWithSuffix(lcPlural, SOFT_ENDINGS_TRIE)) {
            return init(plural) + declinePluralEndings2[flatIndex2];
        } else if (engine.sd.hasStressedEndingPlural(lemma, caseIndex).includes(true)) {
            return unYo(stem) + declinePluralEndings2[flatIndex2 + 1];
        } else {
            return stem + declinePluralEndings2[flatIndex2 + 1];
        }

    } else {
        const declension = lemma.getDeclension();

        const genitiveStem = () => {
            const lcStem = toLowerCaseRu(stem);

            const dependsOnStress = ['жки', 'шки', 'чки', 'ножны'];

            if ((
                endsWithAny(lcStem, ['кн', 'кл', 'дк', 'нк', 'пк', 'зк', 'рк', 'тк', 'вк', 'лк', 'мк']) &&
                !endsWithAny(lcPlural, ['сумерки'])
            ) || (
                lcStem === 'зл'
            ) || (
                endsWithAny(lcPlural, dependsOnStress) &&
                engine.sd.hasStressedEndingPlural(lemma, caseIndex).includes(true)
            )) {
                const end = last(stem);
                return init(stem) + upperLike('о', end) + end;
            } else if ((
                endsWithSuffix(lcPlural, DNA_VTSA_TRIE) &&
                !lcPlural.endsWith('недра')
            ) || (
                endsWithAny(lcPlural, dependsOnStress)
            )) {
                const end = charFromEnd(plural, 2);
                return dropLast(plural, 2) + upperLike('е', end) + end;
            } else if (
                endsWithAny(lcPlural, [
                    'сестры', 'сёстры', 'серьги'
                ])
            ) {
                const end = charFromEnd(plural, 2);
                const h = (charFromEnd(lcPlural, 3) === 'ь')
                    ? unYo(dropLast(plural, 3))
                    : unYo(dropLast(plural, 2));
                return h + upperLike('ё', end) + end;
            } else if (endsWithAny(lcStem, ['льц', 'сьм', 'деньг', 'ьк', 'йк', 'дьб'])) {
                const end = last(stem);
                return dropLast(stem, 2) + upperLike('е', end) + end;
            } else if (endsWithAny(lcPlural, ['сла', 'слы'])) {
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
                        (lemma.lower().endsWith('ь') && !endsWithAny(lemma.lower(), [
                            'зять', 'деверь'
                        ]))) {

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

            if (hasChar('ьй', toLowerCaseRu(charFromEnd(stem, 2))) && !lemma.isAnimate()) {
                const end = last(stem);
                return dropLast(stem, 2) + upperLike('е', end) + end;
            } else if (endsWithAny(lcPlural, ['земли', 'петли', 'пли', 'вли'])) {
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
