
# источники информации:
# - Современный русский язык. Морфология - Камынина А.А., Уч. пос. 1999 - 240 с.
# - Англоязычная википедия: http://en.wikipedia.org/wiki/Russian_grammar

misc = 
requiredString: (v) ->
  if(typeof v != "string")
    throw new Error(v + " is not a string.")

StemUtil =
  ###* Доп. проверки для стеммера ###
  getNounStem: (word) ->
    if _.last(word) is 'л' then return word
    StemUtil.getStem word
  ###* Русский стеммер из Snowball JavaScript Library. ###
  getStem: (word) ->
    stemmer = new Snowball('Russian');
    stemmer.setCurrent(word);
    stemmer.stem();
    stemmer.getCurrent();
  getInit: (s) ->
    if s.length <= 1 then return ''
    s.substring(0, s.length-1)
  getLastTwoChars: (s) ->
    if s.length <= 1 then return ''
    s.substring(s.length-2, s.length)

### Абстракция над справочником слов из БД. ###
class Vocabulary
  ###* является ли слово несклоняемым ###
  isIndeclinable:(word) ->
    # должно спрашивать из базы (их не так уж много)
    if _.contains(['пальто','рагу','такси'], word) then true
    else false
  isAnimate:(word) ->
    if _.contains(['муж','пролетарий','дядя'], word) then true
    else if _.contains(['стол','музей','парашют','вокзал','гвоздь',
    'параход','дирижабль','мармелад','пистолет','вопль','закат','дворище','чирей'], word) then false
    else null

window.Vocabulary = Vocabulary;

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
  misc.requiredString(word)
  misc.requiredString(gender)
  
  if vocabulary.isIndeclinable word
    return -1
  
  t = _.last(word)
  switch gender
    when Gender.FEMININE       
      `t == "а" || t == "я" ? 2 : 3`
    when Gender.MASCULINE
      `t == "а" || t == "я" ? 2 :
      word == "путь" ? 0 : 1`
    when Gender.NEUTER
      `word == "дитя" ? 0 :
      StemUtil.getLastTwoChars(word) == "мя" ? 3 : 1`
    when Gender.COMMON
      if t is 'а' or t is 'я' then 2
      else if t is 'и' then -1
      else 1
    else
      throw new Error("incorrect gender")

decline1 = (word, grCase, gender) ->
      stem = StemUtil.getNounStem word
      head = StemUtil.getInit word
      soft = ->
        lastChar = _.last(word)
        lastChar is 'ь' or lastChar is 'е'
      iyWord = ->
        e = StemUtil.getLastTwoChars(word)
        _.last(word) is 'й' or (e[0] is 'и' and _.contains(['й','е'], e[1]))
      shWord = ->
        _.contains(['ч','щ'], _.last(stem))
      switch grCase
        when CaseDefinition.NOMINATIVE
          word
        when CaseDefinition.GENITIVE
          if iyWord()
            head + 'я'
          else if soft() and not shWord()
            stem + 'я'
          else
            stem + 'а'
        when CaseDefinition.DATIVE
          if iyWord()
            head + 'ю'
          else if soft() and not shWord()
            stem + 'ю'
          else
            stem + 'у'
        when CaseDefinition.ACCUSATIVE
          if (gender is Gender.NEUTER)
            word
          else
            a = vocabulary.isAnimate(word)
            if a is true or a is null then decline1(word,CaseDefinition.GENITIVE,gender)
            else word
        when CaseDefinition.INSTRUMENTAL
          if iyWord()
            head + 'ем'
          else if soft() or _.contains(['ж','ч'], _.last(stem)) 
            stem + 'ем'
          else
            stem + 'ом'
        when CaseDefinition.PREPOSITIONAL
          if StemUtil.getLastTwoChars(word) is 'ий' or StemUtil.getLastTwoChars(word) is 'ие'
            head + 'и'
          else if _.last(word) is 'й'
            head + 'е'
          else
            stem + 'е'

decline3 = (word, grCase) ->
  stem = StemUtil.getNounStem word
  if StemUtil.getLastTwoChars(word) is 'мя'
    switch grCase
        when CaseDefinition.NOMINATIVE
          word
        when CaseDefinition.GENITIVE
          stem + 'ени'
        when CaseDefinition.DATIVE
          stem + 'ени'
        when CaseDefinition.ACCUSATIVE
          word
        when CaseDefinition.INSTRUMENTAL
          stem + 'енем'
        when CaseDefinition.PREPOSITIONAL
          stem + 'ени'
  else
    switch grCase
        when CaseDefinition.NOMINATIVE
          word
        when CaseDefinition.GENITIVE
          stem + 'и'
        when CaseDefinition.DATIVE
          stem + 'и'
        when CaseDefinition.ACCUSATIVE
          word
        when CaseDefinition.INSTRUMENTAL
          stem + 'ью'
        when CaseDefinition.PREPOSITIONAL
          stem + 'и'

decline = (word, gender, grCase) ->
  stem = StemUtil.getNounStem word
  head = StemUtil.getInit word
  
  if vocabulary.isIndeclinable word then return word
  
  declension = getDeclension word, gender
  
  switch declension
    when -1
      word
    when 0
      if word is 'путь'
        if grCase is CaseDefinition.INSTRUMENTAL then 'путем'
        else decline3(word, grCase)
      else
        throw new Error("unsupported")
    when 1
      decline1(word, grCase, gender)
    when 2
      soft = ->
        lastChar = _.last(word)
        lastChar is 'я'
      switch grCase
        when CaseDefinition.NOMINATIVE
          word
        when CaseDefinition.GENITIVE
          if soft() or _.contains(['ч','ж','ш','щ','г','к','х'], _.last(stem)) # soft, sibilant or velar
            head + 'и'
          else
            head + 'ы'
        when CaseDefinition.DATIVE
          if StemUtil.getLastTwoChars(word) is 'ия'
            head + 'и'
          else
            head + 'е'
        when CaseDefinition.ACCUSATIVE
          if soft()
            head + 'ю'
          else
            head + 'у'
        when CaseDefinition.INSTRUMENTAL
          if soft() or _.contains(['ц','ч','ж','ш','щ'], _.last(stem)) 
            head + 'ей'
          else
            head + 'ой'
        when CaseDefinition.PREPOSITIONAL
          if StemUtil.getLastTwoChars(word) is 'ия'
            head + 'и'
          else
            head + 'е'
    when 3
      decline3(word, grCase)

window.decline = decline


test = (data, gender) ->
  _.each CaseDefinition, ((caseValue, caseId) ->
    console.log '\n'+caseValue
    for i in data
      try
        console.log decline i, gender, caseValue
      catch e
        if e.message is "unsupported"
          console.log e.message
        else
          throw e
  )

window.testN = ->
  d = ['окно', 'житие', 'сопло', 'арго', 'пальто', 'вино']
  test d, Gender.MASCULINE  