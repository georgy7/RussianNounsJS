/*
System Requirements
CPU (recommended): Pentium 100 MHz or 77000 cycles in DOSBox
Memory: 8 MB
*/

Include('p5');

//TODO
//Include('POLYFILL.JS');
//Include('RN-ES5.JS');

var textColor, mainFont, padding, lineHeight;

function setup() {
    noCursor();
    textColor = color(0x33, 0x33, 0x33);
    mainFont = loadFont(JSBOOTPATH + "fonts/univ12b.fnt");
    padding = 35;
    lineHeight = 22;
}

function getRamUsed() {
    var info = MemoryInfo();
    var used = info.total - info.remaining;
    return "Использовано " + Math.floor(used / 1024) + " из " + Math.floor(info.total / 1024) +
        " килобайт памяти (" + Math.floor(used * 100 / info.total) + "%)";
}

function drawStatusBar() {
    var textY = height - lineHeight - 4;
    var lineY = height - lineHeight - 8;

    line(0, lineY, width, lineY);

    textAlign(LEFT);
    text(getRamUsed(), 8, textY);

    textAlign(RIGHT);
    text("" + width + "x" + height, width-8, textY);
}

function draw() {
    textFont(mainFont);

    background(250);
    stroke(textColor);
    fill(textColor);

    textAlign(RIGHT);
    text(getFrameRate(), width-10, 8);

    drawStatusBar();
}

