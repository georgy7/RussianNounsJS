import { test } from "node:test";
import assert from "node:assert";

import { createReversedTrie, endsWithSuffix, extendAllSuffixes } from "../../src/utils/trie.js";

test("reversed trie basic usage", () => {
    const x = createReversedTrie(['еший', 'ый', 'лая']);

    assert.ok(endsWithSuffix('леший', x));
    assert.ok(endsWithSuffix('пеший', x));
    assert.ok(endsWithSuffix('еший', x));
    assert.ok(!endsWithSuffix('ший', x));
    assert.ok(!endsWithSuffix('ий', x));
    assert.ok(!endsWithSuffix('й', x));

    assert.ok(endsWithSuffix('правильный', x));
    assert.ok(endsWithSuffix('типичный', x));
    assert.ok(endsWithSuffix('функциональный', x));
    assert.ok(!endsWithSuffix('излишние', x));
    assert.ok(!endsWithSuffix('ненужные', x));

    assert.ok(endsWithSuffix('обветшалая', x));
    assert.ok(endsWithSuffix('тяжёлая', x));
    assert.ok(!endsWithSuffix('похожая', x));
});

test("reversed trie extension", () => {
    const x = createReversedTrie(['ов', 'ев']);

    assert.ok(endsWithSuffix('плов', x));
    assert.ok(endsWithSuffix('дедов', x));
    assert.ok(endsWithSuffix('распев', x));

    const y = extendAllSuffixes('ы', x);

    assert.ok(endsWithSuffix('плов', x));
    assert.ok(endsWithSuffix('дедов', x));
    assert.ok(endsWithSuffix('распев', x));
    assert.ok(!endsWithSuffix('плов', y));
    assert.ok(!endsWithSuffix('дедов', y));
    assert.ok(!endsWithSuffix('распев', y));

    assert.ok(!endsWithSuffix('пловы', x));
    assert.ok(!endsWithSuffix('дедовы', x));
    assert.ok(!endsWithSuffix('распевы', x));
    assert.ok(endsWithSuffix('пловы', y));
    assert.ok(endsWithSuffix('дедовы', y));
    assert.ok(endsWithSuffix('распевы', y));

    const z = extendAllSuffixes('рный', y);

    assert.ok(!endsWithSuffix('заковырный', x));
    assert.ok(!endsWithSuffix('заковырный', y));
    assert.ok(endsWithSuffix('заковырный', z));
});
