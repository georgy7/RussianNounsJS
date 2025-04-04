function djb2Hash32(byteArray) {
    let hash = 5381;
    for (let i = 0; i < byteArray.length; i++) {
        hash = (hash * 33 + byteArray[i]) % 0x100000000;
    }
    return hash;
}

function getHash(unicodeString) {
    // У нас в зашитом в скрипт словаре ударений довольно много коротких
    // строк (от трёх до шести букв). Если представлять эти строки очень компактно,
    // хэши считаются без многократных переполнений, не превращаются в белый шум
    // и намного лучше жмутся.

    function toBits(ch) {
        const chCode = (ch.charCodeAt(0) - 1072) & 0x1F;
        const bits = chCode.toString(2);
        return '0'.repeat(5 - bits.length) + bits;
    }

    // Биты я наполняю справа налево, потому что так числа растут медленнее.
    // Допустим, для строки 'яяяя', если заполнять справа налево,
    // получится ['00001111', '11111111', '11111111'], т.е. [15, 255, 255].
    // Если бы я наполнял слева направо, получилось бы
    // ['11111111', '11111111', '11110000'], т.е. [255, 255, 240].
    // Так что, даже вне зависимости от порядка дальнейшей обработки байтов,
    // заполнение бит справа налево даёт меньшую хэш-сумму
    // и её более компактную запись.

    const preparedString = unicodeString.toLowerCase().replaceAll('ё', 'е');
    let allBits = preparedString.split('').toReversed().map(toBits).join('');

    // Пока что у меня была только одна коллизия - между словами "рюш" и "уж".
    // Так что я добавляю супердешёвое решение, чтобы её избежать - бит контроля
    // чётности справа. Только здесь он считает не биты, а количество букв.

    allBits += (preparedString.length % 2).toString(2);

    if (allBits.length % 8) {
        allBits = '0'.repeat(8 - allBits.length % 8) + allBits;
    }

    const byteArray = [];
    for (var i = 0; i < allBits.length; i += 8) {
        byteArray.push(parseInt(allBits.substring(i, i+8), 2));
    }

    const simpleHash = djb2Hash32(byteArray.toReversed());

    // Мои тесты показали, что наша хэш-функция иногда даёт коллизию
    // у коротких слов из одинакового количества символов. И я заметил,
    // что у всех коллизий всегда были соседние коды первых букв.
    const start = preparedString.charCodeAt(0) % 2;

    // Поскольку в JS 64-битные числа с плавающей точкой, я мог бы
    // сохранить текущий хэш целиком и просто добавить к нему информацию,
    // но я хочу, чтобы число выглядело как uint32_t в основном
    // из эстетических соображений.
    return ((0x7fffffff & simpleHash) * 2) + start;
}

// -----------------------------------------

const unYo = s => s.replace('ё', 'е').replace('Ё', 'Е');

function makeHashes(commaSeparatedWords) {
    let result = [];
    const words = commaSeparatedWords.split(',');
    for (let word of words) {
        const processedWord = unYo(word.toLowerCase().trim());
        if (processedWord.length < 1) {
            continue;
        }

        result.push(getHash(processedWord));
    }

    return result;
}

function arrayToStr(arr, noSpaces) {
    let result = '';
    let row = '';

    for (let x of arr) {
        const v = x.toString();

        if (row.length + 1 + v.length + (noSpaces&1) > 82) {
            result += row + '\n';
            row = '';
        } else if ((row.length > 0) && !noSpaces) {
            row += ' ';
        }

        row += v + ',';
    }

    result += row;
    result = result.substring(0, result.length-1); // last comma

    return result;
}

function makeHashDeltas(commaSeparatedWords) {
    const hashes = makeHashes(commaSeparatedWords);
    hashes.sort((a, b) => a-b);

    const delta = [hashes[0]];
    for (var i = 1; i < hashes.length; i++) {
        const x = hashes[i] - hashes[i-1];
        // Дублирующиеся хэши добавлять нет смысла, если потом это просто будет складываться в Set.
        if (x !== 0) {
            delta.push(x);
        }
    }

    return arrayToStr(delta);
}

// -----------------------------------------

function assertEquals(a, b) {
    if (a !== b) {
        throw(`${a} !== ${b}`);
    }
}

console.log("Hello!");

assertEquals(223289465, djb2Hash32("Hello".split('').map(x => x.charCodeAt(0))));
assertEquals(3073585082, djb2Hash32("Hello!".split('').map(x => x.charCodeAt(0))));

// -----------------------------------------

const rk = s => s.split('').map(ch => String.fromCharCode(ch.charCodeAt(0) + 1)).join('');
const rkComma = s => s.split(',').map(rk).join(',');

