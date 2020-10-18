const RussianNouns = require("./RussianNouns.js")

const rne = new RussianNouns.Engine();

console.log(rne.decline({text: 'имя', gender: 'средний'}, 'родительный'));

const Gender = RussianNouns.Gender;

let field = {
    text: 'поле',
    gender: Gender.NEUTER
};

console.log(RussianNouns.CASES.map(c => {
    return rne.decline(field, c);
}));
