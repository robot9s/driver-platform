import * as cheerio from "cheerio";
import TurndownService from "turndown";
import { gfm } from "turndown-plugin-gfm";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

// Archive crawler for https://nativelaunch.dev/docs (see index.md).
// Run from this directory: npm i turndown turndown-plugin-gfm cheerio && node crawl.mjs
// Update the `fetched:` date literals below when re-crawling.
const OUT = import.meta.dirname;
const BASE = "https://nativelaunch.dev";

// Nav hierarchy reconstructed from the fumadocs sidebar groups + sitemap.
// [section, [url path, archive file path]]
const NAV = [
	["Get Started", [
		["/docs", "introduction.md"],
		["/docs/tech-stack", "tech-stack.md"],
		["/docs/agents", "agents.md"],
	]],
	["Setup", [
		["/docs/setup/installation", "setup/installation.md"],
		["/docs/setup/configuration", "setup/configuration.md"],
		["/docs/setup/project-structure", "setup/project-structure.md"],
		["/docs/setup/manage-dependencies", "setup/manage-dependencies.md"],
		["/docs/setup/update", "setup/update.md"],
	]],
	["Features — Supabase", [
		["/docs/supabase/setup", "supabase/setup.md"],
		["/docs/supabase/database-tables-setup", "supabase/database-tables-setup.md"],
		["/docs/supabase/typedefinitions", "supabase/typedefinitions.md"],
		["/docs/supabase/edge-function", "supabase/edge-function.md"],
	]],
	["Features — AI", [
		["/docs/ai/overview", "ai/overview.md"],
		["/docs/ai/implementation", "ai/implementation.md"],
	]],
	["Features — Authentication", [
		["/docs/auth/login-with-email", "auth/login-with-email.md"],
		["/docs/auth/google-auth", "auth/google-auth.md"],
		["/docs/auth/apple-auth", "auth/apple-auth.md"],
	]],
	["Features — Payment", [
		["/docs/payment/overview", "payment/overview.md"],
		["/docs/payment/ios-subscription-app-store", "payment/ios-subscription-app-store.md"],
		["/docs/payment/android-subscription-google-play", "payment/android-subscription-google-play.md"],
	]],
	["Features — Push Notifications", [
		["/docs/notifications/overview", "notifications/overview.md"],
		["/docs/notifications/remote-push-notifications", "notifications/remote-push-notifications.md"],
		["/docs/notifications/scheduled-notifications", "notifications/scheduled-notifications.md"],
	]],
	["Features — Customization", [
		["/docs/customization/styling", "customization/styling.md"],
		["/docs/customization/components", "customization/components.md"],
		["/docs/customization/routing", "customization/routing.md"],
	]],
	["Features — Analytics", [
		["/docs/analytics/overview", "analytics/overview.md"],
		["/docs/analytics/setup", "analytics/setup.md"],
		["/docs/analytics/usage", "analytics/usage.md"],
	]],
	["Features — Observability & i18n", [
		["/docs/monitoring", "monitoring.md"],
		["/docs/internationalization", "internationalization.md"],
	]],
	["Versioning & Deploy", [
		["/docs/release-strategy", "release-strategy.md"],
		["/docs/release-app", "release-app.md"],
	]],
	["Versioning & Deploy — CI & Environments", [
		["/docs/environments/overview", "environments/overview.md"],
		["/docs/environments/expo-environments", "environments/expo-environments.md"],
		["/docs/environments/github-environments", "environments/github-environments.md"],
	]],
	["Versioning & Deploy — Publish to Stores", [
		["/docs/build-and-submit/submit-ios-app-store", "build-and-submit/submit-ios-app-store.md"],
		["/docs/build-and-submit/submit-android-google-play", "build-and-submit/submit-android-google-play.md"],
	]],
	["Help & Support", [
		["/docs/troubleshooting", "troubleshooting.md"],
		["/docs/faq", "faq.md"],
	]],
];

const td = new TurndownService({ headingStyle: "atx", codeBlockStyle: "fenced", bulletListMarker: "-" });
td.use(gfm);
// fumadocs renders code blocks as <pre><code> inside figure with copy buttons; drop buttons/svgs
td.remove(["button", "svg", "style", "script"]);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const results = [];
const problems = [];

