import { Case } from "../Case.js";
import { Gender } from "../Gender.js";
import { getNounStem, okWord, ogoEndings, ogoEndings2, ogoEndings3, egoEndings, tsStem, eStem } from "./common.js";
import { decline0 } from "./decline0.js";
import { decline2 } from "./decline2.js";
import { decline3 } from "./decline3.js";
import { surnameType1 } from "./names.js";
import { createReversedTrie, endsWithSuffix } from "../utils/trie.js";
import { BloomFilter } from "../utils/bloom.js";
import { calculateHash } from "../utils/hash.js";
import { unique } from "../utils/lists.js";
import { bincludes, consonants, vowelCount } from "../utils/alphabet.js";
import { toLowerCaseRu, upperLike } from "../utils/letterCase.js";
import { init, last, takeLast, charFromEnd, hasChar, endsWithAny, unYo } from "../utils/strings.js";
import { locativeDictionary, toLocativeDictionaryKey } from "../settings/locativeDictionary.js";
import { extractDeclensionType, LocativeDeclensionType } from "../LocativeForm.js";
import { fastClone } from "../Lemma.js";

const uForm = new Set((
    'клей,чай,' +
    'дом,дух,дым,дымок,газ,год,горошек,' +
    'жар,жир,квас,' +
    'пар,пыл,род,рост,' +
    'сахар,свет,сироп,смех,снег,снежок,сок,сор,спор,срок,соус,спирт,страх,суп,сыр,' +
    'табак,творог,толк,торф,туман,' +
    'убыток,укроп,уксус,ход,' +
    'цемент,чеснок,' +
    'шаг,шик,' +
    'шиповник,' + // про отвар/сироп
    'шоколад,шорох,шум,яд'
).split(','));

const uFormBloom = new BloomFilter();
uForm.forEach(w => uFormBloom.addInteger(calculateHash(w)));

const iyWordEndings = createReversedTrie(['й', 'ие', 'иё']);
const eiWord = createReversedTrie(['воробей', 'муравей', 'ручей', 'соловей', 'улей']);

const endingsOfAdjectives = createReversedTrie([
    'мой', 'ной', 'дой', 'шой', 'жой', 'рзой', 'осой', 'хой',
    'латой', 'витой', 'литой', 'питой', 'житой', 'отой', 'утой', 'ятой',
    'лагой', 'рагой', 'огой', 'угой',
    'лубой', 'любой',
    'илой', 'ылой', 'злой', 'малой',
    'овой', 'евой', 'живой', 'ской', 'акой', 'укой',
    'нний',
    'ский', 'йкий', 'цкий', 'зкий', 'ткий', 'лкий', 'мкий', 'хкий',
    'оркий', 'аркий', 'яркий', 'ький', 'ёкий',
    'бокий', 'оокий', 'cокий', 'токий', 'ликий', 'дикий', 'укий', 'ыкий',
    'який', 'пкий', 'дкий', 'бкий', 'нкий', 'жкий', 'чкий', 'гкий', 'овкий', 'авкий'
]);

export function isAdjectiveLike(lemma, lcWord) {
    return (takeLast(lcWord, 2) === 'ый') ||
            ((lcWord.endsWith('кривой') || endsWithSuffix(lcWord, endingsOfAdjectives)) &&
                    vowelCount(lcWord) >= 2);
}

const jeEndings = createReversedTrie([
    'ий', 'ие', 'чье', 'тье', 'дье', 'вье', 'бье',
    'жалованье',
    'енье', 'ружье', 'божье', 'верье', 'мужье']);

const ojeEngings = createReversedTrie([
    'вое', 'лое', 'мое', 'ное', 'рое', 'тое', 'той', 'ый']);

/**
 * @param {RussianNouns.Engine} engine
 * @param {RussianNouns.Lemma} lemma
 * @param {string} grCase
 * @returns {Array|string}
 */
