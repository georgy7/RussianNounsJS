# RussianNounsJS

## Features

* Declination of words. Only in the singular yet.
* Pluralization in the nominative case.

## Requirements

* EcmaScript 7

## Usage

```js
RussianNouns.caseList();
// [
//     "именительный",
//     "родительный",
//     "дательный",
//     "винительный",
//     "творительный",
//     "предложный",
//     "местный"
// ]

// Grammatical gender is a noun class system in Russian.
RussianNouns.genders();
// {
//     FEMININE: "женский",
//     MASCULINE: "мужской",
//     NEUTER: "средний",
//     COMMON: "общий"
// }

const rne = new RussianNouns.Engine();

rne.decline({text: 'имя', gender: 'средний'}, 'родительный');
// [ "имени" ]

rne.decline({text: 'имя', gender: 'средний'}, 'творительный');
// [ "именем" ]

const Gender = RussianNouns.genders();
const Case = RussianNouns.cases();

let coat = {
    text: 'пальто',
    gender: Gender.NEUTER,
    indeclinable: true
};

rne.decline(coat, Case.GENITIVE);
// [ "пальто" ]

RussianNouns.getDeclension(coat);
// -1

let mountain = {
    text: 'гора',
    gender: 'женский'
};

RussianNouns.caseList().map(c => {
    return rne.decline(mountain, c);
});
// [
//     ["гора"]
//     ["горы"]
//     ["горе"]
//     ["гору"]
//     ["горой", "горою"]
//     ["горе"],
//     ["горе"]
// ]

rne.pluralize(mountain);
// [ "горы" ]

RussianNouns.getDeclension(mountain);
// 2

RussianNouns.getSchoolDeclension(mountain);
// 1

let way = {
    text: 'путь',
    gender: 'мужской'
};

RussianNouns.getDeclension(way);
// 0

let кринж = {
    text: 'кринж',
    gender: Gender.MASCULINE
};

rne.decline(кринж, Case.INSTRUMENTAL);
// [ "кринжем" ]

// Change of stresses.
// Before the hyphen, there are singular settings.
// After the hyphen are the plural settings.
// The letter number in the settings is the case number in caseList().
// s — stress on the stem.
// e — stress on the ending.
// b — both.
rne.sd.put(кринж, 'seesese-eeeeee');

rne.decline(кринж, Case.INSTRUMENTAL);
// [ "кринжом" ]

```

```js
const rn = RussianNouns;
const getCaseByNumber = (n) => rn.caseList()[n - 1];
const declineSimple = (word, caseNumber) => rn.decline(word, getCaseByNumber(caseNumber))[0];
const Gender = rn.genders();

`Когда мне было 5 лет,
${declineSimple({text: 'мама', gender: Gender.FEMININE, animate: true}, 1)} всегда говорила,
что главное в ${declineSimple({text: 'жизнь', gender: Gender.FEMININE}, 7)} –
${declineSimple({text: 'счастье', gender: Gender.NEUTER}, 1)}. Когда я пошел
в ${declineSimple({text: 'школа', gender: Gender.FEMININE}, 4)},
на ${declineSimple({text: 'вопрос', gender: Gender.MASCULINE}, 4)}, кем я хочу быть,
когда вырасту, я ответил
“счастливым ${declineSimple({text: 'человек', gender: Gender.MASCULINE, animate: true}, 5)}”.
Мне тогда сказали, что я не понимаю
${declineSimple({text: 'вопрос', gender: Gender.MASCULINE}, 4)}, а я ответил, что это они
не понимают ${declineSimple({text: 'жизнь', gender: Gender.NEUTER}, 4)}.

Джон Леннон`
▸ "Когда мне было 5 лет,
мама всегда говорила,
что главное в жизни –
счастье. Когда я пошел
в школу,
на вопрос, кем я хочу быть,
когда вырасту, я ответил
“счастливым человеком”.
Мне тогда сказали, что я не понимаю
вопрос, а я ответил, что это они
не понимают жизнь.

Джон Леннон"
```
**[Demo](https://georgy7.github.io/RussianNounsJS/)**  :point_left:

[Run tests in web-browser](https://georgy7.github.io/RussianNounsJS/testing.html) (based on OpenCorpora)

## References
- Современный русский язык. Морфология - Камынина А.А., Уч. пос. 1999 - 240 с.
- http://en.wikipedia.org/wiki/Russian_grammar
- К семантике русского локатива ("второго предложного" падежа) - Плунгян В. А., Семиотика и информатика. - Вып. 37. - М., 2002. - С. 229-254

## Similar software

- [Petrovich — An inflector for Russian anthroponyms](https://github.com/petrovich)