function toRelativeLink(fromFile, targetUrlPath) {
	for (const [, pages] of NAV) {
		for (const [p, f] of pages) {
			if (p === targetUrlPath) {
				let rel = path.posix.relative(path.posix.dirname(fromFile), f);
				if (!rel.startsWith(".")) rel = `./${rel}`;
				return rel;
			}
		}
	}
	return null;
}

for (const [section, pages] of NAV) {
	for (const [urlPath, file] of pages) {
		const url = BASE + urlPath;
		let res;
		try {
			res = await fetch(url, { headers: { "User-Agent": "docs-archiver (personal license backup)" } });
		} catch (e) {
			problems.push(`${urlPath}: fetch failed (${e.message})`);
			continue;
		}
		if (!res.ok) {
			problems.push(`${urlPath}: HTTP ${res.status}${res.status === 401 || res.status === 403 ? " (may require premium login)" : ""}`);
			continue;
		}
		const $ = cheerio.load(await res.text());
		const article = $("#nd-page");
		if (!article.length) {
			problems.push(`${urlPath}: no #nd-page article found`);
			continue;
		}
		const title = article.find("h1").first().text().trim() || urlPath;
		const description = article.children("p").first().text().trim();
		const prose = article.children("div.prose").first();
		if (!prose.length) {
			problems.push(`${urlPath}: no prose content (possibly gated)`);
			continue;
		}
		// unwrap self-anchor links inside headings so they convert to plain text
		prose.find("h1 a[href^='#'], h2 a[href^='#'], h3 a[href^='#'], h4 a[href^='#'], h5 a[href^='#']").each((_, a) => {
			$(a).replaceWith($(a).text());
		});
		// rewrite links: internal /docs links -> relative archive paths; other relative -> absolute
		prose.find("a").each((_, a) => {
			const href = $(a).attr("href");
			if (!href) return;
			if (href.startsWith("/docs")) {
				const [p, hash] = href.split("#");
				const rel = toRelativeLink(file, p);
				$(a).attr("href", rel ? rel + (hash ? `#${hash}` : "") : BASE + href);
			} else if (href.startsWith("/")) {
				$(a).attr("href", BASE + href);
			}
		});
		prose.find("img").each((_, img) => {
			const src = $(img).attr("src");
			if (src?.startsWith("/")) $(img).attr("src", BASE + src);
		});
		const md = td.turndown(prose.html() ?? "");
		if (md.trim().length < 100) {
			problems.push(`${urlPath}: suspiciously thin content (${md.trim().length} chars) — check if gated`);
		}
		const out = [
			"---",
			`title: "${title.replaceAll('"', '\\"')}"`,
			`source: ${url}`,
			`fetched: 2026-07-07`,
			"---",
			"",
			`# ${title}`,
			...(description ? ["", `> ${description}`] : []),
			"",
			md.trim(),
			"",
		].join("\n");
		await mkdir(path.join(OUT, path.dirname(file)), { recursive: true });
		await writeFile(path.join(OUT, file), out, "utf8");
		results.push({ section, urlPath, file, title, description, chars: md.length });
		console.log(`OK ${urlPath} -> ${file} (${md.length} chars)`);
		await sleep(250);
	}
}

// index.md with TOC
const lines = [
	"# NativeLaunch Documentation Archive",
	"",
	"Markdown mirror of https://nativelaunch.dev/docs, archived so the vendor",
	"docs for `vendor/moneyra-template` can't be lost. Crawled on **2026-07-07**",
	"from the public docs site (no pages required a premium login" +
		(problems.length ? " except as noted below" : "") + ").",
	"",
	"Regenerate by re-running the crawler against the sitemap; file layout",
	"mirrors the docs sidebar hierarchy.",
	"",
];
let currentSection = "";
for (const r of results) {
	if (r.section !== currentSection) {
		currentSection = r.section;
		lines.push(`## ${currentSection}`, "");
	}
	lines.push(`- [${r.title}](${r.file})${r.description ? ` — ${r.description}` : ""}`);
	if (results[results.indexOf(r) + 1]?.section !== currentSection) lines.push("");
}
if (problems.length) {
	lines.push("## Pages with issues", "", ...problems.map((p) => `- ${p}`), "");
}
await writeFile(path.join(OUT, "index.md"), lines.join("\n"), "utf8");
console.log(`\nDONE: ${results.length} pages archived, ${problems.length} problems`);
if (problems.length) console.log(problems.join("\n"));
