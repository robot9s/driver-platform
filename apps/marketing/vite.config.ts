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
		plugins: [
			contentCollections(),
			tailwindcss(),
			tanstackStart({
				srcDirectory: ".",
			}),
			nitro({
				serverEntry: false,
				noExternals: ["@repo/i18n", "@repo/ui", "react", "react-dom", "use-intl"],
			}),
			viteReact(),
		],
		resolve: {
			tsconfigPaths: true,
		},
	};
});
