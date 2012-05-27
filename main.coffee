
requiredString = (v) ->
  if(typeof v != "string")
    throw new Error(v + " is not a string.")

isIndeclinable = (word) ->
  # пока что заглушка. должно спрашивать из базы, 
  # является ли слово несклоняемым (их не так уж много)
  false

# основной источник инфы:
# Современный русский язык. Морфология - Камынина А.А., Уч. пос. 1999 - 240 с.



DeclensionDefinition =
  1: 'муж., средний род без окончания'
  2: 'слова на "а", "я" (м., ж. и общий род)'
  3: 'жен. род без окончания, слова на "мя"'
  4: 'разносклоняемые "путь" и "дитя"'

window.Gender =
  "FEMININE": ""
  "MASCULINE": ""
  "NEUTER": "средний род"
  "COMMON": "общий род"

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
  if isIndeclinable word
    throw new Error("indeclinable word")
  
  switch gender
    when Gender.FEMININE 
      t = word.substr(-1, 1)
      `t == "а" || t == "я" ? 2 : 3`
    when Gender.MASCULINE
      t = word.substr(-1, 1)
      `t == "а" || t == "я" ? 2 :
      word == "путь" ? 0 : 1`
    when "neuter"
      `word == "дитя" ? 0 :
      word.substr(-2, 2) == "мя" ? 3 : 1`
    when "common" then 2  # они все на -а, -я, либо несклоняемые
    else
      throw new Error("incorrect gender")