export function decline1(engine, lemma, grCase) {
    const word = lemma.text();
    const lcWord = toLowerCaseRu(word);

    const lcLastChar = last(lcWord);
    const gender = lemma.getGender();

    const stressedEnding = engine.sd.hasStressedEndingSingular(lemma, grCase);

    let stem = getNounStem(lemma, lcWord, stressedEnding[0]);
    let head = init(word);

    const half = halfSomething(lcWord);

    if (half) {
        stem = 'полу' + stem.substring(3);
        head = 'полу' + head.substring(3);
    }

    let lcStem = toLowerCaseRu(stem);

    const soft = () => (half && lcWord.endsWith('я')) || softD1(lcWord);

    const iyWord = endsWithSuffix(lcWord, iyWordEndings);

    const eiStem = () => {
        if (endsWithSuffix(lcWord, eiWord)) {
            return init(head) + upperLike('ь', last(head));
        } else {
            return head;
        }
    };

    const schWord = () => hasChar('чщ', last(lcStem));

    function addUForm(r) {
        if (!lemma.isAnimate() && uFormBloom.hasInteger(lemma._hash) && uForm.has(lcWord)) {
            if (lcLastChar === 'й') {
                r.push(init(word) + upperLike('ю', last(word)));
            } else {
                r = r.concat(eStem(stressedEnding, stem, s => s + upperLike('у', last(s))));
            }
        }
        return r;
    }

    switch (grCase) {
        case Case.NOMINATIVE:
            return word;

        case Case.GENITIVE:
            switch (lcLastChar) {
                case 'и':
                case 'ы':
                    if (half) {
                        return decline1Half(engine, lemma, grCase, lcWord);
                    }
                    break;

                case 'й':
                case 'е':
                    if ((iyWord && lemma.isASurname())
                        || isAdjectiveLike(lemma, lcWord)
                        || endsWithSuffix(lcWord, ogoEndings)) {
                        return stem + 'ого';
                    } else if (endsWithSuffix(lcWord, egoEndings) || lcWord.endsWith('ее')) {
                        return stem + 'его';
                    }
                case 'ё':
                case 'я':
                case 'ь':
                    if (iyWord) {
                        let r = [eiStem() + 'я'];
                        return addUForm(r);
                    } else if (soft() && !schWord()) {
                        return stem + 'я';
                    }
                    break;

                case 'ц':
                    return tsStem(word, lemma) + 'ца';

                case 'к':
                    if (okWord(lcWord)) {
                        return init(head) + 'ка';
                    }
                    break;

                case 'о':
                    if (endsWithAny(lcWord, ['шко']) && (Gender.MASCULINE === gender)) {
                        return head + 'и';
                    }
                    break;
            }

            let r;
            if (lemma.isASurname() || (lcStem.indexOf('ё') === -1)) {
                r = [stem + 'а'];
            } else {
                r = eStem(stressedEnding, stem, s => s + 'а');
            }
            return addUForm(r);

        case Case.DATIVE:
            switch (lcLastChar) {
                case 'и':
                case 'ы':
                    if (half) {
                        return decline1Half(engine, lemma, grCase, lcWord);
                    }
                    break;

                case 'й':
                case 'е':
                    if ((iyWord && lemma.isASurname())
                        || isAdjectiveLike(lemma, lcWord)
                        || endsWithSuffix(lcWord, ogoEndings)) {
                        return stem + 'ому';
                    } else if (endsWithSuffix(lcWord, egoEndings) || lcWord.endsWith('ее')) {
                        return stem + 'ему';
                    }
                case 'ё':
                case 'я':
                case 'ь':
                    if (iyWord) {
                        return eiStem() + 'ю';
                    } else if (soft() && !schWord()) {
                        return stem + 'ю';
                    }
                    break;

                case 'ц':
                    return tsStem(word, lemma) + 'цу';

                case 'к':
                    if (okWord(lcWord)) {
                        return init(head) + 'ку';
                    }
            }

            if (lemma.isASurname() || (lcStem.indexOf('ё') === -1)) {
                return stem + 'у';
            }
            return eStem(stressedEnding, stem, s => s + 'у');

        case Case.ACCUSATIVE:
            if ((gender === Gender.NEUTER) ||
                    (hasChar('иы', lcLastChar) && half)) {
                return word;
            }

            if (lemma.isAnimate()) {
                return decline1(engine, lemma, Case.GENITIVE);
            }
            return word;

        case Case.INSTRUMENTAL:
            switch (lcLastChar) {
                case 'и':
                case 'ы':
                    if (half) {
                        return decline1Half(engine, lemma, grCase, lcWord);
                    }
                    break;
                
                case 'й':
                case 'е':
                case 'ё':
                case 'я':
                case 'ь':
                    if ((iyWord && lemma.isASurname()) || endsWithSuffix(lcWord, ogoEndings2)) {
                        if (endsWithSuffix(lcWord, ojeEngings)) {
                            return stem + 'ым';
                        } else {
                            return stem + 'им';
                        }
                    } else if (isAdjectiveLike(lemma, lcWord)) {
                        if ((charFromEnd(lcWord, 2) === 'и') || lcWord.endsWith('хой')) {
                            // TODO добавить прилагательные в testing.html, выяснить, какая тут закономерность
                            return stem + 'им';
                        } else {
                            return stem + 'ым';
                        }
                    } else if (endsWithSuffix(lcWord, ogoEndings3)) {
                        return stem + 'ым';
                    } else if (endsWithSuffix(lcWord, egoEndings)) {
                        return stem + 'им';
                    } else if (iyWord) {
                        return eiStem() + 'ем';
                    } else if (lcWord.endsWith('це')) {
                        return word + 'м';
                    }
                    break;

                case 'ц':
                    return eStem(stressedEnding, word, (w, b) =>
                        b ? (tsStem(w, lemma) + 'цом') : (tsStem(w, lemma) + 'цем'));

                case 'к':
                    if (okWord(lcWord)) {
                        return init(head) + 'ком';
                    }
                    break;

                case 'н':
                case 'в':
                    if (lemma.isASurname() && endsWithSuffix(lcWord, surnameType1)) {
                        return word + 'ым';
                    }
            }

            if (soft() || hasChar('жшчщ', last(lcStem))) {
                return eStem(stressedEnding, stem, (s, b) =>
                    b ? (s + 'ом') : (s + 'ем'));
            } else if (lemma.isASurname() || (lcStem.indexOf('ё') === -1)) {
                return stem + 'ом';
            }
            return eStem(stressedEnding, stem, s => s + 'ом');

        case Case.LOCATIVE:
            if ('полпути' === lcWord) {
                return word;
            }

            const locativeConfigs = locativeDictionary.get(toLocativeDictionaryKey(lemma));
            if (locativeConfigs) {
                const declensionTypes = unique(locativeConfigs.map(x => extractDeclensionType(x)));
                return declensionTypes.map(dType => toLocativeSingular1(engine, lemma, dType));
            }
            // Fall through

        case Case.PREPOSITIONAL:
            switch (lcLastChar) {
                case 'и':
                    if ('полпути' === lcWord) {
                        return word;
                    }
                case 'ы':
                    if (half) {
                        return decline1Half(engine, lemma, grCase, lcWord);
                    }
                    break;
                
                case 'й':
                case 'е':
                case 'ё':
                case 'я':
                case 'ь':
                    if ((iyWord && lemma.isASurname())
                        || isAdjectiveLike(lemma, lcWord)
                        || endsWithSuffix(lcWord, ogoEndings)) {
                        return stem + 'ом';
                    } else if (endsWithSuffix(lcWord, egoEndings) || lcWord.endsWith('ее')) {
                        return stem + 'ем';
                    } else if (endsWithAny(lcWord, ['воробей'])) {
                        const i = init(head);
                        return i + upperLike('ье', last(i));
                    } else if ((endsWithSuffix(lcWord, jeEndings)) &&
                        !endsWithAny(lcWord, [
                        'запястье', 'здоровье', 'изголовье',
                        'платье'
                    ])) {
                        return head + 'и';
                    } else if ((lcLastChar === 'й') || ('иё' === takeLast(lcWord, 2))) {
                        return eiStem() + 'е';
                    }
                    break;

                case 'ц':
                    return tsStem(word, lemma) + 'це';

                case 'к':
                    if (okWord(lcWord)) {
                        return init(head) + 'ке';
                    }
            }

            if (lemma.isASurname() || (lcStem.indexOf('ё') === -1)) {
                return stem + 'е';
            }
            return eStem(stressedEnding, stem, s => s + 'е');
    }
}

