#include "RussianNouns.hpp"
#include <iostream>
#include <locale>

using namespace RussianNouns;

int main() {
  std::setlocale(LC_ALL, "ru_RU.UTF-8");

  std::string a = u8"гидразинокарбонилметилбромфенилдигидробенздиазепин";
  std::string b =
      u8"аааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааа"
      u8"аааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааа"
      u8"аааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааа"
      u8"аааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааа"
      u8"ааааааааааааааааааааааааааааааархи-супер-мега-гипер-нано-ультра-"
      u8"экстра-прото-автомотовелофототелерадиомонтёр";

  std::cout << std::endl << a.size() << std::endl;
  std::cout << a << std::endl << std::endl;

  std::cout << std::endl << b.size() << std::endl;
  std::cout << b << std::endl << std::endl;

  std::cout << u8"----------------" << std::endl << std::endl;

  // Анонимный билдер выделяется на стеке
  // и удаляется сразу после сборки леммы,
  // которая возвращается в виде shared_ptr.
  auto x = LemmaBuilder(u8"арбуз").withGender(Gender::MASCULINE).build();

  std::cout << x.str() << std::endl << std::endl;

  auto y = LemmaBuilder(u8"лошадь").withGender(Gender::FEMININE).build();

  std::cout << y.str() << std::endl << std::endl;

  y.text()[1] = L'z';
  std::cout << y.str() << std::endl << std::endl;

  std::cout << sizeof(x) << std::endl;
  std::cout << sizeof(y) << std::endl;
  std::cout << sizeof(LemmaBuilder) << std::endl;
  std::cout << sizeof(Lemma) << std::endl;

  auto lemmaA = LemmaBuilder(a).withGender(Gender::MASCULINE).build();

  auto lemmaB =
      LemmaBuilder(b).withGender(Gender::MASCULINE).withAnimate(true).build();

  auto ship = LemmaBuilder(u8"Судно")
                  .withGender(Gender::NEUTER)
                  .withWatercraft(true)
                  .build();
  auto train = LemmaBuilder(u8"поезд")
                   .withGender(Gender::MASCULINE)
                   .withTransport(true)
                   .build();

  std::cout << lemmaA.str() << std::endl << std::endl;
  std::cout << lemmaB.str() << std::endl << std::endl;
  std::cout << ship.str() << std::endl << std::endl;
  std::cout << train.str() << std::endl << std::endl;

  auto bastard =
      LemmaBuilder(u8"пРиВеТ! АБВГД ЕЁЖЗИ ЙКЛМН ОПРСТ УФХЦЧ ШЩЪЫЬ ЭЮЯ")
          .withGender(Gender::MASCULINE)
          .build();
  std::cout << bastard.lower() << std::endl;
  std::cout << bastard.text() << std::endl;

  auto z = y.copy()
               .withGender(Gender::NEUTER)
               .withAnimate(true)
               .withTransport(true)
               .build();

  std::cout << z.str() << std::endl << std::endl;

  auto z2 = LemmaBuilder(z).withText(u8"ОКНО").build();
  std::cout << z2.str() << std::endl << std::endl;

  auto z3 = z2.copy().withText(u8"ОКНО").build();
  std::cout << z3.str() << std::endl << std::endl;
}
