import { test } from "node:test";
import assert from "node:assert";

import { LocativeFormAttribute } from "../src/index.js"

test("LocativeFormAttribute is a bit flag", () => {
    const values = Object.values(LocativeFormAttribute);

    const uniqueLocativeFormAttributes = new Set();
    for (let sc of values) {
        uniqueLocativeFormAttributes.add(sc);
    }

    // Все атрибуты уникальны

    assert.strictEqual(
        Object.keys(LocativeFormAttribute).length,
        uniqueLocativeFormAttributes.size,
        'Enum values must be unique.'
    );

    // Каждый атрибут кодируется отдельным битом

    assert.ok(values.every(x => Math.round(x) === x));
    assert.ok(values.every(x => Math.log2(x) === Math.round(Math.log2(x))));
    assert.strictEqual(values.reduce((a, b) => a|b), values.reduce((a, b) => a^b));

    // Все эти биты должны поместиться в одно 32-битное целое, вместе с кодом предлога и кодом
    // типа склонения. Думаю, под эти два кода можно выделить по 3 бита, так что на атрибуты
    // остаётся 26 бит.

    assert.strictEqual(values.reduce((a, b) => Math.min(a, b)), 1);
    assert.ok(values.reduce((a, b) => Math.max(a, b)) <= (1 << 25));
});
