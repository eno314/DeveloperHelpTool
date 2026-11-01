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
        main: resolve(import.meta.dirname!, "src/ui/index.html"),
        amidakuji: resolve(import.meta.dirname!, "src/ui/amidakuji/index.html"),
        curl: resolve(import.meta.dirname!, "src/ui/curl/builder/index.html"),
        encodeDecode: resolve(
          import.meta.dirname!,
          "src/ui/encodeDecode/index.html",
        ),
        jsonCompare: resolve(
          import.meta.dirname!,
          "src/ui/json/compare/index.html",
        ),
        stringCount: resolve(
          import.meta.dirname!,
          "src/ui/string/count/index.html",
        ),
        stringReplace: resolve(
          import.meta.dirname!,
          "src/ui/string/replace/index.html",
        ),
        timestamp: resolve(import.meta.dirname!, "src/ui/timestamp/index.html"),
        urlParse: resolve(import.meta.dirname!, "src/ui/url/parse/index.html"),
      },
    },
  },
  preview: {
    port: 8000,
    strictPort: true,
  },
});
