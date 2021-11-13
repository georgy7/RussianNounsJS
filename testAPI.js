function assertEquals(a, b, msg) {
    if (a !== b) {
        console.log(`${a} !== ${b}`);

        if (msg) {
            console.log(msg);
        }

        process.exit(1);
    }
}

function assertIsArray(a) {
    if (!(a instanceof Array)) {
        console.log(`${a} is not an array`);
        process.exit(1);
    }
}

function itShouldThrow(exceptionClass, f) {
    let raised = false;
    try {
        f();
    } catch (e) {
        if (e instanceof exceptionClass) {
            raised = true;
        } else {
            throw e;
        }
    }
    assertEquals(raised, true, `It should throw a ${exceptionClass.name}.`);
}

function assertEqualsSingleValue(array, value) {
    assertIsArray(array);
    assertEquals(array.length, 1, [array, value]);
    assertEquals(array[0], value);
}

/**
 * @param results Массив массивов результатов.
 * @param values Массив ожидаемых значений. Разрешено использовать как строки, так и массивы.
 */
function assertAllCases(results, values) {
    assertIsArray(results);
    assertIsArray(values);

    assertEquals(results.length, 7);
    assertEquals(values.length, 7);

    for (let i = 0; i < 7; i++) {
        const result = results[i];
        const value = values[i];

        assertIsArray(result);

        if (typeof value === 'string') {
            assertEqualsSingleValue(result, value);
        } else if (value instanceof Array) {
            assertEquals(result.length, value.length, [result, value]);
            for (let j = 0; j < value.length; j++) {
                assertEquals(result[j], value[j]);
            }
        } else {
            console.log(`${value} is neither an array nor a string.`);
            process.exit(1);
        }
    }
}

const RussianNouns = require('./RussianNouns.js');

