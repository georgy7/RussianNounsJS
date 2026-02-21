import { test } from "node:test";
import assert from "node:assert";

import { Case, CASES, Engine, Gender, Lemma, LocativeForm, LocativeFormAttribute, createLemma, createLemmaOrNull } from "../src/index.js"


test("API: basic usage", () => {
    const rne = new Engine();

    let result;

    result = rne.decline({text: 'имя', gender: Gender.NEUTER}, Case.GENITIVE);
    assertHasOneItem(result, "имени");

    result = rne.decline({text: 'имя', gender: Gender.NEUTER}, Case.INSTRUMENTAL);
    assertHasOneItem(result, "именем");

    // ---------------

    let coat = createLemma({
        text: 'пальто',
        gender: Gender.NEUTER,
        indeclinable: true
    });

    result = rne.decline(coat, Case.GENITIVE);
    assertHasOneItem(result, "пальто");

    assert.strictEqual(coat.getDeclension(), -1);

    let mountain = createLemma({
        text: 'гора',
        gender: Gender.FEMININE
    });

    result = CASES.map(c => {
        return rne.decline(mountain, c);
    });

    assertAllEqual(result, ['гора', 'горы', 'горе', 'гору', ['горой', 'горою'], 'горе', 'горе']);

    // ---------------

    result = rne.pluralize(mountain);
    assertHasOneItem(result, "горы");
    const pluralMountain = result[0];

    // ---------------

    result = CASES.map(c => {
        return rne.decline(mountain, c, pluralMountain);
    });

    assertAllEqual(result, ['горы', 'гор', 'горам', 'горы', 'горами', 'горах', 'горах']);

    // ---------------

    assert.strictEqual(mountain.getDeclension(), 2);
    assert.strictEqual(mountain.getSchoolDeclension(), 1);

    // ---------------

    let way = createLemma({
        text: 'путь',
        gender: Gender.MASCULINE
    });

    assert.strictEqual(way.getDeclension(), 0);

    // ---------------

    const scissors = createLemma({
        text: 'ножницы',
        pluraleTantum: true
    });

    result = rne.pluralize(scissors);
    assert.ok(result instanceof Array);
    assertHasOneItem(result, 'ножницы');

    // ---------------

    result = CASES.map(c => {
        return rne.decline(scissors, c);
    });

    assertAllEqual(result, ['ножницы', 'ножниц', 'ножницам', 'ножницы', 'ножницами', 'ножницах', 'ножницах']);
});


test("API: stress dictionary tuning", () => {
    // Изменения настроек должны затрагивать только один движок
    const rne = new Engine();
    const rneControl = new Engine();

    let result;
    let control;

    let cringe = createLemma({
        text: 'кринж',
        gender: Gender.MASCULINE
    });

    result = rne.decline(cringe, Case.INSTRUMENTAL);
    assertHasOneItem(result, "кринжем");
    control = rneControl.decline(cringe, Case.INSTRUMENTAL);
    assertHasOneItem(control, "кринжем");

    rne.sd.put(cringe, 'SEESESE-EEEEEE');
    result = rne.decline(cringe, Case.INSTRUMENTAL);
    assertHasOneItem(result, "кринжом");

    control = rneControl.decline(cringe, Case.INSTRUMENTAL);
    assertHasOneItem(control, "кринжем");

    rne.sd.put(cringe, 'SEESbSE-EEEEEE');
    result = rne.decline(cringe, Case.INSTRUMENTAL);
    assert.ok(result instanceof Array);
    assert.strictEqual(result.length, 2);
    assert.strictEqual(result[0], "кринжем");
    assert.strictEqual(result[1], "кринжом");

    control = rneControl.decline(cringe, Case.INSTRUMENTAL);
    assertHasOneItem(control, "кринжем");

    rne.sd.put(cringe, 'SEESsSE-EEEEEE');
    result = rne.decline(cringe, Case.INSTRUMENTAL);
    assert.ok(result instanceof Array);
    assert.strictEqual(result.length, 2);
    assert.strictEqual(result[0], "кринжем");
    assert.strictEqual(result[1], "кринжом");

    control = rneControl.decline(cringe, Case.INSTRUMENTAL);
    assertHasOneItem(control, "кринжем");

    rne.sd.put(cringe, 'SEESeSE-EEEEEE');
    result = rne.decline(cringe, Case.INSTRUMENTAL);
    assert.ok(result instanceof Array);
    assert.strictEqual(result.length, 2);
    assert.strictEqual(result[0], "кринжом");
    assert.strictEqual(result[1], "кринжем");

    control = rneControl.decline(cringe, Case.INSTRUMENTAL);
    assertHasOneItem(control, "кринжем");
});


