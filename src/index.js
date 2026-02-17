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


    const en2a2b = [
        'ясень', 'бюллетень', 'олень', 'тюлень',
        'гордень', 'пельмень',
        'ячмень'
    ];


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

    const reYo = s => {
        const index = Math.max(
            s.toLowerCase().lastIndexOf('е'),
            s.toLowerCase().lastIndexOf('ё')
        );
        const r = upperLike('ё', s[index]);
        return s.substring(0, index) + r + s.substring(index + 1);
    };

    const singleEYo = s => (s.replace(/[^её]/g, '').length === 1);

}
