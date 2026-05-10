import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

interface ContentDocument {
	path: string;
}

const marketingRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicRoot = path.join(marketingRoot, "public");
const baseUrl = process.env.VITE_MARKETING_URL ?? `http://localhost:${process.env.PORT ?? 3001}`;
const locales = ["en", "de", "es", "fr"];
const defaultLocale = "en";
const staticMarketingPages = ["", "/blog", "/changelog", "/contact"];

function uniqueBasePaths(documents: ContentDocument[]) {
	return [...new Set(documents.map((document) => document.path))].sort();
}

function localePath(locale: string, routePath: string) {
	const prefix = locale === defaultLocale ? "" : `/${locale}`;
	return `${prefix}${routePath}`;
}

function sitemapUrl(loc: string) {
	return ["<url>", `<loc>${loc}</loc>`, "</url>"].join("");
}

async function main() {
	const { allPosts, allLegalPages } =
		(await import("../.content-collections/generated/index.js")) as {
			allPosts: ContentDocument[];
			allLegalPages: ContentDocument[];
		};

	const urls = [
		...staticMarketingPages.flatMap((page) =>
			locales.map((locale) => new URL(localePath(locale, page), baseUrl).href),
		),
		...uniqueBasePaths(allPosts).flatMap((postPath) =>
			locales.map((locale) => new URL(localePath(locale, `/blog/${postPath}`), baseUrl).href),
		),
		...uniqueBasePaths(allLegalPages).flatMap((legalPath) =>
			locales.map(
				(locale) => new URL(localePath(locale, `/legal/${legalPath}`), baseUrl).href,
			),
		),
	];

	await writeFile(
		path.join(publicRoot, "sitemap.xml"),
		[
			'<?xml version="1.0" encoding="UTF-8"?>',
			'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
			...urls.map((url) => sitemapUrl(url)),
			"</urlset>",
			"",
		].join("\n"),
	);
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
