import { settings } from './procedures/settings';
import { setup } from './procedures/setup';
import { system } from './procedures/system';

export const router = {
	settings,
	setup,
	system
};

export type Router = typeof router;
