import { fastClone } from "../Lemma.js";
import { getNounStem } from "./common.js";
import { bincludes, vowelCount } from "../utils/alphabet.js";
import { last, takeLast, endsWithAny } from "../utils/strings.js";

const NOM = 0;
const GEN = 1;
const DAT = 2;
const ACC = 3;
const INS = 4;
const PREP = 5;
const LOC = 6;

export const specialD3 = {
    'дочь': 'дочерь',
    'мать': 'матерь'
};

export function decline3(engine, lemma, caseIndex) {
    const word = lemma.text();
    const lcWord = lemma.lower();

    if (![NOM, ACC].includes(caseIndex)) {
        if (Object.keys(specialD3).includes(lcWord)) {
            const lemmaCopy = fastClone(lemma, specialD3[lcWord]);
            return decline3(engine, lemmaCopy, caseIndex);
        }
    }

    let stem = getNounStem(lemma, lcWord);

    if (halfSomethingLight(lcWord)) {
        stem = 'полу' + stem.substring(3);
    }

    if (takeLast(lcWord, 2) === 'мя') {
        switch (caseIndex) {
            case NOM:
            case ACC:
                return word;
            case GEN:
            case DAT:
            case PREP:
            case LOC:
                return stem + 'ени';
            case INS:
                return stem + 'енем';
        }
    } else {
        switch (caseIndex) {
            case NOM:
            case ACC:
                return word;
            case GEN:
            case DAT:
            case PREP:
            case LOC:
                return stem + 'и';
            case INS:
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
