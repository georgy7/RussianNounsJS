import { test } from "node:test"
import assert from "node:assert"

import { BloomFilter, toFakeHash } from "../../src/utils/bloom.js"

test("bloom filter with positive integers", () => {
    const x = new BloomFilter();
    x.addInteger(123);
    x.addInteger(1234567890);
    x.addInteger(98765);
    x.addInteger(10);
    assert.ok(x.hasInteger(123));
    assert.ok(x.hasInteger(1234567890));
    assert.ok(x.hasInteger(98765));
    assert.ok(x.hasInteger(10));
    assert.ok(!(x.hasInteger(76543210)));
    assert.ok(!(x.hasInteger(11)));
    assert.ok(!(x.hasInteger(12)));
    assert.ok(!(x.hasInteger(45)));
});

test("bloom filter with cyrillic words", () => {
    const words = ['арбуз', 'дыня', 'мармелад', 'крыжовник'];
    const x = new BloomFilter();
    x.addRaw(toFakeHash(words[0]));
    x.addRaw(toFakeHash(words[1]));
    x.addRaw(toFakeHash(words[2]));
    assert.ok(x.hasRaw(toFakeHash(words[0])));
    assert.ok(x.hasRaw(toFakeHash(words[1])));
    assert.ok(x.hasRaw(toFakeHash(words[2])));
    assert.ok(!(x.hasRaw(toFakeHash(words[3]))));
});

test("bloom filter clone", () => {
    const x = new BloomFilter();
    x.addInteger(1);
    x.addInteger(2);

    const y = x.clone();
    y.addInteger(3);
    y.addInteger(4);

    assert.ok(y.hasInteger(1));
    assert.ok(y.hasInteger(2));
    assert.ok(y.hasInteger(3));
    assert.ok(y.hasInteger(4));

    assert.ok(x.hasInteger(1));
    assert.ok(x.hasInteger(2));
    assert.ok(!(x.hasInteger(3)));
    assert.ok(!(x.hasInteger(4)));
});

