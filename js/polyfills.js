// Espruino polyfills
// Tested in Bangle.js emulator:
// https://www.espruino.com/ide/

// This is of interest mainly as a challenge,
// since resources are extremely limited, although
// it is unlikely to work as it should, since Espruino
// knows nothing about Unicode.

// So you get something like this:

// >'б'.charCodeAt(0)
// =208
// >'б'.charCodeAt(1)
// =177

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

    if (typeof Map === 'undefined') {
        g.Map = class Map {
            constructor() {
                this._sparse = [];
            }
            set(integerKey, value) {
                this._sparse[integerKey] = value;
            }
            get(integerKey) {
                return this._sparse[integerKey];
            }
        };
    }
})();
