import path from "node:path";
import { fileURLToPath } from "node:url";

import contentCollections from "@content-collections/vite";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig, loadEnv } from "vite";

const marketingRoot = path.dirname(fileURLToPath(import.meta.url));
const monorepoRoot = path.resolve(marketingRoot, "../..");

export default defineConfig(({ mode, command }) => {
	Object.assign(process.env, loadEnv(mode, monorepoRoot, ""));

	const bundleReactForProdSsr = command === "build";

	return {
		envDir: monorepoRoot,
		envPrefix: ["VITE_"],
		ssr: {
			noExternal: [
				"@repo/i18n",
				...(bundleReactForProdSsr ? (["react", "react-dom"] as const) : []),
			],
		},
		server: {
			port: Number.parseInt(process.env.PORT ?? "3001", 10),
			fs: { allow: [monorepoRoot] },
		},
		// Paraglide compilation is owned by the `@repo/i18n` package (`pnpm --filter
		// @repo/i18n generate`, invoked via root `postinstall`). Apps consume the
		// generated modules directly from `@repo/i18n/paraglide/*` rather than
		// re-running the plugin per-app, which used to race on a shared outdir.
		plugins: [
			contentCollections(),
			tailwindcss(),
			tanstackStart({
				srcDirectory: ".",
			}),
			nitro({
				serverEntry: false,
			}),
			viteReact(),
		],
		resolve: {
			tsconfigPaths: true,
		},
	};
});
