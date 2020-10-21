#!/bin/sh

clang-format -i RussianNouns.h
clang-format -i RussianNouns.cpp
clang-format -i main.cpp

clang++ -std=c++11 -Wall -O2 -o main main.cpp RussianNouns.cpp