test("API: getLocativeForms basic usage", () => {
    const rne = new Engine();

    let row = createLemma({
        text: 'ряд',
        gender: Gender.MASCULINE
    });

    const result = CASES.map(c => {
        return rne.decline(row, c);
    });

    assertAllEqual(result, ['ряд', 'ряда', 'ряду', 'ряд', 'рядом', 'ряде', 'ряду']);

    assert.ok(rne.getLocativeForms(row) instanceof Array);
    assert.strictEqual(rne.getLocativeForms(row).length, 1, 'locative forms count');
    assert.strictEqual(rne.getLocativeForms(row)[0].preposition, 'в', 'lf.preposition');
    assert.strictEqual(rne.getLocativeForms(row)[0].word, 'ряду', 'lf.word');

    assert.strictEqual(
        rne.getLocativeForms(row)[0].attributes,
        LocativeFormAttribute.STRUCTURE,
        'lf.semantics'
    );

    const ball = createLemma({
        text: 'мяч',
        gender: Gender.MASCULINE
    });

    assert.ok(rne.getLocativeForms(ball) instanceof Array);
    assert.strictEqual(rne.getLocativeForms(ball).length, 0);
});


test("API: getLocativeForms multiple choices", () => {
    const rne = new Engine();

    const steam = createLemma({
        text: 'пар',
        gender: Gender.MASCULINE
    });

    const steamLocativeForms = rne.getLocativeForms(steam);
    assert.ok(steamLocativeForms instanceof Array);

    function findFormWithSingleAttribute(locativeForms, attribute) {
        return locativeForms.filter(f => f.attributes === attribute);
    }

    const steamSubstance = findFormWithSingleAttribute(steamLocativeForms, LocativeFormAttribute.SUBSTANCE);
    const steamResource = findFormWithSingleAttribute(steamLocativeForms, LocativeFormAttribute.RESOURCE);
    const steamSurface = findFormWithSingleAttribute(steamLocativeForms, LocativeFormAttribute.SURFACE);

    assert.strictEqual(steamSubstance.length, 1, 'Steam as a substance must have a locative form.');
    assert.strictEqual(steamResource.length, 1, 'Steam as a resource must have a locative form.');
    assert.strictEqual(steamSurface.length, 0, 'Steam as a surface must not have a locative form.');

    assert.strictEqual(steamSubstance[0].preposition, 'в', 'Steam as a substance has incorrect preposition.');
    assert.strictEqual(steamResource[0].preposition, 'на', 'Steam as a resource has incorrect preposition.');

    assert.strictEqual(steamSubstance[0].word, 'пару', 'Steam as a substance has incorrect word form.');
    assert.strictEqual(steamResource[0].word, 'пару', 'Steam as a resource has incorrect word form.');
});


