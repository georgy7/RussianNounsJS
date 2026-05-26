import { Gender } from "../Gender.js";
import { leftShift } from "../utils/decompress.js";
import { LocativePreposition, encodeLocativeConfig,
    LDT_PREP, LDT_U,
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

        // Here, if it's a number, it's LocativeDeclensionType,
        // if it's a string, we could probably provide a special
        // word form here if it doesn't match the prepositional case.
        // But that hasn't been needed yet.
        const declensionTypes = (dTypes instanceof Array) ? dTypes : [LDT_U];

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

    // V. A. Plungyan identifies seven semantic classes for masculine nouns
    // with special locative forms:

    const v = [LocativePreposition.V];
    const vo = [LocativePreposition.VO];
    const na = [LocativePreposition.NA];

    // 1. containers, vessels ("in")
    addConfig(masc, leftShift(LFA_CONTAINER), v, 'мозг,пруд,стог,таз,год');
    addConfig(masc, leftShift(LFA_CONTAINER), vo, 'рот');
    // "Year" can be what contains days, for example,
    // and can be what events lie on.
    // These are two different cases. They cannot be put in one config,
    // since their conditions are checked by conjunction.
    addConfig(masc, leftShift(LFA_WAY), v, 'год');
    addConfig(masc, leftShift(LFA_CONTAINER), v, 'гроб');
    // Not sure that the semantics of "in the coffin" is correct here.
    // It's possible that it has a completely different religious meaning than a container,
    // hence the different declension.
    addConfig(masc, leftShift(LFA_CONTAINER)|leftShift(LFA_RELIGIOUS),
        vo, 'гроб', [LDT_PREP]);

    // 2. spaces ("in")
    addConfig(masc, leftShift(LFA_LOCATION), v,
        'ад,бор,лес,порт,аэропорт,рай,сад,детсад,тыл,' +
        'низ,' +
        'хлев'  // according to Plungyan's classification, this is a container (like "цех")
    );

    // 3. configurations of objects forming stable structures ("in")
    addConfig(masc, leftShift(LFA_STRUCTURE), v,
        'круг,полк,артполк,ряд,род,строй,лад');

    // 4. surfaces ("on")
    addConfig(masc, leftShift(LFA_SURFACE), na, '' +
        'баз,' +    // cattle yard
        'берег,' +
        'бережок,' +    // (debatable)
        'вал,кон,круг,луг,пол,яр'
    );
    // "На своём веку" (in one's lifetime), "сколько-то раз на дню" (so many times a day).
    // Meanwhile, "в веке" — 100 years, "в дне" — 24 hours.
    addConfig(masc, leftShift(LFA_WAY), na, 'век,день');
    // This is a bit of cheating, but the situation is similar here.
    addConfig(masc, leftShift(LFA_WAY), v, 'час');
    // "на корню" is a set phrase (adverb) meaning "in the process of formation".
    // "зарубить на корню" — "to destroy at the very beginning".
    addConfig(masc, leftShift(LFA_WAY), na, 'корень');

    // 5. objects with a functional (not necessarily flat) surface ("on")
    addConfig(mascAnimate, leftShift(LFA_OBJ_W_SURFACE), na, 'вор');
    addConfig(masc, leftShift(LFA_OBJ_W_SURFACE), na, '' +
        'повод,' +  // harness strap (possibly a circumstance - metaphorical harness, not sure)
        'бочок,' +  // to lie on one's side, i.e., lying with the side down (rarely used)
        'борт,воз,горб,кол,мост,плот,сук,' +
        'х' + String.fromCharCode(1091) + 'й'
    );
    addConfig(masc, leftShift(LFA_OBJ_W_SURFACE), na, '' +
        'крюк,болт',
        [LDT_PREP, LDT_U]
    );

    // 6. substances and materials ("in" and "on")
    const substance_or_resource = ',мёд,мех,пар,пух';
    addConfig(masc, leftShift(LFA_SUBSTANCE), v, 'дым,жир,мел,пушок' + substance_or_resource);
    addConfig(masc, leftShift(LFA_RESOURCE), na, 'газ,клей,спирт' + substance_or_resource);

    // 7. situations and states ("in" and "on")
    addConfig(masc, leftShift(LFA_CONDITION), v,
        'бой,бред,быт,долг,плен,пыл,сок,ход,лад');
    // I mean the meaning used in the current sentence.
    // Some sources say there's also the usage "в виду гор" meaning "where the mountains are visible".
    // I've never heard anyone say that. If this is to be included in this classification,
    // I'm not sure if it's EXPOSURE, CONDITION, or something third.
    addConfig(masc, leftShift(LFA_EXPOSURE), v.concat(na), 'вид');
    addConfig(masc, leftShift(LFA_EXPOSURE), na, 'слух,счёт,ветер,ветр,свет');
    addConfig(masc, leftShift(LFA_MOTION), na, 'ход,бег,вес');
    // It's not yet clear how to distinguish "на каждом шагу" (at every step) and "на первом шаге" (at the first step).
    addConfig(masc, leftShift(LFA_MOTION)|leftShift(LFA_WITH_ADJECTIVE), na, 'шаг');
    addConfig(masc, leftShift(LFA_EVENT), na, 'бал,пир');
    // Maybe "дух" once meant "confession",
    // but now it would only confuse everyone.
    addConfig(masc, leftShift(LFA_CONDITION), na, 'дух,плав');
    // "На полном газу" (at full throttle). Not sure how to record this. Seems like a set phrase.
    addConfig(masc, leftShift(LFA_MOTION)|leftShift(LFA_WITH_ADJECTIVE), na, 'газ');

    // 1 and 5.
    addConfig(masc, leftShift(LFA_CONTAINER), v, 'глаз,зоб,нос,шкаф');
    addConfig(masc, leftShift(LFA_CONTAINER), vo, 'лоб');
    addConfig(masc, leftShift(LFA_OBJ_W_SURFACE), na, 'глаз,лоб,нос,шкаф,холм');

    let two_and_five = 'бок,верх,зад,угол';
    addConfig(masc, leftShift(LFA_LOCATION), v, two_and_five);
    addConfig(masc, leftShift(LFA_OBJ_W_SURFACE), na, two_and_five);
    // There are doubts about when the prepositional case form is used.
    // Is the presence of any modifier decisive (in *Krasnoyarsk* kray, on the *outer* edge)
    // or are such expressions exceptions that cannot be generalized.
    // I currently lean towards the first option.
    addConfig(masc, leftShift(LFA_LOCATION)|leftShift(LFA_WITHOUT_ADJECTIVE), v, 'край');
    addConfig(masc,
        leftShift(LFA_OBJ_W_SURFACE)|leftShift(LFA_WITHOUT_ADJECTIVE),
        na, 'край');

    // 4 and 6
    addConfig(masc, leftShift(LFA_SURFACE), na, 'лёд,мох,снег');
    addConfig(masc, leftShift(LFA_SUBSTANCE), vo, 'лёд,лён,мох');
    addConfig(masc, leftShift(LFA_SUBSTANCE), v, 'снег');

    // Also, feminine nouns of the third declension with special locative forms
    // have five semantic classes.
    // However, the locative in feminine nouns of the third declension differs
    // from the prepositional case only in stress — it shifts to the last syllable,
    // they don't differ in writing.

    return map;
}

/**
 * This is an almost 100% unique lemma key that accounts for the presence of the letter ё and flags.
 *
 * @param {Lemma} lemma
 * @returns {number} The number size is approximately comparable to 2^42.
 */
export function toLocativeDictionaryKey(lemma) {
    const hasYo = (lemma.lower().includes('ё'))&1;
    const msb = ((lemma._flags & 0xFFFF) << 1) | hasYo;
    return (msb * 0x100000000) + lemma._hash;
}

export const locativeDictionary = Object.freeze(makeDefaultLocativeDictionary());
