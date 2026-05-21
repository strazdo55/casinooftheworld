import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function run(script) {
  return new Promise((resolve, reject) => {
    const child = spawn("node", [path.join(root, "scripts", script)], {
      cwd: root,
      stdio: "inherit",
    });
    child.on("close", (code) => (code === 0 ? resolve() : reject(new Error(script + " failed"))));
  });
}

await run("fetch-logos.mjs");
await run("generate-images.mjs");
await run("optimize-images.mjs");
await run("minify-css.mjs");
await run("build-blog.mjs");
await run("enrich-site.mjs");
console.log("Build complete.");