test("API: argument validation", () => {
    assert.throws(() => {
        createLemma(123);
    });

    assert.throws(() => {
        createLemma('гора');
    });

    assert.throws(() => {
        createLemma(null);
    });

    assert.throws(() => {
        createLemma(undefined);
    });

    assert.throws(() => {
        createLemma({});
    });

    assert.throws(() => {
        createLemma({
            text: 'гора'
        });
    });

    assert.throws(() => {
        createLemma({
            text: 'гора',
            gender: 'fgsfds'
        });
    });

    assert.throws(() => {
        createLemma({
            text: 'ножницы',
            pluraleTantum: 123
        });
    });

    assert.throws(() => {
        createLemma({
            text: 'пальто',
            gender: Gender.NEUTER,
            indeclinable: 'fgsfds'
        });
    });

    assert.throws(() => {
        createLemma({
            text: 'трактор',
            gender: Gender.MASCULINE,
            transport: 'наземный'
        });
    });

    assert.throws(() => {
        createLemma({
            gender: Gender.MASCULINE
        });
    });

    (() => {
        const k = createLemma({
            text: 'гора',
            gender: Gender.FEMININE
        });
        assert.strictEqual(k.text(), 'гора');
        assert.strictEqual(k.getGender(), Gender.FEMININE);
        assert.strictEqual(k.isPluraleTantum(), false);
        assert.strictEqual(k.isIndeclinable(), false);
    })();

    (() => {
        const k = Lemma.create({
            text: 'ножницы',
            pluraleTantum: true
        });
        assert.strictEqual(k.text(), 'ножницы');
        assert.strictEqual(k.isPluraleTantum(), true);
        assert.strictEqual(k.getGender(), undefined);
        assert.strictEqual(k.isIndeclinable(), false);

        const l = createLemma(k);
        assert.strictEqual(l, k);
    })();

    assert.strictEqual(null, createLemmaOrNull(123));
    assert.strictEqual(null, Lemma.createOrNull(123));
    assert.strictEqual(null, createLemmaOrNull('гора'));
    assert.strictEqual(null, createLemmaOrNull(null));
    assert.strictEqual(null, createLemmaOrNull(undefined));
    assert.strictEqual(null, createLemmaOrNull({}));

    assert.strictEqual(null, createLemmaOrNull({
        text: 'гора'
    }));

    assert.strictEqual(null, createLemmaOrNull({
        text: 'гора',
        gender: 'fgsfds'
    }));

    assert.strictEqual(null, createLemmaOrNull({
        text: 'ножницы',
        pluraleTantum: 123
    }));

    assert.strictEqual(null, createLemmaOrNull({
        text: 'пальто',
        gender: Gender.NEUTER,
        indeclinable: 'fgsfds'
    }));

    assert.strictEqual(null, createLemmaOrNull({
        text: 'трактор',
        gender: Gender.MASCULINE,
        transport: 'наземный'
    }));

    assert.strictEqual(null, createLemmaOrNull({
        gender: Gender.MASCULINE
    }));

    const x = createLemmaOrNull({
        text: 'гора',
        gender: Gender.FEMININE
    });
    assert.strictEqual(x instanceof Lemma, true);
    assert.strictEqual(x.text(), 'гора');
    assert.strictEqual(x.getGender(), Gender.FEMININE);
    assert.strictEqual(x.isPluraleTantum(), false);
    assert.strictEqual(x.isIndeclinable(), false);

    const y = Lemma.createOrNull({
        text: 'ножницы',
        pluraleTantum: true
    });
    assert.strictEqual(y instanceof Lemma, true);
    assert.strictEqual(y.text(), 'ножницы');
    assert.strictEqual(y.isPluraleTantum(), true);
    assert.strictEqual(y.getGender(), undefined);
    assert.strictEqual(y.isIndeclinable(), false);
});


