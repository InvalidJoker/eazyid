import { settings } from './procedures/settings';
import { system } from './procedures/system';

export const router = {
	settings,
	system
};

export type Router = typeof router;