(() => {
    const rne = new RussianNouns.Engine();

    let result;

    result = rne.decline({text: 'имя', gender: 'средний'}, 'родительный');
    assertEqualsSingleValue(result, "имени");

    result = rne.decline({text: 'имя', gender: 'средний'}, 'творительный');
    assertEqualsSingleValue(result, "именем");

    console.log('--------------- 1 ----------------');

    const Gender = RussianNouns.Gender;
    const Case = RussianNouns.Case;

    let coat = RussianNouns.createLemma({
        text: 'пальто',
        gender: Gender.NEUTER,
        indeclinable: true
    });

    result = rne.decline(coat, Case.GENITIVE);
    assertEqualsSingleValue(result, "пальто");

    result = RussianNouns.getDeclension(coat);
    assertEquals(result, -1);

    let mountain = RussianNouns.createLemma({
        text: 'гора',
        gender: Gender.FEMININE
    });

    result = RussianNouns.CASES.map(c => {
        return rne.decline(mountain, c);
    });

    assertAllCases(result, ['гора', 'горы', 'горе', 'гору', ['горой', 'горою'], 'горе', 'горе']);

    console.log('--------------- 2 ----------------');

    result = rne.pluralize(mountain);
    assertEqualsSingleValue(result, "горы");
    const pluralMountain = result[0];

    console.log('--------------- 3 ----------------');

    result = RussianNouns.CASES.map(c => {
        return rne.decline(mountain, c, pluralMountain);
    });

    assertAllCases(result, ['горы', 'гор', 'горам', 'горы', 'горами', 'горах', 'горах']);

    console.log('--------------- 4 ----------------');

    assertEquals(RussianNouns.getDeclension(mountain), 2);
    assertEquals(RussianNouns.getSchoolDeclension(mountain), 1);

    console.log('--------------- 5 ----------------');

    let way = RussianNouns.createLemma({
        text: 'путь',
        gender: Gender.MASCULINE
    });

    assertEquals(RussianNouns.getDeclension(way), 0);

    console.log('--------------- 6 ----------------');

    const scissors = RussianNouns.createLemma({
        text: 'ножницы',
        pluraleTantum: true
    });

    result = rne.pluralize(scissors);
    assertIsArray(result);
    assertEqualsSingleValue(result, 'ножницы');

    console.log('--------------- 7 ----------------');

    result = RussianNouns.CASES.map(c => {
        return rne.decline(scissors, c);
    });

    assertAllCases(result, ['ножницы', 'ножниц', 'ножницам', 'ножницы', 'ножницами', 'ножницах', 'ножницах']);

    console.log('--------------- 8 ----------------');

    let cringe = RussianNouns.createLemma({
        text: 'кринж',
        gender: Gender.MASCULINE
    });

    result = rne.decline(cringe, Case.INSTRUMENTAL);
    assertEqualsSingleValue(result, "кринжем");

    rne.sd.put(cringe, 'SEESESE-EEEEEE');
    result = rne.decline(cringe, Case.INSTRUMENTAL);
    assertEqualsSingleValue(result, "кринжом");

    rne.sd.put(cringe, 'SEESbSE-EEEEEE');
    result = rne.decline(cringe, Case.INSTRUMENTAL);
    assertIsArray(result);
    assertEquals(result.length, 2);
    assertEquals(result[0], "кринжем");
    assertEquals(result[1], "кринжом");

    rne.sd.put(cringe, 'SEESsSE-EEEEEE');
    result = rne.decline(cringe, Case.INSTRUMENTAL);
    assertIsArray(result);
    assertEquals(result.length, 2);
    assertEquals(result[0], "кринжем");
    assertEquals(result[1], "кринжом");

    rne.sd.put(cringe, 'SEESeSE-EEEEEE');
    result = rne.decline(cringe, Case.INSTRUMENTAL);
    assertIsArray(result);
    assertEquals(result.length, 2);
    assertEquals(result[0], "кринжом");
    assertEquals(result[1], "кринжем");

    console.log('--------------- 9 ----------------');

    const LocativeFormAttribute = RussianNouns.LocativeFormAttribute;

    (() => {
        const uniqueLocativeFormAttributes = new Set();
        for (let sc of Object.values(LocativeFormAttribute)) {
            uniqueLocativeFormAttributes.add(sc);
        }

        assertEquals(
            Object.keys(LocativeFormAttribute).length,
            uniqueLocativeFormAttributes.size,
            'Enum values must be unique.'
        );
    })();

    let row = RussianNouns.createLemma({
        text: 'ряд',
        gender: Gender.MASCULINE
    });

    result = RussianNouns.CASES.map(c => {
        return rne.decline(row, c);
    });

    assertAllCases(result, ['ряд', 'ряда', 'ряду', 'ряд', 'рядом', 'ряде', 'ряду']);
    assertIsArray(rne.getLocativeForms(row), 'getLocativeForms(x) type');
    assertEquals(rne.getLocativeForms(row).length, 1, 'locative forms count');
    assertEquals(rne.getLocativeForms(row)[0].preposition, 'в', 'lf.preposition');
    assertEquals(rne.getLocativeForms(row)[0].word, 'ряду', 'lf.word');
    assertEqualsSingleValue(
        rne.getLocativeForms(row)[0].attributes,
        LocativeFormAttribute.STRUCTURE,
        'lf.semantics'
    );

    assertIsArray(rne.getLocativeForms(mountain), 'getLocativeForms(x) type (a mountain)');
    assertEquals(rne.getLocativeForms(mountain).length, 0, 'locative forms count (a mountain)');

    assertIsArray(rne.getLocativeForms(way), 'getLocativeForms(x) type (a way)');
    assertEquals(rne.getLocativeForms(way).length, 0, 'locative forms count (a way)');

    const ball = RussianNouns.createLemma({
        text: 'мяч',
        gender: Gender.MASCULINE
    });
    assertIsArray(rne.getLocativeForms(ball), 'getLocativeForms(x) type (a ball)');
    assertEquals(rne.getLocativeForms(ball).length, 0, 'locative forms count (a ball)');

    const steam = RussianNouns.createLemma({
        text: 'пар',
        gender: Gender.MASCULINE
    });

    result = RussianNouns.CASES.map(c => {
        return rne.decline(steam, c);
    });

    assertIsArray(result);
    assertEqualsSingleValue(result[5], 'паре');
    assertEqualsSingleValue(result[6], 'пару');
    const steamLocativeForms = rne.getLocativeForms(steam);
    assertIsArray(steamLocativeForms, 'getLocativeForms(x) type (steam)');

    function findFormWithSingleAttribute(locativeForms, attribute) {
        return locativeForms.filter(f => ((f.attributes.length === 1)
            && ((f.attributes[0] === attribute))));
    }

    const steamSubstance = findFormWithSingleAttribute(steamLocativeForms, LocativeFormAttribute.SUBSTANCE);
    const steamResource = findFormWithSingleAttribute(steamLocativeForms, LocativeFormAttribute.RESOURCE);
    const steamSurface = findFormWithSingleAttribute(steamLocativeForms, LocativeFormAttribute.SURFACE);

    assertEquals(steamSubstance.length, 1, 'Steam as a substance must have a locative form.');
    assertEquals(steamResource.length, 1, 'Steam as a resource must have a locative form.');
    assertEquals(steamSurface.length, 0, 'Steam as a surface must not have a locative form.');

    assertEquals(steamSubstance[0].preposition, 'в', 'Steam as a substance has incorrect preposition.');
    assertEquals(steamResource[0].preposition, 'на', 'Steam as a resource has incorrect preposition.');

    assertEquals(steamSubstance[0].word, 'пару', 'Steam as a substance has incorrect word form.');
    assertEquals(steamResource[0].word, 'пару', 'Steam as a resource has incorrect word form.');

    console.log('--------------- 10 ---------------');

})();

