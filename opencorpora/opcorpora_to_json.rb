require 'nokogiri'
require 'active_support/all'
require 'parallel'

require 'set'
require 'json'

filename = 'dict.opcorpora.xml'

class Parser < Nokogiri::XML::SAX::Document

  def initialize(letter)
    @letter_a = letter
    @active = false
    @result = {}
  end

  def result
    @result.values
  end

  def start_element(name, attrs = [])
    if name == 'lemmata'
      @active = true
      return
    end
    return if not @active
    if name == 'l'
      attrs.each { |e|
        if e[0] == 't'
          @word = {}
          @word[:name] = e[1]
          @word[:g] = Set.new
        end
      }
    elsif name == 'g'
      return if @word[:name].nil?
      attrs.each { |e|
        if e[0] == 'v'
          @word[:g].add(e[1])
        end
      }
    end
  end

  def characters(string)
  end

  def end_element(name)
    if name == 'lemmata'
      @active = false
      return
    end
    return if not @active
    if name == 'l'
      if @word[:g].include? 'NOUN'
        @word[:g].delete 'NOUN'
        @word[:g] = @word[:g].to_a.sort!

        first_letter = @word[:name][0].mb_chars.downcase.to_s
        if @letter_a.include?(first_letter)
          if @result[@word[:name]].nil?
            @result[@word[:name]] = {
              :name => @word[:name],
              :g => []
            }
          end
          g_sets = @result[@word[:name]][:g].map { |n| Set.new(n) }
          @result[@word[:name]][:g].push(@word[:g]) if (!g_sets.include?(Set.new(@word[:g])))
        end

      end
      @word = {}
    end
  end
end

class FileAppender
  def initialize(filename)
    @output_filename = filename
    File.delete(@output_filename) if File.exist?(@output_filename)
  end

  def write(str)
    open(@output_filename, 'a') { |f|
      f.write str
    }
  end
end

output_filename_template = 'nouns_LETTER.json'

abc = [
  ['а'], ['б'], ['в'], ['г'], ['д'],
  ['е', 'ё'], ['ж'], ['з'], ['и'],
  ['й'], ['к'], ['л'], ['м'], ['н'],
  ['о'], ['п'], ['р'], ['с'], ['т'],
  ['у'], ['ф'], ['х'], ['ц'], ['ч'],
  ['ш'], ['щ'], ['ъ'], ['ы'], ['ь'],
  ['э'], ['ю'], ['я']
]

Parallel.each(abc, :in_threads => 4) { |letter|
  p = Parser.new letter
  fn = output_filename_template.sub('LETTER', letter[0])
  puts "Started #{fn}..."
  Nokogiri::XML::SAX::Parser.new(p).parse(File.open(filename))
  f = FileAppender.new(fn)
  f.write "{\n"
  appended_something = false
  p.result.each { |word|
    f.write ",\n" if appended_something
    f.write "\t\"#{word[:name]}\": {\n"
    f.write "\t\t\"g\": #{JSON.generate(word[:g])}\n"
    f.write "\t}"
    appended_something = true
  }
  f.write "\n}\n"
}
