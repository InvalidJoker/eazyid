import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import { hasMigrations } from '../migrations';
import * as schema from './schema';

const migrationsFolder = 'drizzle/postgres';

export function connect(url: string) {
	const db = drizzle(postgres(url), { schema });

	return {
		db,
		schema,
		migrate: async () => {
			if (hasMigrations(migrationsFolder)) await migrate(db, { migrationsFolder });
		}
	};
}

export type Connection = ReturnType<typeof connect>;
