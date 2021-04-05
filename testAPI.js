function assertEquals(a, b) {
    if (a !== b) {
        console.log(`${a} !== ${b}`);
        process.exit(1);
    }
}

function assertIsArray(a) {
    if (!(a instanceof Array)) {
        console.log(`${a} is not an array`);
        process.exit(1);
    }
}

function assertEqualsSingleValue(array, value) {
    assertIsArray(array);
    assertEquals(array.length, 1);
    assertEquals(array[0], value);
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
    assertIsArray(result);
    assertEquals(result.length, 7);

    assertEqualsSingleValue(result[0], "гора");
    assertEqualsSingleValue(result[1], "горы");
    assertEqualsSingleValue(result[2], "горе");
    assertEqualsSingleValue(result[3], "гору");

    assertEquals(result[4].length, 2);
    assertEquals(result[4][0], "горой");
    assertEquals(result[4][1], "горою");

    assertEqualsSingleValue(result[5], "горе");
    assertEqualsSingleValue(result[6], "горе");

    console.log('--------------- 2 ----------------');

    result = rne.pluralize(mountain);
    assertEqualsSingleValue(result, "горы");
    const pluralMountain = result[0];

    console.log('--------------- 3 ----------------');

    result = RussianNouns.CASES.map(c => {
        return rne.decline(mountain, c, pluralMountain);
    });

    assertIsArray(result);
    assertEquals(result.length, 7);

    assertEqualsSingleValue(result[0], 'горы');
    assertEqualsSingleValue(result[1], 'гор');
    assertEqualsSingleValue(result[2], 'горам');
    assertEqualsSingleValue(result[3], 'горы');
    assertEqualsSingleValue(result[4], 'горами');
    assertEqualsSingleValue(result[5], 'горах');
    assertEqualsSingleValue(result[6], 'горах');

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

    let scissors = RussianNouns.createLemma({
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

    assertIsArray(result);
    assertEquals(result.length, 7);

    assertEqualsSingleValue(result[0], 'ножницы');
    assertEqualsSingleValue(result[1], 'ножниц');
    assertEqualsSingleValue(result[2], 'ножницам');
    assertEqualsSingleValue(result[3], 'ножницы');
    assertEqualsSingleValue(result[4], 'ножницами');
    assertEqualsSingleValue(result[5], 'ножницах');
    assertEqualsSingleValue(result[6], 'ножницах');

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

    (() => {
        const lemma = L({text: 'нелюдь', gender: Gender.MASCULINE, animate: true});

        const singular = RussianNouns.CASES.map(c => {
            return rne.decline(lemma, c);
        });

        assertIsArray(singular);
        assertEquals(singular.length, 7);

        assertEqualsSingleValue(singular[0], 'нелюдь');
        assertEqualsSingleValue(singular[1], 'нелюдя');
        assertEqualsSingleValue(singular[2], 'нелюдю');
        assertEqualsSingleValue(singular[3], 'нелюдя');
        assertEqualsSingleValue(singular[4], 'нелюдем');
        assertEqualsSingleValue(singular[5], 'нелюде');
        assertEqualsSingleValue(singular[6], 'нелюде');

        const p = rne.pluralize(lemma);
        assertEqualsSingleValue(p, 'нелюди');

        const plural = RussianNouns.CASES.map(c => {
            return rne.decline(lemma, c, p[0]);
        });

        assertIsArray(plural);
        assertEquals(plural.length, 7);

        assertEqualsSingleValue(plural[0], 'нелюди');
        assertEqualsSingleValue(plural[1], 'нелюдей');
        assertEqualsSingleValue(plural[2], 'нелюдям');
        assertEqualsSingleValue(plural[3], 'нелюдей');
        assertEqualsSingleValue(plural[4], 'нелюдями');
        assertEqualsSingleValue(plural[5], 'нелюдях');
        assertEqualsSingleValue(plural[6], 'нелюдях');
    })();

    // TODO more words

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

        assertIsArray(result);
        assertEquals(result.length, 7);

        for (let i = 0; i < 7; i++) {
            assertIsArray(result[i]);
        }

        assertEqualsSingleValue(result[0], 'адаптировавший');
        assertEqualsSingleValue(result[1], 'адаптировавшего');
        assertEqualsSingleValue(result[2], 'адаптировавшему');
        assertEqualsSingleValue(result[3], 'адаптировавшего');
        assertEqualsSingleValue(result[4], 'адаптировавшим');
        assertEqualsSingleValue(result[5], 'адаптировавшем');
        assertEqualsSingleValue(result[6], 'адаптировавшем');

        console.log('--------------- 2 ----------------');
    })();

    const адаптировавшее = L({text: 'адаптировавшее', gender: Gender.NEUTER});

    (() => {
        const result = RussianNouns.CASES.map(c => {
            return rne.decline(адаптировавшее, c);
        });

        assertIsArray(result);
        assertEquals(result.length, 7);

        for (let i = 0; i < 7; i++) {
            assertIsArray(result[i]);
        }

        assertEqualsSingleValue(result[0], 'адаптировавшее');
        assertEqualsSingleValue(result[1], 'адаптировавшего');
        assertEqualsSingleValue(result[2], 'адаптировавшему');
        assertEqualsSingleValue(result[3], 'адаптировавшее');
        assertEqualsSingleValue(result[4], 'адаптировавшим');
        assertEqualsSingleValue(result[5], 'адаптировавшем');
        assertEqualsSingleValue(result[6], 'адаптировавшем');

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
