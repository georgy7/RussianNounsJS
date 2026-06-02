// Espruino polyfills
// Tested in Bangle.js emulator:
// https://www.espruino.com/ide/

if (!Object.freeze) {
    Object.freeze = x => x;
}

if (typeof Set === 'undefined') {
    var Set = class Set {
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
        forEach(fn) {
            this._a.forEach(fn);
        }
    };
}

if (typeof Map === 'undefined') {
    var Map = class Map {
        constructor() {
            this._sparse = [];
        }
        set(integerKey, value) {
            this._sparse[integerKey] = value;
        }
        get(integerKey) {
            return this._sparse[integerKey];
        }
        has(x) {
            return Object.keys(this._sparse).indexOf(x.toString()) >= 0;
        }
    };
}

if ((typeof Uint8ClampedArray !== 'undefined') && !Uint8ClampedArray.from) {
    Uint8ClampedArray.from = function (arr) {
        var result = new Uint8ClampedArray(arr.length);
        for (var i = 0; i < arr.length; i++) {
            result[i] = arr[i];
        }
        return result;
    }
}