// Мужской род
// Ударения SEESEEE-EEEEEE
// Это было удалено из основного кода в коммите 9ff0c255d0a18c698a99188e0c37fe1324cfe4f9
const stressHashesAInput = 'багаж,' +
            // Встречаются в законах, условиях/правилах для пасажиров.
            'грузобагаж,товаробагаж,' +
            'багрец,барыш,беляш,бердыш,бич,' +
            'бандаж,блиндаж,борщ,бубенец,буж,' +
            'валец,варенец,венец,вираж,витраж,волосенец,волчец,вольтаж,' +
            'воронец,галдёж,гамма-луч,гнилец,' +
            'гараж,автогараж,' +
            'голец,' + // горная вершина
            'головач,' + // гриб
            'голыш,' + // камень
            'горбач,' + // рубанок
            'горлач,' + // кринка/крынка/глечик
            'голубец,грабёж,' +
            'гуж,гуляш,дворец,делёж,дергач,долбёж,долгунец,' +
            'драч,' + // плотницкий инструмент
            'ёж,ёрш,зубец,зубрёж,' +			// ежей я добавил позже
            'изразец,калач,ключ,' +
            'камыш,' + // растение
            'карандаш,картёж,кедрач,кирпич,' +
            'клинец,' + // щебень
            'ковш,корец,козелец,конец,кострец,' +
            'копач,' + // орудие
            'корж,крепёж,крестец,круглыш,кругляш,крыж,крылач,' +
            'кулеш,кулич,кумач,контуш,кунтуш,купаж,кураж,кутёж,' +
            'леденец,листаж,литраж,луч,' +
            'метраж,меч,мираж,монтаж,муляж,мятеж,мяч,' +
            'мокрец,' + // лишай, растение
            'москвич,' + // автомобиль
            'неплатёж,нож,нутрец,образец,овсец,огурец,' +
            'орлец,' + // камень, коврик
            'острец,' + // растение
            'падеж,падёж,паж,палаш,паралич,первач,пернач,песец,' + // Если мы используем хэши, падёж и падеж - дубликаты.
            rkComma('озжгдх,фтдх,') +
            'пихтач,платёж,плащ,погребец,подэтаж,поставец,поташ,правёж,прыщ,путец,пыж,' +
            'пугач,' + // игрушечный пистолет
            'резец,ржанец,рубеж,рубец,' +
            'рогач,' + // ухват
            'свербёж,светец,сенаж,скулёж,слопец,сныч,солонец,сосец,' +
            'свинец,тетраэтилсвинец,' +
            'секач,' + // инструмент
            'спорыш,столбец,строгач,сургуч,сутаж,сыпец,сырец,сыровец,' +
            'терпёж,типаж,тираж,толкач,торец,тягач,тяж,' +
            'типец,' + // кормовой злак
            'тирлич,' + // горечавка (растение)
            'тупец,тупыш,' + // тупой скорняжный нож
            'целкач,чабрец,чепец,' +
            'фураж,хвостец,хлопунец,холодец,хрящ,' +
            'чертёж,чистец,шалаш,шантаж,шиш,щипец,' +
            'электронож,этаж,ясенец';

