import { defaultSettings } from '#lib/server/settings/definitions.js';
import { createAuth } from './index';

// Entry point for `pnpm auth:schema`. The CLI only needs the plugin list to generate tables.
export const auth = createAuth(defaultSettings);
