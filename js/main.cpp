#include "RussianNouns.h"
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

  auto aLemma = LemmaBuilder(a).withGender(Gender::MASCULINE).build();
  auto bLemma =
      LemmaBuilder(b).withGender(Gender::MASCULINE).withAnimate(true).build();

  // Русские буквы занимают по 2 байта в UTF-8.
  // Дефисы — по одному байту.
  std::cout << std::endl;
  std::cout << aLemma.text().size() << std::endl;
  std::cout << bLemma.text().size() << std::endl;

  // ------

  std::cout << std::endl;

  auto hello = LemmaBuilder(u8"пРиВеТ! АБВГД ЕЁЖЗИ ЙКЛМН ОПРСТ УФХЦЧ ШЩЪЫЬ ЭЮЯ")
                   .withGender(Gender::MASCULINE)
                   .build();
  std::cout << hello.lower() << std::endl;
  std::cout << hello.text() << std::endl;

  auto joke =
      LemmaBuilder(u8"шутка").withGender(Gender::FEMININE).buildUnique();
  std::cout << joke->str() << std::endl;

  // ------

  auto буря = LemmaBuilder(u8"буря").withGender(Gender::FEMININE).build();
  auto мгла = LemmaBuilder(u8"мгла").withGender(Gender::FEMININE).build();
  auto небо = LemmaBuilder(u8"небо").withGender(Gender::NEUTER).build();
  auto вихрь = LemmaBuilder(u8"вихрь").withGender(Gender::MASCULINE).build();

  auto зверь = LemmaBuilder(u8"зверь")
                   .withGender(Gender::MASCULINE)
                   .withAnimate(true)
                   .build();
  auto дитя = LemmaBuilder(u8"дитя")
                  .withGender(Gender::NEUTER)
                  .withAnimate(true)
                  .build();

  auto кровля = LemmaBuilder(u8"кровля").withGender(Gender::FEMININE).build();
  auto солома = LemmaBuilder(u8"солома").withGender(Gender::FEMININE).build();

  auto путник = LemmaBuilder(u8"путник")
                    .withGender(Gender::MASCULINE)
                    .withAnimate(true)
                    .build();
  auto окошко = LemmaBuilder(u8"окошко").withGender(Gender::NEUTER).build();
}
