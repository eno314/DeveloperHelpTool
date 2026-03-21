import { defineConfig } from "vite";
import { resolve } from "node:path";
import { svelte } from "@sveltejs/vite-plugin-svelte";

export default defineConfig({
  plugins: [svelte()],
  base: "/DeveloperHelpTool/",
  root: "src/client",
  build: {
    outDir: "../../dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/client/index.html"),
        amidakuji: resolve(__dirname, "src/client/amidakuji/index.html"),
        curl: resolve(__dirname, "src/client/curl/builder/index.html"),
        encodeDecode: resolve(__dirname, "src/client/encodeDecode/index.html"),
        jsonCompare: resolve(__dirname, "src/client/json/compare/index.html"),
        stringReplace: resolve(
          __dirname,
          "src/client/string/replace/index.html",
        ),
        timestamp: resolve(__dirname, "src/client/timestamp/index.html"),
        urlParse: resolve(__dirname, "src/client/url/parse/index.html"),
      },
    },
  },
  preview: {
    port: 8000,
    strictPort: true,
  },
});