test("API: complex examples", () => {
    const rne = new Engine();

    function usual(lemma, caseNumber) {
        const c = CASES[caseNumber - 1];
        return rne.decline(lemma, c)[0];
    }

    // To get a little-used or older form.
    function unusual(lemma, caseNumber) {
        const c = CASES[caseNumber - 1];
        const result = rne.decline(lemma, c);
        return result[result.length - 1];
    }

    function plural(lemma, caseNumber) {
        const c = CASES[caseNumber - 1];
        const pluralForm = rne.pluralize(lemma)[0];
        return rne.decline(lemma, c, pluralForm)[0];
    }

    function cap(str) {
        return str[0].toUpperCase() + str.substring(1);
    }

    // Зиний вечер Пушкина

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

    assert.strictEqual(
        `${cap(usual(буря, 1))} ${unusual(мгла, 5)} ${usual(небо, 4)} кроет,`,
        'Буря мглою небо кроет,'
    );

    assert.strictEqual(
        `${cap(plural(вихрь, 4))} ${plural(снежный, 4)} крутя;`,
        'Вихри снежные крутя;'
    );

    assert.strictEqual(
        `То, как ${usual(зверь, 1)}, она завоет,`,
        'То, как зверь, она завоет,'
    );

    assert.strictEqual(
        `То заплачет, как ${usual(дитя, 1)},`,
        'То заплачет, как дитя,'
    );

    assert.strictEqual(
        `То по ${usual(кровля, 3)} ${usual(обветшалая, 3)}`,
        'То по кровле обветшалой'
    );

    assert.strictEqual(
        `Вдруг ${usual(солома, 5)} зашумит,`,
        'Вдруг соломой зашумит,'
    );

    assert.strictEqual(
        `То, как ${usual(путник, 1)} ${usual(запоздалый, 1)},`,
        'То, как путник запоздалый,'
    );

    assert.strictEqual(
        `К нам в ${usual(окошко, 4)} застучит.`,
        'К нам в окошко застучит.'
    );

    // ---

    // Рассказ девушки (Гумилёв)

    const ворота = createLemma({text: 'ворота', pluraleTantum: true});
    const тень = createLemma({text: 'тень', gender: Gender.FEMININE});
    const снег = createLemma({text: 'снег', gender: Gender.MASCULINE});

    const милая = createLemma({text: 'милая', gender: Gender.FEMININE});
    const старая = createLemma({text: 'старая', gender: Gender.FEMININE});
    const ель = createLemma({text: 'ель', gender: Gender.FEMININE});

    const неведомая = createLemma({text: 'неведомая', gender: Gender.FEMININE});
    const высота = createLemma({text: 'высота', gender: Gender.FEMININE});

    assert.strictEqual(true, ворота.isPluraleTantum());

    assert.strictEqual(
        `Я отдыхала у ${plural(ворота, 2)}`,
        'Я отдыхала у ворот'
    );

    assert.strictEqual(
        `Под ${usual(тень, 5)} ${usual(милая, 2)}, ${usual(старая, 2)} ${usual(ель, 2)},`,
        'Под тенью милой, старой ели,'
    );

    assert.strictEqual(
        `А надо мною пламенели`,
        'А надо мною пламенели'
    );

    assert.strictEqual(
        `${cap(plural(снег, 1))} ${plural(неведомая, 2)} ${plural(высота, 2)}.`,
        'Снега неведомых высот.'
    );

    // ---

    // Лебедь (Фёдор Иванович Тютчев)

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

    assert.strictEqual(
        `Пускай ${usual(орел, 1)} за ${plural(облако, 5)}`,
        'Пускай орел за облаками'
    );

    assert.strictEqual(
        `Встречает ${usual(молния, 2)} ${usual(полет, 4)}`,
        'Встречает молнии полет'
    );

    assert.strictEqual(
        `И ${plural(неподвижное, 5)} ${plural(око, 5)}`,
        'И неподвижными очами'
    );

    assert.strictEqual(
        `В себя впивает ${usual(солнце, 2)} ${usual(свет, 4)}.`,
        'В себя впивает солнца свет.'
    );

    assert.strictEqual(
        `Но нет завиднее ${usual(удел, 2)},`,
        'Но нет завиднее удела,'
    );

    assert.strictEqual(
        `О, ${usual(лебедь, 1)} ${usual(чистый, 1)}, твоего!`,
        'О, лебедь чистый, твоего!'
    );

    assert.strictEqual(
        `И ${usual(чистая, 5)}, как ты сам, одело`,
        'И чистой, как ты сам, одело'
    );

    assert.strictEqual(
        `Тебя ${usual(стихия, 5)} ${cap(usual(божество, 1))}.`,
        'Тебя стихией Божество.'
    );

    assert.strictEqual(
        `Она между ${unusual(двойная, 5)} ${usual(бездна, 5)}`,
        'Она между двойною бездной'
    );

    assert.strictEqual(
        `Лелеет твой ${usual(всезрящий, 4)} ${usual(сон, 4)},`,
        'Лелеет твой всезрящий сон,'
    );

    assert.strictEqual(
        `И ${usual(полная, 5)} ${usual(слава, 5)} ${usual(твердь, 2)} ${usual(звездная, 2)}`,
        'И полной славой тверди звездной'
    );

    assert.strictEqual(
        `Ты отовсюду окружен.`,
        'Ты отовсюду окружен.'
    );

    // ---

    // Потец (Александр Введенский)

    const лошадь = createLemma({text: 'лошадь', gender: Gender.FEMININE, animate: true});
    const конь = createLemma({text: 'конь', gender: Gender.MASCULINE, animate: true});

    const волна = createLemma({text: 'волна', gender: Gender.FEMININE});
    const подкова = createLemma({text: 'подкова', gender: Gender.FEMININE});
    const жар = createLemma({text: 'жар', gender: Gender.MASCULINE});

    assert.strictEqual(
        `Несутся ${plural(лошадь, 1)} как ${plural(волна, 1)},`,
        'Несутся лошади как волны,'
    );

    assert.strictEqual(
        `Стучат ${plural(подкова, 1)}.`,
        'Стучат подковы.'
    );

    assert.strictEqual(
        `Лихие ${plural(конь, 1)} ${usual(жар, 5)} полны.`,
        'Лихие кони жаром полны.'
    );

    assert.strictEqual(
        `Исчезнув скачут.`,
        'Исчезнув скачут.'
    );
});


