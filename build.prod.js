import { build } from 'esbuild'
import pkg from 'esbuild-plugin-fileloc'

const { filelocPlugin } = pkg

build({
  entryPoints: ['./server.ts'],
  outfile: './dist/server.js',
  platform: 'node',
  target: 'node16',
  sourcemap: 'inline',
  bundle: true,
  minify: true,
  plugins: [filelocPlugin()]
})
  .then(() => {
    console.log('Successfully built server')
  })
  .catch((error) => {
    console.error('Failed building server:', error)
    process.exit(1)
  })
