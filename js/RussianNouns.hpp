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
// У меня есть сомнения про иммутабельность const std::wstring.
class Lemma final {
  friend class LemmaBuilder;

public:
  ~Lemma() { std::wcout << L"deleted Lemma" << std::endl; }

  LemmaBuilder copy() noexcept;

  std::wstring str() noexcept {
    std::wostringstream rs;
    auto bs = [](bool x) { return x ? L", true" : L", false"; };
    rs << L"{ \"" << internalText << L"\", ";
    rs << static_cast<wchar_t>(internalGender);
    rs << bs(pluraliaTantum) << bs(indeclinable);
    rs << bs(animate) << bs(surname) << bs(name);
    rs << bs(transport) << bs(watercraft) << L" }";
    return rs.str();
  }

  std::wstring text() noexcept { return internalText; }

  std::wstring lower() noexcept { return lowerCaseText; }

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
        std::wstring internalText, std::wstring lowerCaseText) noexcept
      : internalGender(gender), pluraliaTantum(pluraliaTantum),
        indeclinable(indeclinable), animate(animate), surname(surname),
        name(name), transport(transport), watercraft(watercraft),
        internalText(internalText), lowerCaseText(lowerCaseText) {}

  const Gender internalGender;
  const bool pluraliaTantum, indeclinable;
  const bool animate, surname, name, transport, watercraft;
  const std::wstring internalText, lowerCaseText;
};

static std::wstring toRussianLowerCase(std::wstring input) {
  std::wstring r = input;

  // На моих тестах это было немного быстрее std::towlower.
  // И это не зависит от локали.
  // Я так думал вначале, но потом почитал,
  // и оказалось, что нет гарантий не только,
  // UCS-4 в wstring или UTF-16, но и что wchar_t даже
  // больше 8 бит на всех платформах.
  // Еще и исходные коды не везде определятся как UTF-8.
  // И я задумался, как вообще живут C++-разработчики?
  // В чем смысл всего этого?
  // Зачем? Почему?
  auto f = [](wint_t c) -> wint_t {
    if ((c >= 1040) && (c <= 1071)) {
      return c + 32;
    } else if (1025 == c) {
      return c + 80;
    } else {
      return c;
    }
  };

  std::transform(r.begin(), r.end(), r.begin(), f);
  return r;
}

class LemmaBuilder {
public:
  LemmaBuilder(const std::wstring text) noexcept {
    this->internalText = text;
    this->lowerCaseText = toRussianLowerCase(text);
  }

  /// Допустим, надо создать копию леммы, где будет отличаться одно поле.
  LemmaBuilder(const Lemma &b) noexcept;

  ~LemmaBuilder() { std::wcout << L"deleted Builder" << std::endl; }

  /// Чтобы редактировать билдер, созданный из леммы.
  LemmaBuilder &withText(const std::wstring text) noexcept {
    this->internalText = text;
    this->lowerCaseText = toRussianLowerCase(text);
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

  std::wstring internalText;
  std::wstring lowerCaseText;

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
