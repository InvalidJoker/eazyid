import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	dialect: 'postgresql',
	schema: './src/lib/server/db/postgres/schema.ts',
	out: './drizzle/postgres',
	strict: true
});
