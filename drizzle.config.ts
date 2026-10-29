import { defineConfig } from 'drizzle-kit';
import { detectDialect } from './src/lib/server/db/dialect';

try {
	process.loadEnvFile();
} catch {
	// No .env file, rely on the real environment
}

const url = process.env.DATABASE_URL || 'file:./data/eazyid.db';
const dialect = detectDialect(url);

export default defineConfig({
	dialect: dialect === 'postgres' ? 'postgresql' : 'sqlite',
	schema: `./src/lib/server/db/${dialect}/schema.ts`,
	dbCredentials: { url }
});
