import { createStressDictionary } from "../StressDictionary.js";
import { Gender } from "../Gender.js";

export function makeDefaultStressDictionary() {
    let lemmaOptions;
    const dictionary = createStressDictionary();

    function putAll(value, joinedWordList) {
        const list = joinedWordList.split(',');
        for (let word of list) {
            lemmaOptions.text = word;
            dictionary.put(lemmaOptions, value);
        }
    }

    lemmaOptions = {pluraleTantum: true};
    putAll('SSSSSSS-SSSSSS', 'ножны');

    lemmaOptions = {gender: Gender.MASCULINE};
    putAll('SSSSSSS-SSSSSS', 'брёх,дёрн,идиш,имидж,мед,упрёк');
    putAll('SSSSSSS-EEEEEE', 'адрес,век,вечер,город,детдом,поезд,спецсчёт,субсчёт');
    putAll('SSSSSSE-EEEEEE', 'берег,бок,вес,лес,снег,дом,катер,счёт,мёд');
    putAll('SSSSSSS-bbbbbb', 'вексель,ветер');
    putAll('SSSSSSE-ESEEEE', 'глаз');
    putAll('SSSSSSE-bEEbEE', 'год');
    putAll('SSSSSSb-bbbbbb', 'цех');

    // Almost all words ending in zh/sh/ch/tsts with stress on the ending
    // are hashed (see stressHashes).
    putAll('SbbSbbb-bbbbbb', 'грош,шприц');
    putAll('SssSsss-ssssss', 'кишмиш,кряж,слеш,слэш');
    putAll('SEESeEE-EEEEEE', 'стеллаж');
    putAll('SeeSeee-eeeeee', 'шиномонтаж');

    lemmaOptions = {gender: Gender.MASCULINE, animate: true};
    putAll('Sssssss-ssssss', 'паныч');
    putAll('SSSSSSS-SSSSSS', 'балансёр,шофёр');

    lemmaOptions = {gender: Gender.NEUTER};
    putAll('EEEEEEE-SsESEE', 'плечо');
    putAll('EEEEEEE-SSSSSS',
            'тесло,' +
            'стекло,автостекло,бронестекло,оргстекло,' +
            'пеностекло,смарт-стекло,спецстекло,' +
            'бедро,берцо,блесна,чело,стегно,стебло');

    lemmaOptions = {gender: Gender.FEMININE};
    putAll('EEEbEEE-SSESEE', 'щека');
    putAll('EEEEEEE-SSESEE', 'слеза');
    // If the word stem ends in zh/sh/ch/chtsts/tsts,
    // the instrumental singular ending depends on stress.
    // In other words, stress affects the genitive plural ending.
    putAll('EEEEEEE-SESSSS', 'семья,макросемья');
    putAll('EEEEEEE-SEESEE', 'вожжа,свеча');
    putAll('EEESEEE-SSSSSS', 'душа');
    putAll('EEEEEEE-eEeeee', 'скамья');
    putAll('EEEEEEE-EEEEEE', 'башка,кишка,ладья,лапша,моча,пыльца,статья');

    lemmaOptions = {gender: Gender.FEMININE, animate: true};
    putAll('EEEEEEE-SESESS', 'свинья,овца');

    lemmaOptions = {gender: Gender.COMMON, animate: true};
    putAll('EEEEEEE-SSSSSS', 'судья');
    putAll('EEEEEEE-EEEEEE', 'левша');

    return dictionary;
}