// Мужской род, одушевлённые
// Ударения SEEEEEE-EEEEEE
// Это было заменено на хэши в коммите 8dc2bd6e1c26c189e2f711f8892ce3fc58dabf19
const stressHashesBInput = 'алкаш,' +
            'басмач,беглец,белец,бирюч,бич,' +
            'близнец,бомж,богач,' +
            'боец,борец,бородач,брюхач,' +
            'вдовец,волосач,' +
            'врач,главврач,ветврач,военврач,диетврач,санврач,' +
            'глупец,глупыш,голец,' +
            'головач,' + // птица, жук
            'голыш,гонец,горбач,гордец,грач,' +
            'гребец,делец,дергач,донец,дохлец,' +
            'драч,' + // тот, кто снимает шкуры
            'ёж,ёрш,' +
            'елец,' + // рыба
            'жеребец,живец,жилец,жнец,жрец,' +
            'избач,ингуш,истец,' +
            'камыш,' + // камышинский голубь
            'клещ,морж,' +
            'кольчец,' + // кольчатый червь
            'копач,' + // рабочий землекоп
            'кормач,коротыш,косач,косец,космач,крепыш,' +
            'кряж,' + // коренастый, (перен.) упорный и прижимистый человек
            'кудряш,кузнец,купец,' +
            'латыш,легаш,лжец,лихач,ловец,ловкач,лохмач,' +
            'малец,малыш,мертвец,мигач,мордаш,' +
            'мокрец,' + // насекомое
            'москвич,' + // житель Москвы
            'мудрец,мураш,носач,оголец,омич,' +
            'отец,праотец,' +
            'паж,камер-паж,палач,' +
            'пантач,певец,песец,писец,плавунец,подлец,племяш,пловец,портач,' +
            'продавец,перепродавец,' +
            'пошлец,пришлец,простец,птенец,пузач,' +
            'пугач,' + // филин
            'рвач,рифмач,рогач,рунец,рыбец,' +
            'ремнец,' + // паразитический плоский червь
            'самец,сарыч,севец,силач,синец,скворец,скопец,скрипач,скупец,' +
            'секач,' + // взрослый самец кабана или морского котика
            'слепец,слепыш,слухач,смехач,сморкач,снохач,соистец,сорванец,' +
            'спец,военспец,' +
            'стервец,стрелец,стригунец,стриж,стукач,сыч,' +
            'стрекач,' + // дать стрекача - убежать
            'струнец,' + // паразитический круглый червь
            'творец,телец,ткач,толмач,торгаш,трубач,трюкач,тунец,' +
            'трепач,трепец,' + // трепальщик льна
            'тупец,тупыш,' + // глупый человек
            'тяглец,' + // тяглый крестьянин
            'удалец,уж,усач,хитрец,хохмач,храбрец,хромец,хрыч,' +
            rkComma('фЯц,') +
            'циркач,червец,чернец,черныш,швец,шельмец,чтец,чиж,юнец';

console.log("stressHashesA delta:");
console.log(makeHashDeltas(stressHashesAInput));

console.log("stressHashesB delta:");
console.log(makeHashDeltas(stressHashesBInput));

// Чтож, не похоже, что хэши - это очень компактно.
// Вместо этого, я бы хотел попробовать инкрементное кодирование,
// которое уже хорошо себя зарекомендовало в тестах.
// Но поскольку у нас слова имеют разные начала, но одинаковые окончания,
// инкрементное кодирование я буду применять к словам, развёрнутым задом наперёд.

// https://en.wikipedia.org/wiki/Incremental_encoding
function encodeIncremental(strToEncode, baseString) {
    let common = 0;
    for (let len = 1; len <= baseString.length; len++) {
        if (strToEncode.indexOf(baseString.substring(0, len)) !== 0) {
            break;
        }
        common = len;
    }

    const diff = baseString.length - common;
    return [diff, strToEncode.substring(common, strToEncode.length)];
}

assertEquals(encodeIncremental('abcde', 'abc')[0], 0);
assertEquals(encodeIncremental('abcde', 'abc')[1], 'de');

assertEquals(encodeIncremental('abcde', 'abcx')[0], 1);
assertEquals(encodeIncremental('abcde', 'abcx')[1], 'de');


function makePair(left, right) {
    if (right <= 0b11) {
        return (left << 3) + right;
    } else {
        const lsb = right % 0b100;
        const msb = right - lsb;

        if (msb > 0b111100) {
            throw 'More than 4 bits.';
        }

        return (left << 7) | (msb << 1) | 0b100 | lsb;
    }
}

function extractPair(code) {
    if ((code & 0b100) === 0) {
        return [code >> 3, code & 0b11];
    }

    return [code >> 7, ((code >> 1) & 0b111100) | (code & 0b11)];
}

assertEquals(extractPair(makePair(1234567, 22))[0], 1234567);
assertEquals(extractPair(makePair(1234567, 22))[1], 22);


function encodeWithDictionary(inputStrings, dictionary) {
    let baseString = '';
    let result = [];

    for (let s of inputStrings) {
        const encoded = encodeIncremental(s, baseString);
        let dictIndex = dictionary.indexOf(encoded[1]);
        baseString = s;

        if (dictIndex < 0) {
            dictionary.push(encoded[1]);
            dictIndex = dictionary.length - 1;
        }

        result.push(makePair(dictIndex, encoded[0]));
    }

    return result;
}

function encodeItself(dictionary) {
    let baseString = '';

    for (let i = 0; i < dictionary.length; i++) {
        const item = dictionary[i];
        const encoded = encodeIncremental(item, baseString);
        let dictIndex = dictionary.indexOf(encoded[1]);
        baseString = item;

        if ((dictIndex >= 0) && (dictIndex < i)) {
            code = makePair(dictIndex, encoded[0]);
            if (code < 1000) {
                dictionary[i] = code;
            }
        }
    }
}

