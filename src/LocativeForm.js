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

