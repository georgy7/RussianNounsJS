import { CaseIndices } from "./Case.js";
import { Lemma } from "./Lemma.js";
import { makeDefaultStressDictionary } from "./settings/defaultStressDictionary.js";
import { decline0 } from "./rules/decline0.js";
import { decline1, toLocativeSingular1 } from "./rules/decline1.js";
import { decline2 } from "./rules/decline2.js";
import { decline3 } from "./rules/decline3.js";
import { pluralize } from "./rules/pluralize.js";
import { declinePlural } from "./rules/declinePlural.js";
import { locativeDictionary, toLocativeDictionaryKey } from "./settings/locativeDictionary.js";
import { LocativeForm, extractPreposition, extractDeclensionType, extractAttributes } from "./LocativeForm.js";
import { toLowerCaseRu, capitalizeAll } from './utils/letterCase.js';

export class Engine {

    /**
     * @description Stress dictionary. Can be modified at runtime.
     * @type {Object}
     */
    sd = makeDefaultStressDictionary();

    /**
     *
     * @param {RussianNouns.Lemma|Object} lemma Nominative singular word with metadata.
     * @param {string} grammaticalCase Case.
     * @param {string} pluralForm Plural form.
     * If provided, the result will be in plural.
     * Ignored for plurale tantum.
     * @returns {Array} Array, since there can be secondary genitive and accusative cases. Feminine
     * nouns in instrumental can have either -ей/-ой or -ею/-ою endings.
     * The second prepositional case (locative) is not included in the prepositional.
     */
    decline(lemma, grammaticalCase, pluralForm) {
        const lemmaObject = Lemma.create(lemma);

        const shouldBeCapitalized = pluralForm ?
                (toLowerCaseRu(pluralForm.charAt(0)) !== pluralForm.charAt(0)) :
                (lemmaObject.lower().charCodeAt(0) !== lemmaObject.text().charCodeAt(0));

        return capitalizeAll(
            shouldBeCapitalized,
            declineAsList(this, lemmaObject, grammaticalCase, pluralForm)
        );
    }

    /**
     * @param {RussianNouns.Lemma|Object} lemma
     * @returns {Array}
     */
    pluralize(lemma) {
        const o = Lemma.create(lemma);

        if (o.isPluraleTantum()) {
            return [o.text()];
        } else {
            const capital = o.lower().charCodeAt(0) !== o.text().charCodeAt(0);
            return capitalizeAll(capital, pluralize(this, o));
        }
    }

    /**
     * Experimental feature!
     * Designed for singular only.
     *
     * Returns word forms with conditions for their usage (a mix of
     * semantic classes and some syntactic circumstances).
     *
     * The so-called attributes in LocativeForm objects are conjunctive.
     * That is, for a word form with a preposition to be applicable, all listed
     * predicates (attributes, conditions) must be true.
     * Conversely, if even one predicate is false, this form should not be used.
     * However, even if all are true, that is still not a sufficient condition.
     * There should also be no more specific condition in the resulting list,
     * i.e., one containing all the same predicates plus additional true ones.
     * In that case, the more specific rule overrides the one we are considering.
     *
     * @param {RussianNouns.Lemma|Object} lemma
     * @returns {Array} Array of LocativeForm objects.
     * May be empty if the locative singular matches the prepositional or is meaningless.
     */
    getLocativeForms(lemma) {
        const engine = this;
        const o = Lemma.create(lemma);
        const declension = o.getDeclension();

        if (declension && (declension >= 0)) {
            const configs = locativeDictionary.get(toLocativeDictionaryKey(o));
            if (configs instanceof Array) {
                return configs.map(config => new LocativeForm(
                    extractPreposition(config),
                    toLocativeSingular(engine, declension, o, extractDeclensionType(config)),
                    extractAttributes(config)
                ));
            }
        }

        return [];
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
    const caseIndex = CaseIndices[grCase];
    const declension = lemma.getDeclension();

    if (lemma.isIndeclinable()) {
        return word;
    }

    if (lemma.isPluraleTantum()) {
        return declinePlural(engine, lemma, caseIndex, word);
    } else if (pluralForm) {
        return declinePlural(engine, lemma, caseIndex, pluralForm);
    }

    switch (declension) {
        case -1:
            return word;
        case 0:
            return decline0(engine, lemma, caseIndex);
        case 1:
            return decline1(engine, lemma, caseIndex);
        case 2:
            return decline2(engine, lemma, caseIndex);
        case 3:
            return decline3(engine, lemma, caseIndex);
    }
}

function toLocativeSingular(engine, declension, lemma, declensionType) {
    const PREPOSITIONAL = 5;
    switch (declension) {
        case 0:
            return decline0(engine, lemma, PREPOSITIONAL);
        case 1:
            return toLocativeSingular1(engine, lemma, declensionType);
        case 2:
            return decline2(engine, lemma, PREPOSITIONAL);
        case 3:
            return decline3(engine, lemma, PREPOSITIONAL);
    }
}
