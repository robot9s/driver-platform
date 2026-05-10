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
	Object.assign(process.env, loadEnv(mode, monorepoRoot, ""));
	const isProductionBuild = mode === "production";

	return {
		envDir: monorepoRoot,
		envPrefix: ["VITE_"],
		ssr: {
			noExternal: isProductionBuild ? ["react", "react-dom"] : [],
		},
		environments: {
			ssr: {
				build: {
					rollupOptions: {
						input: "./src/server.ts",
					},
				},
			},
		},
		server: {
			port: Number.parseInt(process.env.PORT ?? "3000", 10),
			fs: { allow: [monorepoRoot] },
		},
		plugins: [
			tanstackStart({
				srcDirectory: ".",
			}),
			viteReact(),
			tailwindcss(),
			nitro(),
		],
		resolve: {
			dedupe: ["react", "react-dom"],
			tsconfigPaths: true,
		},
	};
});
