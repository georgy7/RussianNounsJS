class MockVocabulary
  ###* €вл€етс€ ли слово несклон€емым ###
  isIndeclinable:(word) ->
    # должно спрашивать из базы (их не так уж много)
    if _.contains(['пальто','рагу','такси'], word) then true
    else false
  isAnimate:(word) ->
    if _.contains(['муж','пролетарий','д€д€'], word) then true
    else if _.contains(['стол','музей','парашют','вокзал','гвоздь',
    'параход','дирижабль','мармелад','пистолет','вопль','закат','дворище','чирей'], word) then false
    else null

window.MockVocabulary = MockVocabulary
