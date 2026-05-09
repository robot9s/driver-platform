import { useRouterState } from "@tanstack/react-router";

/** Next.js `useSearchParams`-compatible hook for migrated components. */
export function useSearchParams() {
	return useRouterState({
		select: (s) => new URLSearchParams(s.location.search),
	});
}
