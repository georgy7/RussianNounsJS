export function makeDefaultLocativeDictionary() {
    const map = new Map();

    const m = Object.freeze({gender: Gender.MASCULINE});
    const mAnimate = Object.freeze({gender: Gender.MASCULINE, animate: true});

    function addConfig(lemmaPrototype, condition, prepositions, ws, dTypes) {
        const words = ws.split(',');

        // Тут если номер, то это LocativeDeclensionType,
        // а если строка, то можно будет, наверно, здесь же предусмотреть
        // особую форму слова, если она не совпадает с предложным падежом.
        // Но пока что это не потребовалось.
        const declensionTypes = (dTypes instanceof Array) ? dTypes : [LocativeDeclensionType.U_SUFFIX];

        for (let word of words) {
            const lemma = Object.assign({}, lemmaPrototype);
            lemma.text = word;

            const lemmaKey = toLocativeDictionaryKey(Lemma.create(lemma));

            let configArray = map.get(lemmaKey);
            if (!configArray) {
                configArray = [];
                map.set(lemmaKey, configArray);
            }

            for (let p of prepositions) {
                for (let d of declensionTypes) {
                    configArray.push(encodeLocativeConfig(p, d, condition));
                }
            }
        }
    }

    // В. А. Плунгян выделяет у слов мужского рода
    // с особыми формами локатива семь семантических классов:

    const v = Object.freeze([LocativePreposition.V]);
    const vo = Object.freeze([LocativePreposition.VO]);
    const na = Object.freeze([LocativePreposition.NA]);

    // 1. вместилища, сосуды («в»)
    addConfig(m, LocativeFormAttribute.CONTAINER, v, 'мозг,пруд,стог,таз,год');
    addConfig(m, LocativeFormAttribute.CONTAINER, vo, 'рот');
    // Год может быть тем, в чём содержатся дни, например,
    // и может быть тем, на чём лежат события.
    // Это два разных случая. Их нельзя в один конфиг помещать,
    // т.к. у них условия через конъюнкцию проверяются.
    addConfig(m, LocativeFormAttribute.WAY, v, 'год');
    addConfig(m, LocativeFormAttribute.CONTAINER, v, 'гроб');
    // Не уверен, что семантика "во гробе" тут правильная.
    // Не исключено, что это имеет совершенно другой религиозный смысл, чем вместилище,
    // поэтому и склонение отличается.
    addConfig(m, LocativeFormAttribute.CONTAINER|LocativeFormAttribute.RELIGIOUS,
        vo, 'гроб', [LocativeDeclensionType.PREPOSITIONAL]);

    // 2. пространства («в»)
    addConfig(m, LocativeFormAttribute.LOCATION, v,
        'ад,бор,лес,порт,аэропорт,рай,сад,детсад,тыл,' +
        'низ,' +
        'хлев'  // по классификации Плунгяна, это вместилище (как и "цех")
    );

    // 3. конфигурации объектов, образующих устойчивые структуры («в»)
    addConfig(m, LocativeFormAttribute.STRUCTURE, v,
        'круг,полк,артполк,ряд,род,строй,лад');

    // 4. поверхности («на»)
    addConfig(m, LocativeFormAttribute.SURFACE, na, '' +
        'баз,' +    // скотный двор
        'берег,' +
        'бережок,' +    // (спорно)
        'вал,кон,круг,луг,пол,яр'
    );
    // На своём веку, столько-то раз на дню.
    // При этом, в веке — 100 лет, в дне — 24 часа.
    addConfig(m, LocativeFormAttribute.WAY, na, 'век,день');
    // Это читерство небольшое, но тут аналогичная ситуация.
    addConfig(m, LocativeFormAttribute.WAY, v, 'час');
    // "на корню" — устойчивое выражение (наречие), означающее "в процессе формирования".
    // "зарубить на корню" — "уничтожить в самом начале".
    addConfig(m, LocativeFormAttribute.WAY, na, 'корень');

    // 5. объекты с функциональной (не обязательно плоской) поверхностью («на»)
    addConfig(mAnimate, LocativeFormAttribute.OBJECT_WITH_FUNCTIONAL_SURFACE, na, 'вор');
    addConfig(m, LocativeFormAttribute.OBJECT_WITH_FUNCTIONAL_SURFACE, na, '' +
        'повод,' +  // ремень упряжки (возможно, обстоятельство - метафорическая упряжка, не уверен)
        'бочок,' +  // лежать на бочку, т.е. лежать боком вниз (почти не употребляется)
        'борт,воз,горб,кол,мост,плот,сук,' +
        'х' + String.fromCharCode(1091) + 'й'
    );
    addConfig(m, LocativeFormAttribute.OBJECT_WITH_FUNCTIONAL_SURFACE, na, '' +
        'крюк,болт',
        [LocativeDeclensionType.PREPOSITIONAL, LocativeDeclensionType.U_SUFFIX]
    );

    // 6. вещества и материалы («в» и «на»)
    const substance_or_resource = ',мёд,мех,пар,пух';
    addConfig(m, LocativeFormAttribute.SUBSTANCE, v, 'дым,жир,мел,пушок' + substance_or_resource);
    addConfig(m, LocativeFormAttribute.RESOURCE, na, 'газ,клей,спирт' + substance_or_resource);

    // 7. ситуации и состояния («в» и «на»)
    addConfig(m, LocativeFormAttribute.CONDITION, v,
        'бой,бред,быт,долг,плен,пыл,сок,ход,лад');
    // Тут я имею в виду смысл, употреблённый в текущем предложении.
    // Кое-где пишут, что есть еще употребление "в виду гор" в значении "там, откуда видны горы".
    // Никогда не слышал, чтобы так говорили. Если в эту классификацию это вписывать,
    // я не уверен, EXPOSURE это, CONDITION или что-то третье.
    addConfig(m, LocativeFormAttribute.EXPOSURE, v.concat(na), 'вид');
    addConfig(m, LocativeFormAttribute.EXPOSURE, na, 'слух,счёт,ветер,ветр,свет');
    addConfig(m, LocativeFormAttribute.MOTION, na, 'ход,бег,вес');
    // Пока непонятно, как разграничить "на каждом шагу" и "на первом шаге".
    addConfig(m, LocativeFormAttribute.MOTION|LocativeFormAttribute.WITH_ADJECTIVE, na, 'шаг');
    addConfig(m, LocativeFormAttribute.EVENT, na, 'бал,пир');
    // Может быть "дух" когда-то и значило "исповедь",
    // сейчас это только всех запутает.
    addConfig(m, LocativeFormAttribute.CONDITION, na, 'дух,плав');
    // На полном газу. Не уверен, как это сюда записать. Вроде, устойчивое выражение.
    addConfig(m, LocativeFormAttribute.MOTION|LocativeFormAttribute.WITH_ADJECTIVE, na, 'газ');

    // 1 и 5.
    addConfig(m, LocativeFormAttribute.CONTAINER, v, 'глаз,зоб,нос,шкаф');
    addConfig(m, LocativeFormAttribute.CONTAINER, vo, 'лоб');
    addConfig(m, LocativeFormAttribute.OBJECT_WITH_FUNCTIONAL_SURFACE, na, 'глаз,лоб,нос,шкаф,холм');

    let two_and_five = 'бок,верх,зад,угол';
    addConfig(m, LocativeFormAttribute.LOCATION, v, two_and_five);
    addConfig(m, LocativeFormAttribute.OBJECT_WITH_FUNCTIONAL_SURFACE, na, two_and_five);
    // Есть сомнения, в каких случаях используется форма предложного падежа.
    // Является ли решающим наличие любого определения (в *Красноярском* крае, на *внешнем* крае)
    // или подобные выражения являются исключениями и их нельзя обобщать.
    // Я пока что склоняюсь к первому варианту.
    addConfig(m, LocativeFormAttribute.LOCATION|LocativeFormAttribute.WITHOUT_ADJECTIVE, v, 'край');
    addConfig(m,
        LocativeFormAttribute.OBJECT_WITH_FUNCTIONAL_SURFACE|LocativeFormAttribute.WITHOUT_ADJECTIVE,
        na, 'край');

    // 4 и 6
    addConfig(m, LocativeFormAttribute.SURFACE, na, 'лёд,мох,снег');
    addConfig(m, LocativeFormAttribute.SUBSTANCE, vo, 'лёд,лён,мох');
    addConfig(m, LocativeFormAttribute.SUBSTANCE, v, 'снег');

    // А также, у слов женского рода третьего склонения с особыми формами
    // локатива пять семантических классов.
    // Однако, у локатива в словах женского рода третьего склонения отличается
    // от предложного падежа только ударение — смещается на последний слог,
    // на письме они не отличаются.

    return map;
}

/**
 * Это почти 100% уникальный ключ леммы, который учитывает наличие буквы ё и флаги.
 *
 * @param {Lemma} lemma
 * @returns {number} Размер числа примерно сопоставим с 2^42.
 */
export function toLocativeDictionaryKey(lemma) {
    const hasYo = (lemma.lower().includes('ё'))&1;
    const msb = ((lemma._flags & 0xFFFF) << 1) | hasYo;
    return (msb * 0x100000000) + lemma._hash;
}
