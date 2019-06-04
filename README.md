```js
RussianNouns.caseList();
▸ ["именительный", "родительный", "дательный", "винительный", "творительный", "предложный", "местный"]

RussianNouns.genders();
▸ { FEMININE: "женский", MASCULINE: "мужской", NEUTER: "средний", COMMON: "общий" }

RussianNouns.decline({text: 'имя', gender: 'средний'}, 'родительный');
▸ ['имени']

RussianNouns.decline({text: 'имя', gender: 'средний'}, 'творительный');
▸ ['именем']

const genders = RussianNouns.genders();
let coat = RussianNouns.createLemma({
    text: 'пальто',
    gender: genders.NEUTER,
    indeclinable: true
});

RussianNouns.caseList().map(c => {
    return RussianNouns.decline(coat, c);
});
▸ [
  ["пальто"],
  ["пальто"],
  ["пальто"],
  ["пальто"],
  ["пальто"],
  ["пальто"],
  ["пальто"]
]

let mountain = RussianNouns.createLemma({
    text: 'гора',
    gender: 'женский'
});

RussianNouns.caseList().map(c => RussianNouns.decline(mountain, c));
▸ [
  ["гора"]
  ["горы"]
  ["горе"]
  ["гору"]
  ["горой", "горою"]
  ["горе"],
  ["горе"]
]

RussianNouns.getDeclension(mountain);
▸ 2

let way = RussianNouns.createLemma({
    text: 'путь',
    gender: 'мужской'
});

RussianNouns.getDeclension(way);
▸ 0
```

```js
const rn = RussianNouns;
const getCaseByNumber = (n) => rn.caseList()[n - 1];
const Gender = rn.genders();

let отец = {text: 'отец', gender: Gender.MASCULINE};
let генерал = {text: 'генерал', gender: Gender.MASCULINE};
let дуэль = {text: 'дуэль', gender: Gender.FEMININE};
let подлец = {text: 'подлец', gender: Gender.MASCULINE};
let сердце = {text: 'сердце', gender: Gender.NEUTER};

`
Ваш ${rn.decline(отец, getCaseByNumber(1))[0]} вызвал ${rn.decline(генерал, getCaseByNumber(2))[0]}
на ${rn.decline(дуэль, getCaseByNumber(4))[0]}, ${rn.decline(генерал, getCaseByNumber(1))[0]} назвал его... извините,
${rn.decline(подлец, getCaseByNumber(5))[0]}... Потеха была! Мы напоили после их пьяными и помирили...
Нет ничего легче, как мирить русских людей... Добряк был ваш ${rn.decline(отец, getCaseByNumber(1))[0]},
доброе имел ${rn.decline(сердце, getCaseByNumber(4))[0]}.
`
▸ "
Ваш отец вызвал генерала
на дуэль, генерал назвал его... извините,
подльцем... Потеха была! Мы напоили после их пьяными и помирили...
Нет ничего легче, как мирить русских людей... Добряк был ваш отец,
доброе имел сердце.
"
```
**[Demo](https://georgy7.github.io/russian_nouns/)**  :point_left:

[Run tests in web-browser](https://georgy7.github.io/russian_nouns/testing.html) (based on OpenCorpora)

## Features/bugs

* Only in the singular.
* The method getDeclension(lemma) returns 3 for "знамя", "вымя", etc. It works for singular.

## References
- Современный русский язык. Морфология - Камынина А.А., Уч. пос. 1999 - 240 с.
- http://en.wikipedia.org/wiki/Russian_grammar
- К семантике русского локатива ("второго предложного" падежа) - Плунгян В. А., Семиотика и информатика. - Вып. 37. - М., 2002. - С. 229-254

## Similar software

- [Petrovich — An inflector for Russian anthroponyms](https://github.com/petrovich)
