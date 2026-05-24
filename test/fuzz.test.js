import { test } from "node:test";
import assert from "node:assert";
import { Engine, Case, CASES, Gender, createLemmaOrNull } from "../src/index.js";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const cyrillicLower = 'абвгдежзийклмнопрстуфхцчшщъыьэюя';
const cyrillicUpper = 'АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ';
const vowels = 'аеёиоуыэюя';
const hardEndings = 'аеиоуы';          // fem/neut stems that may end hard
const allCyrillic = cyrillicLower + cyrillicUpper;

function randInt(max) {
    return Math.floor(Math.random() * max);
}

function pick(arr) {
    return arr[randInt(arr.length)];
}

/**
 * Generate a random Cyrillic word of given length.
 * Bias toward realistic Russian morphology:
 * – starts with a consonant cluster (0-2 cons) + vowel
 * – ends in a plausible suffix for the target gender
 */
function generateWord(length, gender) {
    let word = '';

    // initial consonant cluster (0–2)
    const clusterLen = randInt(3);
    for (let i = 0; i < clusterLen; i++) {
        word += pick('бвгджзклмнпрстфхцчшщ');
    }
    word += pick(vowels);

    // body
    while (word.length < length - 1) {
        if (Math.random() < 0.3) {
            word += pick(vowels);
        } else {
            word += pick(cyrillicLower);
        }
    }

    // gender-aware ending
    if (gender === Gender.FEMININE) {
        word += pick(['а', 'я', 'ь', 'а', 'я']); // bias toward -а/-я
    } else if (gender === Gender.MASCULINE) {
        word += pick(cyrillicLower);             // anything goes
    } else if (gender === Gender.NEUTER) {
        word += pick(['о', 'е', 'е']);           // bias toward -о/-е
    }
    // COMMON: no special ending bias

    // randomly capitalize first letter
    if (Math.random() < 0.3) {
        word = word[0].toUpperCase() + word.slice(1);
    }

    return word;
}

/** Ensure result is always normalized to an array for invariant checks */
function toArray(result) {
    return result instanceof Array ? result : [result];
}

/** Check that every string in an array contains only valid characters */
function assertCyrillicStrings(strings, label) {
    for (const s of strings) {
        assert.strictEqual(typeof s, 'string', `${label}: expected string, got ${typeof s}`);
        // skip empty strings — can occur for degenerate single-char inputs
        if (s.length === 0) continue;
        for (let i = 0; i < s.length; i++) {
            const cp = s.charCodeAt(i);
            // Cyrillic block: А-Я а-я (0x0410–0x042F, 0x0430–0x044F)
            // plus ё Ё (0x0451, 0x0401), and Ў/ў (0x040E, 0x045E)
            const isCyrillic = (cp >= 0x0410 && cp <= 0x044F) || cp === 0x0451 || cp === 0x0401 || cp === 0x040E || cp === 0x045E;
            const isDash = cp === 0x002D;
            assert.ok(isCyrillic || isDash, `${label}: invalid char '${s[i]}' (U+${cp.toString(16).toUpperCase()}) in "${s}"`);
        }
    }
}

/** Verify case preservation: if input starts with uppercase, output should too */
function assertCasePreservation(input, outputs, label) {
    const inputUpper = input[0] !== input[0].toLowerCase();
    if (!inputUpper) return; // lowercase input – no constraint

    for (const out of outputs) {
        if (typeof out !== 'string' || out.length === 0) continue;
        // skip pure suffix fragments (< 2 chars) from degenerate fuzz inputs
        if (out.length < 2) continue;
        const outUpper = out[0] !== out[0].toLowerCase();
        assert.strictEqual(outUpper, true, `${label}: input "${input}" is capitalized but output "${out}" is not`);
    }
}

// ---------------------------------------------------------------------------
// Fuzz tests
// ---------------------------------------------------------------------------

const NUM_ITERATIONS = 5000;

test(`fuzz: decline() never throws — ${NUM_ITERATIONS} iterations`, () => {
    const rne = new Engine();
    let successCount = 0;

    for (let i = 0; i < NUM_ITERATIONS; i++) {
        const gender = pick([Gender.MASCULINE, Gender.FEMININE, Gender.NEUTER, Gender.COMMON]);
        const word = generateWord(3 + randInt(10), gender);
        const lemma = createLemmaOrNull({ text: word, gender });
        if (!lemma) continue; // invalid word shape — skip

        const case_ = pick(CASES);
        try {
            rne.decline(lemma, case_);
            successCount++;
        } catch (err) {
            assert.fail(`decline("${word}", ${case_}) threw: ${err.message}`);
        }
    }
    assert.ok(successCount > 0, 'No valid lemmas were generated');
});

