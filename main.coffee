
# основной источник информации:
# Современный русский язык. Морфология - Камынина А.А., Уч. пос. 1999 - 240 с.

misc = 
requiredString = (v) ->
  if(typeof v != "string")
    throw new Error(v + " is not a string.")

### Абстракция над справочником слов из БД. ###
class Vocabulary
  ###* является ли слово несклоняемым ###
  isIndeclinable:(word) ->
    # должно спрашивать из базы (их не так уж много)
    false



window.CaseDefinition =
  NOMINATIVE: "Именительный"
  GENITIVE: "Родительный"
  DATIVE: "Дательный"
  ACCUSATIVE: "Винительный"
  INSTRUMENTAL: "Творительный"
  PREPOSITIONAL: "Предложный"

DeclensionDefinition =
  0: 'разносклоняемые "путь" и "дитя"'
  1: 'муж., средний род без окончания'
  2: 'слова на "а", "я" (м., ж. и общий род)'
  3: 'жен. род без окончания, слова на "мя"'

window.Gender =
  "FEMININE": "женский род"
  "MASCULINE": "мужской род"
  "NEUTER": "средний род"
  "COMMON": "общий род"


vocabulary = new Vocabulary()
  
###* 
Определяет склонение существительных
@param word слово в именительном падеже
@param gender пол
@returns {integer} склонение (см. DeclensionDefinition)
###
window.getDeclension = (word, gender) ->
  requiredString(word)
  requiredString(gender)
  
  # todo: избавиться от substr
  if vocabulary.isIndeclinable word
    throw new Error("indeclinable word")
  
  switch gender
    when Gender.FEMININE 
      t = _.last(word)
      `t == "а" || t == "я" ? 2 : 3`
    when Gender.MASCULINE
      t = _.last(word)
      `t == "а" || t == "я" ? 2 :
      word == "путь" ? 0 : 1`
    when Gender.NEUTER
      `word == "дитя" ? 0 :
      word.substr(-2, 2) == "мя" ? 3 : 1`
    when Gender.COMMON then 2  # они все на -а, -я, либо несклоняемые
    else
      throw new Error("incorrect gender")

###* Доп. проверки для стеммера ###
getNounStem = (word) ->
  if _.last(word) is 'л' then return word
  getStem word

###* Русский стеммер из Snowball JavaScript Library. ###
getStem = (word) ->
  stemmer = new Snowball('Russian');
  stemmer.setCurrent(word);
  stemmer.stem();
  stemmer.getCurrent();

decline = (word, gender, grCase) ->
  stem = getNounStem word
  declension = getDeclension word, gender
  
  switch declension
    when 0
      throw new Error("unsupported")
      #switch grCase
      #  when CaseDefinition.NOMINATIVE
      #  when CaseDefinition.GENITIVE
      #  when CaseDefinition.DATIVE
      #  when CaseDefinition.ACCUSATIVE
      #  when CaseDefinition.INSTRUMENTAL
      #  when CaseDefinition.PREPOSITIONAL
    when 1
      switch grCase
        when CaseDefinition.NOMINATIVE
          word
        when CaseDefinition.GENITIVE
          if _.last(word) is 'ь'
            stem + 'я'
          else
            stem + 'а'
        when CaseDefinition.DATIVE
          if _.last(word) is 'ь'
            stem + 'ю'
          else
            stem + 'у'
        when CaseDefinition.ACCUSATIVE
          word # или как GENITIVE
        when CaseDefinition.INSTRUMENTAL
          if _.last(word) is 'ь'
            stem + 'ем'
          else
            stem + 'ом'
        when CaseDefinition.PREPOSITIONAL
          stem + 'е'
    when 2
      throw new Error("unsupported")
      #switch grCase
      #  when CaseDefinition.NOMINATIVE
      #  when CaseDefinition.GENITIVE
      #  when CaseDefinition.DATIVE
      #  when CaseDefinition.ACCUSATIVE
      #  when CaseDefinition.INSTRUMENTAL
      #  when CaseDefinition.PREPOSITIONAL
    when 3
      throw new Error("unsupported")
      #switch grCase
      #  when CaseDefinition.NOMINATIVE
      #  when CaseDefinition.GENITIVE
      #  when CaseDefinition.DATIVE
      #  when CaseDefinition.ACCUSATIVE
      #  when CaseDefinition.INSTRUMENTAL
      #  when CaseDefinition.PREPOSITIONAL

window.getStem = getStem
window.decline = decline


test = (data, gender) ->
  _.each CaseDefinition, ((caseValue, caseId) ->
    console.log '\n'+caseValue
    for i in data
      try
        console.log decline i, gender, caseValue
      catch e
        console.log 'error'
  )

window.testM = ->
  d = ['стол', 'путь', 'парашют', 'вокзал', 'параход', 'дирижабль', 'мармелад', 'вася', 'гвоздь', 'пилот', 'матершиник', 'пистолет', 'вопль', 'закат', 'дядя']
  test d, Gender.MASCULINE

window.testN = ->
  d = ['окно', 'житие', 'сопло', 'арго', 'вино']
  test d, Gender.MASCULINE  