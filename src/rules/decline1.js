/**
 * @param {RussianNouns.Engine} engine
 * @param {RussianNouns.Lemma} lemma
 * @param {string} grCase
 * @returns {Array|string}
 */
export function decline1(engine, lemma, grCase) {
    const word = lemma.text();
    const lcWord = lemma.lower();
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

    const iyWord = endsWithLeaf(lcWord, iyWordEndings);

    const eiStem = () => {
        if (endsWithLeaf(lcWord, eiWord)) {
            return init(head) + upperLike('ь', last(head));
        } else {
            return head;
        }
    };

    const schWord = () => 'чщ'.includes(last(lcStem));

    function addUForm(r) {
        if (!lemma.isAnimate() && inBloom(uFormBloom, to11BitHash(lemma._hash)) && uForm.has(lcWord)) {
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
                        || endsWithLeaf(lcWord, ogoEndings)) {
                        return stem + 'ого';
                    } else if (endsWithLeaf(lcWord, egoEndings) || lcWord.endsWith('ее')) {
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
                        || endsWithLeaf(lcWord, ogoEndings)) {
                        return stem + 'ому';
                    } else if (endsWithLeaf(lcWord, egoEndings) || lcWord.endsWith('ее')) {
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
                    ('иы'.includes(lcLastChar) && half)) {
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
                    if ((iyWord && lemma.isASurname()) || endsWithLeaf(lcWord, ogoEndings2)) {
                        if (endsWithLeaf(lcWord, ojeEngings)) {
                            return stem + 'ым';
                        } else {
                            return stem + 'им';
                        }
                    } else if (isAdjectiveLike(lemma, lcWord)) {
                        if ((lastOfNInitial(lcWord, 1) === 'и') || lcWord.endsWith('хой')) {
                            // TODO добавить прилагательные в testing.html, выяснить, какая тут закономерность
                            return stem + 'им';
                        } else {
                            return stem + 'ым';
                        }
                    } else if (endsWithLeaf(lcWord, ogoEndings3)) {
                        return stem + 'ым';
                    } else if (endsWithLeaf(lcWord, egoEndings)) {
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
                    if (lemma.isASurname() && endsWithLeaf(lcWord, surnameType1)) {
                        return word + 'ым';
                    }
            }

            if (soft() || ('жшчщ'.includes(last(lcStem)))) {
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
                        || endsWithLeaf(lcWord, ogoEndings)) {
                        return stem + 'ом';
                    } else if (endsWithLeaf(lcWord, egoEndings) || lcWord.endsWith('ее')) {
                        return stem + 'ем';
                    } else if (endsWithAny(lcWord, ['воробей'])) {
                        const i = init(head);
                        return i + upperLike('ье', last(i));
                    } else if ((endsWithLeaf(lcWord, jeEndings)) &&
                        !endsWithAny(lcWord, [
                        'запястье', 'здоровье', 'изголовье',
                        'платье'
                    ])) {
                        return head + 'и';
                    } else if ((lcLastChar === 'й') || ('иё' === nLast(lcWord, 2))) {
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

function fastClone(lemma, newText) {
    const lemmaCopy = new Lemma(lemma);
    lemmaCopy._txt = newText;
    lemmaCopy._lc = newText.toLowerCase();
    lemmaCopy._hash = calculateHash(lemmaCopy.lower());
    // Здесь не обновляется склонение, потому что
    // везде, где я использую эту функцию, я уже знаю,
    // какое склонение получится.
    return Object.freeze(lemmaCopy);
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
            ((nLast(lcWord, 2) === 'ни') ? 'я' : 'а'));
        return decline2(engine, lemmaCopy, grCase);
    }
}

