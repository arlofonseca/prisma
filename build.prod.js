import { build } from "esbuild";
import pkg from "esbuild-plugin-fileloc";

const { filelocPlugin } = pkg;

async function buildServer() {
  try {
    await build({
      entryPoints: ["./server/main.ts"],
      outfile: "./dist/server.js",
      platform: "node",
      target: "node16",
      sourcemap: "inline",
      bundle: true,
      minify: false,
      plugins: [filelocPlugin()],
    });
    console.log('Successfully built server');
  } catch (error) {
    console.error('Failed building server:', error);
    process.exit(1);
  }
}

buildServer();
