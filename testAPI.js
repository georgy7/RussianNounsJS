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

    const Gender = RussianNouns.Gender;
    const Case = RussianNouns.Case;

    let result;

    result = rne.decline({text: 'имя', gender: Gender.NEUTER}, Case.GENITIVE);
    assertEqualsSingleValue(result, "имени");

    result = rne.decline({text: 'имя', gender: Gender.NEUTER}, Case.INSTRUMENTAL);
    assertEqualsSingleValue(result, "именем");

    console.log('--------------- 1 ----------------');

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
        const values = Object.values(LocativeFormAttribute);

        const uniqueLocativeFormAttributes = new Set();
        for (let sc of values) {
            uniqueLocativeFormAttributes.add(sc);
        }

        assertEquals(
            Object.keys(LocativeFormAttribute).length,
            uniqueLocativeFormAttributes.size,
            'Enum values must be unique.'
        );

        // Каждый атрибут кодируется отдельным битом, и они должны поместиться в одно 32-битное
        // целое число, вместе с кодом предлога и кодом типа склонения. Думаю, под эти два кода
        // можно выделить по 3 бита, так что на атрибуты останется 26 бит.

        // Будем не преобразовывать их во флаги в рантайме, а сразу работать с ними
        // как с флагами. Бинарные представления значений не должны пересекаться.

        assertEquals(true, values.every(x => Math.round(x) === x));
        assertEquals(true, values.reduce((a, b) => a|b) === values.reduce((a, b) => a^b));

        assertEquals(true, values.reduce((a, b) => Math.min(a, b)) === 1);
        assertEquals(true, values.reduce((a, b) => Math.max(a, b)) <= (1 << 25));
    })();

    let row = RussianNouns.createLemma({
        text: 'ряд',
        gender: Gender.MASCULINE
    });

    result = RussianNouns.CASES.map(c => {
        return rne.decline(row, c);
    });

    assertAllCases(result, ['ряд', 'ряда', 'ряду', 'ряд', 'рядом', 'ряде', 'ряду']);

    console.log('.');
    assertIsArray(rne.getLocativeForms(row), 'getLocativeForms(x) type');
    assertEquals(rne.getLocativeForms(row).length, 1, 'locative forms count');
    assertEquals(rne.getLocativeForms(row)[0].preposition, 'в', 'lf.preposition');
    assertEquals(rne.getLocativeForms(row)[0].word, 'ряду', 'lf.word');

    console.log('..');
    assertEquals(
        rne.getLocativeForms(row)[0].attributes,
        LocativeFormAttribute.STRUCTURE,
        'lf.semantics'
    );

    console.log('...');
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

    console.log('....');
    assertIsArray(result);
    assertEqualsSingleValue(result[5], 'паре');
    assertEqualsSingleValue(result[6], 'пару');
    const steamLocativeForms = rne.getLocativeForms(steam);
    assertIsArray(steamLocativeForms, 'getLocativeForms(x) type (steam)');

    console.log('.....');
    function findFormWithSingleAttribute(locativeForms, attribute) {
        return locativeForms.filter(f => f.attributes === attribute);
    }

    const steamSubstance = findFormWithSingleAttribute(steamLocativeForms, LocativeFormAttribute.SUBSTANCE);
    const steamResource = findFormWithSingleAttribute(steamLocativeForms, LocativeFormAttribute.RESOURCE);
    const steamSurface = findFormWithSingleAttribute(steamLocativeForms, LocativeFormAttribute.SURFACE);

    console.log('......');
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

    // Функция createLemmaNoThrow будет вскоре удалена.

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

    const Gender = RussianNouns.Gender;
    const createLemma = RussianNouns.createLemma;

    const rne = new RussianNouns.Engine();

    function usual(lemma, caseNumber) {
        const c = RussianNouns.CASES[caseNumber - 1];
        return rne.decline(lemma, c)[0];
    }

    // To get a little-used or older form.
    function unusual(lemma, caseNumber) {
        const c = RussianNouns.CASES[caseNumber - 1];
        const result = rne.decline(lemma, c);
        return result[result.length - 1];
    }

    function plural(lemma, caseNumber) {
        const c = RussianNouns.CASES[caseNumber - 1];
        const pluralForm = rne.pluralize(lemma)[0];
        return rne.decline(lemma, c, pluralForm)[0];
    }

    function cap(str) {
        return str[0].toUpperCase() + str.substring(1);
    }

    console.log('Winter Evening (fragment) by Alexander Sergeyevich Pushkin');

    const буря = createLemma({text: 'буря', gender: Gender.FEMININE});
    const мгла = createLemma({text: 'мгла', gender: Gender.FEMININE});
    const небо = createLemma({text: 'небо', gender: Gender.NEUTER});
    const зверь = createLemma({text: 'зверь', gender: Gender.MASCULINE, animate: true});
    const дитя = createLemma({text: 'дитя', gender: Gender.NEUTER, animate: true});
    const солома = createLemma({text: 'солома', gender: Gender.FEMININE});
    const окошко = createLemma({text: 'окошко', gender: Gender.NEUTER});

    const снежный = createLemma({text: 'снежный', gender: Gender.MASCULINE});
    const вихрь = createLemma({text: 'вихрь', gender: Gender.MASCULINE});

    const обветшалая = createLemma({text: 'обветшалая', gender: Gender.FEMININE});
    const кровля = createLemma({text: 'кровля', gender: Gender.FEMININE});

    const запоздалый = createLemma({text: 'запоздалый', gender: Gender.MASCULINE, animate: true});
    const путник = createLemma({text: 'путник', gender: Gender.MASCULINE, animate: true});

    assertEquals(
        `${cap(usual(буря, 1))} ${unusual(мгла, 5)} ${usual(небо, 4)} кроет,`,
        'Буря мглою небо кроет,'
    );

    assertEquals(
        `${cap(plural(вихрь, 4))} ${plural(снежный, 4)} крутя;`,
        'Вихри снежные крутя;'
    );

    assertEquals(
        `То, как ${usual(зверь, 1)}, она завоет,`,
        'То, как зверь, она завоет,'
    );

    assertEquals(
        `То заплачет, как ${usual(дитя, 1)},`,
        'То заплачет, как дитя,'
    );

    assertEquals(
        `То по ${usual(кровля, 3)} ${usual(обветшалая, 3)}`,
        'То по кровле обветшалой'
    );

    assertEquals(
        `Вдруг ${usual(солома, 5)} зашумит,`,
        'Вдруг соломой зашумит,'
    );

    assertEquals(
        `То, как ${usual(путник, 1)} ${usual(запоздалый, 1)},`,
        'То, как путник запоздалый,'
    );

    assertEquals(
        `К нам в ${usual(окошко, 4)} застучит.`,
        'К нам в окошко застучит.'
    );

    console.log('----------------------------------');

    console.log('A girl\'s story (fragment) by Nikolay Stepanovich Gumilyov');

    const ворота = createLemma({text: 'ворота', pluraleTantum: true});
    const тень = createLemma({text: 'тень', gender: Gender.FEMININE});
    const снег = createLemma({text: 'снег', gender: Gender.MASCULINE});

    const милая = createLemma({text: 'милая', gender: Gender.FEMININE});
    const старая = createLemma({text: 'старая', gender: Gender.FEMININE});
    const ель = createLemma({text: 'ель', gender: Gender.FEMININE});

    const неведомая = createLemma({text: 'неведомая', gender: Gender.FEMININE});
    const высота = createLemma({text: 'высота', gender: Gender.FEMININE});

    assertEquals(true, ворота.isPluraleTantum());

    assertEquals(
        `Я отдыхала у ${plural(ворота, 2)}`,
        'Я отдыхала у ворот'
    );

    assertEquals(
        `Под ${usual(тень, 5)} ${usual(милая, 2)}, ${usual(старая, 2)} ${usual(ель, 2)},`,
        'Под тенью милой, старой ели,'
    );

    assertEquals(
        `А надо мною пламенели`,
        'А надо мною пламенели'
    );

    assertEquals(
        `${cap(plural(снег, 1))} ${plural(неведомая, 2)} ${plural(высота, 2)}.`,
        'Снега неведомых высот.'
    );

    console.log('----------------------------------');

    console.log('Swan by Fyodor Ivanovich Tyutchev');

    const орел = createLemma({text: 'орел', gender: Gender.MASCULINE, animate: true});
    const облако = createLemma({text: 'облако', gender: Gender.NEUTER});
    const молния = createLemma({text: 'молния', gender: Gender.FEMININE});
    const полет = createLemma({text: 'полет', gender: Gender.MASCULINE});

    const неподвижное = createLemma({text: 'неподвижное', gender: Gender.NEUTER});
    const око = createLemma({text: 'око', gender: Gender.NEUTER});
    const солнце = createLemma({text: 'солнце', gender: Gender.NEUTER});
    const свет = createLemma({text: 'свет', gender: Gender.MASCULINE});

    const удел = createLemma({text: 'удел', gender: Gender.MASCULINE});

    const чистый = createLemma({text: 'чистый', gender: Gender.MASCULINE, animate: true});
    const лебедь = createLemma({text: 'лебедь', gender: Gender.MASCULINE, animate: true});

    const чистая = createLemma({text: 'чистая', gender: Gender.FEMININE});
    const стихия = createLemma({text: 'стихия', gender: Gender.FEMININE});
    const божество = createLemma({text: 'божество', gender: Gender.NEUTER, animate: true});

    const двойная = createLemma({text: 'двойная', gender: Gender.FEMININE});
    const бездна = createLemma({text: 'бездна', gender: Gender.FEMININE});

    const всезрящий = createLemma({text: 'всезрящий', gender: Gender.MASCULINE});
    const сон = createLemma({text: 'сон', gender: Gender.MASCULINE});

    const полная = createLemma({text: 'полная', gender: Gender.FEMININE});
    const слава = createLemma({text: 'слава', gender: Gender.FEMININE});

    const звездная = createLemma({text: 'звездная', gender: Gender.FEMININE});
    const твердь = createLemma({text: 'твердь', gender: Gender.FEMININE});

    assertEquals(
        `Пускай ${usual(орел, 1)} за ${plural(облако, 5)}`,
        'Пускай орел за облаками'
    );

    assertEquals(
        `Встречает ${usual(молния, 2)} ${usual(полет, 4)}`,
        'Встречает молнии полет'
    );

    assertEquals(
        `И ${plural(неподвижное, 5)} ${plural(око, 5)}`,
        'И неподвижными очами'
    );

    assertEquals(
        `В себя впивает ${usual(солнце, 2)} ${usual(свет, 4)}.`,
        'В себя впивает солнца свет.'
    );

    assertEquals(
        `Но нет завиднее ${usual(удел, 2)},`,
        'Но нет завиднее удела,'
    );

    assertEquals(
        `О, ${usual(лебедь, 1)} ${usual(чистый, 1)}, твоего!`,
        'О, лебедь чистый, твоего!'
    );

    assertEquals(
        `И ${usual(чистая, 5)}, как ты сам, одело`,
        'И чистой, как ты сам, одело'
    );

    assertEquals(
        `Тебя ${usual(стихия, 5)} ${cap(usual(божество, 1))}.`,
        'Тебя стихией Божество.'
    );

    assertEquals(
        `Она между двойною ${usual(бездна, 5)}`,    // TODO ${unusual(двойная, 5)}
        'Она между двойною бездной'
    );

    assertEquals(
        `Лелеет твой ${usual(всезрящий, 4)} ${usual(сон, 4)},`,
        'Лелеет твой всезрящий сон,'
    );

    assertEquals(
        `И ${usual(полная, 5)} ${usual(слава, 5)} ${usual(твердь, 2)} ${usual(звездная, 2)}`,
        'И полной славой тверди звездной'
    );

    assertEquals(
        `Ты отовсюду окружен.`,
        'Ты отовсюду окружен.'
    );

    console.log('----------------------------------');

    console.log('Potec (fragment) by Alexander Ivanovich Vvedensky');

    const лошадь = createLemma({text: 'лошадь', gender: Gender.FEMININE, animate: true});
    const конь = createLemma({text: 'конь', gender: Gender.MASCULINE, animate: true});

    const волна = createLemma({text: 'волна', gender: Gender.FEMININE});
    const подкова = createLemma({text: 'подкова', gender: Gender.FEMININE});
    const жар = createLemma({text: 'жар', gender: Gender.MASCULINE});

    assertEquals(
        `Несутся ${plural(лошадь, 1)} как ${plural(волна, 1)},`,
        'Несутся лошади как волны,'
    );

    assertEquals(
        `Стучат ${plural(подкова, 1)}.`,
        'Стучат подковы.'
    );

    assertEquals(
        `Лихие ${plural(конь, 1)} ${usual(жар, 5)} полны.`,
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
        createLemma({text: 'арбуз', gender: Gender.MASCULINE}),
        ['арбуз', 'арбуза', 'арбузу', 'арбуз', 'арбузом', 'арбузе', 'арбузе'],
        ['арбузы', 'арбузов', 'арбузам', 'арбузы', 'арбузами', 'арбузах', 'арбузах']
    );

    checkSingularAndPlural(
        createLemma({text: 'окно', gender: Gender.NEUTER}),
        ['окно', 'окна', 'окну', 'окно', 'окном', 'окне', 'окне'],
        ['окна', 'окон', 'окнам', 'окна', 'окнами', 'окнах', 'окнах']
    );

    checkSingularAndPlural(
        createLemma({text: 'кот', gender: Gender.MASCULINE, animate: true}),
        ['кот', 'кота', 'коту', 'кота', 'котом', 'коте', 'коте'],
        ['коты', 'котов', 'котам', 'котов', 'котами', 'котах', 'котах']
    );

    checkSingularAndPlural(
        createLemma({text: 'кошка', gender: Gender.FEMININE, animate: true}),
        ['кошка', 'кошки', 'кошке', 'кошку', ['кошкой', 'кошкою'], 'кошке', 'кошке'],
        ['кошки', 'кошек', 'кошкам', 'кошек', 'кошками', 'кошках', 'кошках']
    );

    checkSingularAndPlural(
        createLemma({text: 'дитя', gender: Gender.NEUTER, animate: true}),
        ['дитя', 'дитяти', 'дитяти', 'дитя', ['дитятей', 'дитятею'], 'дитяти', 'дитяти'],
        ['дети', 'детей', 'детям', 'детей', 'детьми', 'детях', 'детях']
    );

    // Дательный падеж ед.ч. у слов на -мя звучит странновато, но это правда нормативная форма.
    // Уместный глагол здесь, например, «радуюсь». Чему? Этому времени.
    // Или можно задать вопрос «благодаря чему».

    checkSingularAndPlural(
        createLemma({text: 'знамя', gender: Gender.NEUTER}),
        ['знамя', 'знамени', 'знамени', 'знамя', 'знаменем', 'знамени', 'знамени'],
        ['знамёна', 'знамён', 'знамёнам', 'знамёна', 'знамёнами', 'знамёнах', 'знамёнах']
    );

    checkSingularAndPlural(
        createLemma({text: 'время', gender: Gender.NEUTER}),
        ['время', 'времени', 'времени', 'время', 'временем', 'времени', 'времени'],
        ['времена', 'времён', 'временам', 'времена', 'временами', 'временах', 'временах']
    );

    checkSingularAndPlural(
        createLemma({text: 'семя', gender: Gender.NEUTER}),
        ['семя', 'семени', 'семени', 'семя', 'семенем', 'семени', 'семени'],
        ['семена', 'семян', 'семенам', 'семена', 'семенами', 'семенах', 'семенах']
    );

    checkSingular(
        createLemma({text: 'вымя', gender: Gender.NEUTER}),
        ['вымя', 'вымени', 'вымени', 'вымя', 'выменем', 'вымени', 'вымени']
    );

    checkSingular(
        createLemma({text: 'темя', gender: Gender.NEUTER}),
        ['темя', 'темени', 'темени', 'темя', 'теменем', 'темени', 'темени']
    );

    checkSingularAndPlural(
        createLemma({text: 'имя', gender: Gender.NEUTER}),
        ['имя', 'имени', 'имени', 'имя', 'именем', 'имени', 'имени'],
        ['имена', 'имён', 'именам', 'имена', 'именами', 'именах', 'именах']
    );

    checkSingular(
        createLemma({text: 'пламя', gender: Gender.NEUTER}),
        ['пламя', 'пламени', 'пламени', 'пламя', 'пламенем', 'пламени', 'пламени']
    );

    checkSingularAndPlural(
        createLemma({text: 'стремя', gender: Gender.NEUTER}),
        ['стремя', 'стремени', 'стремени', 'стремя', 'стременем', 'стремени', 'стремени'],
        ['стремена', 'стремян', 'стременам', 'стремена', 'стременами', 'стременах', 'стременах']
    );

    checkSingularAndPlural(
        createLemma({text: 'задира', gender: Gender.COMMON, animate: true}),
        ['задира', 'задиры', 'задире', 'задиру', ['задирой', 'задирою'], 'задире', 'задире'],
        ['задиры', 'задир', 'задирам', 'задир', 'задирами', 'задирах', 'задирах']
    );

    checkSingularAndPlural(
        createLemma({text: 'хитрюга', gender: Gender.COMMON, animate: true}),
        ['хитрюга', 'хитрюги', 'хитрюге', 'хитрюгу', ['хитрюгой', 'хитрюгою'], 'хитрюге', 'хитрюге'],
        ['хитрюги', 'хитрюг', 'хитрюгам', 'хитрюг', 'хитрюгами', 'хитрюгах', 'хитрюгах']
    );

    checkSingularAndPlural(
        createLemma({text: 'нелюдь', gender: Gender.MASCULINE, animate: true}),
        ['нелюдь', 'нелюдя', 'нелюдю', 'нелюдя', 'нелюдем', 'нелюде', 'нелюде'],
        ['нелюди', 'нелюдей', 'нелюдям', 'нелюдей', 'нелюдями', 'нелюдях', 'нелюдях']
    );

    checkSingularAndPlural(
        createLemma({text: 'паровоз', gender: Gender.MASCULINE}),
        ['паровоз', 'паровоза', 'паровозу', 'паровоз', 'паровозом', 'паровозе', 'паровозе'],
        ['паровозы', 'паровозов', 'паровозам', 'паровозы', 'паровозами', 'паровозах', 'паровозах']
    );

    checkSingular(
        createLemma({text: 'Ад', gender: Gender.MASCULINE}),
        ['Ад', 'Ада', 'Аду', 'Ад', 'Адом', 'Аде', 'Аду']
    );

    checkSingularAndPlural(
        createLemma({text: 'вид', gender: Gender.MASCULINE}),
        ['вид', 'вида', 'виду', 'вид', 'видом', 'виде', 'виду'],
        ['виды', 'видов', 'видам', 'виды', 'видами', 'видах', 'видах']
    );

    checkSingularAndPlural(
        createLemma({text: 'снег', gender: Gender.MASCULINE}),
        ['снег', ['снега', 'снегу'], 'снегу', 'снег', 'снегом', 'снеге', 'снегу'],
        ['снега', 'снегов', 'снегам', 'снега', 'снегами', 'снегах', 'снегах']
    );

    checkSingularAndPlural(
        createLemma({text: 'мать', gender: Gender.FEMININE, animate: true}),
        ['мать', 'матери', 'матери', 'мать', 'матерью', 'матери', 'матери'],
        ['матери', 'матерей', 'матерям', 'матерей', 'матерями', 'матерях', 'матерях']
    );

    checkSingularAndPlural(
        createLemma({text: 'отец', gender: Gender.MASCULINE, animate: true}),
        ['отец', 'отца', 'отцу', 'отца', 'отцом', 'отце', 'отце'],
        ['отцы', 'отцов', 'отцам', 'отцов', 'отцами', 'отцах', 'отцах']
    );

    checkSingularAndPlural(
        createLemma({text: 'дочь', gender: Gender.FEMININE, animate: true}),
        ['дочь', 'дочери', 'дочери', 'дочь', 'дочерью', 'дочери', 'дочери'],
        ['дочери', 'дочерей', 'дочерям', 'дочерей', ['дочерями', 'дочерьми'], 'дочерях', 'дочерях']
    );

    checkSingularAndPlural(
        createLemma({text: 'зять', gender: Gender.MASCULINE, animate: true}),
        ['зять', 'зятя', 'зятю', 'зятя', 'зятем', 'зяте', 'зяте'],
        ['зятья', 'зятьёв', 'зятьям', 'зятьёв', 'зятьями', 'зятьях', 'зятьях']
    );

    checkSingularAndPlural(
        createLemma({text: 'ирония', gender: Gender.FEMININE}),
        ['ирония', 'иронии', 'иронии', 'иронию', 'иронией', 'иронии', 'иронии'],
        ['иронии', 'ироний', 'ирониям', 'иронии', 'ирониями', 'ирониях', 'ирониях']
    );

    checkSingularAndPlural(
        createLemma({text: 'пальто', gender: Gender.NEUTER, indeclinable: true}),
        ['пальто', 'пальто', 'пальто', 'пальто', 'пальто', 'пальто', 'пальто'],
        ['пальто', 'пальто', 'пальто', 'пальто', 'пальто', 'пальто', 'пальто']
    );

    checkSingularAndPlural(
        createLemma({text: 'путь', gender: Gender.MASCULINE}),
        ['путь', 'пути', 'пути', 'путь', 'путём', 'пути', 'пути'],
        ['пути', 'путей', 'путям', 'пути', 'путями', 'путях', 'путях']
    );

    checkSingularAndPlural(
        createLemma({text: 'муть', gender: Gender.FEMININE}),
        ['муть', 'мути', 'мути', 'муть', 'мутью', 'мути', 'мути'],
        ['мути', 'мутей', 'мутям', 'мути', 'мутями', 'мутях', 'мутях']
    );

    checkSingularAndPlural(
        createLemma({text: 'λ-выражение', gender: Gender.NEUTER}),
        ['λ-выражение', 'λ-выражения', 'λ-выражению', 'λ-выражение', 'λ-выражением', 'λ-выражении', 'λ-выражении'],
        ['λ-выражения', 'λ-выражений', 'λ-выражениям', 'λ-выражения', 'λ-выражениями', 'λ-выражениях', 'λ-выражениях']
    );

    checkSingularAndPlural(
        createLemma({text: 'α-частица', gender: Gender.FEMININE}),
        ['α-частица', 'α-частицы', 'α-частице', 'α-частицу', ['α-частицей', 'α-частицею'], 'α-частице', 'α-частице'],
        ['α-частицы', 'α-частиц', 'α-частицам', 'α-частицы', 'α-частицами', 'α-частицах', 'α-частицах']
    );

    checkSingularAndPlural(
        createLemma({text: 'овца', gender: Gender.FEMININE, animate: true}),
        ['овца', 'овцы', 'овце', 'овцу', ['овцой', 'овцою'], 'овце', 'овце'],
        ['овцы', 'овец', 'овцам', 'овец', 'овцами', 'овцах', 'овцах']
    );

    checkSingularAndPlural(
        createLemma({text: 'рок-н-ролл', gender: Gender.MASCULINE}),
        ['рок-н-ролл', 'рок-н-ролла', 'рок-н-роллу', 'рок-н-ролл', 'рок-н-роллом', 'рок-н-ролле', 'рок-н-ролле'],
        ['рок-н-роллы', 'рок-н-роллов', 'рок-н-роллам', 'рок-н-роллы', 'рок-н-роллами', 'рок-н-роллах', 'рок-н-роллах']
    );

    checkSingularAndPlural(
        createLemma({text: 'теле-пресс-конференция', gender: Gender.FEMININE}),
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
        createLemma({text: 'судно', gender: Gender.NEUTER}),
        ['судно', 'судна', 'судну', 'судно', 'судном', 'судне', 'судне'],
        ['судна', 'суден', 'суднам', 'судна', 'суднами', 'суднах', 'суднах']
    );

    checkSingularAndPlural(
        createLemma({text: 'судно', gender: Gender.NEUTER, transport: true}),
        ['судно', 'судна', 'судну', 'судно', 'судном', 'судне', 'судне'],
        ['суда', 'судов', 'судам', 'суда', 'судами', 'судах', 'судах']
    );

    console.log('----------------------------------');

    console.log('Adjectives, participles.');

    const лихой = createLemma({text: 'лихой', gender: Gender.MASCULINE, animate: true});

    assertEquals(
        `${cap(plural(лихой, 1))} ${plural(конь, 1)} ${usual(жар, 5)} полны.`,
        'Лихие кони жаром полны.'
    );

    console.log('--------------- 1 ----------------');

    const адаптировавший = createLemma({text: 'адаптировавший', gender: Gender.MASCULINE, animate: true});

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

    const адаптировавшее = createLemma({text: 'адаптировавшее', gender: Gender.NEUTER});

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

    const адаптировавшая = createLemma({text: 'адаптировавшая', gender: Gender.FEMININE});

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

    console.log('Rarely used parts of API.');

    (() => {
        let x = RussianNouns.createLemma({
            text: 'абв',
            gender: Gender.FEMININE
        });

        assertEquals(x.text(), 'абв');
        assertEquals(x.lower(), 'абв');
        assertEquals(x.isPluraleTantum(), false);
        assertEquals(x.getGender(), Gender.FEMININE);

        let y = x.newText(o => o.text() + 'г');
        assertEquals(x.text(), 'абв');
        assertEquals(x.lower(), 'абв');
        assertEquals(y.text(), 'абвг');
        assertEquals(y.lower(), 'абвг');
        // Пожалуйста, не используйте поле _hash в пользовательском коде.
        // Тест просто проверяет, что внутренний хэш пересчитывается.
        assertEquals(true, x._hash != y._hash);
        assertEquals(y.getGender(), Gender.FEMININE);

        y = x.newText(() => 'Александр');
        assertEquals(x.text(), 'абв');
        assertEquals(x.lower(), 'абв');
        assertEquals(y.text(), 'Александр');
        assertEquals(y.lower(), 'александр');
        // Пожалуйста, не используйте поле _hash в пользовательском коде.
        assertEquals(true, x._hash != y._hash);
        assertEquals(y.getGender(), Gender.FEMININE);

        y = x.newGender(() => Gender.MASCULINE);
        assertEquals(x.isPluraleTantum(), false);
        assertEquals(x.getGender(), Gender.FEMININE);
        assertEquals(y.isPluraleTantum(), false);
        assertEquals(y.getGender(), Gender.MASCULINE);
        assertEquals(x.text(), y.text());
        assertEquals(x.lower(), y.lower());

        y = x.newGender(o => (o.text().endsWith('о') ? Gender.NEUTER : Gender.MASCULINE));
        assertEquals(y.getGender(), Gender.MASCULINE);

        x = x.newText(o => o.text() + 'о');
        y = x.newGender(o => (o.text().endsWith('о') ? Gender.NEUTER : Gender.MASCULINE));
        assertEquals(y.getGender(), Gender.NEUTER);

        x = x.newText(o => o.text().toUpperCase());
        assertEquals(x.text(), 'АБВО');
        assertEquals(x.lower(), 'абво');
        assertEquals(x.getGender(), Gender.FEMININE);
    })();

})();
