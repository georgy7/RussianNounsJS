// Code page 866 is the most popular Cyrillic code page in MS-DOS.
// This is a de facto standard, so it makes sense that a script that
// outputs Cyrillic text in MS-DOS should use it.

// This script allows you to check that your computer or emulator
// is configured to output text in CP866.

// License: public domain or 0BSD
// https://opensource.org/license/0bsd


"use strict";

var cp866 = (function() {
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
        var result = 0x04;

        if (0x20 <= u && u <= 0x7E) {
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
    Print('\r\n');
}

function yesNo(msg) {
    Print(msg);

    var keyCode = GetXKey();
    if (K_Escape === keyCode) {
        Println('Esc');
        Exit(0);
    }

    var answer = AsciiCharDef(keyCode).toUpperCase();

    var ch = (answer && answer.length) ? answer.charCodeAt(0) : -1;

    // Printable latin characters, digits, etc.
    if (0x21 <= ch && ch <= 0x7E) {
        Println(answer);
    } else {
        Println('KEY:' + keyCode);
    }

    switch (answer) {
        case 'Y':
            return true;
        case 'N':
            return false;
        default:
            return undefined;
    }
}

function main() {
    Println("This check is only necessary if you want to output");
    Println("Cyrillic text to the console in MS-DOS (using jSH).");
    Println("In graphical mode (DOjS), code page is not important.");
    Println("You can press ESC to exit.");
    Println();

    Print("Look: ");
    puts("привет");
    for (var i = 0; i < 5; i++) {
        switch (yesNo("Is that readable? (Y/N) ")) {
            case true:
                Println();
                helloWorld();
                return;
            case false:
                Println();
                explainCodePages();
                return;
        }
    }
}

function explainCodePages() {
    Println('_________________________________________________________');
    Println();
    Println('In DOSBox, you switch code tables like this:');
    Println();
    Println('    KEYB RU');
    Println();
    Println('You can also specify this in dosbox-VERSION.conf.');
    Println('Just change `keyboardlayout=auto` to `keyboardlayout=ru`.');
    Println();
    Println('In MS-DOS, you need to add this line to CONFIG.SYS:');
    Println();
    Println('    device=C:\\DOS\\DISPLAY.SYS con=(ega,,1)');
    Println();
    Println('And something like this to AUTOEXEC.BAT:');
    Println();
    Println('    mode con codepage prepare=((866) C:\\DOS\\EGA3.CPI)');
    Println('    mode con codepage select=866');
    Println();
    Println('Please read the manuals before doing anything.');
    Println();
}

function helloWorld() {
    puts('Привет, мир!');
    puts('---------------------');
    puts('Съешь еще этих мягких французских булок, да выпей чаю.');
    puts('Съешь еще этих мягких французских булок, да выпей чаю.'.toUpperCase());
    puts('The quick brown fox jumps over the lazy dog.');
    puts('The quick brown fox jumps over the lazy dog.'.toUpperCase());
    puts('`1234567890-=   ~!@#$%^&*()_+');
    puts('ё1234567890-=   Ё!"№;%:?*()_+');
    puts('[]{}<>\\|/ ☺♥ ‼ ¶§ ∟');
    puts('╔╤══════╗┌╥──────┐ ╖ ╕   ░▓▌ ↨ ↔ ↕ ▲   ↑ ');
    puts('║╞╩╬╦╪╡╒╣│╟┴┼┬╫╢╓┤ ╠ ├ ╘ ▒█▐ ■ ▀▄ ◄ ► ← →');
    puts('╚╧══════╝└╨──────┘ ╜ ╛ ╙     ▬     ▼   ↓ ');
    puts('---------------------');
    puts('Если выше вы видите буквы и другие символы, которые можно');
    puts('набрать на клавиатуре, а также рамки с закорючками и стрелки,');
    puts('значит вы уже используете CP866, всё в порядке.');
}

main();