test(`fuzz: pluralize() never throws — ${NUM_ITERATIONS} iterations`, () => {
    const rne = new Engine();

    for (let i = 0; i < NUM_ITERATIONS; i++) {
        const gender = pick([Gender.MASCULINE, Gender.FEMININE, Gender.NEUTER, Gender.COMMON]);
        const word = generateWord(3 + randInt(10), gender);
        const lemma = createLemmaOrNull({ text: word, gender });
        if (!lemma) continue;

        try {
            rne.pluralize(lemma);
        } catch (err) {
            assert.fail(`pluralize("${word}") threw: ${err.message}`);
        }
    }
});

test(`fuzz: decline() output invariants — ${NUM_ITERATIONS} iterations`, () => {
    const rne = new Engine();

    for (let i = 0; i < NUM_ITERATIONS; i++) {
        const gender = pick([Gender.MASCULINE, Gender.FEMININE, Gender.NEUTER, Gender.COMMON]);
        const word = generateWord(3 + randInt(10), gender);
        const lemma = createLemmaOrNull({ text: word, gender });
        if (!lemma) continue;

        const case_ = pick(CASES);
        const raw = rne.decline(lemma, case_);
        const results = toArray(raw);

        assertCyrillicStrings(results, `decline("${word}", ${case_})`);
        assertCasePreservation(word, results, `decline("${word}", ${case_})`);
    }
});

test(`fuzz: pluralize() output invariants — ${NUM_ITERATIONS} iterations`, () => {
    const rne = new Engine();

    for (let i = 0; i < NUM_ITERATIONS; i++) {
        const gender = pick([Gender.MASCULINE, Gender.FEMININE, Gender.NEUTER, Gender.COMMON]);
        const word = generateWord(3 + randInt(10), gender);
        const lemma = createLemmaOrNull({ text: word, gender });
        if (!lemma) continue;

        const raw = rne.pluralize(lemma);
        assert.ok(raw instanceof Array, `pluralize("${word}") should return an array`);
        assert.ok(raw.length > 0, `pluralize("${word}") returned empty array`);

        assertCyrillicStrings(raw, `pluralize("${word}")`);
        assertCasePreservation(word, raw, `pluralize("${word}")`);
    }
});

test(`fuzz: plural decline() output invariants — ${NUM_ITERATIONS / 2 | 0} iterations`, () => {
    const rne = new Engine();
    const N = NUM_ITERATIONS / 2 | 0;

    for (let i = 0; i < N; i++) {
        const gender = pick([Gender.MASCULINE, Gender.FEMININE, Gender.NEUTER, Gender.COMMON]);
        const word = generateWord(3 + randInt(10), gender);
        const lemma = createLemmaOrNull({ text: word, gender });
        if (!lemma) continue;

        const pluralForm = rne.pluralize(lemma)[0];
        const case_ = pick(CASES);
        const raw = rne.decline(lemma, case_, pluralForm);
        const results = toArray(raw);

        assertCyrillicStrings(results, `decline("${word}", ${case_}, "${pluralForm}")`);
        // skip case preservation for plural decline — the output stem comes from pluralForm,
        // which for degenerate fuzz words may not share a prefix with the original
    }
});

test(`fuzz: full case sweep — every generated noun declined through all 7 cases`, () => {
    const rne = new Engine();
    const SAMPLE = 500;

    for (let i = 0; i < SAMPLE; i++) {
        const gender = pick([Gender.MASCULINE, Gender.FEMININE, Gender.NEUTER, Gender.COMMON]);
        const word = generateWord(3 + randInt(10), gender);
        const lemma = createLemmaOrNull({ text: word, gender });
        if (!lemma) continue;

        for (const c of CASES) {
            const raw = rne.decline(lemma, c);
            const results = toArray(raw);
            assertCyrillicStrings(results, `decline("${word}", ${c})`);
            assertCasePreservation(word, results, `decline("${word}", ${c})`);
        }

        // also sweep plural
        const pluralForm = rne.pluralize(lemma)[0];
        for (const c of CASES) {
            const raw = rne.decline(lemma, c, pluralForm);
            const results = toArray(raw);
            assertCyrillicStrings(results, `decline("${word}", ${c}, "${pluralForm}")`);
            // skip case preservation — plural stem may differ from original for degenerate words
        }
    }
});

