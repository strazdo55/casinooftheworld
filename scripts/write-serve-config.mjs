import fs from "fs/promises";
import path from "path";
import { ROOT } from "./lib/env.mjs";

const posts = JSON.parse(
  await fs.readFile(path.join(ROOT, "data/blog.json"), "utf8")
);

/** Remove legacy redirect stubs that shadow real articles under /blog/:slug */
export async function removeBlogRedirectStubs() {
  for (const post of posts) {
    await fs.rm(path.join(ROOT, "blog", post.slug), { recursive: true, force: true });
    await fs.rm(path.join(ROOT, `${post.slug}.html`), { force: true });
  }
}

export async function writeServeConfig() {
  const rewrites = [
    { source: "/blog/:slug", destination: "/blog/:slug.html" },
    ...posts.map((p) => ({
      source: `/${p.slug}`,
      destination: `/blog/${p.slug}.html`,
    })),
  ];

  const config = {
    cleanUrls: true,
    trailingSlash: false,
    rewrites,
  };

  await fs.writeFile(
    path.join(ROOT, "serve.json"),
    JSON.stringify(config, null, 2) + "\n"
  );
  console.log("serve.json updated");
}

await removeBlogRedirectStubs();
await writeServeConfig();
