import { PostListItem } from "@blog/components/PostListItem";
import { getAllPosts } from "@blog/lib/posts";
import { marketing_blog_description, marketing_blog_title } from "@repo/i18n/paraglide/messages.js";
import { getLocale } from "@repo/i18n/paraglide/runtime";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/blog/")({
	component: BlogListPage,
	loader: async () => ({
		posts: await getAllPosts(getLocale()),
	}),
	head: () => ({
		meta: [{ title: String(marketing_blog_title()) }],
	}),
});

function BlogListPage() {
	const { posts } = Route.useLoaderData();

	return (
		<div className="max-w-6xl py-16 container">
			<div className="mb-12 pt-8 text-center">
				<h1 className="mb-2 font-bold text-5xl">{marketing_blog_title()}</h1>
				<p className="text-lg opacity-50">{marketing_blog_description()}</p>
			</div>

			<div className="gap-8 md:grid-cols-2 grid">
				{posts.map((post) => (
					<PostListItem post={post} key={post.path} />
				))}
			</div>
		</div>
	);
}