(() => {
    itShouldThrow(RussianNouns.LemmaException, () => {
        RussianNouns.createLemma(123);
    });
    console.log('createLemma: number');

    itShouldThrow(RussianNouns.LemmaException, () => {
        RussianNouns.createLemma('гора');
    });
    console.log('createLemma: string');

    itShouldThrow(RussianNouns.LemmaException, () => {
        RussianNouns.createLemma(null);
    });
    console.log('createLemma: null');

    itShouldThrow(RussianNouns.LemmaException, () => {
        RussianNouns.createLemma(undefined);
    });
    console.log('createLemma: undefined');

    itShouldThrow(RussianNouns.LemmaException, () => {
        RussianNouns.createLemma({});
    });
    console.log('createLemma: {}');

    itShouldThrow(RussianNouns.LemmaException, () => {
        RussianNouns.createLemma({
            text: 'гора'
        });
    });
    console.log('createLemma: gender undefined');

    itShouldThrow(RussianNouns.LemmaException, () => {
        RussianNouns.createLemma({
            text: 'гора',
            gender: 'fgsfds'
        });
    });
    console.log('createLemma: gender fgsfds');

    itShouldThrow(RussianNouns.LemmaException, () => {
        RussianNouns.createLemma({
            text: 'ножницы',
            pluraleTantum: 123
        });
    });
    console.log('createLemma: pluraleTantum 123');

    itShouldThrow(RussianNouns.LemmaException, () => {
        RussianNouns.createLemma({
            text: 'пальто',
            gender: RussianNouns.Gender.NEUTER,
            indeclinable: 'fgsfds'
        });
    });
    console.log('createLemma: indeclinable fgsfds');

    itShouldThrow(RussianNouns.LemmaException, () => {
        RussianNouns.createLemma({
            text: 'трактор',
            gender: RussianNouns.Gender.MASCULINE,
            transport: 'наземный'
        });
    });
    console.log('createLemma: transport fgsfds');

    itShouldThrow(RussianNouns.LemmaException, () => {
        RussianNouns.createLemma({
            gender: RussianNouns.Gender.MASCULINE
        });
    });
    console.log('createLemma: text undefined');

    (() => {
        const k = RussianNouns.createLemma({
            text: 'гора',
            gender: RussianNouns.Gender.FEMININE
        });
        assertEquals(k.text(), 'гора');
        assertEquals(k.getGender(), RussianNouns.Gender.FEMININE);
        assertEquals(k.isPluraleTantum(), false);
        assertEquals(k.isIndeclinable(), false);
        console.log('createLemma: valid (1)');
    })();

    (() => {
        const k = RussianNouns.createLemma({
            text: 'ножницы',
            pluraleTantum: true
        });
        assertEquals(k.text(), 'ножницы');
        assertEquals(k.isPluraleTantum(), true);
        assertEquals(k.getGender(), undefined);
        assertEquals(k.isIndeclinable(), false);
        console.log('createLemma: valid (2)');

        const l = RussianNouns.createLemma(k);
        assertEquals(l, k);
        console.log('createLemma: the same object');
    })();

    // ----------------------

    const assertHasError = a => {
        assertIsArray(a);
        assertEquals(a.length, 2);
        assertEquals(a[0], null);
        assertEquals(typeof a[1], 'string');
    };

    assertHasError(RussianNouns.createLemmaNoThrow(123));
    console.log('createLemmaNoThrow: number');

    assertHasError(RussianNouns.createLemmaNoThrow('гора'));
    console.log('createLemmaNoThrow: string');

    assertHasError(RussianNouns.createLemmaNoThrow(null));
    console.log('createLemmaNoThrow: null');

    assertHasError(RussianNouns.createLemmaNoThrow(undefined));
    console.log('createLemmaNoThrow: undefined');

    assertHasError(RussianNouns.createLemmaNoThrow({}));
    console.log('createLemmaNoThrow: {}');

    assertHasError(RussianNouns.createLemmaNoThrow({
        text: 'гора'
    }));
    console.log('createLemmaNoThrow: gender undefined');

    assertHasError(RussianNouns.createLemmaNoThrow({
        text: 'гора',
        gender: 'fgsfds'
    }));
    console.log('createLemmaNoThrow: gender fgsfds');

    assertHasError(RussianNouns.createLemmaNoThrow({
        text: 'ножницы',
        pluraleTantum: 123
    }));
    console.log('createLemmaNoThrow: pluraleTantum 123');

    assertHasError(RussianNouns.createLemmaNoThrow({
        text: 'пальто',
        gender: RussianNouns.Gender.NEUTER,
        indeclinable: 'fgsfds'
    }));
    console.log('createLemmaNoThrow: indeclinable fgsfds');

    assertHasError(RussianNouns.createLemmaNoThrow({
        text: 'трактор',
        gender: RussianNouns.Gender.MASCULINE,
        transport: 'наземный'
    }));
    console.log('createLemmaNoThrow: transport fgsfds');

    assertHasError(RussianNouns.createLemmaNoThrow({
        gender: RussianNouns.Gender.MASCULINE
    }));
    console.log('createLemmaNoThrow: text undefined');

    let x;

    x = RussianNouns.createLemmaNoThrow({
        text: 'гора',
        gender: RussianNouns.Gender.FEMININE
    });
    assertIsArray(x);
    assertEquals(x.length, 2);
    assertEquals(x[1], null);
    assertEquals(x[0] instanceof RussianNouns.Lemma, true);
    assertEquals(x[0].text(), 'гора');
    assertEquals(x[0].getGender(), RussianNouns.Gender.FEMININE);
    assertEquals(x[0].isPluraleTantum(), false);
    assertEquals(x[0].isIndeclinable(), false);
    console.log('createLemmaNoThrow: valid (1)');

    x = RussianNouns.createLemmaNoThrow({
        text: 'ножницы',
        pluraleTantum: true
    });
    assertIsArray(x);
    assertEquals(x.length, 2);
    assertEquals(x[1], null);
    assertEquals(x[0] instanceof RussianNouns.Lemma, true);
    assertEquals(x[0].text(), 'ножницы');
    assertEquals(x[0].isPluraleTantum(), true);
    assertEquals(x[0].getGender(), undefined);
    assertEquals(x[0].isIndeclinable(), false);
    console.log('createLemmaNoThrow: valid (2)');

    let y = RussianNouns.createLemmaNoThrow(x[0]);
    assertEquals(y[0], x[0]);
    console.log('createLemmaNoThrow: the same object');
})();

