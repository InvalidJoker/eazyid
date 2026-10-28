import { DATABASE_URL } from '$app/env/private';
import { detectDialect } from './dialect';
import * as postgres from './postgres';
import * as sqlite from './sqlite';

export const dialect = detectDialect(DATABASE_URL);

// Both dialects use the same table and column names, so app code is typed against the
// Postgres schema and the same queries run on SQLite.
const connection = (
	dialect === 'postgres' ? postgres.connect(DATABASE_URL) : sqlite.connect(DATABASE_URL)
) as postgres.Connection;

export const { db, schema, migrate } = connection;
