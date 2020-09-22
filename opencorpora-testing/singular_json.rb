=begin
This is free and unencumbered software released into the public domain.

Anyone is free to copy, modify, publish, use, compile, sell, or
distribute this software, either in source code form or as a compiled
binary, for any purpose, commercial or non-commercial, and by any
means.

In jurisdictions that recognize copyright laws, the author or authors
of this software dedicate any and all copyright interest in the
software to the public domain. We make this dedication for the benefit
of the public at large and to the detriment of our heirs and
successors. We intend this dedication to be an overt act of
relinquishment in perpetuity of all present and future rights to this
software under copyright law.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

For more information, please refer to <http://unlicense.org/>
=end

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
    @active_l = false
    @active_f = false
    @result = {}
  end

  def result
    @result.values
  end

  def get_attr(attrs, key)
    r = nil
    attrs.each { |e|
      if e[0] == key
        r = e[1]
      end
    }
    return r
  end

  def start_element(name, attrs = [])
    if name == 'lemmata'
      @active = true
      return
    end
    return if not @active
    if name == 'l'
      @word = {}
      @active_l = true
      @word[:g] = Set.new
      @word[:cases] = [[], [], [], [], [], []]
      @word[:name] = get_attr(attrs, 't')
    elsif name == 'g' && @active_l && !(@word[:name].nil?)
      @word[:g].add(get_attr(attrs, 'v'))
    elsif name == 'f'
      @word_form = {}
      @active_f = true
      @word_form[:name] = get_attr(attrs, 't')
      @word_form[:g] = Set.new
    elsif name == 'g' && @active_f
      @word_form[:g].add(get_attr(attrs, 'v'))
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
      @active_l = false
    elsif name == 'f' and @active_f
      if !(@word_form[:name].to_s.strip.empty?) and @word_form[:g].include?('sing') and @letter_a.include?(@word_form[:name][0].mb_chars.downcase.to_s)
        if @word_form[:g].include? 'nomn'
          @word[:cases][0][0] = @word_form[:name]
        elsif @word_form[:g].include?('gen1') or (@word_form[:g].include?('gent') and !(@word_form[:g].include?('gen2')))
          @word[:cases][1][0] = @word_form[:name]
        elsif @word_form[:g].include? 'gen2'
          @word[:cases][1][1] = @word_form[:name]
          puts "gen2: #{@word_form[:name]}"
        elsif @word_form[:g].include? 'datv'
          @word[:cases][2][0] = @word_form[:name]
        elsif @word_form[:g].include? 'accs' and !(@word_form[:g].include?('acc2'))
          @word[:cases][3][0] = @word_form[:name]
        elsif @word_form[:g].include? 'acc2'
          @word[:cases][3][1] = @word_form[:name] if @word[:cases][3].size <= 1
          @word[:cases][3].push(@word_form[:name]) if @word[:cases][3].size > 1
          puts "acc2: #{@word_form[:name]}"
        elsif @word_form[:g].include? 'ablt'
          @word[:cases][4][0] = @word_form[:name]
        elsif @word_form[:g].include?('loc1') or (@word_form[:g].include?('loct') and !(@word_form[:g].include?('loc2')))
          @word[:cases][5][0] = @word_form[:name]
        elsif @word_form[:g].include? 'loc2'
          @word[:cases][6] = []
          @word[:cases][6][0] = @word_form[:name]
          puts "loc2: #{@word_form[:name]}"
        elsif @word_form[:g].include? 'voct'
          @word[:cases][7] = []
          @word[:cases][7][0] = @word_form[:name] # Vocative case
          puts "voct: #{@word_form[:name]}"
        end
      end
      @active_f = false
      @word_form = nil
    elsif name == 'lemma'
      @active_f = false
      @active_l = false

      if @word[:g].include? 'NOUN' and word_has_all_cases
        @word[:g].delete 'NOUN'
        @word[:g] = @word[:g].to_a.sort!

        if @word[:cases][6].nil?
          @word[:cases][6] = @word[:cases][5].deep_dup
        end

        first_letter = @word[:name][0].mb_chars.downcase.to_s
        if @letter_a.include?(first_letter)
          if @result[@word[:name]].nil?
            @result[@word[:name]] = []
          end
          @result[@word[:name]].push({
            :name => @word[:name],
            :g => @word[:g],
            :cases => @word[:cases]
          })
          
          # Warnings
          @word[:cases].each_with_index { |c, index|
            if [1,3,5].include?(index) and (c.size > 1) and (c.uniq.size < c.size)
              case_name = 'genitive case' if index == 1
              case_name = 'accusative case' if index == 3
              case_name = 'locative case' if index == 5
              puts "Dublicates of the #{case_name} of \"#{@word[:name]}\": #{@word[:cases][index]}"
            end
          }
        end

      end
      @word = {}

    end
  end

  def word_has_all_cases
    # Except vocative and locative cases
    return @word[:cases][0..5].all? { |case_forms|
      !(case_forms.empty?)
    }
  end
end

output_filename_template = 'nouns_singular_LETTER.json'

abc = [
  ['а'], ['б'], ['в'], ['г'], ['д'],
  ['е', 'ё'], ['ж'], ['з'], ['и'],
  ['й'], ['к'], ['л'], ['м'], ['н'],
  ['о'], ['п'], ['р'], ['с'], ['т'],
  ['у'], ['ф'], ['х'], ['ц'], ['ч'],
  ['ш'], ['щ'], ['ъ'], ['ы'], ['ь'],
  ['э'], ['ю'], ['я']
]

ram_file = IO.read(filename)
part = abc

# On Windows just run from different terminals:
# ruby singular_json.rb 1 > singular_json_output_1.txt
# ruby singular_json.rb 2 > singular_json_output_2.txt
# ruby singular_json.rb 3 > singular_json_output_3.txt
# ruby singular_json.rb 4 > singular_json_output_4.txt
if !(ARGV.empty?)
  STDERR.puts "ARGV = #{ARGV}"
  part = abc[0..8] if (ARGV[0].to_s == '1')
  part = abc[9..16] if (ARGV[0].to_s == '2')
  part = abc[17..24] if (ARGV[0].to_s == '3')
  part = abc[25..(abc.size - 1)] if (ARGV[0].to_s == '4')
  puts "Part #{ARGV[0]}"
  STDERR.puts "Part #{ARGV[0]}"
end

Parallel.each(part, :in_processes => 4) { |letter|
  p = Parser.new letter
  fn = output_filename_template.sub('LETTER', letter[0])
  puts "Started #{fn}..."
  Nokogiri::XML::SAX::Parser.new(p).parse(ram_file)
  
  File.delete(fn) if File.exist?(fn)
  File.open(fn, 'w') do |f|
    f.puts JSON.pretty_generate(p.result, {indent:"", space:""})
  end
}
