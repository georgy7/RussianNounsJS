import { Case } from "../Case.js";
import { getNounStem } from "./common.js";
import { toLowerCaseRu, init, last, nLast, bincludes, vowels, endsWithAny } from "../utils/strings.js";

export function decline2(engine, lemma, grCase) {
    const word = lemma.text();
    const lcWord = lemma.lower();

    const stem = getNounStem(lemma, lcWord);
    const lcStem = toLowerCaseRu(stem);

    const head = init(word);
    const lcHead = init(lcWord);

    const soft = () => {
        return last(lcWord) === 'я';
    };
    const ayaWord = () => {
        return lcWord.endsWith('ая') && !((vowelCount(word) === 2) || bincludes(vowels, last(lcStem)));
    };
    const yayaWord = () => {
        return lcWord.endsWith('яя') && !((vowelCount(word) === 2) || bincludes(vowels, last(lcStem)));
    };
    const ayaExceptions = [
        'жая', 'шая'
    ];
    switch (grCase) {
        case Case.NOMINATIVE:
            return word;

        case Case.GENITIVE:
            if (yayaWord() || endsWithAny(lcWord, ayaExceptions)) {
                return stem + 'ей';
            } else if (ayaWord()) {
                return stem + 'ой';
            } else if (lemma.isASurname() && !lcWord.endsWith('да')) {
                return head + 'ой';
            } else if (lcWord.endsWith('ничья')) {
                return head + 'ей';
            } else if (
                soft() || bincludes(0b11101000000000010001001000, last(lcStem))  // soft, sibilant or velar
            ) {
                return head + 'и';
            }
            return head + 'ы';

        case Case.DATIVE:
            if (yayaWord() || endsWithAny(lcWord, ayaExceptions)) {
                return stem + 'ей';
            } else if (ayaWord()) {
                return stem + 'ой';
            } else if (lemma.isASurname() && !lcWord.endsWith('да')) {
                return head + 'ой';
            } else if (nLast(lcWord, 2) === 'ия') {
                return head + 'и';
            } else if (lcWord.endsWith('ничья')) {
                return head + 'ей';
            }
            return head + 'е';

        case Case.ACCUSATIVE:
            if (ayaWord()) {
                return stem + 'ую';
            } else if (yayaWord()) {
                return stem + 'юю';
            } else if (soft()) {
                return head + 'ю';
            }
            return head + 'у';

        case Case.INSTRUMENTAL:
            if (yayaWord() || endsWithAny(lcWord, ayaExceptions)) {
                return stem + 'ею';
            } else if (ayaWord()) {
                return [stem + 'ой', stem + 'ою'];
            } else if (soft() ||
                    ('жшчщц'.includes(last(lcStem)) &&
                        !(engine.sd.hasStressedEndingSingular(lemma, grCase).includes(true)))) {
                if ('и' === last(lcHead)) {
                    return head + 'ей';
                } else {
                    return [head + 'ей', head + 'ею'];
                }
            }
            return [head + 'ой', head + 'ою'];

        case Case.PREPOSITIONAL:
        case Case.LOCATIVE:
            if (yayaWord() || endsWithAny(lcWord, ayaExceptions)) {
                return stem + 'ей';
            } else if (ayaWord()) {
                return stem + 'ой';
            } else if (lemma.isASurname() && !lcWord.endsWith('да')) {
                return head + 'ой';
            } else if (nLast(lcWord, 2) === 'ия') {
                return head + 'и';
            } else if (lcWord.endsWith('ничья')) {
                return head + 'ей';
            }
            return head + 'е';
    }
}

