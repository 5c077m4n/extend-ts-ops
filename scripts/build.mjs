import { build } from "esbuild";

await build({
	entryPoints: ["src/index.ts"],
	bundle: true,
	minify: true,
	sourcemap: true,
	platform: "node",
	outdir: "dist/",
});
