/** Postgres returns `text[]` columns as arrays, SQLite stores the same columns as JSON text. */
export function toStringArray(value: unknown): string[] {
	if (Array.isArray(value)) return value.map(String);
	if (typeof value !== 'string' || value === '') return [];

	try {
		const parsed: unknown = JSON.parse(value);
		return Array.isArray(parsed) ? parsed.map(String) : [value];
	} catch {
		return [value];
	}
}
