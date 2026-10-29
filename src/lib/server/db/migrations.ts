import { existsSync } from 'node:fs';
import { join } from 'node:path';

/** Until `pnpm db:generate` has produced migrations, the schema is managed with `pnpm db:push`. */
export function hasMigrations(folder: string) {
	return existsSync(join(folder, 'meta', '_journal.json'));
}
