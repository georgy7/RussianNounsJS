"use strict";

function printLine(startCode) {
    Print((0 == startCode ? '0' : '') + startCode.toString(16).toUpperCase());
    PutCh(AsciiCharDef(0x20));
    PutCh(AsciiCharDef(0x20));
    for (var i = 0; i < 16; i++) {
        PutCh(AsciiCharDef(startCode + i));
        PutCh(AsciiCharDef(0x20));
    }
    Print('\r\n');
}

Println();

for (var i = 0; i < 16; i++) {
    printLine(0x10 * i);
}

