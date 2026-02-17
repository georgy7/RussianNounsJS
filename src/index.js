/*!
  RussianNounsJS v3.0.0-alpha.0
  Copyright (c) 2011-2026 Georgy Ustinov
  Released under the MIT license
*/


export { Case, CaseValues as CASES } from "./Case.js";
export { Gender } from "./Gender.js";
export { LocativeFormAttribute, LocativeForm } from "./LocativeForm.js";
export { Lemma, createLemma, createLemmaOrNull } from "./Lemma.js";
export { Engine } from "./Engine.js";
export { StressDictionary } from "./StressDictionary.js";



function removeLater() {
    'use strict';

    // Ссылки:
    // - Современный русский язык. Морфология - Камынина А.А., Уч. пос. 1999 - 240 с.
    // - Статья http://en.wikipedia.org/wiki/Russian_grammar
    // - Плунгян В. А. К семантике русского локатива («второго предложного» падежа)
            // Семиотика и информатика. 2002. Вып. 37. С. 229-254
    // - Открытый корпус http://opencorpora.org/
    // - Национальный корпус русского языка https://ruscorpora.ru/

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

    const mobileVowelABloom = new Uint8ClampedArray(256);
    mobileVowelA.forEach(h => bloomAdd(mobileVowelABloom, to11BitHash(h)));

    const mobileVowelB = createReversedTrie([
        'овёс', 'ковёр', 'костёр',
        'шатер', 'шатёр', 'козел', 'козёл', 'котел', 'котёл',
        'орел', 'орёл', 'осел', 'осёл',
        'узел', 'уголь', 'чок', 'ешок', 'хол'
    ]);

    const en2a2b = [
        'ясень', 'бюллетень', 'олень', 'тюлень',
        'гордень', 'пельмень',
        'ячмень'
    ];

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

    // decline1
    const uForm = new Set((
        'клей,чай,' +
        'дом,дух,дым,дымок,газ,год,горошек,' +
        'жар,жир,квас,' +
        'пар,пыл,род,рост,' +
        'сахар,свет,сироп,смех,снег,снежок,сок,сор,спор,срок,соус,спирт,страх,суп,сыр,' +
        'табак,творог,толк,торф,туман,' +
        'убыток,укроп,уксус,ход,' +
        'цемент,чеснок,' +
        'шаг,шик,' +
        'шиповник,' + // про отвар/сироп
        'шоколад,шорох,шум,яд'
    ).split(','));

    const uFormBloom = new Uint8ClampedArray(256);
    uForm.forEach(w => bloomAdd(uFormBloom, to11BitHash(calculateHash(w))));


    const endingsOfAdjectives = createReversedTrie([
        'мой', 'ной', 'дой', 'шой', 'жой', 'рзой', 'осой', 'хой',
        'латой', 'витой', 'литой', 'питой', 'житой', 'отой', 'утой', 'ятой',
        'лагой', 'рагой', 'огой', 'угой',
        'лубой', 'любой',
        'илой', 'ылой', 'злой', 'малой',
        'овой', 'евой', 'живой', 'ской', 'акой', 'укой',
        'нний',
        'ский', 'йкий', 'цкий', 'зкий', 'ткий', 'лкий', 'мкий', 'хкий',
        'оркий', 'аркий', 'яркий', 'ький', 'ёкий',
        'бокий', 'оокий', 'cокий', 'токий', 'ликий', 'дикий', 'укий', 'ыкий',
        'який', 'пкий', 'дкий', 'бкий', 'нкий', 'жкий', 'чкий', 'гкий', 'овкий', 'авкий'
    ]);

    const isAdjectiveLike = (lemma, lcWord) => (nLast(lcWord, 2) === 'ый') ||
        ((lcWord.endsWith('кривой') || endsWithSuffix(lcWord, endingsOfAdjectives)) &&
            vowelCount(lcWord) >= 2);

    const jeEndings = createReversedTrie([
        'ий', 'ие', 'чье', 'тье', 'дье', 'вье', 'бье',
        'жалованье',
        'енье', 'ружье', 'божье', 'верье', 'мужье']);

    const ojeEngings = createReversedTrie([
        'вое', 'лое', 'мое', 'ное', 'рое', 'тое', 'той', 'ый']);

    const locativeDictionary = Object.freeze(makeDefaultLocativeDictionary());

    const reYo = s => {
        const index = Math.max(
            s.toLowerCase().lastIndexOf('е'),
            s.toLowerCase().lastIndexOf('ё')
        );
        const r = upperLike('ё', s[index]);
        return s.substring(0, index) + r + s.substring(index + 1);
    };

    const singleEYo = s => (s.replace(/[^её]/g, '').length === 1);



    const softD1 = w => (last(w) === 'ь' && !w.endsWith('господь'))
        || ('её'.includes(last(w)) && !endsWithAny(w, ['це', 'же']));

    function halfSomething(lcWord) {
        if (lcWord.startsWith('пол')
            && bincludes(0b10011000000000000000000100000001, last(lcWord))
            && (lcWord[3] !== 'л')
            && (vowelCount(lcWord) >= 2)) {

            let subWord = lcWord.substring(3);

            // На случай дефисов.
            let offset = subWord.search(/[а-яё]/);

            // Сюда не должны попадать как минимум
            // мягкий и твердый знаки помимо гласных.

            return (offset >= 0) && bincludes(consonants, subWord[offset]);

        } else {
            return false;
        }
    }

    function decline0(engine, lemma, grCase) {
        const word = lemma.text();
        const lcWord = lemma.lower();
        if (lcWord.endsWith('путь')) {
            if (grCase === Case.INSTRUMENTAL) {
                return init(word) + 'ём';
            } else {
                return decline3(engine, lemma, grCase);
            }
        } else if (lcWord.endsWith('дитя')) {
            switch (grCase) {
                case Case.NOMINATIVE:
                case Case.ACCUSATIVE:
                    return word;
                case Case.GENITIVE:
                case Case.DATIVE:
                case Case.PREPOSITIONAL:
                case Case.LOCATIVE:
                    return word + 'ти';
                case Case.INSTRUMENTAL:
                    return [word + 'тей', word + 'тею'];
            }
        } else {
            throw new Error('unsupported');
        }
    }

    const iyWordEndings = createReversedTrie(['й', 'ие', 'иё']);
    const eiWord = createReversedTrie(['воробей', 'муравей', 'ручей', 'соловей', 'улей']);

    function toLocativeSingular1(engine, lemma, declensionType) {
        if (LocativeDeclensionType.U_SUFFIX === declensionType) {
            const word = lemma.text();
            const lcWord = lemma.lower();
            let stem = getNounStem(lemma, lcWord);
            let head = init(word);

            const half = halfSomething(lcWord);
            const soft = (half && lcWord.endsWith('я')) || softD1(lcWord);

            if (last(lcWord) === 'й') {
                return unYo(head) + 'ю';
            } else if (soft) {
                return unYo(stem) + 'ю';
            } else if (okWord(lcWord)) {
                return unYo(init(head)) + 'ку';
            } else {
                return unYo(stem) + 'у';
            }
        } else if (LocativeDeclensionType.PREPOSITIONAL === declensionType) {
            return decline1(engine, lemma, Case.PREPOSITIONAL);
        }
    }

    function toLocativeSingular(engine, declension, lemma, declensionType) {
        switch (declension) {
            case 0:
                return decline0(engine, lemma, Case.PREPOSITIONAL);
            case 1:
                return toLocativeSingular1(engine, lemma, declensionType);
            case 2:
                return decline2(engine, lemma, Case.PREPOSITIONAL);
            case 3:
                return decline3(engine, lemma, Case.PREPOSITIONAL);
        }
    }
}