const reverseAll = arr => arr.map(s => s.split('').reverse().join(''));

    // Stemmer data
    const mobileVowelA = ['бубен', 'бугор',
        'ветер', 'вошь', 'вымысел', 'горшок', 'дятел', 'домысел', 'замысел',
        'кашель', 'коготь',
        'лапоть', 'лоб', 'локоть', 'ломоть', 'молебен', 'мох', 'ноготь', 'овен',
        'пепел', 'пес', 'пёс', 'петушок', 'помысел', 'порошок',
        'промысел', 'псалом', 'пушок', 'ров', 'рожь', 'рот',
        'сон', 'стебель', 'стишок',
        'угол', 'умысел', 'хребет', 'церковь', 'шов'
    ];
    const mobileVowelB = ['узел', 'уголь', 'чок', 'ешок', 'хол'];
    const en2a2b = [
        'ясень', 'бюллетень', 'олень', 'тюлень',
        'гордень', 'пельмень',
        'ячмень'
    ];

    const ok1 = [
        'лапоток', 'желток'
    ];
    const ok2 = [
        'поток', 'приток', 'переток', 'проток', 'биоток', 'электроток',
        'восток', 'водосток', 'водоток', 'воток',
        'знаток'
    ];
    const okExceptions = [
        'инок', 'исток',
        'обморок', 'порок', 'пророк', 'сток', 'урок'
    ];

const preparedStressA = reverseAll(stressHashesAInput.split(',')).toSorted();
const preparedStressB = reverseAll(stressHashesBInput.split(',')).toSorted();

const preparedMobileVowelA = reverseAll(mobileVowelA).toSorted();
const preparedMobileVowelB = reverseAll(mobileVowelB).toSorted();
const preparedEn2a2b = reverseAll(en2a2b).toSorted();
const preparedOk1 = reverseAll(ok1).toSorted();
const preparedOk2 = reverseAll(ok2).toSorted();
const preparedOkExceptions = reverseAll(okExceptions).toSorted();

// Pass 1.
const stressIncrementalDictionary = [];
encodeWithDictionary(preparedStressA, stressIncrementalDictionary);
encodeWithDictionary(preparedStressB, stressIncrementalDictionary);

stressIncrementalDictionary.sort((a, b) => 10000*(a.length - b.length) + a.localeCompare(b));
const stressHashesAIncremental = encodeWithDictionary(preparedStressA, stressIncrementalDictionary);
const stressHashesBIncremental = encodeWithDictionary(preparedStressB, stressIncrementalDictionary);

console.log("stress dict:");
encodeItself(stressIncrementalDictionary);
console.log(arrayToStr(stressIncrementalDictionary, true));

console.log("stress A:");
console.log(arrayToStr(stressHashesAIncremental));

console.log("stress B:");
console.log(arrayToStr(stressHashesBIncremental));


const okDictionary = [];
// Pass 1
encodeWithDictionary(preparedMobileVowelA, okDictionary);
encodeWithDictionary(preparedMobileVowelB, okDictionary);
encodeWithDictionary(preparedEn2a2b, okDictionary);
encodeWithDictionary(preparedOk1, okDictionary);
encodeWithDictionary(preparedOk2, okDictionary);
encodeWithDictionary(preparedOkExceptions, okDictionary);

okDictionary.sort((a, b) => 10000*(a.length - b.length) + a.localeCompare(b));
const mobileVowelAIncremental = encodeWithDictionary(preparedMobileVowelA, okDictionary);
const mobileVowelBIncremental = encodeWithDictionary(preparedMobileVowelB, okDictionary);
const en2a2bIncremental = encodeWithDictionary(preparedEn2a2b, okDictionary);
const ok1Incremental = encodeWithDictionary(preparedOk1, okDictionary);
const ok2Incremental = encodeWithDictionary(preparedOk2, okDictionary);
const okExceptionsIncremental = encodeWithDictionary(preparedOkExceptions, okDictionary);

console.log("Ok dict:");
encodeItself(okDictionary);
console.log(arrayToStr(okDictionary, true));

console.log("mobileVowelA:");
console.log(arrayToStr(mobileVowelAIncremental));
console.log("mobileVowelB:");
console.log(arrayToStr(mobileVowelBIncremental));
console.log("en2a2b:");
console.log(arrayToStr(en2a2bIncremental));
console.log("ok1:");
console.log(arrayToStr(ok1Incremental));
console.log("ok2:");
console.log(arrayToStr(ok2Incremental));
console.log("okExceptions:");
console.log(arrayToStr(okExceptionsIncremental));

// Но на небольших массивах этот подход не оправдался - гзипованный файл только растёт.


// -----------------------------------------

console.log("Run makeHashDeltas('word1,word2,word3,etc')");
