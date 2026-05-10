import path from "node:path";
import { fileURLToPath } from "node:url";

import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig, loadEnv } from "vite";

const saasRoot = path.dirname(fileURLToPath(import.meta.url));
const monorepoRoot = path.resolve(saasRoot, "../..");

export default defineConfig(({ mode }) => {
	// Keep app-local pnpm scripts working by loading env files from monorepo root.
	Object.assign(process.env, loadEnv(mode, monorepoRoot, ""));

	return {
		envDir: monorepoRoot,
		envPrefix: ["VITE_"],
		ssr: {
			noExternal: ["@repo/i18n"],
		},
		server: {
			port: Number.parseInt(process.env.PORT ?? "3000", 10),
			fs: { allow: [monorepoRoot] },
		},
		plugins: [
			tailwindcss(),
			tanstackStart({
				srcDirectory: ".",
			}),
			nitro({
				serverEntry: false,
				alias: {
					tslib: fileURLToPath(import.meta.resolve("tslib/tslib.es6.mjs")),
				},
				noExternals: [
					"@repo/i18n",
					"@repo/ui",
					"file-selector",
					"react",
					"react-dom",
					"tslib",
					"use-intl",
				],
			}),
			viteReact(),
		],
		resolve: {
			tsconfigPaths: true,
		},
	};
});
