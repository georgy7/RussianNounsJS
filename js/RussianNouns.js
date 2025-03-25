/*!
  RussianNounsJS v1.4.1-SNAPSHOT
  Copyright (c) 2011-2025 Georgy Ustinov
  Released under the MIT license
*/

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        // CommonJS
        module.exports = factory();
    } else {
        root.RussianNouns = factory();
    }
}(typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    // Ссылки:
    // - Современный русский язык. Морфология - Камынина А.А., Уч. пос. 1999 - 240 с.
    // - Статья http://en.wikipedia.org/wiki/Russian_grammar
    // - К семантике русского локатива - Плунгян В. А., Семиотика и информатика. - Вып. 37. - М., 2002. - С. 229-254

    const Case = Object.freeze({
        NOMINATIVE: 'именительный',
        GENITIVE: 'родительный',
        DATIVE: 'дательный',
        ACCUSATIVE: 'винительный',
        INSTRUMENTAL: 'творительный',
        PREPOSITIONAL: 'предложный',
        LOCATIVE: 'местный'
    });

    const Gender = Object.freeze({
        "FEMININE": "женский",
        "MASCULINE": "мужской",
        "NEUTER": "средний",
        "COMMON": "общий"
    });

    const GenderValues = Object.freeze(Object.values(Gender));
    const CaseValues = Object.freeze(Object.values(Case));

    /**
     * @param o A plain old JavaScript object.
     * @returns {string|null} Описание ошибки на английском или null.
     */
    function validateCreateLemma(o) {
        if (null == o) {
            return 'No parameters specified.';
        }

        for (let fieldName of [
            'pluraleTantum', 'pluraliaTantum',
            'indeclinable', 'animate',
            'surname', 'name', 'transport'
        ]) {
            const check = x => (null != x) && (typeof x != 'boolean');
            if (check(o[fieldName])) {
                return '' + fieldName + ' must be boolean.';
            }
        }

        const pluraleTantum = (!!(o.pluraleTantum)) || (!!(o.pluraliaTantum));

        if (o.text == null) {
            return 'A cyrillic word required.';
        }

        if (!pluraleTantum) {   // Это слова т. н. парного рода.
            if (o.gender == null) {
                return 'A grammatical gender required.';
            }

            if (!GenderValues.includes(o.gender)) {
                return 'Bad grammatical gender.';
            }
        }

        return null;
    }

    class Lemma {

        /**
         * *Не для внешнего использования!*
         * Пожалуйста, используйте {@link RussianNouns.createLemma}
         * или {@link RussianNouns.createLemmaNoThrow} вместо конструктора.
         * @param {RussianNouns.Lemma|Object} o
         */
        constructor(o) {
            if (o instanceof Lemma) {
                this._txt = o._txt;
                this._lc = o._lc;
                this._hash = o._hash;
                this._flags = o._flags;

            } else {
                if (o.pluraleTantum || o.pluraliaTantum) {
                    this._flags = 5;
                } else {
                    this._flags = 1 + GenderValues.indexOf(o.gender);
                }

                this._flags |= (1 << 3) * (o.indeclinable&1);
                this._flags |= (1 << 4) * (o.animate&1);
                this._flags |= (1 << 5) * (o.surname&1);
                this._flags |= (1 << 6) * (o.name&1);
                this._flags |= (1 << 7) * (o.transport&1);

                this._txt = o.text;
                this._lc = this._txt.toLowerCase();
                this._hash = getFuzzyHash(this._lc);
            }
        }

        newText(provider) {
            const lemmaCopy = new Lemma(this);
            lemmaCopy._txt = provider(this);
            lemmaCopy._lc = lemmaCopy._txt.toLowerCase();
            lemmaCopy._hash = getFuzzyHash(lemmaCopy._lc);
            return Object.freeze(lemmaCopy);
        }

        newGender(provider) {
            const g = provider(this);
            if (GenderValues.includes(g)) {
                const lemmaCopy = new Lemma(this);
                lemmaCopy._flags &= 0xFFFFFFF8;
                lemmaCopy._flags |= 1 + GenderValues.indexOf(g);
                return Object.freeze(lemmaCopy);
            }
        }

        equals(o) {
            return (o instanceof Lemma)
                && (this._flags === o._flags)
                && (this.lower() === o.lower());
        }

        fuzzyEquals(o) {
            return (o instanceof Lemma)
                && ((this._flags & 0xF) === (o._flags & 0xF))
                && (unYo(this.lower()) === unYo(o.lower()));
        }

        text() {
            return this._txt;
        }

        lower() {
            return this._lc;
        }

        isPluraleTantum() {
            return 5 === (0b111 & this._flags);
        }

        /**
         * @deprecated Используйте isPluraleTantum(), т.к. речь об одной лемме, а pluralia — во мн.ч. на латыни.
         * @returns {boolean}
         */
        isPluraliaTantum() {
            return this.isPluraleTantum();
        }

        getGender() {
            const i = (0b111 & this._flags);
            if ((i >= 1) && (i <= 4)) {
                return GenderValues[i-1];
            }
        }

        isIndeclinable() {
            return ((1 << 3) & this._flags) !== 0;
        }

        isAnimate() {
            return (((1 << 4) & this._flags) !== 0) || this.isASurname() || this.isAName();
        }

        isASurname() {
            return ((1 << 5) & this._flags) !== 0;
        }

        isAName() {
            return ((1 << 6) & this._flags) !== 0;
        }

        isATransport() {
            return ((1 << 7) & this._flags) !== 0;
        }
    }

    class LemmaException extends Error {
    }

    class StressDictionaryException extends Error {
    }

    function createLemmaOrNull(options) {
        return (null === validateCreateLemma(options)) ? Object.freeze(new Lemma(options)) : null;
    }

    function createLemmaNoThrow(o) {
        let result;

        if (o instanceof Lemma) {
            result = [o, null];
        } else {
            result = [null, validateCreateLemma(o)];
            if (null === result[1]) {
                result[0] = Object.freeze(new Lemma(o));
            }
        }

        return Object.freeze(result);
    }

    function createLemma(o) {
        const r = createLemmaNoThrow(o);

        if (r[0]) {
            return r[0];
        } else {
            throw new LemmaException(r[1]);
        }
    }

    // Without ё, the Russian alphabet consists of 32 letters.
    function lcBit(lcChar) {
        const x = lcChar.charCodeAt(0) - 1072;
        return (x === 33) ? 0b100000 : ((x === (0x1F & x)) ? (1 << x) : 0)
    }

    function bincludes(mask, lcChar) {
        return (mask & lcBit(lcChar)) !== 0;
    }

    function isVowel(ch) {
        return bincludes(0b11101000000010000100000100100001, ch.toLowerCase());
    }

    function isConsonantLc(lcChar) {
        return bincludes(0b00000011111101111011111011011110, lcChar);
    }

    function isConsonantNotJ(lcChar) {
        return bincludes(0b00000011111101111011110011011110, lcChar);
    }

    const isUpper = s => s === s.toUpperCase();

    const upperLike = (lowerCase, pattern) => isUpper(pattern) ? lowerCase.toUpperCase() : lowerCase;

    const vowelCount = s => s.split('').filter(isVowel).length;

    const last = str => str.substring(str.length - 1);

    const nLast = (str, n) => str.substring(str.length - n);

    const init = s => s.substring(0, s.length - 1);

    const nInit = (s, n) => s.substring(0, s.length - n);

    const lastOfNInitial = (str, n) => last(nInit(str, n));

    const endsWithAny = (w, arr) => arr.some(a => w.endsWith(a));

    const unique = a => a.filter((item, index) => a.indexOf(item) === index);

    const unYo = s => s.replaceAll('ё', 'е').replaceAll('Ё', 'Е');

    function getFuzzyHash(lowerCaseUnicodeString) {
        const preparedString = lowerCaseUnicodeString.replaceAll('ё', 'е');

        // Daniel J. Bernstein's hash function
        // http://www.cse.yorku.ca/~oz/hash.html
        // https://theartincode.stanis.me/008-djb2/
        // The result is the same as if the hash were of type uint32_t.
        let hash = 5381;
        for (let i = 0; i < preparedString.length; i++) {

            // Just converting a Russian letter to a byte.
            const chCode = preparedString.charCodeAt(i);
            const uchar = (chCode <= 127) ? (0x80 + chCode) : (0x7F & (chCode-1072));

            hash = (hash * 33 + uchar) % 0x100000000;
        }

        return hash;
    }

    const stressHashes = (() => {
        const obj = {};

        function extract(input) {
            const result = new Set();
            let last = 0;
            for (let delta of input) {
                last += delta;
                result.add(last);
            }
            return result;
        }

        obj.a = extract([
            5860080, 122700338, 6781005, 15066, 174372, 1005376, 181863, 110897, 898425, 497854, 728, 179817,
            681927, 4050007, 2885686, 1981, 503479, 2014, 1253, 174242, 98, 825, 3250, 1089, 2343, 1974192,
            390885, 438009, 1328596, 496584, 603290, 7476, 186382, 324359, 163349, 16499, 670824, 318913,
            177655, 16, 692440, 3250, 327970, 180593, 284410, 1089, 501848, 181, 908, 215803, 178596, 728,
            417284, 1954738, 3053737, 1001717, 1477936, 7212804, 346121, 6038325, 15676851, 346, 2178, 2097,
            6632, 627, 858, 511, 1716, 891, 3399, 5793, 10368459, 178760, 16528071, 6871771, 22511792,
            15316801, 1462363, 10890, 1786108, 23051968, 3615316, 10491574, 122992749, 95414913, 5496035,
            2325039, 1663143, 3267989, 3743357, 2080599, 786110, 3062896, 26233365, 33759, 35577630,
            10385974, 109808, 9014293, 21270966, 12331836, 2625591, 20196594, 16566957, 24616833, 200224,
            11979, 3224693, 518200, 2803234, 5912181, 3422370, 132, 23865676, 34576839, 102366, 9880481,
            1010608, 4745501, 4801136, 22545088, 3553523, 6934488, 74388123, 71480160, 22318906, 10534210,
            6470822, 3593716, 29504096, 32673923, 159978456, 2481667, 35185821, 7130733, 56365048, 61979038,
            81830120, 65118503, 10213975, 7164765, 27229609, 175661380, 180555664, 11623981, 98868979,
            671197, 109459, 211167, 2344, 444, 2541, 173368, 6336, 68605, 147149, 2406, 286226, 10093388,
            1680929, 174716967, 165082600, 225884750, 143746615, 180457383, 218593714, 5421223, 30808096,
            440631725
        ]);

        obj.b = extract([
            5860080, 462, 128697908, 971551, 114082, 200475, 14321, 2366397, 728, 1450, 860310, 325611,
            2144241, 9801, 2324851, 218428, 159619, 1755107, 505493, 2178, 164, 177507, 507113, 162459,
            127412, 195095, 692604, 728, 277892, 409465, 1007324, 1862190, 170048, 16335, 107811, 379897,
            4356, 1001880, 190739, 274428, 227601, 5083, 163712, 8548, 108900, 2342, 362720, 713212, 505296,
            2178, 728, 15616814, 5425562, 14026156, 2110981, 4621, 10344, 3086, 3465, 2425, 10369566,
            11804334, 47630682, 728, 3433814, 3431, 1973268, 26487583, 10861850, 234633598, 35937, 1944757,
            3523047, 103684, 11369611, 936400, 20716661, 684981, 38744606, 202391, 5511592, 30264387,
            5421770, 8815378, 15148440, 35549152, 12752125, 311683, 3208194, 438703, 280037, 4063059,
            23718955, 251024, 3844006, 41295044, 179685, 682803, 728, 508760, 682803, 1509354, 6097311,
            19987670, 14118721, 169885, 1989602, 164, 487708, 405108, 16819769, 7007715, 56870233, 16386019,
            10410529, 7218817, 2120447, 29717557, 26713645, 8855437, 11979, 728, 62331929, 42135689,
            59933501, 50861258, 12658372, 1253, 505296, 527482613, 127135141, 118397705, 46392249, 215,
            37736, 35937, 35937, 30656, 38115, 3267, 138306, 6284, 24205, 44996, 69449, 6434, 54286, 50258,
            30328, 43560, 71676, 73325, 18513, 227601, 181073843, 136724544, 119388690, 538130, 184058287,
            16830219, 136758347, 18790744, 9175126, 663989, 6871590, 308847974, 36733509, 487541446
        ]);

        return Object.freeze(obj);
    })();

    /**
     * Нечто среднее между Map и Multimap.
     * Одной лемме соответствует одно значение,
     * но можно также искать неточное совпадение.
     */
    class Dictionary {
        constructor() {
            this.data = {};
        }

        put(lemma, value) {
            const lemmaObject = createLemma(lemma);
            const hash = lemmaObject._hash;

            let homonyms = this.data[hash];

            if (!(homonyms instanceof Array)) {
                homonyms = [];
                this.data[hash] = homonyms;
            }

            const found = homonyms.find(ls => lemmaObject.equals(ls[0]));

            if (found) {
                found[1] = value;
            } else {
                homonyms.push([lemmaObject, value]);
            }
        }

        putAll(lemmaPrototype, value, joinedWordList) {
            const list = joinedWordList.split(',');
            for (let word of list) {
                const lemma = Object.assign({}, lemmaPrototype);
                lemma.text = word;
                this.put(lemma, value);
            }
        }

        /**
         * @param {RussianNouns.Lemma|Object} lemma
         * @param {boolean} fuzzy Если нет точных совпадений, вернуть первое неточное.
         * @returns {*} Значение или undefined.
         */
        get(lemma, fuzzy) {
            const lemmaObject = (lemma instanceof Lemma) ? lemma : createLemma(lemma);
            const hash = lemmaObject._hash;

            const homonyms = this.data[hash];

            if (homonyms instanceof Array) {
                let found = homonyms.find(ls => lemmaObject.equals(ls[0]));

                if (!found && fuzzy) {
                    found = homonyms.find(ls => lemmaObject.fuzzyEquals(ls[0]));
                }

                if (found) {
                    return found[1];
                }
            }
        }

        /**
         * Максимально тупой метод, но зато самый универсальный.
         * @param {number} hash
         * @returns {array} Список пар лемма-значение.
         */
        _getEntities(hash) {
            const homonyms = this.data[hash];
            if (homonyms instanceof Array) {
                return homonyms;
            } else {
                return [];
            }
        }

        remove(lemma) {
            const lemmaObject = createLemma(lemma);
            const hash = lemmaObject._hash;

            const homonyms = this.data[hash];

            if (homonyms instanceof Array) {
                this.data[hash] = homonyms.filter(ls => !lemmaObject.equals(ls[0]));

                if (this.data[hash].length === 0) {
                    delete this.data[hash];
                }
            }
        }

        /**
         * Благодаря этому методу, словарь можно использовать для других целей.
         * Например, если там есть слово, можно посмотреть его род и признаки.
         *
         * @param word Слово, по которому производится поиск.
         * Буква Ё и регистр игнорируются.
         * @returns {Array} Список лемм.
         */
        find(word) {
            const hash = getFuzzyHash(word.toLowerCase());

            const homonyms = this.data[hash];

            if (homonyms instanceof Array) {
                return homonyms.map(pair => pair[0]);
            } else {
                return [];
            }
        }
    }

    const LocativeFormAttribute = Object.freeze({
        // Вместилище.
        CONTAINER: 1,

        // Пространство, помещение, участок суши.
        LOCATION: 2,

        /**
         * Конфигурация объектов, образующая устойчивую структуру.
         * Т.е. структура здесь — в том смысле, что это всегда порядок
         * каких-то объектов: людей, вещей и т. п.
         */
        STRUCTURE: 3,

        // Поверхность.
        SURFACE: 4,
        // Метафорический путь. Луч времени, на (или в) котором лежат события.
        WAY: 5,

        // Объект с функциональной (не обязательно плоской) поверхностью.
        OBJECT_WITH_FUNCTIONAL_SURFACE: 6,

        // Вещество (обволакивающее или покрывающее).
        SUBSTANCE: 7,
        // Материал, средство изготовления, приготовления (еды), ремонта.
        RESOURCE: 8,

        // Состояние, свойство, положение дел.
        CONDITION: 9,
        // Испытываемое воздействие (стихии или внимания/отношения человека).
        EXPOSURE: 10,
        // Перемещение или кратковременное пространственное положение.
        MOTION: 11,
        // Мероприятие.
        EVENT: 12,

        WITH_ADJECTIVE: 13,
        WITHOUT_ADJECTIVE: 14,

        /**
         * Употребляется только в религиозном контексте, причём скорее всего
         * только в определённой религии или даже в определённой конфессии.
         * Т.е. использовать такие выражения следует с большой осторожностью,
         * иначе можно сказануть что-то очень странное.
         */
        RELIGIOUS: 15
    });

    class LocativeForm {
        /**
         * @param {string} preposition Предлог.
         * @param {string} word Форма слова.
         * @param {array} attributes Предикаты, которые все должны быть истинными.
         */
        constructor(preposition, word, attributes) {
            this.preposition = preposition;
            this.word = word;
            this.attributes = attributes;
        }
    }

    /**
     * Для внутреннего использования.
     */
    const LocativeDeclensionType = Object.freeze({
        /**
         * Для очень особых случаев, когда форма предложного падежа
         * в локативе является исключением из правил.
         * Т.е. вот есть какие-то атрибуты у особой формы локатива с предлогом,
         * но если добавить еще определённый атрибут или несколько,
         * форма должна снова переключиться в обычную.
         */
        PREPOSITIONAL: 1,

        // Окончания -у/-ю.
        U_SUFFIX: 2
    });

    /**
     * Для внутреннего использования.
     * Правило, по которому мы получаем локатив, с учетом семантики и предлогов.
     * Атрибуты — это предикаты, которые все должны быть истинными.
     */
    class LocativeConfig {
        constructor(preposition, declensionType, attributes) {
            this.preposition = preposition;
            this.declensionType = declensionType;
            this.attributes = attributes;
        }
    }

    const locativeDictionary = Object.freeze(makeDefaultLocativeDictionary())

    const API = {
        Case: Case,
        Gender: Gender,

        CASES: CaseValues,

        LemmaException: LemmaException,
        StressDictionaryException: StressDictionaryException,

        /**
         * Это еще не стабилизированная часть API.
         *
         * Предикаты, по которым можно узнать, уместно ли
         * в данном случае употреблять ту или иную форму локатива.
         * Тут взяты семантические классы (с небольшими изменениями)
         * из публикации «К семантике русского локатива».
         * Затем к ним еще добавлены синтаксические особенности употребления.
         */
        LocativeFormAttribute: LocativeFormAttribute,

        /**
         * Форма слова в местном падеже (ед. ч.) с предлогом
         * и списком условий применения, которые складываются через логическое И.
         * Т.е. если хотя бы один атрибут как предикат ложен,
         * то эта комбинация формы слова и предлога не может быть использована.
         */
        LocativeForm: LocativeForm,

        /**
         * Нормальная форма слова.
         * Объекты этого класса содержат также грамматическую и семантическую информацию,
         * позволяющую выбирать стратегии словоизменения и различать омонимы.
         *
         * Пожалуйста, используйте {@link RussianNouns.createLemma}
         * или {@link RussianNouns.createLemmaNoThrow} вместо конструктора.
         */
        Lemma: Lemma,

        /**
         * Интерфейс с именованными параметрами для создания лемм.
         * Если параметр — уже лемма, вернет тот же объект, а не копию.
         *
         * Леммы, которые в коде используются много раз, следует
         * конструировать через эту функцию или {@link RussianNouns.createLemmaNoThrow},
         * иначе они будут неявно конструироваться на каждый вызов любой функции
         * или метода в этой библиотеке.
         *
         * @param {RussianNouns.Lemma|Object} o
         * @throws {RussianNouns.LemmaException} Ошибки из конструктора леммы.
         * @returns {RussianNouns.Lemma} Иммутабельный объект.
         */
        createLemma: createLemma,

        /**
         * Интерфейс с именованными параметрами для создания лемм.
         * Если параметр — уже лемма, вернет в массиве тот же объект, а не копию.
         *
         * Леммы, которые в коде используются много раз, следует
         * конструировать через эту функцию или {@link RussianNouns.createLemma},
         * иначе они будут неявно конструироваться на каждый вызов любой функции
         * или метода в этой библиотеке.
         *
         * @param {RussianNouns.Lemma|Object} o
         * @returns {array} Результат в Go-стиле: результат или null, строка с описанием ошибки или null.
         */
        createLemmaNoThrow: createLemmaNoThrow,

        /**
         * Создание корректной леммы с теоретически минимальными накладными расходами:
         * здесь нет лишних аллокаций, нет динамического определения типа аргумента.
         * Цена за это — отказ принимать существующую лемму в качестве аргумента.
         *
         * @param {Object} options
         * @returns {RussianNouns.Lemma|null}
         */
        createLemmaOrNull: createLemmaOrNull,

        /**
         * Склонение существительного.
         *
         * Возможные значения:
         * + -1 — несклоняемые, в основном заимствованные слова;
         * + 0 — разносклоняемые "путь" и "дитя";
         * + 1 — мужской и средний род без окончания;
         * + 2 — слова на "а", "я" (м., ж. и общий род);
         * + 3 — жен. род без окончания; слова, оканчивающиеся на "мя".
         *
         * Понятие "склонение" сложно применить к словам pluralia tantum,
         * поэтому этот метод возвращает для них undefined.
         *
         * @param {RussianNouns.Lemma|Object} lemma
         * @returns {number|undefined}
         */
        getDeclension: lemma => {
            return getDeclension(API.createLemma(lemma));
        },

        /**
         * «Названия „первое склонение“ и „второе склонение“ в школьной практике и вузовском преподавании
         * нередко закрепляются за разными разрядами слов. В школьных учебниках первым склонением называют изменение
         * слов с окончанием -а (вода), во многих вузовских пособиях и академических грамматиках — слов мужского
         * рода (стол) и среднего рода (окно)».
         *
         * Современный русский язык. Морфология — Камынина А.А., 1999, стр. 67
         *
         * Почти везде указывают это число. Например, в Викисловаре.
         * Иногда в школьных учебниках 10 слов на «-мя» относят к разносклоняемым.
         * Здесь это третье склонение.
         *
         * Понятие "склонение" сложно применить к словам pluralia tantum,
         * поэтому этот метод возвращает для них undefined.
         *
         * @param lemma
         * @returns {number} «Школьный» вариант склонения:
         * «вода» — 1; «стол», «окно» — 2,
         * разносклоняемые — 0; несклоняемые — минус единица.
         */
        getSchoolDeclension: lemma => {
            const d = getDeclension(API.createLemma(lemma));

            if (d === 1) {
                return 2;
            } else if (d === 2) {
                return 1;
            } else {
                return d;
            }
        },

        FIXED_STEM_STRESS: 'SSSSSSS-SSSSSS',
        FIXED_ENDING_STRESS: 'EEEEEEE-EEEEEE',

        /**
         * Словарь ударений. В него можно вносить изменения в рантайме,
         * и это будет влиять на поведение экземпляра движка, который
         * владеет этим словарём.
         */
        StressDictionary: class StressDictionary extends Dictionary {

            /**
             * @param {RussianNouns.Lemma|Object} lemma
             * @param {string} settings Строка настроек в формате 1234567-123456.
             * До дефиса — единственное число, после дефиса — множественное.
             * Номер символа — номер падежа в {@link RussianNouns.CASES}.
             * Возможные значения каждого символа:
             * S — ударение только на основу;
             * s — чаще на основу;
             * b — оба варианта употребляются одинаково часто;
             * e — чаще на окончание;
             * E — только на окончание.
             * @throws {RussianNouns.StressDictionaryException}
             */
            put(lemma, settings) {

                // "b" значит "both".

                if (!(settings.match(/^[SsbeE]{7}-[SsbeE]{6}$/))) {
                    throw new API.StressDictionaryException('Bad settings format.');
                }

                super.put(lemma, settings);
            }

            _getOne(query) {
                const mainFlags = query._flags & 0x1F;
                const extraFlags = query._flags & 0x7FFFFFE0;

                // Дополнительные флаги должны быть такими же или
                // более общими (содержать меньше признаков - меньше бит).
                const entities = this._getEntities(query._hash)
                    .filter(pair => ((pair[0]._flags & 0x1F) === mainFlags) &&
                        ((pair[0]._flags & extraFlags) <= extraFlags));

                const exactYo = entities.filter(pair => pair[0].lower() === query.lower());

                if (exactYo.length) {
                    return exactYo[0][1];
                } else if (entities.length) {
                    return entities[0][1];
                }
            }

            hasStressedEndingSingular(query, grCase) {
                const caseIndex = CaseValues.indexOf(grCase);

                if (caseIndex >= 0) {
                    let v = this._getOne(query);
                    if (!v && (query.getGender() === Gender.MASCULINE)) {
                        if (stressHashes.a.has(query._hash)) {
                            v = 'SEESEEE-';
                        } else if (stressHashes.b.has(query._hash)) {
                            v = 'SEEEEEE-';
                        }
                    }

                    if (v) {
                        const singular = v.split('-')[0];

                        if (singular[caseIndex] === 'E') {
                            return [true];
                        } else if (singular[caseIndex] === 'e') {
                            return [true, false];
                        } else if (singular[caseIndex] === 'b') {
                            return [false, true];
                        } else if (singular[caseIndex] === 's') {
                            return [false, true];
                        } else {
                            return [false];
                        }
                    }
                }

                return []; // вместо undefined
            }

            hasStressedEndingPlural(query, grCase) {
                const caseIndex = CaseValues.indexOf(grCase);

                if (caseIndex >= 0 && caseIndex < 6) {
                    let v = this._getOne(query);
                    if (!v && (query.getGender() === Gender.MASCULINE)) {
                        if (stressHashes.a.has(query._hash) ||
                                (query.isAnimate() && stressHashes.b.has(query._hash))) {
                            v = '-EEEEEE';
                        }
                    }

                    if (v) {
                        const plural = v.split('-')[1];

                        if (plural[caseIndex] === 'E') {
                            return [true];
                        } else if (plural[caseIndex] === 'e') {
                            return [true, false];
                        } else if (plural[caseIndex] === 'b') {
                            return [false, true];
                        } else if (plural[caseIndex] === 's') {
                            return [false, true];
                        } else {
                            return [false];
                        }
                    }
                }

                return []; // вместо undefined
            }
        },
        Engine: class Engine {

            constructor() {

                /**
                 * @description Словарь ударений. Его можно редактировать в рантайме.
                 * @type {API.StressDictionary}
                 */
                this.sd = makeDefaultStressDictionary();

            }

            /**
             *
             * @param {RussianNouns.Lemma|Object} lemma Слово в именительном падеже с метаинформацией.
             * @param {string} grammaticalCase Падеж.
             * @param {string} pluralForm Форма во множественном числе.
             * Если указана, результат будет тоже во множественном.
             * У pluralia tantum игнорируется.
             * @returns {Array} Список, т.к. бывают вторые родительный, винительный падежи. Существительные
             * женского рода в творительном могут иметь как окончания -ей -ой, так и -ею -ою.
             * Второй предложный падеж (местный падеж, локатив) не включен в предложный.
             */
            decline(lemma, grammaticalCase, pluralForm) {
                const lemmaObject = (lemma instanceof API.Lemma) ? lemma : API.createLemma(lemma);
                return declineAsList(this, lemmaObject, grammaticalCase, pluralForm);
            }

            /**
             * @param {RussianNouns.Lemma|Object} lemma
             * @returns {Array}
             */
            pluralize(lemma) {
                const o = API.createLemma(lemma);

                if (o.isPluraleTantum()) {
                    return [o.text()];
                } else {
                    return pluralize(this, o);
                }
            }

            /**
             * Экспериментальная возможность!
             * Заточено под ед. число.
             *
             * Возвращает формы слов с условиями их использования (там смешаны
             * семантические классы и некоторые синтаксические обстоятельства).
             *
             * Эти так называемые атрибуты в объектах API.LocativeForm конъюнктивны.
             * Т.е. чтобы форма слова с предлогом могла применяться, должны быть истинными
             * все перечисленные предикаты (атрибуты, условия применения).
             * И напротив, если хотя бы один из предикатов ложен, не следует использовать это выражение.
             * Однако, если они все истинны, это еще недостаточное условие для применения.
             * Еще в полученном списке не должно быть более конкретного условия,
             * т.е. содержащего все те же предикаты с еще дополнительными, тоже истинными.
             * В последнем случае это уточнённое правило переопределит то, которое мы рассматриваем.
             *
             * @param {RussianNouns.Lemma|Object} lemma
             * @returns {Array} Массив объектов типа API.LocativeForm.
             * Может быть пустым, если местный падеж в ед. ч. совпадает с предложным или не имеет смысла.
             */
            getLocativeForms(lemma) {
                const engine = this;
                const o = API.createLemma(lemma);
                const declension = getDeclension(o);

                if (declension && (declension >= 0)) {
                    const configs = locativeDictionary.get(o, false);
                    if (configs instanceof Array) {
                        return configs.map(c => (new LocativeForm(
                            c.preposition,
                            toLocativeSingular(engine, declension, o, c.declensionType),
                            c.attributes
                        )));
                    }
                }

                return [];
            }
        }
    };

    function makeDefaultStressDictionary() {
        const d = new API.StressDictionary();
        const m = Object.freeze({gender: Gender.MASCULINE});
        const ma = Object.freeze({gender: Gender.MASCULINE, animate: true});
        const f = Object.freeze({gender: Gender.FEMININE});
        const fa = Object.freeze({gender: Gender.FEMININE, animate: true});
        const ca = Object.freeze({gender: Gender.COMMON, animate: true});
        const putM = (settings, word) => d.putAll(m, settings, word);

        d.putAll(m,
            API.FIXED_STEM_STRESS,
            'брёх,дёрн,идиш,имидж,мед');

        d.putAll({pluraleTantum: true},
            API.FIXED_STEM_STRESS,
            'ножны');

        d.putAll(m,
            'SSSSSSS-EEEEEE',
            'адрес,век,вечер,город,детдом,поезд,спецсчёт,субсчёт');

        d.putAll(m,
            'SSSSSSE-EEEEEE',
            'берег,бок,вес,лес,снег,дом,катер,счёт,мёд');

        d.putAll(ma,
            API.FIXED_STEM_STRESS,
            'балансёр,шофёр');

        d.putAll(m,
            'SSSSSSS-bbbbbb',
            'вексель,ветер');

        putM('SSSSSSE-ESEEEE', 'глаз');
        putM('SSSSSSE-bEEbEE', 'год');
        putM('SSSSSSb-bbbbbb', 'цех');

        d.putAll({gender: Gender.NEUTER},
            'EEEEEEE-SSSSSS',
            'тесло,' +
            'стекло,автостекло,бронестекло,оргстекло,' +
            'пеностекло,смарт-стекло,спецстекло,' +
            'бедро,берцо,блесна,чело,стегно,стебло');

        d.putAll(f, 'EEEbEEE-SSESEE', 'щека');
        d.putAll(f, 'EEEEEEE-SSESEE', 'слеза');

        // Почти все слова на ж/ш/ч/ц с ударением на окончание
        // захешированы (см. stressHashes).

        d.putAll(m,
            'SbbSbbb-bbbbbb',
            'грош,шприц');

        d.putAll(m,
            'SssSsss-ssssss',
            'кишмиш,' +
            'кряж,' +  // обрубок бревна; гряда холмов
            'слеш,слэш');

        d.putAll(ma,
            'Sssssss-ssssss',
            'паныч');

        putM('SEESeEE-EEEEEE', 'стеллаж');
        putM('SeeSeee-eeeeee', 'шиномонтаж');

        d.putAll({gender: Gender.NEUTER},
            'EEEEEEE-SsESEE',
            'плечо');

        // Если основа слова заканчивается на буквы жшчщц,
        // от ударения зависит окончание творительного падежа ед.ч.
        // В остальных словах ударение влияет на окончание в р.п. мн.ч.

        d.putAll(ca, 'EEEEEEE-SSSSSS', 'судья');
        d.putAll(ca, API.FIXED_ENDING_STRESS, 'левша');

        d.putAll(f, 'EEEEEEE-SESSSS', 'семья,макросемья');
        d.putAll(f, 'EEEEEEE-SEESEE', 'вожжа,свеча');
        d.putAll(f, 'EEESEEE-SSSSSS', 'душа');

        d.putAll(fa, 'EEEEEEE-SESESS', 'свинья,овца');

        d.putAll(f, 'EEEEEEE-eEeeee', 'скамья');

        d.putAll(f,
            API.FIXED_ENDING_STRESS,
            'башка,кишка,ладья,лапша,моча,пыльца,статья');

        return d;
    }

    function makeDefaultLocativeDictionary() {
        // Dictionary используется вместо Map, т.к. он проверяет совпадения через equals.
        // И возможно редактирование будет в дальнейшем открыто наружу.
        const dictionary = new Dictionary();
        const m = Object.freeze({gender: Gender.MASCULINE});
        const mAnimate = Object.freeze({gender: Gender.MASCULINE, animate: true});

        function addConfig(lemmaPrototype, condition, ps, ws, dTypes) {
            const andConditions = (condition instanceof Array) ? condition : [condition];
            const prepositions = ps.split(',');
            const words = ws.split(',');

            // Тут если номер, то это LocativeDeclensionType,
            // а если строка, то можно будет, наверно, здесь же предусмотреть
            // особую форму слова, если она не совпадает с предложным падежом.
            // Но пока что это не потребовалось.
            const declensionTypes = (dTypes instanceof Array) ? dTypes : [LocativeDeclensionType.U_SUFFIX];

            for (let word of words) {
                const lemma = Object.assign({}, lemmaPrototype);
                lemma.text = word;

                let configArray = dictionary.get(lemma, false);
                if (!configArray) {
                    configArray = [];
                    dictionary.put(lemma, configArray);
                }

                for (let p of prepositions) {
                    for (let d of declensionTypes) {
                        configArray.push(new LocativeConfig(p, d, andConditions));
                    }
                }
            }
        }

        // В. А. Плунгян выделяет у слов мужского рода
        // с особыми формами локатива семь семантических классов:

        // 1. вместилища, сосуды («в»)
        addConfig(m, LocativeFormAttribute.CONTAINER, 'в', 'мозг,пруд,стог,таз,год');
        addConfig(m, LocativeFormAttribute.CONTAINER, 'во', 'рот');
        // Год может быть тем, в чём содержатся дни, например,
        // и может быть тем, на чём лежат события.
        // Это два разных случая. Их нельзя в один конфиг помещать,
        // т.к. у них условия через конъюнкцию проверяются.
        addConfig(m, LocativeFormAttribute.WAY, 'в', 'год');
        addConfig(m, LocativeFormAttribute.CONTAINER, 'в', 'гроб');
        // Не уверен, что семантика "во гробе" тут правильная.
        // Не исключено, что это имеет совершенно другой религиозный смысл, чем вместилище,
        // поэтому и склонение отличается.
        addConfig(m, [LocativeFormAttribute.CONTAINER, LocativeFormAttribute.RELIGIOUS],
            'во', 'гроб', [LocativeDeclensionType.PREPOSITIONAL]);

        // 2. пространства («в»)
        addConfig(m, LocativeFormAttribute.LOCATION, 'в',
            'ад,бор,лес,порт,аэропорт,рай,сад,тыл,' +
            'низ,' +
            'хлев'  // по классификации Плунгяна, это вместилище (как и "цех")
        );

        // 3. конфигурации объектов, образующих устойчивые структуры («в»)
        addConfig(m, LocativeFormAttribute.STRUCTURE, 'в',
            'круг,полк,артполк,ряд,род,строй,лад');

        // 4. поверхности («на»)
        addConfig(m, LocativeFormAttribute.SURFACE, 'на', '' +
            'баз,' +    // скотный двор
            'берег,' +
            'бережок,' +    // (спорно)
            'вал,кон,круг,луг,пол,яр'
        );
        // На своём веку, столько-то раз на дню.
        // При этом, в веке — 100 лет, в дне — 24 часа.
        addConfig(m, LocativeFormAttribute.WAY, 'на', 'век,день');
        // Это читерство небольшое, но тут аналогичная ситуация.
        addConfig(m, LocativeFormAttribute.WAY, 'в', 'час');
        // "на корню" — устойчивое выражение (наречие), означающее "в процессе формирования".
        // "зарубить на корню" — "уничтожить в самом начале".
        addConfig(m, LocativeFormAttribute.WAY, 'на', 'корень');

        // 5. объекты с функциональной (не обязательно плоской) поверхностью («на»)
        addConfig(mAnimate, LocativeFormAttribute.OBJECT_WITH_FUNCTIONAL_SURFACE, 'на', 'вор');
        addConfig(m, LocativeFormAttribute.OBJECT_WITH_FUNCTIONAL_SURFACE, 'на', '' +
            'бочок,' +  // лежать на бочку, т.е. лежать боком вниз (почти не употребляется)
            'борт,воз,горб,кол,мост,плот,сук,' +
            'х' + String.fromCharCode(1091) + 'й'
        );

        // 6. вещества и материалы («в» и «на»)
        const substance_or_resource = ',мёд,мех,пар,пух';
        addConfig(m, LocativeFormAttribute.SUBSTANCE, 'в', 'дым,жир,мел,пушок' + substance_or_resource);
        addConfig(m, LocativeFormAttribute.RESOURCE, 'на', 'газ,клей,спирт' + substance_or_resource);

        // 7. ситуации и состояния («в» и «на»)
        addConfig(m, LocativeFormAttribute.CONDITION, 'в',
            'бой,бред,быт,долг,плен,пыл,сок,ход,лад');
        // Тут я имею в виду смысл, употреблённый в текущем предложении.
        // Кое-где пишут, что есть еще употребление "в виду гор" в значении "там, откуда видны горы".
        // Никогда не слышал, чтобы так говорили. Если в эту классификацию это вписывать,
        // я не уверен, EXPOSURE это, CONDITION или что-то третье.
        addConfig(m, LocativeFormAttribute.EXPOSURE, 'в,на', 'вид');
        addConfig(m, LocativeFormAttribute.EXPOSURE, 'на', 'слух,счёт,ветер,ветр,свет');
        addConfig(m, LocativeFormAttribute.MOTION, 'на', 'ход,бег,вес');
        // Пока непонятно, как разграничить "на каждом шагу" и "на первом шаге".
        addConfig(m, [LocativeFormAttribute.MOTION, LocativeFormAttribute.WITH_ADJECTIVE], 'на', 'шаг');
        addConfig(m, LocativeFormAttribute.EVENT, 'на', 'бал,пир');
        // Может быть "дух" когда-то и значило "исповедь",
        // сейчас это только всех запутает.
        addConfig(m, LocativeFormAttribute.CONDITION, 'на', 'дух');
        // На полном газу. Не уверен, как это сюда записать. Вроде, устойчивое выражение.
        addConfig(m, [LocativeFormAttribute.MOTION, LocativeFormAttribute.WITH_ADJECTIVE], 'на', 'газ');

        // 1 и 5.
        addConfig(m, LocativeFormAttribute.CONTAINER, 'в', 'глаз,нос,шкаф');
        addConfig(m, LocativeFormAttribute.CONTAINER, 'во', 'лоб');
        addConfig(m, LocativeFormAttribute.OBJECT_WITH_FUNCTIONAL_SURFACE, 'на', 'глаз,лоб,нос,шкаф');

        let two_and_five = 'бок,верх,зад,угол';
        addConfig(m, LocativeFormAttribute.LOCATION, 'в', two_and_five);
        addConfig(m, LocativeFormAttribute.OBJECT_WITH_FUNCTIONAL_SURFACE, 'на', two_and_five);
        // Есть сомнения, в каких случаях используется форма предложного падежа.
        // Является ли решающим наличие любого определения (в *Красноярском* крае, на *внешнем* крае)
        // или подобные выражения являются исключениями и их нельзя обобщать.
        // Я пока что склоняюсь к первому варианту.
        addConfig(m, [
            LocativeFormAttribute.LOCATION,
            LocativeFormAttribute.WITHOUT_ADJECTIVE
        ], 'в', 'край');
        addConfig(m, [
            LocativeFormAttribute.OBJECT_WITH_FUNCTIONAL_SURFACE,
            LocativeFormAttribute.WITHOUT_ADJECTIVE
        ], 'на', 'край');

        // 4 и 6
        addConfig(m, LocativeFormAttribute.SURFACE, 'на', 'лёд,мох,снег');
        addConfig(m, LocativeFormAttribute.SUBSTANCE, 'во', 'лёд,мох');
        addConfig(m, LocativeFormAttribute.SUBSTANCE, 'в', 'снег');

        // А также, у слов женского рода третьего склонения с особыми формами
        // локатива пять семантических классов.
        // Однако, у локатива в словах женского рода третьего склонения отличается
        // от предложного падежа только ударение — смещается на последний слог,
        // на письме они не отличаются.

        return dictionary;
    }

    const reYo = s => {
        const index = Math.max(
            s.toLowerCase().lastIndexOf('е'),
            s.toLowerCase().lastIndexOf('ё')
        );
        const r = upperLike('ё', s[index]);
        return s.substring(0, index) + r + s.substring(index + 1);
    };

    const singleEYo = s => (s.replace(/[^её]/g, '').length === 1);

    function getNounStem0(word, lcWord) {
        const lcLastChar = last(lcWord);

        if (bincludes(0b11101000000010000100001100100001, lcLastChar)) {
            if (isVowel(last(init(lcWord)))) {
                return nInit(word, 2);
            } else if ('й' !== lcLastChar) {
                return init(word);
            }
        }

        return word;
    }

    const stemData = (() => {
        const obj = {};
        obj.mobileVowelA = new Set(['бубен', 'бугор',
            'ветер', 'вошь', 'вымысел', 'горшок', 'дятел', 'домысел', 'замысел',
            'кашель', 'коготь',
            'лапоть', 'лоб', 'локоть', 'ломоть', 'молебен', 'мох', 'ноготь', 'овен',
            'пепел', 'пес', 'пёс', 'петушок', 'помысел', 'порошок',
            'промысел', 'псалом', 'пушок', 'ров', 'рожь', 'рот',
            'сон', 'стебель', 'стишок',
            'угол', 'умысел', 'хребет', 'церковь', 'шов'
        ]);
        obj.mobileVowelB = ['узел', 'уголь', 'чок', 'ешок', 'хол'];
        obj.en2a2b = [
            'ясень', 'бюллетень', 'олень', 'тюлень',
            'гордень', 'пельмень',
            'ячмень'
        ];
        return Object.freeze(obj);
    })();

    function getNounStem(lemma) {
        const word = lemma.text();
        const lcWord = lemma.lower();
        const gender = lemma.getGender();
        const lcLastChar = last(lcWord);

        if (stemData.mobileVowelA.has(lcWord)
            || endsWithAny(lcWord, stemData.mobileVowelB)
            || (lemma.isAnimate() && lcWord.endsWith('посол'))
        ) {
            const w = (lcLastChar === 'ь') ? init(word) : word;
            return nInit(w, 2) + last(w);
        }

        if (['лёд', 'лед'].includes(lcWord) || (('лев' === lcWord) && lemma.isAnimate())) {
            return nInit(word, 2) + upperLike('ь', last(init(word))) + last(word);
        }

        if (lcWord.endsWith('рёк') && vowelCount(word) >= 2) {
            return nInit(word, 2) + 'ьк';
        } else if (lcWord.endsWith('ёк') && isVowel(lastOfNInitial(word, 2))) {
            return nInit(word, 2) + 'йк';
        }

        if (isConsonantNotJ(lcLastChar)) {
            return word;
        }

        if ('ь' === lcLastChar) {
            if (lcWord.endsWith('ень') && (gender === Gender.MASCULINE) && !endsWithAny(lcWord, stemData.en2a2b)) {
                return nInit(word, 3) + 'н';
            } else {
                return init(word);
            }
        }

        const lcLastInit = last(init(lcWord));

        if ('ь' === lcLastInit) {
            return init(word);
        }

        if ('о' === lcLastChar && bincludes(0b1001100011100000000100, lcLastInit)) {
            return init(word);
        }

        return getNounStem0(word, lcWord);
    }

    function getDeclension(lemma) {
        const lcWord = lemma.lower();
        const gender = lemma.getGender();

        if (lemma.isPluraleTantum()) {
            return undefined;
        }

        if (lemma.isIndeclinable()) {
            return -1;
        }

        const t = last(lcWord);
        switch (gender) {
            case Gender.FEMININE:
                return t === "а" || t === "я" ? 2 :
                    isConsonantLc(t) ? -1 : 3;
            case Gender.MASCULINE:
                return t === "а" || t === "я" ? 2 :
                    lcWord === "путь" ? 0 : 1;
            case Gender.NEUTER:
                return ['дитя', 'полудитя'].includes(lcWord) ? 0 :
                    nLast(lcWord, 2) === "мя" ? 3 : 1;
            case Gender.COMMON:
                if (t === 'а' || t === 'я') {
                    return 2;
                } else if (t === 'и') {
                    return -1;
                } else {
                    return 1;
                }
            default:
                throw new Error('incorrect gender');
        }
    }

    const tsWord = w => last(w) === 'ц';

    function tsStem(word, lemma) {
        const head = init(word);
        const lcHead = init(lemma.lower());
        if ('а' === last(lcHead)) {
            return head;
        } else if (endsWithAny(lcHead, ['зне', 'жне', 'гре', 'спе', 'мудре'])
            || nLast(init(lcHead), 3).split('')
                .every(l => isConsonantNotJ(l))
            || lemma.isAName()
        ) {
            return head;
        } else if (nLast(lcHead, 2) === 'ле') {
            const beforeLe = lastOfNInitial(lcHead, 2);
            if (isVowel(beforeLe) || ('л' === beforeLe)) {
                return init(head) + 'ь';
            } else {
                return head;
            }
        } else if (isVowel(last(lcHead)) && (last(lcHead) !== 'и')) {
            if (isVowel(last(init(lcHead)))) {
                return nInit(word, 2) + 'й';
            } else if (endsWithAny(lemma.lower(), ['месяц'])) {
                return head;
            } else {
                return nInit(word, 2);
            }
        } else {
            return head;
        }
    }

    function okWord(w) {
        const tok = [
            'лапоток', 'желток'
        ];
        const tok2 = [
            'поток', 'приток', 'переток', 'проток', 'биоток', 'электроток',
            'восток', 'водосток', 'водоток', 'воток',
            'знаток'
        ];
        const exceptThese = [
            'инок', 'исток',
            'обморок', 'порок', 'пророк', 'сток', 'урок'
        ];
        return (endsWithAny(w, ['чек', 'шек']) && (w.length >= 6))
            || endsWithAny(w, tok)
            || (
                w.endsWith('ок') && !w.endsWith('шок') && !exceptThese.includes(w)
                && !endsWithAny(w, tok2)
                && !isVowel(lastOfNInitial(w, 2))
                && (isVowel(lastOfNInitial(w, 3)) || endsWithAny(nInit(w, 2), ['ст', 'рт']))
                && w.length >= 4
            );
    }

    const softD1 = w => (last(w) === 'ь' && !w.endsWith('господь'))
        || ('её'.includes(last(w)) && !endsWithAny(w, ['це', 'же']));

    function halfSomething(lcWord) {
        if (lcWord.startsWith('пол')
            && bincludes(0b10011000000000000000000100000001, last(lcWord))
            && (vowelCount(lcWord) >= 2)) {

            let subWord = lcWord.substring(3);

            // На случай дефисов.
            let offset = subWord.search(/[а-яА-ЯёЁ]/);

            // Сюда не должны попадать как минимум
            // мягкий и твердый знаки помимо гласных.

            return (offset >= 0) && isConsonantLc(subWord[offset].toLowerCase());

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

    const decline1Data = (() => {
        const obj = {};
        obj.uForm = new Set((
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
        obj.ogoEndings = ['ое', 'нький', 'ский', 'ской', 'лстой', 'отой', 'утой', 'евой', 'овой', 'живой'];
        obj.egoEndings = ['кожий', 'шний', 'жний', 'щий', 'ший', 'жий', 'чий'];
        return Object.freeze(obj);
    })();

    /**
     * @param {RussianNouns.Engine} engine
     * @param {RussianNouns.Lemma} lemma
     * @param {string} grCase
     * @returns {Array|string}
     */
    function decline1(engine, lemma, grCase) {
        const word = lemma.text();
        const lcWord = lemma.lower();
        const gender = lemma.getGender();

        const half = halfSomething(lcWord);

        if (half && endsWithAny(lcWord, ['и', 'ы'])) {

            if ([Case.NOMINATIVE, Case.ACCUSATIVE].includes(grCase)) {
                return word;
            } else {

                const h = o => (!['полминуты'].includes(o.lower()))
                    ? ('полу' + o.text().substring(3)) : o.text();

                if ('полпути' === lcWord) {
                    if ([Case.PREPOSITIONAL, Case.LOCATIVE].includes(grCase)) {
                        return word;
                    } else {
                        let lemmaCopy = lemma.newText(o => init(h(o)) + 'ь');
                        return decline0(engine, lemmaCopy, grCase);
                    }
                } else if (lcWord.endsWith('зни')) {
                    let lemmaCopy = lemma.newText(o => init(h(o)) + 'ь');
                    return decline3(engine, lemmaCopy, grCase);
                } else {
                    let lemmaCopy = lemma.newText(o => init(h(o)) +
                        ((last(o.lower()) === 'н') ? 'я' : 'а'));
                    return decline2(engine, lemmaCopy, grCase);
                }
            }
        }

        let stem = getNounStem(lemma);
        let head = init(word);

        const soft = (half && lcWord.endsWith('я')) || softD1(lcWord);

        if (half) {
            stem = 'полу' + stem.substring(3);
            head = 'полу' + head.substring(3);
        }

        let lcStem = stem.toLowerCase();

        const eStem = (s, f) => {
            const stressedEnding = engine.sd.hasStressedEndingSingular(lemma, grCase);
            if (!stressedEnding.length) {
                stressedEnding.push(false);
            }
            return stressedEnding.map(b => b ? f(unYo(s), b) : f(s, b));
        };

        const iyWord = last(lcWord) === 'й'
            || ['ий', 'ие', 'иё'].includes(nLast(lcWord, 2));

        const eiWord = () => endsWithAny(lcWord, [
            'воробей', 'муравей', 'ручей', 'соловей', 'улей'
        ]);

        const eiStem = () => {
            if (eiWord()) {
                return init(head) + upperLike('ь', last(head));
            } else {
                return head;
            }
        };

        const schWord = () => 'чщ'.includes(last(lcStem));

        const surnameType1 = () => lemma.isASurname()
            && (
                lcWord.endsWith('ын') || lcWord.endsWith('ин')
                || lcWord.endsWith('ов') || lcWord.endsWith('ев') || lcWord.endsWith('ёв')
            );

        const iyoy = () => (nLast(lcWord, 2) === 'ый')
            || (endsWithAny(lcWord, ['ной', 'понятой']) && vowelCount(word) >= 2);

        if (Case.NOMINATIVE === grCase) {
            return word;
        }

        if (Case.GENITIVE === grCase) {

            function addUForm(r) {
                if (!lemma.isAnimate() && decline1Data.uForm.has(lcWord)) {
                    if (last(lcWord) === 'й') {
                        r.push(init(word) + upperLike('ю', last(word)));
                    } else {
                        r = r.concat(eStem(stem, s => s + upperLike('у', last(s))));
                    }
                }
                return r;
            }

            if ((iyWord && lemma.isASurname())
                || iyoy()
                || endsWithAny(lcWord, decline1Data.ogoEndings)) {
                return stem + 'ого';
            } else if (endsWithAny(lcWord, decline1Data.egoEndings) || lcWord.endsWith('ее')) {
                return stem + 'его';
            } else if (iyWord) {
                let r = [eiStem() + 'я'];
                return addUForm(r);
            } else if (soft && !schWord()) {
                return stem + 'я';
            } else if (tsWord(lcWord)) {
                return tsStem(word, lemma) + 'ца';
            } else if (okWord(lcWord)) {
                return init(head) + 'ка';
            } else if (endsWithAny(lcWord, ['шко']) && (Gender.MASCULINE === gender)) {
                // Не уверен, сюда ли отнести слово "дружище".
                // Но это не важно: оно не употребляется в родительном падеже ед.ч.
                // (в национальном корпусе два с половиной примера из 19-го века).
                return head + 'и';
            } else {
                let r = [];
                if (lemma.isASurname() || (lcStem.indexOf('ё') === -1)) {
                    r.push(stem + 'а');
                } else {
                    r = r.concat(eStem(stem, s => s + 'а'));
                }
                return addUForm(r);
            }
        }

        if (Case.DATIVE === grCase) {
            if ((iyWord && lemma.isASurname())
                || iyoy()
                || endsWithAny(lcWord, decline1Data.ogoEndings)) {
                return stem + 'ому';
            } else if (endsWithAny(lcWord, decline1Data.egoEndings) || lcWord.endsWith('ее')) {
                return stem + 'ему';
            } else if (iyWord) {
                return eiStem() + 'ю';
            } else if (soft && !schWord()) {
                return stem + 'ю';
            } else if (tsWord(lcWord)) {
                return tsStem(word, lemma) + 'цу';
            } else if (okWord(lcWord)) {
                return init(head) + 'ку';
            } else if (lemma.isASurname() || (lcStem.indexOf('ё') === -1)) {
                return stem + 'у';
            } else {
                return eStem(stem, s => s + 'у');
            }
        }

        if (Case.ACCUSATIVE === grCase) {
            if (gender === Gender.NEUTER) {
                return word;
            } else {
                const a = lemma.isAnimate();
                if (a === true) {
                    return decline1(engine, lemma, Case.GENITIVE);
                } else {
                    return word;
                }
            }
        }

        if (Case.INSTRUMENTAL === grCase) {
            if ((iyWord && lemma.isASurname()) || endsWithAny(lcWord, ['ее', 'ое', 'нький', 'ский', 'ской', 'лстой', 'отой', 'утой'])) {

                if (endsWithAny(lcWord, ['вое', 'лое', 'мое', 'ное', 'рое', 'тое', 'той', 'ый'])) {
                    return stem + 'ым';
                } else {
                    return stem + 'им';
                }

            } else if (iyoy() || endsWithAny(lcWord, ['евой', 'овой', 'отой', 'живой'])) {
                return stem + 'ым';
            } else if (endsWithAny(lcWord, decline1Data.egoEndings)) {
                return init(head) + 'им';
            } else if (iyWord) {
                return eiStem() + 'ем';
            } else if (soft || ('жшчщ'.includes(last(lcStem)))) {

                return eStem(stem, (s, stressedEnding) => stressedEnding
                    ? (s + 'ом') : (s + 'ем'));

            } else if (tsWord(lcWord)) {

                return eStem(word, (w, stressedEnding) => stressedEnding
                    ? (tsStem(w, lemma) + 'цом') : (tsStem(w, lemma) + 'цем'));

            } else if (lcWord.endsWith('це')) {
                return word + 'м';
            } else if (okWord(lcWord)) {
                return init(head) + 'ком';
            } else if (surnameType1()) {
                return word + 'ым';
            } else if (lemma.isASurname() || (lcStem.indexOf('ё') === -1)) {
                return stem + 'ом';
            } else {
                return eStem(stem, s => s + 'ом');
            }
        }

        if (Case.PREPOSITIONAL === grCase) {
            if ((iyWord && lemma.isASurname())
                || iyoy()
                || endsWithAny(lcWord, decline1Data.ogoEndings)) {
                return stem + 'ом';
            } else if (endsWithAny(lcWord, decline1Data.egoEndings) || lcWord.endsWith('ее')) {
                return stem + 'ем';
            } else if (endsWithAny(lcWord, ['воробей'])) {
                const i = init(head);
                return i + upperLike('ье', last(i));
            } else if (endsWithAny(lcWord, [
                'ий', 'ие', 'чье', 'тье', 'дье', 'вье', 'бье',
                'енье', 'жалованье',
                'ружье', 'божье', 'верье', 'мужье'
            ]) && !endsWithAny(lcWord, [
                'запястье', 'здоровье', 'изголовье',
                'платье'
            ])) {
                return head + 'и';
            } else if ((last(lcWord) === 'й') || ('иё' === nLast(lcWord, 2))) {
                return eiStem() + 'е';
            } else if (tsWord(lcWord)) {
                return tsStem(word, lemma) + 'це';
            } else if (okWord(lcWord)) {
                return init(head) + 'ке';
            } else if (lemma.isASurname() || (lcStem.indexOf('ё') === -1)) {
                return stem + 'е';
            } else {
                return eStem(stem, s => s + 'е');
            }
        }

        if (Case.LOCATIVE === grCase) {

            const locativeConfigs = locativeDictionary.get(lemma, false);
            if (locativeConfigs) {
                const declensionTypes = unique(locativeConfigs.map(x => x.declensionType));
                return declensionTypes.map(dType => toLocativeSingular1(engine, lemma, dType));
            }

            return decline1(engine, lemma, Case.PREPOSITIONAL);
        }
    }

    function decline2(engine, lemma, grCase) {
        const word = lemma.text();
        const lcWord = lemma.lower();

        const stem = getNounStem(lemma);
        const lcStem = stem.toLowerCase();

        const head = init(word);
        const lcHead = init(lcWord);

        const soft = () => {
            return last(lcWord) === 'я';
        };
        const ayaWord = () => {
            return lcWord.endsWith('ая') && !((vowelCount(word) === 2) || isVowel(last(stem)));
        };
        const yayaWord = () => {
            return lcWord.endsWith('яя') && !((vowelCount(word) === 2) || isVowel(last(stem)));
        };
        const ayaExceptions = [
            'жая', 'шая'
        ];
        switch (grCase) {
            case Case.NOMINATIVE:
                return word;
            case Case.GENITIVE:
                if (yayaWord() || endsWithAny(lcWord, ayaExceptions)) {
                    return stem + 'ей';
                } else if (ayaWord()) {
                    return stem + 'ой';
                } else if (lemma.isASurname() && !lcWord.endsWith('да')) {
                    return head + 'ой';
                } else if (lcWord.endsWith('ничья')) {
                    return head + 'ей';
                } else if (
                    soft() || bincludes(0b11101000000000010001001000, last(lcStem))  // soft, sibilant or velar
                ) {
                    return head + 'и';
                } else {
                    return head + 'ы';
                }
            case Case.DATIVE:
                if (yayaWord() || endsWithAny(lcWord, ayaExceptions)) {
                    return stem + 'ей';
                } else if (ayaWord()) {
                    return stem + 'ой';
                } else if (lemma.isASurname() && !lcWord.endsWith('да')) {
                    return head + 'ой';
                } else if (nLast(lcWord, 2) === 'ия') {
                    return head + 'и';
                } else if (lcWord.endsWith('ничья')) {
                    return head + 'ей';
                } else {
                    return head + 'е';
                }
            case Case.ACCUSATIVE:
                if (ayaWord()) {
                    return stem + 'ую';
                } else if (yayaWord()) {
                    return stem + 'юю';
                } else if (soft()) {
                    return head + 'ю';
                } else {
                    return head + 'у';
                }
            case Case.INSTRUMENTAL:
                if (yayaWord() || endsWithAny(lcWord, ayaExceptions)) {
                    return stem + 'ею';
                } else if (ayaWord()) {
                    return stem + 'ой';
                } else if (soft() ||
                        ('жшчщц'.includes(last(lcStem)) &&
                            !(engine.sd.hasStressedEndingSingular(lemma, grCase).includes(true)))) {
                    if ('и' === last(lcHead)) {
                        return head + 'ей';
                    } else {
                        return [head + 'ей', head + 'ею'];
                    }
                } else {
                    return [head + 'ой', head + 'ою'];
                }
            case Case.PREPOSITIONAL:
                if (yayaWord() || endsWithAny(lcWord, ayaExceptions)) {
                    return stem + 'ей';
                } else if (ayaWord()) {
                    return stem + 'ой';
                } else if (lemma.isASurname() && !lcWord.endsWith('да')) {
                    return head + 'ой';
                } else if (nLast(lcWord, 2) === 'ия') {
                    return head + 'и';
                } else if (lcWord.endsWith('ничья')) {
                    return head + 'ей';
                } else {
                    return head + 'е';
                }
            case Case.LOCATIVE:
                return decline2(engine, lemma, Case.PREPOSITIONAL);
        }
    }

    const specialD3 = {
        'дочь': 'дочерь',
        'мать': 'матерь'
    };

    function decline3(engine, lemma, grCase) {
        const word = lemma.text();
        const lcWord = lemma.lower();

        if (![Case.NOMINATIVE, Case.ACCUSATIVE].includes(grCase)) {
            if (Object.keys(specialD3).includes(lcWord)) {
                const lemmaCopy = lemma.newText(() => specialD3[lcWord]);
                return decline3(engine, lemmaCopy, grCase);
            }
        }

        const stem = getNounStem(lemma);

        if (nLast(lcWord, 2) === 'мя') {
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
                    return decline3(engine, lemma, Case.PREPOSITIONAL);
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
                    if (endsWithAny(lcWord, ['вошь', 'рожь', 'церковь'])) {
                        return word + 'ю';
                    } else {
                        return stem + 'ью';
                    }
                case Case.PREPOSITIONAL:
                    return stem + 'и';
                case Case.LOCATIVE:
                    return decline3(engine, lemma, Case.PREPOSITIONAL);
            }
        }
    }

    function declineAsList(engine, lemma, grCase, pluralForm) {
        const r = decline(engine, lemma, grCase, pluralForm);
        if (r instanceof Array) {
            return r;
        }
        return [r];
    }

    function decline(engine, lemma, grCase, pluralForm) {
        const word = lemma.text();

        if (lemma.isIndeclinable()) {
            return word;
        }

        if (lemma.isPluraleTantum()) {
            return declinePlural(engine, lemma, grCase, word);
        } else if (pluralForm) {
            return declinePlural(engine, lemma, grCase, pluralForm);
        }

        const declension = getDeclension(lemma);

        switch (declension) {
            case -1:
                return word;
            case 0:
                return decline0(engine, lemma, grCase);
            case 1:
                return decline1(engine, lemma, grCase);
            case 2:
                return decline2(engine, lemma, grCase);
            case 3:
                return decline3(engine, lemma, grCase);
        }
    }

    function toLocativeSingular1(engine, lemma, declensionType) {
        if (LocativeDeclensionType.U_SUFFIX === declensionType) {
            const word = lemma.text();
            const lcWord = lemma.lower();
            let stem = getNounStem(lemma);
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
        if (0 === declension) {
            return decline0(engine, lemma, Case.PREPOSITIONAL);
        } else if (1 === declension) {
            return toLocativeSingular1(engine, lemma, declensionType);
        } else if (2 === declension) {
            return decline2(engine, lemma, Case.PREPOSITIONAL);
        } else if (3 === declension) {
            return decline3(engine, lemma, Case.PREPOSITIONAL);
        }
    }

    function pluralize(engine, lemma) {
        const result = [];

        const word = lemma.text();
        const lcWord = lemma.lower();

        const stem = getNounStem(lemma);
        const lcStem = stem.toLowerCase();

        if (lcWord.endsWith('яя')) {
            result.push(nInit(word, 2) + 'ие');
            return unique(result);
        }

        const stressedEnding = engine.sd
            .hasStressedEndingPlural(lemma, Case.NOMINATIVE);

        Object.freeze(stressedEnding);

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

        const eStem = (s, f) => {
            const stressedEndingCopy = stressedEnding.slice();

            if (!stressedEndingCopy.length) {
                stressedEndingCopy.push(false);
            }

            return stressedEndingCopy.map(b => b ? f(unYo(s)) : f(s));
        };

        const gender = lemma.getGender();
        const declension = getDeclension(lemma);

        const simpleFirstPart = (('й' === last(lcWord) || isVowel(last(word))) && isVowel(last(init(word))))
            ? init(word)
            : stem;

        const softPatronymic = () => (lcWord.endsWith('евич') || lcWord.endsWith('евна'))
            && (lcWord.indexOf('ье') >= 0);

        function softPatronymicForm2() {
            const part = simpleFirstPart;
            const index = part.toLowerCase().indexOf('ье');
            const r = upperLike('и', part[index]);
            return part.substring(0, index) + r + part.substring(index + 1);
        }

        function yeruOrI() {
            if (bincludes(0b11101000000000010001001000, last(lcStem))  // sibilant or velar
                || 'яйь'.includes(last(lcWord))
                || endsWithAny(lcWord, ['сосед'])) {

                if (softPatronymic()) {
                    result.push(softPatronymicForm2() + 'и');
                    result.push(simpleFirstPart + 'и');
                } else {
                    Array.prototype.push.apply(result,
                        eStem(simpleFirstPart, s => s + 'и'));
                }

            } else if (tsWord(lcWord)) {
                result.push(tsStem(word, lemma) + 'цы');

            } else {

                if (softPatronymic()) {
                    result.push(softPatronymicForm2() + 'ы');
                    result.push(simpleFirstPart + 'ы');
                } else {
                    Array.prototype.push.apply(result,
                        eStem(simpleFirstPart, s => s + 'ы'));
                }

            }
        }

        // Не думаю, что эти исключения можно элегантно зашить в имеющийся код.
        // Пока что вот такая мэпка кажется мне наипростейшим решением из возможных.
        // В перспективе, хорошо бы зарефакторить pluralize и declinePlural.
        const highPriorityExceptions = [
            [
                [
                    Gender.MASCULINE,
                    undefined
                ],
                {
                    'болгарин': ['болгары'],
                    'господин': ['господа'],
                    'дядя': ['дяди', 'дядья'],
                    'зуб': ['зубы', 'зубья'],   // TODO: омонимы, переделать
                    'клок': ['клочья', 'клоки'],
                    'князь': ['князи', 'князья'],
                    'кол': ['колы', 'колья'],   // TODO: можно разделить на омонимы
                    'месяц': ['месяцы'],
                    'татарин': ['татары'],
                    'хозяин': ['хозяева'],
                    'цветок': ['цветки', 'цветы']
                }
            ],
            [
                [
                    Gender.MASCULINE,
                    true
                ],
                {
                    'кондуктор': ['кондуктора', 'кондукторы'],
                    'кум': ['кумовья'],
                    'муж': ['мужья', 'мужи']
                }
            ],
            [
                [
                    Gender.FEMININE,
                    undefined
                ],
                {
                    'гроздь': ['грозди', 'гроздья'],
                    'курица': ['курицы', "куры"],
                    'стая': ['стаи'],
                    // И я решил зашить сюда даже случаи, когда итак слово норм обрабатывается,
                    // но в корпусе там буква Ё. И почему бы не выдавать так же букву Ё.
                    // В будущем это наверно надо отрефакторить.
                    'щека': ['щёки'],
                    'береста': ['берёсты'],
                    'верста': ['вёрсты'],
                    'десна': ['дёсны'],
                    'жена': ['жёны'],
                    'звезда': ['звёзды'],
                    'кинозвезда': ['кинозвёзды'],
                    'медсестра': ['медсёстры'],
                    'метла': ['мётлы'],
                    'пчела': ['пчёлы'],
                    'сестра': ['сёстры'],
                    'слеза': ['слёзы']
                }
            ],
            [
                [
                    Gender.NEUTER,
                    undefined
                ],
                {
                    'брюхо': ['брюхи'],
                    'колено': ['колена', 'колени', 'коленья'], // TODO: можно разделить на омонимы
                    'древо': ['древа', 'древеса'],
                    'ухо': ['уши'],
                    'око': ['очи'],
                    'дно': ['донья'],
                    'чудо': ['чудеса', 'чуда'],
                    'небо': ['небеса'],
                    // Буква Ё:
                    'бревно': ['брёвна'],
                    'ведро': ['вёдра'],
                    'веретено': ['веретёна'],
                    'весло': ['вёсла'],
                    'гнездо': ['гнёзда'],
                    'зерно': ['зёрна'],
                    'знамя': ['знамёна'],
                    'колесо': ['колёса'],
                    'облачко': ['облачка'],
                    'озеро': ['озёра'],
                    'ребро': ['рёбра'],
                    'ремесло': ['ремёсла'],
                    'седло': ['сёдла'],
                    'село': ['сёла']
                }
            ]
        ];

        for (const [key, genderExceptions] of highPriorityExceptions) {

            const keyGender = key[0];
            const keyAnimate = key[1];

            if ((gender === keyGender)
                && ((keyAnimate == null) || (keyAnimate === lemma.isAnimate()))
                && genderExceptions.hasOwnProperty(lcWord)) {

                const v = genderExceptions[lcWord];

                for (let x of v) {
                    result.push(x);
                }

                return unique(result);
            }
        }

        const yaD1 = [
            'зять', 'деверь',
            'друг',
            'брат', 'собрат',
            'лист', 'стул',
            'брус',
            'обод', 'полоз',
            'струп',
            'подмастерье',
            'якорь',

            'перо',
            'шило'
        ];

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
                    result.push(nInit(word, 3) + 'ети');
                } else {
                    throw new Error('unsupported');
                }
                break;
            case 1:
                if (yaD1.includes(lcWord)) {

                    result.push(softStemD1 + 'я');

                } else if (Gender.MASCULINE === gender) {

                    // Возможно, эти штуки могли бы подстраиваться под словарь ударений,
                    // но я один раз пробовал, и у меня ничего не получилось.

                    const aYaWords = [
                        'берег', 'бок', 'борт',
                        'век', 'вес',
                        'веер', // TODO: Это всё тоже вынести в настройку (в экземпляре движка).
                        'вексель',  // 😰
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
                        'том',  // TODO неодушевленное (не имя).
                        'холод', 'цвет', 'череп'
                    ];

                    const aYaWords2 = [
                        'округ', 'остров', 'отпуск',
                        'паспорт', 'парус', 'поезд', 'повар', 'погреб',
                        'рукав',
                        'цех',
                        'юнкер'
                    ];

                    const aYaWords3 = [
                        'адрес',
                        'договор',
                        'буфер',
                        'ворох',
                        'директор',
                        'инспектор', 'инструктор',
                        'корпус',   // TODO омонимы
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
                        'юнкер',    // 🤕
                        'ястреб'
                    ];

                    const aYaWords4 = [
                        'бункер',
                        'вымпел',
                        'год',
                        'образ', // Разделить на омонимы?
                        'омут',
                        'токарь', 'тополь',
                        'шторм', 'штуцер'
                    ];

                    const ya2 = [
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

                    } else if (aYaWords.includes(lcWord) || endsWithAny(lcWord, aYaWords2)
                        || aYaWords3.includes(lcWord) || aYaWords4.includes(lcWord)) {

                        if (aYaWords4.includes(lcWord)) {
                            yeruOrI();
                        }

                        if (softD1(lcWord)) {
                            Array.prototype.push.apply(result, yoStem(s => s + 'я'));
                        } else if (stressedEnding.includes(true)) {
                            result.push(unYo(stem) + 'а');
                        } else {
                            result.push(stem + 'а');
                        }

                        if (aYaWords3.includes(lcWord)) {
                            yeruOrI();
                        }

                    } else if (
                        ((lcWord.endsWith('анин') || lcWord.endsWith('янин')) && !lemma.isAName())
                        || ['барин', 'боярин'].includes(lcWord)
                    ) {
                        result.push(nInit(word, 2) + 'е');

                        // В корпусе фигурирует
                        if ('барин' === lcWord) {
                            result.push(nInit(word, 2) + 'ы');
                        }

                    } else if (['цыган'].includes(lcWord)) {
                        result.push(word + 'е');
                    } else if ('щенок' === lcWord) {
                        result.push(nInit(word, 2) + 'ки');
                        result.push(nInit(word, 2) + 'ята');
                    } else if ((lcWord.endsWith('ребёнок') || lcWord.endsWith('ребенок'))
                        && !(lcWord.endsWith('жеребёнок') || lcWord.endsWith('жеребенок'))
                        && !(lcWord.endsWith('ястребёнок') || lcWord.endsWith('ястребенок'))) {
                        result.push(nInit(word, 7) + 'дети');
                    } else if ((lcWord.endsWith('ёнок') || lcWord.endsWith('енок'))
                        && lemma.isAnimate()) {
                        result.push(nInit(word, 4) + 'ята');
                    } else if (lcWord.endsWith('ёночек')
                        && lemma.isAnimate()) {
                        result.push(nInit(word, 6) + 'ятки');
                    } else if (lcWord.endsWith('онок')
                        && 'жшч'.includes(lastOfNInitial(lcWord, 4))
                        && lemma.isAnimate()) {
                        result.push(nInit(word, 4) + 'ата');
                    } else if (okWord(lcWord)) {
                        result.push(nInit(word, 2) + 'ки')
                    } else if (lcWord.endsWith('ый') || endsWithAny(lcWord, ['щий', 'чий', 'жний', 'шний', 'ский'])) {
                        result.push(init(word) + 'е');
                    } else if ((lcWord.endsWith('вой') && vowelCount(nInit(word, 3)) >= 2)
                        || endsWithAny(lcWord, ['живой', 'лстой', 'отой', 'утой'])
                        || (endsWithAny(lcWord, ['ной', 'мой']) && word.length >= 6)) {
                        result.push(nInit(word, 2) + 'ые');
                    } else if (endsWithAny(lcWord, ['хой', 'ской', 'ший', 'жий'])) {
                        result.push(nInit(word, 2) + 'ие');
                    } else if (lcWord.endsWith('его')) {
                        result.push(nInit(word, 3) + 'ие');
                    } else if ([
                        'воробей', 'муравей', 'ручей', 'соловей', 'улей',
                        'жеребей', // — жребий; доля поместья.
                        'ирей', // Довольно бессмысленно в мн. ч.
                        'репей', 'чирей' // Я бы сказал "-еи", но в словарях так.
                    ].includes(lcWord)) {
                        result.push(nInit(word, 2) + 'ьи');
                    } else {
                        yeruOrI();
                    }

                } else if (Gender.NEUTER === gender) {

                    if (endsWithAny(lcWord, ['ко', 'чо'])
                        && !endsWithAny(lcWord, ['войско', 'облако'])
                    ) {
                        result.push(init(word) + 'и');
                    } else if (lcWord.endsWith('имое')) {
                        result.push(stem + 'ые')

                    } else if (lcWord.endsWith('ее')) {
                        result.push(stem + 'ие');

                    } else if (lcWord.endsWith('ое')) {

                        if (endsWithAny(lcStem, ['г', 'к', 'ж', 'ш'])) {
                            result.push(stem + 'ие');
                        } else {
                            result.push(stem + 'ые');
                        }

                    } else if (endsWithAny(lcWord, ['ие', 'иё'])) {
                        result.push(nInit(word, 2) + 'ия');

                    } else if (endsWithAny(lcWord, ['ье', 'ьё'])) {

                        const w = nInit(word, 2);

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
                        result.push(nInit(word, 2) + 'а');
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
                    if ('жш'.includes(last(lcStem)) || endsWithAny(lcStem, ['ск', 'цк'])) {
                        result.push(stem + 'ие');
                    } else {
                        result.push(stem + 'ые');
                    }
                } else {
                    yeruOrI();
                }
                break;
            case 3:
                if (nLast(lcWord, 2) === 'мя') {
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

    const declinePluralData = (() => {
        const obj = {};

        obj.softEndings = [
            'ли', 'си', 'би', 'ви', 'ди', 'ти', 'пи', 'ри', 'ни', 'фи', 'зи',
            'ьи', 'ья', 'ия', 'ря', 'ля', 'ая',
            'аи', 'ои', 'уи', 'эи', 'ыи', 'яи', 'ёи', 'юи', 'еи', 'ии'
        ];

        obj.iEy = [
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
            'сани',
            'сени',
            'ступни',
            'судьи',
            'фигни',
            'чукчи'
        ];

        obj.explicitZeroEndingCommonGenderSurnameLike = [
            'головы', 'громадины', 'детины', 'деревенщины', 'дохлятины', 'дубины',
            'ехидины', 'жадины', 'зверины', 'идиотины', 'кислятины', 'молодчины',
            'орясины', 'остолопины',
            'сиротины', 'скотины', 'старейшины', 'старины', 'старшины',
            'уродины'
        ];

        // Очень много исключений. Наверно, это можно как-то отрефакторить.
        // TODO: Это всё должно быть в изменяемых настройках в экземпляре движка.

        // Слова на "а", которые легко склеиваются с другими корнями.
        // Например, "киберлеса", "электропоезда", "аэросуда", "протогорода".
        // При этом, в корпусе если даже и есть другие слова,
        // заканчивающиеся на эти строки, в род. п. они тоже заканчиваются на "ов".
        obj.explicitOv1 = [
            'адреса', 'паспорта', 'поезда', 'цеха', 'снега',
            'бункера', 'буфера',
            'берега', 'вымпела', 'голоса', 'города',
            'директора', 'договора', 'доктора', 'жемчуга',
            'инспектора', 'инструктора',
            'колокола', 'кондуктора', 'короба', 'корпуса', 'крейсера', 'кузова',
            'леса', 'мастера', 'номера',
            'облачка', 'острова', 'отпуска',
            'паруса', 'повара', 'погреба', 'пояса', 'прожектора', 'пропуска', 'рукава',
            'сахара', 'свитера', 'сервера', 'счета', 'трактора', 'тормоза',
            'холода', 'цвета', 'черепа', 'шторма', 'штуцера',
            'юнкера', 'ястреба',
            'суда', 'корм'
        ];

        obj.explicitOv = new Set(obj.explicitOv1.concat([
            'аланы', 'бега', 'беглецы', 'близнецы', 'бойцы', 'бока', 'борта', 'борцы', 'бруствера', 'брюшки',
            'веера', 'века', 'венцы', 'верха', 'веса', 'весы', 'вечера', 'вороха',
            'глупцы', 'года', 'гонцы', 'дворцы', 'дельцы',
            'детдома', 'детдомы', 'дома', 'жеребцы', 'жильцы', 'жрецы', 'зубцы', 'истцы', 'катера',
            'концы', 'корма', 'кузнецы', 'купола', 'купцы', 'луга', 'мертвецы', 'меха', 'мудрецы',
            'облака', 'образа', 'образцы', 'огурцы', 'округа', 'омута',
            'ордена', 'ордера', 'отцы', 'очки',
            'певцы', 'песцы', 'пловцы', 'подлецы',
            'продавцы', 'птенцы', 'резцы', 'рога', 'рода', 'рубцы', 'самцы',
            'свинцы', // есть такое слово?
            'сорта', 'соуса', 'спецы', 'стога', 'столбцы', 'стрельцы',
            'творцы', 'тельцы', 'тенора', 'терема', 'тома', 'тона', 'торцы',
            'хлеба', 'юнцы'
        ]));

        obj.explicitZeroEndingAndOv = new Set([
            'аршины', 'баклажаны', 'буквы', 'гольфы', 'граммы', 'гусары',
            'дела', 'кадеты', 'килограммы', 'омы', 'помидоры', 'рентгены',
            'ботинки', 'человеки', 'чулки', 'шорты'
        ]);

        obj.explicitOvAndZeroEnding = new Set([
            'гектары', 'рельсы'
        ]);

        obj.explicitZeroEnding = new Set(obj.explicitZeroEndingCommonGenderSurnameLike.concat([
            'бедняги', 'бедолаги', 'болгары', 'бродяги', 'брызги', 'брюки', 'брюхи', 'будды', 'бусы',
            'валенки', 'веки', 'вельможи', 'верзилы', 'вилы', 'владыки', 'воеводы', 'волосы', 'вояки',
            'главы', 'грузины', 'задворки', 'задиры',
            'железы', // желёз
            'жилы', 'зануды', 'зеваки',
            'именины', 'калеки', 'кальсоны', 'каникулы', 'колготки', 'коллеги', 'крохи', 'курицы', 'куры',
            'ладоши', 'ламы', 'макароны', 'мужчины',
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

        obj.flatEndings = [
            'х', 'ых', 'их',
            'м', 'ым', 'им',
            'х', 'ых', 'их',
            'ми', 'ыми', 'ими',
            'х', 'ых', 'их'
        ];

        obj.endings2 = [
            'ям', 'ам',
            '', '',
            'ями', 'ами',
            'ях', 'ах'
        ];

        return Object.freeze(obj);
    })();

    function declinePlural(engine, lemma, grCase, plural) {
        const lcPlural = plural.toLowerCase();
        const grCaseNumber = CaseValues.indexOf(grCase) + 1;

        if ((grCaseNumber === 1) || ((grCaseNumber === 4) && !lemma.isAnimate())) {
            return plural;
        } else if ((grCaseNumber === 2) || (grCaseNumber === 4)) {
            if (endsWithAny(lcPlural, ['овичи', 'евичи'])) {
                return init(plural) + 'ей';
            } else if (lcPlural.endsWith('вны') && (lcPlural !== 'овны')) {
                return nInit(plural, 2) + 'ен';
            }
        } else if (grCaseNumber === 5) {
            if (endsWithAny(lcPlural, ['дети', 'люди'])
                    && !endsWithAny(lcPlural, ['нелюди'])) {
                return init(plural) + 'ьми';
            } else if (endsWithAny(lcPlural, ['вери', 'дочери'])) {
                return [init(plural) + 'ями', init(plural) + 'ьми'];
            }
        }

        const gender = lemma.getGender();
        const stem = lcPlural.endsWith('цы') ? init(plural) : getNounStem0(plural, lcPlural);

        const isSurnameType1 = endsWithAny(lcPlural, ['овы', 'евы', 'ёвы', 'ины', 'ыны'])
            && !endsWithAny(lcPlural, declinePluralData.explicitZeroEndingCommonGenderSurnameLike)
            && (lemma.isASurname() || (gender === Gender.COMMON));

        // Из-за ветвления вверху функции, здесь grCaseNumber >= 2.
        // Через Math.min локатив приравниваем к предложному падежу.
        const itemsPerCase = 3;
        const flatEndingIndex = itemsPerCase * Math.min(
            Math.round(declinePluralData.flatEndings.length / itemsPerCase - 1),
            grCaseNumber - 2
        );

        if (isSurnameType1 || lcPlural.endsWith('ничьи')) {
            return plural + declinePluralData.flatEndings[flatEndingIndex];
        } else if (lcPlural.endsWith('ые')) {
            return nInit(plural, 2) + declinePluralData.flatEndings[flatEndingIndex + 1];
        } else if (lcPlural.endsWith('ие')) {
            return nInit(plural, 2) + declinePluralData.flatEndings[flatEndingIndex + 2];

        } else if ((grCaseNumber > 2) && (grCaseNumber !== 4)) {
            const itemsPerCase2 = 2;
            const flatIndex2 = itemsPerCase2 * Math.min(
                Math.round(declinePluralData.endings2.length / itemsPerCase2 - 1),
                grCaseNumber - 3
            );

            if (endsWithAny(lcPlural, declinePluralData.softEndings)) {
                return init(plural) + declinePluralData.endings2[flatIndex2];
            } else if (engine.sd.hasStressedEndingPlural(lemma, grCase).includes(true)) {
                return unYo(stem) + declinePluralData.endings2[flatIndex2 + 1];
            } else {
                return stem + declinePluralData.endings2[flatIndex2 + 1];
            }

        } else {
            const declension = getDeclension(lemma);

            const genitiveStem = () => {
                const lcStem = stem.toLowerCase();
                const dependsOnStress = ['жки', 'шки', 'чки', 'ножны'];
                if ((
                    endsWithAny(lcStem, ['кн', 'кл', 'дк', 'нк', 'пк', 'рк', 'тк', 'вк', 'лк', 'мк'])
                    && !endsWithAny(lcPlural, ['сумерки'])
                ) || (
                    lcStem === 'зл'
                ) || (
                    endsWithAny(lcPlural, dependsOnStress)
                    && engine.sd.hasStressedEndingPlural(lemma, grCase).includes(true)
                )) {
                    const end = last(stem);
                    return init(stem) + upperLike('о', end) + end;
                } else if ((
                    endsWithAny(lcPlural, [
                        'вна', 'вца', 'вцы', 'пла', 'дца', 'дра', 'судна',
                        'рки', 'рцы', 'тлы', 'рна', 'тна', 'енца',
                        'десны', 'дёсны',
                        'рёбра', 'ребра',
                        'сосны'
                    ])
                    && !endsWithAny(lcPlural, ['недра'])
                ) || (
                    endsWithAny(lcPlural, dependsOnStress)
                )) {
                    const end = lastOfNInitial(plural, 1);
                    return nInit(plural, 2) + upperLike('е', end) + end;
                } else if (
                    endsWithAny(lcPlural, [
                        'сестры', 'сёстры', 'серьги'
                    ])
                ) {
                    const end = lastOfNInitial(plural, 1);
                    const h = (lastOfNInitial(lcPlural, 2) === 'ь')
                        ? unYo(nInit(plural, 3))
                        : unYo(nInit(plural, 2));
                    return h + upperLike('ё', end) + end;
                } else if (endsWithAny(lcStem, ['льц', 'сьм', 'деньг', 'ьк', 'йк', 'дьб'])) {
                    const end = last(stem);
                    return nInit(stem, 2) + upperLike('е', end) + end;
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

            const lastOf2Initial = lastOfNInitial(lcPlural, 2);

            if (Gender.FEMININE !== gender) {

                const mShki = Object.freeze([
                    'братишки', 'дружки', 'мальчишки', 'парнишки',
                    'сынишки', 'папочки', 'дедушки', 'дядюшки', 'батюшки',
                    'городишки', 'домишки'
                ]);

                // малышки
                // рожки
                // листья
                // молодцы

                if (((gender === Gender.COMMON)
                        && !endsWithAny(lcPlural, declinePluralData.iEy)
                        && !('жшч'.includes(lastOf2Initial)))
                    || declinePluralData.explicitZeroEnding.has(lcPlural)
                    || (lemma.lower() === 'барин')) {
                    return genitiveStem();
                } else if (declinePluralData.explicitOv.has(lcPlural)) {
                    return init(plural) + 'ов';
                } else if (declinePluralData.explicitZeroEndingAndOv.has(lcPlural)) {
                    return [
                        genitiveStem(),
                        init(plural) + 'ов'
                    ];
                } else if (declinePluralData.explicitOvAndZeroEnding.has(lcPlural)) {
                    return [
                        init(plural) + 'ов',
                        genitiveStem()
                    ];
                } else if (endsWithAny(lcPlural,
                        ['жи', 'ши', 'чи',
                            'ля', 'ли', 'чи', 'ри', 'ти', 'ди',
                            'борщи', 'клещи', 'товарищи',
                            'плащи', 'прыщи', 'хрящи'])
                    || declinePluralData.iEy.includes(lcPlural)
                    || (lemma.lower().endsWith('ь') && !endsWithAny(lemma.lower(), [
                        'зять', 'деверь'
                    ]))
                    || ('щи' === lcPlural)) {

                    let s = ('ь' === last(init(lcPlural))) ? nInit(plural, 2) : init(plural);
                    return s + 'ей';

                } else if (endsWithAny(lcPlural, [
                    'братья', 'брусья', 'деревья', 'донья', 'звенья',
                    'клинья', 'клочья', 'коленья', 'колосья', 'колья', 'комья', 'крылья',
                    'листья', 'лоскутья', 'лохмотья', 'перья', 'платья', 'поводья', 'прутья',
                    'стулья', 'сучья', 'ульи', 'хлопья', 'шилья'
                ])) {
                    return init(plural) + 'ев';
                } else if (endsWithAny(lcPlural, [
                        'зятья', 'кумовья', 'деверья', 'края', 'клеи', 'холуи'
                    ])
                    || (lcPlural.endsWith('и') && ['ча', 'ху'].includes(init(lcPlural)))) {
                    return init(plural) + 'ёв';
                } else if (endsWithAny(lcPlural, ['мессии'])) {
                    return init(plural) + 'й';
                } else if (endsWithAny(lcPlural, ['ья', 'ия'])) {
                    if (Gender.MASCULINE === gender) {
                        return nInit(plural, 2) + 'ей';
                    } else {
                        return nInit(plural, 2) + 'ий';
                    }
                } else if (endsWithAny(lcPlural, ['семена', 'стремена'])) {
                    return nInit(plural, 3) + 'ян';
                } else if (lcPlural.endsWith('мена')) {
                    return nInit(plural, 3) + 'ён';
                } else if (lemma.lower().endsWith('яйцо')) {
                    return upperLike('яиц', init(plural))
                } else if (lcPlural.endsWith('нца')) {
                    return [genitiveStem(), init(plural) + 'ев'];
                } else if (endsWithAny(lcPlural, ['а', 'не', 'ищи'])
                    && !endsWithAny(lcPlural, declinePluralData.explicitOv1)
                ) {
                    return genitiveStem();
                } else if (endsWithAny(lcPlural, ['ницы', 'лицы', 'пицы', 'бицы'])) {
                    return init(plural);
                } else if ((lcPlural.endsWith('цы'))
                    || (lcPlural.endsWith('и') && isVowel(lastOfNInitial(lcPlural, 1)))
                ) {
                    return init(plural) + 'ев';
                } else if (endsWithAny(lcPlural, ['жки', 'шки', 'чки'])
                    && ((Gender.MASCULINE !== gender) || endsWithAny(lcPlural, mShki))
                    && !(lemma.lower().endsWith('ок'))) {
                    return genitiveStem();
                } else if (lcPlural.endsWith('ьи')) {
                    if (Gender.MASCULINE === gender) {
                        return init(plural) + 'ёв';
                    } else {
                        return nInit(plural, 2) + 'ей';
                    }
                } else if (endsWithAny(lcPlural, ['ы', 'и', 'а'])) {
                    return init(plural) + 'ов';
                }
            }

            if (lcPlural.endsWith('йки')) {
                return nInit(plural, 3) + 'ек';
            } else if (lcPlural.endsWith('ки')) {
                if (lastOf2Initial === 'ь') {
                    const end = last(init(plural));
                    return nInit(plural, 3) + upperLike('е', end) + end;
                } else if ('жшч'.includes(lastOf2Initial)) {
                    return genitiveStem();
                } else if (isConsonantNotJ(lastOf2Initial)) {
                    return nInit(plural, 2) + 'ок';
                }
            }

            if (declinePluralData.iEy.includes(lcPlural)) {
                return init(plural) + 'ей';
            } else if (endsWithAny(lcPlural, ['аи', 'ои', 'еи', 'эи', 'уи'])) {
                return init(plural) + 'й';
            } else if ('свечи' === lcPlural) {
                return [init(plural), init(plural) + 'ей'];
            } else if ('пригоршни' === lcPlural) {
                return [init(plural) + 'ей', nInit(plural, 2) + 'ен'];
            } else if ('тихони' === lcPlural) {
                return [nInit(plural, 2) + 'нь', init(plural) + 'ей'];
            }

            if (endsWithAny(lcPlural, ['ьи', 'ии'])) {
                if (engine.sd.hasStressedEndingSingular(lemma, grCase).includes(true)) {
                    return nInit(plural, 2) + 'ей';
                } else {
                    return nInit(plural, 2) + 'ий';
                }
            }

            if (lcPlural.endsWith('ни') && isConsonantNotJ(lastOfNInitial(lcPlural, 2))) {
                if (['барышни', 'боярышни', 'деревни'].includes(lcPlural)) {
                    return nInit(plural, 2) + 'ень';
                } else if (lcPlural.endsWith('кухни')) {
                    return nInit(plural, 2) + 'онь';
                } else {
                    return nInit(plural, 2) + 'ен';
                }
            }

            if (stem.toLowerCase().endsWith('ийк')) {
                return nInit(stem, 2) + 'ек';
            }

            if ((stem.length === lcPlural.length - 1) && endsWithAny(lcPlural, declinePluralData.softEndings)) {

                if ('ьй'.includes(lastOfNInitial(stem, 1).toLowerCase()) && !lemma.isAnimate()) {
                    const end = last(stem);
                    return nInit(stem, 2) + upperLike('е', end) + end;
                } else if (endsWithAny(lcPlural, ['земли', 'петли', 'капли'])) {
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

    return Object.freeze(API);
}));
