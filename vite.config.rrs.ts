import { defineConfig } from "vite";

export default defineConfig({
  build: {
    // 一時的な出力ディレクトリ
    outDir: "./dist/@react-router/serve/dist",
    copyPublicDir: false,
    rollupOptions: {
      // @react-router/serve の CLI エントリポイントを指定
      input: "./node_modules/@react-router/serve/dist/cli.js",
      output: {
        format: "cjs",
        entryFileNames: "[name].js",
      },
    },
    ssr: true,
  },
  ssr: {
    noExternal: true,
  },
});
