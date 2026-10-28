import { defineEnvVars } from '@sveltejs/kit/env';
import { z } from 'zod';

export const variables = defineEnvVars({
	DATABASE_URL: {
		description:
			'Database connection string. `postgres://...` for Postgres, `file:...` for SQLite.',
		schema: z.string().default('file:./data/eazyid.db')
	},
	ORIGIN: {
		description: 'Public base URL of this instance, e.g. `http://localhost:5173`.',
		schema: z.url()
	},
	BETTER_AUTH_SECRET: {
		description: 'Secret used to sign sessions and tokens. At least 32 random characters.',
		schema: z.string().min(32)
	}
});
