import { leftShift } from "./utils/decompress.js";

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
export function LocativeForm(preposition, word, attributes) {
    this.preposition = preposition;
    this.word = word;
    this.attributes = attributes;
}

export const LFA_CONTAINER = 0;
export const LFA_LOCATION = 1;
export const LFA_STRUCTURE = 2;
export const LFA_SURFACE = 3;
export const LFA_WAY = 4;
export const LFA_OBJ_W_SURFACE = 5;
export const LFA_SUBSTANCE = 6;
export const LFA_RESOURCE = 7;
export const LFA_CONDITION = 8;
export const LFA_EXPOSURE = 9;
export const LFA_MOTION = 10;
export const LFA_EVENT = 11;
export const LFA_WITH_ADJECTIVE = 12;
export const LFA_WITHOUT_ADJECTIVE = 13;
export const LFA_RELIGIOUS = 14;

/**
 * Это еще не стабилизированная часть API.
 *
 * Предикаты, по которым можно узнать, уместно ли
 * в данном случае употреблять ту или иную форму локатива.
 * Тут взяты семантические классы (с небольшими изменениями)
 * из публикации «К семантике русского локатива».
 * Затем к ним еще добавлены синтаксические особенности употребления.
 */
export const LocativeFormAttribute = Object.freeze({
    CONTAINER: (1 << LFA_CONTAINER),
    LOCATION: (1 << LFA_LOCATION),
    STRUCTURE: (1 << LFA_STRUCTURE),
    SURFACE: (1 << LFA_SURFACE),

    // Метафорический путь. Луч времени, на (или в) котором лежат события.
    WAY: (1 << LFA_WAY),

    // Объект с функциональной (не обязательно плоской) поверхностью.
    OBJECT_WITH_FUNCTIONAL_SURFACE: (1 << LFA_OBJ_W_SURFACE),

    // Вещество (обволакивающее или покрывающее).
    SUBSTANCE: (1 << LFA_SUBSTANCE),
    // Материал, средство изготовления, приготовления (еды), ремонта.
    RESOURCE: (1 << LFA_RESOURCE),

    // Состояние, свойство, положение дел.
    CONDITION: (1 << LFA_CONDITION),

    // Испытываемое воздействие (стихии или внимания/отношения человека).
    EXPOSURE: leftShift(LFA_EXPOSURE),

    // Перемещение или кратковременное пространственное положение.
    MOTION: leftShift(LFA_MOTION),

    // Мероприятие.
    EVENT: leftShift(LFA_EVENT),

    WITH_ADJECTIVE: leftShift(LFA_WITH_ADJECTIVE),
    WITHOUT_ADJECTIVE: leftShift(LFA_WITHOUT_ADJECTIVE),

    // Я еще не до конца понял этот аспект.
    // Этот флаг наверняка исчезнет в будущих релизах.
    RELIGIOUS: leftShift(LFA_RELIGIOUS)
});

/**
 * Под это число в конфиге будет выделено 3 бита (не более восьми состояний).
 */
export const LocativeDeclensionType = Object.freeze({
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
 * Под это число в конфиге будет выделено 3 бита (не более восьми состояний).
 */
export const LocativePreposition = Object.freeze({
    V: 1,
    VO: 2,
    NA: 3
});

/**
 * @param {LocativePreposition} preposition
 * @param {LocativeDeclensionType} declensionType
 * @param {number} attributes - флаги LocativeFormAttribute.
 * @returns {number}
 */
export function encodeLocativeConfig(preposition, declensionType, attributes) {
    const dcCode = (declensionType - 1) & 0b111;
    const prCode = (preposition - 1) & 0b111;
    return (attributes << 6) | (prCode << 3) | dcCode;
}

export function extractDeclensionType(locativeConfig) {
    return (locativeConfig & 0b111) + 1;
}

export function extractPreposition(locativeConfig) {
    const code = ((locativeConfig >> 3) & 0b111) + 1;
    switch (code) {
        case LocativePreposition.V:
            return "в";
        case LocativePreposition.VO:
            return "во";
        case LocativePreposition.NA:
            return "на";
    }
}

export function extractAttributes(locativeConfig) {
    return locativeConfig >> 6;
}
