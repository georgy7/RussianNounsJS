/*!
  RussianNounsJS v1.2.0.SNAPSHOT

  Copyright (c) 2011-2021 Устинов Георгий Михайлович

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
    });

    const Gender = Object.freeze({
        "FEMININE": "женский",
        "MASCULINE": "мужской",
        "NEUTER": "средний",
        "COMMON": "общий"
    });

    const CASES = Object.freeze([
        Case.NOMINATIVE,
        Case.GENITIVE,
        Case.DATIVE,
        Case.ACCUSATIVE,
        Case.INSTRUMENTAL,
        Case.PREPOSITIONAL,
        Case.LOCATIVE
    ]);

    const rk = s => s.split('').map(ch => String.fromCharCode(ch.charCodeAt(0) + 1)).join('');

    const rkComma = s => s.split(',').map(rk).join(',');

    const API = {
        Case: Case,
        Gender: Gender,

        CASES: CASES,

        LemmaException: class LemmaException extends Error {
        },

        StressDictionaryException: class StressDictionaryException extends Error {
        },

        /**
         * Нормальная форма слова.
         * Объекты этого класса содержат также грамматическую и семантическую информацию,
         * позволяющую выбирать стратегии словоизменения и различать омонимы.
         * Пожалуйста, используйте {@link RussianNouns.createLemma} вместо конструктора.
         */
        Lemma: class Lemma {

            /**
             * *Не для внешнего использования!*
             * Пожалуйста, используйте {@link RussianNouns.createLemma} вместо конструктора.
             * @param {RussianNouns.Lemma|Object} o
             */
            constructor(o) {

                function checkBoolOrNull(x) {
                    if ((null != x) && (typeof x != 'boolean')) {
                        throw new API.LemmaException('Must be boolean.');
                    }
                }

                if (o instanceof API.Lemma) {

                    this.pluraliaTantum = o.pluraliaTantum;
                    this.indeclinable = o.indeclinable;

                    this.animate = o.animate;
                    this.surname = o.surname;
                    this.name = o.name;
                    this.transport = o.transport;
                    this.watercraft = o.watercraft;

                    this.internalText = o.internalText;
                    this.lowerCaseText = o.lowerCaseText;

                    this.internalGender = o.internalGender;

                } else if (null == o) {

                    throw new API.LemmaException('No parameters specified.');

                } else {

                    checkBoolOrNull(o.pluraliaTantum);
                    checkBoolOrNull(o.indeclinable);

                    this.pluraliaTantum = !!(o.pluraliaTantum);
                    this.indeclinable = !!(o.indeclinable);

                    checkBoolOrNull(o.animate);
                    checkBoolOrNull(o.surname);
                    checkBoolOrNull(o.name);
                    checkBoolOrNull(o.transport);
                    checkBoolOrNull(o.watercraft);

                    this.animate = !!(o.animate);
                    this.surname = !!(o.surname);
                    this.name = !!(o.name);
                    this.transport = !!(o.transport);
                    this.watercraft = !!(o.watercraft);

                    // TODO
                    if (o.text == null) {
                        throw new API.LemmaException('A cyrillic word required.');
                    }

                    this.internalText = o.text;
                    this.lowerCaseText = this.internalText.toLowerCase();

                    if (!(o.pluraliaTantum)) {  // Это слова т. н. парного рода.
                        if (o.gender == null) {
                            throw new API.LemmaException('A grammatical gender required.');
                        }

                        if (!Object.values(Gender).includes(o.gender)) {
                            throw new API.LemmaException('Bad grammatical gender.');
                        }

                        this.internalGender = o.gender;
                    }

                }
            }

            newText(f) {
                const lemmaCopy = new API.Lemma(this);
                lemmaCopy.internalText = f(lemmaCopy);
                lemmaCopy.lowerCaseText = lemmaCopy.internalText.toLowerCase();
                return Object.freeze(lemmaCopy);
            }

            newGender(f) {
                const lemmaCopy = new API.Lemma(this);
                lemmaCopy.internalGender = f(lemmaCopy);
                return Object.freeze(lemmaCopy);
            }

            equals(o) {
                return (o instanceof API.Lemma)
                    && (this.lower() === o.lower())
                    && (this.isPluraliaTantum() === o.isPluraliaTantum())
                    && (this.isPluraliaTantum() || (this.getGender() === o.getGender()))
                    && (this.isIndeclinable() === o.isIndeclinable())
                    && (this.isAnimate() === o.isAnimate())
                    && (this.isASurname() === o.isASurname())
                    && (this.isAName() === o.isAName())
                    && (this.isATransport() === o.isATransport())
                    && (this.isAWatercraft() === o.isAWatercraft());
            }

            fuzzyEquals(o) {
                return (o instanceof API.Lemma)
                    && (unYo(this.lower()) === unYo(o.lower()))
                    && (this.isPluraliaTantum() === o.isPluraliaTantum())
                    && (this.isPluraliaTantum() || (this.getGender() === o.getGender()))
                    && (this.isIndeclinable() === o.isIndeclinable());
            }

            text() {
                return this.internalText;
            }

            lower() {
                return this.lowerCaseText;
            }

            isPluraliaTantum() {
                return this.pluraliaTantum;
            }

            getGender() {
                return this.internalGender;
            }

            isIndeclinable() {
                return this.indeclinable;
            }

            isAnimate() {
                return this.animate || this.surname || this.name;
            }

            isASurname() {
                return this.surname;
            }

            isAName() {
                return this.name;
            }

            isATransport() {
                return this.transport || this.watercraft;
            }

            isAWatercraft() {
                return this.watercraft;
            }
        },

        /**
         * Интерфейс с именованными параметрами для создания лемм.
         * Если параметр — уже лемма, вернет тот же объект, а не копию.
         *
         * Леммы, которые в коде используются много раз, следует
         * конструировать через эту функцию, иначе они будут
         * неявно конструироваться на каждый вызов любой функции
         * или метода в этой библиотеке.
         *
         * @param {RussianNouns.Lemma|Object} o
         * @throws {RussianNouns.LemmaException} Ошибки из конструктора леммы.
         * @returns {RussianNouns.Lemma} Иммутабельный объект.
         */
        createLemma: o => {
            if (o instanceof API.Lemma) {
                return o;
            }

            return Object.freeze(new API.Lemma(o));
        },

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
        StressDictionary: class StressDictionary {
            constructor() {
                this.data = {};
            }

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

                const lemmaObject = API.createLemma(lemma);
                const hash = unYo(lemmaObject.lower());

                let homonyms = this.data[hash];

                if (!(homonyms instanceof Array)) {
                    homonyms = [];
                    this.data[hash] = homonyms;
                }

                const found = homonyms.find(ls => lemmaObject.equals(ls[0]));

                if (found) {
                    found[1] = settings;
                } else {
                    homonyms.push([lemmaObject, settings]);
                }
            }

            /**
             * @param {RussianNouns.Lemma|Object} lemma
             * @param {boolean} fuzzy Если не найдено, игнорировать букву Ё и второстепенные поля у леммы.
             * @returns {*} Строка настроек или undefined.
             */
            get(lemma, fuzzy) {
                const lemmaObject = API.createLemma(lemma);
                const hash = unYo(lemmaObject.lower());

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

            remove(lemma) {
                const lemmaObject = API.createLemma(lemma);
                const hash = unYo(lemmaObject.lower());

                const homonyms = this.data[hash];

                if (homonyms instanceof Array) {
                    this.data[hash] = homonyms.filter(ls => !lemmaObject.equals(ls[0]));

                    if (this.data[hash].length === 0) {
                        delete this.data[hash];
                    }
                }
            }

            hasStressedEndingSingular(lemma, grCase) {
                const caseIndex = CASES.indexOf(grCase);

                if (caseIndex >= 0) {
                    const v = this.get(lemma, true);

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

            hasStressedEndingPlural(lemma, grCase) {
                const caseIndex = CASES.indexOf(grCase);

                if (caseIndex >= 0 && caseIndex < 6) {
                    const v = this.get(lemma, true);

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

            /**
             * Благодаря этому методу, словарь можно использовать для других целей.
             * Например, если там есть слово, можно посмотреть его род и признаки.
             *
             * @param word Слово, по которому производится поиск.
             * Буква Ё и регистр игнорируются.
             * @returns {Array} Список лемм.
             */
            find(word) {
                const hash = unYo(word).toLowerCase();

                const homonyms = this.data[hash];

                if (homonyms instanceof Array) {
                    return homonyms.map(pair => pair[0]);
                } else {
                    return [];
                }
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
                return declineAsList(this, API.createLemma(lemma), grammaticalCase, pluralForm);
            }

            /**
             * @param {RussianNouns.Lemma|Object} lemma
             * @returns {Array}
             */
            pluralize(lemma) {
                const o = API.createLemma(lemma);

                if (o.isPluraliaTantum()) {
                    return [o.text()];
                } else {
                    return pluralize(this, o);
                }
            }

        }
    };

    function makeDefaultStressDictionary() {
        const d = new API.StressDictionary();

        function putAll(prototype, settings, joinedList) {
            const list = joinedList.split(',');
            for (let word of list) {
                const lemma = Object.assign({}, prototype);
                lemma.text = word;
                d.put(lemma, settings);
            }
        }

        function putM(settings, word) {
            d.put(
                {text: word, gender: Gender.MASCULINE},
                settings
            );
        }

        putAll({gender: Gender.MASCULINE},
            API.FIXED_STEM_STRESS,
            'брёх,дёрн,идиш,имидж,мед');

        putAll({gender: Gender.MASCULINE},
            'SSSSSSS-EEEEEE',
            'адрес,век,вечер,город,детдом,поезд');

        putAll({gender: Gender.MASCULINE},
            'SSSSSSE-EEEEEE',
            'берег,бок,вес,лес,снег,дом,катер,счёт,мёд');

        putAll({gender: Gender.MASCULINE, animate: true},
            API.FIXED_STEM_STRESS,
            'балансёр,шофёр');

        putAll({gender: Gender.MASCULINE},
            'SSSSSSS-bbbbbb',
            'вексель,ветер');

        putM('SSSSSSE-ESEEEE', 'глаз');
        putM('SSSSSSE-bEEbEE', 'год');
        putM('SSSSSSb-bbbbbb', 'цех');

        putM('SSSSSSE-EEEEEE', 'счёт'); // не путать со счётами (p.t.)

        putAll({gender: Gender.NEUTER},
            'EEEEEEE-SSSSSS',
            'тесло,' +
            'стекло,автостекло,бронестекло,оргстекло,' +
            'пеностекло,смарт-стекло,спецстекло,' +
            'бедро,берцо,блесна,чело,стегно,стебло');

        d.put(
            {text: 'щека', gender: Gender.FEMININE, animate: false},
            'EEEbEEE-SSESEE'
        );

        // У меня нет ответа, почему у следующих слов на ж/ш/ч/ц
        // ударения в основном на окончания.
        // Возможно, это коррелирует с количеством слогов в корне.
        // Вообще, почти во всех словах на ж/ш/ч/ц в русском языке
        // в творительном падеже ударение на основу слова.

        // Где-то половина этих слов очень широко используется,
        // другая половина — устаревшие, специальные, просторечные, грубые и т.п.

        // В этот список не вошли топонимы, имена, фамилии, отчества
        // и некоторые названия жителей населенных пунктов.

        putAll({gender: Gender.MASCULINE},
            'SbbSbbb-bbbbbb',
            'грош,шприц');

        putAll({gender: Gender.MASCULINE},
            'SssSsss-ssssss',
            'кишмиш,' +
            'кряж,' +  // обрубок бревна; гряда холмов
            'слеш,слэш');

        putAll({gender: Gender.MASCULINE, animate: true},
            'Sssssss-ssssss',
            'паныч');

        putM('SEESeEE-EEEEEE', 'стеллаж');
        putM('SeeSeee-eeeeee', 'шиномонтаж');

        putAll({gender: Gender.MASCULINE},
            'SEESEEE-EEEEEE',
            'багаж,' +
            // Встречаются в законах, условиях/правилах для пасажиров.
            'грузобагаж,товаробагаж,' +
            'багрец,барыш,беляш,бердыш,бич,' +
            'бандаж,блиндаж,бубенец,буж,' +
            'валец,варенец,венец,вираж,витраж,волосенец,волчец,вольтаж,' +
            'воронец,галдёж,гамма-луч,гнилец,' +
            'гараж,автогараж,' +
            'голец,' + // горная вершина
            'головач,' + // гриб
            'голыш,' + // камень
            'горбач,' + // рубанок
            'горлач,' + // кринка/крынка/глечик
            'голубец,грабёж,' +
            'гуж,гуляш,дворец,делёж,дергач,долбёж,долгунец,' +
            'драч,' + // плотницкий инструмент
            'ёрш,зубец,зубрёж,' +
            'изразец,калач,ключ,' +
            'камыш,' + // растение
            'карандаш,картёж,кедрач,кирпич,' +
            'клинец,' + // щебень
            'ковш,корец,козелец,конец,кострец,' +
            'копач,' + // орудие
            'крепёж,крестец,круглыш,кругляш,крыж,крылач,' +
            'кулеш,кулич,кумач,контуш,кунтуш,купаж,кураж,кутёж,' +
            'леденец,листаж,литраж,луч,' +
            'метраж,меч,мираж,монтаж,муляж,мятеж,' +
            'мокрец,' + // лишай, растение
            'москвич,' + // автомобиль
            'неплатёж,нож,нутрец,овсец,огурец,' +
            'орлец,' + // камень, коврик
            'острец,' + // растение
            'падеж,падёж,паж,палаш,паралич,первач,пернач,песец,' +
            rkComma('озжгдх,фтдх,') +
            'пихтач,платёж,погребец,подэтаж,поставец,поташ,правёж,путец,пыж,' +
            'пугач,' + // игрушечный пистолет
            'резец,ржанец,рубеж,рубец,' +
            'рогач,' + // ухват
            'свербёж,светец,сенаж,скулёж,слопец,сныч,солонец,сосец,' +
            'свинец,тетраэтилсвинец,' +
            'секач,' + // инструмент
            'спорыш,столбец,строгач,сургуч,сутаж,сыпец,сырец,сыровец,' +
            'терпёж,типаж,тираж,толкач,торец,тягач,тяж,' +
            'типец,' + // кормовой злак
            'тирлич,' + // горечавка (растение)
            'тупец,тупыш,' + // тупой скорняжный нож
            'целкач,чабрец,чепец,' +
            'фураж,хвостец,хлопунец,холодец,' +
            'чертёж,чистец,шалаш,шантаж,шиш,щипец,' +
            'электронож,этаж,ясенец');

        putAll({gender: Gender.MASCULINE, animate: true},
            'SEEEEEE-EEEEEE',
            'алкаш,' +
            'басмач,беглец,белец,бирюч,бич,' +
            'близнец,бомж,богач,' +
            'боец,борец,бородач,брюхач,' +
            'вдовец,волосач,' +
            'врач,главврач,ветврач,военврач,диетврач,санврач,' +
            'глупец,глупыш,голец,' +
            'головач,' + // птица, жук
            'голыш,гонец,горбач,гордец,грач,' +
            'гребец,делец,дергач,донец,дохлец,' +
            'драч,' + // тот, кто снимает шкуры
            'ёж,ёрш,' +
            'елец,' + // рыба
            'жеребец,живец,жилец,жнец,жрец,' +
            'избач,ингуш,' +
            'камыш,' + // камышинский голубь
            'корж,морж,' +
            'кольчец,' + // кольчатый червь
            'копач,' + // рабочий землекоп
            'кормач,коротыш,косач,косец,космач,крепыш,' +
            'кряж,' + // коренастый, (перен.) упорный и прижимистый человек
            'кудряш,кузнец,купец,' +
            'латыш,легаш,лжец,лихач,ловец,ловкач,лохмач,' +
            'малец,малыш,мертвец,мигач,мордаш,' +
            'мокрец,' + // насекомое
            'москвич,' + // житель Москвы
            'мудрец,мураш,носач,оголец,омич,' +
            'отец,праотец,' +
            'паж,камер-паж,палач,' +
            'пантач,певец,песец,писец,плавунец,подлец,племяш,пловец,портач,' +
            'продавец,перепродавец,' +
            'пошлец,пришлец,простец,птенец,пузач,' +
            'пугач,' + // филин
            'рвач,рифмач,рогач,рунец,рыбец,' +
            'ремнец,' + // паразитический плоский червь
            'самец,сарыч,севец,силач,синец,скворец,скопец,скрипач,скупец,' +
            'секач,' + // взрослый самец кабана или морского котика
            'слепец,слепыш,слухач,смехач,сморкач,снохач,соистец,сорванец,' +
            'спец,военспец,' +
            'стервец,стрелец,стригунец,стриж,стукач,сыч,' +
            'стрекач,' + // дать стрекача - убежать
            'струнец,' + // паразитический круглый червь
            'творец,телец,ткач,толмач,торгаш,трубач,трюкач,тунец,' +
            'трепач,трепец,' + // трепальщик льна
            'тупец,тупыш,' + // глупый человек
            'тяглец,' + // тяглый крестьянин
            'удалец,уж,усач,хитрец,хохмач,храбрец,хромец,хрыч,' +
            rkComma('фЯц,') +
            'циркач,червец,чернец,черныш,швец,шельмец,чтец,чиж,юнец');

        // Следующие слова важны из-за р.п. мн.ч.,
        // который зависит от ударения в им.п. ед.ч.

        d.put(
            {text: 'судья', gender: Gender.COMMON, animate: true},
            'EEEEEEE-SSSSSS'
        );

        for (let w of ['семья', 'макросемья']) {
            d.put(
                {text: w, gender: Gender.FEMININE},
                'EEEEEEE-SESSSS'
            );
        }

        d.put(
            {text: 'свинья', gender: Gender.FEMININE, animate: true},
            'EEEEEEE-SESESS'
        );

        d.put(
            {text: 'скамья', gender: Gender.FEMININE},
            'EEEEEEE-eEeeee'
        );

        for (let w of ['ладья', 'статья']) {
            d.put(
                {text: w, gender: Gender.FEMININE},
                API.FIXED_ENDING_STRESS
            );
        }

        return d;
    }

    const consonantsExceptJ = 'бвгджзклмнпрстфхцчшщ';
    const consonants = consonantsExceptJ + 'й';
    const vowels = 'аоуэыяёюеи';

    const isVowel = character => vowels.includes(character.toLowerCase());

    const isUpper = s => s === s.toUpperCase();

    const upperLike = (lowerCase, pattern) => isUpper(pattern) ? lowerCase.toUpperCase() : lowerCase;

    const vowelCount = s => s.split('').filter(isVowel).length;

    const last = str => {
        if (str && str.length) {
            return str[str.length - 1];
        } else {
            return '';
        }
    };

    const nLast = (str, n) => str.substring(str.length - n);

    const init = s => s.substring(0, s.length - 1);

    const nInit = (s, n) => s.substring(0, s.length - n);

    const lastOfNInitial = (str, n) => last(nInit(str, n));

    const endsWithAny = (w, arr) => arr.filter(a => w.endsWith(a)).length > 0;

    const unique = a => a.filter((item, index) => a.indexOf(item) === index);

    const unYo = s => s.replace('ё', 'е').replace('Ё', 'Е');

    const reYo = s => {
        const index = Math.max(
            s.toLowerCase().lastIndexOf('е'),
            s.toLowerCase().lastIndexOf('ё')
        );
        const r = upperLike('ё', s[index]);
        return s.substring(0, index) + r + s.substring(index + 1);
    };

    const singleEYo = s => (s.replace(/[^её]/g, '').length === 1);

    function getNounStem0(word) {
        const lcLastChar = last(word).toLowerCase();

        if (('й' === lcLastChar || isVowel(lcLastChar)) && isVowel(last(init(word)))) {
            return nInit(word, 2);
        }

        if (isVowel(lcLastChar)) {
            return init(word);
        }
        return word;
    }

    function getNounStem(lemma) {
        const word = lemma.text();
        const lcWord = lemma.lower();
        const gender = lemma.getGender();
        const lcLastChar = last(lcWord);

        if (['бубен', 'бугор',
                'ветер', 'вымысел', 'горшок', 'дятел', 'домысел', 'замысел',
                'кашель', 'коготь',
                'лапоть', 'лоб', 'локоть', 'ломоть', 'молебен', 'мох', 'ноготь', 'овен',
                'пепел', 'пес', 'пёс', 'петушок', 'помысел', 'порошок', 'посол',
                'промысел', 'псалом', 'пушок', 'ров', 'рот',
                'сон', 'стебель', 'стишок',
                'угол', 'умысел', 'хребет', 'церковь', 'шов'
            ].includes(lcWord)
            || endsWithAny(lcWord, ['узел', 'уголь', 'чок', 'ешок', 'хол'])) {
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

        if (consonantsExceptJ.includes(last(lcWord))) {
            return word;
        }

        if ('ь' === last(lcWord)) {

            const en2a2b = [
                'ясень', 'бюллетень', 'олень', 'гордень', 'пельмень',
                'ячмень'
            ];

            if (lcWord.endsWith('ень') && (gender === Gender.MASCULINE) && !endsWithAny(lcWord, en2a2b)) {
                return nInit(word, 3) + 'н';
            } else {
                return init(word);
            }
        }

        if ('ь' === last(init(lcWord))) {
            return init(word);
        }

        if ('о' === last(lcWord) && 'влмнстх'.includes(last(init(lcWord)))) {
            return init(word);
        }

        return getNounStem0(word);
    }

    function getDeclension(lemma) {
        const lcWord = lemma.lower();
        const gender = lemma.getGender();

        if (lemma.isPluraliaTantum()) {
            return undefined;
        }

        if (lemma.isIndeclinable()) {
            return -1;
        }

        const t = last(lcWord);
        switch (gender) {
            case Gender.FEMININE:
                return t == "а" || t == "я" ? 2 :
                    consonants.includes(t) ? -1 : 3;
            case Gender.MASCULINE:
                return t == "а" || t == "я" ? 2 :
                    lcWord == "путь" ? 0 : 1;
            case Gender.NEUTER:
                return ['дитя', 'полудитя'].includes(lcWord) ? 0 :
                    nLast(lcWord, 2) == "мя" ? 3 : 1;
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
                .every(l => consonantsExceptJ.includes(l))
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
            'инок', 'обморок', 'порок', 'пророк', 'сток', 'урок'
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
        || ('её'.includes(last(w)) && !w.endsWith('це'));

    function halfSomething(word) {
        if (word.startsWith('пол')
            && ['и', 'ы', 'а', 'я', 'ь'].includes(last(word))
            && (vowelCount(word) >= 2)) {

            let subWord = word.substring(3);

            // На случай дефисов.
            let offset = subWord.search(/[а-яА-Я]/);

            // Сюда не должны попадать как минимум
            // мягкий и твердый знаки помимо гласных.

            return (offset >= 0) && consonants.includes(subWord[offset].toLowerCase());

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

        const iyWord = () => last(lcWord) === 'й'
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
            || (lcWord.endsWith('ной') && vowelCount(word) >= 2);

        if (Case.NOMINATIVE === grCase) {
            return word;
        }

        if (Case.GENITIVE === grCase) {

            const addUForm = r => {
                if (!lemma.isAnimate() && (
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
                ).split(',').includes(lcWord)) {

                    if (last(lcWord) === 'й') {
                        r.push(init(word) + upperLike('ю', last(word)));
                    } else {
                        r = r.concat(eStem(stem, s => s + upperLike('у', last(s))));
                    }
                }

                return r;
            };

            if ((iyWord() && lemma.isASurname())
                || iyoy()
                || endsWithAny(lcWord, ['ое', 'нький', 'ский', 'евой', 'овой'])) {
                return stem + 'ого';
            } else if (endsWithAny(lcWord, ['ее', 'кожий', 'шний', 'жний', 'щий', 'ший', 'чий'])) {
                return stem + 'его';
            } else if (iyWord()) {
                let r = [eiStem() + 'я'];
                return addUForm(r);
            } else if (soft && !schWord()) {
                return stem + 'я';
            } else if (tsWord(lcWord)) {
                return tsStem(word, lemma) + 'ца';
            } else if (okWord(lcWord)) {
                return init(head) + 'ка';
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
            if ((iyWord() && lemma.isASurname())
                || iyoy()
                || endsWithAny(lcWord, ['ое', 'нький', 'ский', 'евой', 'овой'])) {
                return stem + 'ому';
            } else if (endsWithAny(lcWord, ['ее', 'кожий', 'шний', 'жний', 'щий', 'ший', 'чий'])) {
                return stem + 'ему';
            } else if (iyWord()) {
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
            if ((iyWord() && lemma.isASurname()) || endsWithAny(lcWord, ['ое', 'ее', 'нький', 'ский'])) {

                if (lcWord !== 'целое') {
                    return stem + 'им';
                } else {
                    return stem + 'ым';
                }

            } else if (iyoy() || endsWithAny(lcWord, ['евой', 'овой'])) {
                return stem + 'ым';
            } else if (endsWithAny(lcWord, ['кожий', 'шний', 'жний', 'щий', 'ший', 'чий'])) {
                return init(head) + 'им';
            } else if (iyWord()) {
                return eiStem() + 'ем';
            } else if (soft || ('жчш'.includes(last(lcStem)))) {

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
            if ((iyWord() && lemma.isASurname())
                || iyoy()
                || endsWithAny(lcWord, ['ое', 'нький', 'ский', 'евой', 'овой'])) {
                return stem + 'ом';
            } else if (endsWithAny(lcWord, ['ее', 'кожий', 'шний', 'жний', 'щий', 'ший', 'чий'])) {
                return stem + 'ем';
            } else if (endsWithAny(lcWord, ['воробей'])) {
                const i = init(head);
                return i + upperLike('ье', last(i));
            } else if (endsWithAny(lcWord, [
                'ий', 'ие', 'чье', 'тье', 'дье', 'вье', 'бье',
                'енье', 'жалованье',
                'ружье', 'божье', 'верье', 'мужье'
            ]) && !endsWithAny(lcWord, [
                'запястье', 'здоровье', 'изголовье'
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

            const uInanimate = (
                'ад,' +
                'баз,' + // скотный двор
                'бал,бег,берег,бережок,бой,бок,бочок,бор,борт,бред,быт,' +
                'век,верх,вес,ветер,ветр,вид,воз,' +
                'газ,глаз,год,горб,гроб,день,долг,дух,дым,жир,зад,' +
                'клей,кол,кон,корень,край,круг,' +
                'лад,лёд,лед,лоб,мох,угол,' +
                'лес,луг,мёд,мел,мех,мозг,низ,нос,плен,пол,' +
                'полк,артполк,порт,аэропорт,пух,' +
                'рай,род,сад,свет,слух,снег,сок,спирт,строй,счёт,счет,сук,' +
                rkComma('фти,') +
                'тыл,ход,час,шаг,шкаф,яр'
            ).split(',');

            const u = ('вор').split(',');

            if ((uInanimate.includes(lcWord) && !lemma.isAnimate()) || u.includes(lcWord)) {
                if (last(lcWord) === 'й') {
                    return unYo(head) + 'ю';
                } else if (soft) {
                    return unYo(stem) + 'ю';
                } else if (okWord(lcWord)) {
                    return unYo(init(head)) + 'ку'
                } else {
                    return unYo(stem) + 'у';
                }
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
        switch (grCase) {
            case Case.NOMINATIVE:
                return word;
            case Case.GENITIVE:
                if (ayaWord()) {
                    return stem + 'ой';
                } else if (lemma.isASurname()) {
                    return head + 'ой';
                } else if (
                    soft() || 'гжкхчшщ'.includes(last(lcStem))  // soft, sibilant or velar
                ) {
                    return head + 'и';
                } else {
                    return head + 'ы';
                }
            case Case.DATIVE:
                if (ayaWord()) {
                    return stem + 'ой';
                } else if (lemma.isASurname()) {
                    return head + 'ой';
                } else if (nLast(lcWord, 2) === 'ия') {
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
                } else if (soft() || 'жцчшщ'.includes(last(lcStem))) {
                    if ('и' === last(lcHead)) {
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
                } else if (lemma.isASurname()) {
                    return head + 'ой';
                } else if (nLast(lcWord, 2) === 'ия') {
                    return head + 'и';
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
                    if (lcWord === 'церковь') {
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

        if (lemma.isPluraliaTantum()) {
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

    function pluralize(engine, lemma) {
        const result = [];

        const word = lemma.text();
        const lcWord = lemma.lower();

        const stem = getNounStem(lemma);
        const lcStem = stem.toLowerCase();

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

        const simpleFirstPart = (('й' == last(lcWord) || isVowel(last(word))) && isVowel(last(init(word))))
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

        function yeruOrI(doNotUnYo) {
            if ('гжкхчшщ'.includes(last(lcStem))
                || 'яйь'.includes(last(lcWord))
                || endsWithAny(lcWord, ['сосед'])) {

                if (softPatronymic()) {
                    result.push(softPatronymicForm2() + 'и');
                    result.push(simpleFirstPart + 'и');
                } else {
                    result.push(simpleFirstPart + 'и');
                }

            } else if (tsWord(lcWord)) {
                result.push(tsStem(word, lemma) + 'цы');

            } else {

                if (softPatronymic()) {
                    result.push(softPatronymicForm2() + 'ы');
                    result.push(simpleFirstPart + 'ы');
                } else if (doNotUnYo) {
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
                    'инок': ['иноки'],
                    'исток': ['истоки'],
                    'клок': ['клочья', 'клоки'],
                    'князь': ['князи', 'князья'],
                    'кол': ['колы', 'колья'],   // TODO: можно разделить на омонимы
                    'месяц': ['месяцы'],
                    'татарин': ['татары'],
                    'хозяин': ['хозяева'],
                    'цветок': ['цветки', 'цветы']
                    // И я решил зашить сюда даже случаи, когда итак слово норм обрабатывается,
                    // но в корпусе там буква Ё. И почему бы не выдавать так же букву Ё.
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
                    'вошь': ['вши'],
                    'гроздь': ['грозди', 'гроздья'],
                    'курица': ['курицы', "куры"],
                    'береста': ['берёсты'],
                    'верста': ['вёрсты'],
                    'десна': ['дёсны'],
                    'жена': ['жёны'],
                    'звезда': ['звёзды'],
                    'кинозвезда': ['кинозвёзды'],
                    'стая': ['стаи'],
                    'щека': ['щёки']
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
                    'бревно': ['брёвна'],
                    'ведро': ['вёдра'],
                    'веретено': ['веретёна'],
                    'весло': ['вёсла'],
                    'гнездо': ['гнёзда'],
                    'зерно': ['зёрна'],
                    'знамя': ['знамёна'],
                    'колесо': ['колёса']
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
                        'лес', 'мастер', 'номер',
                        'сахар', 'снег', 'сорт', 'счет', 'счёт',
                        'терем',
                        'том',  // TODO неодушевленное (не имя).
                        'холод', 'цвет', 'череп'
                    ];

                    const aYaWords2 = [
                        'округ', 'остров', 'отпуск',
                        'поезд',
                        'цех',
                        'юнкер'
                    ];

                    const aYaWords3 = [
                        'адрес',
                        'договор',
                        'буфер',
                        'ворох',
                        'год',
                        'директор',
                        'инспектор', 'инструктор',
                        'корпус',   // TODO омонимы
                        'крейсер',
                        'орден', 'ордер',
                        'тенор', 'тон', 'трактор',
                        'тормоз', // TODO наверно, ы только в одушевленной форме
                        'ветер',
                        'верх',
                        'китель',
                        'мех',
                        'юнкер',    // 🤕
                        'ястреб'
                    ];

                    const aYaWords4 = [
                        'бункер',
                        'вымпел',
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
                        'клин', 'колос', 'ком', 'край'
                    ];

                    if ('сын' === lcWord) {

                        result.push('сыновья');
                        yeruOrI();

                    } else if ('человек' === lcWord) {

                        result.push('люди');
                        yeruOrI();

                    } else if (ya2.includes(lcWord)) {

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

                        // В корпусе фигурирует 🤷‍♂️
                        if ('барин' === lcWord) {
                            result.push(nInit(word, 2) + 'ы');
                        }

                    } else if (['цыган'].includes(lcWord)) {
                        result.push(word + 'е');
                    } else if ('щенок' == lcWord) {
                        result.push(nInit(word, 2) + 'ки');
                        result.push(nInit(word, 2) + 'ята');
                    } else if ((lcWord.endsWith('ёнок') || lcWord.endsWith('енок'))
                        && !endsWithAny(lcWord, [
                            'коленок', 'стенок', 'венок', 'ценок',
                            'валенок', 'оттенок', 'черенок'
                        ])) {
                        result.push(nInit(word, 4) + 'ята');
                    } else if (lcWord.endsWith('ёночек')) {
                        result.push(nInit(word, 6) + 'ятки');
                    } else if (lcWord.endsWith('онок')
                        && 'жчш'.includes(lastOfNInitial(lcWord, 4))
                        && !lcWord.endsWith('бочонок')) {
                        result.push(nInit(word, 4) + 'ата');
                    } else if (okWord(lcWord)) {
                        result.push(nInit(word, 2) + 'ки')
                    } else if (lcWord.endsWith('ый') || endsWithAny(lcWord, ['щий', 'чий', 'жний', 'шний', 'ский'])) {
                        result.push(init(word) + 'е');
                    } else if ((lcWord.endsWith('вой') && vowelCount(nInit(word, 3)) >= 2)
                        || (endsWithAny(lcWord, ['ной', 'мой']) && word.length >= 6)) {
                        result.push(nInit(word, 2) + 'ые');
                    } else if (endsWithAny(lcWord, ['хой', 'ший'])) {
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
                    } else if (('судно' === lcWord) && lemma.isATransport()) {
                        result.push('суда');
                        if (!lemma.isAWatercraft()) {
                            result.push('судна'); // "воздушные судна" употребляется, но реже.
                        }
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

                } else if (lcWord.endsWith('ая')) {
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

    function declinePlural(engine, lemma, grCase, plural) {
        const lcPlural = plural.toLowerCase();
        const gender = lemma.getGender();

        const stem = lcPlural.endsWith('цы') ? init(plural) : getNounStem0(plural);
        const softEndings = [
            'ли', 'си', 'ви', 'ди', 'ти', 'пи', 'ри', 'ни', 'фи', 'зи',
            'ьи', 'ья', 'ия', 'ря', 'ля', 'ая'
        ];

        for (let c of vowels) {
            softEndings.push(c + 'и')
        }

        // так называемые субстантивированные прилагательные
        const hardAdjectiveLike = () => lcPlural.endsWith('ые');
        const softAdjectiveLike = () => lcPlural.endsWith('ие');

        const unYoUnstressed = text =>
            engine.sd.hasStressedEndingPlural(lemma, grCase).includes(true)
                ? unYo(text) : text;

        const explicitZeroEndingCommonGenderSurnameLike = [
            'головы', 'детины', 'дубины',
            'скотины', 'старейшины', 'старины', 'старшины'
        ];

        const surnameType1 = () => endsWithAny(lcPlural, ['овы', 'евы', 'ёвы', 'ины', 'ыны'])
            && !endsWithAny(lcPlural, explicitZeroEndingCommonGenderSurnameLike)
            && (lemma.isASurname() || (gender === Gender.COMMON));

        if (Case.DATIVE === grCase) {

            if (surnameType1()) {
                return plural + 'м';
            } else if (hardAdjectiveLike()) {
                return nInit(plural, 2) + 'ым';
            } else if (softAdjectiveLike()) {
                return nInit(plural, 2) + 'им';
            } else if (endsWithAny(lcPlural, softEndings)) {
                return init(plural) + 'ям';
            } else {
                return unYoUnstressed(stem) + 'ам';
            }

        } else if (Case.INSTRUMENTAL === grCase) {

            if (surnameType1()) {
                return plural + 'ми';
            } else if (hardAdjectiveLike()) {
                return nInit(plural, 2) + 'ыми';
            } else if (softAdjectiveLike()) {
                return nInit(plural, 2) + 'ими';
            } else if (endsWithAny(lcPlural, ['люди'])) {
                return init(plural) + 'ьми';
            } else if (endsWithAny(lcPlural, softEndings)) {
                return init(plural) + 'ями';
            } else {
                return unYoUnstressed(stem) + 'ами';
            }

        } else if ([Case.PREPOSITIONAL, Case.LOCATIVE].includes(grCase)) {

            if (surnameType1()) {
                return plural + 'х';
            } else if (hardAdjectiveLike()) {
                return nInit(plural, 2) + 'ых';
            } else if (softAdjectiveLike()) {
                return nInit(plural, 2) + 'их';
            } else if (endsWithAny(lcPlural, softEndings)) {
                return init(plural) + 'ях';
            } else {
                return unYoUnstressed(stem) + 'ах';
            }

        }

        if ([Case.GENITIVE, Case.ACCUSATIVE].includes(grCase)) {

            if (endsWithAny(lcPlural, ['овичи', 'евичи'])) {
                return init(plural) + 'ей';
            }

            if (lcPlural.endsWith('вны')) {
                return nInit(plural, 2) + 'ен';
            }

        }

        if ((Case.GENITIVE === grCase) || ((Case.ACCUSATIVE === grCase) && lemma.isAnimate())) {

            if (surnameType1()) {
                return plural + 'х';
            } else if (hardAdjectiveLike()) {
                return nInit(plural, 2) + 'ых';
            } else if (softAdjectiveLike()) {
                return nInit(plural, 2) + 'их';
            }

            const declension = getDeclension(lemma);

            const genitiveStem = () => {
                const lcStem = stem.toLowerCase();
                if (endsWithAny(lcStem, ['кн', 'кл', 'нк', 'пк', 'рк', 'тк', 'вк', 'лк'])) {
                    const end = last(stem);
                    return init(stem) + upperLike('о', end) + end;
                } else if (endsWithAny(lcPlural, ['дра'])) {
                    const end = lastOfNInitial(plural, 1);
                    return nInit(plural, 2) + upperLike('е', end) + end;
                } else if (endsWithAny(lcStem, ['льц', 'сьм', 'деньг', 'ьк', 'йк'])) {
                    const end = last(stem);
                    return nInit(stem, 2) + upperLike('е', end) + end;
                } else if (endsWithAny(lcStem, ['сл'])) {
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

            const iEy = [
                'беготни',
                'болтовни',
                'вожжи',
                'возни',
                'доли',
                'лапши',
                'левши',
                'марли',
                'ноздри',
                'пени',
                'пятерни',
                'распри',
                'родни',
                'сакли',
                'ступни',
                'фигни',
                'чукчи'
            ];

            if (Gender.FEMININE !== gender) {

                // Очень много исключений. Наверно, это можно как-то отрефакторить.
                // TODO: Это всё должно быть в изменяемых настройках в экземпляре движка.

                // Слова на "а", которые легко склеиваются с другими корнями.
                // Например, "киберлеса", "электропоезда", "аэросуда", "протогорода".
                // При этом, в корпусе если даже и есть другие слова,
                // заканчивающиеся на эти строки, в род. п. они тоже заканчиваются на "ов".
                const explicitOv1 = [
                    'адреса', 'поезда', 'цеха', 'снега',
                    'бункера', 'буфера',
                    'берега', 'вымпела', 'голоса', 'города',
                    'директора', 'договора', 'доктора', 'жемчуга',
                    'инспектора', 'инструктора',
                    'колокола', 'кондуктора', 'короба', 'корпуса', 'крейсера', 'кузова',
                    'леса', 'мастера', 'номера',
                    'острова', 'отпуска', 'сахара', 'трактора', 'тормоза',
                    'холода', 'цвета', 'черепа', 'шторма', 'штуцера',
                    'юнкера', 'ястреба',
                    'суда', 'корм'
                ];

                const explicitOv = explicitOv1.concat([
                    'аланы', 'беглецы', 'близнецы', 'бойцы', 'бока', 'борта', 'борцы', 'бруствера', 'брюшки',
                    'веера', 'века', 'венцы', 'верха', 'веса', 'весы', 'вечера', 'вороха',
                    'глупцы', 'гонцы', 'дворцы', 'дельцы',
                    'детдома', 'детдомы', 'дома', 'жеребцы', 'жильцы', 'жрецы', 'зубцы', 'истцы', 'катера',
                    'концы', 'корма', 'кузнецы', 'купола', 'купцы', 'мертвецы', 'меха', 'мудрецы',
                    'облака', 'образа', 'образцы', 'огурцы', 'округа', 'омута',
                    'ордена', 'ордера', 'отцы', 'очки',
                    'певцы', 'песцы', 'пловцы', 'подлецы',
                    'продавцы', 'птенцы', 'резцы', 'рубцы', 'самцы',
                    'свинцы', // есть такое слово?
                    'сорта', 'соуса', 'спецы', 'столбцы', 'стрельцы',
                    'творцы', 'тельцы', 'тенора', 'терема', 'тома', 'тона', 'торцы', 'юнцы'
                ]);

                const explicitZeroEndingAndOv = [
                    'аршины', 'баклажаны', 'буквы', 'гольфы', 'граммы', 'гусары',
                    'дела', 'кадеты', 'килограммы', 'омы', 'помидоры', 'рентгены',
                    'ботинки', 'человеки', 'чулки'
                ];

                const explicitOvAndZeroEnding = [
                    'гектары', 'рельсы'
                ];

                const explicitZeroEnding = explicitZeroEndingCommonGenderSurnameLike.concat([
                    'бедняги', 'бедолаги', 'болгары', 'бродяги', 'будды',
                    'веки', 'вельможи', 'верзилы', 'владыки', 'воеводы', 'волосы', 'вояки',
                    'главы', 'грузины', 'задиры',
                    'железы', // желёз
                    'жилы', 'зануды', 'зеваки', 'калеки', 'коллеги', 'крохи', 'курицы', 'куры',
                    'ламы', 'мужчины', 'непоседы', 'папы', 'папаши', 'таты', 'падлы', 'партизаны', 'погоны',
                    'предтечи', 'работяги', 'разы', 'румыны', 'самоубийцы', 'убийцы',
                    'сапоги', 'сатаны', 'сироты', 'слуги', 'солдаты',
                    'старосты',
                    'татары', 'телеса',
                    'хитрюги', 'шляпы', 'яблоки',
                    // См. код функции genitiveStem.
                    'дядьки', 'дяденьки', 'зайки', 'кроссовки', 'малютки', 'малолетки',
                    'попки', 'турки'
                ]);

                const mShki = [
                    'братишки', 'дружки', 'мальчишки', 'парнишки',
                    'сынишки', 'папочки', 'дедушки', 'дядюшки', 'батюшки',
                    'городишки', 'домишки'
                ];

                // малышки

                // рожки

                // листья
                // молодцы

                if (((gender === Gender.COMMON)
                    && !endsWithAny(lcPlural, iEy)
                    && !(['ж', 'ш', 'ч'].includes(lastOf2Initial)))
                    || explicitZeroEnding.includes(lcPlural)
                    || (lemma.lower() === 'барин')) {
                    return genitiveStem();
                } else if (explicitOv.includes(lcPlural)) {
                    return init(plural) + 'ов';
                } else if (explicitZeroEndingAndOv.includes(lcPlural)) {
                    return [
                        genitiveStem(),
                        init(plural) + 'ов'
                    ];
                } else if (explicitOvAndZeroEnding.includes(lcPlural)) {
                    return [
                        init(plural) + 'ов',
                        genitiveStem()
                    ];
                } else if (endsWithAny(lcPlural,
                    ['жи', 'ши', 'чи',
                        'ля', 'ли', 'чи', 'ри', 'ти', 'ди',
                        'борщи', 'клещи', 'товарищи',
                        'плащи', 'прыщи', 'хрящи'])
                    || (lemma.lower().endsWith('ь') && !endsWithAny(lemma.lower(), [
                        'зять', 'деверь'
                    ]))) {

                    let s = ('ь' === last(init(lcPlural))) ? nInit(plural, 2) : init(plural);
                    return s + 'ей';

                } else if (endsWithAny(lcPlural, [
                    'братья', 'брусья', 'деревья', 'донья', 'звенья',
                    'клинья', 'клочья', 'коленья', 'колосья', 'колья', 'комья', 'крылья',
                    'листья', 'лоскутья', 'перья', 'платья', 'поводья', 'прутья',
                    'стулья', 'сучья', 'ульи', 'шилья'
                ])) {
                    return init(plural) + 'ев';
                } else if (endsWithAny(lcPlural, [
                    'зятья', 'кумовья', 'деверья', 'края', 'клеи', 'холуи'
                    ])
                    || [rk('фтз'), 'чаи'].includes(lcPlural)) {
                    return init(plural) + 'ёв';
                } else if (endsWithAny(lcPlural, ['ья', 'ия'])) {
                    if (Gender.MASCULINE === gender) {
                        return nInit(plural, 2) + 'ей';
                    } else {
                        return nInit(plural, 2) + 'ий';
                    }
                } else if (lcPlural.endsWith('мена')) {
                    return nInit(plural, 3) + 'ён';
                } else if (lemma.lower().endsWith('яйцо')) {
                    return upperLike('яиц', init(plural))
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
                    return nInit(plural, 2) + 'ек';
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
                } else if (['ж', 'ш', 'ч'].includes(lastOf2Initial)) {
                    return nInit(plural, 2) + 'ек';
                } else if (consonantsExceptJ.includes(lastOf2Initial)) {
                    return nInit(plural, 2) + 'ок';
                }
            }

            if (iEy.includes(lcPlural)) {
                return init(plural) + 'ей';
            } else if (endsWithAny(lcPlural, ['еи', 'эи', 'уи'])) {
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

            if (lcPlural.endsWith('ни') && consonantsExceptJ.includes(lastOfNInitial(lcPlural, 2))) {
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

            if ((stem.length === lcPlural.length - 1) && endsWithAny(lcPlural, softEndings)) {

                if (['ь', 'й'].includes(lastOfNInitial(stem, 1).toLowerCase()) && !lemma.isAnimate()) {
                    const end = last(stem);
                    return nInit(stem, 2) + upperLike('е', end) + end;
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
