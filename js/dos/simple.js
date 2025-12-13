"use strict";

Println();

for (var i = 0; i <= 0xF; i++) {
    Println(i.toString(16).toUpperCase() + '0');
}

var y = WhereY();
var screen = new Screen();

screen.FromDisplay();

for (var i = 0; i <= 0xF; i++) {
    var lineNumber = y - 0x10 + i;
    if (lineNumber >= 1) {
        for (var j = 0; j <= 0xF; j++) {
            screen.Put(5 + 2 * j, lineNumber, AsciiCharDef(0x10 * i + j));
        }
    }
}

screen.ToDisplay();

Println();

