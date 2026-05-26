import { leftShift } from "./utils/decompress.js";

/**
 * A word form in the locative case (singular) with a preposition
 * and a list of conditions combined with logical AND.
 * That is, if at least one attribute as a predicate is false,
 * this combination of word form and preposition cannot be used.
 *
 * @param {string} preposition Preposition.
 * @param {string} word Word form.
 * @param {number} attributes Predicates that must all be true.
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
 * This is not yet a stabilized part of the API.
 *
 * Predicates that determine whether a particular locative form
 * is appropriate to use in a given case.
 * The semantic classes here (with minor modifications) are taken
 * from the publication "On the Semantics of the Russian Locative".
 * Syntactic usage features are also added to them.
 */
export const LocativeFormAttribute = Object.freeze({
    CONTAINER: (1 << LFA_CONTAINER),
    LOCATION: (1 << LFA_LOCATION),
    STRUCTURE: (1 << LFA_STRUCTURE),
    SURFACE: (1 << LFA_SURFACE),

    // Metaphorical path. A timeline on (or in) which events lie.
    WAY: (1 << LFA_WAY),

    // An object with a functional (not necessarily flat) surface.
    OBJECT_WITH_FUNCTIONAL_SURFACE: (1 << LFA_OBJ_W_SURFACE),

    // Substance (enveloping or covering).
    SUBSTANCE: (1 << LFA_SUBSTANCE),
    // Material, means of manufacture, cooking (food), repair.
    RESOURCE: (1 << LFA_RESOURCE),

    // State, property, state of affairs.
    CONDITION: (1 << LFA_CONDITION),

    // Experienced impact (of elements or human attention/attitude).
    EXPOSURE: leftShift(LFA_EXPOSURE),

    // Movement or short-term spatial position.
    MOTION: leftShift(LFA_MOTION),

    // Event.
    EVENT: leftShift(LFA_EVENT),

    WITH_ADJECTIVE: leftShift(LFA_WITH_ADJECTIVE),
    WITHOUT_ADJECTIVE: leftShift(LFA_WITHOUT_ADJECTIVE),

    // I haven't fully figured out this aspect yet.
    // This flag will likely disappear in future releases.
    RELIGIOUS: leftShift(LFA_RELIGIOUS)
});

export const LDT_PREP = 1;
export const LDT_U = 2;

/**
 * 3 bits (no more than eight states) are allocated for this number in the config.
 */
export const LocativeDeclensionType = Object.freeze({
    /**
     * For very special cases when the prepositional case form
     * in the locative is an exception to the rule.
     * That is, there are some attributes of the special locative form with a preposition,
     * but if you add a certain attribute or several more,
     * the form should switch back to the regular one.
     */
    PREPOSITIONAL: LDT_PREP,

    // Endings -u/-yu.
    U_SUFFIX: LDT_U
});

/**
 * 3 bits (no more than eight states) are allocated for this number in the config.
 */
export const LocativePreposition = Object.freeze({
    V: 1,
    VO: 2,
    NA: 3
});

/**
 * @param {LocativePreposition} preposition
 * @param {LocativeDeclensionType} declensionType
 * @param {number} attributes - LocativeFormAttribute flags.
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
