import { defineConfig } from "vite";
import { resolve } from "node:path";
import { svelte } from "@sveltejs/vite-plugin-svelte";

export default defineConfig({
  plugins: [svelte()],
  base: "/DeveloperHelpTool/",
  root: "src/ui",
  build: {
    outDir: "../../dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/ui/index.html"),
        amidakuji: resolve(__dirname, "src/ui/amidakuji/index.html"),
        curl: resolve(__dirname, "src/ui/curl/builder/index.html"),
        encodeDecode: resolve(__dirname, "src/ui/encodeDecode/index.html"),
        jsonCompare: resolve(__dirname, "src/ui/json/compare/index.html"),
        stringCount: resolve(__dirname, "src/ui/string/count/index.html"),
        stringReplace: resolve(
          __dirname,
          "src/ui/string/replace/index.html",
        ),
        timestamp: resolve(__dirname, "src/ui/timestamp/index.html"),
        urlParse: resolve(__dirname, "src/ui/url/parse/index.html"),
      },
    },
  },
  preview: {
    port: 8000,
    strictPort: true,
  },
});