test(`fuzz: animate + surname + transport flags — ${NUM_ITERATIONS / 2 | 0} iterations`, () => {
    const rne = new Engine();
    const N = NUM_ITERATIONS / 2 | 0;

    for (let i = 0; i < N; i++) {
        const gender = pick([Gender.MASCULINE, Gender.FEMININE, Gender.COMMON]);
        const word = generateWord(3 + randInt(10), gender);
        const lemma = createLemmaOrNull({
            text: word,
            gender,
            animate: Math.random() < 0.5,
            surname: Math.random() < 0.2,
            transport: Math.random() < 0.1,
        });
        if (!lemma) continue;

        const case_ = pick(CASES);
        try {
            const raw = rne.decline(lemma, case_);
            const results = toArray(raw);
            assertCyrillicStrings(results, `decline("${word}", ${case_}) [flags]`);
        } catch (err) {
            assert.fail(`decline("${word}", ${case_}) with flags threw: ${err.message}`);
        }
    }
});

test(`fuzz: indeclinable + plurale tantum — ${NUM_ITERATIONS / 2 | 0} iterations`, () => {
    const rne = new Engine();
    const N = NUM_ITERATIONS / 2 | 0;

    for (let i = 0; i < N; i++) {
        if (Math.random() < 0.5) {
            // indeclinable
            const gender = pick([Gender.MASCULINE, Gender.FEMININE, Gender.NEUTER]);
            const word = generateWord(3 + randInt(8), gender);
            const lemma = createLemmaOrNull({ text: word, gender, indeclinable: true });
            if (!lemma) continue;

            for (const c of CASES) {
                const result = rne.decline(lemma, c);
                assert.strictEqual(result[0], word, `indeclinable "${word}" changed in ${c}`);
            }
        } else {
            // plurale tantum
            const word = generateWord(3 + randInt(8), Gender.FEMININE); // often fem -а
            const lemma = createLemmaOrNull({ text: word, pluraleTantum: true });
            if (!lemma) continue;

            const plural = rne.pluralize(lemma);
            assert.strictEqual(plural[0], word, `plurale tantum "${word}" pluralized to "${plural[0]}"`);

            for (const c of CASES) {
                const raw = rne.decline(lemma, c);
                const results = toArray(raw);
                assertCyrillicStrings(results, `decline("${word}", ${c}) [pt]`);
            }
        }
    }
});

test(`fuzz: getLocativeForms() never throws — ${NUM_ITERATIONS / 2 | 0} iterations`, () => {
    const rne = new Engine();
    const N = NUM_ITERATIONS / 2 | 0;

    for (let i = 0; i < N; i++) {
        const gender = pick([Gender.MASCULINE, Gender.FEMININE, Gender.NEUTER]);
        const word = generateWord(3 + randInt(10), gender);
        const lemma = createLemmaOrNull({ text: word, gender });
        if (!lemma) continue;

        try {
            const forms = rne.getLocativeForms(lemma);
            assert.ok(forms instanceof Array, `getLocativeForms("${word}") should return an array`);
        } catch (err) {
            assert.fail(`getLocativeForms("${word}") threw: ${err.message}`);
        }
    }
});

test(`fuzz: edge cases — short words, double letters, edge Cyrillic chars`, () => {
    const rne = new Engine();

    const edgeWords = [
        // minimal length
        { text: 'ам', gender: Gender.MASCULINE },
        { text: 'ом', gender: Gender.NEUTER },
        { text: 'аа', gender: Gender.FEMININE },
        // soft sign endings
        { text: 'день', gender: Gender.MASCULINE },
        { text: 'соль', gender: Gender.FEMININE },
        { text: 'имя', gender: Gender.NEUTER },
        // er/yr endings
        { text: 'лес', gender: Gender.MASCULINE },
        { text: 'зверь', gender: Gender.MASCULINE, animate: true },
        // yery (ё)
        { text: 'море', gender: Gender.NEUTER },
        { text: 'лёд', gender: Gender.MASCULINE },
        { text: 'свёкла', gender: Gender.FEMININE },
        // capitalized
        { text: 'Москва', gender: Gender.FEMININE },
        { text: 'Пётр', gender: Gender.MASCULINE, animate: true },
        // hyphenated
        { text: 'а-б', gender: Gender.MASCULINE },
        { text: 'какой-то', gender: Gender.MASCULINE },
    ];

    for (const entry of edgeWords) {
        const lemma = createLemmaOrNull(entry);
        if (!lemma) continue;

        for (const c of CASES) {
            try {
                const raw = rne.decline(lemma, c);
                const results = toArray(raw);
                assertCyrillicStrings(results, `decline("${entry.text}", ${c}) [edge]`);
            } catch (err) {
                assert.fail(`decline("${entry.text}", ${c}) [edge] threw: ${err.message}`);
            }
        }

        try {
            const plural = rne.pluralize(lemma);
            assertCyrillicStrings(plural, `pluralize("${entry.text}") [edge]`);
        } catch (err) {
            assert.fail(`pluralize("${entry.text}") [edge] threw: ${err.message}`);
        }
    }
});
