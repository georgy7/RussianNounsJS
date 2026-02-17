import { StressDictionary } from "../StressDictionary.js";
import { Gender } from "../Gender.js";

export function makeDefaultStressDictionary() {
    function putAll(dictionary, lemmaPrototype, value, joinedWordList) {
        const list = joinedWordList.split(',');
        for (let word of list) {
            const lemma = Object.assign({}, lemmaPrototype);
            lemma.text = word;
            dictionary.put(lemma, value);
        }
    }

    const d = new StressDictionary();
    const m = Object.freeze({gender: Gender.MASCULINE});
    const ma = Object.freeze({gender: Gender.MASCULINE, animate: true});
    const f = Object.freeze({gender: Gender.FEMININE});
    const fa = Object.freeze({gender: Gender.FEMININE, animate: true});
    const ca = Object.freeze({gender: Gender.COMMON, animate: true});
    const putM = (settings, word) => putAll(d, m, settings, word);

    putAll(d, m,
        'SSSSSSS-SSSSSS',
        'брёх,дёрн,идиш,имидж,мед,упрёк');

    putAll(d, {pluraleTantum: true},
        'SSSSSSS-SSSSSS',
        'ножны');

    putAll(d, m,
        'SSSSSSS-EEEEEE',
        'адрес,век,вечер,город,детдом,поезд,спецсчёт,субсчёт');

    putAll(d, m,
        'SSSSSSE-EEEEEE',
        'берег,бок,вес,лес,снег,дом,катер,счёт,мёд');

    putAll(d, ma,
        'SSSSSSS-SSSSSS',
        'балансёр,шофёр');

    putAll(d, m,
        'SSSSSSS-bbbbbb',
        'вексель,ветер');

    putM('SSSSSSE-ESEEEE', 'глаз');
    putM('SSSSSSE-bEEbEE', 'год');
    putM('SSSSSSb-bbbbbb', 'цех');

    putAll(d, {gender: Gender.NEUTER},
        'EEEEEEE-SSSSSS',
        'тесло,' +
        'стекло,автостекло,бронестекло,оргстекло,' +
        'пеностекло,смарт-стекло,спецстекло,' +
        'бедро,берцо,блесна,чело,стегно,стебло');

    putAll(d, f, 'EEEbEEE-SSESEE', 'щека');
    putAll(d, f, 'EEEEEEE-SSESEE', 'слеза');

    // Почти все слова на ж/ш/ч/ц с ударением на окончание
    // захешированы (см. stressHashes).

    putAll(d, m,
        'SbbSbbb-bbbbbb',
        'грош,шприц');

    putAll(d, m,
        'SssSsss-ssssss',
        'кишмиш,' +
        'кряж,' +  // обрубок бревна; гряда холмов
        'слеш,слэш');

    putAll(d, ma,
        'Sssssss-ssssss',
        'паныч');

    putM('SEESeEE-EEEEEE', 'стеллаж');
    putM('SeeSeee-eeeeee', 'шиномонтаж');

    putAll(d, {gender: Gender.NEUTER},
        'EEEEEEE-SsESEE',
        'плечо');

    // Если основа слова заканчивается на буквы жшчщц,
    // от ударения зависит окончание творительного падежа ед.ч.
    // В остальных словах ударение влияет на окончание в р.п. мн.ч.

    putAll(d, ca, 'EEEEEEE-SSSSSS', 'судья');
    putAll(d, ca, 'EEEEEEE-EEEEEE', 'левша');

    putAll(d, f, 'EEEEEEE-SESSSS', 'семья,макросемья');
    putAll(d, f, 'EEEEEEE-SEESEE', 'вожжа,свеча');
    putAll(d, f, 'EEESEEE-SSSSSS', 'душа');

    putAll(d, fa, 'EEEEEEE-SESESS', 'свинья,овца');

    putAll(d, f, 'EEEEEEE-eEeeee', 'скамья');

    putAll(d, f,
        'EEEEEEE-EEEEEE',
        'башка,кишка,ладья,лапша,моча,пыльца,статья');

    return d;
}