(() => {

    const rne = new RussianNouns.Engine();

    const Ⰳ = (word, caseNumber) => {
        const c = RussianNouns.CASES[caseNumber - 1];
        return rne.decline(word, c)[0];
    };

    const Ⰴ = (word, caseNumber) => {
        const c = RussianNouns.CASES[caseNumber - 1];
        const result = rne.decline(word, c);
        return result[result.length - 1];
    };

    const ⰃⰃ = (word, caseNumber) => {
        const c = RussianNouns.CASES[caseNumber - 1];
        const pluralForm = rne.pluralize(word)[0];
        return rne.decline(word, c, pluralForm)[0];
    };

    const L = RussianNouns.createLemma;
    const Gender = RussianNouns.Gender;
    const cap = (str) => str[0].toUpperCase() + str.substring(1);

    console.log('Winter Evening (fragment) by Alexander Sergeyevich Pushkin');

    const буря = L({text: 'буря', gender: Gender.FEMININE});
    const мгла = L({text: 'мгла', gender: Gender.FEMININE});
    const небо = L({text: 'небо', gender: Gender.NEUTER});
    const вихрь = L({text: 'вихрь', gender: Gender.MASCULINE});

    const зверь = L({text: 'зверь', gender: Gender.MASCULINE, animate: true});
    const дитя = L({text: 'дитя', gender: Gender.NEUTER, animate: true});

    const кровля = L({text: 'кровля', gender: Gender.FEMININE});
    const солома = L({text: 'солома', gender: Gender.FEMININE});

    const путник = L({text: 'путник', gender: Gender.MASCULINE, animate: true});
    const окошко = L({text: 'окошко', gender: Gender.NEUTER});

    assertEquals(
        `${cap(Ⰳ(буря, 1))} ${Ⰴ(мгла, 5)} ${Ⰳ(небо, 4)} кроет,`,
        'Буря мглою небо кроет,'
    );

    assertEquals(
        `${cap(ⰃⰃ(вихрь, 4))} снежные крутя;`,
        'Вихри снежные крутя;'
    );

    assertEquals(
        `То, как ${Ⰳ(зверь, 1)}, она завоет,`,
        'То, как зверь, она завоет,'
    );

    assertEquals(
        `То заплачет, как ${Ⰳ(дитя, 1)},`,
        'То заплачет, как дитя,'
    );

    assertEquals(
        `То по ${Ⰳ(кровля, 3)} обветшалой`,
        'То по кровле обветшалой'
    );

    assertEquals(
        `Вдруг ${Ⰳ(солома, 5)} зашумит,`,
        'Вдруг соломой зашумит,'
    );

    assertEquals(
        `То, как ${Ⰳ(путник, 1)} запоздалый,`,
        'То, как путник запоздалый,'
    );

    assertEquals(
        `К нам в ${Ⰳ(окошко, 4)} застучит.`,
        'К нам в окошко застучит.'
    );

    console.log('----------------------------------');

    console.log('A girl\'s story (fragment) by Nikolay Stepanovich Gumilyov');

    const ворота = L({text: 'ворота', pluraleTantum: true});
    const тень = L({text: 'тень', gender: Gender.FEMININE});
    const ель = L({text: 'ель', gender: Gender.FEMININE});
    const снег = L({text: 'снег', gender: Gender.MASCULINE});
    const высота = L({text: 'высота', gender: Gender.FEMININE});

    assertEquals(true, ворота.isPluraleTantum());
    assertEquals(true, ворота.isPluraliaTantum());  // deprecated

    assertEquals(
        `Я отдыхала у ${ⰃⰃ(ворота, 2)}`,
        'Я отдыхала у ворот'
    );

    assertEquals(
        `Под ${Ⰳ(тень, 5)} милой, старой ${Ⰳ(ель, 2)},`,
        'Под тенью милой, старой ели,'
    );

    assertEquals(
        `А надо мною пламенели`,
        'А надо мною пламенели'
    );

    assertEquals(
        `${cap(ⰃⰃ(снег, 1))} неведомых ${ⰃⰃ(высота, 2)}.`,
        'Снега неведомых высот.'
    );

    console.log('----------------------------------');

    console.log('Swan by Fyodor Ivanovich Tyutchev');

    const орел = L({text: 'орел', gender: Gender.MASCULINE, animate: true});
    const облако = L({text: 'облако', gender: Gender.NEUTER});
    const молния = L({text: 'молния', gender: Gender.FEMININE});
    const полет = L({text: 'полет', gender: Gender.MASCULINE});

    const око = L({text: 'око', gender: Gender.NEUTER});
    const солнце = L({text: 'солнце', gender: Gender.NEUTER});
    const свет = L({text: 'свет', gender: Gender.MASCULINE});

    const удел = L({text: 'удел', gender: Gender.MASCULINE});
    const лебедь = L({text: 'лебедь', gender: Gender.MASCULINE, animate: true});
    const стихия = L({text: 'стихия', gender: Gender.FEMININE});
    const божество = L({text: 'божество', gender: Gender.NEUTER, animate: true});

    const бездна = L({text: 'бездна', gender: Gender.FEMININE});
    const сон = L({text: 'сон', gender: Gender.MASCULINE});
    const слава = L({text: 'слава', gender: Gender.FEMININE});
    const твердь = L({text: 'твердь', gender: Gender.FEMININE});

    assertEquals(
        `Пускай ${Ⰳ(орел, 1)} за ${ⰃⰃ(облако, 5)}`,
        'Пускай орел за облаками'
    );

    assertEquals(
        `Встречает ${Ⰳ(молния, 2)} ${Ⰳ(полет, 4)}`,
        'Встречает молнии полет'
    );

    assertEquals(
        `И неподвижными ${ⰃⰃ(око, 5)}`,
        'И неподвижными очами'
    );

    assertEquals(
        `В себя впивает ${Ⰳ(солнце, 2)} ${Ⰳ(свет, 4)}.`,
        'В себя впивает солнца свет.'
    );

    assertEquals(
        `Но нет завиднее ${Ⰳ(удел, 2)},`,
        'Но нет завиднее удела,'
    );

    assertEquals(
        `О, ${Ⰳ(лебедь, 1)} чистый, твоего!`,
        'О, лебедь чистый, твоего!'
    );

    assertEquals(
        `И чистой, как ты сам, одело`,
        'И чистой, как ты сам, одело'
    );

    assertEquals(
        `Тебя ${Ⰳ(стихия, 5)} ${cap(Ⰳ(божество, 1))}.`,
        'Тебя стихией Божество.'
    );

    assertEquals(
        `Она между двойною ${Ⰳ(бездна, 5)}`,
        'Она между двойною бездной'
    );

    assertEquals(
        `Лелеет твой всезрящий ${Ⰳ(сон, 4)},`,
        'Лелеет твой всезрящий сон,'
    );

    assertEquals(
        `И полной ${Ⰳ(слава, 5)} ${Ⰳ(твердь, 2)} звездной`,
        'И полной славой тверди звездной'
    );

    assertEquals(
        `Ты отовсюду окружен.`,
        'Ты отовсюду окружен.'
    );

    console.log('----------------------------------');

    console.log('Potec (fragment) by Alexander Ivanovich Vvedensky');

    const лошадь = L({text: 'лошадь', gender: Gender.FEMININE, animate: true});
    const конь = L({text: 'конь', gender: Gender.MASCULINE, animate: true});

    const волна = L({text: 'волна', gender: Gender.FEMININE});
    const подкова = L({text: 'подкова', gender: Gender.FEMININE});
    const жар = L({text: 'жар', gender: Gender.MASCULINE});

    assertEquals(
        `Несутся ${ⰃⰃ(лошадь, 1)} как ${ⰃⰃ(волна, 1)},`,
        'Несутся лошади как волны,'
    );

    assertEquals(
        `Стучат ${ⰃⰃ(подкова, 1)}.`,
        'Стучат подковы.'
    );

    assertEquals(
        `Лихие ${ⰃⰃ(конь, 1)} ${Ⰳ(жар, 5)} полны.`,
        'Лихие кони жаром полны.'
    );

    assertEquals(
        `Исчезнув скачут.`,
        'Исчезнув скачут.'
    );

    console.log('----------------------------------');

    console.log('Testing dev branch index.html words...');

    const checkSingularAndPlural = (lemma, expectedSingular, expectedPlural) => {
        const singular = RussianNouns.CASES.map(c => {
            return rne.decline(lemma, c);
        });

        assertAllCases(singular, expectedSingular);

        const p = rne.pluralize(lemma);
        assertEqualsSingleValue(p, expectedPlural[0]);

        const plural = RussianNouns.CASES.map(c => {
            return rne.decline(lemma, c, p[0]);
        });

        assertAllCases(plural, expectedPlural);

        // console.log(lemma.text());
    };

    const checkSingular = (lemma, expectedSingular) => {
        const singular = RussianNouns.CASES.map(c => {
            return rne.decline(lemma, c);
        });

        assertAllCases(singular, expectedSingular);

        // console.log(lemma.text());
    };

    checkSingularAndPlural(
        L({text: 'арбуз', gender: Gender.MASCULINE}),
        ['арбуз', 'арбуза', 'арбузу', 'арбуз', 'арбузом', 'арбузе', 'арбузе'],
        ['арбузы', 'арбузов', 'арбузам', 'арбузы', 'арбузами', 'арбузах', 'арбузах']
    );

    checkSingularAndPlural(
        L({text: 'окно', gender: Gender.NEUTER}),
        ['окно', 'окна', 'окну', 'окно', 'окном', 'окне', 'окне'],
        ['окна', 'окон', 'окнам', 'окна', 'окнами', 'окнах', 'окнах']
    );

    checkSingularAndPlural(
        L({text: 'кот', gender: Gender.MASCULINE, animate: true}),
        ['кот', 'кота', 'коту', 'кота', 'котом', 'коте', 'коте'],
        ['коты', 'котов', 'котам', 'котов', 'котами', 'котах', 'котах']
    );

    checkSingularAndPlural(
        L({text: 'кошка', gender: Gender.FEMININE, animate: true}),
        ['кошка', 'кошки', 'кошке', 'кошку', ['кошкой', 'кошкою'], 'кошке', 'кошке'],
        ['кошки', 'кошек', 'кошкам', 'кошек', 'кошками', 'кошках', 'кошках']
    );

    checkSingularAndPlural(
        L({text: 'дитя', gender: Gender.NEUTER, animate: true}),
        ['дитя', 'дитяти', 'дитяти', 'дитя', ['дитятей', 'дитятею'], 'дитяти', 'дитяти'],
        ['дети', 'детей', 'детям', 'детей', 'детьми', 'детях', 'детях']
    );

    // Дательный падеж ед.ч. у слов на -мя звучит странновато, но это правда нормативная форма.
    // Уместный глагол здесь, например, «радуюсь». Чему? Этому времени.
    // Или можно задать вопрос «благодаря чему».

    checkSingularAndPlural(
        L({text: 'знамя', gender: Gender.NEUTER}),
        ['знамя', 'знамени', 'знамени', 'знамя', 'знаменем', 'знамени', 'знамени'],
        ['знамёна', 'знамён', 'знамёнам', 'знамёна', 'знамёнами', 'знамёнах', 'знамёнах']
    );

    checkSingularAndPlural(
        L({text: 'время', gender: Gender.NEUTER}),
        ['время', 'времени', 'времени', 'время', 'временем', 'времени', 'времени'],
        ['времена', 'времён', 'временам', 'времена', 'временами', 'временах', 'временах']
    );

    checkSingularAndPlural(
        L({text: 'семя', gender: Gender.NEUTER}),
        ['семя', 'семени', 'семени', 'семя', 'семенем', 'семени', 'семени'],
        ['семена', 'семян', 'семенам', 'семена', 'семенами', 'семенах', 'семенах']
    );

    checkSingular(
        L({text: 'вымя', gender: Gender.NEUTER}),
        ['вымя', 'вымени', 'вымени', 'вымя', 'выменем', 'вымени', 'вымени']
    );

    checkSingular(
        L({text: 'темя', gender: Gender.NEUTER}),
        ['темя', 'темени', 'темени', 'темя', 'теменем', 'темени', 'темени']
    );

    checkSingularAndPlural(
        L({text: 'имя', gender: Gender.NEUTER}),
        ['имя', 'имени', 'имени', 'имя', 'именем', 'имени', 'имени'],
        ['имена', 'имён', 'именам', 'имена', 'именами', 'именах', 'именах']
    );

    checkSingular(
        L({text: 'пламя', gender: Gender.NEUTER}),
        ['пламя', 'пламени', 'пламени', 'пламя', 'пламенем', 'пламени', 'пламени']
    );

    checkSingularAndPlural(
        L({text: 'стремя', gender: Gender.NEUTER}),
        ['стремя', 'стремени', 'стремени', 'стремя', 'стременем', 'стремени', 'стремени'],
        ['стремена', 'стремян', 'стременам', 'стремена', 'стременами', 'стременах', 'стременах']
    );

    checkSingularAndPlural(
        L({text: 'задира', gender: Gender.COMMON, animate: true}),
        ['задира', 'задиры', 'задире', 'задиру', ['задирой', 'задирою'], 'задире', 'задире'],
        ['задиры', 'задир', 'задирам', 'задир', 'задирами', 'задирах', 'задирах']
    );

    checkSingularAndPlural(
        L({text: 'хитрюга', gender: Gender.COMMON, animate: true}),
        ['хитрюга', 'хитрюги', 'хитрюге', 'хитрюгу', ['хитрюгой', 'хитрюгою'], 'хитрюге', 'хитрюге'],
        ['хитрюги', 'хитрюг', 'хитрюгам', 'хитрюг', 'хитрюгами', 'хитрюгах', 'хитрюгах']
    );

    checkSingularAndPlural(
        L({text: 'нелюдь', gender: Gender.MASCULINE, animate: true}),
        ['нелюдь', 'нелюдя', 'нелюдю', 'нелюдя', 'нелюдем', 'нелюде', 'нелюде'],
        ['нелюди', 'нелюдей', 'нелюдям', 'нелюдей', 'нелюдями', 'нелюдях', 'нелюдях']
    );

    checkSingularAndPlural(
        L({text: 'паровоз', gender: Gender.MASCULINE}),
        ['паровоз', 'паровоза', 'паровозу', 'паровоз', 'паровозом', 'паровозе', 'паровозе'],
        ['паровозы', 'паровозов', 'паровозам', 'паровозы', 'паровозами', 'паровозах', 'паровозах']
    );

    checkSingular(
        L({text: 'Ад', gender: Gender.MASCULINE}),
        ['Ад', 'Ада', 'Аду', 'Ад', 'Адом', 'Аде', 'Аду']
    );

    checkSingularAndPlural(
        L({text: 'вид', gender: Gender.MASCULINE}),
        ['вид', 'вида', 'виду', 'вид', 'видом', 'виде', 'виду'],
        ['виды', 'видов', 'видам', 'виды', 'видами', 'видах', 'видах']
    );

    checkSingularAndPlural(
        L({text: 'снег', gender: Gender.MASCULINE}),
        ['снег', ['снега', 'снегу'], 'снегу', 'снег', 'снегом', 'снеге', 'снегу'],
        ['снега', 'снегов', 'снегам', 'снега', 'снегами', 'снегах', 'снегах']
    );

    checkSingularAndPlural(
        L({text: 'мать', gender: Gender.FEMININE, animate: true}),
        ['мать', 'матери', 'матери', 'мать', 'матерью', 'матери', 'матери'],
        ['матери', 'матерей', 'матерям', 'матерей', 'матерями', 'матерях', 'матерях']
    );

    checkSingularAndPlural(
        L({text: 'отец', gender: Gender.MASCULINE, animate: true}),
        ['отец', 'отца', 'отцу', 'отца', 'отцом', 'отце', 'отце'],
        ['отцы', 'отцов', 'отцам', 'отцов', 'отцами', 'отцах', 'отцах']
    );

    // Есть еще форму творительного падежа мн. ч.
    // "дочерьми" можно добавить.
    checkSingularAndPlural(
        L({text: 'дочь', gender: Gender.FEMININE, animate: true}),
        ['дочь', 'дочери', 'дочери', 'дочь', 'дочерью', 'дочери', 'дочери'],
        ['дочери', 'дочерей', 'дочерям', 'дочерей', 'дочерями', 'дочерях', 'дочерях']
    );

    checkSingularAndPlural(
        L({text: 'зять', gender: Gender.MASCULINE, animate: true}),
        ['зять', 'зятя', 'зятю', 'зятя', 'зятем', 'зяте', 'зяте'],
        ['зятья', 'зятьёв', 'зятьям', 'зятьёв', 'зятьями', 'зятьях', 'зятьях']
    );

    checkSingularAndPlural(
        L({text: 'ирония', gender: Gender.FEMININE}),
        ['ирония', 'иронии', 'иронии', 'иронию', 'иронией', 'иронии', 'иронии'],
        ['иронии', 'ироний', 'ирониям', 'иронии', 'ирониями', 'ирониях', 'ирониях']
    );

    checkSingularAndPlural(
        L({text: 'пальто', gender: Gender.NEUTER, indeclinable: true}),
        ['пальто', 'пальто', 'пальто', 'пальто', 'пальто', 'пальто', 'пальто'],
        ['пальто', 'пальто', 'пальто', 'пальто', 'пальто', 'пальто', 'пальто']
    );

    checkSingularAndPlural(
        L({text: 'путь', gender: Gender.MASCULINE}),
        ['путь', 'пути', 'пути', 'путь', 'путём', 'пути', 'пути'],
        ['пути', 'путей', 'путям', 'пути', 'путями', 'путях', 'путях']
    );

    checkSingularAndPlural(
        L({text: 'муть', gender: Gender.FEMININE}),
        ['муть', 'мути', 'мути', 'муть', 'мутью', 'мути', 'мути'],
        ['мути', 'мутей', 'мутям', 'мути', 'мутями', 'мутях', 'мутях']
    );

    checkSingularAndPlural(
        L({text: 'λ-выражение', gender: Gender.NEUTER}),
        ['λ-выражение', 'λ-выражения', 'λ-выражению', 'λ-выражение', 'λ-выражением', 'λ-выражении', 'λ-выражении'],
        ['λ-выражения', 'λ-выражений', 'λ-выражениям', 'λ-выражения', 'λ-выражениями', 'λ-выражениях', 'λ-выражениях']
    );

    checkSingularAndPlural(
        L({text: 'α-частица', gender: Gender.FEMININE}),
        ['α-частица', 'α-частицы', 'α-частице', 'α-частицу', ['α-частицей', 'α-частицею'], 'α-частице', 'α-частице'],
        ['α-частицы', 'α-частиц', 'α-частицам', 'α-частицы', 'α-частицами', 'α-частицах', 'α-частицах']
    );

    checkSingularAndPlural(
        L({text: 'овца', gender: Gender.FEMININE, animate: true}),
        ['овца', 'овцы', 'овце', 'овцу', ['овцой', 'овцою'], 'овце', 'овце'],
        ['овцы', 'овец', 'овцам', 'овец', 'овцами', 'овцах', 'овцах']
    );

    checkSingularAndPlural(
        L({text: 'рок-н-ролл', gender: Gender.MASCULINE}),
        ['рок-н-ролл', 'рок-н-ролла', 'рок-н-роллу', 'рок-н-ролл', 'рок-н-роллом', 'рок-н-ролле', 'рок-н-ролле'],
        ['рок-н-роллы', 'рок-н-роллов', 'рок-н-роллам', 'рок-н-роллы', 'рок-н-роллами', 'рок-н-роллах', 'рок-н-роллах']
    );

    checkSingularAndPlural(
        L({text: 'теле-пресс-конференция', gender: Gender.FEMININE}),
        [
            'теле-пресс-конференция',
            'теле-пресс-конференции',
            'теле-пресс-конференции',
            'теле-пресс-конференцию',
            'теле-пресс-конференцией',
            'теле-пресс-конференции',
            'теле-пресс-конференции'],
        [
            'теле-пресс-конференции',
            'теле-пресс-конференций',
            'теле-пресс-конференциям',
            'теле-пресс-конференции',
            'теле-пресс-конференциями',
            'теле-пресс-конференциях',
            'теле-пресс-конференциях']
    );

    checkSingularAndPlural(
        L({text: 'судно', gender: Gender.NEUTER}),
        ['судно', 'судна', 'судну', 'судно', 'судном', 'судне', 'судне'],
        ['судна', 'суден', 'суднам', 'судна', 'суднами', 'суднах', 'суднах']
    );

    checkSingularAndPlural(
        L({text: 'судно', gender: Gender.NEUTER, transport: true}),
        ['судно', 'судна', 'судну', 'судно', 'судном', 'судне', 'судне'],
        ['суда', 'судов', 'судам', 'суда', 'судами', 'судах', 'судах']
    );

    // TODO имена собственные какие-нибудь

    // checkSingularAndPlural(
    //     L({text: 'окно', gender: Gender.NEUTER}),
    //     ['', '', '', '', '', '', ''],
    //     ['', '', '', '', '', '', '']
    // );

    console.log('----------------------------------');

    console.log('Experimental: adjectives, participles.');

    const лихой = L({text: 'лихой', gender: Gender.MASCULINE, animate: true});

    assertEquals(
        `${cap(ⰃⰃ(лихой, 1))} ${ⰃⰃ(конь, 1)} ${Ⰳ(жар, 5)} полны.`,
        'Лихие кони жаром полны.'
    );

    const неподвижное = L({text: 'неподвижное', gender: Gender.NEUTER});

    assertEquals(
        `И ${ⰃⰃ(неподвижное, 5)} ${ⰃⰃ(око, 5)}`,
        'И неподвижными очами'
    );

    const чистая = L({text: 'чистая', gender: Gender.FEMININE});

    assertEquals(
        `И ${Ⰳ(чистая, 5)}, как ты сам, одело`,
        'И чистой, как ты сам, одело' // тебя стихией Божество.
    );

    console.log('--------------- 1 ----------------');

    const адаптировавший = L({text: 'адаптировавший', gender: Gender.MASCULINE, animate: true});

    (() => {
        const result = RussianNouns.CASES.map(c => {
            return rne.decline(адаптировавший, c);
        });

        assertAllCases(result, [
            'адаптировавший',
            'адаптировавшего',
            'адаптировавшему',
            'адаптировавшего',
            'адаптировавшим',
            'адаптировавшем',
            'адаптировавшем'
        ]);

        console.log('--------------- 2 ----------------');
    })();

    const адаптировавшее = L({text: 'адаптировавшее', gender: Gender.NEUTER});

    (() => {
        const result = RussianNouns.CASES.map(c => {
            return rne.decline(адаптировавшее, c);
        });

        assertAllCases(result, [
            'адаптировавшее',
            'адаптировавшего',
            'адаптировавшему',
            'адаптировавшее',
            'адаптировавшим',
            'адаптировавшем',
            'адаптировавшем'
        ]);

        console.log('--------------- 3 ----------------');
    })();

    const адаптировавшая = L({text: 'адаптировавшая', gender: Gender.FEMININE});

    (() => {
        const result = RussianNouns.CASES.map(c => {
            return rne.decline(адаптировавшая, c);
        });

        assertIsArray(result);
        assertEquals(result.length, 7);

        for (let i = 0; i < 7; i++) {
            assertIsArray(result[i]);
        }

        assertEqualsSingleValue(result[0], 'адаптировавшая');
        assertEqualsSingleValue(result[1], 'адаптировавшей');
        assertEqualsSingleValue(result[2], 'адаптировавшей');
        assertEqualsSingleValue(result[3], 'адаптировавшую');

        // TODO
        // assertEquals(result[4].length, 2);
        // assertEquals(result[4][0], 'адаптировавшей');
        // assertEquals(result[4][1], 'адаптировавшею');
        assertEquals(result[4][0], 'адаптировавшею');

        assertEqualsSingleValue(result[5], 'адаптировавшей');
        assertEqualsSingleValue(result[6], 'адаптировавшей');

        console.log('--------------- 4 ----------------');
    })();

    (() => {
        const k = rne.pluralize(адаптировавший);
        const m = rne.pluralize(адаптировавшая);
        const n = rne.pluralize(адаптировавшее);
        const expectedPlural = 'адаптировавшие';

        assertEqualsSingleValue(k, expectedPlural);
        assertEqualsSingleValue(m, expectedPlural);
        assertEqualsSingleValue(n, expectedPlural);

        function checkCases(lemma) {
            const result = RussianNouns.CASES.map(c => {
                return rne.decline(lemma, c, expectedPlural);
            });

            assertEqualsSingleValue(result[0], expectedPlural);
            assertEqualsSingleValue(result[1], 'адаптировавших');
            assertEqualsSingleValue(result[2], 'адаптировавшим');

            if (lemma.isAnimate()) {
                assertEqualsSingleValue(result[3], 'адаптировавших');
            } else {
                assertEqualsSingleValue(result[3], 'адаптировавшие');
            }

            assertEqualsSingleValue(result[4], 'адаптировавшими');
            assertEqualsSingleValue(result[5], 'адаптировавших');
            assertEqualsSingleValue(result[6], 'адаптировавших');
        }

        checkCases(адаптировавший);
        checkCases(адаптировавшая);
        checkCases(адаптировавшее);
    })();

    console.log('----------------------------------');
})();
