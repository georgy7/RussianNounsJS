###
Copyright (c) 2011-2016 Устинов Георгий Михайлович

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
###

# источники информации:
# - Современный русский язык. Морфология - Камынина А.А., Уч. пос. 1999 - 240 с.
# - Англоязычная википедия: http://en.wikipedia.org/wiki/Russian_grammar

#------------------------------
# API
#------------------------------

window.Case =
  NOMINATIVE: "Именительный"
  GENITIVE: "Родительный"
  DATIVE: "Дательный"
  ACCUSATIVE: "Винительный"
  INSTRUMENTAL: "Творительный"
  PREPOSITIONAL: "Предложный"

window.Declension =
  0: 'разносклоняемые "путь" и "дитя"'
  1: 'муж., средний род без окончания'
  2: 'слова на "а", "я" (м., ж. и общий род)'
  3: 'жен. род без окончания, слова на "мя"'

window.Gender =
  "FEMININE": "женский род"
  "MASCULINE": "мужской род"
  "NEUTER": "средний род"
  "COMMON": "общий род"

###
interface Vocabulary
  lemmas:(word) -> Array<Lemma>

interface Lemma
  text:() -> String                 # Слово в именительном падеже ед.ч.
  isPluraliaTantum:() -> Boolean
  isIndeclinable:() -> Boolean
  isAnimate:() -> Boolean
  isSurname:() -> Boolean
  gender:() -> Gender

window.RussianNouns = 
  # Возвращает список, т.к. бывают "вторые" родительный, винительный и предложный падежи.
  # Также, сущ. ж. р. в творительном могут иметь как окончания -ей -ой, так и -ею -ою.
  decline: (lemma, grammaticalCase) -> [String]
###

class RussianNouns
  getDeclension: (lemma) ->
    getDeclension(lemma)
  decline: (lemma, grammaticalCase) ->
    declineAsList(lemma, grammaticalCase)

window.RussianNouns = RussianNouns

#------------------------------
# End of API
#------------------------------

misc = 
  requiredString: (v) ->
    if(typeof v != "string")
      throw new Error(v + " is not a string.")

StemUtil =
  ###* Доп. проверки для стеммера ###
  getNounStem: (word) ->
    lastChar = _.last(word)
    if _.contains(['л','м','н','т','х','в','с'], lastChar) then return word
    if 'ь' == lastChar then return _.initial(word).join('')
    if 'ь' == _.last(_.initial(word)) then return _.initial(word).join('')
    if 'о' == lastChar and _.contains(['л','м','н','т','х','в','с'], _.last(_.initial(word))) then return _.initial(word).join('')
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

vowels = ['а', 'о', 'у', 'э', 'ы', 'я', 'ё', 'ю', 'е', 'и']

###* 
Определяет склонение существительных
@param word слово в именительном падеже
@param gender пол
@returns {integer} склонение (см. Declension)
###
getDeclension = (lemma) ->
  word = lemma.text()
  gender = lemma.gender()
  misc.requiredString(word)
  misc.requiredString(gender)
  
  if lemma.isIndeclinable()
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

