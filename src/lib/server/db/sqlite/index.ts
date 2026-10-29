import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { migrate } from 'drizzle-orm/libsql/migrator';
import { hasMigrations } from '../migrations';
import * as schema from './schema';

const migrationsFolder = 'drizzle/sqlite';

export function connect(url: string) {
	if (url.startsWith('file:')) {
		mkdirSync(dirname(url.slice('file:'.length)), { recursive: true });
	}

	const db = drizzle(createClient({ url }), { schema });

	return {
		db,
		schema,
		migrate: async () => {
			if (hasMigrations(migrationsFolder)) await migrate(db, { migrationsFolder });
		}
	};
}
