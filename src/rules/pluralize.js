import { Case } from "../Case.js";
import { Gender } from "../Gender.js";
import { getNounStem, okWord, egoEndings, egoSoftM, tsStem, eStem } from "./common.js";
import { softD1, isAdjectiveLike } from "./decline1.js";
import { specialD3 } from "./decline3.js";
import { createReversedTrie, endsWithSuffix } from "../utils/trie.js";
import { unique } from "../utils/lists.js";
import { bincludes, vowels } from "../utils/alphabet.js";
import { toLowerCaseRu, upperLike } from "../utils/letterCase.js";
import { init, last, takeLast, dropLast, charFromEnd, hasChar, endsWithAny, unYo } from "../utils/strings.js";
import { getPluralForms } from "../settings/irregularNouns.js";

// Слова в первом склонении, которые оканчиваются на -я в мн.ч.,
// и у них нужно преобразовывать основу особым образом (мягкие знаки и т.п.)
const yaD1 = [
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

// Слова муж.р., которые оканчиваются на -а/-я в мн.ч.
const aYaWords = new Set([
    'берег', 'бок', 'борт',
    'век', 'вес',
    'веер', // TODO: Это всё тоже вынести в настройку (в экземпляре движка).
    'вексель', // 😰
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
    'том', // TODO неодушевленное (не имя).
    'холод', 'цвет', 'череп'
]);

// То же самое, но мы проверяем их не по точному совпадению, а по концу слова.
// Например, "чудо-остров", "мультипаспорт" распознаются как "остров", "паспорт".
const aYaWords2 = createReversedTrie([
    'округ', 'остров', 'отпуск',
    'паспорт', 'парус', 'поезд', 'повар', 'погреб',
    'рукав',
    'цех',
    'юнкер'
]);

// Мы ступаем на скользкую территорию.
// В этом массиве слова, которые могут оканчиваться и на -а/-я, и на -и/-ы,
// и мы считаем окончание -а/-я более распространённым.
const aYaWords3 = new Set([
    'адрес',
    'договор',
    'буфер',
    'ворох',
    'директор',
    'инспектор', 'инструктор',
    'корпус', // TODO омонимы
    'крейсер',
    'орден', 'ордер', 'прожектор', 'пропуск', 'род',
    'свитер', 'сервер',
    'тенор', 'тон', 'трактор',
    'тормоз', // TODO наверно, ы только в одушевленной форме
    'ветер',
    'верх',
    'китель',
    'мех',
    'хлеб',
    'юнкер', // 🤕
    'ястреб'
]);

// То же самое, только мы считаем окончание -и/-ы более распространённым.
const aYaWords4 = new Set([
    'бункер',
    'вымпел',
    'год',
    'образ', // Разделить на омонимы?
    'омут',
    'токарь', 'тополь',
    'шторм', 'штуцер'
]);

const reYo = s => {
    const index = Math.max(
        s.toLowerCase().lastIndexOf('е'),
        s.toLowerCase().lastIndexOf('ё')
    );
    const r = upperLike('ё', s[index]);
    return s.substring(0, index) + r + s.substring(index + 1);
};

const singleEYo = s => (s.replace(/[^её]/g, '').length === 1);

export function pluralize(engine, lemma) {
    const result = [];

    const word = lemma.text();
    const lcWord = toLowerCaseRu(word);

    const stressedEnding = engine.sd
        .hasStressedEndingPlural(lemma, Case.NOMINATIVE);

    Object.freeze(stressedEnding);

    const stem = getNounStem(lemma, lcWord, stressedEnding[0]);
    const lcStem = toLowerCaseRu(stem);

    if (lcWord.endsWith('яя')) {
        result.push(dropLast(word, 2) + 'ие');
        return unique(result);
    }

    const yoStem = (f) => {
        const stressedStem = engine.sd
            .hasStressedEndingPlural(lemma, Case.NOMINATIVE).map(x => !x);

        if (!stressedStem.length) {
            return [f(stem)];
        }

        return stressedStem.map(b => b
            ? (singleEYo(lcStem) ? f(reYo(stem)) : f(stem))
            : f(unYo(stem))
        );
    };

    const gender = lemma.getGender();
    const declension = lemma.getDeclension();

    const simpleFirstPart = (('й' === last(lcWord) || bincludes(vowels, last(lcWord))) && bincludes(vowels, last(init(lcWord))))
        ? init(word)
        : stem;

    const softPatronymic = () => (lcWord.endsWith('евич') || lcWord.endsWith('евна'))
        && (lcWord.indexOf('ье') >= 0);

    function softPatronymicForm2() {
        const part = simpleFirstPart;
        const index = toLowerCaseRu(part).indexOf('ье');
        const r = upperLike('и', part[index]);
        return part.substring(0, index) + r + part.substring(index + 1);
    }

    function yeruOrI() {
        if (bincludes(0b11101000000000010001001000, last(lcStem))  // sibilant or velar
            || hasChar('яйь', last(lcWord))
            || endsWithAny(lcWord, ['сосед'])) {

            if (softPatronymic()) {
                result.push(softPatronymicForm2() + 'и');
                result.push(simpleFirstPart + 'и');
            } else {
                Array.prototype.push.apply(result,
                    eStem(stressedEnding, simpleFirstPart, s => s + 'и'));
            }

        } else if (last(lcWord) === 'ц') {
            result.push(tsStem(word, lemma) + 'цы');

        } else {

            if (softPatronymic()) {
                result.push(softPatronymicForm2() + 'ы');
                result.push(simpleFirstPart + 'ы');
            } else {
                Array.prototype.push.apply(result,
                    eStem(stressedEnding, simpleFirstPart, s => s + 'ы'));
            }

        }
    }

    const irregularPluralForms = getPluralForms(lemma, lcWord);
    if (irregularPluralForms) {
        return irregularPluralForms;
    }

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

    switch (declension) {
        case -1:
            result.push(word);
            break;
        case 0:
            if (lcWord === 'путь') {
                result.push('пути');
            } else if (lcWord.endsWith('дитя')) {
                result.push(dropLast(word, 3) + 'ети');
            } else {
                throw new Error('unsupported');
            }
            break;
        case 1:
            if (yaD1.includes(lcWord)) {

                result.push(softStemD1 + 'я');

            } else if (Gender.MASCULINE === gender) {

                const ya2 = [
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

                const ya3 = [
                    'клин', 'колос', 'ком', 'край', 'соболь'
                ];

                if ('сын' === lcWord) {

                    result.push('сыновья');
                    yeruOrI();

                } else if ('человек' === lcWord) {

                    result.push('люди');
                    yeruOrI();

                } else if (ya2.includes(lcWord) || (lcWord === 'соболь' && lemma.isAnimate())) {

                    yeruOrI();
                    result.push(softStemD1 + 'я');

                } else if (ya3.includes(lcWord)) {

                    result.push(softStemD1 + 'я');

                } else if (aYaWords.has(lcWord) || endsWithSuffix(lcWord, aYaWords2)
                    || aYaWords3.has(lcWord) || aYaWords4.has(lcWord)) {

                    if (aYaWords4.has(lcWord)) {
                        yeruOrI();
                    }

                    if (softD1(lcWord)) {
                        Array.prototype.push.apply(result, yoStem(s => s + 'я'));
                    } else if (stressedEnding.includes(true)) {
                        result.push(unYo(stem) + 'а');
                    } else {
                        result.push(stem + 'а');
                    }

                    if (aYaWords3.has(lcWord)) {
                        yeruOrI();
                    }

                } else if (
                    (((lcWord.endsWith('анин') && lcWord.length > 5) || lcWord.endsWith('янин')) && !lemma.isAName())
                    || ['барин', 'боярин'].includes(lcWord)
                ) {
                    result.push(dropLast(word, 2) + 'е');

                    // В корпусе фигурирует
                    if ('барин' === lcWord) {
                        result.push(dropLast(word, 2) + 'ы');
                    }

                } else if (['цыган'].includes(lcWord)) {
                    result.push(word + 'е');
                } else if ('щенок' === lcWord) {
                    result.push(dropLast(word, 2) + 'ки');
                    result.push(dropLast(word, 2) + 'ята');
                } else if ((lcWord.endsWith('ребёнок') || lcWord.endsWith('ребенок'))
                    && !(lcWord.endsWith('жеребёнок') || lcWord.endsWith('жеребенок'))
                    && !(lcWord.endsWith('ястребёнок') || lcWord.endsWith('ястребенок'))) {
                    result.push(dropLast(word, 7) + 'дети');
                } else if ((lcWord.endsWith('ёнок') || lcWord.endsWith('енок'))
                    && lemma.isAnimate()) {
                    result.push(dropLast(word, 4) + 'ята');
                } else if (lcWord.endsWith('ёночек')
                    && lemma.isAnimate()) {
                    result.push(dropLast(word, 6) + 'ятки');
                } else if (lcWord.endsWith('онок')
                    && hasChar('жшч', charFromEnd(lcWord, 5))
                    && lemma.isAnimate()) {
                    result.push(dropLast(word, 4) + 'ата');
                } else if (okWord(lcWord)) {
                    result.push(dropLast(word, 2) + 'ки');
                } else if (endsWithSuffix(lcWord, egoEndings)) {
                    if (endsWithAny(lcWord, egoSoftM)) {
                        result.push(dropLast(word, 2) + 'ьи');
                    } else {
                        result.push(init(word) + 'е');
                    }
                } else if (isAdjectiveLike(lemma, lcWord)) {
                    if (lcWord.endsWith('ый') || lcWord.endsWith('ий')) {
                        result.push(init(word) + 'е');
                    } else if (lcWord.endsWith('ой') && !endsWithAny(lcWord, ['хой', 'ской'])) {
                        result.push(dropLast(word, 2) + 'ые');
                    } else {
                        result.push(dropLast(word, 2) + 'ие');
                    }
                } else if (lcWord.endsWith('его')) {
                    result.push(dropLast(word, 3) + 'ие');
                } else if ([
                    'воробей', 'муравей', 'ручей', 'соловей', 'улей',
                    'жеребей', // — жребий; доля поместья.
                    'ирей', // Довольно бессмысленно в мн. ч.
                    'репей', 'чирей' // Я бы сказал "-еи", но в словарях так.
                ].includes(lcWord)) {
                    result.push(dropLast(word, 2) + 'ьи');
                } else {
                    yeruOrI();
                }

            } else if (Gender.NEUTER === gender) {

                if (endsWithAny(lcWord, ['ко', 'чо'])
                    && !endsWithAny(lcWord, ['войско', 'облако'])
                ) {
                    result.push(init(word) + 'и');
                } else if (lcWord.endsWith('имое')) {
                    result.push(stem + 'ые');

                } else if (lcWord.endsWith('ее')) {
                    result.push(stem + 'ие');

                } else if (lcWord.endsWith('ое')) {

                    if (endsWithAny(lcStem, ['г', 'к', 'ж', 'ш', 'х'])) {
                        result.push(stem + 'ие');
                    } else {
                        result.push(stem + 'ые');
                    }

                } else if (endsWithAny(lcWord, ['ие', 'иё'])) {
                    result.push(dropLast(word, 2) + 'ия');

                } else if (endsWithAny(lcWord, ['ье', 'ьё'])) {

                    const w = dropLast(word, 2);

                    const softSignOnly = [
                        'безделье', 'варенье', 'воскресенье',
                        'жалованье',    // ИМХО, спорно
                        'запястье', 'застолье', 'затишье', 'здоровье', 'зелье',
                        'изголовье', 'новоселье', 'одночасье',
                        // Я бы добавил сюда "ожерелье",
                        // хотя форма "ожерелия" в гугле встречается.
                        'печенье', 'платье', 'побережье', 'поголовье', 'подворье',
                        'подземелье', 'подполье', 'поместье', 'предплечье', 'раздумье',
                        'сиденье',  // место для сидения
                        'средневековье', 'увечье', 'угодье', 'устье'
                    ].includes(lcWord);

                    if ((last(lcWord) === 'е') && !softSignOnly) {
                        result.push(w + 'ия');
                    }

                    result.push(w + 'ья');

                } else if (endsWithAny(lcWord, [
                    'дерево', 'звено', 'крыло'
                ])) {
                    result.push(stem + 'ья');
                } else if (endsWithAny(lcWord, ['ле', 'ре'])) {
                    result.push(stem + 'я');
                } else if (lcWord.endsWith('судно') && lemma.isATransport()) {
                    result.push(dropLast(word, 2) + 'а');
                } else {
                    Array.prototype.push.apply(result, yoStem(s => s + 'а'));

                    if (endsWithAny(lcWord, [
                        'щупальце'
                    ])) {
                        yeruOrI();
                    }

                }
            } else {
                result.push(stem + 'и');
            }
            break;
        case 2:
            if ('заря' === lcWord) {
                result.push('зори');

            } else if (lcWord.endsWith('ая') && !lcWord.endsWith('свая')) {
                if (hasChar('жхчшщ', last(lcStem)) || endsWithAny(lcStem, ['вк', 'гк', 'ск', 'цк', 'ньк'])) {
                    result.push(stem + 'ие');
                } else {
                    result.push(stem + 'ые');
                }
            } else {
                yeruOrI();
            }
            break;
        case 3:
            if (takeLast(lcWord, 2) === 'мя') {
                result.push(stem + 'ена');
            } else if (Object.keys(specialD3).includes(lcWord)) {
                result.push(init(specialD3[lcWord]) + 'и');
            } else if (Gender.FEMININE === gender) {
                result.push(simpleFirstPart + 'и');
            } else {
                if (last(simpleFirstPart) === 'и') {
                    result.push(simpleFirstPart + 'я');
                } else {
                    result.push(simpleFirstPart + 'а');
                }
            }
            break;
    }

    return unique(result);
}
