import { test } from "node:test";
import assert from "node:assert";

import { BloomFilter } from "../../src/utils/bloom.js";
import { fastHash } from "../../src/utils/hash.js";

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
    x.addInteger(fastHash(words[0]));
    x.addInteger(fastHash(words[1]));
    x.addInteger(fastHash(words[2]));
    assert.ok(x.hasInteger(fastHash(words[0])));
    assert.ok(x.hasInteger(fastHash(words[1])));
    assert.ok(x.hasInteger(fastHash(words[2])));
    assert.ok(!(x.hasInteger(fastHash(words[3]))));
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

test("bloom filter k=2 — both bits must be set", () => {
    const x = new BloomFilter();
    x.addInteger(42);

    // After adding 42, querying 42 should return true
    assert.ok(x.hasInteger(42));

    // A different value that happens to share one bit position should still return false
    // (unless it's a genuine collision, which is extremely unlikely with k=2 and 4096 bits)
    assert.ok(!(x.hasInteger(43)));
    assert.ok(!(x.hasInteger(100)));
    assert.ok(!(x.hasInteger(9999)));
});
