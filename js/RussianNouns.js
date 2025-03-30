/*!
  RussianNounsJS v1.5.0
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

        // pluraliaTantum parameter is deprecated since version 1.5.0
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
         * Не для внешнего использования.
         * Пожалуйста, используйте {@link RussianNouns.createLemma}
         * или {@link RussianNouns.createLemmaOrNull} вместо конструктора.
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
                this._hash = calculateHash(this._lc);
            }
        }

        newText(provider) {
            const lemmaCopy = new Lemma(this);
            lemmaCopy._txt = provider(this);
            lemmaCopy._lc = lemmaCopy._txt.toLowerCase();
            lemmaCopy._hash = calculateHash(lemmaCopy._lc);
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

        /**
         * @deprecated since version 1.5.0
         */
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
         * @deprecated since version 1.3.0 (2021 A.D.)
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

    /**
     * Числа в JS - 64-битные с плавающей точкой, по стандарту.
     * Обычно говорят, что максимальное безопасное целое число - это (2^53)-1,
     * но это не всегда так. Есть реализации, точность в которых начинает снижаться
     * где-то на диапазоне от 2^42 до 2^45. Так или иначе, хотя побитовые операции
     * и не работают с целыми числами больше 32 бит, в тип Number в JS можно
     * уместить гораздо больше. И это отличный способ сэкономить оперативную память,
     * используя числа в качестве ключей в коллекции Map.
     *
     * @param {Lemma} lemma
     * @param {boolean} [emptyYoBit=false]
     * @returns {number}
     */
    function toKey(lemma, emptyYoBit) {
        // Мои тесты показали, что наша хэш-функция иногда даёт коллизию
        // у коротких слов из одинакового количества символов. И я заметил,
        // что у всех коллизий всегда были соседние коды первых букв.
        const start = (lemma.lower().charCodeAt(0) % 2);
        const hasYo = ((lemma.lower().includes('ё'))&1) & (!emptyYoBit);
        const msb = (lemma._flags << 2) | (start << 1) | hasYo;

        // Предполагается, что в переменной msb всего 10 бит,
        // Так что мы можем безопасно подвинуть их на 32 бита влево.
        return (msb * 0x100000000) + lemma._hash;
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
        if (o instanceof Lemma) {
            return o;
        }

        const err = validateCreateLemma(o);
        if (err) {
            throw new LemmaException(err);
        }

        return Object.freeze(new Lemma(o));
    }

    // Without ё, the Russian alphabet consists of 32 letters.
    function lcBit(lcChar) {
        const x = lcChar.charCodeAt(0) - 1072;
        return (x === 33) ? 0b100000 : ((x === (0x1F & x)) ? (1 << x) : 0);
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

    function calculateHash(lowerCaseUnicodeString) {
        const preparedString = lowerCaseUnicodeString.replaceAll('ё', 'е');

        let state = preparedString.length % 2;
        let readyBits = 1;

        // Daniel J. Bernstein's hash function
        // http://www.cse.yorku.ca/~oz/hash.html
        // https://theartincode.stanis.me/008-djb2/
        // The result is the same as if the hash were of type uint32_t.
        let hash = 5381;
        function flushBits() {
            // Multiplication instead of shifting is used in order
            // to ensure that the result is unsigned.
            hash = (hash * 33 + (state & 0xFF)) % 0x100000000;
            state = state >> 8;
            readyBits -= 8;
        }

        for (let ch of preparedString) {

            // Packing the five-bit letters.
            const chCode = (ch.charCodeAt(0) - 1072) & 0x1F;
            state |= chCode << readyBits;
            readyBits += 5;

            if (readyBits >= 8) {
                flushBits();
            }
        }

        if (readyBits > 0) {
            flushBits();
        }

        return hash;
    }

    function extract(input) {
        const result = new Set();
        let last = 0;
        for (let delta of input) {
            last += delta;
            result.add(last);
        }
        return result;
    }

    const stressHashesA = extract([
        5860194, 274, 512, 740, 1311, 1433, 611, 1321, 132, 664, 69, 61, 199, 138994638,
        15864585, 4047418, 528, 10850894, 17760280, 20179, 10909, 14124, 59893, 31946,
        15905, 3678, 37191, 36185, 2972, 14451, 45060369, 10593759, 45962821, 1527413,
        800382, 32967, 15474426, 2784606, 4809222, 3393547, 4874958, 1970042, 755733,
        651519, 8045235, 688314, 24959847, 1913761, 18957980, 21367269, 112293717,
        318637881, 221091567, 12054035, 79499712, 116316633, 3029408, 787792401,
        27604690, 36377, 45003, 40029, 22782, 33923, 21274, 13596, 10701, 69696, 375168,
        85448, 2212, 783, 3132, 77484, 8646, 8615, 87556, 41505, 58936, 2092, 6532,
        54486, 54044, 171832, 33105, 167, 8545, 190135, 141636, 29504, 17898, 115400,
        533578, 9996, 78562, 6217, 126322, 1313, 327129, 265648, 152359, 45445, 363,
        35385, 15246, 83655, 25078, 61536, 238559, 120910, 27830, 454496, 267135, 102578,
        5609, 1245, 330, 33196, 23428, 423763, 38580, 18315, 7821, 54932, 20858,
        177241, 39910, 25938, 48662, 2753, 23218, 95902, 1978, 20438, 63162, 1173910,
        169245, 36608, 237785, 43801, 14821, 7490, 8448, 25078, 8712, 17589, 83622,
        63393, 16821, 15244, 50503, 25727, 27830, 2, 76230, 69166, 979, 17100, 1855,
        30690, 8712, 15079, 40296, 5609, 152293, 91125273, 355267870, 470822289,
        439751251, 346390720
    ]);

    const stressHashesB = extract([
        5860194, 274, 512, 530, 2, 2952, 924, 2202, 165277617, 2345673, 1682538, 4229973,
        480216, 5408799, 8089102, 2178, 2178, 5675, 15560, 2624, 20295, 31184, 27028,
        25244, 6534, 1832, 19882, 5132, 1501, 2905, 4422, 12275, 2046, 28380, 10893,
        15276, 27573570, 8946861, 6129033, 8151024, 27105243, 22844217, 829884, 2406624,
        16788882, 1250899, 5028473, 7440939, 1006170, 827706, 2326368, 31284, 74349,
        10593, 35564562, 130007081, 54022805, 503791635, 1013232, 11399766, 375784222,
        642714097, 37299, 11174, 3300, 66136, 154911, 78408, 198724, 89697, 74018, 50128,
        10890, 5609, 18315, 172977, 25221, 52197, 1362, 56058, 15345, 5276, 15688, 5643,
        3584, 7306, 25740, 58269, 96129, 81572, 32802, 48976, 681578, 106405, 215622,
        1311, 212794, 137642, 75175, 285284, 122351, 8329, 13068, 65067, 5520, 79695,
        364186, 1738, 363, 645196, 112365, 94579, 5609, 1245, 5375, 10804, 71874, 32987,
        332281, 42018, 8142, 8712, 25419, 16533, 891, 45329, 18550, 28054, 116581, 7108,
        2759, 89632, 1263, 73478, 55671, 40297, 1155, 2108, 12716, 13453, 14990, 259475,
        729145, 261852, 2101, 238933, 137839, 23914, 106339, 11372, 134588, 89559, 2200,
        17998, 34848, 20889, 20, 63668, 2101, 36577, 23186, 57127, 63435, 11815, 5609,
        237804694, 44012671, 1214051774
    ]);

    // Stemmer data
    const mobileVowelA = new Set(['бубен', 'бугор',
        'ветер', 'вошь', 'вымысел', 'горшок', 'дятел', 'домысел', 'замысел',
        'кашель', 'коготь',
        'лапоть', 'лоб', 'локоть', 'ломоть', 'молебен', 'мох', 'ноготь', 'овен',
        'пепел', 'пес', 'пёс', 'петушок', 'помысел', 'порошок',
        'промысел', 'псалом', 'пушок', 'ров', 'рожь', 'рот',
        'сон', 'стебель', 'стишок',
        'угол', 'умысел', 'хребет', 'церковь', 'шов'
    ]);
    const mobileVowelB = ['узел', 'уголь', 'чок', 'ешок', 'хол'];
    const en2a2b = [
        'ясень', 'бюллетень', 'олень', 'тюлень',
        'гордень', 'пельмень',
        'ячмень'
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
    const ogoEndings = ['ое', 'нький', 'ский', 'ской', 'лстой', 'отой', 'утой', 'евой', 'овой', 'живой'];
    const egoEndings = ['кожий', 'шний', 'жний', 'щий', 'ший', 'жий', 'чий'];

    const LocativeFormAttribute = Object.freeze({
        CONTAINER: 1,
        LOCATION: 2,
        STRUCTURE: 4,
        SURFACE: 8,

        // Метафорический путь. Луч времени, на (или в) котором лежат события.
        WAY: 16,

        // Объект с функциональной (не обязательно плоской) поверхностью.
        OBJECT_WITH_FUNCTIONAL_SURFACE: 32,

        // Вещество (обволакивающее или покрывающее).
        SUBSTANCE: 64,
        // Материал, средство изготовления, приготовления (еды), ремонта.
        RESOURCE: 128,

        // Состояние, свойство, положение дел.
        CONDITION: 256,

        // Испытываемое воздействие (стихии или внимания/отношения человека).
        EXPOSURE: 512,

        // Перемещение или кратковременное пространственное положение.
        MOTION: 1024,

        // Мероприятие.
        EVENT: 2048,

        WITH_ADJECTIVE: 4096,
        WITHOUT_ADJECTIVE: 8192,

        // Я еще не до конца понял этот аспект.
        // Этот флаг наверняка исчезнет в будущих релизах.
        RELIGIOUS: 16384
    });

    /**
     * Для внутреннего использования.
     * Под это число в конфиге будет выделено 3 бита (не более восьми состояний).
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
     * Под это число в конфиге будет выделено 3 бита (не более восьми состояний).
     */
    const LocativePreposition = Object.freeze({
        V: 1,
        VO: 2,
        NA: 3
    });

    /**
     * Для внутреннего использования.
     * @param {LocativePreposition} preposition
     * @param {LocativeDeclensionType} declensionType
     * @param {number} attributes - флаги LocativeFormAttribute.
     */
    function encodeLocativeConfig(preposition, declensionType, attributes) {
        const dcCode = (declensionType - 1) & 0b111;
        const prCode = (preposition - 1) & 0b111;
        return (attributes << 6) | (prCode << 3) | dcCode;
    }

    function extractDeclensionType(locativeConfig) {
        return (locativeConfig & 0b111) + 1;
    }

    function extractPreposition(locativeConfig) {
        const code = ((locativeConfig >> 3) & 0b111) + 1;
        if (LocativePreposition.V === code) {
            return "в"
        } else if (LocativePreposition.VO === code) {
            return "во"
        } else if (LocativePreposition.NA === code) {
            return "на"
        }
    }

    function extractAttributes(locativeConfig) {
        return locativeConfig >> 6;
    }

    const locativeDictionary = Object.freeze(makeDefaultLocativeDictionary());

    const API = {
        Case: Case,
        Gender: Gender,

        CASES: CaseValues,

        /**
         * @deprecated since version 1.5.0
         */
        LemmaException: LemmaException,

        /**
         * @deprecated since version 1.5.0
         */
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
         *
         * @param {string} preposition Предлог.
         * @param {string} word Форма слова.
         * @param {number} attributes Предикаты, которые все должны быть истинными.
         */
        LocativeForm: function LocativeForm(preposition, word, attributes) {
            this.preposition = preposition;
            this.word = word;
            this.attributes = attributes;
        },

        /**
         * Нормальная форма слова.
         * Объекты этого класса содержат также грамматическую и семантическую информацию,
         * позволяющую выбирать стратегии словоизменения и различать омонимы.
         *
         * Пожалуйста, используйте {@link RussianNouns.createLemma}
         * или {@link RussianNouns.createLemmaOrNull} вместо конструктора.
         */
        Lemma: Lemma,

        /**
         * Интерфейс с именованными параметрами для создания лемм.
         * Если параметр — уже лемма, вернет тот же объект, а не копию.
         *
         * @param {RussianNouns.Lemma|Object} o
         * @throws {RussianNouns.LemmaException} Ошибки из конструктора леммы.
         * @returns {RussianNouns.Lemma} Иммутабельный объект.
         */
        createLemma: createLemma,

        /**
         * @deprecated since version 1.5.0
         * @param {RussianNouns.Lemma|Object} o
         * @returns {array} Результат в Go-стиле: результат или null, строка с описанием ошибки или null.
         */
        createLemmaNoThrow: createLemmaNoThrow,

        /**
         * Безопасное создание леммы с минимальными накладными расходами.
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

        /**
         * @deprecated since version 1.5.0
         */
        FIXED_STEM_STRESS: 'SSSSSSS-SSSSSS',

        /**
         * @deprecated since version 1.5.0
         */
        FIXED_ENDING_STRESS: 'EEEEEEE-EEEEEE',

        /**
         * Словарь ударений. В него можно вносить изменения в рантайме,
         * и это будет влиять на поведение экземпляра движка, который
         * владеет этим словарём.
         */
        StressDictionary: function StressDictionary() {

            const _data = new Map();

            const _getKey = function (lemmaObject) {
                // В результате остатка от деления остаётся 39 бит.
                // Так мы оставляем род, признаки одушевлённости и несклоняемости (это 5 бит)
                // и бит чётности первой буквы, но убираем букву ё (см. второй параметр).
                // Это очень хороший ключ с практически нулевым уровнем коллизий.
                // Но из-за того, что я вынужден поддерживать все эти устаревшие методы,
                // толку от этого никакого - я не могу выкинуть леммы из этого словаря.
                return toKey(lemmaObject, true) % 0x8000000000;
            };

            /**
             * @param {RussianNouns.Lemma|Object} query
             * @returns {array} Список пар лемма-значение.
             */
            const _getEntities = (query) => {
                const hash = _getKey(query);
                const homonyms = _data.get(hash);
                if (homonyms instanceof Array) {
                    return homonyms;
                } else {
                    return [];
                }
            };

            const _getOne = (query) => {
                const extraFlags = query._flags & 0x7FFFFFE0;

                // Дополнительные флаги должны быть такими же или
                // более общими (содержать меньше признаков - меньше бит).
                const entities = _getEntities(query)
                    .filter(pair =>
                        ((pair[0]._flags & extraFlags) <= extraFlags));

                const exactYo = entities.filter(pair => pair[0].lower() === query.lower());

                if (exactYo.length) {
                    return exactYo[0][1];
                } else if (entities.length) {
                    return entities[0][1];
                }
            };

            /**
             * @param {RussianNouns.Lemma|Object} lemma
             * @param {string} settings Строка настроек в формате 1234567-123456.
             * До дефиса — единственное число, после дефиса — множественное.
             * Номер символа — номер падежа в {@link RussianNouns.CASES}.
             * Возможные значения каждого символа:
             * S — ударение только на основу;
             * s — чаще на основу;
             * b — оба варианта употребляются одинаково часто ("b" значит "both");
             * e — чаще на окончание;
             * E — только на окончание.
             * @throws {RussianNouns.StressDictionaryException}
             */
            this.put = function (lemma, settings) {
                const parts = settings.split('-');
                const bad = (part, len) => part.length !== len ||
                    part.split('').some(x => !'SsbeE'.includes(x));

                if (parts.length !== 2 || bad(parts[0], 7) || bad(parts[1], 6)) {
                    throw new API.StressDictionaryException('Bad settings format.');
                }

                const lemmaObject = createLemma(lemma);
                const hash = _getKey(lemmaObject);

                let homonyms = _data.get(hash);

                if (!(homonyms instanceof Array)) {
                    homonyms = [];
                    _data.set(hash, homonyms);
                }

                const found = homonyms.find(ls => lemmaObject.equals(ls[0]));

                if (found) {
                    found[1] = settings;
                } else {
                    homonyms.push([lemmaObject, settings]);
                }
            };

            /**
             * @deprecated since version 1.5.0
             */
            this.putAll = function (lemmaPrototype, value, joinedWordList) {
                const list = joinedWordList.split(',');
                for (let word of list) {
                    const lemma = Object.assign({}, lemmaPrototype);
                    lemma.text = word;
                    this.put(lemma, value);
                }
            };

            /**
             * @deprecated since version 1.5.0
             * @param {RussianNouns.Lemma|Object} lemma
             * @param {boolean} fuzzy Если нет точных совпадений, вернуть первое неточное.
             * @returns {*} Значение или undefined.
             */
            this.get = function (lemma, fuzzy) {
                const lemmaObject = (lemma instanceof Lemma) ? lemma : createLemma(lemma);
                const hash = _getKey(lemmaObject);

                const homonyms = _data.get(hash);

                if (homonyms instanceof Array) {
                    let found = homonyms.find(ls => lemmaObject.equals(ls[0]));

                    if (!found && fuzzy) {
                        found = homonyms.find(ls => lemmaObject.fuzzyEquals(ls[0]));
                    }

                    if (found) {
                        return found[1];
                    }
                }
            };

            /**
             * @deprecated since version 1.5.0
             */
            this.remove = function (lemma) {
                const lemmaObject = createLemma(lemma);
                const hash = _getKey(lemmaObject);

                const homonyms = _data.get(hash);

                if (homonyms instanceof Array) {
                    _data.set(hash, homonyms.filter(ls => !lemmaObject.equals(ls[0])));
                }
            };

            /**
             * Пожалуйста, не используйте.
             * @deprecated since version 1.5.0
             * @param word Слово, по которому производится поиск.
             * @returns {Array} Список лемм.
             */
            this.find = function (word) {
                let result = [];
                const query = word.toLowerCase();

                _data.forEach(homonyms => {
                    const lemmas = homonyms.map(pair => pair[0]);
                    result = result.concat(lemmas.filter(x => query === x.lower()));
                });

                return result;
            };

            this.hasStressedEndingSingular = function (query, grCase) {
                const caseIndex = CaseValues.indexOf(grCase);

                if (caseIndex >= 0) {
                    let v = _getOne(query);
                    if (!v && (query.getGender() === Gender.MASCULINE)) {
                        if (stressHashesA.has(query._hash)) {
                            v = 'SEESEEE-';
                        } else if (stressHashesB.has(query._hash)) {
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
            };

            this.hasStressedEndingPlural = function (query, grCase) {
                const caseIndex = CaseValues.indexOf(grCase);

                if (caseIndex >= 0 && caseIndex < 6) {
                    let v = _getOne(query);
                    if (!v && (query.getGender() === Gender.MASCULINE)) {
                        if (stressHashesA.has(query._hash) ||
                                (query.isAnimate() && stressHashesB.has(query._hash))) {
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
            };
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
             * У plurale tantum игнорируется.
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
                    const configs = locativeDictionary.get(toKey(o));
                    if (configs instanceof Array) {
                        return configs.map(config => new API.LocativeForm(
                            extractPreposition(config),
                            toLocativeSingular(engine, declension, o, extractDeclensionType(config)),
                            extractAttributes(config)
                        ));
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
        const map = new Map();

        const m = Object.freeze({gender: Gender.MASCULINE});
        const mAnimate = Object.freeze({gender: Gender.MASCULINE, animate: true});

        function addConfig(lemmaPrototype, condition, prepositions, ws, dTypes) {
            const words = ws.split(',');

            // Тут если номер, то это LocativeDeclensionType,
            // а если строка, то можно будет, наверно, здесь же предусмотреть
            // особую форму слова, если она не совпадает с предложным падежом.
            // Но пока что это не потребовалось.
            const declensionTypes = (dTypes instanceof Array) ? dTypes : [LocativeDeclensionType.U_SUFFIX];

            for (let word of words) {
                const lemma = Object.assign({}, lemmaPrototype);
                lemma.text = word;

                const lemmaKey = toKey(createLemma(lemma));

                let configArray = map.get(lemmaKey);
                if (!configArray) {
                    configArray = [];
                    map.set(lemmaKey, configArray);
                }

                for (let p of prepositions) {
                    for (let d of declensionTypes) {
                        configArray.push(encodeLocativeConfig(p, d, condition));
                    }
                }
            }
        }

        // В. А. Плунгян выделяет у слов мужского рода
        // с особыми формами локатива семь семантических классов:

        const v = Object.freeze([LocativePreposition.V]);
        const vo = Object.freeze([LocativePreposition.VO]);
        const na = Object.freeze([LocativePreposition.NA]);

        // 1. вместилища, сосуды («в»)
        addConfig(m, LocativeFormAttribute.CONTAINER, v, 'мозг,пруд,стог,таз,год');
        addConfig(m, LocativeFormAttribute.CONTAINER, vo, 'рот');
        // Год может быть тем, в чём содержатся дни, например,
        // и может быть тем, на чём лежат события.
        // Это два разных случая. Их нельзя в один конфиг помещать,
        // т.к. у них условия через конъюнкцию проверяются.
        addConfig(m, LocativeFormAttribute.WAY, v, 'год');
        addConfig(m, LocativeFormAttribute.CONTAINER, v, 'гроб');
        // Не уверен, что семантика "во гробе" тут правильная.
        // Не исключено, что это имеет совершенно другой религиозный смысл, чем вместилище,
        // поэтому и склонение отличается.
        addConfig(m, LocativeFormAttribute.CONTAINER|LocativeFormAttribute.RELIGIOUS,
            vo, 'гроб', [LocativeDeclensionType.PREPOSITIONAL]);

        // 2. пространства («в»)
        addConfig(m, LocativeFormAttribute.LOCATION, v,
            'ад,бор,лес,порт,аэропорт,рай,сад,тыл,' +
            'низ,' +
            'хлев'  // по классификации Плунгяна, это вместилище (как и "цех")
        );

        // 3. конфигурации объектов, образующих устойчивые структуры («в»)
        addConfig(m, LocativeFormAttribute.STRUCTURE, v,
            'круг,полк,артполк,ряд,род,строй,лад');

        // 4. поверхности («на»)
        addConfig(m, LocativeFormAttribute.SURFACE, na, '' +
            'баз,' +    // скотный двор
            'берег,' +
            'бережок,' +    // (спорно)
            'вал,кон,круг,луг,пол,яр'
        );
        // На своём веку, столько-то раз на дню.
        // При этом, в веке — 100 лет, в дне — 24 часа.
        addConfig(m, LocativeFormAttribute.WAY, na, 'век,день');
        // Это читерство небольшое, но тут аналогичная ситуация.
        addConfig(m, LocativeFormAttribute.WAY, v, 'час');
        // "на корню" — устойчивое выражение (наречие), означающее "в процессе формирования".
        // "зарубить на корню" — "уничтожить в самом начале".
        addConfig(m, LocativeFormAttribute.WAY, na, 'корень');

        // 5. объекты с функциональной (не обязательно плоской) поверхностью («на»)
        addConfig(mAnimate, LocativeFormAttribute.OBJECT_WITH_FUNCTIONAL_SURFACE, na, 'вор');
        addConfig(m, LocativeFormAttribute.OBJECT_WITH_FUNCTIONAL_SURFACE, na, '' +
            'бочок,' +  // лежать на бочку, т.е. лежать боком вниз (почти не употребляется)
            'борт,воз,горб,кол,мост,плот,сук,' +
            'х' + String.fromCharCode(1091) + 'й'
        );

        // 6. вещества и материалы («в» и «на»)
        const substance_or_resource = ',мёд,мех,пар,пух';
        addConfig(m, LocativeFormAttribute.SUBSTANCE, v, 'дым,жир,мел,пушок' + substance_or_resource);
        addConfig(m, LocativeFormAttribute.RESOURCE, na, 'газ,клей,спирт' + substance_or_resource);

        // 7. ситуации и состояния («в» и «на»)
        addConfig(m, LocativeFormAttribute.CONDITION, v,
            'бой,бред,быт,долг,плен,пыл,сок,ход,лад');
        // Тут я имею в виду смысл, употреблённый в текущем предложении.
        // Кое-где пишут, что есть еще употребление "в виду гор" в значении "там, откуда видны горы".
        // Никогда не слышал, чтобы так говорили. Если в эту классификацию это вписывать,
        // я не уверен, EXPOSURE это, CONDITION или что-то третье.
        addConfig(m, LocativeFormAttribute.EXPOSURE, v.concat(na), 'вид');
        addConfig(m, LocativeFormAttribute.EXPOSURE, na, 'слух,счёт,ветер,ветр,свет');
        addConfig(m, LocativeFormAttribute.MOTION, na, 'ход,бег,вес');
        // Пока непонятно, как разграничить "на каждом шагу" и "на первом шаге".
        addConfig(m, LocativeFormAttribute.MOTION|LocativeFormAttribute.WITH_ADJECTIVE, na, 'шаг');
        addConfig(m, LocativeFormAttribute.EVENT, na, 'бал,пир');
        // Может быть "дух" когда-то и значило "исповедь",
        // сейчас это только всех запутает.
        addConfig(m, LocativeFormAttribute.CONDITION, na, 'дух');
        // На полном газу. Не уверен, как это сюда записать. Вроде, устойчивое выражение.
        addConfig(m, LocativeFormAttribute.MOTION|LocativeFormAttribute.WITH_ADJECTIVE, na, 'газ');

        // 1 и 5.
        addConfig(m, LocativeFormAttribute.CONTAINER, v, 'глаз,нос,шкаф');
        addConfig(m, LocativeFormAttribute.CONTAINER, vo, 'лоб');
        addConfig(m, LocativeFormAttribute.OBJECT_WITH_FUNCTIONAL_SURFACE, na, 'глаз,лоб,нос,шкаф');

        let two_and_five = 'бок,верх,зад,угол';
        addConfig(m, LocativeFormAttribute.LOCATION, v, two_and_five);
        addConfig(m, LocativeFormAttribute.OBJECT_WITH_FUNCTIONAL_SURFACE, na, two_and_five);
        // Есть сомнения, в каких случаях используется форма предложного падежа.
        // Является ли решающим наличие любого определения (в *Красноярском* крае, на *внешнем* крае)
        // или подобные выражения являются исключениями и их нельзя обобщать.
        // Я пока что склоняюсь к первому варианту.
        addConfig(m, LocativeFormAttribute.LOCATION|LocativeFormAttribute.WITHOUT_ADJECTIVE, v, 'край');
        addConfig(m,
            LocativeFormAttribute.OBJECT_WITH_FUNCTIONAL_SURFACE|LocativeFormAttribute.WITHOUT_ADJECTIVE,
            na, 'край');

        // 4 и 6
        addConfig(m, LocativeFormAttribute.SURFACE, na, 'лёд,мох,снег');
        addConfig(m, LocativeFormAttribute.SUBSTANCE, vo, 'лёд,мох');
        addConfig(m, LocativeFormAttribute.SUBSTANCE, v, 'снег');

        // А также, у слов женского рода третьего склонения с особыми формами
        // локатива пять семантических классов.
        // Однако, у локатива в словах женского рода третьего склонения отличается
        // от предложного падежа только ударение — смещается на последний слог,
        // на письме они не отличаются.

        return map;
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

    function getNounStem(lemma) {
        const word = lemma.text();
        const lcWord = lemma.lower();
        const gender = lemma.getGender();
        const lcLastChar = last(lcWord);

        if (mobileVowelA.has(lcWord)
            || endsWithAny(lcWord, mobileVowelB)
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
            if (lcWord.endsWith('ень') && (gender === Gender.MASCULINE) && !endsWithAny(lcWord, en2a2b)) {
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
                }
                return 1;

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

        function addUForm(r) {
            if (!lemma.isAnimate() && uForm.has(lcWord)) {
                if (last(lcWord) === 'й') {
                    r.push(init(word) + upperLike('ю', last(word)));
                } else {
                    r = r.concat(eStem(stem, s => s + upperLike('у', last(s))));
                }
            }
            return r;
        }

        if (Case.GENITIVE === grCase) {
            if ((iyWord && lemma.isASurname())
                || iyoy()
                || endsWithAny(lcWord, ogoEndings)) {
                return stem + 'ого';
            } else if (endsWithAny(lcWord, egoEndings) || lcWord.endsWith('ее')) {
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
                || endsWithAny(lcWord, ogoEndings)) {
                return stem + 'ому';
            } else if (endsWithAny(lcWord, egoEndings) || lcWord.endsWith('ее')) {
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
            } else if (endsWithAny(lcWord, egoEndings)) {
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
                || endsWithAny(lcWord, ogoEndings)) {
                return stem + 'ом';
            } else if (endsWithAny(lcWord, egoEndings) || lcWord.endsWith('ее')) {
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

            const locativeConfigs = locativeDictionary.get(toKey(lemma));
            if (locativeConfigs) {
                const declensionTypes = unique(locativeConfigs.map(x => extractDeclensionType(x)));
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
                }
                return head + 'ы';

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
                }
                return head + 'е';

            case Case.ACCUSATIVE:
                if (ayaWord()) {
                    return stem + 'ую';
                } else if (yayaWord()) {
                    return stem + 'юю';
                } else if (soft()) {
                    return head + 'ю';
                }
                return head + 'у';

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
                }
                return [head + 'ой', head + 'ою'];

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
                }
                return head + 'е';

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
                    }
                    return stem + 'ью';
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
                        result.push(nInit(word, 2) + 'ки');
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
                        result.push(stem + 'ые');

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


    const declinePluralSoftEndings = [
        'ли', 'си', 'би', 'ви', 'ди', 'ти', 'пи', 'ри', 'ни', 'фи', 'зи',
        'ьи', 'ья', 'ия', 'ря', 'ля', 'ая',
        'аи', 'ои', 'уи', 'эи', 'ыи', 'яи', 'ёи', 'юи', 'еи', 'ии'
    ];

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
        'сани',
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

    // Очень много исключений. Наверно, это можно как-то отрефакторить.
    // TODO: Это всё должно быть в изменяемых настройках в экземпляре движка.

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
        'паруса', 'повара', 'погреба', 'пояса', 'прожектора', 'пропуска', 'рукава',
        'сахара', 'свитера', 'сервера', 'счета', 'трактора', 'тормоза',
        'холода', 'цвета', 'черепа', 'шторма', 'штуцера',
        'юнкера', 'ястреба',
        'суда', 'корм'
    ];

    const explicitOv = new Set(explicitOv1.concat([
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

    const explicitZeroEndingAndOv = new Set([
        'аршины', 'баклажаны', 'буквы', 'гольфы', 'граммы', 'гусары',
        'дела', 'кадеты', 'килограммы', 'омы', 'помидоры', 'рентгены',
        'ботинки', 'человеки', 'чулки', 'шорты'
    ]);

    const explicitOvAndZeroEnding = new Set([
        'гектары', 'рельсы'
    ]);

    const explicitZeroEnding = new Set(explicitZeroEndingCommonGenderSurnameLike.concat([
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
            && !endsWithAny(lcPlural, explicitZeroEndingCommonGenderSurnameLike)
            && (lemma.isASurname() || (gender === Gender.COMMON));

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
            return nInit(plural, 2) + declinePluralFlatEndings[flatEndingIndex + 1];
        } else if (lcPlural.endsWith('ие')) {
            return nInit(plural, 2) + declinePluralFlatEndings[flatEndingIndex + 2];

        } else if ((grCaseNumber > 2) && (grCaseNumber !== 4)) {
            const itemsPerCase2 = 2;
            const flatIndex2 = itemsPerCase2 * Math.min(
                Math.round(declinePluralEndings2.length / itemsPerCase2 - 1),
                grCaseNumber - 3
            );

            if (endsWithAny(lcPlural, declinePluralSoftEndings)) {
                return init(plural) + declinePluralEndings2[flatIndex2];
            } else if (engine.sd.hasStressedEndingPlural(lemma, grCase).includes(true)) {
                return unYo(stem) + declinePluralEndings2[flatIndex2 + 1];
            } else {
                return stem + declinePluralEndings2[flatIndex2 + 1];
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
                        && !endsWithAny(lcPlural, declinePluralEy)
                        && !('жшч'.includes(lastOf2Initial)))
                    || explicitZeroEnding.has(lcPlural)
                    || (lemma.lower() === 'барин')) {
                    return genitiveStem();
                } else if (explicitOv.has(lcPlural)) {
                    return init(plural) + 'ов';
                } else if (explicitZeroEndingAndOv.has(lcPlural)) {
                    return [
                        genitiveStem(),
                        init(plural) + 'ов'
                    ];
                } else if (explicitOvAndZeroEnding.has(lcPlural)) {
                    return [
                        init(plural) + 'ов',
                        genitiveStem()
                    ];
                } else if (endsWithAny(lcPlural,
                        ['жи', 'ши', 'чи',
                            'ля', 'ли', 'чи', 'ри', 'ти', 'ди',
                            'борщи', 'клещи', 'товарищи',
                            'плащи', 'прыщи', 'хрящи'])
                    || declinePluralEy.includes(lcPlural)
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
                    return upperLike('яиц', init(plural));
                } else if (lcPlural.endsWith('нца')) {
                    return [genitiveStem(), init(plural) + 'ев'];
                } else if (endsWithAny(lcPlural, ['а', 'не', 'ищи'])
                    && !endsWithAny(lcPlural, explicitOv1)
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

            if (declinePluralEy.includes(lcPlural)) {
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

            if ((stem.length === lcPlural.length - 1) && endsWithAny(lcPlural, declinePluralSoftEndings)) {

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
