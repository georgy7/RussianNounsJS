require 'json'

filename_template = 'nouns_LETTER.json'

abc = [
  'а', 'б', 'в', 'г', 'д',
  'е', 'ж', 'з', 'и',
  'й', 'к', 'л', 'м', 'н',
  'о', 'п', 'р', 'с', 'т',
  'у', 'ф', 'х', 'ц', 'ч',
  'ш', 'щ', 'ъ', 'ы', 'ь',
  'э', 'ю', 'я'
]

# https://en.wikipedia.org/wiki/Incremental_encoding
def encode_incremental(str_to_encode, base_string)
  common = 0
  (1..(base_string.size)).each { |len|
    break if str_to_encode.index(base_string[0,len]) != 0
    common = len
  }
  return [common, str_to_encode[common..-1]]
end

def encode_strings(arr, base_string, dictionary)
  return arr.map { |x|
    result = encode_incremental(x, base_string)
    dict_index = dictionary.index { |x| x == result[1] }

    if nil == dict_index
      dictionary.push(result[1])
      dict_index = dictionary.size - 1
    end

    throw '>= 255 common characters' if result[0] > 0xFF

    dict_index * 0x100 + result[0]
  }
end

def encode(collection, lemma, dictionary)
  if collection.size > 0
    base_string = collection.last['name']
    throw 'Name is not a string!' unless base_string.kind_of?(String)
    lemma['cases'].map! {|arr| encode_strings(arr, base_string, dictionary) }
    lemma['casesPlural'].map! {|arr| encode_strings(arr, base_string, dictionary) }
  end
  collection.push(lemma)
end

abc.each { |letter|
  fn = filename_template.sub('LETTER', letter)
  input = JSON.parse(IO.read(fn))

  dictionary = []
  dataM = []
  dataF = []
  dataN = []
  dataC = []
  dataP = []

  counter = 0

  input.each { |chunk|
    chunk.each { |lemma|
      if lemma['g'].include?('Pltm')
        encode(dataP, lemma, dictionary)
      elsif lemma['g'].include?('masc')
        encode(dataM, lemma, dictionary)
      elsif lemma['g'].include?('femn')
        encode(dataF, lemma, dictionary)
      elsif lemma['g'].include?('neut')
        encode(dataN, lemma, dictionary)
      elsif lemma['g'].include?('ms-f')
        encode(dataC, lemma, dictionary)
      end

      counter += 1
      puts "#{letter} - lemma number #{counter} finished"
    }
  }

  IO.write(fn, JSON.pretty_generate({
    dict: dictionary,
    m: dataM,
    f: dataF,
    n: dataN,
    c: dataC,
    p: dataP
  }, {indent:"", space:""}))
}
