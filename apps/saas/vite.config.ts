import path from "node:path";
import { fileURLToPath } from "node:url";

import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig, loadEnv } from "vite";

const saasRoot = path.dirname(fileURLToPath(import.meta.url));
const monorepoRoot = path.resolve(saasRoot, "../..");

export default defineConfig(({ mode, command }) => {
	// Keep app-local pnpm scripts working by loading env files from monorepo root.
	Object.assign(process.env, loadEnv(mode, monorepoRoot, ""));

	const bundleReactForProdSsr = command === "build";

	return {
		envDir: monorepoRoot,
		envPrefix: ["VITE_"],
		ssr: {
			noExternal: [
				"@repo/i18n",
				// Production SSR needs React in the bundle so serverless artifacts
				// don't rely on a hoisted node_modules. In dev, externalize React so
				// Node loads the CJS bridge; Vite's SSR runner can't execute that file
				// as ESM (ReferenceError: module is not defined).
				...(bundleReactForProdSsr ? (["react", "react-dom"] as const) : []),
			],
		},
		server: {
			port: Number.parseInt(process.env.PORT ?? "3000", 10),
			fs: { allow: [monorepoRoot] },
		},
		// Paraglide compilation is owned by the `@repo/i18n` package (`pnpm --filter
		// @repo/i18n generate`, invoked via root `postinstall`). Apps consume the
		// generated modules directly from `@repo/i18n/paraglide/*` rather than
		// re-running the plugin per-app, which used to race on a shared outdir.
		plugins: [
			tailwindcss(),
			tanstackStart({
				srcDirectory: ".",
				server: {
					entry: "src/server",
				},
			}),
			nitro({
				alias: {
					tslib: fileURLToPath(import.meta.resolve("tslib/tslib.es6.mjs")),
				},
				noExternals: ["file-selector", "tslib"],
			}),
			viteReact(),
		],
		resolve: {
			tsconfigPaths: true,
		},
	};
});
