import { applications } from './procedures/applications';
import { email } from './procedures/email';
import { settings } from './procedures/settings';
import { setup } from './procedures/setup';
import { system } from './procedures/system';

export const router = {
	applications,
	email,
	settings,
	setup,
	system
};

export type Router = typeof router;
