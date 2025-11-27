// Boilerplate code: CP866 in jSH
// License: public domain or 0BSD
// https://opensource.org/license/0bsd

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
    codes[0x0406] = 0x49;   // І (Cyrillic)
    codes[0x0456] = 0x69;   // і (Cyrillic)

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

puts('Привет, мир!');

