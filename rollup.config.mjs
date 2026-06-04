import terser from '@rollup/plugin-terser';
import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import fs from 'fs';

const production = !process.env.ROLLUP_WATCH;

const packageVersion = JSON.parse(fs.readFileSync('package.json', 'utf8')).version;

const licenseComment = "" +
    "/*!\n" +
    `  RussianNounsJS v${packageVersion}\n` +
    "  Copyright (c) 2011-2026 Georgy Ustinov\n" +
    "  Released under the MIT license\n" +
    "*/";

const getPlugins = (babelConfig, legacy) => [
  resolve(),
  babel({
    babelHelpers: 'bundled',
    extensions: ['.js'],
    ...babelConfig
  }),
  production && terser({
    format: {
      max_line_len: 120,
      preamble: licenseComment
    },
    ecma: (legacy ? 5 : 2015),
    ie8: !!legacy
  })
];

export default [
  {
    input: 'src/index.js',
    output: {
      file: 'dist/RussianNouns.mjs',
      format: 'esm',
      sourcemap: true
    },
    plugins: getPlugins({
      presets: [
        ['@babel/preset-env', {
          targets: {
            node: '14', browsers: 'last 1 version, not dead'
          },
          modules: false // важно для tree-shaking
        }]
      ]
    })
  },
  {
    input: 'src/index.js',
    output: {
      file: 'dist/RussianNouns.cjs',
      format: 'cjs',
      sourcemap: true
    },
    plugins: getPlugins({
      presets: [
        ['@babel/preset-env', {
          targets: { node: '12' },
          modules: false
        }]
      ]
    })
  },

  // Самодостаточный скрипт для браузеров
  {
    input: 'src/index.js',
    output: {
      file: 'dist/RussianNouns.umd.js',
      format: 'umd',
      name: 'RussianNouns',
      sourcemap: true
    },
    plugins: getPlugins({
      presets: [
        ['@babel/preset-env', {
          targets: {
            browsers: 'last 2 versions, > 1%'
          },
          modules: false
        }]
      ]
    })
  },

  // Для Duktape, MuJS и других движков ECMAScript 5
  // Используйте совместно с библиотекой полифилов core-js
  // Данная сборка подходит для Espruino (require from Storage) с минимальными полифилами
  {
    input: 'src/index.js',
    output: {
      file: 'dist/RussianNouns.es5.js',
      format: 'iife',
      name: 'RussianNouns',
      sourcemap: true
    },
    plugins: getPlugins({
      assumptions: {
        setClassMethods: true,          // prototype.method = ... вместо defineProperty
        setPublicClassFields: true,     // this.field = ... вместо defineProperty
        setComputedProperties: true,    // Присваивание вычисляемых свойств вместо defineProperty
        noClassCalls: true,             // Убирает код проверок использования оператора new
        iterableIsArray: true           // Превращает for...of в старомодные циклы
      },
      presets: [
        ['@babel/preset-env', {
          modules: false,
          // Не включать corejs и полифилы
          useBuiltIns: false,
          corejs: false,

          // Исключаем стандартную обработку классов из общего пресета
          exclude: [
            '@babel/plugin-transform-classes',
            '@babel/plugin-transform-class-properties'
          ]
        }]
      ],
      // Подключаем плагин классов отдельно с локальным loose-режимом,
      // поскольку глобальный loose-режим отменит точечные настройки assumptions,
      // что приведёт, например, к использованию итераторов, что потребует
      // дополнительного полифила, что усложнит загрузку скрипта на микроконтроллеры.
      plugins: [
        ['@babel/plugin-transform-class-properties', { loose: true }],
        ['@babel/plugin-transform-classes', { loose: true }]
      ]
    }, true)
  }
];

