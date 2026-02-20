import { Gender } from "../Gender.js";
import { BloomFilter } from "../utils/bloom.js";
import { calculateHash } from "../utils/hash.js";

const highPriorityBloomFilter = new BloomFilter();
const highPriorityExceptions = Object.freeze([
    [
        [
            Gender.MASCULINE,
            undefined
        ],
        {
            'болгарин': ['болгары'],
            'господин': ['господа'],
            'дядя': ['дяди', 'дядья'],
            'зуб': ['зубы', 'зубья'], // TODO: омонимы, переделать
            'клок': ['клочья', 'клоки'],
            'князь': ['князи', 'князья'],
            'кол': ['колы', 'колья'], // TODO: можно разделить на омонимы
            'месяц': ['месяцы'],
            'полдень': ['полдни', 'полудни'],
            'татарин': ['татары'],
            'хозяин': ['хозяева'],
            'цветок': ['цветки', 'цветы'],
            'черт': ['черти'],
            'чёрт': ['черти']
        }
    ],
    [
        [
            Gender.MASCULINE,
            true
        ],
        {
            'кондуктор': ['кондуктора', 'кондукторы'],
            'кум': ['кумовья'],
            'муж': ['мужья', 'мужи']
        }
    ],
    [
        [
            Gender.FEMININE,
            undefined
        ],
        {
            'гроздь': ['грозди', 'гроздья'],
            'курица': ['курицы', "куры"],
            'стая': ['стаи'],
            // И я решил зашить сюда даже случаи, когда итак слово норм обрабатывается,
            // но в корпусе там буква Ё. И почему бы не выдавать так же букву Ё.
            // В будущем это наверно надо отрефакторить.
            'щека': ['щёки'],
            'береста': ['берёсты'],
            'верста': ['вёрсты'],
            'десна': ['дёсны'],
            'жена': ['жёны'],
            'звезда': ['звёзды'],
            'кинозвезда': ['кинозвёзды'],
            'медсестра': ['медсёстры'],
            'метла': ['мётлы'],
            'пчела': ['пчёлы'],
            'сестра': ['сёстры'],
            'слеза': ['слёзы']
        }
    ],
    [
        [
            Gender.NEUTER,
            undefined
        ],
        {
            'брюхо': ['брюхи'],
            'колено': ['колена', 'колени', 'коленья'], // TODO: можно разделить на омонимы
            'древо': ['древа', 'древеса'],
            'ухо': ['уши'],
            'око': ['очи'],
            'дно': ['донья'],
            'чудо': ['чудеса', 'чуда'],
            'небо': ['небеса'],
            // Буква Ё:
            'бревно': ['брёвна'],
            'ведро': ['вёдра'],
            'веретено': ['веретёна'],
            'весло': ['вёсла'],
            'гнездо': ['гнёзда'],
            'зерно': ['зёрна'],
            'знамя': ['знамёна'],
            'колесо': ['колёса'],
            'облачко': ['облачка'],
            'озеро': ['озёра'],
            'полсотни': ['полусотни'],
            'ребро': ['рёбра'],
            'ремесло': ['ремёсла'],
            'седло': ['сёдла'],
            'село': ['сёла']
        }
    ]
]);

for (const rule of highPriorityExceptions) {
    Object.keys(rule[1]).map(word => highPriorityBloomFilter.addInteger(calculateHash(word)));
}

export function getPluralForms(lemma, lcWord) {
    if (highPriorityBloomFilter.hasInteger(lemma._hash)) {

        const gender = lemma.getGender();
        const animate = lemma.isAnimate();

        for (const [key, genderExceptions] of highPriorityExceptions) {

            const keyGender = key[0];
            const keyAnimate = key[1];

            if ((gender === keyGender)
                    && ((keyAnimate == null) || (keyAnimate === animate))
                    && genderExceptions.hasOwnProperty(lcWord)) {

                return genderExceptions[lcWord].slice();
            }
        }
    }
}
