import { useRouter as useTanStackRouter } from "@tanstack/react-router";

/**
 * Next.js-compatible navigation helpers for migrated components.
 */
export function useRouter() {
	const router = useTanStackRouter();
	return {
		replace: (to: string) => {
			void router.navigate({ to, replace: true });
		},
		push: (to: string) => {
			void router.navigate({ to });
		},
		refresh: () => {
			void router.invalidate();
		},
	};
}
