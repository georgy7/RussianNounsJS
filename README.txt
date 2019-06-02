```
RussianNouns.caseList()
▸ [ "именительный", "родительный", "дательный", "винительный", "творительный", "предложный" ]

RussianNouns.genders()
▸ { FEMININE: "женский", MASCULINE: "мужской", NEUTER: "средний", COMMON: "общий" }

RussianNouns.decline({text: 'имя', gender: 'средний'}, 'родительный');
▸ ['имени']

RussianNouns.decline({text: 'вымя', gender: 'средний'}, 'творительный');
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
  ["пальто"]
]

let mountain = RussianNouns.createLemma({
    text: 'гора',
    gender: 'женский'
});
▸ [
  ["гора"]
  ["горы"]
  ["горе"]
  ["гору"]
  ["горой", "горою"]
  ["горе"]
]
```

*Demo:* https://georgy7.github.io/russian_nouns/ :point_left:

Testing in web-browser (based on OpenCorpora): https://georgy7.github.io/russian_nouns/testing.html
