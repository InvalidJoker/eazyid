import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import * as schema from './schema';

export function connect(url: string) {
	const db = drizzle(postgres(url), { schema });

	return {
		db,
		schema,
		migrate: () => migrate(db, { migrationsFolder: 'drizzle/postgres' })
	};
}

export type Connection = ReturnType<typeof connect>;
