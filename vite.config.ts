import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  root: "client",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "client/index.html"),
        amidakuji: resolve(__dirname, "client/amidakuji/index.html"),
        curl: resolve(__dirname, "client/curl/builder/index.html"),
        encodeDecode: resolve(__dirname, "client/encodeDecode/index.html"),
        jsonCompare: resolve(__dirname, "client/json/compare/index.html"),
        stringReplace: resolve(__dirname, "client/string/replace/index.html"),
        timestamp: resolve(__dirname, "client/timestamp/index.html"),
        urlParse: resolve(__dirname, "client/url/parse/index.html"),
      },
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});
