/*
  Copyright (c) 2011-2019 Устинов Георгий Михайлович

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
*/
(function () {
    'use strict';

    // Ссылки:
    // - Современный русский язык. Морфология - Камынина А.А., Уч. пос. 1999 - 240 с.
    // - Статья http://en.wikipedia.org/wiki/Russian_grammar
    // - К семантике русского локатива - Плунгян В. А., Семиотика и информатика. - Вып. 37. - М., 2002. - С. 229-254

    //------------------------------
    // API
    //------------------------------
    const RussianNouns = {
        cases: () => {
            return {
                NOMINATIVE: 'именительный',
                GENITIVE: 'родительный',
                DATIVE: 'дательный',
                ACCUSATIVE: 'винительный',
                INSTRUMENTAL: 'творительный',
                PREPOSITIONAL: 'предложный',

                /**
                 * Важно понимать, что отличающийся от предложного падежа локатив иногда используется
                 * только с одним предлогом (только «в» или только «на»), а с другим или вообще
                 * не употребляется, или склоняется иначе.
                 *
                 * Например, мы говорим «на ветру», «в тылу (врага)». Но мы не говорим «в ветру», «на тылу».
                 * Обычно говорят «на тыльной стороне чего-либо» и, возможно, «в ветре» (скорее «в воздухе»).
                 *
                 * Мы говорим «на бегу», но также «в беге».
                 *
                 * Есть существительные, которые одинаково используются с предлогами «в» и «на».
                 * Например: в снегу — на снегу, во льду — на льду, в пуху — на пуху.
                 *
                 * В. А. Плунгян выделяет у слов мужского рода с особыми формами локатива
                 * семь семантических классов:
                 *  1. вместилища («в»);
                 *  2. пространства («в»);
                 *  3. конфигурации объектов, образующих устойчивые структуры (например, «ряд», «строй» — «в»);
                 *  4. поверхности («на»);
                 *  5. объекты с функциональной поверхностью («на»);
                 *  6. вещества («в» и «на»);
                 *  7. ситуации («в» и «на»).
                 *
                 * А также, у слов женского рода третьего склонения с особыми формами локатива
                 * пять семантических классов.
                 * Однако, у локатива в словах женского рода третьего склонения отличается от предложного падежа
                 * только ударение — смещается на последний слог, на письме они не отличаются.
                 */
                LOCATIVE: 'местный'
            };
        },
        caseList: () => {
            return [
                RussianNouns.cases().NOMINATIVE,
                RussianNouns.cases().GENITIVE,
                RussianNouns.cases().DATIVE,
                RussianNouns.cases().ACCUSATIVE,
                RussianNouns.cases().INSTRUMENTAL,
                RussianNouns.cases().PREPOSITIONAL,
                RussianNouns.cases().LOCATIVE
            ];
        },
        declensions: () => {
            return {
                0: 'разносклоняемые "путь" и "дитя"',
                1: 'муж., средний род без окончания',
                2: 'слова на "а", "я" (м., ж. и общий род)',
                3: 'жен. род без окончания, слова на "мя"'
            };
        },
        genders: () => {
            return {
                "FEMININE": "женский",
                "MASCULINE": "мужской",
                "NEUTER": "средний",
                "COMMON": "общий"
            };
        },
        Lemma: class Lemma {
            constructor(nominativeSingular, gender, pluraliaTantum, indeclinable, animate, surname) {
                this.pluraliaTantum = pluraliaTantum;
                this.indeclinable = indeclinable;
                this.animate = animate;
                this.surname = surname;
                if ((nominativeSingular == null) || (gender == null)) {
                    throw 'A word and a grammatical gender required.';
                }
                if (!Object.values(RussianNouns.genders()).includes(gender)) {
                    throw 'Bad grammatical gender.';
                }
                this.nominativeSingular = '' + nominativeSingular;
                this.internalGender = gender;
            }

            clone() {
                return new RussianNouns.Lemma(
                    this.nominativeSingular,
                    this.internalGender,
                    this.pluraliaTantum,
                    this.indeclinable,
                    this.animate,
                    this.surname
                );
            }

            text() {
                return this.nominativeSingular;
            }

            isPluraliaTantum() {
                return this.pluraliaTantum;
            }

            isIndeclinable() {
                return this.indeclinable;
            }

            isAnimate() {
                return this.animate || this.surname;
            }

            isSurname() {
                return this.surname;
            }

            gender() {
                return this.internalGender;
            }

        },
        createLemma: (o) => {
            if (o instanceof RussianNouns.Lemma) {
                return o;
            }
            return new RussianNouns.Lemma(o.text, o.gender, o.pluraliaTantum, o.indeclinable, o.animate, o.surname);
        },

        /**
         * «Названия „первое склонение“ и „второе склонение“ в школьной практике и вузовском преподавании
         * нередко закрепляются за разными разрядами слов. В школьных учебниках первым склонением называют изменение
         * слов с окончанием -а (вода), во многих вузовских пособиях и академических грамматиках — слов мужского
         * рода (стол) и среднего рода (окно)».
         *
         * Современный русский язык. Морфология — Камынина А.А., Уч. пос. 1999, страница 67,
         * § 36 Склонение имен существительных
         *
         * @param lemma
         * @returns {number} Склонение по Камыниной; -1 для несклоняемых существительных.
         */
        getDeclension: (lemma) => {
            return getDeclension(RussianNouns.createLemma(lemma));
        },

        /**
         * Почти везде указывают именно это число. Например, в Викисловаре.
         *
         * Неправильно работает для существительных pluralia tantum («ножницы», «дрожжи», «белила» и т.п.).
         *
         * @param lemma
         * @returns {number} «Школьный» вариант склонения (вода — первое склонение; стол, окно — второе склонение). Для несклоняемых возвращает минус единицу.
         */
        getSchoolDeclension: (lemma) => {
            const d = getDeclension(RussianNouns.createLemma(lemma));
            if (d === 1) {
                return 2;
            } else if (d === 2) {
                return 1;
            } else {
                return d;
            }
        },

        /**
         *
         * @param {RussianNouns.Lemma|Object} lemma
         * @param {string} grammaticalCase
         * @returns {Array} Список, т.к. бывают вторые родительный, винительный падежи. Существительные
         * женского рода в творительном могут иметь как окончания -ей -ой, так и -ею -ою.
         * Второй предложный падеж (местный падеж, локатив) не включен в предложный.
         */
        decline: (lemma, grammaticalCase) => {
            return declineAsList(RussianNouns.createLemma(lemma), grammaticalCase);
        }
    };

    window.RussianNouns = RussianNouns;

    //------------------------------
    // End of API
    //------------------------------

    const Case = RussianNouns.cases();

    const Gender = RussianNouns.genders();

    const misc = {
        requiredString: (v) => {
            if (typeof v !== "string") {
                throw new Error(v + " is not a string.");
            }
        }
    };

    const consonantsExceptJ = [
        'б', 'в', 'г', 'д', 'ж', 'з', 'к', 'л', 'м', 'н', 'п', 'р', 'с', 'т', 'ф', 'х', 'ц', 'ч', 'ш', 'щ'
    ];

    const vowels = ['а', 'о', 'у', 'э', 'ы', 'я', 'ё', 'ю', 'е', 'и'];

    function isVowel(character) {
        return vowels.includes(character);
    }

    function last(str) {
        if (str) {
            return str[str.length - 1];
        }
    }

    function lastN(str, n) {
        return str.substring(str.length - n);
    }

    function initial(s) {
        if (s.length <= 1) {
            return '';
        }
        return s.substring(0, s.length - 1);
    }

    const StemUtil = {
        getNounStem: (lemma) => {
            const word = lemma.text();
            const gender = lemma.gender();

            const lastChar = last(word);
            if (consonantsExceptJ.includes(lastChar)) {
                return word;
            }
            if ('ь' === lastChar) {
                if (word.endsWith('ень') && (gender === Gender.MASCULINE)) {
                    return word.substring(0, word.length - 3) + 'н';
                } else {
                    return initial(word);
                }
            }
            if ('ь' === last(initial(word))) {
                return initial(word);
            }
            if ('о' === lastChar && ['л', 'м', 'н', 'т', 'х', 'в', 'с'].includes(last(initial(word)))) {
                return initial(word);
            }
            return StemUtil.getStem(word);
        },
        getStem: (word) => {
            const c = last(word);
            if (('й' === c || isVowel(c)) && isVowel(last(initial(word)))) {
                return initial(initial(word));
            }
            if (isVowel(c)) {
                return initial(word);
            }
            return word;
        },
        getInit: (s) => {
            return initial(s);
        },
        getLastTwoChars: (s) => {
            if (s.length <= 1) {
                return '';
            }
            return s.substring(s.length - 2, s.length);
        }
    };

    function getDeclension(lemma) {
        const word = lemma.text();
        const gender = lemma.gender();
        misc.requiredString(word);
        misc.requiredString(gender);

        if (lemma.isIndeclinable()) {
            return -1;
        }

        const t = last(word);
        switch (gender) {
            case Gender.FEMININE:
                return t == "а" || t == "я" ? 2 : 3;
            case Gender.MASCULINE:
                return t == "а" || t == "я" ? 2 :
                    word == "путь" ? 0 : 1;
            case Gender.NEUTER:
                return word == "дитя" ? 0 :
                    StemUtil.getLastTwoChars(word) == "мя" ? 3 : 1;
            case Gender.COMMON:
                if (t === 'а' || t === 'я') {
                    return 2;
                } else if (t === 'и') {
                    return -1;
                } else {
                    return 1;
                }
            default:
                throw new Error("incorrect gender");
        }
    }

    function decline1(lemma, grCase) {
        const word = lemma.text();
        const gender = lemma.gender();
        const stem = StemUtil.getNounStem(lemma);
        const head = initial(word);

        function soft() {
            const lastChar = last(word);
            return lastChar === 'ь' || (['е', 'ё'].includes(lastChar) && !word.endsWith('це'));
        }

        function iyWord() {
            return last(word) === 'й' || ['ий', 'ие'].includes(StemUtil.getLastTwoChars(word));
        }

        function schWord() {
            return ['ч', 'щ'].includes(last(stem));
        }

        function tsWord() {
            return last(word) === 'ц';
        }

        function checkWord() {
            return word.endsWith('чек') && word.length >= 6;
        }

        function okWord() {
            return checkWord()
                || (
                    word.endsWith('ок') && !word.endsWith('шок') && !(word === 'урок')
                    && !isVowel(word[word.length - 3]) && isVowel(word[word.length - 4]) && word.length >= 4
                );
        }

        function tsStem() {
            if ('а' === word[word.length - 2]) {
                return head;
            } else if (lastN(head, 2) === 'ле') {
                const beforeLe = last(initial(initial(head)));
                if (isVowel(beforeLe) || ('л' === beforeLe)) {
                    return initial(head) + 'ь';
                } else {
                    return head;
                }
            } else if (isVowel(word[word.length - 2]) && (word[word.length - 2] !== 'и')) {
                if (isVowel(word[word.length - 3])) {
                    return word.substring(0, word.length - 2) + 'й';
                } else {
                    return word.substring(0, word.length - 2);
                }
            } else {
                return word.substring(0, word.length - 1);
            }
        }

        function surnameType1() {
            return lemma.isSurname() && (word.endsWith('ин') || word.endsWith('ов') || word.endsWith('ев'));
        }

        switch (grCase) {
            case Case.NOMINATIVE:
                return word;
            case Case.GENITIVE:
                if ((iyWord() && lemma.isSurname()) || (StemUtil.getLastTwoChars(word) === 'ый')) {
                    return stem + 'ого';
                } else if (iyWord()) {
                    return head + 'я';
                } else if (soft() && !schWord()) {
                    return stem + 'я';
                } else if (tsWord()) {
                    return tsStem() + 'ца';
                } else if (okWord()) {
                    return word.substring(0, word.length - 2) + 'ка';
                } else {
                    return stem + 'а';
                }
            case Case.DATIVE:
                if ((iyWord() && lemma.isSurname()) || (StemUtil.getLastTwoChars(word) === 'ый')) {
                    return stem + 'ому';
                } else if (iyWord()) {
                    return head + 'ю';
                } else if (soft() && !schWord()) {
                    return stem + 'ю';
                } else if (tsWord()) {
                    return tsStem() + 'цу';
                } else if (okWord()) {
                    return word.substring(0, word.length - 2) + 'ку';
                } else {
                    return stem + 'у';
                }
            case Case.ACCUSATIVE:
                if (gender === Gender.NEUTER) {
                    return word;
                } else {
                    const a = lemma.isAnimate();
                    if (a === true) {
                        return decline1(lemma, Case.GENITIVE);
                    } else {
                        return word;
                    }
                }
            case Case.INSTRUMENTAL:
                if (iyWord() && lemma.isSurname()) {
                    return stem + 'им';
                } else if (StemUtil.getLastTwoChars(word) === 'ый') {
                    return stem + 'ым';
                } else if (iyWord()) {
                    return head + 'ем';
                } else if (soft() || ['ж', 'ч', 'ш'].includes(last(stem))) {
                    return stem + 'ем';
                } else if (tsWord()) {
                    return tsStem() + 'цем';
                } else if (word.endsWith('це')) {
                    return word + 'м';
                } else if (okWord()) {
                    return word.substring(0, word.length - 2) + 'ком';
                } else if (surnameType1()) {
                    return word + 'ым';
                } else {
                    return stem + 'ом';
                }
            case Case.PREPOSITIONAL:
                if ((iyWord() && lemma.isSurname()) || (StemUtil.getLastTwoChars(word) === 'ый')) {
                    return stem + 'ом';
                } else if (['ий', 'ие'].includes(StemUtil.getLastTwoChars(word))) {
                    return head + 'и';
                } else if (last(word) === 'й') {
                    return head + 'е';
                } else if (tsWord()) {
                    return tsStem() + 'це';
                } else if (okWord()) {
                    return word.substring(0, word.length - 2) + 'ке';
                } else {
                    return stem + 'е';
                }
            case Case.LOCATIVE:
                const specialWords = {
                    'ветер': 'ветру',
                    'лоб': 'лбу',
                    'лёд': 'льду',
                    'лед': 'льду',
                    'мох': 'мху',
                    'угол': 'углу'
                };
                const uWords = [
                    'ад', 'бок', 'бор', 'быт', 'верх', 'вид', 'глаз', 'горб', 'гроб',
                    'долг', 'дым', 'зад', 'клей', 'край', 'круг', 'лад',
                    'лес', 'луг', 'мёд', 'мед', 'мел', 'мех',
                    'мозг', 'низ', 'нос', 'плен', 'пол', 'полк', 'порт', 'пух',
                    'рай', 'род', 'сад', 'снег', 'строй', 'тыл', 'ход', 'шкаф',
                    'яр'
                ];
                if (specialWords.hasOwnProperty(word)) {
                    return specialWords[word];
                }
                if (uWords.includes(word)) {
                    if (last(word) === 'й') {
                        return word.substring(0, word.length - 1) + 'ю';
                    } else {
                        return word + 'у';
                    }
                }
                return decline1(lemma, Case.PREPOSITIONAL);
        }
    }

    function decline2(lemma, grCase) {
        const word = lemma.text();
        const stem = StemUtil.getNounStem(lemma);
        const head = StemUtil.getInit(word);
        const soft = () => {
            const lastChar = last(word);
            return lastChar === 'я';
        };
        const surnameLike = () => {
            return word.endsWith('ова') || word.endsWith('ева') || (word.endsWith('ина') && !word.endsWith('стина'));
        };
        const ayaWord = () => {
            return word.endsWith('ая') && !((word.length < 3) || isVowel(last(stem)));
        };
        switch (grCase) {
            case Case.NOMINATIVE:
                return word;
            case Case.GENITIVE:
                if (ayaWord()) {
                    return stem + 'ой';
                } else if (lemma.isSurname()) {
                    return head + 'ой';
                } else if (
                    soft() || ['ч', 'ж', 'ш', 'щ', 'г', 'к', 'х'].includes(last(stem))  // soft, sibilant or velar
                ) {
                    return head + 'и';
                } else {
                    return head + 'ы';
                }
            case Case.DATIVE:
                if (ayaWord()) {
                    return stem + 'ой';
                } else if (lemma.isSurname()) {
                    return head + 'ой';
                } else if (StemUtil.getLastTwoChars(word) === 'ия') {
                    return head + 'и';
                } else {
                    return head + 'е';
                }
            case Case.ACCUSATIVE:
                if (ayaWord()) {
                    return stem + 'ую';
                } else if (soft()) {
                    return head + 'ю';
                } else {
                    return head + 'у';
                }
            case Case.INSTRUMENTAL:
                if (ayaWord()) {
                    return stem + 'ой';
                } else if (soft() || ['ц', 'ч', 'ж', 'ш', 'щ'].includes(last(stem))) {
                    if ('и' === last(head)) {
                        return head + 'ей';
                    } else {
                        return [head + 'ей', head + 'ею'];
                    }
                } else {
                    return [head + 'ой', head + 'ою'];
                }
            case Case.PREPOSITIONAL:
                if (ayaWord()) {
                    return stem + 'ой';
                } else if (lemma.isSurname()) {
                    return head + 'ой';
                } else if (StemUtil.getLastTwoChars(word) === 'ия') {
                    return head + 'и';
                } else {
                    return head + 'е';
                }
            case Case.LOCATIVE:
                return decline2(lemma, Case.PREPOSITIONAL);
        }
    }

    function decline3(lemma, grCase) {
        const word = lemma.text();
        if (![Case.NOMINATIVE, Case.ACCUSATIVE].includes(grCase)) {
            if (word === 'мать') {
                const lemmaCopy = lemma.clone();
                lemmaCopy.nominativeSingular = 'матерь';
                return decline3(lemmaCopy, grCase);
            } else if (word === 'дочь') {
                const lemmaCopy = lemma.clone();
                lemmaCopy.nominativeSingular = 'дочерь';
                return decline3(lemmaCopy, grCase);
            }
        }
        const stem = StemUtil.getNounStem(lemma);
        if (StemUtil.getLastTwoChars(word) === 'мя') {
            switch (grCase) {
                case Case.NOMINATIVE:
                    return word;
                case Case.GENITIVE:
                    return stem + 'ени';
                case Case.DATIVE:
                    return stem + 'ени';
                case Case.ACCUSATIVE:
                    return word;
                case Case.INSTRUMENTAL:
                    return stem + 'енем';
                case Case.PREPOSITIONAL:
                    return stem + 'ени';
                case Case.LOCATIVE:
                    return decline3(lemma, Case.PREPOSITIONAL);
            }
        } else {
            switch (grCase) {
                case Case.NOMINATIVE:
                    return word;
                case Case.GENITIVE:
                    return stem + 'и';
                case Case.DATIVE:
                    return stem + 'и';
                case Case.ACCUSATIVE:
                    return word;
                case Case.INSTRUMENTAL:
                    return stem + 'ью';
                case Case.PREPOSITIONAL:
                    return stem + 'и';
                case Case.LOCATIVE:
                    return decline3(lemma, Case.PREPOSITIONAL);
            }
        }
    }

    function declineAsList(lemma, grCase) {
        const r = decline(lemma, grCase);
        if (r instanceof Array) {
            return r;
        }
        return [r];
    }

    function decline(lemma, grCase) {
        const word = lemma.text();
        if (lemma.isIndeclinable()) {
            return word;
        }
        if (lemma.isPluraliaTantum()) {
            throw "PluraliaTantum words are unsupported.";
        }
        const declension = getDeclension(lemma);
        switch (declension) {
            case -1:
                return word;
            case 0:
                if (word === 'путь') {
                    if (grCase === Case.INSTRUMENTAL) {
                        return 'путём';
                    } else {
                        return decline3(lemma, grCase);
                    }
                } else {
                    throw new Error("unsupported");
                }
            case 1:
                return decline1(lemma, grCase);
            case 2:
                return decline2(lemma, grCase);
            case 3:
                return decline3(lemma, grCase);
        }
    }

})();
