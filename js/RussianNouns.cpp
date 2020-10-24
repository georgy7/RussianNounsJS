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

#include "RussianNouns.h"

// Draft ! Draft ! Draft ! Draft ! Draft ! Draft ! Draft ! Draft ! Draft !

// Просто для разминки мозгов (плохо знаю C++).
// Это C++11.

namespace RussianNouns {

Lemma::~Lemma() {}

LemmaBuilder Lemma::copy() const noexcept { return LemmaBuilder(*this); }

std::string Lemma::str() const noexcept {
  auto bs = [](bool x) { return x ? u8"1" : u8"0"; };
  return u8"{ " + std::string(1, static_cast<char>(internalGender)) + u8", " +
         bs(pluraliaTantum) + bs(indeclinable) + bs(animate) + bs(surname) +
         bs(name) + bs(transport) + bs(watercraft) + u8", \"" + internalText +
         u8"\" }";
}

const std::string &Lemma::text() const noexcept { return internalText; }

const std::string &Lemma::lower() const noexcept { return lowerCaseText; }

bool Lemma::isPluraliaTantum() const noexcept { return pluraliaTantum; }

Gender Lemma::getGender() const noexcept { return internalGender; }

bool Lemma::isIndeclinable() const noexcept { return indeclinable; }

bool Lemma::isAnimate() const noexcept { return animate || surname || name; }

bool Lemma::isASurname() const noexcept { return surname; }

bool Lemma::isAName() const noexcept { return name; }

bool Lemma::isATransport() const noexcept { return transport || watercraft; }

bool Lemma::isAWatercraft() const noexcept { return watercraft; }

Lemma::Lemma(Gender gender, bool pluraliaTantum, bool indeclinable,
             bool animate, bool surname, bool name, bool transport,
             bool watercraft, const std::string &internalText,
             const std::string &lowerCaseText) noexcept
    : internalGender(gender), pluraliaTantum(pluraliaTantum),
      indeclinable(indeclinable), animate(animate), surname(surname),
      name(name), transport(transport), watercraft(watercraft),
      internalText(internalText), lowerCaseText(lowerCaseText) {}

// ------------------------------------------------------

static std::string toRussianLowerCaseUtf8(const std::string &input) {
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

LemmaBuilder::LemmaBuilder(const std::string &text) noexcept {
  this->internalGender = Gender::GENDERLESS;

  this->pluraliaTantum = false;
  this->indeclinable = false;

  this->animate = false;
  this->surname = false;
  this->name = false;
  this->transport = false;
  this->watercraft = false;

  this->internalText = text;
  this->lowerCaseText = toRussianLowerCaseUtf8(text);
}

/// Допустим, надо создать копию леммы,
/// где будет отличаться одно поле.
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

LemmaBuilder::~LemmaBuilder() {}

/// Чтобы редактировать билдер, созданный из леммы.
LemmaBuilder &LemmaBuilder::withText(const std::string &text) noexcept {
  this->internalText = text;
  this->lowerCaseText = toRussianLowerCaseUtf8(text);
  return *this;
}

LemmaBuilder &LemmaBuilder::withGender(const Gender g) noexcept {
  this->internalGender = g;
  return *this;
}

LemmaBuilder &LemmaBuilder::withPluraliaTantum(const bool pt) noexcept {
  this->pluraliaTantum = pt;
  return *this;
}

LemmaBuilder &LemmaBuilder::withIndeclinable(const bool indeclinable) noexcept {
  this->indeclinable = indeclinable;
  return *this;
}

LemmaBuilder &LemmaBuilder::withAnimate(const bool animate) noexcept {
  this->animate = animate;
  return *this;
}

LemmaBuilder &LemmaBuilder::withSurname(const bool surname) noexcept {
  this->surname = surname;
  return *this;
}

LemmaBuilder &LemmaBuilder::withName(const bool name) noexcept {
  this->name = name;
  return *this;
}

LemmaBuilder &LemmaBuilder::withTransport(const bool transport) noexcept {
  this->transport = transport;
  return *this;
}

LemmaBuilder &LemmaBuilder::withWatercraft(const bool watercraft) noexcept {
  this->watercraft = watercraft;
  return *this;
}

Gender checkedGender(const Gender gender, const bool pluraliaTantum) {
  if (pluraliaTantum) {
    return Gender::GENDERLESS; // Слова т. н. парного рода.
  } else if (Gender::GENDERLESS == gender) {
    throw std::runtime_error("A grammatical gender required.");
  } else {
    return gender;
  }
}

Lemma LemmaBuilder::build() {
  // TODO проверка на кириллическое слово
  Gender g = checkedGender(internalGender, pluraliaTantum);

  return Lemma(g, pluraliaTantum, indeclinable, animate, surname, name,
               transport, watercraft, internalText, lowerCaseText);
}

std::unique_ptr<Lemma> LemmaBuilder::buildUnique() {
  // TODO проверка на кириллическое слово
  Gender g = checkedGender(internalGender, pluraliaTantum);

  return std::unique_ptr<Lemma>(
      new Lemma(g, pluraliaTantum, indeclinable, animate, surname, name,
                transport, watercraft, internalText, lowerCaseText));
}

std::shared_ptr<Lemma> LemmaBuilder::buildShared() {
  // TODO проверка на кириллическое слово
  Gender g = checkedGender(internalGender, pluraliaTantum);

  return std::shared_ptr<Lemma>(
      new Lemma(g, pluraliaTantum, indeclinable, animate, surname, name,
                transport, watercraft, internalText, lowerCaseText));
}

// ------------------------------------------------------

} // namespace RussianNouns