import { GenderValues, Gender } from "./Gender.js";
import { calculateHash } from "./utils/hash.js";
import { bincludes, consonants } from "./utils/alphabet.js";
import { last, takeLast } from "./utils/strings.js";

/**
 * Нормальная форма слова.
 * Объекты этого класса содержат также грамматическую и семантическую информацию,
 * позволяющую выбирать стратегии словоизменения и различать омонимы.
 *
 * Пожалуйста, используйте `Lemma.create`
 * или `Lemma.createOrNull` вместо конструктора.
 */
export class Lemma {

    /**
     * Пожалуйста, используйте статические методы create
     * и createOrNull вместо конструктора.
     */
    constructor(o) {
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

            this._flags |= (1 << 3) * (o.indeclinable&1);
            this._flags |= (1 << 4) * (o.animate&1);
            this._flags |= (1 << 5) * (o.surname&1);
            this._flags |= (1 << 6) * (o.name&1);
            this._flags |= (1 << 7) * (o.transport&1);

            this._flags |= (1 << 16) * (
                2 + calculateDeclension(this._lc, o.pluraleTantum, o.gender, o.indeclinable)
            );
        }
    }

    /**
     * Если параметр — уже лемма, вернет тот же объект, а не копию.
     *
     * @param {RussianNouns.Lemma|Object} o
     * @throws {Error} Ошибки из конструктора леммы.
     * @returns {RussianNouns.Lemma}
     */
    static create(o) {
        if (o instanceof this) {
            return o;
        }

        const err = validateCreateLemma(o);
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
    static createOrNull(options) {
        return (null === validateCreateLemma(options)) ?
                Object.freeze(new this(options)) :
                null;
    }

    equals(o) {
        return (o instanceof Lemma)
            && (this._flags === o._flags)
            && (this.lower() === o.lower());
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
    getDeclension() {
        return (this._flags >> 16) - 2;
    }

    /**
     * Возвращает «школьный» вариант склонения:
     * «вода» — первое склонение; «стол», «окно» — второе склонение.
     */
    getSchoolDeclension() {
        const d = this.getDeclension();

        if (d === 1) {
            return 2;
        } else if (d === 2) {
            return 1;
        } else {
            return d;
        }
    }
}


export function fastClone(lemma, newText) {
    const lemmaCopy = new Lemma(lemma);
    lemmaCopy._txt = newText;
    lemmaCopy._lc = newText.toLowerCase();
    lemmaCopy._hash = calculateHash(lemmaCopy.lower());
    // Здесь не обновляется склонение, потому что
    // везде, где я использую эту функцию, я уже знаю,
    // какое склонение получится.
    return Object.freeze(lemmaCopy);
}


/**
 * @param o A plain old JavaScript object.
 * @returns {string|null} Описание ошибки на английском или null.
 */
function validateCreateLemma(o) {
    if (null == o) {
        return 'No parameters specified.';
    }

    for (let fieldName of [
        'pluraleTantum',
        'indeclinable', 'animate',
        'surname', 'name', 'transport'
    ]) {
        const check = x => (null != x) && (typeof x != 'boolean');
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


function calculateDeclension(lcWord, pluraleTantum, gender, indeclinable) {
    if (pluraleTantum) {
        return -2; // undefined
    }

    if (indeclinable) {
        return -1;
    }

    const t = last(lcWord);
    switch (gender) {
        case Gender.FEMININE:
            return t === "а" || t === "я" ? 2 :
                bincludes(consonants, t) ? -1 : 3;

        case Gender.MASCULINE:
            return t === "а" || t === "я" ? 2 :
                lcWord === "путь" ? 0 : 1;

        case Gender.NEUTER:
            return ['дитя', 'полудитя'].includes(lcWord) ? 0 :
                takeLast(lcWord, 2) === "мя" ? 3 : 1;

        case Gender.COMMON:
            if (t === 'а' || t === 'я') {
                return 2;
            } else if (t === 'и') {
                return -1;
            }
            return 1;

        default:
            return -2; // Error
    }
}


export function createLemma(o) {
    return Lemma.create(o);
}

export function createLemmaOrNull(o) {
    return Lemma.createOrNull(o);
}
