/**
 * Returns the base URL for the current app. Pass the env value directly so the
 * bundler can replace it at build time (e.g. import.meta.env.VITE_SAAS_URL).
 *
 * @param envValue - The env value to use when defined (e.g. import.meta.env.VITE_SAAS_URL)
 * @param defaultPort - Port for localhost fallback when no env is set (default: 3000)
 */
export function getBaseUrl(envValue?: string, defaultPort = 3000): string {
	if (envValue) {
		return envValue;
	}
	return `http://localhost:${process.env.PORT ?? defaultPort}`;
}
