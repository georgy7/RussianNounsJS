(() => {

    RussianNouns.caseList();

    RussianNouns.genders();

    const rne = new RussianNouns.Engine();

    console.log(rne.decline({text: 'имя', gender: 'средний'}, 'родительный'));

    console.log(rne.decline({text: 'имя', gender: 'средний'}, 'творительный'));

    const Gender = RussianNouns.genders();
    const Case = RussianNouns.cases();

    let coat = {
        text: 'пальто',
        gender: Gender.NEUTER,
        indeclinable: true
    };

    console.log(rne.decline(coat, Case.GENITIVE));

    console.log(RussianNouns.getDeclension(coat));

    let mountain = {
        text: 'гора',
        gender: 'женский'
    };

    console.log(RussianNouns.caseList().map(c => {
        return rne.decline(mountain, c);
    }));

    console.log(rne.pluralize(mountain));

    console.log(RussianNouns.getDeclension(mountain));

    console.log(RussianNouns.getSchoolDeclension(mountain));

    let way = {
        text: 'путь',
        gender: 'мужской'
    };

    console.log(RussianNouns.getDeclension(way));

    let кринж = {
        text: 'кринж',
        gender: Gender.MASCULINE
    };

    console.log(rne.decline(кринж, Case.INSTRUMENTAL));

    // Changing stresses.
    // Before the hyphen, there are singular settings.
    // After the hyphen are the plural settings.
    // The letter number in the settings is the case number in caseList().
    // S — Stress is on the stem only.
    // s — Stress is more often on the stem.
    // b — Stress can be both on the stem and the ending equally.
    // e — Stress is more often on the ending.
    // E — Stress is on the ending only.
    rne.sd.put(кринж, 'SEESESE-EEEEEE');
    console.log(rne.decline(кринж, Case.INSTRUMENTAL));

    rne.sd.put(кринж, 'SEESbSE-EEEEEE');
    console.log(rne.decline(кринж, Case.INSTRUMENTAL));

    rne.sd.put(кринж, 'SEESsSE-EEEEEE');
    console.log(rne.decline(кринж, Case.INSTRUMENTAL));

    rne.sd.put(кринж, 'SEESeSE-EEEEEE');
    console.log(rne.decline(кринж, Case.INSTRUMENTAL));
})();

(() => {

    const rne = new RussianNouns.Engine();

    const Ⰳ = (word, caseNumber) => {
        const c = RussianNouns.caseList()[caseNumber - 1];
        return rne.decline(word, c)[0];
    };

    const Ⰴ = (word, caseNumber) => {
        const c = RussianNouns.caseList()[caseNumber - 1];
        const result = rne.decline(word, c);
        return result[result.length - 1];
    };

    const ⰃⰃ = (word, caseNumber) => {
        const c = RussianNouns.caseList()[caseNumber - 1];
        const pluralForm = rne.pluralize(word)[0];
        return rne.decline(word, c, pluralForm)[0];
    };

    const L = RussianNouns.createLemma;

    const Gender = RussianNouns.genders();

    const cap = (str) => str[0].toUpperCase() + str.substring(1);

// -----------------------------------------------

// Александр Сергеевич Пушкин
// Зимний вечер (фрагмент)

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

    console.log(`${cap(Ⰳ(буря, 1))} ${Ⰴ(мгла, 5)} ${Ⰳ(небо, 4)} кроет,
${cap(ⰃⰃ(вихрь, 4))} снежные крутя;
То, как ${Ⰳ(зверь, 1)}, она завоет,
То заплачет, как ${Ⰳ(дитя, 1)},
То по ${Ⰳ(кровля, 3)} обветшалой
Вдруг ${Ⰳ(солома, 5)} зашумит,
То, как ${Ⰳ(путник, 1)} запоздалый,
К нам в ${Ⰳ(окошко, 4)} застучит.`);

// -----------------------------------------------

// Фёдор Иванович Тютчев
// Лебедь

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

    console.log(`* * *
Пускай ${Ⰳ(орел, 1)} за ${ⰃⰃ(облако, 5)}
Встречает ${Ⰳ(молния, 2)} ${Ⰳ(полет, 4)}
И неподвижными ${ⰃⰃ(око, 5)}
В себя впивает ${Ⰳ(солнце, 2)} ${Ⰳ(свет, 4)}.

Но нет завиднее ${Ⰳ(удел, 2)},
О ${Ⰳ(лебедь, 1)} чистый, твоего –
И чистой, как ты сам, одело
Тебя ${Ⰳ(стихия, 5)} ${Ⰳ(божество, 1)}

Она, между двойною ${Ⰳ(бездна, 5)},
Лелеет твой всезрящий ${Ⰳ(сон, 4)} –
И полной ${Ⰳ(слава, 5)} ${Ⰳ(твердь, 2)} звездной
Ты отовсюду окружен.`);

// -----------------------------------------------

// Николай Степанович Гумилев
// Рассказ девушки (фрагмент)

    const ворота = L({text: 'ворота', pluraliaTantum: true});
    const тень = L({text: 'тень', gender: Gender.FEMININE});
    const ель = L({text: 'ель', gender: Gender.FEMININE});
    const снег = L({text: 'снег', gender: Gender.MASCULINE});
    const высота = L({text: 'высота', gender: Gender.FEMININE});

    console.log(`* * *
Я отдыхала у ${ⰃⰃ(ворота, 2)}
Под ${Ⰳ(тень, 5)} милой, старой ${Ⰳ(ель, 2)},
А надо мною пламенели
${cap(ⰃⰃ(снег, 1))} неведомых ${ⰃⰃ(высота, 2)}.`);

// -----------------------------------------------

// Александр Иванович Введенский
// Потец (фрагмент)

    const лошадь = L({text: 'лошадь', gender: Gender.FEMININE, animate: true});
    const конь = L({text: 'конь', gender: Gender.MASCULINE, animate: true});

    const волна = L({text: 'волна', gender: Gender.FEMININE});
    const подкова = L({text: 'подкова', gender: Gender.FEMININE});
    const жар = L({text: 'жар', gender: Gender.MASCULINE});

    console.log(`* * *
Несутся ${ⰃⰃ(лошадь, 1)} как ${ⰃⰃ(волна, 1)},
Стучат ${ⰃⰃ(подкова, 1)}.
Лихие ${ⰃⰃ(конь, 1)} ${Ⰳ(жар, 5)} полны
Исчезнув скачут.`);

})();

