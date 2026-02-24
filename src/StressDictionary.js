import { stressHashesA, stressHashesB } from "./settings/stressHashes.js";
import { BloomFilter } from "./utils/bloom.js";
import { Lemma, getIntGender } from "./Lemma.js";
import { toCaseIndex } from "./Case.js";
import { FEM, MASC, NEU, COM } from "./Gender.js";

const stressBloomAB = (function () {
    const hashes = new BloomFilter();
    stressHashesA.forEach(h => hashes.addInteger(h));
    stressHashesB.forEach(h => hashes.addInteger(h));
    return Object.freeze(hashes);
})();

/**
 * Словарь ударений. В него можно вносить изменения в рантайме,
 * и это будет влиять на поведение экземпляра движка, который
 * владеет этим словарём.
 */
export function StressDictionary() {

    const _data = new Map();
    const _bloomFilter = stressBloomAB.clone();

    const _getKey = function (lemma) {
        // Если убрать информацию о склонении из флагов, находящуюся в старших 16 битах,
        // то останется что-то около девяти бит, которые можно безопасно подвинуть
        // на 32 бита влево, посколькую числа в JS легко держат больше 40 разрядов целых чисел.
        // Но для словаря ударений даже не нужны все флаги.
        // Нас интересует только род, признаки одушевлённости и несклоняемости. Это пять бит.
        return ((lemma._flags & 0b11111) * 0x100000000) + lemma._hash;
    };

    const _getYoPosition = function (lemma) {
        // Я думаю, что могут быть почти полные омонимы с ударной буквой ё на разных слогах.
        // Так что я собираюсь закодировать точную позицию буквы ё в 8 бит.
        return (lemma.lower().indexOf('ё') + 1) & 0xFF;
    };

    /**
     * @param {RussianNouns.Lemma|Object} query
     * @returns {array} Список пар: расширенные флаги, значение.
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
        const extraFlags = query._flags & 0xFFE0;

        // Дополнительные флаги должны быть такими же или
        // более общими (содержать меньше признаков - меньше бит).
        const entities = _getEntities(query)
            .filter(pair =>
                ((pair[0] & extraFlags) <= extraFlags));

        const exactYo = entities.filter(pair => (pair[0] >> 16) === _getYoPosition(query));

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
        const parts = settings.split('-');
        const bad = (part, len) => part.length !== len ||
            part.split('').some(x => !'SsbeE'.includes(x));

        if (parts.length !== 2 || bad(parts[0], 7) || bad(parts[1], 6)) {
            throw new Error('Bad settings format.');
        }

        const lemmaObject = Lemma.create(lemma);
        const key = _getKey(lemmaObject);

        let homonyms = _data.get(key);

        if (!(homonyms instanceof Array)) {
            homonyms = [];
            _data.set(key, homonyms);
        }

        const extendedFlags = (lemmaObject._flags & 0xFFFF) | (_getYoPosition(lemmaObject) << 16);
        const found = homonyms.find(ls => extendedFlags === ls[0]);

        if (found) {
            found[1] = settings;
        } else {
            homonyms.push([extendedFlags, settings]);
        }

        _bloomFilter.addInteger(lemmaObject._hash);
    };

    const _toResult = ch => {
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
        if (_bloomFilter.hasInteger(query._hash)) {

            const caseIndex = toCaseIndex(grCase);

            if (caseIndex >= 0) {
                let v = _getOne(query);

                if (v) {
                    const singular = v.split('-')[0];
                    return _toResult(singular[caseIndex]);
                } else if (getIntGender(query) === MASC) {
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
        if (_bloomFilter.hasInteger(query._hash)) {

            const caseIndex = toCaseIndex(grCase);

            if (caseIndex >= 0 && caseIndex < 6) {
                let v = _getOne(query);

                if (v) {
                    const plural = v.split('-')[1];
                    return _toResult(plural[caseIndex]);
                } else if ((getIntGender(query) === MASC) &&
                        (stressHashesA.has(query._hash) ||
                                (query.isAnimate() && stressHashesB.has(query._hash)))) {
                    return _toResult('E');
                }
            }
        }

        return []; // вместо undefined
    };
}
