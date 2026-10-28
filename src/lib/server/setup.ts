import { auth } from '#lib/server/auth/index.js';
import { db, schema } from '#lib/server/db/index.js';

export interface FirstAdmin {
	name: string;
	email: string;
	password: string;
}

export class SetupCompletedError extends Error {
	constructor() {
		super('Setup has already been completed');
	}
}

let completed = false;
let queue: Promise<unknown> = Promise.resolve();

/** Setup is required until the first user exists. Once done it stays done for this process. */
export async function isSetupRequired() {
	if (completed) return false;

	const [anyUser] = await db.select({ id: schema.user.id }).from(schema.user).limit(1);
	completed = anyUser !== undefined;

	return !completed;
}

/** Creates the first admin and signs them in. Runs one at a time so two requests cannot both win. */
export function createFirstAdmin(admin: FirstAdmin) {
	const run = queue.then(async () => {
		if (!(await isSetupRequired())) throw new SetupCompletedError();

		await auth.api.createUser({ body: { ...admin, role: 'admin' } });
		completed = true;

		await auth.api.signInEmail({ body: { email: admin.email, password: admin.password } });
	});

	queue = run.catch(() => {});
	return run;
}
