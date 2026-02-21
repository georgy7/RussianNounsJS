import { test } from "node:test";
import assert from "node:assert";

import { init, last, takeLast, dropLast, charFromEnd, hasChar } from "../../src/utils/strings.js";

test("strings: init", () => {
   assert.strictEqual(init("егерь"), "егер");
   assert.strictEqual(init("абв"), "аб");
   assert.strictEqual(init("аб"), "а");
   assert.strictEqual(init("а"), "");
   assert.strictEqual(init(""), "");
});

test("strings: last", () => {
   assert.strictEqual(last("егерь"), "ь");
   assert.strictEqual(last("абв"), "в");
   assert.strictEqual(last("аб"), "б");
   assert.strictEqual(last("а"), "а");
   assert.strictEqual(last(""), "");
});

test("strings: dropLast", () => {
    assert.strictEqual(dropLast("егерь", 1), "егер");
    assert.strictEqual(dropLast("егерь", 2), "еге");
    assert.strictEqual(dropLast("егерь", 3), "ег");
    assert.strictEqual(dropLast("егерь", 4), "е");
    assert.strictEqual(dropLast("егерь", 5), "");
    assert.strictEqual(dropLast("егерь", 6), "");
    assert.strictEqual(dropLast("абв", 2), "а");
    assert.strictEqual(dropLast("аб", 2), "");
    assert.strictEqual(dropLast("а", 2), "");
    assert.strictEqual(dropLast("", 2), "");
});

test("strings: takeLast", () => {
    assert.strictEqual(takeLast("егерь", 1), "ь");
    assert.strictEqual(takeLast("егерь", 2), "рь");
    assert.strictEqual(takeLast("егерь", 3), "ерь");
    assert.strictEqual(takeLast("егерь", 4), "герь");
    assert.strictEqual(takeLast("егерь", 5), "егерь");
    assert.strictEqual(takeLast("егерь", 6), "егерь");
    assert.strictEqual(takeLast("абв", 2), "бв");
    assert.strictEqual(takeLast("аб", 2), "аб");
    assert.strictEqual(takeLast("а", 2), "а");
    assert.strictEqual(takeLast("", 2), "");
});

test("strings: charFromEnd", () => {
    assert.strictEqual(charFromEnd("егерь", 1), "ь");
    assert.strictEqual(charFromEnd("егерь", 2), "р");
    assert.strictEqual(charFromEnd("егерь", 3), "е");
    assert.strictEqual(charFromEnd("егерь", 4), "г");
    assert.strictEqual(charFromEnd("егерь", 5), "е");
    assert.strictEqual(charFromEnd("егерь", 6), "");
    assert.strictEqual(charFromEnd("егерь", 7), "");
    assert.strictEqual(charFromEnd("qwerty", 2), last(init("qwerty")));
    assert.strictEqual(charFromEnd("qwerty", 3), last(init(init("qwerty"))));
    assert.strictEqual(charFromEnd("абв", 3), last(init(init("абв"))));
    assert.strictEqual(charFromEnd("аб", 3), last(init(init("аб"))));
    assert.strictEqual(charFromEnd("а", 3), last(init(init("а"))));
    assert.strictEqual(charFromEnd("", 3), last(init(init(""))));
});

test("strings: hasChar", () => {
   assert.ok(hasChar("абв", "а"));
   assert.ok(hasChar("абв", "б"));
   assert.ok(hasChar("абв", "в"));
   assert.ok(!hasChar("абв", "г"));
   assert.ok(!hasChar("абв", "абв"));
   assert.ok(!hasChar("абв", "бв"));
   assert.ok(!hasChar("абв", "аб"));
   assert.ok(!hasChar("абв", ""));
});
