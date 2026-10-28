export type Dialect = 'postgres' | 'sqlite';

export function detectDialect(url: string): Dialect {
	if (url.startsWith('postgres://') || url.startsWith('postgresql://')) return 'postgres';
	if (url.startsWith('file:') || url.startsWith('libsql://')) return 'sqlite';
	throw new Error(`Unsupported DATABASE_URL: expected postgres://, file: or libsql://`);
}
