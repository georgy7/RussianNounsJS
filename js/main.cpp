#include "RussianNouns.hpp"
#include <iostream>
#include <locale>

using namespace RussianNouns;

int main() {
  std::setlocale(LC_ALL, "ru_RU.UTF-8");

  std::wstring a = L"гидразинокарбонилметилбромфенилдигидробенздиазепин";
  std::wstring b =
      L"ааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааа"
      L"ааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааа"
      L"ааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааа"
      L"ааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааа"
      L"ааааааааааааааааааааааааааархи-супер-мега-гипер-нано-ультра-экстра-"
      L"прото-автомотовелофототелерадиомонтёр";

  std::wcout << std::endl << a.size() << std::endl;
  std::wcout << a << std::endl << std::endl;

  std::wcout << std::endl << b.size() << std::endl;
  std::wcout << b << std::endl << std::endl;

  std::wcout << L"----------------" << std::endl << std::endl;

  // Анонимный билдер выделяется на стеке
  // и удаляется сразу после сборки леммы,
  // которая возвращается в виде shared_ptr.
  auto x = LemmaBuilder(L"арбуз").withGender(Gender::MASCULINE).build();

  std::wcout << x.str() << std::endl << std::endl;

  auto y = LemmaBuilder(L"лошадь").withGender(Gender::FEMININE).build();

  std::wcout << y.str() << std::endl << std::endl;

  y.text()[1] = L'z';
  std::wcout << y.str() << std::endl << std::endl;

  std::wcout << sizeof(x) << std::endl;
  std::wcout << sizeof(y) << std::endl;
  std::wcout << sizeof(LemmaBuilder) << std::endl;
  std::wcout << sizeof(Lemma) << std::endl;

  auto lemmaA = LemmaBuilder(a).withGender(Gender::MASCULINE).build();

  auto lemmaB =
      LemmaBuilder(b).withGender(Gender::MASCULINE).withAnimate(true).build();

  auto ship = LemmaBuilder(L"Судно")
                  .withGender(Gender::NEUTER)
                  .withWatercraft(true)
                  .build();
  auto train = LemmaBuilder(L"поезд")
                   .withGender(Gender::MASCULINE)
                   .withTransport(true)
                   .build();

  std::wcout << lemmaA.str() << std::endl << std::endl;
  std::wcout << lemmaB.str() << std::endl << std::endl;
  std::wcout << ship.str() << std::endl << std::endl;
  std::wcout << train.str() << std::endl << std::endl;

  auto bastard = LemmaBuilder(L"пРиВеТ! АБВГД ЕЁЖЗИ ЙКЛМН "
                              L"ОПРСТ УФХЦЧ ШЩЪЫЬ ЭЮЯ")
                     .withGender(Gender::MASCULINE)
                     .build();
  std::wcout << bastard.lower() << std::endl;
  std::wcout << bastard.text() << std::endl;

  auto z = y.copy()
               .withGender(Gender::NEUTER)
               .withAnimate(true)
               .withTransport(true)
               .build();

  std::wcout << z.str() << std::endl << std::endl;

  auto z2 = LemmaBuilder(z).withText(L"ОКНО").build();
  std::wcout << z2.str() << std::endl << std::endl;

  auto z3 = z2.copy().withText(L"ОКНО").build();
  std::wcout << z3.str() << std::endl << std::endl;
}
