// Code page 866 is the most popular Cyrillic code page in MS-DOS.
// This is a de facto standard, so it makes sense that a script that
// outputs Cyrillic text in MS-DOS should use it.

// This script allows you to check that your computer or emulator
// is configured to output text in CP866.

// !!!!!!!!!!!!!!!!!!!!!!!!!
// The script is incomplete!
// !!!!!!!!!!!!!!!!!!!!!!!!!

// License: public domain or 0BSD
// https://opensource.org/license/0bsd


function cp866(u) {
    var result = 0x04;

    if (0x20 <= u && u <=0x7E) {
        result = u;
    } else if (0x410 <= u && u <= 0x43F) {
        result = u - 0x390;
    } else if (0x440 <= u && u <= 0x44F) {
        result = u - 0x360;
    }

    // TODO

    return AsciiCharDef(result);
}

function puts(str) {
    for (var i = 0; i < str.length; i++) {
        PutCh(cp866(str.charCodeAt(i)));
    }
    Print('\r');
    Print('\n');
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
    puts("Привет!");
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
    Println('TODO');
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

