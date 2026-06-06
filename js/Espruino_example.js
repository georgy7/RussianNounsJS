const RussianNouns = require('RN.js');

function assertEquals(a, b, msg) {
    if (a !== b) {
        console.log('' + JSON.stringify(a) + ' !== ' + JSON.stringify(b));
        msg = msg || 'not equal';
        throw msg;
    }
}

function assertIsArray(a) {
    if (!(a instanceof Array)) {
        throw ('' + a + ' is not an array');
    }
}

function assertEqualsSingleValue(array, value) {
    assertIsArray(array);
    assertEquals(array.length, 1, [array, value]);
    assertEquals(array[0], value);
}

function assertAllCases(results, values) {
    assertIsArray(results);
    assertIsArray(values);

    assertEquals(results.length, 7);
    assertEquals(values.length, 7);

    for (var i = 0; i < 7; i++) {
        var result = results[i];
        var value = values[i];

        assertIsArray(result);

        if (typeof value === 'string') {
            assertEqualsSingleValue(result, value);
        } else if (value instanceof Array) {
            assertEquals(result.length, value.length, [result, value]);
            for (var j = 0; j < value.length; j++) {
                assertEquals(result[j], value[j]);
            }
        } else {
            throw ('' + value + ' is neither an array nor a string.');
        }
    }
}

var Gender = RussianNouns.Gender;
var Case = RussianNouns.Case;
var Lemma = RussianNouns.Lemma;

var rne = new RussianNouns.Engine();

(function () {
    var k = Lemma.create({
        text: '\xED\xEE\xE6\xED\xE8\xF6\xFB',
        pluraleTantum: true
    });
    assertEquals(k.text(), '\xED\xEE\xE6\xED\xE8\xF6\xFB');
    assertEquals(k.isPluraleTantum(), true);
    assertEquals(k.getGender(), undefined);
    assertEquals(k.isIndeclinable(), false);
    console.log('Lemma.create: OK');

    var l = RussianNouns.createLemma(k);
    assertEquals(l, k);
    console.log('createLemma returned the same object: OK');
})();

(function () {
    var mountain = RussianNouns.createLemma({
        text: '\xE3\xEE\xF0\xE0',
        gender: Gender.FEMININE
    });

    var result = RussianNouns.CASES.map(function (c) {
        return rne.decline(mountain, c);
    });

    assertAllCases(result, [
        '\xE3\xEE\xF0\xE0',
        '\xE3\xEE\xF0\xFB',
        '\xE3\xEE\xF0\xE5',
        '\xE3\xEE\xF0\xF3',
        ['\xE3\xEE\xF0\xEE\xE9', '\xE3\xEE\xF0\xEE\xFE'],
        '\xE3\xEE\xF0\xE5',
        '\xE3\xEE\xF0\xE5'
    ]);
    console.log('mountain, singular: OK');

    result = rne.pluralize(mountain);
    assertEqualsSingleValue(result, "\xE3\xEE\xF0\xFB");
    console.log('mountain, pluralize: OK');

    var pluralMountain = result[0];

    result = RussianNouns.CASES.map(function (c) {
        return rne.decline(mountain, c, pluralMountain);
    });

    assertAllCases(result, [
        '\xE3\xEE\xF0\xFB',
        '\xE3\xEE\xF0',
        '\xE3\xEE\xF0\xE0\xEC',
        '\xE3\xEE\xF0\xFB',
        '\xE3\xEE\xF0\xE0\xEC\xE8',
        '\xE3\xEE\xF0\xE0\xF5',
        '\xE3\xEE\xF0\xE0\xF5'
    ]);
    console.log('mountain, plural: OK');
})();

(function () {
    var mountain = RussianNouns.createLemma({
        text: '\xC3\xCE\xD0\xC0',
        gender: Gender.FEMININE
    });

    var result = RussianNouns.CASES.map(function (c) {
        return rne.decline(mountain, c);
    });

    assertEquals(mountain.getDeclension(), 2);
    console.log('mountain declension, uppercase: OK');
    assertEquals(mountain.lower(), '\xE3\xEE\xF0\xE0');
    console.log('mountain.lower(): OK');

    assertAllCases(result, [
        '\xC3\xCE\xD0\xC0',
        '\xC3\xCE\xD0\xFB',
        '\xC3\xCE\xD0\xE5',
        '\xC3\xCE\xD0\xF3',
        ['\xC3\xCE\xD0\xEE\xE9', '\xC3\xCE\xD0\xEE\xFE'],
        '\xC3\xCE\xD0\xE5',
        '\xC3\xCE\xD0\xE5'
    ]);
    console.log('mountain, singular, uppercase: OK');

    result = rne.pluralize(mountain);
    assertEqualsSingleValue(result, "\xC3\xCE\xD0\xFB");
    console.log('mountain, pluralize, uppercase: OK');

    var pluralMountain = result[0];

    result = RussianNouns.CASES.map(function (c) {
        return rne.decline(mountain, c, pluralMountain);
    });

    assertAllCases(result, [
        '\xC3\xCE\xD0\xFB',
        '\xC3\xCE\xD0',
        '\xC3\xCE\xD0\xE0\xEC',
        '\xC3\xCE\xD0\xFB',
        '\xC3\xCE\xD0\xE0\xEC\xE8',
        '\xC3\xCE\xD0\xE0\xF5',
        '\xC3\xCE\xD0\xE0\xF5'
    ]);
    console.log('mountain, plural, uppercase: OK');
})();

(function () {
    var hedgehog = RussianNouns.createLemma({
        text: '\xA8\xC6',
        gender: Gender.MASCULINE
    });
    assertEquals(hedgehog.lower(), '\xB8\xE6');
    console.log('hedgehog.lower(): OK');
})();

assertEqualsSingleValue(
    rne.pluralize({text: '\xC1\xEE\xEB\xE3\xE0\xF0\xE8\xED', gender: Gender.MASCULINE}),
    '\xC1\xEE\xEB\xE3\xE0\xF0\xFB'
);
console.log('capitalizeRu: OK');

(function () {
    assertEqualsSingleValue(rne.pluralize({text: '\xF1\xF2\xE5\xEA\xEB\xEE', gender: Gender.NEUTER}), '\xF1\xF2\xB8\xEA\xEB\xE0');
    assertEquals(rne.pluralize({text: '\xF1\xF2\xE5\xEA\xEB\xEE', gender: Gender.NEUTER})[0][2], '\xB8');
    assertEquals(rne.pluralize({text: '\xD1\xD2\xC5\xCA\xCB\xCE', gender: Gender.NEUTER})[0][2], '\xA8');
    console.log('upperLike yo (in reYo function): OK');
})();

