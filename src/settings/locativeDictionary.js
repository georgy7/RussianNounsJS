import { Gender } from "../Gender.js";
import { leftShift } from "../utils/decompress.js";
import { LocativePreposition, LocativeDeclensionType, encodeLocativeConfig,
    LFA_CONTAINER, LFA_LOCATION, LFA_STRUCTURE, LFA_SURFACE,
    LFA_WAY, LFA_OBJ_W_SURFACE, LFA_SUBSTANCE, LFA_RESOURCE,
    LFA_CONDITION, LFA_EXPOSURE, LFA_MOTION, LFA_EVENT,
    LFA_WITH_ADJECTIVE, LFA_WITHOUT_ADJECTIVE, LFA_RELIGIOUS } from "../LocativeForm.js";
import { Lemma } from "../Lemma.js";

function makeDefaultLocativeDictionary() {
    const map = new Map();

    const masc = {gender: Gender.MASCULINE};
    const mascAnimate = {gender: Gender.MASCULINE, animate: true};

    function addConfig(lemmaOptions, condition, prepositions, ws, dTypes) {
        const words = ws.split(',');

        // Тут если номер, то это LocativeDeclensionType,
        // а если строка, то можно будет, наверно, здесь же предусмотреть
        // особую форму слова, если она не совпадает с предложным падежом.
        // Но пока что это не потребовалось.
        const declensionTypes = (dTypes instanceof Array) ? dTypes : [LocativeDeclensionType.U_SUFFIX];

        for (let word of words) {
            lemmaOptions.text = word;

            const lemmaKey = toLocativeDictionaryKey(Lemma.create(lemmaOptions));

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

    const v = [LocativePreposition.V];
    const vo = [LocativePreposition.VO];
    const na = [LocativePreposition.NA];

    // 1. вместилища, сосуды («в»)
    addConfig(masc, leftShift(LFA_CONTAINER), v, 'мозг,пруд,стог,таз,год');
    addConfig(masc, leftShift(LFA_CONTAINER), vo, 'рот');
    // Год может быть тем, в чём содержатся дни, например,
    // и может быть тем, на чём лежат события.
    // Это два разных случая. Их нельзя в один конфиг помещать,
    // т.к. у них условия через конъюнкцию проверяются.
    addConfig(masc, leftShift(LFA_WAY), v, 'год');
    addConfig(masc, leftShift(LFA_CONTAINER), v, 'гроб');
    // Не уверен, что семантика "во гробе" тут правильная.
    // Не исключено, что это имеет совершенно другой религиозный смысл, чем вместилище,
    // поэтому и склонение отличается.
    addConfig(masc, leftShift(LFA_CONTAINER)|leftShift(LFA_RELIGIOUS),
        vo, 'гроб', [LocativeDeclensionType.PREPOSITIONAL]);

    // 2. пространства («в»)
    addConfig(masc, leftShift(LFA_LOCATION), v,
        'ад,бор,лес,порт,аэропорт,рай,сад,детсад,тыл,' +
        'низ,' +
        'хлев'  // по классификации Плунгяна, это вместилище (как и "цех")
    );

    // 3. конфигурации объектов, образующих устойчивые структуры («в»)
    addConfig(masc, leftShift(LFA_STRUCTURE), v,
        'круг,полк,артполк,ряд,род,строй,лад');

    // 4. поверхности («на»)
    addConfig(masc, leftShift(LFA_SURFACE), na, '' +
        'баз,' +    // скотный двор
        'берег,' +
        'бережок,' +    // (спорно)
        'вал,кон,круг,луг,пол,яр'
    );
    // На своём веку, столько-то раз на дню.
    // При этом, в веке — 100 лет, в дне — 24 часа.
    addConfig(masc, leftShift(LFA_WAY), na, 'век,день');
    // Это читерство небольшое, но тут аналогичная ситуация.
    addConfig(masc, leftShift(LFA_WAY), v, 'час');
    // "на корню" — устойчивое выражение (наречие), означающее "в процессе формирования".
    // "зарубить на корню" — "уничтожить в самом начале".
    addConfig(masc, leftShift(LFA_WAY), na, 'корень');

    // 5. объекты с функциональной (не обязательно плоской) поверхностью («на»)
    addConfig(mascAnimate, leftShift(LFA_OBJ_W_SURFACE), na, 'вор');
    addConfig(masc, leftShift(LFA_OBJ_W_SURFACE), na, '' +
        'повод,' +  // ремень упряжки (возможно, обстоятельство - метафорическая упряжка, не уверен)
        'бочок,' +  // лежать на бочку, т.е. лежать боком вниз (почти не употребляется)
        'борт,воз,горб,кол,мост,плот,сук,' +
        'х' + String.fromCharCode(1091) + 'й'
    );
    addConfig(masc, leftShift(LFA_OBJ_W_SURFACE), na, '' +
        'крюк,болт',
        [LocativeDeclensionType.PREPOSITIONAL, LocativeDeclensionType.U_SUFFIX]
    );

    // 6. вещества и материалы («в» и «на»)
    const substance_or_resource = ',мёд,мех,пар,пух';
    addConfig(masc, leftShift(LFA_SUBSTANCE), v, 'дым,жир,мел,пушок' + substance_or_resource);
    addConfig(masc, leftShift(LFA_RESOURCE), na, 'газ,клей,спирт' + substance_or_resource);

    // 7. ситуации и состояния («в» и «на»)
    addConfig(masc, leftShift(LFA_CONDITION), v,
        'бой,бред,быт,долг,плен,пыл,сок,ход,лад');
    // Тут я имею в виду смысл, употреблённый в текущем предложении.
    // Кое-где пишут, что есть еще употребление "в виду гор" в значении "там, откуда видны горы".
    // Никогда не слышал, чтобы так говорили. Если в эту классификацию это вписывать,
    // я не уверен, EXPOSURE это, CONDITION или что-то третье.
    addConfig(masc, leftShift(LFA_EXPOSURE), v.concat(na), 'вид');
    addConfig(masc, leftShift(LFA_EXPOSURE), na, 'слух,счёт,ветер,ветр,свет');
    addConfig(masc, leftShift(LFA_MOTION), na, 'ход,бег,вес');
    // Пока непонятно, как разграничить "на каждом шагу" и "на первом шаге".
    addConfig(masc, leftShift(LFA_MOTION)|leftShift(LFA_WITH_ADJECTIVE), na, 'шаг');
    addConfig(masc, leftShift(LFA_EVENT), na, 'бал,пир');
    // Может быть "дух" когда-то и значило "исповедь",
    // сейчас это только всех запутает.
    addConfig(masc, leftShift(LFA_CONDITION), na, 'дух,плав');
    // На полном газу. Не уверен, как это сюда записать. Вроде, устойчивое выражение.
    addConfig(masc, leftShift(LFA_MOTION)|leftShift(LFA_WITH_ADJECTIVE), na, 'газ');

    // 1 и 5.
    addConfig(masc, leftShift(LFA_CONTAINER), v, 'глаз,зоб,нос,шкаф');
    addConfig(masc, leftShift(LFA_CONTAINER), vo, 'лоб');
    addConfig(masc, leftShift(LFA_OBJ_W_SURFACE), na, 'глаз,лоб,нос,шкаф,холм');

    let two_and_five = 'бок,верх,зад,угол';
    addConfig(masc, leftShift(LFA_LOCATION), v, two_and_five);
    addConfig(masc, leftShift(LFA_OBJ_W_SURFACE), na, two_and_five);
    // Есть сомнения, в каких случаях используется форма предложного падежа.
    // Является ли решающим наличие любого определения (в *Красноярском* крае, на *внешнем* крае)
    // или подобные выражения являются исключениями и их нельзя обобщать.
    // Я пока что склоняюсь к первому варианту.
    addConfig(masc, leftShift(LFA_LOCATION)|leftShift(LFA_WITHOUT_ADJECTIVE), v, 'край');
    addConfig(masc,
        leftShift(LFA_OBJ_W_SURFACE)|leftShift(LFA_WITHOUT_ADJECTIVE),
        na, 'край');

    // 4 и 6
    addConfig(masc, leftShift(LFA_SURFACE), na, 'лёд,мох,снег');
    addConfig(masc, leftShift(LFA_SUBSTANCE), vo, 'лёд,лён,мох');
    addConfig(masc, leftShift(LFA_SUBSTANCE), v, 'снег');

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

export const locativeDictionary = Object.freeze(makeDefaultLocativeDictionary());
