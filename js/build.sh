#!/bin/sh

clang-format -i RussianNouns.hpp
clang-format -i main.cpp

clang++ -std=c++11 -Wall -O2 -o main main.cpp
