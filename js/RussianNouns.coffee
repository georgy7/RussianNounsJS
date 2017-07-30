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

# Dependencies:
# - Underscore.js (MIT)

# Sources:
# - Современный русский язык. Морфология - Камынина А.А., Уч. пос. 1999 - 240 с.
# - Англоязычная википедия: http://en.wikipedia.org/wiki/Russian_grammar

# Demo:
# - https://georgy7.github.io/russian_nouns/testing.html


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

consonantsExceptJ = ['б','в','г','д','ж','з','к','л','м','н','п','р','с','т','ф','х','ц','ч','ш','щ']
vowels = ['а', 'о', 'у', 'э', 'ы', 'я', 'ё', 'ю', 'е', 'и']
isVowel = (character) ->
  _.contains(vowels, character)

last = (str) ->
  _.last(str)
lastN = (str, n) ->
  str.substring(str.length - n)
initial = (s) ->
  if s.length <= 1 then return ''
  s.substring(0, s.length-1)

StemUtil =
  ###* Доп. проверки для стеммера ###
  getNounStem: (word) ->
    lastChar = last(word)
    if _.contains(consonantsExceptJ, lastChar) then return word
    if 'ь' == lastChar then return initial(word)
    if 'ь' == last(initial(word)) then return initial(word)
    if 'о' == lastChar and _.contains(['л','м','н','т','х','в','с'], last(initial(word))) then return initial(word)
    StemUtil.getStem word
  getStem: (word) ->
    c = last(word)
    return initial(initial(word)) if ('й'==c or isVowel(c)) and isVowel(last(initial(word)))
    return initial(word) if isVowel(c)
    return word
  getInit: (s) ->
    initial(s)
  getLastTwoChars: (s) ->
    if s.length <= 1 then return ''
    s.substring(s.length-2, s.length)

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
  
  t = last(word)
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
      head = initial(word)
      soft = ->
        lastChar = last(word)
        lastChar is 'ь' or (lastChar is 'е' and !word.endsWith('це'))
      iyWord = ->
        last(word) is 'й' or _.contains(['ий', 'ие'], StemUtil.getLastTwoChars(word))
      schWord = ->
        _.contains(['ч','щ'], last(stem))
      tsWord = ->
        last(word) is 'ц'
      checkWord = ->
        word.endsWith('чек') and word.length >= 6
      okWord = ->
        checkWord() or (word.endsWith('ок') and not word.endsWith('шок') and !(word == 'урок') and not isVowel(word[word.length - 3]) and isVowel(word[word.length - 4]) and word.length >= 4)
      tsStem = ->
        if 'а' == word[word.length - 2]
          head
        else if lastN(head, 2) == 'ле'
          initial(head) + 'ь'
        else if isVowel(word[word.length - 2])
          if isVowel(word[word.length - 3])
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
          if (iyWord() and lemma.isSurname()) or (StemUtil.getLastTwoChars(word) == 'ый')
            stem + 'ого'
          else if iyWord()
            head + 'я'
          else if soft() and not schWord()
            stem + 'я'
          else if tsWord()
            tsStem() + 'ца'
          else if okWord()
            word.substring(0, word.length - 2) + 'ка'
          else
            stem + 'а'
        when Case.DATIVE
          if (iyWord() and lemma.isSurname()) or (StemUtil.getLastTwoChars(word) == 'ый')
            stem + 'ому'
          else if iyWord()
            head + 'ю'
          else if soft() and not schWord()
            stem + 'ю'
          else if tsWord()
            tsStem() + 'цу'
          else if okWord()
            word.substring(0, word.length - 2) + 'ку'
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
          if iyWord() and lemma.isSurname()
            stem + 'им'
          else if (StemUtil.getLastTwoChars(word) == 'ый')
            stem + 'ым'
          else if iyWord()
            head + 'ем'
          else if soft() or _.contains(['ж','ч','ш'], last(stem)) 
            stem + 'ем'
          else if tsWord()
            tsStem() + 'цем'
          else if word.endsWith('це')
            word + 'м'
          else if okWord()
            word.substring(0, word.length - 2) + 'ком'
          else if surnameType1()
            word + 'ым'
          else
            stem + 'ом'
        when Case.PREPOSITIONAL
          if (iyWord() and lemma.isSurname()) or (StemUtil.getLastTwoChars(word) == 'ый')
            stem + 'ом'
          else if _.contains(['ий', 'ие'], StemUtil.getLastTwoChars(word))
            head + 'и'
          else if last(word) is 'й'
            head + 'е'
          else if tsWord()
            tsStem() + 'це'
          else if okWord()
            word.substring(0, word.length - 2) + 'ке'
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
        lastChar = last(word)
        lastChar is 'я'
      surnameLike = ->
        word.endsWith('ова') or word.endsWith('ева') or (word.endsWith('ина') and not word.endsWith('стина'))
      ayaWord = ->
        word.endsWith('ая') and not ((word.length < 3) or isVowel(last(stem)))
      switch grCase
        when Case.NOMINATIVE
          word
        when Case.GENITIVE
          if ayaWord()
            stem + 'ой'
          else if lemma.isSurname()
            head + 'ой'
          else if soft() or _.contains(['ч','ж','ш','щ','г','к','х'], last(stem)) # soft, sibilant or velar
            head + 'и'
          else
            head + 'ы'
        when Case.DATIVE
          if ayaWord()
            stem + 'ой'
          else if lemma.isSurname()
            head + 'ой'
          else if StemUtil.getLastTwoChars(word) is 'ия'
            head + 'и'
          else
            head + 'е'
        when Case.ACCUSATIVE
          if ayaWord()
            stem + 'ую'
          else if soft()
            head + 'ю'
          else
            head + 'у'
        when Case.INSTRUMENTAL
          if ayaWord()
            stem + 'ой'
          else if soft() or _.contains(['ц','ч','ж','ш','щ'], last(stem)) 
            [head + 'ей', head + 'ею']
          else
            [head + 'ой', head + 'ою']
        when Case.PREPOSITIONAL
          if ayaWord()
            stem + 'ой'
          else if lemma.isSurname()
            head + 'ой'
          else if StemUtil.getLastTwoChars(word) is 'ия'
            head + 'и'
          else
            head + 'е'
    when 3
      decline3(word, grCase)
