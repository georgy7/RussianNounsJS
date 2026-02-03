import terser from '@rollup/plugin-terser';
import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';

const production = !process.env.ROLLUP_WATCH;

const getPlugins = (babelConfig) => [
  resolve(),
  babel({
    babelHelpers: 'bundled',
    extensions: ['.js'],
    ...babelConfig
  }),
  production && terser()
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
            node: '12',
            browsers: 'last 2 versions, > 1%'
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

  // Для Duktape, mujs и других движков EcmaScript 5
  {
    input: 'src/index.js',
    output: {
      file: 'dist/RussianNouns.es5.js',
      format: 'iife',
      name: 'RussianNouns',
      sourcemap: true
    },
    plugins: getPlugins({
      presets: [
        ['@babel/preset-env', {
          modules: false,
          // Не включать corejs и полифилы
          useBuiltIns: false,
          corejs: false
        }]
      ]
    })
  }
];

