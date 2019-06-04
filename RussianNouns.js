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

    // References:
    // - Современный русский язык. Морфология - Камынина А.А., Уч. пос. 1999 - 240 с.
    // - The article http://en.wikipedia.org/wiki/Russian_grammar
    // - К семантике русского локатива - Плунгян В. А., Семиотика и информатика. - Вып. 37. - М., 2002. - С. 229-254

    //------------------------------
    // API
    //------------------------------
    const RussianNouns = {
        cases: () => {
            return {
                NOMINATIVE: "именительный",
                GENITIVE: "родительный",
                DATIVE: "дательный",
                ACCUSATIVE: "винительный",
                INSTRUMENTAL: "творительный",
                PREPOSITIONAL: "предложный",
                LOCATIVE: "местный"
            };
        },
        caseList: () => {
            return [
                "именительный",
                "родительный",
                "дательный",
                "винительный",
                "творительный",
                "предложный",
                "местный"
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

        getDeclension: (lemma) => {
            return getDeclension(RussianNouns.createLemma(lemma));
        },

        /*
         * Возвращает список, т.к. бывают "вторые" родительный, винительный и предложный падежи.
         * Также, сущ. ж. р. в творительном могут иметь как окончания -ей -ой, так и -ею -ою.
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
        getNounStem: (word) => {
            const lastChar = last(word);
            if (consonantsExceptJ.includes(lastChar)) {
                return word;
            }
            if ('ь' === lastChar) {
                return initial(word);
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
        const stem = StemUtil.getNounStem(word);
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
                return initial(head) + 'ь';
            } else if (isVowel(word[word.length - 2])) {
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
                    'лёд': 'льду',
                    'лед': 'льду',
                    'угол': 'углу'
                };
                const uWords = [
                    'ад', 'вид', 'рай', 'снег', 'дым', 'лес', 'луг',
                    'мел', 'шкаф', 'быт', 'пол', 'полк', 'гроб', 'тыл',
                    'мозг', 'верх', 'низ', 'зад', 'род', 'строй', 'круг',
                    'сад', 'бор', 'порт'
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
        const stem = StemUtil.getNounStem(word);
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

    function decline3(word, grCase) {
        if ((word === 'мать') && ![Case.NOMINATIVE, Case.ACCUSATIVE].includes(grCase)) {
            return decline3('матерь', grCase);
        }
        const stem = StemUtil.getNounStem(word);
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
                    return decline3(word, Case.PREPOSITIONAL);
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
                    return decline3(word, Case.PREPOSITIONAL);
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
                        return 'путем';
                    } else {
                        return decline3(word, grCase);
                    }
                } else {
                    throw new Error("unsupported");
                }
            case 1:
                return decline1(lemma, grCase);
            case 2:
                return decline2(lemma, grCase);
            case 3:
                return decline3(word, grCase);
        }
    }

})();
