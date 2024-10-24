import { context } from 'esbuild';
import fetch from 'node-fetch';

let lastRebuild = Date.now();

function onRebuild() {
  if (process.env.RESTART_KEY && Date.now() - lastRebuild > 150) {
    lastRebuild = Date.now();
    fetch(`http://127.0.0.1:4689/rr?resource=${__dirname.split(process.platform === 'win32' ? '\\' : '/').pop()}`, {
      method: 'GET',
    });
  }
}

const runServer = async () => {
  const ctx = await context({
    entryPoints: ['./server.ts'],
    outfile: './dist/server.js',
    platform: 'node',
    target: 'node16',
    minify: false,
    bundle: true,
    plugins: [
      {
        name: 'rebuild-notify',
        setup(build) {
          build.onEnd((result) => {
            if (result.errors.length > 0) {
              console.log(`Server build ended with ${result.errors.length} errors`);
              for (i = 0; i < result.errors.length; i++) {
                console.error(result.errors[i].text);
              }
            } else {
              onRebuild();
              console.log('Successfully built server');
            }
          });
        },
      },
    ],
  });

  await ctx.watch().catch(() => process.exit(1));
};

runServer();