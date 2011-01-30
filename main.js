
// UTF-8

function requiredString(v) {
	if(typeof v != "string") throw new Error(v + " is not a string.")
}

function isIndeclinable(word) {
	// пока что заглушка. должно спрашивать из базы, 
	// является ли слово несклоняемым (их не так уж много)
	return false
}

// основной источник инфы:
// Современный русский язык. Морфология - Камынина А.А., Уч. пос. 1999 - 240 с.

////////////////

// определяет склонение существительных
// word - слово в именительном падеже
// gender - пол

// 1 - муж., средний род без окончания
// 2 - слова на "а", "я" (м., ж. и общий род)
// 3 - жен. род без окончания
// слова на "мя" тоже включены в 3 склонение,
// 0 - разносклоняемые "путь" и "дитя"

// я тут использую substr, который может не поддерживаться в Qt и других движках,
// но он легко реализуется через substring и length (можно вынести в отдельный файлик)

function getDeclension(word, gender) {

	requiredString(word)
	requiredString(gender)
	
	if (isIndeclinable(word)) throw new Error("indeclinable word")
	
	switch (gender) {
		case "feminine":
			var t = word.substr(-1, 1)
			return t == "а" || t == "я" ? 2 : 3
			break
		case "masculine":
			var t = word.substr(-1, 1)
			return t == "а" || t == "я" ? 2 :
				word == "путь" ? 0 : 1
			break
		case "neuter":
			return word == "дитя" ? 0 :
				word.substr(-2, 2) == "мя" ? 3 : 1
			break
		case "common":
			return 2	// они все на -а, -я, либо несклоняемые
			break
		default:
			throw new Error("incorrect gender")
	}
}