const checkSingularAndPluralBase = (rne, lemma, expectedSingular, expectedPlural) => {
    const singular = CASES.map(c => {
        return rne.decline(lemma, c);
    });

    assertAllEqual(singular, expectedSingular);

    const p = rne.pluralize(lemma);
    assertHasOneItem(p, expectedPlural[0]);

    const plural = CASES.map(c => {
        return rne.decline(lemma, c, p[0]);
    });

    assertAllEqual(plural, expectedPlural);
};

const checkSingularBase = (rne, lemma, expectedSingular) => {
    const singular = CASES.map(c => {
        return rne.decline(lemma, c);
    });

    assertAllEqual(singular, expectedSingular);
};


test("some nouns", () => {
    const rne = new Engine();
    const checkSingularAndPlural = (l, s, p) => checkSingularAndPluralBase(rne, l, s, p);
    const checkSingular = (l, s) => checkSingularBase(rne, l, s);

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
});


test("some adjectives and participles", () => {
    const rne = new Engine();
    const checkSingularAndPlural = (l, s, p) => checkSingularAndPluralBase(rne, l, s, p);

    const лихой = createLemma({text: 'лихой', gender: Gender.MASCULINE, animate: true});
    assert.strictEqual(rne.pluralize(лихой)[0], 'лихие');

    const адаптировавший = createLemma({text: 'адаптировавший', gender: Gender.MASCULINE, animate: true});

    (() => {
        const result = CASES.map(c => {
            return rne.decline(адаптировавший, c);
        });

        assertAllEqual(result, [
            'адаптировавший',
            'адаптировавшего',
            'адаптировавшему',
            'адаптировавшего',
            'адаптировавшим',
            'адаптировавшем',
            'адаптировавшем'
        ]);
    })();

    const адаптировавшее = createLemma({text: 'адаптировавшее', gender: Gender.NEUTER});

    (() => {
        const result = CASES.map(c => {
            return rne.decline(адаптировавшее, c);
        });

        assertAllEqual(result, [
            'адаптировавшее',
            'адаптировавшего',
            'адаптировавшему',
            'адаптировавшее',
            'адаптировавшим',
            'адаптировавшем',
            'адаптировавшем'
        ]);
    })();

    const адаптировавшая = createLemma({text: 'адаптировавшая', gender: Gender.FEMININE});

    (() => {
        const result = CASES.map(c => {
            return rne.decline(адаптировавшая, c);
        });

        assert.ok(result instanceof Array);
        assert.strictEqual(result.length, 7);

        for (let i = 0; i < 7; i++) {
            assert.ok(result[i] instanceof Array);
        }

        assertHasOneItem(result[0], 'адаптировавшая');
        assertHasOneItem(result[1], 'адаптировавшей');
        assertHasOneItem(result[2], 'адаптировавшей');
        assertHasOneItem(result[3], 'адаптировавшую');

        // TODO
        // assert.strictEqual(result[4].length, 2);
        // assert.strictEqual(result[4][0], 'адаптировавшей');
        // assert.strictEqual(result[4][1], 'адаптировавшею');
        assert.strictEqual(result[4][0], 'адаптировавшею');

        assertHasOneItem(result[5], 'адаптировавшей');
        assertHasOneItem(result[6], 'адаптировавшей');
    })();

    (() => {
        const k = rne.pluralize(адаптировавший);
        const m = rne.pluralize(адаптировавшая);
        const n = rne.pluralize(адаптировавшее);
        const expectedPlural = 'адаптировавшие';

        assertHasOneItem(k, expectedPlural);
        assertHasOneItem(m, expectedPlural);
        assertHasOneItem(n, expectedPlural);

        function checkCases(lemma) {
            const result = CASES.map(c => {
                return rne.decline(lemma, c, expectedPlural);
            });

            assertHasOneItem(result[0], expectedPlural);
            assertHasOneItem(result[1], 'адаптировавших');
            assertHasOneItem(result[2], 'адаптировавшим');

            if (lemma.isAnimate()) {
                assertHasOneItem(result[3], 'адаптировавших');
            } else {
                assertHasOneItem(result[3], 'адаптировавшие');
            }

            assertHasOneItem(result[4], 'адаптировавшими');
            assertHasOneItem(result[5], 'адаптировавших');
            assertHasOneItem(result[6], 'адаптировавших');
        }

        checkCases(адаптировавший);
        checkCases(адаптировавшая);
        checkCases(адаптировавшее);
    })();

    const nimblePluralForms = [
        'ловкие',
        'ловких',
        'ловким',
        'ловких',
        'ловкими',
        'ловких',
        'ловких'
    ];

    function inanimateForms(arr) {
        const r = arr.slice();
        r[3] = r[0];
        return r;
    }

    checkSingularAndPlural(
        createLemma({text: 'ловкий', gender: Gender.MASCULINE, animate: true}),
        [
            'ловкий',
            'ловкого',
            'ловкому',
            'ловкого',
            'ловким',
            'ловком',
            'ловком'
        ],
        nimblePluralForms
    );

    checkSingularAndPlural(
        createLemma({text: 'ловкий', gender: Gender.MASCULINE}),
        [
            'ловкий',
            'ловкого',
            'ловкому',
            'ловкий',
            'ловким',
            'ловком',
            'ловком'
        ],
        inanimateForms(nimblePluralForms)
    );

    checkSingularAndPlural(
        createLemma({text: 'ловкая', gender: Gender.FEMININE, animate: true}),
        [
            'ловкая',
            'ловкой',
            'ловкой',
            'ловкую',
            ['ловкой', 'ловкою'],
            'ловкой',
            'ловкой'
        ],
        nimblePluralForms
    );

    checkSingularAndPlural(
        createLemma({text: 'ловкая', gender: Gender.FEMININE}),
        [
            'ловкая',
            'ловкой',
            'ловкой',
            'ловкую',
            ['ловкой', 'ловкою'],
            'ловкой',
            'ловкой'
        ],
        inanimateForms(nimblePluralForms)
    );

    checkSingularAndPlural(
        createLemma({text: 'ловкое', gender: Gender.NEUTER}),
        [
            'ловкое',
            'ловкого',
            'ловкому',
            'ловкое',
            'ловким',
            'ловком',
            'ловком'
        ],
        inanimateForms(nimblePluralForms)
    );

    const redPluralForms = [
        'красные',
        'красных',
        'красным',
        'красных',
        'красными',
        'красных',
        'красных'
    ];

    checkSingularAndPlural(
        createLemma({text: 'красный', gender: Gender.MASCULINE}),
        [
            'красный',
            'красного',
            'красному',
            'красный',
            'красным',
            'красном',
            'красном'
        ],
        inanimateForms(redPluralForms)
    );

    checkSingularAndPlural(
        createLemma({text: 'красная', gender: Gender.FEMININE}),
        [
            'красная',
            'красной',
            'красной',
            'красную',
            ['красной', 'красною'],
            'красной',
            'красной'
        ],
        inanimateForms(redPluralForms)
    );

    checkSingularAndPlural(
        createLemma({text: 'красное', gender: Gender.NEUTER}),
        [
            'красное',
            'красного',
            'красному',
            'красное',
            'красным',
            'красном',
            'красном'
        ],
        inanimateForms(redPluralForms)
    );

    const whitePluralForms = [
        'белые',
        'белых',
        'белым',
        'белых',
        'белыми',
        'белых',
        'белых'
    ];

    checkSingularAndPlural(
        createLemma({text: 'белый', gender: Gender.MASCULINE}),
        [
            'белый',
            'белого',
            'белому',
            'белый',
            'белым',
            'белом',
            'белом'
        ],
        inanimateForms(whitePluralForms)
    );

    checkSingularAndPlural(
        createLemma({text: 'белая', gender: Gender.FEMININE}),
        [
            'белая',
            'белой',
            'белой',
            'белую',
            ['белой', 'белою'],
            'белой',
            'белой'
        ],
        inanimateForms(whitePluralForms)
    );

    checkSingularAndPlural(
        createLemma({text: 'белое', gender: Gender.NEUTER}),
        [
            'белое',
            'белого',
            'белому',
            'белое',
            'белым',
            'белом',
            'белом'
        ],
        inanimateForms(whitePluralForms)
    );

    const deafPluralForms = [
        'глухие',
        'глухих',
        'глухим',
        'глухих',
        'глухими',
        'глухих',
        'глухих'
    ];

    checkSingularAndPlural(
        createLemma({text: 'глухой', gender: Gender.MASCULINE, animate: true}),
        [
            'глухой',
            'глухого',
            'глухому',
            'глухого',
            'глухим',
            'глухом',
            'глухом'
        ],
        deafPluralForms
    );

    checkSingularAndPlural(
        createLemma({text: 'глухой', gender: Gender.MASCULINE}),
        [
            'глухой',
            'глухого',
            'глухому',
            'глухой',
            'глухим',
            'глухом',
            'глухом'
        ],
        inanimateForms(deafPluralForms)
    );

    checkSingularAndPlural(
        createLemma({text: 'глухая', gender: Gender.FEMININE, animate: true}),
        [
            'глухая',
            'глухой',
            'глухой',
            'глухую',
            ['глухой', 'глухою'],
            'глухой',
            'глухой'
        ],
        deafPluralForms
    );

    checkSingularAndPlural(
        createLemma({text: 'глухая', gender: Gender.FEMININE}),
        [
            'глухая',
            'глухой',
            'глухой',
            'глухую',
            ['глухой', 'глухою'],
            'глухой',
            'глухой'
        ],
        inanimateForms(deafPluralForms)
    );

    checkSingularAndPlural(
        createLemma({text: 'глухое', gender: Gender.NEUTER}),
        [
            'глухое',
            'глухого',
            'глухому',
            'глухое',
            'глухим',
            'глухом',
            'глухом'
        ],
        inanimateForms(deafPluralForms)
    );
});


function assertHasOneItem(actualArray, expectedItem) {
    const arrayAsString = '' + actualArray;
    assert.ok(actualArray instanceof Array, arrayAsString);
    assert.strictEqual(actualArray.length, 1, `[${arrayAsString}] (expected ${expectedItem})`);
    assert.strictEqual(actualArray[0], expectedItem);
}

function assertAllEqual(results, expectedValues) {
    assert.ok(results instanceof Array);
    assert.ok(expectedValues instanceof Array);

    assert.strictEqual(results.length, 7);
    assert.strictEqual(expectedValues.length, 7);

    for (let i = 0; i < 7; i++) {
        const actual = results[i];
        const expected = expectedValues[i];

        assert.ok(actual instanceof Array);

        if (typeof expected === 'string') {
            assertHasOneItem(actual, expected);
        } else if (expected instanceof Array) {
            assert.strictEqual(actual.length, expected.length, [actual, expected].toString());
            for (let j = 0; j < expected.length; j++) {
                assert.strictEqual(actual[j], expected[j]);
            }
        } else {
            assert.fail(`Bad expected value: ${expected} is neither an array nor a string.`);
        }
    }
}
