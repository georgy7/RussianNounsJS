#!/usr/bin/env python3

import sys
from pathlib import Path


def js(fn):
    return fn.lower().endswith('.js')


def main():
    if (len(sys.argv) != 3) or not js(sys.argv[-2]) or not js(sys.argv[-1]):
        print("Usage: ./escapeNonsafe.py inputJSFile outputJSFile")
        sys.exit(1)

    input_path = Path(sys.argv[-2]).expanduser()
    output_path = Path(sys.argv[-1]).expanduser()

    if not input_path.is_file():
        print(f'The file does not exist: {input_path}')
        sys.exit(1)

    # Предполагается, что весь код написан латиницей, а символы
    # с кодами более \x7F встречаются только в строках.

    with input_path.open(mode = 'rb') as file:
        with output_path.open(mode = 'w') as result:
            b = file.read(1)
            while b:
                char_str = f"\\x{b[0]:X}" if b[0] > 0x7F else chr(b[0])
                result.write(char_str)
                b = file.read(1)


if __name__ == "__main__":
    main()

