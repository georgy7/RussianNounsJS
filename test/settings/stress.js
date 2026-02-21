import { test } from "node:test";
import assert from "node:assert";

import { Engine } from "../../src/Engine.js";
import { Case, CaseValues } from "../../src/Case.js";
import { Gender } from "../../src/Gender.js";
import { Lemma } from "../../src/Lemma.js";

test("stress hashes A", () => {
    const rne = new Engine();

    const expected = [
        [false],
        [true],
        [true],
        [false],
        [true],
        [true],
        [true]
    ];

    function matchesPattern(query) {
        for (let i = 0; i < 7; i++) {
            assert.strictEqual(
                    rne.sd.hasStressedEndingSingular(query, CaseValues[i]).toString(),
                    expected[i].toString(),
                    `${query.text()} (i = ${i})`);
        }

        for (let cv of CaseValues) {
            if (cv !== Case.LOCATIVE) {
                assert.strictEqual(
                        rne.sd.hasStressedEndingPlural(query, cv).toString(),
                        [true].toString(),
                        `${query.text()} (${cv} падеж)`);
            }
        }
    }

    matchesPattern(Lemma.create({text: "багаж", gender: Gender.MASCULINE}));
    matchesPattern(Lemma.create({text: "кругляш", gender: Gender.MASCULINE}));
    matchesPattern(Lemma.create({text: "свинец", gender: Gender.MASCULINE}));
});

test("stress hashes B singular", () => {
    const rne = new Engine();

    const expected = [
        [false],
        [true],
        [true],
        [true],
        [true],
        [true],
        [true]
    ];

    function matchesPattern(query) {
        for (let i = 0; i < 7; i++) {
            assert.strictEqual(
                    rne.sd.hasStressedEndingSingular(query, CaseValues[i]).toString(),
                    expected[i].toString(),
                    `${query.text()} (i = ${i})`);
        }
    }

    matchesPattern(Lemma.create({text: "усач", gender: Gender.MASCULINE, animate: true}));
    matchesPattern(Lemma.create({text: "истец", gender: Gender.MASCULINE, animate: true}));
    matchesPattern(Lemma.create({text: "малыш", gender: Gender.MASCULINE, animate: true}));
    matchesPattern(Lemma.create({text: "усач", gender: Gender.MASCULINE}));
    matchesPattern(Lemma.create({text: "истец", gender: Gender.MASCULINE}));
    matchesPattern(Lemma.create({text: "малыш", gender: Gender.MASCULINE}));
});

test("stress hashes B plural", () => {
    const rne = new Engine();

    function check(word) {
        const query = Lemma.create({text: word, gender: Gender.MASCULINE, animate: true});
        const inanimate = Lemma.create({text: word, gender: Gender.MASCULINE});

        for (let i = 0; i < 6; i++) {
            assert.strictEqual(
                    rne.sd.hasStressedEndingPlural(query, CaseValues[i]).toString(),
                    [true].toString(), `animate ${word} (i = ${i})`);
            assert.strictEqual(
                    rne.sd.hasStressedEndingPlural(inanimate, CaseValues[i]).length,
                    0, `inanimate ${word} (i = ${i})`);
        }
    }

    check("усач");
    check("истец");
    check("малыш");
});

test("stress dictionary - smoke test", () => {
    const rne = new Engine();
    const hasStressedEnding = (query, grCase) =>
        rne.sd.hasStressedEndingSingular(Lemma.create(query), grCase).toString();

    assert.strictEqual(
            hasStressedEnding({text: "год", gender: Gender.MASCULINE}, Case.GENITIVE),
            "false");

    assert.strictEqual(
            hasStressedEnding({text: "душа", gender: Gender.FEMININE}, Case.GENITIVE),
            "true");

    assert.strictEqual(
            hasStressedEnding({text: "шофёр", gender: Gender.MASCULINE, animate: true}, Case.GENITIVE),
            "false");
});
