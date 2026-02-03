"use strict";

function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }

/*!
  RussianNounsJS v2.5.0
  Copyright (c) 2011-2026 Georgy Ustinov
  Released under the MIT license
*/

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define([], factory);
    } else if ((typeof module === "undefined" ? "undefined" : _typeof(module)) === 'object' && module.exports) {
        // CommonJS
        module.exports = factory();
    } else {
        root.RussianNouns = factory();
    }
})(typeof self !== 'undefined' ? self : void 0, function () {
    'use strict';

    // Ссылки:
    // - Современный русский язык. Морфология - Камынина А.А., Уч. пос. 1999 - 240 с.
    // - Статья http://en.wikipedia.org/wiki/Russian_grammar
    // - Плунгян В. А. К семантике русского локатива («второго предложного» падежа)
    // Семиотика и информатика. 2002. Вып. 37. С. 229-254
    // - Открытый корпус http://opencorpora.org/
    // - Национальный корпус русского языка https://ruscorpora.ru/
    var CaseValues = Object.freeze(["именительный", "родительный", "дательный", "винительный", "творительный", "предложный", "местный"]);
    var Case = Object.freeze({
        NOMINATIVE: CaseValues[0],
        GENITIVE: CaseValues[1],
        DATIVE: CaseValues[2],
        ACCUSATIVE: CaseValues[3],
        INSTRUMENTAL: CaseValues[4],
        PREPOSITIONAL: CaseValues[5],
        LOCATIVE: CaseValues[6]
    });
    var GenderValues = Object.freeze(["женский", "мужской", "средний", "общий"]);
    var Gender = Object.freeze({
        "FEMININE": GenderValues[0],
        "MASCULINE": GenderValues[1],
        "NEUTER": GenderValues[2],
        "COMMON": GenderValues[3]
    });
    function toLowerCaseRu(s) {
        // Это на самом деле быстрее, чем нативный toLowerCase, во всяком случае в Chrome,
        // поскольку нативный toLowerCase преобразует все алфавиты, а здесь только кириллица.

        var codes = new Array(s.length);
        for (var i = 0; i < s.length; i++) {
            var ch = s.charCodeAt(i);
            if (ch >= 0x0410 && ch <= 0x042F) {
                ch += 0x20;
            } else if (ch >= 0x0400 && ch <= 0x040F) {
                ch += 0x50;
            }
            codes[i] = ch;
        }

        // Функция apply может вызвать RangeError при очень длинных
        // массивах (лимит аргументов), но для слов — это не проблема.

        return String.fromCharCode.apply(null, codes);
    }

    /**
     * @param o A plain old JavaScript object.
     * @returns {string|null} Описание ошибки на английском или null.
     */
    function validateCreateLemma(o) {
        if (null == o) {
            return 'No parameters specified.';
        }
        for (var _i = 0, _arr = ['pluraleTantum', 'indeclinable', 'animate', 'surname', 'name', 'transport']; _i < _arr.length; _i++) {
            var fieldName = _arr[_i];
            var check = function check(x) {
                return null != x && typeof x != 'boolean';
            };
            if (check(o[fieldName])) {
                return '' + fieldName + ' must be boolean.';
            }
        }
        if (o.text == null) {
            return 'A cyrillic word required.';
        }
        if (!o.pluraleTantum) {
            if (o.gender == null) {
                return 'A grammatical gender required.';
            }
            if (!GenderValues.includes(o.gender)) {
                return 'Bad grammatical gender.';
            }
        }
        return null;
    }
    var Lemma = /*#__PURE__*/function () {
        /**
         * Пожалуйста, используйте статические методы create
         * и createOrNull вместо конструктора.
         *
         * @param {RussianNouns.Lemma|Object} o
         */
        function Lemma(o) {
            _classCallCheck(this, Lemma);
            if (o instanceof Lemma) {
                this._txt = o._txt;
                this._lc = o._lc;
                this._hash = o._hash;
                this._flags = o._flags;
            } else {
                if (o.pluraleTantum) {
                    this._flags = 5;
                } else {
                    this._flags = 1 + GenderValues.indexOf(o.gender);
                }
                this._txt = o.text;
                this._lc = o.text.toLowerCase();
                this._hash = calculateHash(this._lc);
                this._flags |= (1 << 3) * (o.indeclinable & 1);
                this._flags |= (1 << 4) * (o.animate & 1);
                this._flags |= (1 << 5) * (o.surname & 1);
                this._flags |= (1 << 6) * (o.name & 1);
                this._flags |= (1 << 7) * (o.transport & 1);
                this._flags |= (1 << 16) * (2 + calculateDeclension(this._lc, o.pluraleTantum, o.gender, o.indeclinable));
            }
        }

        /**
         * Если параметр — уже лемма, вернет тот же объект, а не копию.
         *
         * @param {RussianNouns.Lemma|Object} o
         * @throws {Error} Ошибки из конструктора леммы.
         * @returns {RussianNouns.Lemma}
         */
        return _createClass(Lemma, [{
            key: "newText",
            value:
            /**
             * @deprecated since version 2.0.0
             */
            function newText(provider) {
                var lemmaCopy = new Lemma(this);
                lemmaCopy._txt = provider(this);
                lemmaCopy._lc = lemmaCopy._txt.toLowerCase();
                lemmaCopy._hash = calculateHash(lemmaCopy.lower());
                lemmaCopy._flags &= 0xFFFF;
                lemmaCopy._flags |= (1 << 16) * (2 + calculateDeclension(lemmaCopy.lower(), lemmaCopy.isPluraleTantum(), lemmaCopy.getGender(), lemmaCopy.isIndeclinable()));
                return Object.freeze(lemmaCopy);
            }

            /**
             * @deprecated since version 2.0.0
             */
        }, {
            key: "newGender",
            value: function newGender(provider) {
                var g = provider(this);
                if (GenderValues.includes(g)) {
                    var lemmaCopy = new Lemma(this);
                    lemmaCopy._flags &= 0xFFF8;
                    lemmaCopy._flags |= 1 + GenderValues.indexOf(g);
                    lemmaCopy._flags |= (1 << 16) * (2 + calculateDeclension(lemmaCopy.lower(), lemmaCopy.isPluraleTantum(), g, lemmaCopy.isIndeclinable()));
                    return Object.freeze(lemmaCopy);
                }
            }
        }, {
            key: "equals",
            value: function equals(o) {
                return o instanceof Lemma && this._flags === o._flags && this.lower() === o.lower();
            }
        }, {
            key: "text",
            value: function text() {
                return this._txt;
            }
        }, {
            key: "lower",
            value: function lower() {
                return this._lc;
            }
        }, {
            key: "isPluraleTantum",
            value: function isPluraleTantum() {
                return 5 === (7 & this._flags);
            }
        }, {
            key: "getGender",
            value: function getGender() {
                var i = 7 & this._flags;
                if (i >= 1 && i <= 4) {
                    return GenderValues[i - 1];
                }
            }
        }, {
            key: "isIndeclinable",
            value: function isIndeclinable() {
                return (1 << 3 & this._flags) !== 0;
            }
        }, {
            key: "isAnimate",
            value: function isAnimate() {
                return (1 << 4 & this._flags) !== 0 || this.isASurname() || this.isAName();
            }
        }, {
            key: "isASurname",
            value: function isASurname() {
                return (1 << 5 & this._flags) !== 0;
            }
        }, {
            key: "isAName",
            value: function isAName() {
                return (1 << 6 & this._flags) !== 0;
            }
        }, {
            key: "isATransport",
            value: function isATransport() {
                return (1 << 7 & this._flags) !== 0;
            }

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
             * Понятие «склонение» сложно применить к словам plurale tantum,
             * поэтому этот метод возвращает для них -2 (вместо undefined).
             */
        }, {
            key: "getDeclension",
            value: function getDeclension() {
                return (this._flags >> 16) - 2;
            }

            /**
             * Возвращает «школьный» вариант склонения:
             * «вода» — первое склонение; «стол», «окно» — второе склонение.
             */
        }, {
            key: "getSchoolDeclension",
            value: function getSchoolDeclension() {
                var d = this.getDeclension();
                if (d === 1) {
                    return 2;
                } else if (d === 2) {
                    return 1;
                } else {
                    return d;
                }
            }
        }], [{
            key: "create",
            value: function create(o) {
                if (o instanceof this) {
                    return o;
                }
                var err = validateCreateLemma(o);
                if (err) {
                    throw new Error(err);
                }
                return Object.freeze(new this(o));
            }

            /**
             * Создание леммы с минимальными накладными расходами.
             *
             * @param {Object} options
             * @returns {RussianNouns.Lemma|null}
             */
        }, {
            key: "createOrNull",
            value: function createOrNull(options) {
                return null === validateCreateLemma(options) ? Object.freeze(new this(options)) : null;
            }
        }]);
    }();
    /**
     * Ключ для словаря местного падежа.
     * Это почти 100% уникальный ключ леммы, который учитывает наличие буквы ё и флаги.
     *
     * @param {Lemma} lemma
     * @returns {number} Размер числа примерно сопоставим с 2^42.
     */
    function toKey(lemma) {
        var hasYo = lemma.lower().includes('ё') & 1;
        var msb = (lemma._flags & 0xFFFF) << 1 | hasYo;
        return msb * 0x100000000 + lemma._hash;
    }

    // Without ё, the Russian alphabet consists of 32 letters.
    function lcBit(lcChar) {
        var x = lcChar.charCodeAt(0) - 1072;
        return x === 33 ? 32 : x === (0x1F & x) ? 1 << x : 0;
    }
    function bincludes(mask, lcChar) {
        return (mask & lcBit(lcChar)) !== 0;
    }
    var vowels = 3892855073;
    function isVowel(ch) {
        return bincludes(vowels, toLowerCaseRu(ch));
    }
    function isConsonantLc(lcChar) {
        return bincludes(66567902, lcChar);
    }
    function isConsonantNotJ(lcChar) {
        return bincludes(66567390, lcChar);
    }
    var upperLike = function upperLike(str, pattern) {
        return pattern === pattern.toUpperCase() ? str.toUpperCase() : str;
    };
    var vowelCount = function vowelCount(s) {
        return s.split('').filter(isVowel).length;
    };
    var nLast = function nLast(str, n) {
        return str.substring(str.length - n);
    };
    var last = function last(str) {
        return nLast(str, 1);
    };
    var nInit = function nInit(str, n) {
        return str.substring(0, str.length - n);
    };
    var init = function init(str) {
        return nInit(str, 1);
    };
    function lastOfNInitial(str, n) {
        var index = str.length - n - 1;
        return str.substring(index, index + 1);
    }

    // This function has O(n) complexity in relation to the number of characters in the array.
    var endsWithAny = function endsWithAny(w, arr) {
        return arr.some(function (a) {
            return w.endsWith(a);
        });
    };
    var unique = function unique(a) {
        return a.filter(function (item, index) {
            return a.indexOf(item) === index;
        });
    };
    var unYo = function unYo(s) {
        return s.replaceAll('ё', 'е').replaceAll('Ё', 'Е');
    };
    var eStem = function eStem(stressedEnding, stem, transform) {
        var x = stressedEnding.length ? stressedEnding : [false];
        return x.map(function (isStressed) {
            return isStressed ? transform(unYo(stem), isStressed) : transform(stem, isStressed);
        });
    };
    function calculateHash(lowerCaseUnicodeString) {
        var preparedString = lowerCaseUnicodeString.replaceAll('ё', 'е');

        // Дело в том, что когда данные так плотно упакованы, и у нас
        // некоторые буквы кодируются нулевыми битами, если, например,
        // первая буква - А, слово с этой буквой вначале и без неё
        // будет выражено одним и тем же набором бит.
        // Так что этот своего рода мигающий светодиод говорит, что что-то
        // меняется. Это один из способов немного уменьшить коллизию.
        var state = preparedString.length % 2;
        var readyBits = 1;

        // Daniel J. Bernstein's hash function
        // http://www.cse.yorku.ca/~oz/hash.html
        // https://theartincode.stanis.me/008-djb2/
        // The result is the same as if the hash were of type uint32_t.
        var hash = 5381;
        function flushBits() {
            // Multiplication instead of shifting is used in order
            // to ensure that the result is unsigned.
            hash = (hash * 33 + (state & 0xFF)) % 0x100000000;
            state = state >> 8;
            readyBits -= 8;
        }
        var _iterator = _createForOfIteratorHelper(preparedString),
            _step;
        try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
                var ch = _step.value;
                // Packing the five-bit letters.
                var chCode = ch.charCodeAt(0) - 1072 & 0x1F;
                state |= chCode << readyBits;
                readyBits += 5;
                if (readyBits >= 8) {
                    flushBits();
                }
            }
        } catch (err) {
            _iterator.e(err);
        } finally {
            _iterator.f();
        }
        if (readyBits > 0) {
            flushBits();
        }

        // Но теперь у коротких строк одинаковой длины с соседними
        // кодами первой буквы всё еще встречаются коллизии.
        var start = preparedString.charCodeAt(0) % 2;
        return (0x7fffffff & hash) * 2 + start;
    }
    function to11BitHash(hash) {
        // Специально для 2048-битного фильтра Блума
        return hash >>> 22 & 0x7ff ^ hash >>> 11 & 0x7ff ^ hash & 0x7ff;
    }
    function to11BitFakeHash(lcString) {
        var prepared = lcString.padStart(3, 'а');
        return (prepared.charCodeAt(0) & 0x7) << 8 | (prepared.charCodeAt(1) & 0xF) << 4 | prepared.charCodeAt(2) & 0xF;
    }

    /**
     * @param {Uint8ClampedArray} filter - 256 bytes
     * @param {number} index - Eleven bits
     * @returns {boolean}
     */
    function inBloom(filter, index) {
        return !!(filter[index >>> 3] >>> 7 - index % 8 & 1);
    }
    function bloomAdd(filter, index) {
        var byteIndex = index >>> 3;
        filter[byteIndex] = filter[byteIndex] | 1 << 7 - index % 8;
    }
    function toLetterTree(endingArray) {
        // Корень — конец всех строк массива.
        // В качестве ключей выступают последние буквы строк, а в качестве значений —
        // объекты, ключами в которых будут уже предпоследние буквы, и так далее.
        // Значение 0 вместо объекта означает начало строки.

        // При этом часть информации отбрасывается:
        // если в исходном массиве есть строки "ый" и "итый", достаточно проверить
        // две последние буквы, чтобы убедиться, что слово заканчивается на одно
        // из перечисленных окончаний.

        // Деревья используются с функцией endsWithLeaf.

        var result = new Map();
        var _iterator2 = _createForOfIteratorHelper(endingArray),
            _step2;
        try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                var ending = _step2.value;
                var cursor = result;
                for (var i = ending.length - 1; i >= 0; i--) {
                    var ch = ending.charCodeAt(i);
                    if (i > 0) {
                        var previous = cursor.get(ch);
                        if (previous === 0) {
                            break;
                        } else if (previous === undefined) {
                            cursor.set(ch, new Map());
                        }
                        cursor = cursor.get(ch);
                    } else {
                        cursor.set(ch, 0);
                    }
                }
            }
        } catch (err) {
            _iterator2.e(err);
        } finally {
            _iterator2.f();
        }
        return result;
    }
    function endsWithLeaf(word, tree) {
        var cursor = tree;
        for (var i = word.length - 1; i >= 0; i--) {
            var ch = word.charCodeAt(i);
            if (!cursor.has(ch)) {
                return false;
            } else {
                var value = cursor.get(ch);
                if (0 === value) {
                    return true;
                } else {
                    cursor = value;
                }
            }
        }
    }
    function extract(input) {
        var result = new Set();
        var last = 0;
        var _iterator3 = _createForOfIteratorHelper(input),
            _step3;
        try {
            for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
                var delta = _step3.value;
                last += delta;
                result.add(last);
            }
        } catch (err) {
            _iterator3.e(err);
        } finally {
            _iterator3.f();
        }
        return result;
    }
    var stressHashesA = extract([11720389, 548, 1024, 1479, 2622, 2867, 1222, 2642, 264, 1328, 137, 123, 397, 65542229, 212447047, 31729170, 8094836, 1056, 21701789, 35520559, 40358, 21819, 28248, 119786, 63892, 31809, 7356, 74383, 72369, 5945, 28902, 90120738, 21187517, 91925642, 3054826, 1600765, 65934, 30948851, 5569212, 4205640, 5412804, 6787095, 9749916, 3940084, 1511466, 1303038, 16090470, 1376628, 49919694, 3827522, 37915959, 14032615, 28701924, 224587434, 637275762, 51079457, 391103676, 24108070, 158999424, 232633267, 6058815, 66599250, 692781441, 816204112, 55209380, 72754, 90006, 80058, 45564, 67845, 42548, 27193, 21401, 139393, 750335, 170896, 4424, 1566, 6264, 154969, 17292, 17229, 175112, 83011, 117872, 4183, 13065, 108972, 108088, 343663, 66210, 334, 17090, 380271, 283272, 59007, 35796, 230801, 1067156, 19992, 157124, 12433, 252644, 2626, 23776, 630482, 531296, 304718, 90891, 726, 23116, 47653, 30493, 167310, 50156, 123071, 477118, 241821, 55660, 908992, 534269, 205157, 11218, 2490, 660, 66391, 46856, 847526, 68710, 8450, 36630, 15642, 109864, 41716, 354482, 79820, 51876, 97325, 5506, 46436, 191803, 3957, 40876, 126323, 2347821, 338490, 73216, 475569, 87602, 29642, 4220, 10760, 16896, 50156, 17424, 35178, 167244, 126786, 33643, 30488, 65045, 35961, 51453, 55660, 4, 152461, 138332, 1958, 34200, 3709, 61381, 17424, 30158, 80591, 11218, 44099, 260487]);
    var stressHashesB = extract([11720389, 548, 1024, 1060, 4, 5904, 1848, 4404, 330555234, 4691346, 3365076, 1045362, 7414584, 960432, 10564312, 253286, 16178203, 4357, 4355, 11350, 31120, 5248, 40591, 62367, 54057, 50487, 13069, 3664, 39764, 10263, 3002, 5810, 8844, 24551, 4091, 56761, 21785, 30553, 55147139, 15960625, 1933097, 12258067, 16302047, 54210486, 45688435, 1659767, 4813249, 33577763, 2501798, 10056946, 672528, 14209351, 2012340, 1655412, 4652736, 62568, 148698, 21186, 71129124, 260014161, 108045611, 1007583269, 2026464, 22799532, 750068913, 1499532, 1285428194, 74598, 22348, 6599, 132273, 309821, 156816, 397448, 179394, 148036, 100257, 21779, 11218, 36631, 345954, 50442, 104394, 2724, 112115, 30690, 10552, 31377, 11286, 7168, 14612, 51480, 116537, 192258, 163145, 65604, 97951, 1363157, 212810, 431243, 2622, 425588, 275284, 150351, 570568, 244701, 16659, 26136, 130134, 11040, 159389, 728373, 3476, 726, 1290392, 224730, 189158, 11218, 2490, 10750, 21608, 143747, 65974, 664563, 84036, 16283, 17424, 5758, 45080, 33066, 1782, 90658, 37101, 56107, 233163, 14216, 5518, 179264, 2525, 146957, 111342, 80594, 2309, 4217, 25432, 26905, 29980, 518951, 1458289, 523705, 4202, 477865, 149368, 126310, 47828, 212678, 22744, 269176, 179119, 4399, 35997, 69696, 41777, 41, 127336, 4202, 73153, 46372, 114255, 126869, 23630, 11218]);
    var stressBloomAB = new Uint8ClampedArray(256);
    stressHashesA.forEach(function (h) {
        return bloomAdd(stressBloomAB, to11BitHash(h));
    });
    stressHashesB.forEach(function (h) {
        return bloomAdd(stressBloomAB, to11BitHash(h));
    });

    // Stemmer data
    var mobileVowelA = new Set(['бубен', 'бугор', 'ветер', 'вошь', 'вымысел', 'горшок', 'деготь', 'дёготь', 'дятел', 'домысел', 'замысел', 'кашель', 'коготь', 'лапоть', 'лоб', 'локоть', 'ломоть', 'молебен', 'мох', 'ноготь', 'овен', 'пепел', 'пес', 'пёс', 'петушок', 'помысел', 'порошок', 'промысел', 'псалом', 'пушок', 'ров', 'рожь', 'рот', 'сон', 'стебель', 'стишок', 'угол', 'умысел', 'хребет', 'церковь', 'шов', 'ковер', 'овес', 'костер'].map(calculateHash));
    var mobileVowelABloom = new Uint8ClampedArray(256);
    mobileVowelA.forEach(function (h) {
        return bloomAdd(mobileVowelABloom, to11BitHash(h));
    });
    var mobileVowelB = toLetterTree(['овёс', 'ковёр', 'костёр', 'шатер', 'шатёр', 'козел', 'козёл', 'котел', 'котёл', 'орел', 'орёл', 'осел', 'осёл', 'узел', 'уголь', 'чок', 'ешок', 'хол']);
    var en2a2b = ['ясень', 'бюллетень', 'олень', 'тюлень', 'гордень', 'пельмень', 'ячмень'];
    var ok1 = toLetterTree(['лапоток', 'желток', 'нишок', 'ришок', 'ишек']);
    var ok2 = ['поток', 'приток', 'переток', 'проток', 'биоток', 'электроток', 'восток', 'водосток', 'водоток', 'воток', 'знаток'];
    var okExceptions = ['инок', 'исток', 'обморок', 'порок', 'пророк', 'сток', 'урок'];

    // decline1
    var uForm = new Set(('клей,чай,' + 'дом,дух,дым,дымок,газ,год,горошек,' + 'жар,жир,квас,' + 'пар,пыл,род,рост,' + 'сахар,свет,сироп,смех,снег,снежок,сок,сор,спор,срок,соус,спирт,страх,суп,сыр,' + 'табак,творог,толк,торф,туман,' + 'убыток,укроп,уксус,ход,' + 'цемент,чеснок,' + 'шаг,шик,' + 'шиповник,' +
    // про отвар/сироп
    'шоколад,шорох,шум,яд').split(','));
    var uFormBloom = new Uint8ClampedArray(256);
    uForm.forEach(function (w) {
        return bloomAdd(uFormBloom, to11BitHash(calculateHash(w)));
    });
    var ogoEndings = toLetterTree(['ое', 'нький', 'ский', 'ской', 'лстой', 'отой', 'утой', 'евой', 'овой', 'живой']);
    var ogoEndings2 = toLetterTree(['ее', 'ое', 'нький', 'ский', 'ской', 'лстой', 'отой', 'утой']);
    var ogoEndings3 = toLetterTree(['евой', 'овой', 'отой', 'живой']);
    var egoEndings = toLetterTree(['шний', 'жний', 'щий', 'ший', 'жий', 'чий']);
    var egoSoftM = ['божий', 'ажий', 'яжий', 'ужий', 'южий', 'бульдожий', 'кабарожий', 'медвежий', 'носорожий', 'миножий'];
    var egoSoftMTree = toLetterTree(egoSoftM);
    var egoSoftPlural = toLetterTree(egoSoftM.map(function (x) {
        return nInit(x, 2) + 'ьи';
    }));
    var endingsOfAdjectives = toLetterTree(['мой', 'ной', 'дой', 'шой', 'жой', 'рзой', 'осой', 'хой', 'латой', 'витой', 'литой', 'питой', 'житой', 'отой', 'утой', 'ятой', 'лагой', 'рагой', 'огой', 'угой', 'лубой', 'любой', 'илой', 'ылой', 'злой', 'малой', 'овой', 'евой', 'живой', 'ской', 'акой', 'укой', 'нний', 'ский', 'йкий', 'цкий', 'зкий', 'ткий', 'лкий', 'мкий', 'хкий', 'оркий', 'аркий', 'яркий', 'ький', 'ёкий', 'бокий', 'оокий', 'cокий', 'токий', 'ликий', 'дикий', 'укий', 'ыкий', 'який', 'пкий', 'дкий', 'бкий', 'нкий', 'жкий', 'чкий', 'гкий', 'овкий', 'авкий']);
    var isAdjectiveLike = function isAdjectiveLike(lemma, lcWord) {
        return nLast(lcWord, 2) === 'ый' || (lcWord.endsWith('кривой') || endsWithLeaf(lcWord, endingsOfAdjectives)) && vowelCount(lcWord) >= 2;
    };
    var jeEndings = toLetterTree(['ий', 'ие', 'чье', 'тье', 'дье', 'вье', 'бье', 'жалованье', 'енье', 'ружье', 'божье', 'верье', 'мужье']);
    var ojeEngings = toLetterTree(['вое', 'лое', 'мое', 'ное', 'рое', 'тое', 'той', 'ый']);
    var LocativeFormAttribute = Object.freeze({
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
    var LocativeDeclensionType = Object.freeze({
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
    var LocativePreposition = Object.freeze({
        V: 1,
        VO: 2,
        NA: 3
    });

    /**
     * Для внутреннего использования.
     * @param {LocativePreposition} preposition
     * @param {LocativeDeclensionType} declensionType
     * @param {number} attributes - флаги LocativeFormAttribute.
     * @returns {number}
     */
    function encodeLocativeConfig(preposition, declensionType, attributes) {
        var dcCode = declensionType - 1 & 7;
        var prCode = preposition - 1 & 7;
        return attributes << 6 | prCode << 3 | dcCode;
    }
    function extractDeclensionType(locativeConfig) {
        return (locativeConfig & 7) + 1;
    }
    function extractPreposition(locativeConfig) {
        var code = (locativeConfig >> 3 & 7) + 1;
        switch (code) {
            case LocativePreposition.V:
                return "в";
            case LocativePreposition.VO:
                return "во";
            case LocativePreposition.NA:
                return "на";
        }
    }
    function extractAttributes(locativeConfig) {
        return locativeConfig >> 6;
    }
    var locativeDictionary = Object.freeze(makeDefaultLocativeDictionary());
    var API = {
        Case: Case,
        Gender: Gender,
        CASES: CaseValues,
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
         * Пожалуйста, используйте `Lemma.create`
         * или `Lemma.createOrNull` вместо конструктора.
         */
        Lemma: Lemma,
        /**
         * То же, что Lemma.create
         */
        createLemma: function createLemma(o) {
            return Lemma.create(o);
        },
        /**
         * То же, что Lemma.createOrNull
         */
        createLemmaOrNull: function createLemmaOrNull(o) {
            return Lemma.createOrNull(o);
        },
        /**
         * @deprecated since version 2.3.0
         */
        getDeclension: function getDeclension(lemma) {
            return Lemma.create(lemma).getDeclension();
        },
        /**
         * @deprecated since version 2.3.0
         */
        getSchoolDeclension: function getSchoolDeclension(lemma) {
            return Lemma.create(lemma).getSchoolDeclension();
        },
        /**
         * Словарь ударений. В него можно вносить изменения в рантайме,
         * и это будет влиять на поведение экземпляра движка, который
         * владеет этим словарём.
         */
        StressDictionary: function StressDictionary() {
            var _data = new Map();
            var _bloomFilter = Uint8ClampedArray.from(stressBloomAB);
            var _getKey = function _getKey(lemma) {
                // Если убрать информацию о склонении из флагов, находящуюся в старших 16 битах,
                // то останется что-то около девяти бит, которые можно безопасно подвинуть
                // на 32 бита влево, посколькую числа в JS легко держат больше 40 разрядов целых чисел.
                // Но для словаря ударений даже не нужны все флаги.
                // Нас интересует только род, признаки одушевлённости и несклоняемости. Это пять бит.
                return (lemma._flags & 31) * 0x100000000 + lemma._hash;
            };
            var _getYoPosition = function _getYoPosition(lemma) {
                // Я думаю, что могут быть почти полные омонимы с ударной буквой ё на разных слогах.
                // Так что я собираюсь закодировать точную позицию буквы ё в 8 бит.
                return lemma.lower().indexOf('ё') + 1 & 0xFF;
            };

            /**
             * @param {RussianNouns.Lemma|Object} query
             * @returns {array} Список пар: расширенные флаги, значение.
             */
            var _getEntities = function _getEntities(query) {
                var hash = _getKey(query);
                var homonyms = _data.get(hash);
                if (homonyms instanceof Array) {
                    return homonyms;
                } else {
                    return [];
                }
            };
            var _getOne = function _getOne(query) {
                var extraFlags = query._flags & 0xFFE0;

                // Дополнительные флаги должны быть такими же или
                // более общими (содержать меньше признаков - меньше бит).
                var entities = _getEntities(query).filter(function (pair) {
                    return (pair[0] & extraFlags) <= extraFlags;
                });
                var exactYo = entities.filter(function (pair) {
                    return pair[0] >> 16 === _getYoPosition(query);
                });
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
             * @throws {Error} Если некорректный формат значения.
             */
            this.put = function (lemma, settings) {
                var parts = settings.split('-');
                var bad = function bad(part, len) {
                    return part.length !== len || part.split('').some(function (x) {
                        return !'SsbeE'.includes(x);
                    });
                };
                if (parts.length !== 2 || bad(parts[0], 7) || bad(parts[1], 6)) {
                    throw new Error('Bad settings format.');
                }
                var lemmaObject = Lemma.create(lemma);
                var key = _getKey(lemmaObject);
                var homonyms = _data.get(key);
                if (!(homonyms instanceof Array)) {
                    homonyms = [];
                    _data.set(key, homonyms);
                }
                var extendedFlags = lemmaObject._flags & 0xFFFF | _getYoPosition(lemmaObject) << 16;
                var found = homonyms.find(function (ls) {
                    return extendedFlags === ls[0];
                });
                if (found) {
                    found[1] = settings;
                } else {
                    homonyms.push([extendedFlags, settings]);
                }
                bloomAdd(_bloomFilter, to11BitHash(lemmaObject._hash));
            };
            var _toResult = function _toResult(ch) {
                switch (ch) {
                    case 'E':
                        return [true];
                    case 'e':
                        return [true, false];
                    case 'b':
                    case 's':
                        return [false, true];
                    default:
                        return [false];
                }
            };
            this.hasStressedEndingSingular = function (query, grCase) {
                if (inBloom(_bloomFilter, to11BitHash(query._hash))) {
                    var caseIndex = CaseValues.indexOf(grCase);
                    if (caseIndex >= 0) {
                        var v = _getOne(query);
                        if (v) {
                            var singular = v.split('-')[0];
                            return _toResult(singular[caseIndex]);
                        } else if (query.getGender() === Gender.MASCULINE) {
                            if (stressHashesA.has(query._hash)) {
                                return _toResult('SEESEEE'[caseIndex]);
                            } else if (stressHashesB.has(query._hash)) {
                                return _toResult('SEEEEEE'[caseIndex]);
                            }
                        }
                    }
                }
                return []; // вместо undefined
            };
            this.hasStressedEndingPlural = function (query, grCase) {
                if (inBloom(_bloomFilter, to11BitHash(query._hash))) {
                    var caseIndex = CaseValues.indexOf(grCase);
                    if (caseIndex >= 0 && caseIndex < 6) {
                        var v = _getOne(query);
                        if (v) {
                            var plural = v.split('-')[1];
                            return _toResult(plural[caseIndex]);
                        } else if (query.getGender() === Gender.MASCULINE && (stressHashesA.has(query._hash) || query.isAnimate() && stressHashesB.has(query._hash))) {
                            return _toResult('E');
                        }
                    }
                }
                return []; // вместо undefined
            };
        },
        Engine: /*#__PURE__*/function () {
            function Engine() {
                _classCallCheck(this, Engine);
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
            return _createClass(Engine, [{
                key: "decline",
                value: function decline(lemma, grammaticalCase, pluralForm) {
                    var lemmaObject = Lemma.create(lemma);
                    return declineAsList(this, lemmaObject, grammaticalCase, pluralForm);
                }

                /**
                 * @param {RussianNouns.Lemma|Object} lemma
                 * @returns {Array}
                 */
            }, {
                key: "pluralize",
                value: function pluralize(lemma) {
                    var o = Lemma.create(lemma);
                    if (o.isPluraleTantum()) {
                        return [o.text()];
                    } else {
                        return _pluralize(this, o);
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
            }, {
                key: "getLocativeForms",
                value: function getLocativeForms(lemma) {
                    var engine = this;
                    var o = Lemma.create(lemma);
                    var declension = o.getDeclension();
                    if (declension && declension >= 0) {
                        var configs = locativeDictionary.get(toKey(o));
                        if (configs instanceof Array) {
                            return configs.map(function (config) {
                                return new API.LocativeForm(extractPreposition(config), toLocativeSingular(engine, declension, o, extractDeclensionType(config)), extractAttributes(config));
                            });
                        }
                    }
                    return [];
                }
            }]);
        }()
    };
    function makeDefaultStressDictionary() {
        function putAll(dictionary, lemmaPrototype, value, joinedWordList) {
            var list = joinedWordList.split(',');
            var _iterator4 = _createForOfIteratorHelper(list),
                _step4;
            try {
                for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
                    var word = _step4.value;
                    var lemma = Object.assign({}, lemmaPrototype);
                    lemma.text = word;
                    dictionary.put(lemma, value);
                }
            } catch (err) {
                _iterator4.e(err);
            } finally {
                _iterator4.f();
            }
        }
        var d = new API.StressDictionary();
        var m = Object.freeze({
            gender: Gender.MASCULINE
        });
        var ma = Object.freeze({
            gender: Gender.MASCULINE,
            animate: true
        });
        var f = Object.freeze({
            gender: Gender.FEMININE
        });
        var fa = Object.freeze({
            gender: Gender.FEMININE,
            animate: true
        });
        var ca = Object.freeze({
            gender: Gender.COMMON,
            animate: true
        });
        var putM = function putM(settings, word) {
            return putAll(d, m, settings, word);
        };
        putAll(d, m, 'SSSSSSS-SSSSSS', 'брёх,дёрн,идиш,имидж,мед,упрёк');
        putAll(d, {
            pluraleTantum: true
        }, 'SSSSSSS-SSSSSS', 'ножны');
        putAll(d, m, 'SSSSSSS-EEEEEE', 'адрес,век,вечер,город,детдом,поезд,спецсчёт,субсчёт');
        putAll(d, m, 'SSSSSSE-EEEEEE', 'берег,бок,вес,лес,снег,дом,катер,счёт,мёд');
        putAll(d, ma, 'SSSSSSS-SSSSSS', 'балансёр,шофёр');
        putAll(d, m, 'SSSSSSS-bbbbbb', 'вексель,ветер');
        putM('SSSSSSE-ESEEEE', 'глаз');
        putM('SSSSSSE-bEEbEE', 'год');
        putM('SSSSSSb-bbbbbb', 'цех');
        putAll(d, {
            gender: Gender.NEUTER
        }, 'EEEEEEE-SSSSSS', 'тесло,' + 'стекло,автостекло,бронестекло,оргстекло,' + 'пеностекло,смарт-стекло,спецстекло,' + 'бедро,берцо,блесна,чело,стегно,стебло');
        putAll(d, f, 'EEEbEEE-SSESEE', 'щека');
        putAll(d, f, 'EEEEEEE-SSESEE', 'слеза');

        // Почти все слова на ж/ш/ч/ц с ударением на окончание
        // захешированы (см. stressHashes).

        putAll(d, m, 'SbbSbbb-bbbbbb', 'грош,шприц');
        putAll(d, m, 'SssSsss-ssssss', 'кишмиш,' + 'кряж,' +
        // обрубок бревна; гряда холмов
        'слеш,слэш');
        putAll(d, ma, 'Sssssss-ssssss', 'паныч');
        putM('SEESeEE-EEEEEE', 'стеллаж');
        putM('SeeSeee-eeeeee', 'шиномонтаж');
        putAll(d, {
            gender: Gender.NEUTER
        }, 'EEEEEEE-SsESEE', 'плечо');

        // Если основа слова заканчивается на буквы жшчщц,
        // от ударения зависит окончание творительного падежа ед.ч.
        // В остальных словах ударение влияет на окончание в р.п. мн.ч.

        putAll(d, ca, 'EEEEEEE-SSSSSS', 'судья');
        putAll(d, ca, 'EEEEEEE-EEEEEE', 'левша');
        putAll(d, f, 'EEEEEEE-SESSSS', 'семья,макросемья');
        putAll(d, f, 'EEEEEEE-SEESEE', 'вожжа,свеча');
        putAll(d, f, 'EEESEEE-SSSSSS', 'душа');
        putAll(d, fa, 'EEEEEEE-SESESS', 'свинья,овца');
        putAll(d, f, 'EEEEEEE-eEeeee', 'скамья');
        putAll(d, f, 'EEEEEEE-EEEEEE', 'башка,кишка,ладья,лапша,моча,пыльца,статья');
        return d;
    }
    function makeDefaultLocativeDictionary() {
        var map = new Map();
        var m = Object.freeze({
            gender: Gender.MASCULINE
        });
        var mAnimate = Object.freeze({
            gender: Gender.MASCULINE,
            animate: true
        });
        function addConfig(lemmaPrototype, condition, prepositions, ws, dTypes) {
            var words = ws.split(',');

            // Тут если номер, то это LocativeDeclensionType,
            // а если строка, то можно будет, наверно, здесь же предусмотреть
            // особую форму слова, если она не совпадает с предложным падежом.
            // Но пока что это не потребовалось.
            var declensionTypes = dTypes instanceof Array ? dTypes : [LocativeDeclensionType.U_SUFFIX];
            var _iterator5 = _createForOfIteratorHelper(words),
                _step5;
            try {
                for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
                    var word = _step5.value;
                    var lemma = Object.assign({}, lemmaPrototype);
                    lemma.text = word;
                    var lemmaKey = toKey(Lemma.create(lemma));
                    var configArray = map.get(lemmaKey);
                    if (!configArray) {
                        configArray = [];
                        map.set(lemmaKey, configArray);
                    }
                    var _iterator6 = _createForOfIteratorHelper(prepositions),
                        _step6;
                    try {
                        for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
                            var p = _step6.value;
                            var _iterator7 = _createForOfIteratorHelper(declensionTypes),
                                _step7;
                            try {
                                for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
                                    var d = _step7.value;
                                    configArray.push(encodeLocativeConfig(p, d, condition));
                                }
                            } catch (err) {
                                _iterator7.e(err);
                            } finally {
                                _iterator7.f();
                            }
                        }
                    } catch (err) {
                        _iterator6.e(err);
                    } finally {
                        _iterator6.f();
                    }
                }
            } catch (err) {
                _iterator5.e(err);
            } finally {
                _iterator5.f();
            }
        }

        // В. А. Плунгян выделяет у слов мужского рода
        // с особыми формами локатива семь семантических классов:

        var v = Object.freeze([LocativePreposition.V]);
        var vo = Object.freeze([LocativePreposition.VO]);
        var na = Object.freeze([LocativePreposition.NA]);

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
        addConfig(m, LocativeFormAttribute.CONTAINER | LocativeFormAttribute.RELIGIOUS, vo, 'гроб', [LocativeDeclensionType.PREPOSITIONAL]);

        // 2. пространства («в»)
        addConfig(m, LocativeFormAttribute.LOCATION, v, 'ад,бор,лес,порт,аэропорт,рай,сад,детсад,тыл,' + 'низ,' + 'хлев' // по классификации Плунгяна, это вместилище (как и "цех")
        );

        // 3. конфигурации объектов, образующих устойчивые структуры («в»)
        addConfig(m, LocativeFormAttribute.STRUCTURE, v, 'круг,полк,артполк,ряд,род,строй,лад');

        // 4. поверхности («на»)
        addConfig(m, LocativeFormAttribute.SURFACE, na, '' + 'баз,' +
        // скотный двор
        'берег,' + 'бережок,' +
        // (спорно)
        'вал,кон,круг,луг,пол,яр');
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
        addConfig(m, LocativeFormAttribute.OBJECT_WITH_FUNCTIONAL_SURFACE, na, '' + 'повод,' +
        // ремень упряжки (возможно, обстоятельство - метафорическая упряжка, не уверен)
        'бочок,' +
        // лежать на бочку, т.е. лежать боком вниз (почти не употребляется)
        'борт,воз,горб,кол,мост,плот,сук,' + 'х' + String.fromCharCode(1091) + 'й');
        addConfig(m, LocativeFormAttribute.OBJECT_WITH_FUNCTIONAL_SURFACE, na, '' + 'крюк,болт', [LocativeDeclensionType.PREPOSITIONAL, LocativeDeclensionType.U_SUFFIX]);

        // 6. вещества и материалы («в» и «на»)
        var substance_or_resource = ',мёд,мех,пар,пух';
        addConfig(m, LocativeFormAttribute.SUBSTANCE, v, 'дым,жир,мел,пушок' + substance_or_resource);
        addConfig(m, LocativeFormAttribute.RESOURCE, na, 'газ,клей,спирт' + substance_or_resource);

        // 7. ситуации и состояния («в» и «на»)
        addConfig(m, LocativeFormAttribute.CONDITION, v, 'бой,бред,быт,долг,плен,пыл,сок,ход,лад');
        // Тут я имею в виду смысл, употреблённый в текущем предложении.
        // Кое-где пишут, что есть еще употребление "в виду гор" в значении "там, откуда видны горы".
        // Никогда не слышал, чтобы так говорили. Если в эту классификацию это вписывать,
        // я не уверен, EXPOSURE это, CONDITION или что-то третье.
        addConfig(m, LocativeFormAttribute.EXPOSURE, v.concat(na), 'вид');
        addConfig(m, LocativeFormAttribute.EXPOSURE, na, 'слух,счёт,ветер,ветр,свет');
        addConfig(m, LocativeFormAttribute.MOTION, na, 'ход,бег,вес');
        // Пока непонятно, как разграничить "на каждом шагу" и "на первом шаге".
        addConfig(m, LocativeFormAttribute.MOTION | LocativeFormAttribute.WITH_ADJECTIVE, na, 'шаг');
        addConfig(m, LocativeFormAttribute.EVENT, na, 'бал,пир');
        // Может быть "дух" когда-то и значило "исповедь",
        // сейчас это только всех запутает.
        addConfig(m, LocativeFormAttribute.CONDITION, na, 'дух,плав');
        // На полном газу. Не уверен, как это сюда записать. Вроде, устойчивое выражение.
        addConfig(m, LocativeFormAttribute.MOTION | LocativeFormAttribute.WITH_ADJECTIVE, na, 'газ');

        // 1 и 5.
        addConfig(m, LocativeFormAttribute.CONTAINER, v, 'глаз,зоб,нос,шкаф');
        addConfig(m, LocativeFormAttribute.CONTAINER, vo, 'лоб');
        addConfig(m, LocativeFormAttribute.OBJECT_WITH_FUNCTIONAL_SURFACE, na, 'глаз,лоб,нос,шкаф,холм');
        var two_and_five = 'бок,верх,зад,угол';
        addConfig(m, LocativeFormAttribute.LOCATION, v, two_and_five);
        addConfig(m, LocativeFormAttribute.OBJECT_WITH_FUNCTIONAL_SURFACE, na, two_and_five);
        // Есть сомнения, в каких случаях используется форма предложного падежа.
        // Является ли решающим наличие любого определения (в *Красноярском* крае, на *внешнем* крае)
        // или подобные выражения являются исключениями и их нельзя обобщать.
        // Я пока что склоняюсь к первому варианту.
        addConfig(m, LocativeFormAttribute.LOCATION | LocativeFormAttribute.WITHOUT_ADJECTIVE, v, 'край');
        addConfig(m, LocativeFormAttribute.OBJECT_WITH_FUNCTIONAL_SURFACE | LocativeFormAttribute.WITHOUT_ADJECTIVE, na, 'край');

        // 4 и 6
        addConfig(m, LocativeFormAttribute.SURFACE, na, 'лёд,мох,снег');
        addConfig(m, LocativeFormAttribute.SUBSTANCE, vo, 'лёд,лён,мох');
        addConfig(m, LocativeFormAttribute.SUBSTANCE, v, 'снег');

        // А также, у слов женского рода третьего склонения с особыми формами
        // локатива пять семантических классов.
        // Однако, у локатива в словах женского рода третьего склонения отличается
        // от предложного падежа только ударение — смещается на последний слог,
        // на письме они не отличаются.

        return map;
    }
    var reYo = function reYo(s) {
        var index = Math.max(s.toLowerCase().lastIndexOf('е'), s.toLowerCase().lastIndexOf('ё'));
        var r = upperLike('ё', s[index]);
        return s.substring(0, index) + r + s.substring(index + 1);
    };
    var singleEYo = function singleEYo(s) {
        return s.replace(/[^её]/g, '').length === 1;
    };
    function getNounStem0(word, lcWord) {
        var lcLastChar = last(lcWord);
        if (bincludes(vowels | 512, lcLastChar)) {
            // vowels + й
            if (bincludes(vowels, lastOfNInitial(lcWord, 1))) {
                var head = nInit(word, 2);
                if (endsWithLeaf(lcWord, egoSoftMTree)) {
                    return head + upperLike('ь', head);
                }
                return head;
            } else if ('й' !== lcLastChar) {
                return init(word);
            }
        }
        return word;
    }
    function getStemDefault(word, lcWord, lcLastChar) {
        var lcLastInit = lastOfNInitial(lcWord, 1);
        if ('ь' === lcLastInit || 'о' === lcLastChar && bincludes(2504708, lcLastInit)) {
            // влмнстх
            return init(word);
        }
        return getNounStem0(word, lcWord);
    }
    function getStemK(word, lcWord, stressedEnging) {
        if (word.length >= 4 && endsWithAny(lcWord, ['рёк', 'нёк', 'лёк']) && stressedEnging !== false) {
            return nInit(word, 2) + 'ьк';
        } else if (lcWord.endsWith('ёк') && isVowel(lastOfNInitial(word, 2))) {
            return nInit(word, 2) + 'йк';
        }
    }
    function getStemSoftSign(lemma, word, lcWord) {
        if (mobileVowelA.has(lemma._hash) || endsWithLeaf(lcWord, mobileVowelB)) {
            return nInit(word, 3) + lastOfNInitial(word, 1);
        } else if (lcWord.endsWith('ень') && lemma.getGender() === Gender.MASCULINE && !endsWithAny(lcWord, en2a2b)) {
            return nInit(word, 3) + 'н';
        } else {
            return init(word);
        }
    }
    function hasMobileVowel(lemma, lcWord, lcLastBit) {
        // Case 1: кл рс
        // Case 2: бв клмн рст х
        return (199680 & lcLastBit) !== 0 && endsWithLeaf(lcWord, mobileVowelB) && !['новосел', 'новосёл'].includes(lcWord) || (2571270 & lcLastBit) !== 0 && (inBloom(mobileVowelABloom, to11BitHash(lemma._hash)) && mobileVowelA.has(lemma._hash) || lemma.isAnimate() && lcWord.endsWith('посол'));
    }
    function getNounStem(lemma, lcWord, stressedEnging) {
        var word = lemma.text();
        var lcLastChar = last(lcWord);
        var lcLastBit = lcBit(lcLastChar);
        var result;
        if ((vowels | 512 | 1024 | 16 | 8192 | 4 | 1 << 28) & lcLastBit) {
            // vowels + йкднвь
            if ((vowels | 512) & lcLastBit) {
                // vowels + й
                result = getStemDefault(word, lcWord, lcLastChar);
            } else if ('к' === lcLastChar) {
                result = getStemK(word, lcWord, stressedEnging);
            } else if ('ь' === lcLastChar) {
                result = getStemSoftSign(lemma, word, lcWord);
            } else if (['лёд', 'лед', 'лён'].includes(lcWord) || 'лев' === lcWord && lemma.isAnimate()) {
                result = nInit(word, 2) + upperLike('ь', lastOfNInitial(word, 1)) + last(word);
            }
        }
        if (!result) {
            if (hasMobileVowel(lemma, lcWord, lcLastBit)) {
                result = nInit(word, 2) + last(word);
            } else {
                result = word;
            }
        }
        return result;
    }
    function calculateDeclension(lcWord, pluraleTantum, gender, indeclinable) {
        if (pluraleTantum) {
            return -2; // undefined
        }
        if (indeclinable) {
            return -1;
        }
        var t = last(lcWord);
        switch (gender) {
            case Gender.FEMININE:
                return t === "а" || t === "я" ? 2 : isConsonantLc(t) ? -1 : 3;
            case Gender.MASCULINE:
                return t === "а" || t === "я" ? 2 : lcWord === "путь" ? 0 : 1;
            case Gender.NEUTER:
                return ['дитя', 'полудитя'].includes(lcWord) ? 0 : nLast(lcWord, 2) === "мя" ? 3 : 1;
            case Gender.COMMON:
                if (t === 'а' || t === 'я') {
                    return 2;
                } else if (t === 'и') {
                    return -1;
                }
                return 1;
            default:
                return -2;
            // Error
        }
    }
    function tsStem(word, lemma) {
        var head = init(word);
        var lcHead = init(lemma.lower());
        if ('а' === last(lcHead)) {
            return head;
        } else if (endsWithAny(lcHead, ['зне', 'жне', 'гре', 'спе', 'мудре']) || nLast(init(lcHead), 3).split('').every(function (l) {
            return isConsonantNotJ(l);
        }) || lemma.isAName()) {
            return head;
        } else if (nLast(lcHead, 2) === 'ле') {
            var beforeLe = lastOfNInitial(lcHead, 2);
            if (isVowel(beforeLe) || 'л' === beforeLe) {
                return init(head) + 'ь';
            } else {
                return head;
            }
        } else if (isVowel(last(lcHead)) && last(lcHead) !== 'и') {
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
        return endsWithAny(w, ['чек', 'шек']) && w.length >= 6 || endsWithLeaf(w, ok1) || w.endsWith('ок') && !w.endsWith('шок') && !okExceptions.includes(w) && !endsWithAny(w, ok2) && !isVowel(lastOfNInitial(w, 2)) && (isVowel(lastOfNInitial(w, 3)) || endsWithAny(nInit(w, 2), ['ст', 'рт'])) && w.length >= 4;
    }
    var softD1 = function softD1(w) {
        return last(w) === 'ь' && !w.endsWith('господь') || 'её'.includes(last(w)) && !endsWithAny(w, ['це', 'же']);
    };
    function halfSomething(lcWord) {
        if (lcWord.startsWith('пол') && bincludes(2550137089, last(lcWord)) && lcWord[3] !== 'л' && vowelCount(lcWord) >= 2) {
            var subWord = lcWord.substring(3);

            // На случай дефисов.
            var offset = subWord.search(/[а-яё]/);

            // Сюда не должны попадать как минимум
            // мягкий и твердый знаки помимо гласных.

            return offset >= 0 && isConsonantLc(subWord[offset]);
        } else {
            return false;
        }
    }
    function halfSomethingLight(lcWord) {
        return lcWord.endsWith('полночь') || lcWord.startsWith('пол') && bincludes(134217984, last(lcWord)) && vowelCount(lcWord) >= 2;
    }
    function decline0(engine, lemma, grCase) {
        var word = lemma.text();
        var lcWord = lemma.lower();
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
    function fastClone(lemma, newText) {
        var lemmaCopy = new Lemma(lemma);
        lemmaCopy._txt = newText;
        lemmaCopy._lc = newText.toLowerCase();
        lemmaCopy._hash = calculateHash(lemmaCopy.lower());
        // Здесь не обновляется склонение, потому что
        // везде, где я использую эту функцию, я уже знаю,
        // какое склонение получится.
        return Object.freeze(lemmaCopy);
    }
    function decline1Half(engine, lemma, grCase, lcWord) {
        var h = function h() {
            return lcWord !== 'полминуты' ? 'полу' + lemma.text().substring(3) : lemma.text();
        };
        if ('полпути' === lcWord) {
            var lemmaCopy = fastClone(lemma, init(h()) + 'ь');
            return decline0(engine, lemmaCopy, grCase);
        } else if (lcWord.endsWith('зни') || lcWord.endsWith('сти')) {
            var _lemmaCopy = fastClone(lemma, init(h()) + 'ь');
            return decline3(engine, _lemmaCopy, grCase);
        } else {
            var _lemmaCopy2 = fastClone(lemma, init(h()) + (nLast(lcWord, 2) === 'ни' ? 'я' : 'а'));
            return decline2(engine, _lemmaCopy2, grCase);
        }
    }
    var iyWordEndings = toLetterTree(['й', 'ие', 'иё']);
    var eiWord = toLetterTree(['воробей', 'муравей', 'ручей', 'соловей', 'улей']);
    var surnameType1 = toLetterTree(['ов', 'ев', 'ёв', 'ин', 'ын']);
    var surnameType1Plural = new Map();
    surnameType1Plural.set('ы'.charCodeAt(0), surnameType1);

    /**
     * @param {RussianNouns.Engine} engine
     * @param {RussianNouns.Lemma} lemma
     * @param {string} grCase
     * @returns {Array|string}
     */
    function decline1(engine, lemma, grCase) {
        var word = lemma.text();
        var lcWord = lemma.lower();
        var lcLastChar = last(lcWord);
        var gender = lemma.getGender();
        var stressedEnding = engine.sd.hasStressedEndingSingular(lemma, grCase);
        var stem = getNounStem(lemma, lcWord, stressedEnding[0]);
        var head = init(word);
        var half = halfSomething(lcWord);
        if (half) {
            stem = 'полу' + stem.substring(3);
            head = 'полу' + head.substring(3);
        }
        var lcStem = toLowerCaseRu(stem);
        var soft = function soft() {
            return half && lcWord.endsWith('я') || softD1(lcWord);
        };
        var iyWord = endsWithLeaf(lcWord, iyWordEndings);
        var eiStem = function eiStem() {
            if (endsWithLeaf(lcWord, eiWord)) {
                return init(head) + upperLike('ь', last(head));
            } else {
                return head;
            }
        };
        var schWord = function schWord() {
            return 'чщ'.includes(last(lcStem));
        };
        function addUForm(r) {
            if (!lemma.isAnimate() && inBloom(uFormBloom, to11BitHash(lemma._hash)) && uForm.has(lcWord)) {
                if (lcLastChar === 'й') {
                    r.push(init(word) + upperLike('ю', last(word)));
                } else {
                    r = r.concat(eStem(stressedEnding, stem, function (s) {
                        return s + upperLike('у', last(s));
                    }));
                }
            }
            return r;
        }
        switch (grCase) {
            case Case.NOMINATIVE:
                return word;
            case Case.GENITIVE:
                switch (lcLastChar) {
                    case 'и':
                    case 'ы':
                        if (half) {
                            return decline1Half(engine, lemma, grCase, lcWord);
                        }
                        break;
                    case 'й':
                    case 'е':
                        if (iyWord && lemma.isASurname() || isAdjectiveLike(lemma, lcWord) || endsWithLeaf(lcWord, ogoEndings)) {
                            return stem + 'ого';
                        } else if (endsWithLeaf(lcWord, egoEndings) || lcWord.endsWith('ее')) {
                            return stem + 'его';
                        }
                    case 'ё':
                    case 'я':
                    case 'ь':
                        if (iyWord) {
                            var _r = [eiStem() + 'я'];
                            return addUForm(_r);
                        } else if (soft() && !schWord()) {
                            return stem + 'я';
                        }
                        break;
                    case 'ц':
                        return tsStem(word, lemma) + 'ца';
                    case 'к':
                        if (okWord(lcWord)) {
                            return init(head) + 'ка';
                        }
                        break;
                    case 'о':
                        if (endsWithAny(lcWord, ['шко']) && Gender.MASCULINE === gender) {
                            return head + 'и';
                        }
                        break;
                }
                var r;
                if (lemma.isASurname() || lcStem.indexOf('ё') === -1) {
                    r = [stem + 'а'];
                } else {
                    r = eStem(stressedEnding, stem, function (s) {
                        return s + 'а';
                    });
                }
                return addUForm(r);
            case Case.DATIVE:
                switch (lcLastChar) {
                    case 'и':
                    case 'ы':
                        if (half) {
                            return decline1Half(engine, lemma, grCase, lcWord);
                        }
                        break;
                    case 'й':
                    case 'е':
                        if (iyWord && lemma.isASurname() || isAdjectiveLike(lemma, lcWord) || endsWithLeaf(lcWord, ogoEndings)) {
                            return stem + 'ому';
                        } else if (endsWithLeaf(lcWord, egoEndings) || lcWord.endsWith('ее')) {
                            return stem + 'ему';
                        }
                    case 'ё':
                    case 'я':
                    case 'ь':
                        if (iyWord) {
                            return eiStem() + 'ю';
                        } else if (soft() && !schWord()) {
                            return stem + 'ю';
                        }
                        break;
                    case 'ц':
                        return tsStem(word, lemma) + 'цу';
                    case 'к':
                        if (okWord(lcWord)) {
                            return init(head) + 'ку';
                        }
                }
                if (lemma.isASurname() || lcStem.indexOf('ё') === -1) {
                    return stem + 'у';
                }
                return eStem(stressedEnding, stem, function (s) {
                    return s + 'у';
                });
            case Case.ACCUSATIVE:
                if (gender === Gender.NEUTER || 'иы'.includes(lcLastChar) && half) {
                    return word;
                }
                if (lemma.isAnimate()) {
                    return decline1(engine, lemma, Case.GENITIVE);
                }
                return word;
            case Case.INSTRUMENTAL:
                switch (lcLastChar) {
                    case 'и':
                    case 'ы':
                        if (half) {
                            return decline1Half(engine, lemma, grCase, lcWord);
                        }
                        break;
                    case 'й':
                    case 'е':
                    case 'ё':
                    case 'я':
                    case 'ь':
                        if (iyWord && lemma.isASurname() || endsWithLeaf(lcWord, ogoEndings2)) {
                            if (endsWithLeaf(lcWord, ojeEngings)) {
                                return stem + 'ым';
                            } else {
                                return stem + 'им';
                            }
                        } else if (isAdjectiveLike(lemma, lcWord)) {
                            if (lastOfNInitial(lcWord, 1) === 'и' || lcWord.endsWith('хой')) {
                                // TODO добавить прилагательные в testing.html, выяснить, какая тут закономерность
                                return stem + 'им';
                            } else {
                                return stem + 'ым';
                            }
                        } else if (endsWithLeaf(lcWord, ogoEndings3)) {
                            return stem + 'ым';
                        } else if (endsWithLeaf(lcWord, egoEndings)) {
                            return stem + 'им';
                        } else if (iyWord) {
                            return eiStem() + 'ем';
                        } else if (lcWord.endsWith('це')) {
                            return word + 'м';
                        }
                        break;
                    case 'ц':
                        return eStem(stressedEnding, word, function (w, b) {
                            return b ? tsStem(w, lemma) + 'цом' : tsStem(w, lemma) + 'цем';
                        });
                    case 'к':
                        if (okWord(lcWord)) {
                            return init(head) + 'ком';
                        }
                        break;
                    case 'н':
                    case 'в':
                        if (lemma.isASurname() && endsWithLeaf(lcWord, surnameType1)) {
                            return word + 'ым';
                        }
                }
                if (soft() || 'жшчщ'.includes(last(lcStem))) {
                    return eStem(stressedEnding, stem, function (s, b) {
                        return b ? s + 'ом' : s + 'ем';
                    });
                } else if (lemma.isASurname() || lcStem.indexOf('ё') === -1) {
                    return stem + 'ом';
                }
                return eStem(stressedEnding, stem, function (s) {
                    return s + 'ом';
                });
            case Case.LOCATIVE:
                if ('полпути' === lcWord) {
                    return word;
                }
                var locativeConfigs = locativeDictionary.get(toKey(lemma));
                if (locativeConfigs) {
                    var declensionTypes = unique(locativeConfigs.map(function (x) {
                        return extractDeclensionType(x);
                    }));
                    return declensionTypes.map(function (dType) {
                        return toLocativeSingular1(engine, lemma, dType);
                    });
                }
            // Fall through

            case Case.PREPOSITIONAL:
                switch (lcLastChar) {
                    case 'и':
                        if ('полпути' === lcWord) {
                            return word;
                        }
                    case 'ы':
                        if (half) {
                            return decline1Half(engine, lemma, grCase, lcWord);
                        }
                        break;
                    case 'й':
                    case 'е':
                    case 'ё':
                    case 'я':
                    case 'ь':
                        if (iyWord && lemma.isASurname() || isAdjectiveLike(lemma, lcWord) || endsWithLeaf(lcWord, ogoEndings)) {
                            return stem + 'ом';
                        } else if (endsWithLeaf(lcWord, egoEndings) || lcWord.endsWith('ее')) {
                            return stem + 'ем';
                        } else if (endsWithAny(lcWord, ['воробей'])) {
                            var i = init(head);
                            return i + upperLike('ье', last(i));
                        } else if (endsWithLeaf(lcWord, jeEndings) && !endsWithAny(lcWord, ['запястье', 'здоровье', 'изголовье', 'платье'])) {
                            return head + 'и';
                        } else if (lcLastChar === 'й' || 'иё' === nLast(lcWord, 2)) {
                            return eiStem() + 'е';
                        }
                        break;
                    case 'ц':
                        return tsStem(word, lemma) + 'це';
                    case 'к':
                        if (okWord(lcWord)) {
                            return init(head) + 'ке';
                        }
                }
                if (lemma.isASurname() || lcStem.indexOf('ё') === -1) {
                    return stem + 'е';
                }
                return eStem(stressedEnding, stem, function (s) {
                    return s + 'е';
                });
        }
    }
    function decline2(engine, lemma, grCase) {
        var word = lemma.text();
        var lcWord = lemma.lower();
        var stem = getNounStem(lemma, lcWord);
        var lcStem = toLowerCaseRu(stem);
        var head = init(word);
        var lcHead = init(lcWord);
        var soft = function soft() {
            return last(lcWord) === 'я';
        };
        var ayaWord = function ayaWord() {
            return lcWord.endsWith('ая') && !(vowelCount(word) === 2 || isVowel(last(stem)));
        };
        var yayaWord = function yayaWord() {
            return lcWord.endsWith('яя') && !(vowelCount(word) === 2 || isVowel(last(stem)));
        };
        var ayaExceptions = ['жая', 'шая'];
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
                } else if (soft() || bincludes(60818504, last(lcStem)) // soft, sibilant or velar
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
                    return [stem + 'ой', stem + 'ою'];
                } else if (soft() || 'жшчщц'.includes(last(lcStem)) && !engine.sd.hasStressedEndingSingular(lemma, grCase).includes(true)) {
                    if ('и' === last(lcHead)) {
                        return head + 'ей';
                    } else {
                        return [head + 'ей', head + 'ею'];
                    }
                }
                return [head + 'ой', head + 'ою'];
            case Case.PREPOSITIONAL:
            case Case.LOCATIVE:
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
        }
    }
    var specialD3 = {
        'дочь': 'дочерь',
        'мать': 'матерь'
    };
    function decline3(engine, lemma, grCase) {
        var word = lemma.text();
        var lcWord = lemma.lower();
        if (![Case.NOMINATIVE, Case.ACCUSATIVE].includes(grCase)) {
            if (Object.keys(specialD3).includes(lcWord)) {
                var lemmaCopy = fastClone(lemma, specialD3[lcWord]);
                return decline3(engine, lemmaCopy, grCase);
            }
        }
        var stem = getNounStem(lemma, lcWord);
        if (halfSomethingLight(lcWord)) {
            stem = 'полу' + stem.substring(3);
        }
        if (nLast(lcWord, 2) === 'мя') {
            switch (grCase) {
                case Case.NOMINATIVE:
                case Case.ACCUSATIVE:
                    return word;
                case Case.GENITIVE:
                case Case.DATIVE:
                case Case.PREPOSITIONAL:
                case Case.LOCATIVE:
                    return stem + 'ени';
                case Case.INSTRUMENTAL:
                    return stem + 'енем';
            }
        } else {
            switch (grCase) {
                case Case.NOMINATIVE:
                case Case.ACCUSATIVE:
                    return word;
                case Case.GENITIVE:
                case Case.DATIVE:
                case Case.PREPOSITIONAL:
                case Case.LOCATIVE:
                    return stem + 'и';
                case Case.INSTRUMENTAL:
                    if (endsWithAny(lcWord, ['вошь', 'рожь', 'церковь'])) {
                        return word + 'ю';
                    }
                    return stem + 'ью';
            }
        }
    }
    function declineAsList(engine, lemma, grCase, pluralForm) {
        var r = decline(engine, lemma, grCase, pluralForm);
        if (r instanceof Array) {
            return r;
        }
        return [r];
    }
    function decline(engine, lemma, grCase, pluralForm) {
        var word = lemma.text();
        if (lemma.isIndeclinable()) {
            return word;
        }
        if (lemma.isPluraleTantum()) {
            return declinePlural(engine, lemma, grCase, word);
        } else if (pluralForm) {
            return declinePlural(engine, lemma, grCase, pluralForm);
        }
        var declension = lemma.getDeclension();
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
            var word = lemma.text();
            var lcWord = lemma.lower();
            var stem = getNounStem(lemma, lcWord);
            var head = init(word);
            var half = halfSomething(lcWord);
            var soft = half && lcWord.endsWith('я') || softD1(lcWord);
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
    var highPriorityBloomFilter = new Uint8ClampedArray(256);
    var highPriorityExceptions = Object.freeze([[[Gender.MASCULINE, undefined], {
        'болгарин': ['болгары'],
        'господин': ['господа'],
        'дядя': ['дяди', 'дядья'],
        'зуб': ['зубы', 'зубья'],
        // TODO: омонимы, переделать
        'клок': ['клочья', 'клоки'],
        'князь': ['князи', 'князья'],
        'кол': ['колы', 'колья'],
        // TODO: можно разделить на омонимы
        'месяц': ['месяцы'],
        'полдень': ['полдни', 'полудни'],
        'татарин': ['татары'],
        'хозяин': ['хозяева'],
        'цветок': ['цветки', 'цветы'],
        'черт': ['черти'],
        'чёрт': ['черти']
    }], [[Gender.MASCULINE, true], {
        'кондуктор': ['кондуктора', 'кондукторы'],
        'кум': ['кумовья'],
        'муж': ['мужья', 'мужи']
    }], [[Gender.FEMININE, undefined], {
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
    }], [[Gender.NEUTER, undefined], {
        'брюхо': ['брюхи'],
        'колено': ['колена', 'колени', 'коленья'],
        // TODO: можно разделить на омонимы
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
        'полсотни': ['полусотни'],
        'ребро': ['рёбра'],
        'ремесло': ['ремёсла'],
        'седло': ['сёдла'],
        'село': ['сёла']
    }]]);
    var _iterator8 = _createForOfIteratorHelper(highPriorityExceptions),
        _step8;
    try {
        for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
            var rule = _step8.value;
            Object.keys(rule[1]).map(function (word) {
                return bloomAdd(highPriorityBloomFilter, to11BitHash(calculateHash(word)));
            });
        }

        // Слова в первом склонении, которые оканчиваются на -я в мн.ч.,
        // и у них нужно преобразовывать основу особым образом (мягкие знаки и т.п.)
    } catch (err) {
        _iterator8.e(err);
    } finally {
        _iterator8.f();
    }
    var yaD1 = ['зять', 'деверь', 'друг', 'брат', 'собрат', 'стул', 'брус', 'обод', 'полоз', 'струп', 'подмастерье', 'якорь', 'перо', 'шило'];

    // Слова муж.р., которые оканчиваются на -а/-я в мн.ч.
    var aYaWords = new Set(['берег', 'бок', 'борт', 'век', 'вес', 'веер',
    // TODO: Это всё тоже вынести в настройку (в экземпляре движка).
    'вексель',
    // 😰
    'вечер', 'глаз', 'голос', 'город', 'доктор', 'дом', 'детдом', 'егерь', 'жемчуг', 'катер', 'колокол', 'концлагерь', 'корм', 'короб', 'кузов', 'купол', 'лес', 'луг', 'мастер', 'номер', 'пояс', 'провод', 'рог', 'сахар', 'снег', 'сорт', 'стог', 'счет', 'счёт', 'спецсчет', 'спецсчёт', 'субсчет', 'субсчёт', 'терем', 'том',
    // TODO неодушевленное (не имя).
    'холод', 'цвет', 'череп']);

    // То же самое, но мы проверяем их не по точному совпадению, а по концу слова.
    // Например, "чудо-остров", "мультипаспорт" распознаются как "остров", "паспорт".
    var aYaWords2 = toLetterTree(['округ', 'остров', 'отпуск', 'паспорт', 'парус', 'поезд', 'повар', 'погреб', 'рукав', 'цех', 'юнкер']);

    // Мы ступаем на скользкую территорию.
    // В этом массиве слова, которые могут оканчиваться и на -а/-я, и на -и/-ы,
    // и мы считаем окончание -а/-я более распространённым.
    var aYaWords3 = new Set(['адрес', 'договор', 'буфер', 'ворох', 'директор', 'инспектор', 'инструктор', 'корпус',
    // TODO омонимы
    'крейсер', 'орден', 'ордер', 'прожектор', 'пропуск', 'род', 'свитер', 'сервер', 'тенор', 'тон', 'трактор', 'тормоз',
    // TODO наверно, ы только в одушевленной форме
    'ветер', 'верх', 'китель', 'мех', 'хлеб', 'юнкер',
    // 🤕
    'ястреб']);

    // То же самое, только мы считаем окончание -и/-ы более распространённым.
    var aYaWords4 = new Set(['бункер', 'вымпел', 'год', 'образ',
    // Разделить на омонимы?
    'омут', 'токарь', 'тополь', 'шторм', 'штуцер']);
    function _pluralize(engine, lemma) {
        var result = [];
        var word = lemma.text();
        var lcWord = lemma.lower();
        var stressedEnding = engine.sd.hasStressedEndingPlural(lemma, Case.NOMINATIVE);
        Object.freeze(stressedEnding);
        var stem = getNounStem(lemma, lcWord, stressedEnding[0]);
        var lcStem = toLowerCaseRu(stem);
        if (lcWord.endsWith('яя')) {
            result.push(nInit(word, 2) + 'ие');
            return unique(result);
        }
        var yoStem = function yoStem(f) {
            var stressedStem = engine.sd.hasStressedEndingPlural(lemma, Case.NOMINATIVE).map(function (x) {
                return !x;
            });
            if (!stressedStem.length) {
                return [f(stem)];
            }
            return stressedStem.map(function (b) {
                return b ? singleEYo(lcStem) ? f(reYo(stem)) : f(stem) : f(unYo(stem));
            });
        };
        var gender = lemma.getGender();
        var declension = lemma.getDeclension();
        var simpleFirstPart = ('й' === last(lcWord) || isVowel(last(word))) && isVowel(last(init(word))) ? init(word) : stem;
        var softPatronymic = function softPatronymic() {
            return (lcWord.endsWith('евич') || lcWord.endsWith('евна')) && lcWord.indexOf('ье') >= 0;
        };
        function softPatronymicForm2() {
            var part = simpleFirstPart;
            var index = toLowerCaseRu(part).indexOf('ье');
            var r = upperLike('и', part[index]);
            return part.substring(0, index) + r + part.substring(index + 1);
        }
        function yeruOrI() {
            if (bincludes(60818504, last(lcStem)) // sibilant or velar
            || 'яйь'.includes(last(lcWord)) || endsWithAny(lcWord, ['сосед'])) {
                if (softPatronymic()) {
                    result.push(softPatronymicForm2() + 'и');
                    result.push(simpleFirstPart + 'и');
                } else {
                    Array.prototype.push.apply(result, eStem(stressedEnding, simpleFirstPart, function (s) {
                        return s + 'и';
                    }));
                }
            } else if (last(lcWord) === 'ц') {
                result.push(tsStem(word, lemma) + 'цы');
            } else {
                if (softPatronymic()) {
                    result.push(softPatronymicForm2() + 'ы');
                    result.push(simpleFirstPart + 'ы');
                } else {
                    Array.prototype.push.apply(result, eStem(stressedEnding, simpleFirstPart, function (s) {
                        return s + 'ы';
                    }));
                }
            }
        }
        if (inBloom(highPriorityBloomFilter, to11BitHash(lemma._hash))) {
            var _iterator9 = _createForOfIteratorHelper(highPriorityExceptions),
                _step9;
            try {
                for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
                    var _step9$value = _slicedToArray(_step9.value, 2),
                        key = _step9$value[0],
                        genderExceptions = _step9$value[1];
                    var keyGender = key[0];
                    var keyAnimate = key[1];
                    if (gender === keyGender && (keyAnimate == null || keyAnimate === lemma.isAnimate()) && genderExceptions.hasOwnProperty(lcWord)) {
                        var v = genderExceptions[lcWord];
                        var _iterator0 = _createForOfIteratorHelper(v),
                            _step0;
                        try {
                            for (_iterator0.s(); !(_step0 = _iterator0.n()).done;) {
                                var x = _step0.value;
                                result.push(x);
                            }
                        } catch (err) {
                            _iterator0.e(err);
                        } finally {
                            _iterator0.f();
                        }
                        return unique(result);
                    }
                }
            } catch (err) {
                _iterator9.e(err);
            } finally {
                _iterator9.f();
            }
        }
        var softStemD1 = last(lcStem) === 'ь' ? stem : last(lcStem) === 'к' ? init(stem) + 'чь' : last(lcStem) === 'г' ? init(stem) + 'зь' : last(lcWord) === 'й' ? init(word) : endsWithAny(lcWord, ['рь', 'ль']) ? stem : stem + 'ь';
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
                    var ya2 = ['крюк', 'лист', 'лоскут', 'повод', 'прут', 'сук', 'учитель', 'флигель', 'штабель'];
                    var ya3 = ['клин', 'колос', 'ком', 'край', 'соболь'];
                    if ('сын' === lcWord) {
                        result.push('сыновья');
                        yeruOrI();
                    } else if ('человек' === lcWord) {
                        result.push('люди');
                        yeruOrI();
                    } else if (ya2.includes(lcWord) || lcWord === 'соболь' && lemma.isAnimate()) {
                        yeruOrI();
                        result.push(softStemD1 + 'я');
                    } else if (ya3.includes(lcWord)) {
                        result.push(softStemD1 + 'я');
                    } else if (aYaWords.has(lcWord) || endsWithLeaf(lcWord, aYaWords2) || aYaWords3.has(lcWord) || aYaWords4.has(lcWord)) {
                        if (aYaWords4.has(lcWord)) {
                            yeruOrI();
                        }
                        if (softD1(lcWord)) {
                            Array.prototype.push.apply(result, yoStem(function (s) {
                                return s + 'я';
                            }));
                        } else if (stressedEnding.includes(true)) {
                            result.push(unYo(stem) + 'а');
                        } else {
                            result.push(stem + 'а');
                        }
                        if (aYaWords3.has(lcWord)) {
                            yeruOrI();
                        }
                    } else if ((lcWord.endsWith('анин') && lcWord.length > 5 || lcWord.endsWith('янин')) && !lemma.isAName() || ['барин', 'боярин'].includes(lcWord)) {
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
                    } else if ((lcWord.endsWith('ребёнок') || lcWord.endsWith('ребенок')) && !(lcWord.endsWith('жеребёнок') || lcWord.endsWith('жеребенок')) && !(lcWord.endsWith('ястребёнок') || lcWord.endsWith('ястребенок'))) {
                        result.push(nInit(word, 7) + 'дети');
                    } else if ((lcWord.endsWith('ёнок') || lcWord.endsWith('енок')) && lemma.isAnimate()) {
                        result.push(nInit(word, 4) + 'ята');
                    } else if (lcWord.endsWith('ёночек') && lemma.isAnimate()) {
                        result.push(nInit(word, 6) + 'ятки');
                    } else if (lcWord.endsWith('онок') && 'жшч'.includes(lastOfNInitial(lcWord, 4)) && lemma.isAnimate()) {
                        result.push(nInit(word, 4) + 'ата');
                    } else if (okWord(lcWord)) {
                        result.push(nInit(word, 2) + 'ки');
                    } else if (endsWithLeaf(lcWord, egoEndings)) {
                        if (endsWithAny(lcWord, egoSoftM)) {
                            result.push(nInit(word, 2) + 'ьи');
                        } else {
                            result.push(init(word) + 'е');
                        }
                    } else if (isAdjectiveLike(lemma, lcWord)) {
                        if (lcWord.endsWith('ый') || lcWord.endsWith('ий')) {
                            result.push(init(word) + 'е');
                        } else if (lcWord.endsWith('ой') && !endsWithAny(lcWord, ['хой', 'ской'])) {
                            result.push(nInit(word, 2) + 'ые');
                        } else {
                            result.push(nInit(word, 2) + 'ие');
                        }
                    } else if (lcWord.endsWith('его')) {
                        result.push(nInit(word, 3) + 'ие');
                    } else if (['воробей', 'муравей', 'ручей', 'соловей', 'улей', 'жеребей',
                    // — жребий; доля поместья.
                    'ирей',
                    // Довольно бессмысленно в мн. ч.
                    'репей', 'чирей' // Я бы сказал "-еи", но в словарях так.
                    ].includes(lcWord)) {
                        result.push(nInit(word, 2) + 'ьи');
                    } else {
                        yeruOrI();
                    }
                } else if (Gender.NEUTER === gender) {
                    if (endsWithAny(lcWord, ['ко', 'чо']) && !endsWithAny(lcWord, ['войско', 'облако'])) {
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
                        result.push(nInit(word, 2) + 'ия');
                    } else if (endsWithAny(lcWord, ['ье', 'ьё'])) {
                        var w = nInit(word, 2);
                        var softSignOnly = ['безделье', 'варенье', 'воскресенье', 'жалованье',
                        // ИМХО, спорно
                        'запястье', 'застолье', 'затишье', 'здоровье', 'зелье', 'изголовье', 'новоселье', 'одночасье',
                        // Я бы добавил сюда "ожерелье",
                        // хотя форма "ожерелия" в гугле встречается.
                        'печенье', 'платье', 'побережье', 'поголовье', 'подворье', 'подземелье', 'подполье', 'поместье', 'предплечье', 'раздумье', 'сиденье',
                        // место для сидения
                        'средневековье', 'увечье', 'угодье', 'устье'].includes(lcWord);
                        if (last(lcWord) === 'е' && !softSignOnly) {
                            result.push(w + 'ия');
                        }
                        result.push(w + 'ья');
                    } else if (endsWithAny(lcWord, ['дерево', 'звено', 'крыло'])) {
                        result.push(stem + 'ья');
                    } else if (endsWithAny(lcWord, ['ле', 'ре'])) {
                        result.push(stem + 'я');
                    } else if (lcWord.endsWith('судно') && lemma.isATransport()) {
                        result.push(nInit(word, 2) + 'а');
                    } else {
                        Array.prototype.push.apply(result, yoStem(function (s) {
                            return s + 'а';
                        }));
                        if (endsWithAny(lcWord, ['щупальце'])) {
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
                    if ('жхчшщ'.includes(last(lcStem)) || endsWithAny(lcStem, ['вк', 'гк', 'ск', 'цк', 'ньк'])) {
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
    var declinePluralSoftEndings = toLetterTree(['ли', 'си', 'би', 'ви', 'ди', 'ти', 'пи', 'ри', 'ни', 'фи', 'зи', 'ьи', 'ья', 'ия', 'ря', 'ля', 'ая', 'аи', 'ои', 'уи', 'эи', 'ыи', 'яи', 'ёи', 'юи', 'еи', 'ии']);
    var declinePluralEy = ['беготни', 'болтовни', 'будни', 'вожжи', 'возни', 'доли', 'лапши', 'левши', 'люди', 'марли', 'моря', 'мощи', 'ноздри', 'пени', 'пятерни', 'распри', 'родни', 'сакли', 'сени', 'ступни', 'судьи', 'фигни', 'чукчи'];
    var explicitZeroEndingCommonGenderSurnameLike = ['головы', 'громадины', 'детины', 'деревенщины', 'дохлятины', 'дубины', 'ехидины', 'жадины', 'зверины', 'идиотины', 'кислятины', 'молодчины', 'орясины', 'остолопины', 'сиротины', 'скотины', 'старейшины', 'старины', 'старшины', 'уродины'];
    var explicitZeroSurnameLikeTree = toLetterTree(explicitZeroEndingCommonGenderSurnameLike);

    // Очень много исключений. Наверно, это можно как-то отрефакторить.

    // Слова на "а", которые легко склеиваются с другими корнями.
    // Например, "киберлеса", "электропоезда", "аэросуда", "протогорода".
    // При этом, в корпусе если даже и есть другие слова,
    // заканчивающиеся на эти строки, в род. п. они тоже заканчиваются на "ов".
    var explicitOv1 = ['адреса', 'паспорта', 'поезда', 'цеха', 'снега', 'бункера', 'буфера', 'берега', 'вымпела', 'голоса', 'города', 'директора', 'договора', 'доктора', 'жемчуга', 'инспектора', 'инструктора', 'колокола', 'кондуктора', 'короба', 'корпуса', 'крейсера', 'кузова', 'леса', 'мастера', 'номера', 'облачка', 'острова', 'отпуска', 'паруса', 'повара', 'погреба', 'пояса', 'провода', 'прожектора', 'пропуска', 'рукава', 'сахара', 'свитера', 'сервера', 'счета', 'трактора', 'тормоза', 'холода', 'цвета', 'черепа', 'шторма', 'штуцера', 'юнкера', 'ястреба', 'суда', 'корм'];
    var explicitOv1Tree = toLetterTree(explicitOv1);
    var explicitOv = new Set(explicitOv1.concat(['бега', 'беглецы', 'близнецы', 'бойцы', 'бока', 'борта', 'борцы', 'бруствера', 'брюшки', 'веера', 'века', 'венцы', 'верха', 'веса', 'весы', 'вечера', 'вороха', 'глупцы', 'года', 'гонцы', 'дворцы', 'дельцы', 'детдома', 'детдомы', 'дома', 'жеребцы', 'жильцы', 'жрецы', 'затишки', 'зубцы', 'излишки', 'истцы', 'катера', 'концы', 'корма', 'кузнецы', 'купола', 'купцы', 'лишки', 'луга', 'мертвецы', 'меха', 'мудрецы', 'облака', 'образа', 'образцы', 'огурцы', 'округа', 'омута', 'ордена', 'ордера', 'отцы', 'очки', 'певцы', 'песцы', 'пловцы', 'подлецы', 'продавцы', 'птенцы', 'резцы', 'рога', 'рода', 'рубцы', 'самцы', 'свинцы',
    // есть такое слово?
    'сорта', 'соуса', 'спецы', 'стога', 'столбцы', 'стрельцы', 'творцы', 'тельцы', 'тенора', 'терема', 'тома', 'тона', 'торцы', 'хлеба', 'штришки', 'юнцы']));
    var explicitZeroAndOv = new Set(['авары', 'аланы', 'аршины', 'баклажаны', 'буквы', 'гольфы', 'граммы', 'гусары', 'дела', 'кадеты', 'килограммы', 'омы', 'помидоры', 'рентгены', 'ботинки', 'человеки', 'чулки', 'шорты']);
    var explicitOvAndZero = new Set(['гектары', 'рельсы']);
    var ovBloom = new Uint8ClampedArray(256);
    explicitOv.forEach(function (s) {
        return bloomAdd(ovBloom, to11BitFakeHash(s));
    });
    explicitZeroAndOv.forEach(function (s) {
        return bloomAdd(ovBloom, to11BitFakeHash(s));
    });
    explicitOvAndZero.forEach(function (s) {
        return bloomAdd(ovBloom, to11BitFakeHash(s));
    });
    var explicitZeroEnding = new Set(explicitZeroEndingCommonGenderSurnameLike.concat(['абазины', 'авы', 'аввы', 'бедняги', 'бедолаги', 'болгары', 'бродяги', 'брызги', 'брюки', 'брюхи', 'будды', 'бусы', 'валенки', 'веки', 'вельможи', 'верзилы', 'вилы', 'владыки', 'воеводы', 'волосы', 'вояки', 'главы', 'грузины', 'задворки', 'задиры', 'железы',
    // желёз
    'жилы', 'зануды', 'зеваки', 'именины', 'калеки', 'кальсоны', 'каникулы', 'колготки', 'коллеги', 'крохи', 'курицы', 'куры', 'ладоши', 'ламы', 'лыки', 'макароны', 'мужчины', 'нападки', 'нары', 'непоседы', 'носилки', 'ножны', 'папы', 'папаши', 'таты', 'падлы', 'партизаны', 'погоны', 'поминки', 'посиделки', 'похороны', 'предтечи', 'работяги', 'разы', 'ребятки', 'румыны', 'самоубийцы', 'санки', 'убийцы', 'сапоги', 'сатаны', 'сироты', 'сливки', 'слуги', 'солдаты', 'старосты', 'сумерки', 'сутки', 'татары', 'телеса', 'хитрюги', 'четвереньки', 'шляпы', 'шмотки', 'яблоки',
    // См. код функции genitiveStem.
    'дядьки', 'дяденьки', 'зайки', 'кроссовки', 'малютки', 'малолетки', 'попки', 'турки', 'узы', 'хлопоты', 'шахматы']));
    var zeroBloom = new Uint8ClampedArray(256);
    explicitZeroEnding.forEach(function (s) {
        return bloomAdd(zeroBloom, to11BitFakeHash(s));
    });
    var declinePluralFlatEndings = ['х', 'ых', 'их', 'м', 'ым', 'им', 'х', 'ых', 'их', 'ми', 'ыми', 'ими', 'х', 'ых', 'их'];
    var declinePluralEndings2 = ['ям', 'ам', '', '', 'ями', 'ами', 'ях', 'ах'];
    var dnaVtsa = toLetterTree(['вна', 'вца', 'вцы', 'пла', 'дца', 'дра', 'судна', 'рки', 'рцы', 'тлы', 'рна', 'тна', 'енца', 'десны', 'дёсны', 'рёбра', 'ребра', 'сосны']);
    var borschee = toLetterTree(['жи', 'ши', 'чи', 'ля', 'ли', 'чи', 'ри', 'ти', 'ди', 'сани', 'борщи', 'клещи', 'товарищи', 'плащи', 'прыщи', 'хрящи']);
    var bratja = toLetterTree(['братья', 'брусья', 'деревья', 'донья', 'звенья', 'клинья', 'клочья', 'коленья', 'колосья', 'колья', 'комья', 'крылья', 'крючья', 'листья', 'лоскутья', 'лохмотья', 'перья', 'платья', 'поводья', 'прутья', 'стулья', 'сучья', 'хлопья', 'шилья']);
    var mascSimilarToCommon = toLetterTree(['ишки', 'дружки', 'тки', 'папочки', 'дедушки', 'дядюшки', 'батюшки', 'катанки', 'петрушки', 'шестерки']);
    var kiWords = toLetterTree(['жки', 'шки', 'чки', 'рки', 'натки', 'хатки', 'ятки', 'етки', 'чётки', 'мки', 'нки', 'педки', 'илки']);
    var kiExceptions = toLetterTree(['шок', 'щок', 'жок', 'зок', 'аток', 'яток', 'еток']);

    // малышки
    // рожки
    // листья
    // молодцы

    function declinePlural(engine, lemma, grCase, plural) {
        var lcPlural = toLowerCaseRu(plural);
        var lcLastChar = last(lcPlural);
        var lcLastBit = lcBit(lcLastChar);
        var grCaseNumber = CaseValues.indexOf(grCase) + 1;
        if (grCaseNumber === 1 || grCaseNumber === 4 && !lemma.isAnimate()) {
            return plural;
        } else if (134217984 & lcLastBit) {
            if (grCaseNumber === 2 || grCaseNumber === 4) {
                if (endsWithAny(lcPlural, ['овичи', 'евичи'])) {
                    return init(plural) + 'ей';
                } else if (endsWithAny(lcPlural, ['вны', 'полусотни']) && lcPlural !== 'овны') {
                    return nInit(plural, 2) + 'ен';
                }
            } else if (grCaseNumber === 5) {
                if (endsWithAny(lcPlural, ['дети', 'люди']) && !endsWithAny(lcPlural, ['нелюди'])) {
                    return init(plural) + 'ьми';
                } else if (endsWithAny(lcPlural, ['вери', 'дочери'])) {
                    return [init(plural) + 'ями', init(plural) + 'ьми'];
                }
            }
        }
        var gender = lemma.getGender();
        var stem = lcPlural.endsWith('цы') ? init(plural) : getNounStem0(plural, lcPlural);
        var isSurnameType1 = endsWithLeaf(lcPlural, surnameType1Plural) && (lemma.isASurname() || gender === Gender.COMMON) && !endsWithLeaf(lcPlural, explicitZeroSurnameLikeTree);

        // Из-за ветвления вверху функции, здесь grCaseNumber >= 2.
        // Через Math.min локатив приравниваем к предложному падежу.
        var itemsPerCase = 3;
        var flatEndingIndex = itemsPerCase * Math.min(Math.round(declinePluralFlatEndings.length / itemsPerCase - 1), grCaseNumber - 2);
        if (isSurnameType1 || lcPlural.endsWith('ничьи')) {
            return plural + declinePluralFlatEndings[flatEndingIndex];
        } else if (lcPlural.endsWith('ые')) {
            return nInit(plural, 2) + declinePluralFlatEndings[flatEndingIndex + 1];
        } else if (lcPlural.endsWith('ие') || endsWithLeaf(lcPlural, egoSoftPlural)) {
            return stem + declinePluralFlatEndings[flatEndingIndex + 2];
        } else if (grCaseNumber > 2 && grCaseNumber !== 4) {
            var itemsPerCase2 = 2;
            var flatIndex2 = itemsPerCase2 * Math.min(Math.round(declinePluralEndings2.length / itemsPerCase2 - 1), grCaseNumber - 3);
            if (endsWithLeaf(lcPlural, declinePluralSoftEndings)) {
                return init(plural) + declinePluralEndings2[flatIndex2];
            } else if (engine.sd.hasStressedEndingPlural(lemma, grCase).includes(true)) {
                return unYo(stem) + declinePluralEndings2[flatIndex2 + 1];
            } else {
                return stem + declinePluralEndings2[flatIndex2 + 1];
            }
        } else {
            var declension = lemma.getDeclension();
            var genitiveStem = function genitiveStem() {
                var lcStem = toLowerCaseRu(stem);
                var dependsOnStress = ['жки', 'шки', 'чки', 'ножны'];
                if (endsWithAny(lcStem, ['кн', 'кл', 'дк', 'нк', 'пк', 'зк', 'рк', 'тк', 'вк', 'лк', 'мк']) && !endsWithAny(lcPlural, ['сумерки']) || lcStem === 'зл' || endsWithAny(lcPlural, dependsOnStress) && engine.sd.hasStressedEndingPlural(lemma, grCase).includes(true)) {
                    var end = last(stem);
                    return init(stem) + upperLike('о', end) + end;
                } else if (endsWithLeaf(lcPlural, dnaVtsa) && !lcPlural.endsWith('недра') || endsWithAny(lcPlural, dependsOnStress)) {
                    var _end = lastOfNInitial(plural, 1);
                    return nInit(plural, 2) + upperLike('е', _end) + _end;
                } else if (endsWithAny(lcPlural, ['сестры', 'сёстры', 'серьги'])) {
                    var _end2 = lastOfNInitial(plural, 1);
                    var h = lastOfNInitial(lcPlural, 2) === 'ь' ? unYo(nInit(plural, 3)) : unYo(nInit(plural, 2));
                    return h + upperLike('ё', _end2) + _end2;
                } else if (endsWithAny(lcStem, ['льц', 'сьм', 'деньг', 'ьк', 'йк', 'дьб'])) {
                    var _end3 = last(stem);
                    return nInit(stem, 2) + upperLike('е', _end3) + _end3;
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
            var lastOf2Initial = lastOfNInitial(lcPlural, 2);
            if (Gender.FEMININE !== gender) {
                var pluralHash = to11BitFakeHash(lcPlural);
                var inOvBloom = inBloom(ovBloom, pluralHash);
                if (inOvBloom && explicitOv.has(lcPlural)) {
                    return init(plural) + 'ов';
                } else if (inOvBloom && explicitZeroAndOv.has(lcPlural) && !lemma.isAName()) {
                    return [genitiveStem(), init(plural) + 'ов'];
                } else if (inOvBloom && explicitOvAndZero.has(lcPlural)) {
                    return [init(plural) + 'ов', genitiveStem()];
                } else if (gender === Gender.COMMON && !endsWithAny(lcPlural, declinePluralEy) && !'жшч'.includes(lastOf2Initial) || inBloom(zeroBloom, pluralHash) && explicitZeroEnding.has(lcPlural) || lemma.isAName() && gender === Gender.MASCULINE && lemma.lower().endsWith('а') || lemma.lower() === 'барин') {
                    return genitiveStem();
                }
                switch (lcLastChar) {
                    case 'и':
                    case 'я':
                        if (endsWithLeaf(lcPlural, borschee) || 'щи' === lcPlural || declinePluralEy.includes(lcPlural) || lemma.lower().endsWith('ь') && !endsWithAny(lemma.lower(), ['зять', 'деверь'])) {
                            var s = 'ь' === last(init(lcPlural)) ? nInit(plural, 2) : init(plural);
                            return s + 'ей';
                        }
                        if (lcLastChar === 'и') {
                            if (lcPlural.endsWith('ульи')) {
                                return init(plural) + 'ев';
                            }
                            if (lcPlural.endsWith('ьи')) {
                                if (Gender.MASCULINE === gender) {
                                    return init(plural) + 'ёв';
                                } else {
                                    return nInit(plural, 2) + 'ей';
                                }
                            } else if (['ча', 'кле', 'холу', 'ху'].includes(init(lcPlural))) {
                                return init(plural) + 'ёв';
                            } else if (lcPlural.endsWith('ищи')) {
                                return genitiveStem();
                            } else if (lcPlural.endsWith('мессии')) {
                                return init(plural) + 'й';
                            } else if (isVowel(lastOfNInitial(lcPlural, 1))) {
                                return init(plural) + 'ев';
                            } else if (endsWithLeaf(lcPlural, kiWords) && (Gender.MASCULINE !== gender || endsWithLeaf(unYo(lcPlural), mascSimilarToCommon)) && !endsWithLeaf(lemma.lower(), kiExceptions)) {
                                return genitiveStem();
                            }
                            return init(plural) + 'ов';
                        } else {
                            if (endsWithLeaf(lcPlural, bratja)) {
                                return init(plural) + 'ев';
                            } else if (endsWithAny(lcPlural, ['зятья', 'кумовья', 'деверья', 'края', 'острия'])) {
                                return init(plural) + 'ёв';
                            } else if (endsWithAny(lcPlural, ['ья', 'ия'])) {
                                if (Gender.MASCULINE === gender) {
                                    return nInit(plural, 2) + 'ей';
                                } else {
                                    return nInit(plural, 2) + 'ий';
                                }
                            }
                        }
                        break;
                    case 'а':
                        if (endsWithAny(lcPlural, ['семена', 'стремена'])) {
                            return nInit(plural, 3) + 'ян';
                        } else if (lcPlural.endsWith('мена')) {
                            return nInit(plural, 3) + 'ён';
                        } else if (lemma.lower().endsWith('яйцо')) {
                            return upperLike('яиц', init(plural));
                        } else if (lcPlural.endsWith('нца')) {
                            return [genitiveStem(), init(plural) + 'ев'];
                        } else if (!endsWithLeaf(lcPlural, explicitOv1Tree)) {
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
                return nInit(plural, 3) + 'ек';
            } else if (lcPlural.endsWith('ки')) {
                if (lastOf2Initial === 'ь') {
                    var end = last(init(plural));
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
                } else if (lcPlural === 'сотни') {
                    return [nInit(plural, 2), nInit(plural, 2) + 'ен'];
                } else {
                    return nInit(plural, 2) + 'ен';
                }
            }
            if (toLowerCaseRu(stem).endsWith('ийк')) {
                return nInit(stem, 2) + 'ек';
            }
            if (stem.length === lcPlural.length - 1 && endsWithLeaf(lcPlural, declinePluralSoftEndings)) {
                if ('ьй'.includes(toLowerCaseRu(lastOfNInitial(stem, 1))) && !lemma.isAnimate()) {
                    var _end4 = last(stem);
                    return nInit(stem, 2) + upperLike('е', _end4) + _end4;
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
    return Object.freeze(API);
});
