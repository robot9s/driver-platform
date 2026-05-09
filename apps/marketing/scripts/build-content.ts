/**
 * Compiles the content-collections graph into
 * `.content-collections/generated/` so that downstream `tsc --noEmit` and
 * `vite build` can resolve the `content-collections` alias.
 *
 * Invoked via `pnpm --filter marketing generate` and as a prerequisite for
 * both `type-check` and `build`.
 */
import path from "node:path";
import { fileURLToPath } from "node:url";

import { createBuilder } from "@content-collections/core";

async function main() {
	const marketingRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
	const configurationPath = path.join(marketingRoot, "content-collections.ts");

	const builder = await createBuilder(configurationPath);
	await builder.build();
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
