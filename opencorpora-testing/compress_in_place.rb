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

def encode(collection, lemma, dictionary, base_string)
  base = base_string

  encode_strings = ->(arr) {
    return arr.map { |x|
      throw 'base_string is not a string' unless base.kind_of?(String)
      result = encode_incremental(x, base)
      dict_index = dictionary.index { |x| x == result[1] }
      base = x

      if nil == dict_index
        dictionary.push(result[1])
        dict_index = dictionary.size - 1
      end

      throw '>= 255 common characters' if result[0] > 0xFF

      dict_index * 0x100 + result[0]
    }
  }

  lemma['cases'].map! {|arr| encode_strings.(arr) }
  lemma['casesPlural'].map! {|arr| encode_strings.(arr) }

  collection.push(lemma)
  base
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

  base_string_p = ''
  base_string_m = ''
  base_string_f = ''
  base_string_n = ''
  base_string_c = ''

  input.each { |chunk|
    chunk.each { |lemma|
      if lemma['g'].include?('Pltm')
        base_string_p = encode(dataP, lemma, dictionary, base_string_p)
      elsif lemma['g'].include?('masc')
        base_string_m = encode(dataM, lemma, dictionary, base_string_m)
      elsif lemma['g'].include?('femn')
        base_string_f = encode(dataF, lemma, dictionary, base_string_f)
      elsif lemma['g'].include?('neut')
        base_string_n = encode(dataN, lemma, dictionary, base_string_n)
      elsif lemma['g'].include?('ms-f')
        base_string_c = encode(dataC, lemma, dictionary, base_string_c)
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
