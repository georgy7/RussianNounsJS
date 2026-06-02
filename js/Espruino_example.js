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
        text: 'ножницы',
        pluraleTantum: true
    });
    assertEquals(k.text(), 'ножницы');
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
        text: 'гора',
        gender: Gender.FEMININE
    });

    var result = RussianNouns.CASES.map(function (c) {
        return rne.decline(mountain, c);
    });

    assertAllCases(result, ['гора', 'горы', 'горе', 'гору', ['горой', 'горою'], 'горе', 'горе']);
    console.log('mountain, singular: OK');

    result = rne.pluralize(mountain);
    assertEqualsSingleValue(result, "горы");
    console.log('mountain, pluralize: OK');

    var pluralMountain = result[0];

    result = RussianNouns.CASES.map(function (c) {
        return rne.decline(mountain, c, pluralMountain);
    });

    assertAllCases(result, ['горы', 'гор', 'горам', 'горы', 'горами', 'горах', 'горах']);
    console.log('mountain, plural: OK');
})();

(function () {
    var mountain = RussianNouns.createLemma({
        text: 'ГОРА',
        gender: Gender.FEMININE
    });

    var result = RussianNouns.CASES.map(function (c) {
        return rne.decline(mountain, c);
    });

    console.log('Uppercase mountain declension: ' + mountain.getDeclension());
    console.log('_lc:' + JSON.stringify(mountain._lc));

    assertAllCases(result, ['ГОРА', 'ГОРы', 'ГОРе', 'ГОРу', ['ГОРой', 'ГОРою'], 'ГОРе', 'ГОРе']);
    console.log('mountain, singular, uppercase: OK');

    result = rne.pluralize(mountain);
    assertEqualsSingleValue(result, "ГОРы");
    console.log('mountain, pluralize, uppercase: OK');

    var pluralMountain = result[0];

    result = RussianNouns.CASES.map(function (c) {
        return rne.decline(mountain, c, pluralMountain);
    });

    assertAllCases(result, ['ГОРы', 'ГОР', 'ГОРам', 'ГОРы', 'ГОРами', 'ГОРах', 'ГОРах']);
    console.log('mountain, plural, uppercase: OK');
})();

assertEqualsSingleValue(
    rne.pluralize({text: 'Болгарин', gender: Gender.MASCULINE}),
    'Болгары'
);

