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

RussianNouns.caseList().map(c => {
    return RussianNouns.decline(mountain, c);
});
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

**[Demo](https://georgy7.github.io/russian_nouns/)**  :point_left:

[Run tests in web-browser](https://georgy7.github.io/russian_nouns/testing.html) (based on OpenCorpora)

## Features/bugs

* Only in the singular.
* The method getDeclension(lemma) returns 3 for "знамя", "вымя", etc. It works for singular.

## References
- Современный русский язык. Морфология - Камынина А.А., Уч. пос. 1999 - 240 с.
- http://en.wikipedia.org/wiki/Russian_grammar
- К семантике русского локатива ("второго предложного" падежа) - Плунгян В. А., Семиотика и информатика. - Вып. 37. - М., 2002. - С. 229-254