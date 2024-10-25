import { build } from 'esbuild';
import pkg from 'esbuild-plugin-fileloc';

const { filelocPlugin } = pkg;

build({
  entryPoints: ['./server/main.ts'],
  outfile: './dist/server/main.js',
  platform: 'node',
  target: 'es2020',
  bundle: true,
  minify: true,
  plugins: [filelocPlugin()],
})
  .then(() => {
    console.log('Successfully built server');
  })
  .catch(error => {
    console.error('Failed building server:', error);
    process.exit(1);
  });
