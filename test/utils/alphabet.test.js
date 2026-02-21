import { test } from "node:test";
import assert from "node:assert";

import { bincludes, vowels, consonants, consonantsExceptJ, vowelCount } from "../../src/utils/alphabet.js";

test("abc vowels", () => {
    assert.ok(bincludes(vowels, "а"));
    assert.ok(bincludes(vowels, "о"));
    assert.ok(bincludes(vowels, "у"));
    assert.ok(bincludes(vowels, "э"));
    assert.ok(bincludes(vowels, "и"));
    assert.ok(bincludes(vowels, "ы"));
    assert.ok(bincludes(vowels, "е"));
    assert.ok(bincludes(vowels, "ё"));
    assert.ok(bincludes(vowels, "ю"));
    assert.ok(bincludes(vowels, "я"));

    for (let i = 0; i < 32; i++) {
        const letter = String.fromCharCode(1072 + i);
        if (!["а", "о", "у", "э", "и", "ы", "е", "ё", "ю", "я"].includes(letter)) {
            assert.ok(!bincludes(vowels, letter), letter);
        }
    }

    assert.ok(!bincludes(vowels, "q"));
    assert.ok(!bincludes(vowels, ""));
});

test("abc consonants", () => {
    for (let i = 0; i < 32; i++) {
        const letter = String.fromCharCode(1072 + i);
        if (["а", "о", "у", "э", "и", "ы", "е", "ё", "ю", "я", "ъ", "ь"].includes(letter)) {
            assert.ok(!bincludes(consonants, letter), letter);
        } else {
            assert.ok(bincludes(consonants, letter), letter);
        }
    }

    assert.ok(!bincludes(consonants, "ё"));
    assert.ok(!bincludes(consonants, "w"));
    assert.ok(!bincludes(consonants, ""));
});

test("abc consonantsExceptJ", () => {
    for (let i = 0; i < 32; i++) {
        const letter = String.fromCharCode(1072 + i);
        if (["а", "о", "у", "э", "и", "ы", "е", "ё", "ю", "я", "ъ", "ь", "й"].includes(letter)) {
            assert.ok(!bincludes(consonantsExceptJ, letter), letter);
        } else {
            assert.ok(bincludes(consonantsExceptJ, letter), letter);
        }
    }

    assert.ok(!bincludes(consonantsExceptJ, "ё"));
    assert.ok(!bincludes(consonantsExceptJ, "w"));
    assert.ok(!bincludes(consonantsExceptJ, ""));
});

test("abc vowelCount", () => {
    assert.strictEqual(vowelCount("арбуз"), 2);
    assert.strictEqual(vowelCount("яблоко"), 3);
    assert.strictEqual(vowelCount("орфографический"), 6);
    assert.strictEqual(vowelCount("бв"), 0);
    assert.strictEqual(vowelCount("qwerty"), 0);
    assert.strictEqual(vowelCount(""), 0);
});
