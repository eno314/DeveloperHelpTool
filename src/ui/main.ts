import { mount } from "svelte";

// We map paths to their respective App.svelte component imports.
// deno-lint-ignore no-explicit-any
const toolMap: Record<string, () => Promise<any>> = {
  "/amidakuji/": () => import("./amidakuji/App.svelte"),
  "/curl/builder/": () => import("./curl/builder/App.svelte"),
  "/encodeDecode/": () => import("./encodeDecode/App.svelte"),
  "/json/compare/": () => import("./json/compare/App.svelte"),
  "/string/count/": () => import("./string/count/App.svelte"),
  "/string/replace/": () => import("./string/replace/App.svelte"),
  "/timestamp/": () => import("./timestamp/App.svelte"),
  "/url/parse/": () => import("./url/parse/App.svelte"),
};

async function init() {
  const path = globalThis.location.pathname;

  // Extract the relevant part of the path (ignoring the base path /DeveloperHelpTool/ or /)
  // Vite sets base to /DeveloperHelpTool/ for production.
  const basePath = "/DeveloperHelpTool";
  let relativePath = path;
  if (path.startsWith(basePath)) {
    relativePath = path.slice(basePath.length);
  }

  // If we are at the root index.html, we don't need to mount a tool app,
  // unless we decide to make the root index.html a Svelte component too.
  // For now, let's just handle the tools.

  let AppPromise = null;

  // Find the matching tool based on the path
  for (const [key, importFn] of Object.entries(toolMap)) {
    // Check if the current path includes the tool's path
    // e.g., /DeveloperHelpTool/amidakuji/index.html includes /amidakuji/
    if (relativePath.includes(key)) {
      AppPromise = importFn;
      break;
    }
  }

  if (AppPromise) {
    const { default: App } = await AppPromise();
    const appElement = document.getElementById("app");
    if (appElement) {
      mount(App, {
        target: appElement,
      });
    } else {
      console.error("Could not find element with id 'app'");
    }
  } else {
    // It's the root index page or an unknown page.
    // We can create a Root.svelte later if needed, but for now we skip mounting if not found.
  }
}

void init();
