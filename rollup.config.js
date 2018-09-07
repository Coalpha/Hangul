import livereload from 'rollup-plugin-livereload';
import resolve from 'rollup-plugin-node-resolve';
import serve from 'rollup-plugin-serve';
import babel from 'rollup-plugin-babel';

function makeOutput(format, outfile, plugins) {
  return ({
    input: 'src/main.js',
    moduleName: 'Hangul',
    output: {
      format,
      file: outfile,
      name: 'Hangul',
      strict: true,
    },
    plugins: [resolve(), babel(), ...plugins],
  });
}
const production = !process.env.ROLLUP_WATCH;
export default ((() => {
  if (production) {
    return [
      makeOutput('iife', 'dist/Hangul.iife.min.js'),
      makeOutput('cjs', 'dist/Hangul.cjs.min.js'),
      makeOutput('umd', 'dist/Hangul.umd.min.js'),
    ];
  }
  const o = makeOutput('iife', 'dev/bundle.js', [
    serve({
      contentBase: 'dev',
      port: 8080,
    }),
    livereload('dev'),
  ]);
  o.output.sourcemap = true;
  o.watch = {
    include: 'src/**',
  };
  return o;
})());
