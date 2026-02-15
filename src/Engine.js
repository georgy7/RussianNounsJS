class Engine {

    constructor() {

        /**
         * @description Словарь ударений. Его можно редактировать в рантайме.
         * @type {API.StressDictionary}
         */
        this.sd = makeDefaultStressDictionary();

    }

    /**
     *
     * @param {RussianNouns.Lemma|Object} lemma Слово в именительном падеже с метаинформацией.
     * @param {string} grammaticalCase Падеж.
     * @param {string} pluralForm Форма во множественном числе.
     * Если указана, результат будет тоже во множественном.
     * У plurale tantum игнорируется.
     * @returns {Array} Список, т.к. бывают вторые родительный, винительный падежи. Существительные
     * женского рода в творительном могут иметь как окончания -ей -ой, так и -ею -ою.
     * Второй предложный падеж (местный падеж, локатив) не включен в предложный.
     */
    decline(lemma, grammaticalCase, pluralForm) {
        const lemmaObject = Lemma.create(lemma);
        return declineAsList(this, lemmaObject, grammaticalCase, pluralForm);
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
            return pluralize(this, o);
        }
    }

    /**
     * Экспериментальная возможность!
     * Заточено под ед. число.
     *
     * Возвращает формы слов с условиями их использования (там смешаны
     * семантические классы и некоторые синтаксические обстоятельства).
     *
     * Эти так называемые атрибуты в объектах API.LocativeForm конъюнктивны.
     * Т.е. чтобы форма слова с предлогом могла применяться, должны быть истинными
     * все перечисленные предикаты (атрибуты, условия применения).
     * И напротив, если хотя бы один из предикатов ложен, не следует использовать это выражение.
     * Однако, если они все истинны, это еще недостаточное условие для применения.
     * Еще в полученном списке не должно быть более конкретного условия,
     * т.е. содержащего все те же предикаты с еще дополнительными, тоже истинными.
     * В последнем случае это уточнённое правило переопределит то, которое мы рассматриваем.
     *
     * @param {RussianNouns.Lemma|Object} lemma
     * @returns {Array} Массив объектов типа API.LocativeForm.
     * Может быть пустым, если местный падеж в ед. ч. совпадает с предложным или не имеет смысла.
     */
    getLocativeForms(lemma) {
        const engine = this;
        const o = Lemma.create(lemma);
        const declension = o.getDeclension();

        if (declension && (declension >= 0)) {
            const configs = locativeDictionary.get(toKey(o));
            if (configs instanceof Array) {
                return configs.map(config => new API.LocativeForm(
                    extractPreposition(config),
                    toLocativeSingular(engine, declension, o, extractDeclensionType(config)),
                    extractAttributes(config)
                ));
            }
        }

        return [];
    }
}

