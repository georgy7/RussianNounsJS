import { decline3 } from "./decline3.js";
import { init } from "../utils/strings.js";

const NOM = 0;
const GEN = 1;
const DAT = 2;
const ACC = 3;
const INS = 4;
const PREP = 5;
const LOC = 6;

export function decline0(engine, lemma, caseIndex) {
    const word = lemma.text();
    const lcWord = lemma.lower();
    if (lcWord.endsWith('путь')) {
        if (caseIndex === INS) {
            return init(word) + 'ём';
        } else {
            return decline3(engine, lemma, caseIndex);
        }
    } else if (lcWord.endsWith('дитя')) {
        switch (caseIndex) {
            case NOM:
            case ACC:
                return word;
            case GEN:
            case DAT:
            case PREP:
            case LOC:
                return word + 'ти';
            case INS:
                return [word + 'тей', word + 'тею'];
        }
    } else {
        throw new Error('unsupported');
    }
}
