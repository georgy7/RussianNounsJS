import { deltaDecodeToSet } from "./utils/decompress.js";
import { BloomFilter } from "./utils/bloom.js";
import { Lemma } from "./Lemma.js";

// Значительную часть слов решил фильтровать по хэшам, чтобы не раздувать
// исходный код и увеличить скорость работы библиотеки.

// Слова вроде "багаж", "кругляш", "свинец"
const stressHashesA = deltaDecodeToSet([
    11720389, 548, 1024, 1479, 2622, 2867, 1222, 2642, 264, 1328, 137, 123, 397,
    65542229, 212447047, 31729170, 8094836, 1056, 21701789, 35520559, 40358, 21819,
    28248, 119786, 63892, 31809, 7356, 74383, 72369, 5945, 28902, 90120738, 21187517,
    91925642, 3054826, 1600765, 65934, 30948851, 5569212, 4205640, 5412804, 6787095,
    9749916, 3940084, 1511466, 1303038, 16090470, 1376628, 49919694, 3827522, 37915959,
    14032615, 28701924, 224587434, 637275762, 51079457, 391103676, 24108070, 158999424,
    232633267, 6058815, 66599250, 692781441, 816204112, 55209380, 72754, 90006, 80058,
    45564, 67845, 42548, 27193, 21401, 139393, 750335, 170896, 4424, 1566, 6264,
    154969, 17292, 17229, 175112, 83011, 117872, 4183, 13065, 108972, 108088, 343663,
    66210, 334, 17090, 380271, 283272, 59007, 35796, 230801, 1067156, 19992, 157124,
    12433, 252644, 2626, 23776, 630482, 531296, 304718, 90891, 726, 23116, 47653,
    30493, 167310, 50156, 123071, 477118, 241821, 55660, 908992, 534269, 205157, 11218,
    2490, 660, 66391, 46856, 847526, 68710, 8450, 36630, 15642, 109864, 41716, 354482,
    79820, 51876, 97325, 5506, 46436, 191803, 3957, 40876, 126323, 2347821, 338490,
    73216, 475569, 87602, 29642, 4220, 10760, 16896, 50156, 17424, 35178, 167244,
    126786, 33643, 30488, 65045, 35961, 51453, 55660, 4, 152461, 138332, 1958, 34200,
    3709, 61381, 17424, 30158, 80591, 11218, 44099, 260487
]);

// Слова вроде "усач", "истец", "малыш" —
// отличаются в винительном падеже
const stressHashesB = deltaDecodeToSet([
    11720389, 548, 1024, 1060, 4, 5904, 1848, 4404, 330555234, 4691346, 3365076,
    1045362, 7414584, 960432, 10564312, 253286, 16178203, 4357, 4355, 11350, 31120,
    5248, 40591, 62367, 54057, 50487, 13069, 3664, 39764, 10263, 3002, 5810, 8844,
    24551, 4091, 56761, 21785, 30553, 55147139, 15960625, 1933097, 12258067, 16302047,
    54210486, 45688435, 1659767, 4813249, 33577763, 2501798, 10056946, 672528,
    14209351, 2012340, 1655412, 4652736, 62568, 148698, 21186, 71129124, 260014161,
    108045611, 1007583269, 2026464, 22799532, 750068913, 1499532, 1285428194, 74598,
    22348, 6599, 132273, 309821, 156816, 397448, 179394, 148036, 100257, 21779, 11218,
    36631, 345954, 50442, 104394, 2724, 112115, 30690, 10552, 31377, 11286, 7168,
    14612, 51480, 116537, 192258, 163145, 65604, 97951, 1363157, 212810, 431243, 2622,
    425588, 275284, 150351, 570568, 244701, 16659, 26136, 130134, 11040, 159389,
    728373, 3476, 726, 1290392, 224730, 189158, 11218, 2490, 10750, 21608, 143747,
    65974, 664563, 84036, 16283, 17424, 5758, 45080, 33066, 1782, 90658, 37101, 56107,
    233163, 14216, 5518, 179264, 2525, 146957, 111342, 80594, 2309, 4217, 25432, 26905,
    29980, 518951, 1458289, 523705, 4202, 477865, 149368, 126310, 47828, 212678, 22744,
    269176, 179119, 4399, 35997, 69696, 41777, 41, 127336, 4202, 73153, 46372, 114255,
    126869, 23630, 11218
]);

const stressBloomAB = new BloomFilter();
stressHashesA.forEach(h => stressBloomAB.addInteger(h));
stressHashesB.forEach(h => stressBloomAB.addInteger(h));


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
    }

    this.hasStressedEndingSingular = function (query, grCase) {
        if (_bloomFilter.hasInteger(query._hash)) {

            const caseIndex = CaseValues.indexOf(grCase);

            if (caseIndex >= 0) {
                let v = _getOne(query);

                if (v) {
                    const singular = v.split('-')[0];
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
        if (_bloomFilter.hasInteger(query._hash)) {

            const caseIndex = CaseValues.indexOf(grCase);

            if (caseIndex >= 0 && caseIndex < 6) {
                let v = _getOne(query);

                if (v) {
                    const plural = v.split('-')[1];
                    return _toResult(plural[caseIndex]);
                } else if ((query.getGender() === Gender.MASCULINE) &&
                        (stressHashesA.has(query._hash) ||
                                (query.isAnimate() && stressHashesB.has(query._hash)))) {
                    return _toResult('E');
                }
            }
        }

        return []; // вместо undefined
    };
}

