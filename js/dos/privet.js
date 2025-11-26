// Boilerplate code: CP866 in jSH
// License: public domain or 0BSD
// https://opensource.org/license/0bsd

"use strict";

var cp866 = (function() {
    var codes = {};

    codes[0] = 0;
    codes[0x2302] = 0x7F;   // ⌂

    var top = '' +
        '☺☻♥♦♣♠•◘○◙♂♀♪♫☼' +
        '►◄↕‼¶§▬↨↑↓→←∟↔▲▼';

    var frames = '' +
        '░▒▓│┤╡╢╖╕╣║╗╝╜╛┐' +
        '└┴┬├─┼╞╟╚╔╩╦╠═╬╧' +
        '╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀';

    var fx = 'ЁёЄєЇїЎў°∙·√№¤■\xA0';
    codes[0x0406] = 0x49;   // І (Cyrillic)
    codes[0x0456] = 0x69;   // і (Cyrillic)

    var i;

    for (i = 0; i < top.length; i++) {
        codes[top.charCodeAt(i)] = 0x01 + i;
    }

    for (i = 0; i < frames.length; i++) {
        codes[frames.charCodeAt(i)] = 0xB0 + i;
    }

    for (i = 0; i < fx.length; i++) {
        codes[fx.charCodeAt(i)] = 0xF0 + i;
    }

    return function (u) {
        var result = 0x04;

        if (0x20 <= u && u <=0x7E) {
            result = u;
        } else if (0x410 <= u && u <= 0x43F) {
            result = u - 0x390;
        } else if (0x440 <= u && u <= 0x44F) {
            result = u - 0x360;
        } else if (codes.hasOwnProperty(u)) {
            result = codes[u];
        }

        return AsciiCharDef(result);
    };
})();

function puts(str) {
    for (var i = 0; i < str.length; i++) {
        PutCh(cp866(str.charCodeAt(i)));
    }
    Print('\r');
    Print('\n');
}

puts('Привет, мир!');

