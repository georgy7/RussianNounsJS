/*
  Copyright (c) 2011-2020 Устинов Георгий Михайлович

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
        },

        /**
         * @param {RussianNouns.Lemma|Object} lemma
         * @returns {Array}
         */
        pluralize: (lemma) => {
            const o = RussianNouns.createLemma(lemma);
            if (o.isPluraliaTantum()) {
                return [o.text()];
            } else {
                return pluralize(o);
            }
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

    function syllableCount(s) {
        return s.split('').filter(isVowel).length;
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

    function nInitial(str, n) {
        let part = str;
        for (let i = 1; i <= n; i++) {
            part = initial(part);
        }
        return part;
    }

    function lastOfNInitial(str, n) {
        return last(nInitial(str, n));
    }

    function endsWithAny(word, arr) {
        return arr.filter(a => word.endsWith(a)).length > 0;
    }

    const StemUtil = {
        getNounStem: (lemma) => {
            const word = lemma.text();
            const gender = lemma.gender();
            const lastChar = last(word);

            if (['пес', 'пёс', 'шов'].includes(word)) {
                return nInitial(word, 2) + lastChar;
            }

            if (word.endsWith('рёк') && syllableCount(word) >= 2) {
                return nInitial(word, 2) + 'ьк';
            } else if (word.endsWith('ёк') && isVowel(lastOfNInitial(word, 2))) {
                return nInitial(word, 2) + 'йк';
            }

            if (consonantsExceptJ.includes(lastChar)) {
                return word;
            }
            if ('ь' === lastChar) {

                const en2a2b = [
                    'ясень', 'бюллетень', 'олень', 'гордень', 'пельмень',
                    'ячмень'
                ];

                if (word.endsWith('ень') && (gender === Gender.MASCULINE) && !endsWithAny(word, en2a2b)) {
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
                return nInitial(word, 2);
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
                return ['дитя', 'полудитя'].includes(word) ? 0 :
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

    function tsWord(word) {
        return last(word) === 'ц';
    }

    function tsStem(word) {
        const head = initial(word);
        if ('а' === last(head)) {
            return head;
        } else if ('близнец' === word) {    // Также, польские имена могут сюда попадать.
            return head;
        } else if (lastN(head, 2) === 'ле') {
            const beforeLe = lastOfNInitial(head, 2);
            if (isVowel(beforeLe) || ('л' === beforeLe)) {
                return initial(head) + 'ь';
            } else {
                return head;
            }
        } else if (isVowel(word[word.length - 2]) && (word[word.length - 2] !== 'и')) {
            if (isVowel(word[word.length - 3])) {
                return nInitial(word, 2) + 'й';
            } else {
                return nInitial(word, 2);
            }
        } else {
            return head;
        }
    }

    function okWord(word) {
        const tok = [
            'лапоток', 'желток'
        ];
        const tok2 = [
            'поток', 'приток', 'переток', 'проток', 'биоток', 'электроток',
            'восток', 'водосток', 'водоток', 'воток',
            'знаток'
        ];
        return (endsWithAny(word, ['чек', 'шек']) && (word.length >= 6))
            || endsWithAny(word, tok)
            || (
                word.endsWith('ок') && !word.endsWith('шок') && !(word === 'урок')
                && !endsWithAny(word, tok2)
                && !isVowel(lastOfNInitial(word, 2))
                && (isVowel(lastOfNInitial(word, 3)) || endsWithAny(nInitial(word, 2), ['ст', 'рт']))
                && word.length >= 4
            );
    }

    function softD1(word) {
        const lastChar = last(word);
        return lastChar === 'ь' || (['е', 'ё'].includes(lastChar) && !word.endsWith('це'));
    }

    function halfSomething(word) {
        if (word.startsWith('пол')
            && ['и', 'ы', 'а', 'я', 'ь'].includes(last(word))
            && (syllableCount(word) >= 2)) {

            let subWord = word.substring(3);

            // На случай дефисов.
            let offset = subWord.search(/[а-яА-Я]/);

            // Сюда не должны попадать как минимум
            // мягкий и твердый знаки помимо гласных.

            return (offset >= 0) && consonantsExceptJ.concat('й').includes(subWord[offset].toLowerCase());

        } else {
            return false;
        }
    }

    function decline0(lemma, grCase) {
        const word = lemma.text();
        if (word.endsWith('путь')) {
            if (grCase === Case.INSTRUMENTAL) {
                return initial(word) + 'ём';
            } else {
                return decline3(lemma, grCase);
            }
        } else if (word.endsWith('дитя')) {
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
            throw new Error("unsupported");
        }
    }

    function decline1(lemma, grCase) {
        const word = lemma.text();
        const gender = lemma.gender();
        const half = halfSomething(word);

        if (half && endsWithAny(word, ['и', 'ы'])) {

            if ([Case.NOMINATIVE, Case.ACCUSATIVE].includes(grCase)) {
                return word;
            } else {
                let w = word;

                if (!['полминуты'].includes(w)) {
                    w = 'полу' + w.substring(3);
                }

                const lemmaCopy = lemma.clone();
                lemmaCopy.internalGender = Gender.FEMININE;

                if ('полпути' === word) {
                    if ([Case.PREPOSITIONAL, Case.LOCATIVE].includes(grCase)) {
                        return word;
                    } else {
                        lemmaCopy.nominativeSingular = initial(w) + 'ь';
                        return decline0(lemmaCopy, grCase);
                    }
                } else if (w.endsWith('зни')) {
                    lemmaCopy.nominativeSingular = initial(w) + 'ь';
                    return decline3(lemmaCopy, grCase);
                } else {
                    const e = (last(w) === 'н') ? 'я' : 'а';
                    lemmaCopy.nominativeSingular = initial(w) + e;
                    return decline2(lemmaCopy, grCase);
                }
            }
        }

        let stem = StemUtil.getNounStem(lemma);
        let head = initial(word);
        const soft = (half && word.endsWith('я')) || softD1(word);

        if (half) {
            stem = 'полу' + stem.substring(3);
            head = 'полу' + head.substring(3);
        }

        function iyWord() {
            return last(word) === 'й' || ['ий', 'ие'].includes(StemUtil.getLastTwoChars(word));
        }

        function schWord() {
            return ['ч', 'щ'].includes(last(stem));
        }

        function surnameType1() {
            return lemma.isSurname() && (word.endsWith('ин') || word.endsWith('ов') || word.endsWith('ев'));
        }

        function iyoy() {
            return (StemUtil.getLastTwoChars(word) === 'ый')
                || (word.endsWith('ной') && syllableCount(word) >= 2);
        }

        switch (grCase) {
            case Case.NOMINATIVE:
                return word;
            case Case.GENITIVE:
                if ((iyWord() && lemma.isSurname())
                    || iyoy()
                    || endsWithAny(word, ['ое', 'нький', 'ский', 'евой', 'овой'])) {
                    return stem + 'ого';
                } else if (word.endsWith('ее')) {
                    return stem + 'его';
                } else if (iyWord()) {
                    return head + 'я';
                } else if (soft && !schWord()) {
                    return stem + 'я';
                } else if (tsWord(word)) {
                    return tsStem(word) + 'ца';
                } else if (okWord(word)) {
                    return word.substring(0, word.length - 2) + 'ка';
                } else {
                    return stem + 'а';
                }
            case Case.DATIVE:
                if ((iyWord() && lemma.isSurname())
                    || iyoy()
                    || endsWithAny(word, ['ое', 'нький', 'ский', 'евой', 'овой'])) {
                    return stem + 'ому';
                } else if (word.endsWith('ее')) {
                    return stem + 'ему';
                } else if (iyWord()) {
                    return head + 'ю';
                } else if (soft && !schWord()) {
                    return stem + 'ю';
                } else if (tsWord(word)) {
                    return tsStem(word) + 'цу';
                } else if (okWord(word)) {
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
                if ((iyWord() && lemma.isSurname()) || endsWithAny(word, ['ое', 'ее', 'нький', 'ский'])) {

                    if (word !== 'целое') {
                        return stem + 'им';
                    } else {
                        return stem + 'ым';
                    }

                } else if (iyoy() || endsWithAny(word, ['евой', 'овой'])) {
                    return stem + 'ым';
                } else if (iyWord()) {
                    return head + 'ем';
                } else if (soft || ['ж', 'ч', 'ш'].includes(last(stem))) {
                    return stem + 'ем';
                } else if (tsWord(word)) {
                    return tsStem(word) + 'цем';
                } else if (word.endsWith('це')) {
                    return word + 'м';
                } else if (okWord(word)) {
                    return word.substring(0, word.length - 2) + 'ком';
                } else if (surnameType1()) {
                    return word + 'ым';
                } else {
                    return stem + 'ом';
                }
            case Case.PREPOSITIONAL:
                if ((iyWord() && lemma.isSurname())
                    || iyoy()
                    || endsWithAny(word, ['ое', 'нький', 'ский', 'евой', 'овой'])) {
                    return stem + 'ом';
                } else if (word.endsWith('ее')) {
                    return stem + 'ем';
                } else if (['ий', 'ие'].includes(StemUtil.getLastTwoChars(word))) {
                    return head + 'и';
                } else if (last(word) === 'й') {
                    return head + 'е';
                } else if (tsWord(word)) {
                    return tsStem(word) + 'це';
                } else if (okWord(word)) {
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
                    'ад', 'бок', 'бор', 'бред', 'быт', 'верх', 'вид',
                    'глаз', 'горб', 'гроб',
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

    const specialD3 = {
        'дочь': 'дочерь',
        'мать': 'матерь'
    };

    function decline3(lemma, grCase) {
        const word = lemma.text();
        if (![Case.NOMINATIVE, Case.ACCUSATIVE].includes(grCase)) {
            if (specialD3.hasOwnProperty(word)) {
                const lemmaCopy = lemma.clone();
                lemmaCopy.nominativeSingular = specialD3[word];
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
                return decline0(lemma, grCase);
            case 1:
                return decline1(lemma, grCase);
            case 2:
                return decline2(lemma, grCase);
            case 3:
                return decline3(lemma, grCase);
        }
    }

    function pluralize(lemma) {
        const result = [];

        const word = lemma.text();
        const stem = StemUtil.getNounStem(lemma);
        const gender = lemma.gender();
        const declension = getDeclension(lemma);

        const simpleFirstPart = (('й' == last(word) || isVowel(last(word))) && isVowel(last(initial(word))))
            ? initial(word)
            : stem;

        function softPatronymic() {
            if (word.endsWith('евич') || word.endsWith('евна')) {
                return word.indexOf('ье') >= 0;
            }
        }

        function softPatronymicForm2() {
            const i = simpleFirstPart.indexOf('ье');
            return simpleFirstPart.substring(0, i) + 'и' + simpleFirstPart.substring(i + 1);
        }

        function ы_и() {
            if (['г', 'х', 'ч', 'ж', 'ш', 'щ', 'к'].includes(last(stem))
                || ['я', 'й', 'ь'].includes(last(word))) {

                if (softPatronymic()) {
                    result.push(softPatronymicForm2() + 'и');
                    result.push(simpleFirstPart + 'и');
                } else {
                    result.push(simpleFirstPart + 'и');
                }

            } else if (tsWord(word)) {
                result.push(tsStem(word) + 'цы');

            } else {

                if (softPatronymic()) {
                    result.push(softPatronymicForm2() + 'ы');
                    result.push(simpleFirstPart + 'ы');
                } else {
                    result.push(simpleFirstPart + 'ы');
                }

            }
        }

        switch (declension) {
            case -1:
                result.push(word);
                break;
            case 0:
                if (word === 'путь') {
                    result.push('пути');
                } else if (word.endsWith('дитя')) {
                    result.push(nInitial(word, 3) + 'ети');
                } else {
                    throw new Error("unsupported");
                }
                break;
            case 1:

                const ya = [
                    'зять',
                    'друг',
                    'брат', 'собрат',
                    'лист', 'стул',
                    'брус',
                    'обод', 'полоз',
                    'струп',
                    'подмастерье',

                    'перо',
                    'шило'
                ];

                const softStem = (last(stem) === 'ь')
                    ? stem
                    : (
                        (last(stem) === 'к') ? (initial(stem) + 'чь') : (
                            (last(stem) === 'г') ? (initial(stem) + 'зь') : (stem + 'ь')
                        )
                    );

                if (ya.includes(word)) {

                    result.push(softStem + 'я');

                } else if (Gender.MASCULINE === gender) {

                    const aWords = [
                        'адрес',
                        'берег', 'бок',
                        'век',
                        'вес',
                        'вечер',
                        'лес', 'снег',
                        'глаз',
                        'город',
                        'дом',
                        'детдом',
                        'счет', 'счёт'
                    ];

                    const aWords2 = [
                        'поезд',
                        'цех'
                    ];

                    const aWords3 = [
                        'год',
                        'вексель',
                        'ветер'     // TODO ветр-а / ветр-ы
                    ];

                    const ya2 = [
                        'лоскут',
                        'повод',
                        'прут',
                        'сук'
                    ];

                    if ('сын' === word) {

                        result.push('сыновья');
                        ы_и();

                    } else if ('человек' === word) {

                        result.push('люди');
                        ы_и();

                    } else if (ya2.includes(word)) {

                        ы_и();
                        result.push(softStem + 'я');

                    } else if (aWords.includes(word) || endsWithAny(word, aWords2) || aWords3.includes(word)) {

                        const s = stem.replace('ё', 'е');

                        if (softD1(word)) {
                            result.push(s + 'я');
                        } else {
                            result.push(s + 'а');
                        }

                        if (aWords3.includes(word)) {
                            ы_и();
                        }

                    } else if (
                        word.endsWith('анин') || word.endsWith('янин')      // Кроме имён.
                        || ['барин', 'боярин'].includes(word)
                    ) {
                        // "барин" - "бары" тоже фигурирует в словарях,
                        // но может возникать путаница с "барами" (от слова "бар").
                        result.push(nInitial(word, 2) + 'е');
                    } else if (['цыган'].includes(word)) {
                        result.push(word + 'е');
                    } else if ((word.endsWith('ёнок') || word.endsWith('енок'))
                        && !endsWithAny(word, ['коленок', 'стенок', 'венок', 'ценок'])) {
                        result.push(nInitial(word, 4) + 'ята');
                    } else if (word.endsWith('ёночек')) {
                        result.push(nInitial(word, 6) + 'ятки');
                    } else if (word.endsWith('онок')
                        && ['ч', 'ж', 'ш'].includes(lastOfNInitial(word, 4))
                        && !word.endsWith('бочонок')) {
                        result.push(nInitial(word, 4) + 'ата');
                    } else if (okWord(word)) {
                        result.push(word.substring(0, word.length - 2) + 'ки')
                    } else if (word.endsWith('ый') || endsWithAny(word, ['щий', 'чий', 'жний', 'шний'])) {
                        result.push(initial(word) + 'е');
                    } else if ((word.endsWith('вой') && syllableCount(nInitial(word, 3)) >= 2)
                        || (word.endsWith('ной') && word.length >= 6)) {
                        result.push(nInitial(word, 2) + 'ые');
                    } else if (word.endsWith('его')) {
                        result.push(nInitial(word, 3) + 'ие');
                    } else {
                        ы_и();
                    }
                } else if (Gender.NEUTER === gender) {

                    if ('ухо' === word) {
                        result.push('уши');
                    } else if ('око' === word) {
                        result.push('очи');
                    } else if (endsWithAny(word, ['ко', 'чо'])
                        && !endsWithAny(word, ['войско', 'облако'])
                    ) {
                        result.push(initial(word) + 'и');
                    } else if (word.endsWith('имое')) {
                        result.push(stem + 'ые')

                    } else if (word.endsWith('ее')) {
                        result.push(stem + 'ие');

                    } else if (word.endsWith('ое')) {

                        if (endsWithAny(stem, ['г', 'к', 'ж', 'ш'])) {
                            result.push(stem + 'ие');
                        } else {
                            result.push(stem + 'ые');
                        }

                    } else if (endsWithAny(word, ['ие', 'иё'])) {
                        result.push(nInitial(word, 2) + 'ия');

                    } else if (endsWithAny(word, ['ье', 'ьё'])) {

                        let w = nInitial(word, 2);

                        if (last(word) === 'е') {
                            result.push(w + 'ия');
                        }

                        result.push(w + 'ья');

                    } else if (endsWithAny(word, [
                        'дерево', 'звено', 'крыло'
                    ])) {
                        result.push(stem + 'ья');
                    } else if ('дно' === word) {
                        result.push('донья');
                    } else if ('чудо' === word) {
                        result.push('чудеса');
                        result.push('чуда');
                    } else if (endsWithAny(word, ['ле', 'ре'])) {
                        result.push(stem + 'я');
                    } else if ([
                        'тесло', 'стекло',
                        'бедро', 'берцо',
                        'чело', 'стегно', 'стебло'
                    ].includes(word)) {
                        // "Стекла" легко перепутать с глаголом,
                        // "тесла" — c Tesla,
                        // другие слова — с родительным падежом ед. ч.
                        result.push(stem.replace('е', 'ё') + 'а');
                    } else {
                        result.push(stem + 'а');
                    }
                } else {
                    result.push(stem + 'и');
                }
                break;
            case 2:

                if ('заря' === word) {
                    result.push('зори');

                } else if (word.endsWith('ая')) {
                    if (['ж', 'ш'].includes(last(stem)) || endsWithAny(stem, ['ск', 'цк'])) {
                        result.push(stem + 'ие');
                    } else {
                        result.push(stem + 'ые');
                    }
                } else {
                    ы_и();
                }
                break;
            case 3:
                if (StemUtil.getLastTwoChars(word) === 'мя') {
                    result.push(stem + 'ена');
                } else if (specialD3.hasOwnProperty(word)) {
                    result.push(initial(specialD3[word]) + 'и');
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

        return result;
    }

})();
