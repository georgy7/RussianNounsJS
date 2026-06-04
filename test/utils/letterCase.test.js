import { test } from "node:test";
import assert from "node:assert";

import {
    toLowerCasePortable,
    toLowerCaseRu,
    toUpperCaseRu,
    capitalizeRu,
    capitalizeAll,
    upperLike
} from "../../src/utils/letterCase.js";

test("letterCase: toLowerCasePortable", () => {
    assert.strictEqual(toLowerCasePortable("ALPHA-ВЕРСИЯ"), "alpha-версия");
    assert.strictEqual(toLowerCasePortable("Alpha-версия"), "alpha-версия");
    assert.strictEqual(toLowerCasePortable("alpha-версия"), "alpha-версия");
    assert.strictEqual(toLowerCasePortable("КОТ"), "кот");
    assert.strictEqual(toLowerCasePortable("иКоТа"), "икота");
    assert.strictEqual(toLowerCasePortable(""), "");
});

test("letterCase: toLowerCaseRu", () => {
    assert.strictEqual(toLowerCaseRu("ALPHA-ВЕРСИЯ"), "ALPHA-версия");
    assert.strictEqual(toLowerCaseRu("Alpha-вЕрСиЯ"), "Alpha-версия");
    assert.strictEqual(toLowerCaseRu("ИМХО"), "имхо");
    assert.strictEqual(toLowerCaseRu("Лс"), "лс");
    assert.strictEqual(toLowerCaseRu(""), "");
});

// Unicode only
test("letterCase: toLowerCaseRu — extended Cyrillic", () => {
    assert.strictEqual(toLowerCaseRu("Ў"), "ў");
    assert.strictEqual(toLowerCaseRu("Ї"), "ї");
    assert.strictEqual(toLowerCaseRu("Є"), "є");
    assert.strictEqual(toLowerCaseRu("Ё"), "ё");
    assert.strictEqual(toLowerCaseRu("Ѐ"), "ѐ");    // Е с грависом
});

test("letterCase: toUpperCaseRu", () => {
    assert.strictEqual(toUpperCaseRu("ALPHA-версия"), "ALPHA-ВЕРСИЯ");
    assert.strictEqual(toUpperCaseRu("Alpha-вЕрСиЯ"), "Alpha-ВЕРСИЯ");
    assert.strictEqual(toUpperCaseRu("имхо"), "ИМХО");
    assert.strictEqual(toUpperCaseRu("Лс"), "ЛС");
    assert.strictEqual(toUpperCaseRu(""), "");
});

// Unicode only
test("letterCase: toUpperCaseRu — extended Cyrillic", () => {
    assert.strictEqual(toUpperCaseRu("ў"), "Ў");
    assert.strictEqual(toUpperCaseRu("ї"), "Ї");
    assert.strictEqual(toUpperCaseRu("є"), "Є");
    assert.strictEqual(toUpperCaseRu("ё"), "Ё");
    assert.strictEqual(toUpperCaseRu("ѐ"), "Ѐ");
});

test("letterCase: capitalizeRu", () => {
    assert.strictEqual(capitalizeRu("арбуз"), "Арбуз");
    assert.strictEqual(capitalizeRu("АБВ"), "АБВ");
    assert.strictEqual(capitalizeRu("abc"), "abc");
    assert.strictEqual(capitalizeRu(""), "");
});

// Unicode only
test("letterCase: capitalizeRu — extended Cyrillic", () => {
    assert.strictEqual(capitalizeRu("ў"), "Ў");
    assert.strictEqual(capitalizeRu("ї"), "Ї");
    assert.strictEqual(capitalizeRu("є"), "Є");
    assert.strictEqual(capitalizeRu("ё"), "Ё");
    assert.strictEqual(capitalizeRu("ѐ"), "Ѐ");
});

test("letterCase: capitalizeAll", () => {
    let expected;
    let actual;

    expected = ['Булка', 'Соус', 'Сыр'];
    actual = capitalizeAll(true, ['булка', 'соус', 'сыр']);
    assert.strictEqual(actual.length, expected.length);
    assert.strictEqual(actual[0], expected[0]);
    assert.strictEqual(actual[1], expected[1]);
    assert.strictEqual(actual[2], expected[2]);

    expected = ['котлета', 'помидор', 'горчица'];
    actual = capitalizeAll(false, ['котлета', 'помидор', 'горчица']);
    assert.strictEqual(actual.length, expected.length);
    assert.strictEqual(actual[0], expected[0]);
    assert.strictEqual(actual[1], expected[1]);
    assert.strictEqual(actual[2], expected[2]);
});

test("letterCase: upperLike", () => {
    assert.strictEqual(upperLike("и", "Б"), "И");
    assert.strictEqual(upperLike("и", "б"), "и");
    assert.strictEqual(upperLike("н", "АБВ"), "Н");
    assert.strictEqual(upperLike("н", "абв"), "н");
});

