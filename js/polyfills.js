// Espruino polyfills
// Tested in Bangle.js emulator:
// https://www.espruino.com/ide/

if (!Object.freeze) {
    Object.freeze = x => x;
}

(() => {
    const g = (typeof self !== 'undefined' ? self : this);

    if (typeof Set === 'undefined') {
        g.Set = class Set {
            constructor() {
                this._a = [];
            }
            add(x) {
                if (!this.has(x)) {
                    this._a.push(x);
                }
            }
            has(x) {
                return this._a.includes(x);
            }
        };
    }
})();
