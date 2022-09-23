// ex. scripts/build_npm.ts
import { build, emptyDir } from "https://deno.land/x/dnt/mod.ts";

await emptyDir("./npm");

await build({
    entryPoints: ["./mod.ts"],
    outDir: "./npm",
    shims: {
        // see JS docs for overview and more options
        deno: true,
    },
    package: {
        // package.json properties
        name: "golem-client",
        version: Deno.args[0],
        description: ".",
        license: "MIT",
        repository: {
            type: "git",
            url: "git+https://github.com/username/repo.git",
        },
        bugs: {
            url: "https://github.com/username/repo/issues",
        },
    },
});

// post build steps
Deno.copyFileSync("LICENSE", "npm/LICENSE");
Deno.copyFileSync("README.md", "npm/README.md");
