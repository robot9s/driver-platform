/**
 * Client-side cache invalidation helper (replaces Next.js revalidatePath).
 * Prefer TanStack Query invalidation from callers.
 */
export function clearCache(_path?: string): void {
	// No-op: route loaders and query invalidation handle freshness in TanStack Start.
}
