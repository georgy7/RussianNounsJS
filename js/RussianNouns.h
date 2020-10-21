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

#ifndef RUSSIAN_NOUNS_H
#define RUSSIAN_NOUNS_H

#include <memory>
#include <string>

// It only supports UTF-8.

namespace RussianNouns {

enum class Gender : char {
  GENDERLESS = 'G',
  FEMININE = 'F',
  MASCULINE = 'M',
  NEUTER = 'N',
  COMMON = 'C'
};

class LemmaBuilder;

class Lemma final {
  friend class LemmaBuilder;

public:
  ~Lemma();
  LemmaBuilder copy() noexcept;

  /// For debugging. It's like var_dump in PHP.
  std::string str() noexcept;

  // TODO equals
  // TODO fuzzyEquals

  const std::string &text() noexcept;
  const std::string &lower() noexcept;
  bool isPluraliaTantum() noexcept;
  Gender getGender() noexcept;
  bool isIndeclinable() noexcept;
  bool isAnimate() noexcept;
  bool isASurname() noexcept;
  bool isAName() noexcept;
  bool isATransport() noexcept;
  bool isAWatercraft() noexcept;

private:
  Lemma(Gender gender, bool pluraliaTantum, bool indeclinable, bool animate,
        bool surname, bool name, bool transport, bool watercraft,
        std::string internalText, std::string lowerCaseText) noexcept;

  const Gender internalGender;
  const bool pluraliaTantum, indeclinable;
  const bool animate, surname, name, transport, watercraft;
  const std::string internalText, lowerCaseText;
};

class LemmaBuilder {
public:
  LemmaBuilder(const std::string text) noexcept;
  LemmaBuilder(const Lemma &b) noexcept;
  ~LemmaBuilder();

  LemmaBuilder &withText(const std::string text) noexcept;
  LemmaBuilder &withGender(const Gender g) noexcept;
  LemmaBuilder &withPluraliaTantum(const bool pt) noexcept;
  LemmaBuilder &withIndeclinable(const bool indeclinable) noexcept;
  LemmaBuilder &withAnimate(const bool animate) noexcept;
  LemmaBuilder &withSurname(const bool surname) noexcept;
  LemmaBuilder &withName(const bool name) noexcept;
  LemmaBuilder &withTransport(const bool transport) noexcept;
  LemmaBuilder &withWatercraft(const bool watercraft) noexcept;

  Lemma build();

  std::unique_ptr<Lemma> buildUnique();

  std::shared_ptr<Lemma> buildShared();

private:
  Gender internalGender;
  bool pluraliaTantum, indeclinable;
  bool animate, surname, name, transport, watercraft;
  std::string internalText, lowerCaseText;
};

} // namespace RussianNouns

#endif // RUSSIAN_NOUNS_H