function decline1Half(engine, lemma, grCase, lcWord) {
    const h = () => (lcWord !== 'полминуты') ?
        ('полу' + lemma.text().substring(3)) : lemma.text();

    if ('полпути' === lcWord) {
        let lemmaCopy = fastClone(lemma, init(h()) + 'ь');
        return decline0(engine, lemmaCopy, grCase);
    } else if (lcWord.endsWith('зни') || lcWord.endsWith('сти')) {
        let lemmaCopy = fastClone(lemma, init(h()) + 'ь');
        return decline3(engine, lemmaCopy, grCase);
    } else {
        let lemmaCopy = fastClone(lemma, init(h()) +
            ((takeLast(lcWord, 2) === 'ни') ? 'я' : 'а'));
        return decline2(engine, lemmaCopy, grCase);
    }
}

function halfSomething(lcWord) {
    if (lcWord.startsWith('пол')
        && bincludes(0b10011000000000000000000100000001, last(lcWord))
        && (lcWord[3] !== 'л')
        && (vowelCount(lcWord) >= 2)) {

        let subWord = lcWord.substring(3);

        // На случай дефисов.
        let offset = subWord.search(/[а-яё]/);

        // Сюда не должны попадать как минимум
        // мягкий и твердый знаки помимо гласных.

        return (offset >= 0) && bincludes(consonants, subWord[offset]);

    } else {
        return false;
    }
}

export function toLocativeSingular1(engine, lemma, declensionType) {
    if (LocativeDeclensionType.U_SUFFIX === declensionType) {
        const word = lemma.text();
        const lcWord = lemma.lower();
        let stem = getNounStem(lemma, lcWord);
        let head = init(word);

        const half = halfSomething(lcWord);
        const soft = (half && lcWord.endsWith('я')) || softD1(lcWord);

        if (last(lcWord) === 'й') {
            return unYo(head) + 'ю';
        } else if (soft) {
            return unYo(stem) + 'ю';
        } else if (okWord(lcWord)) {
            return unYo(init(head)) + 'ку';
        } else {
            return unYo(stem) + 'у';
        }
    } else if (LocativeDeclensionType.PREPOSITIONAL === declensionType) {
        return decline1(engine, lemma, Case.PREPOSITIONAL);
    }
}

export function softD1(lcWord) {
    return (last(lcWord) === 'ь' && !lcWord.endsWith('господь'))
            || (hasChar('её', last(lcWord)) && !endsWithAny(lcWord, ['це', 'же']));
}
