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

$max_common = 0
$max_diff = 0
$max_dict_size = 0

$diff_len_stats = []


# https://en.wikipedia.org/wiki/Incremental_encoding
def encode_incremental(str_to_encode, base_string)
  common = 0
  (1..(base_string.size)).each { |len|
    break if str_to_encode.index(base_string[0,len]) != 0
    common = len
  }

  diff = base_string.size - common

  $max_common = [$max_common, common].max
  $diff_len_stats[diff] = (if $diff_len_stats[diff].nil? then 0 else $diff_len_stats[diff] end) + 1

  if diff > $max_diff
    $max_diff = diff
    puts "Max diff: #{$max_diff}. Max common: #{$max_common}."
  end

  return [diff, str_to_encode[common..-1]]
end

# The right number is in the range [0,63].
# It's encoded with varint-like method.
def make_micro_tuple(left, right)
  if right <= 0b11
    (left << 3) + right
  else
    lsb = right % 0b100
    msb = right - lsb
    throw 'More than 4 bits.' if msb > 0b111100
    (left << 7) | (msb << 1) | 0b100 | lsb
  end
end

def encode(collection, lemma, dictionary, base_string)
  base = base_string

  encode_strings = ->(arr) {
    r = arr.map { |x|
      throw 'base_string is not a string' unless base.kind_of?(String)
      result = encode_incremental(x, base)
      dict_index = dictionary.index { |x| x == result[1] }
      base = x

      if nil == dict_index
        dictionary.push(result[1])
        dict_index = dictionary.size - 1
        $max_dict_size = [$max_dict_size, dictionary.size].max
      end

      make_micro_tuple(dict_index, result[0])
    }

    if r.size > 1 then r else r[0] end
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
      if counter % 1000 == 0
        puts "#{letter} - lemma number #{counter} finished"
      end
    }
  }

  puts "Max dictionary size: #{$max_dict_size}"

  IO.write(fn, JSON.pretty_generate({
    dict: dictionary,
    m: dataM,
    f: dataF,
    n: dataN,
    c: dataC,
    p: dataP
  }, {indent:"", space:""}))
}

puts "\nDiff sizes:"
$diff_len_stats.size.times { |i|
  puts "#{i} characters: #{$diff_len_stats[i]} occurrences"
}
