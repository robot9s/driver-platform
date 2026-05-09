import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { compile } from "@inlang/paraglide-js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageRoot = join(__dirname, "..");

compile({
	project: join(packageRoot, "project.inlang"),
	outdir: join(packageRoot, "paraglide"),
	outputStructure: "message-modules",
	cookieName: "locale",
	localStorageKey: "locale",
	strategy: ["url", "cookie", "baseLocale"],
	emitReadme: false,
	emitGitIgnore: true,
})
	.then(() => {
		process.exit(0);
	})
	.catch((error: unknown) => {
		console.error(error);
		process.exit(1);
	});
