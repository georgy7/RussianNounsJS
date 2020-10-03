const Ⰳ = (word, caseNumber) => {
    const c = RussianNouns.caseList()[caseNumber - 1];
    return RussianNouns.decline(word, c)[0];
};

const Ⰴ = (word, caseNumber) => {
    const c = RussianNouns.caseList()[caseNumber - 1];
    const result = RussianNouns.decline(word, c);
    return result[result.length - 1];
};

const ⰃⰃ = (word, caseNumber) => {

    if (caseNumber === 4) {
        return ⰃⰃ(word, 1);     // TODO: Remove this hack.
    }

    if (caseNumber !== 1) {
        throw 'Unsupported case yet.';
    }
    return RussianNouns.pluralize(word)[0];
};

const Gender = RussianNouns.genders();

const cap = (str) => str[0].toUpperCase() + str.substring(1);

// -----------------------------------------------

// А. Пушкин. Зимний вечер (фрагмент)

let буря = {text: 'буря', gender: Gender.FEMININE};
let мгла = {text: 'мгла', gender: Gender.FEMININE};
let небо = {text: 'небо', gender: Gender.NEUTER};
let вихрь = {text: 'вихрь', gender: Gender.MASCULINE};

let зверь = {text: 'зверь', gender: Gender.MASCULINE, animate: true};
let дитя = {text: 'дитя', gender: Gender.NEUTER, animate: true};

let кровля = {text: 'кровля', gender: Gender.FEMININE};
let солома = {text: 'солома', gender: Gender.FEMININE};

let путник = {text: 'путник', gender: Gender.MASCULINE, animate: true};
let окошко = {text: 'окошко', gender: Gender.NEUTER};

console.log(`${cap(Ⰳ(буря, 1))} ${Ⰴ(мгла, 5)} ${Ⰳ(небо, 4)} кроет,
${cap(ⰃⰃ(вихрь, 4))} снежные крутя;
То, как ${Ⰳ(зверь, 1)}, она завоет,
То заплачет, как ${Ⰳ(дитя, 1)},
То по ${Ⰳ(кровля, 3)} обветшалой
Вдруг ${Ⰳ(солома, 5)} зашумит,
То, как ${Ⰳ(путник, 1)} запоздалый,
К нам в ${Ⰳ(окошко, 4)} застучит.`);

// -----------------------------------------------
