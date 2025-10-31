require 'json'

abc = [
  'а', 'б', 'в', 'г', 'д',
  'е', 'ж', 'з', 'и',
  'й', 'к', 'л', 'м', 'н',
  'о', 'п', 'р', 'с', 'т',
  'у', 'ф', 'х', 'ц', 'ч',
  'ш', 'щ', 'ъ', 'ы', 'ь',
  'э', 'ю', 'я'
]

def extract_pair(code)
  if (code & 0b100) == 0
    return [code >> 3, code & 0b11]
  end
  [code >> 7, ((code >> 1) & 0b111100) | (code & 0b11)]
end

# https://en.wikipedia.org/wiki/Incremental_encoding
def decode_incremental(code, base_string, dictionary)
  pair = extract_pair(code)
  dictIndex = pair[0]
  common = base_string.length - pair[1]
  base_string[0...common] + dictionary[dictIndex]
end

def know_thyself!(mixed_array)
  for i in 0...(mixed_array.length) do
    v = mixed_array[i]
    if v.is_a? Integer
      v = decode_incremental(v, mixed_array[i-1], mixed_array)
    end
    mixed_array[i] = v
  end
end

def decode_word_form(base_string_ref, input_value, dictionary)
  if input_value.is_a? Integer
    base_string_ref[0] = decode_incremental(input_value, base_string_ref[0], dictionary)
    return [base_string_ref[0]]
  elsif input_value.is_a? Array
    return input_value.map { |x|
      base_string_ref[0] = decode_incremental(x, base_string_ref[0], dictionary)
      base_string_ref[0]
    }
  end
  nil
end

def stringify(o)
  JSON.pretty_generate(o, {indent:"", space:""})
end

def annotate_list(lemmas, dictionary, output_file)
  base_string = ['']
  lemmas.each_with_index { |lemma, index|
    comma = index + 1 < lemmas.size ? ',' : ''

    annotations = {
      g: lemma["g"],
      cases: [],
      casesPlural: []
    }

    annotations[:cases] = lemma["cases"].map {
      |word_form| decode_word_form(base_string, word_form, dictionary)
    }

    annotations[:casesPlural] = lemma["casesPlural"].map {
      |word_form| decode_word_form(base_string, word_form, dictionary)
    }

    a = (stringify(lemma).chomp + comma).lines
    b = (stringify(annotations).chomp + comma).lines
    line_count = [a.size, b.size].min

    short_array_offset = 0
    short_array_mode = false

    for i in 0...line_count do
      if !short_array_mode
        line = a[i].chomp.ljust(40) + b[i].chomp
        short_array_mode = true if (a[i].chomp == '"cases":[')
      else
        if (b[i + short_array_offset].chomp == '[') && (b[i + short_array_offset + 2].chomp.match? /^\],?$/)
          line = a[i].chomp.ljust(40) + b[i+short_array_offset].chomp + b[i+short_array_offset+1].chomp + b[i+short_array_offset+2].chomp
          short_array_offset += 2
        else
          line = a[i].chomp.ljust(40) + b[i + short_array_offset].chomp
        end
      end

      output_file.puts(line)
    end
  }
end

def process_letter(letter)
  input_template = 'nouns_LETTER.json'
  output_template = 'annotated_LETTER.txt'

  input_fn = input_template.sub('LETTER', letter)
  output_fn = output_template.sub('LETTER', letter)

  if File.exist?(output_fn)
    puts "The file #{output_fn} already exists. Skipped."
    return 0
  elsif !File.exist?(input_fn)
    puts "The file #{input_fn} not found. Skipped."
    return 0
  end

  input = JSON.parse(IO.read(input_fn))
  dictionary = input["dict"]

  know_thyself!(dictionary)

  File.open(output_fn, "w") do |file|
    file.puts '{'
    file.puts '"dict":['
    dictionary.each_with_index { |item, index|
      comma = index + 1 < dictionary.length ? ',' : ''
      file.puts "\"#{item}\"#{comma}"
    }
    file.puts '],'
    file.puts '"m":['
    annotate_list(input["m"], dictionary, file)
    file.puts '],'
    file.puts '"f":['
    annotate_list(input["f"], dictionary, file)
    file.puts '],'
    file.puts '"n":['
    annotate_list(input["n"], dictionary, file)
    file.puts '],'
    file.puts '"c":['
    annotate_list(input["c"], dictionary, file)
    file.puts '],'
    file.puts '"p":['
    annotate_list(input["p"], dictionary, file)
    file.puts ']'
    file.puts '}'
  end
  1
end


processed_files = 0

abc.each { |letter|
  processed_files += process_letter letter
}

puts "Processed #{processed_files} of #{abc.size} files."