decline1 = (lemma, grCase) ->
      word = lemma.text()
      gender = lemma.gender()
      stem = StemUtil.getNounStem word
      head = StemUtil.getInit word
      soft = ->
        lastChar = _.last(word)
        lastChar is 'ь' or lastChar is 'е'
      iyWord = ->
        e = StemUtil.getLastTwoChars(word)
        _.last(word) is 'й' or (e[0] is 'и' and _.contains(['й','е'], e[1]))
      schWord = ->
        _.contains(['ч','щ'], _.last(stem))
      tsWord = ->
        _.last(word) is 'ц'
      tsStem = ->
        if 'а' == word[word.length - 2]
          word.substring(0, word.length - 1)
        else if 'е' == word[word.length - 2] and 'л' == word[word.length - 3]
          word.substring(0, word.length - 2) + 'ь'
        else if _.contains(vowels, word[word.length - 2])
          if _.contains(vowels, word[word.length - 3])
            word.substring(0, word.length - 2) + 'й'
          else
            word.substring(0, word.length - 2)
        else
          word.substring(0, word.length - 1)
      surnameType1 = ->
        lemma.isSurname() and (word.endsWith('ин') or word.endsWith('ов') or word.endsWith('ев'))
      switch grCase
        when Case.NOMINATIVE
          word
        when Case.GENITIVE
          if iyWord()
            head + 'я'
          else if soft() and not schWord()
            stem + 'я'
          else if tsWord()
            tsStem() + 'ца'
          else
            stem + 'а'
        when Case.DATIVE
          if iyWord()
            head + 'ю'
          else if soft() and not schWord()
            stem + 'ю'
          else if tsWord()
            tsStem() + 'цу'
          else
            stem + 'у'
        when Case.ACCUSATIVE
          if (gender is Gender.NEUTER)
            word
          else
            a = lemma.isAnimate()
            if a is true or a is null then decline1(lemma, Case.GENITIVE)
            else word
        when Case.INSTRUMENTAL
          if iyWord()
            head + 'ем'
          else if soft() or _.contains(['ж','ч','ш'], _.last(stem)) 
            stem + 'ем'
          else if tsWord()
            tsStem() + 'цем'
          else if surnameType1()
            word + 'ым'
          else
            stem + 'ом'
        when Case.PREPOSITIONAL
          if _.contains(['ий', 'ие'], StemUtil.getLastTwoChars(word))
            head + 'и'
          else if _.last(word) is 'й'
            head + 'е'
          else if tsWord()
            tsStem() + 'це'
          else
            stem + 'е'

decline3 = (word, grCase) ->
  stem = StemUtil.getNounStem word
  if StemUtil.getLastTwoChars(word) is 'мя'
    switch grCase
        when Case.NOMINATIVE
          word
        when Case.GENITIVE
          stem + 'ени'
        when Case.DATIVE
          stem + 'ени'
        when Case.ACCUSATIVE
          word
        when Case.INSTRUMENTAL
          stem + 'енем'
        when Case.PREPOSITIONAL
          stem + 'ени'
  else
    switch grCase
        when Case.NOMINATIVE
          word
        when Case.GENITIVE
          stem + 'и'
        when Case.DATIVE
          stem + 'и'
        when Case.ACCUSATIVE
          word
        when Case.INSTRUMENTAL
          stem + 'ью'
        when Case.PREPOSITIONAL
          stem + 'и'

declineAsList = (lemma, grCase) ->
  r = decline(lemma, grCase)
  return r if r instanceof Array
  [r]

decline = (lemma, grCase) ->
  word = lemma.text()
  gender = lemma.gender()
  stem = StemUtil.getNounStem word
  head = StemUtil.getInit word
  
  if lemma.isIndeclinable() then return word
  if lemma.isPluraliaTantum()
    throw "PluraliaTantum words are unsupported."
  
  declension = getDeclension lemma
  
  switch declension
    when -1
      word
    when 0
      if word is 'путь'
        if grCase is Case.INSTRUMENTAL then 'путем'
        else decline3(word, grCase)
      else
        throw new Error("unsupported")
    when 1
      decline1(lemma, grCase)
    when 2
      soft = ->
        lastChar = _.last(word)
        lastChar is 'я'
      surnameLike = ->
        word.endsWith('ова') or word.endsWith('ева') or (word.endsWith('ина') and not word.endsWith('стина'))
      switch grCase
        when Case.NOMINATIVE
          word
        when Case.GENITIVE
          if lemma.isSurname()
            head + 'ой'
          else if soft() or _.contains(['ч','ж','ш','щ','г','к','х'], _.last(stem)) # soft, sibilant or velar
            head + 'и'
          else
            head + 'ы'
        when Case.DATIVE
          if lemma.isSurname()
            head + 'ой'
          else if StemUtil.getLastTwoChars(word) is 'ия'
            head + 'и'
          else
            head + 'е'
        when Case.ACCUSATIVE
          if soft()
            head + 'ю'
          else
            head + 'у'
        when Case.INSTRUMENTAL
          if soft() or _.contains(['ц','ч','ж','ш','щ'], _.last(stem)) 
            [head + 'ей', head + 'ею']
          else
            [head + 'ой', head + 'ою']
        when Case.PREPOSITIONAL
          if lemma.isSurname()
            head + 'ой'
          else if StemUtil.getLastTwoChars(word) is 'ия'
            head + 'и'
          else
            head + 'е'
    when 3
      decline3(word, grCase)
