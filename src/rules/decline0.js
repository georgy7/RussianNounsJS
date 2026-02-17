export function decline0(engine, lemma, grCase) {
    const word = lemma.text();
    const lcWord = lemma.lower();
    if (lcWord.endsWith('путь')) {
        if (grCase === Case.INSTRUMENTAL) {
            return init(word) + 'ём';
        } else {
            return decline3(engine, lemma, grCase);
        }
    } else if (lcWord.endsWith('дитя')) {
        switch (grCase) {
            case Case.NOMINATIVE:
            case Case.ACCUSATIVE:
                return word;
            case Case.GENITIVE:
            case Case.DATIVE:
            case Case.PREPOSITIONAL:
            case Case.LOCATIVE:
                return word + 'ти';
            case Case.INSTRUMENTAL:
                return [word + 'тей', word + 'тею'];
        }
    } else {
        throw new Error('unsupported');
    }
}
