import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	dialect: 'sqlite',
	schema: './src/lib/server/db/sqlite/schema.ts',
	out: './drizzle/sqlite',
	strict: true
});
