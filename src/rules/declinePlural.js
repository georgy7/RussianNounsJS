import { CaseValues } from "../Case.js";
import { Gender } from "../Gender.js";
import { getNounStem0, egoSoftPlural } from "./common.js";
import { surnameType1Plural } from "./names.js";
import { BloomFilter, toFakeHash } from "../utils/bloom.js";
import { createReversedTrie, endsWithSuffix } from "../utils/trie.js";
import { bincludes, lcBit, vowels, consonantsExceptJ } from "../utils/alphabet.js";
import { toLowerCaseRu, upperLike } from "../utils/letterCase.js";
import { init, last, dropLast, charFromEnd, hasChar, endsWithAny, unYo } from "../utils/strings.js";

const declinePluralSoftEndings = createReversedTrie([
    'ли', 'си', 'би', 'ви', 'ди', 'ти', 'пи', 'ри', 'ни', 'фи', 'зи',
    'ьи', 'ья', 'ия', 'ря', 'ля', 'ая',
    'аи', 'ои', 'уи', 'эи', 'ыи', 'яи', 'ёи', 'юи', 'еи', 'ии'
]);

const declinePluralEy = [
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

const explicitZeroEndingCommonGenderSurnameLike = [
    'головы', 'громадины', 'детины', 'деревенщины', 'дохлятины', 'дубины',
    'ехидины', 'жадины', 'зверины', 'идиотины', 'кислятины', 'молодчины',
    'орясины', 'остолопины',
    'сиротины', 'скотины', 'старейшины', 'старины', 'старшины',
    'уродины'
];

const explicitZeroSurnameLikeTree = createReversedTrie(explicitZeroEndingCommonGenderSurnameLike);

// Очень много исключений. Наверно, это можно как-то отрефакторить.

// Слова на "а", которые легко склеиваются с другими корнями.
// Например, "киберлеса", "электропоезда", "аэросуда", "протогорода".
// При этом, в корпусе если даже и есть другие слова,
// заканчивающиеся на эти строки, в род. п. они тоже заканчиваются на "ов".
const explicitOv1 = [
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

const explicitOv1Tree = createReversedTrie(explicitOv1);

const explicitOv = new Set(explicitOv1.concat([
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
    'свинцы', // есть такое слово?
    'сорта', 'соуса', 'спецы', 'стога', 'столбцы', 'стрельцы',
    'творцы', 'тельцы', 'тенора', 'терема', 'тома', 'тона', 'торцы',
    'хлеба', 'штришки', 'юнцы'
]));

const explicitZeroAndOv = new Set([
    'авары',
    'аланы', 'аршины', 'баклажаны', 'буквы', 'гольфы', 'граммы', 'гусары',
    'дела', 'кадеты', 'килограммы', 'омы', 'помидоры', 'рентгены',
    'ботинки', 'человеки', 'чулки', 'шорты'
]);

const explicitOvAndZero = new Set([
    'гектары', 'рельсы'
]);

const ovBloom = new BloomFilter();
explicitOv.forEach(s => ovBloom.addRaw(toFakeHash(s)));
explicitZeroAndOv.forEach(s => ovBloom.addRaw(toFakeHash(s)));
explicitOvAndZero.forEach(s => ovBloom.addRaw(toFakeHash(s)));

const explicitZeroEnding = new Set(explicitZeroEndingCommonGenderSurnameLike.concat([
    'абазины', 'авы', 'аввы',
    'бедняги', 'бедолаги', 'болгары', 'бродяги', 'брызги', 'брюки', 'брюхи', 'будды', 'бусы',
    'валенки', 'веки', 'вельможи', 'верзилы', 'вилы', 'владыки', 'воеводы', 'волосы', 'вояки',
    'главы', 'грузины', 'задворки', 'задиры',
    'железы', // желёз
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
    // См. код функции genitiveStem.
    'дядьки', 'дяденьки', 'зайки', 'кроссовки', 'малютки', 'малолетки',
    'попки', 'турки', 'узы', 'хлопоты', 'шахматы'
]));

const zeroBloom = new BloomFilter();
explicitZeroEnding.forEach(s => zeroBloom.addRaw(toFakeHash(s)));

const declinePluralFlatEndings = [
    'х', 'ых', 'их',
    'м', 'ым', 'им',
    'х', 'ых', 'их',
    'ми', 'ыми', 'ими',
    'х', 'ых', 'их'
];

const declinePluralEndings2 = [
    'ям', 'ам',
    '', '',
    'ями', 'ами',
    'ях', 'ах'
];

const dnaVtsa = createReversedTrie([
    'вна', 'вца', 'вцы', 'пла', 'дца', 'дра', 'судна',
    'рки', 'рцы', 'тлы', 'рна', 'тна', 'енца',
    'десны', 'дёсны',
    'рёбра', 'ребра',
    'сосны'
]);

const borschee = createReversedTrie([
    'жи', 'ши', 'чи',
    'ля', 'ли', 'чи', 'ри', 'ти', 'ди',
    'сани',
    'борщи', 'клещи',
    'товарищи',
    'плащи', 'прыщи', 'хрящи'
]);

const bratja = createReversedTrie([
    'братья', 'брусья', 'деревья', 'донья', 'звенья',
    'клинья', 'клочья', 'коленья', 'колосья', 'колья', 'комья', 'крылья', 'крючья',
    'листья', 'лоскутья', 'лохмотья', 'перья', 'платья', 'поводья', 'прутья',
    'стулья', 'сучья', 'хлопья', 'шилья'
]);

const mascSimilarToCommon = createReversedTrie([
    'ишки', 'дружки', 'тки',
    'папочки', 'дедушки', 'дядюшки', 'батюшки',
    'катанки', 'петрушки', 'шестерки'
]);

const kiWords = createReversedTrie([
    'жки', 'шки', 'чки', 'рки',
    'натки', 'хатки', 'ятки', 'етки', 'чётки',
    'мки', 'нки', 'педки', 'илки'
]);

const kiExceptions = createReversedTrie([
    'шок', 'щок', 'жок', 'зок',
    'аток', 'яток', 'еток'
]);


export function declinePlural(engine, lemma, grCase, plural) {
    const lcPlural = toLowerCaseRu(plural);

    const lcLastChar = last(lcPlural);
    const lcLastBit = lcBit(lcLastChar);

    const grCaseNumber = CaseValues.indexOf(grCase) + 1;

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

    const gender = lemma.getGender();
    const stem = lcPlural.endsWith('цы') ? init(plural) : getNounStem0(plural, lcPlural);

    const isSurnameType1 =
        endsWithSuffix(lcPlural, surnameType1Plural) &&
        (lemma.isASurname() || (gender === Gender.COMMON)) &&
        !endsWithSuffix(lcPlural, explicitZeroSurnameLikeTree);

    // Из-за ветвления вверху функции, здесь grCaseNumber >= 2.
    // Через Math.min локатив приравниваем к предложному падежу.
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
        const itemsPerCase2 = 2;
        const flatIndex2 = itemsPerCase2 * Math.min(
            Math.round(declinePluralEndings2.length / itemsPerCase2 - 1),
            grCaseNumber - 3
        );

        if (endsWithSuffix(lcPlural, declinePluralSoftEndings)) {
            return init(plural) + declinePluralEndings2[flatIndex2];
        } else if (engine.sd.hasStressedEndingPlural(lemma, grCase).includes(true)) {
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
                engine.sd.hasStressedEndingPlural(lemma, grCase).includes(true)
            )) {
                const end = last(stem);
                return init(stem) + upperLike('о', end) + end;
            } else if ((
                endsWithSuffix(lcPlural, dnaVtsa) &&
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
            } else if (['гроздья'].includes(lcPlural)) {
                return init(plural) + 'ев';
            }
        }

        const lastOf2Initial = charFromEnd(lcPlural, 3);

        if (Gender.FEMININE !== gender) {
            const pluralHash = toFakeHash(lcPlural);
            const inOvBloom = ovBloom.hasRaw(pluralHash);

            if (inOvBloom && explicitOv.has(lcPlural)) {
                return init(plural) + 'ов';
            } else if (inOvBloom && explicitZeroAndOv.has(lcPlural) && !lemma.isAName()) {
                return [
                    genitiveStem(),
                    init(plural) + 'ов'
                ];
            } else if (inOvBloom && explicitOvAndZero.has(lcPlural)) {
                return [
                    init(plural) + 'ов',
                    genitiveStem()
                ];
            } else if (((gender === Gender.COMMON)
                    && !endsWithAny(lcPlural, declinePluralEy)
                    && !hasChar('жшч', lastOf2Initial))
                || (zeroBloom.hasRaw(pluralHash) && explicitZeroEnding.has(lcPlural))
                || (lemma.isAName() && (gender === Gender.MASCULINE) && lemma.lower().endsWith('а'))
                || (lemma.lower() === 'барин')) {
                return genitiveStem();
            }

            switch (lcLastChar) {
                case 'и':
                case 'я':

                    if ((
                            endsWithSuffix(lcPlural, borschee) ||
                            ('щи' === lcPlural) ||
                            declinePluralEy.includes(lcPlural)) ||
                        (lemma.lower().endsWith('ь') && !endsWithAny(lemma.lower(), [
                            'зять', 'деверь'
                        ]))) {

                        let s = ('ь' === last(init(lcPlural))) ? dropLast(plural, 2) : init(plural);
                        return s + 'ей';
                    }

                    if (lcLastChar === 'и') {
                        if (lcPlural.endsWith('ульи')) {
                            return init(plural) + 'ев';
                        } if (lcPlural.endsWith('ьи')) {
                            if (Gender.MASCULINE === gender) {
                                return init(plural) + 'ёв';
                            } else {
                                return dropLast(plural, 2) + 'ей';
                            }
                        } else if (['ча', 'кле', 'холу', 'ху'].includes(init(lcPlural))) {
                            return init(plural) + 'ёв';
                        } else if (lcPlural.endsWith('ищи')) {
                            return genitiveStem();
                        } else if (lcPlural.endsWith('мессии')) {
                            return init(plural) + 'й';
                        } else if (bincludes(vowels, charFromEnd(lcPlural, 2))) {
                            return init(plural) + 'ев';
                        } else if (endsWithSuffix(lcPlural, kiWords)
                            && ((Gender.MASCULINE !== gender) || endsWithSuffix(unYo(lcPlural), mascSimilarToCommon))
                            && !endsWithSuffix(lemma.lower(), kiExceptions)) {
                            return genitiveStem();
                        }
                        return init(plural) + 'ов';
                    } else {
                        if (endsWithSuffix(lcPlural, bratja)) {
                            return init(plural) + 'ев';
                        } else if (endsWithAny(lcPlural, ['зятья', 'кумовья', 'деверья', 'края', 'острия'])) {
                            return init(plural) + 'ёв';
                        } else if (endsWithAny(lcPlural, ['ья', 'ия'])) {
                            if (Gender.MASCULINE === gender) {
                                return dropLast(plural, 2) + 'ей';
                            } else {
                                return dropLast(plural, 2) + 'ий';
                            }
                        }
                    }

                    break;

                case 'а':
                    if (endsWithAny(lcPlural, ['семена', 'стремена'])) {
                        return dropLast(plural, 3) + 'ян';
                    } else if (lcPlural.endsWith('мена')) {
                        return dropLast(plural, 3) + 'ён';
                    } else if (lemma.lower().endsWith('яйцо')) {
                        return upperLike('яиц', init(plural));
                    } else if (lcPlural.endsWith('нца')) {
                        return [genitiveStem(), init(plural) + 'ев'];
                    } else if (!endsWithSuffix(lcPlural, explicitOv1Tree)) {
                        return genitiveStem();
                    }

                    return init(plural) + 'ов';

                case 'ы':
                    if (endsWithAny(lcPlural, ['ницы', 'лицы', 'пицы', 'бицы'])) {
                        return init(plural);
                    } else if (lcPlural.endsWith('цы')) {
                        return init(plural) + 'ев';
                    }
                    
                    return init(plural) + 'ов';

                default:
                    if (lcPlural.endsWith('не')) {
                        return genitiveStem();
                    }
            }
        }

        if (lcPlural.endsWith('йки')) {
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

        if (declinePluralEy.includes(lcPlural)) {
            return init(plural) + 'ей';
        } else if (endsWithAny(lcPlural, ['аи', 'ои', 'еи', 'эи', 'уи'])) {
            return init(plural) + 'й';
        } else if ('свечи' === lcPlural) {
            return [init(plural), init(plural) + 'ей'];
        } else if ('пригоршни' === lcPlural) {
            return [init(plural) + 'ей', dropLast(plural, 2) + 'ен'];
        } else if ('тихони' === lcPlural) {
            return [dropLast(plural, 2) + 'нь', init(plural) + 'ей'];
        }

        if (endsWithAny(lcPlural, ['ьи', 'ии'])) {
            if (engine.sd.hasStressedEndingSingular(lemma, grCase).includes(true)) {
                return dropLast(plural, 2) + 'ей';
            } else {
                return dropLast(plural, 2) + 'ий';
            }
        }

        if (lcPlural.endsWith('ни') && bincludes(consonantsExceptJ, charFromEnd(lcPlural, 3))) {
            if (['барышни', 'боярышни', 'деревни'].includes(lcPlural)) {
                return dropLast(plural, 2) + 'ень';
            } else if (lcPlural.endsWith('кухни')) {
                return dropLast(plural, 2) + 'онь';
            } else if (lcPlural === 'сотни') {
                return [dropLast(plural, 2), dropLast(plural, 2) + 'ен'];
            } else {
                return dropLast(plural, 2) + 'ен';
            }
        }

        if (toLowerCaseRu(stem).endsWith('ийк')) {
            return dropLast(stem, 2) + 'ек';
        }

        if ((stem.length === lcPlural.length - 1) && endsWithSuffix(lcPlural, declinePluralSoftEndings)) {

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
