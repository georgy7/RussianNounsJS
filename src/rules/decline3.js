import { Case } from "../Case.js";
import { fastClone } from "../Lemma.js";
import { getNounStem } from "./common.js";
import { last, nLast, bincludes, vowelCount, endsWithAny } from "../utils/strings.js";

export const specialD3 = {
    'дочь': 'дочерь',
    'мать': 'матерь'
};

export function decline3(engine, lemma, grCase) {
    const word = lemma.text();
    const lcWord = lemma.lower();

    if (![Case.NOMINATIVE, Case.ACCUSATIVE].includes(grCase)) {
        if (Object.keys(specialD3).includes(lcWord)) {
            const lemmaCopy = fastClone(lemma, specialD3[lcWord]);
            return decline3(engine, lemmaCopy, grCase);
        }
    }

    let stem = getNounStem(lemma, lcWord);

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

function halfSomethingLight(lcWord) {
    return lcWord.endsWith('полночь') || (lcWord.startsWith('пол')
        && bincludes(0b00001000000000000000000100000000, last(lcWord))
        && (vowelCount(lcWord) >= 2));
}
