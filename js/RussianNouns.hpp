#ifndef RUSSIAN_NOUNS_HPP
#define RUSSIAN_NOUNS_HPP

/*
  Copyright (c) 2011-2020 Устинов Георгий Михайлович

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
*/

#include <algorithm>
#include <iostream> // TODO удалить
#include <memory>
#include <sstream>

// Draft ! Draft ! Draft ! Draft ! Draft ! Draft ! Draft ! Draft ! Draft !

// Просто для разминки мозгов (плохо знаю C++).
// Это C++11.

// Принимает строки только в UTF-8.

namespace RussianNouns {

enum class Gender : char {
  GENDERLESS = 'G',
  FEMININE = 'F',
  MASCULINE = 'M',
  NEUTER = 'N',
  COMMON = 'C'
};

class LemmaBuilder;

// Попытался сделать леммы иммутабельными, насколько это возможно.
// У меня есть сомнения про иммутабельность const std::string.
class Lemma final {
  friend class LemmaBuilder;

public:
  ~Lemma() { std::wcout << u8"deleted Lemma" << std::endl; }

  LemmaBuilder copy() noexcept;

  std::string str() noexcept {
    std::ostringstream rs;
    auto bs = [](bool x) { return x ? u8", true" : u8", false"; };
    rs << u8"{ \"" << internalText << u8"\", ";
    rs << static_cast<char>(internalGender);
    rs << bs(pluraliaTantum) << bs(indeclinable);
    rs << bs(animate) << bs(surname) << bs(name);
    rs << bs(transport) << bs(watercraft) << u8" }";
    return rs.str();
  }

  std::string text() noexcept { return internalText; }

  std::string lower() noexcept { return lowerCaseText; }

  bool isPluraliaTantum() noexcept { return pluraliaTantum; }

  Gender getGender() noexcept { return internalGender; }

  bool isIndeclinable() noexcept { return indeclinable; }

  bool isAnimate() noexcept { return animate || surname || name; }

  bool isASurname() noexcept { return surname; }

  bool isAName() noexcept { return name; }

  bool isATransport() noexcept { return transport || watercraft; }

  bool isAWatercraft() noexcept { return watercraft; }

  // TODO equals

  // TODO fuzzyEquals

private:
  Lemma(Gender gender, bool pluraliaTantum, bool indeclinable, bool animate,
        bool surname, bool name, bool transport, bool watercraft,
        std::string internalText, std::string lowerCaseText) noexcept
      : internalGender(gender), pluraliaTantum(pluraliaTantum),
        indeclinable(indeclinable), animate(animate), surname(surname),
        name(name), transport(transport), watercraft(watercraft),
        internalText(internalText), lowerCaseText(lowerCaseText) {}

  const Gender internalGender;
  const bool pluraliaTantum, indeclinable;
  const bool animate, surname, name, transport, watercraft;
  const std::string internalText, lowerCaseText;
};

static std::string toRussianLowerCaseUtf8(const std::string input) {
  std::string r = input;

  for (size_t i = 0; i < r.size(); i++) {
    const auto c0 = r[i - 1];
    const auto c = r[i];

    if ((char)0xD0 == c0) {
      if (((char)0x90 <= c) && (c <= (char)0x9F)) { // А-П
        r[i] = r[i] + (char)0x20;
      } else if (((char)0xA0 <= c) && (c <= (char)0xAF)) { // Р-Я
        r[i - 1] = (char)0xD1;
        r[i] = r[i] - (char)0x20;
      } else if ((char)0x81 == c) { // Ё
        r[i - 1] = (char)0xD1;
        r[i] = (char)0x91;
      }
    }
  }

  return r;
}

class LemmaBuilder {
public:
  LemmaBuilder(const std::string text) noexcept {
    this->internalText = text;
    this->lowerCaseText = toRussianLowerCaseUtf8(text);
  }

  /// Допустим, надо создать копию леммы, где будет отличаться одно поле.
  LemmaBuilder(const Lemma &b) noexcept;

  ~LemmaBuilder() { std::wcout << u8"deleted Builder" << std::endl; }

  /// Чтобы редактировать билдер, созданный из леммы.
  LemmaBuilder &withText(const std::string text) noexcept {
    this->internalText = text;
    this->lowerCaseText = toRussianLowerCaseUtf8(text);
    return *this;
  }

  LemmaBuilder &withGender(Gender g) noexcept {
    this->internalGender = g;
    return *this;
  }

  LemmaBuilder &withPluraliaTantum(bool pt) noexcept {
    this->pluraliaTantum = pt;
    return *this;
  }

  LemmaBuilder &withIndeclinable(bool indeclinable) noexcept {
    this->indeclinable = indeclinable;
    return *this;
  }

  LemmaBuilder &withAnimate(bool animate) noexcept {
    this->animate = animate;
    return *this;
  }

  LemmaBuilder &withSurname(bool surname) noexcept {
    this->surname = surname;
    return *this;
  }

  LemmaBuilder &withName(bool name) noexcept {
    this->name = name;
    return *this;
  }

  LemmaBuilder &withTransport(bool transport) noexcept {
    this->transport = transport;
    return *this;
  }

  LemmaBuilder &withWatercraft(bool watercraft) noexcept {
    this->watercraft = watercraft;
    return *this;
  }

  Lemma build() {
    // TODO проверка на кириллическое слово
    Gender g = checkedGender();

    return Lemma(g, pluraliaTantum, indeclinable, animate, surname, name,
                 transport, watercraft, internalText, lowerCaseText);
  }

  std::shared_ptr<Lemma> buildShared() {
    // TODO проверка на кириллическое слово
    Gender g = checkedGender();

    return std::shared_ptr<Lemma>(
        new Lemma(g, pluraliaTantum, indeclinable, animate, surname, name,
                  transport, watercraft, internalText, lowerCaseText));
  }

private:
  Gender internalGender = Gender::GENDERLESS;

  bool pluraliaTantum = false;
  bool indeclinable = false;

  bool animate = false;
  bool surname = false;
  bool name = false;
  bool transport = false;
  bool watercraft = false;

  std::string internalText;
  std::string lowerCaseText;

  Gender checkedGender() {
    Gender g = internalGender;

    if (pluraliaTantum) {
      g = Gender::GENDERLESS; // Слова т. н. парного рода.
    } else if (Gender::GENDERLESS == g) {
      throw std::runtime_error("A grammatical gender required.");
    }

    return g;
  }
};

LemmaBuilder::LemmaBuilder(const Lemma &b) noexcept {
  this->internalGender = b.internalGender;

  this->pluraliaTantum = b.pluraliaTantum;
  this->indeclinable = b.indeclinable;

  this->animate = b.animate;
  this->surname = b.surname;
  this->name = b.name;
  this->transport = b.transport;
  this->watercraft = b.watercraft;

  this->internalText = b.internalText;
  this->lowerCaseText = b.lowerCaseText;
}

LemmaBuilder Lemma::copy() noexcept { return LemmaBuilder(*this); }

// ------------------------------------------------------

} // namespace RussianNouns

#endif // RUSSIAN_NOUNS_HPP
