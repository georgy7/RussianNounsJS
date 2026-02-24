import { test } from "node:test";
import assert from "node:assert";

import { Gender, FEM, MASC, NEU, COM } from "../src/Gender.js"
import { Lemma, getIntGender } from "../src/Lemma.js"

test("Lemma integer gender", () => {
    const f = Lemma.create({text: 'гора', gender: Gender.FEMININE});
    const m = Lemma.create({text: 'хор', gender: Gender.MASCULINE});
    const n = Lemma.create({text: 'небо', gender: Gender.NEUTER});
    const c = Lemma.create({text: 'чистюля', gender: Gender.COMMON});
    const p = Lemma.create({text: 'прятки', pluraleTantum: true});

    assert.strictEqual(getIntGender(f), FEM);
    assert.strictEqual(getIntGender(m), MASC);
    assert.strictEqual(getIntGender(n), NEU);
    assert.strictEqual(getIntGender(c), COM);

    const uniqueGenderValues = new Set();
    uniqueGenderValues.add(FEM);
    uniqueGenderValues.add(MASC);
    uniqueGenderValues.add(NEU);
    uniqueGenderValues.add(COM);
    assert.strictEqual(uniqueGenderValues.size, 4);

    assert.strictEqual(uniqueGenderValues.has(getIntGender(p)), false);
});
