// Nothing special. Just a visual check.
// License: public domain or 0BSD

"use strict";

var cp866 = (function () {
    var codes = {};

    function add(offset, chars) {
        for (var i = 0; i < chars.length; i++) {
            codes[chars.charCodeAt(i)] = offset + i;
        }
    }

    codes[0x2302] = 0x7F;   // ⌂
    add(0x01, '☺☻♥♦♣♠•◘○◙♂♀♪♫☼►◄↕‼¶§▬↨↑↓→←∟↔▲▼');
    add(0xB0, '░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀');
    add(0xF0, 'ЁёЄєЇїЎў°∙·√№¤■\xA0');
    codes[0x0406] = 0x49;   // І
    codes[0x0456] = 0x69;   // і

    return function (u) {
        return AsciiCharDef((0x20 <= u && u <= 0x7E) ? u : (
                (0x410 <= u && u <= 0x43F) ? u - 0x390 : (
                (0x440 <= u && u <= 0x44F) ? u - 0x360 : (
                codes.hasOwnProperty(u) ? codes[u] : 0x04))));
    };
})();

function puts(str) {
    for (var i = 0; i < str.length; i++) {
        PutCh(cp866(str.charCodeAt(i)));
    }
    Print('\r\n');
}

function addSpaces(s) {
    return s.split('').join(' ');
}

var margin = "  ";

Println();

// Zero is the end of strings in MuJS.
// So I can't use this character in a string.
PutCh(" ");
PutCh(" ");
PutCh(cp866(0));
PutCh(" ");

// The symbols of the top line move out, and some are missing altogether.
// I don't know why. Some characters seem to move the carriage.
// I tested this in DOSBox v0.74-3
puts(addSpaces("☺☻♥♦♣♠•◘○◙♂♀♪♫☼"));
puts(margin + addSpaces("►◄↕‼¶§▬↨↑↓→←∟↔▲▼"));
puts(margin + addSpaces(" !\"#$%&'()*+,-./"));
puts(margin + addSpaces("0123456789:;<=>?"));
puts(margin + addSpaces("@ABCDEFGHIJKLMNO"));
puts(margin + addSpaces("PQRSTUVWXYZ[\\]^_"));
puts(margin + addSpaces("`abcdefghijklmno"));
puts(margin + addSpaces("pqrstuvwxyz{|}~⌂"));
puts(margin + addSpaces("АБВГДЕЖЗИЙКЛМНОП"));
puts(margin + addSpaces("РСТУФХЦЧШЩЪЫЬЭЮЯ"));
puts(margin + addSpaces("АБВГДЕЖЗИЙКЛМНОП".toLowerCase()));
puts(margin + addSpaces('░▒▓│┤╡╢╖╕╣║╗╝╜╛┐'));
puts(margin + addSpaces('└┴┬├─┼╞╟╚╔╩╦╠═╬╧'));
puts(margin + addSpaces('╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀'));
puts(margin + addSpaces("РСТУФХЦЧШЩЪЫЬЭЮЯ".toLowerCase()));
puts(margin + addSpaces('ЁёЄєЇїЎў°∙·√№¤■\xA0'));
Println();

