require 'nokogiri'
require 'solid_assert'

require 'set'
require 'json'

filename = 'dict.opcorpora.xml'
SolidAssert.enable_assertions

class Parser < Nokogiri::XML::SAX::Document

  def initialize
    @active = false
    @output_filename = 'nouns.json'
    @appended_something = false
    @all_forms = {}
    @processed_lemmas = Set.new
  end

  def fwrite(str)
    open(@output_filename, 'a') { |f|
      f.write str
    }
  end

  def start_element(name, attrs = [])
    if name == 'lemmata'
      @active = true
      File.delete(@output_filename) if File.exist?(@output_filename)
      fwrite "{\n"
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
      fwrite "\n}\n"
      return
    end
    return if not @active
    if name == 'l'
      if @word[:g].include? 'NOUN'
        @word[:g].delete 'NOUN'
        @word[:g] = @word[:g].to_a.sort!

        if @all_forms[:name] != @word[:name]
          if not @all_forms[:name].nil?
            if @processed_lemmas.include?(@all_forms[:name])
              puts "#{@all_forms[:name]} already exported to json"
            else
              # assert(!@processed_lemmas.include?(@all_forms[:name]))
              fwrite ",\n" if @appended_something
              fwrite "\t\"#{@all_forms[:name]}\": {\n"
              fwrite "\t\t\"g\": #{JSON.generate(@all_forms[:g])}\n"
              fwrite "\t}"
              @processed_lemmas.add(@all_forms[:name])
              @appended_something = true
            end
          end
          @all_forms[:name] = @word[:name]
          @all_forms[:g] = []
        end
        @all_forms[:g].push @word[:g]

      end
      @word = {}
    end
  end
end

Nokogiri::XML::SAX::Parser.new(Parser.new).parse(File.open(filename))

