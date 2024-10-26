import { build, context } from 'esbuild';
import pkg from 'esbuild-plugin-fileloc';
import fetch from 'node-fetch';

const { filelocPlugin } = pkg;
const watch = process.argv.includes('--watch');

async function development() {
  let lastRebuild = Date.now();

  function onRebuild() {
    if (process.env.RESTART_KEY && Date.now() - lastRebuild > 150) {
      lastRebuild = Date.now();
      fetch(
        `http://127.0.0.1:4689/rr?resource=${__dirname.split(process.platform === 'win32' ? '\\' : '/').pop()}`,
        { method: 'GET' },
      );
    }
  }

  const ctx = await context({
    entryPoints: ['./server/main.ts'],
    outfile: './dist/server/main.js',
    platform: 'node',
    target: 'es2020',
    minify: false,
    bundle: true,
    plugins: [
      {
        name: 'dev',
        setup(build) {
          build.onEnd(result => {
            if (result.errors.length > 0) {
              console.log(`Server build ended with ${result.errors.length} errors`);
              result.errors.forEach((error, i) => console.error(`Error ${i + 1}:`, error.text));
            } else {
              onRebuild();
              console.log('Successfully built server (development)');
            }
          });
        },
      },
    ],
  });

  await ctx.watch().catch(() => process.exit(1));
}

function production() {
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
      console.log('Successfully built server (production)');
    })
    .catch(error => {
      console.error('Failed building server (production):', error);
      process.exit(1);
    });
}

watch ? development() : production();
