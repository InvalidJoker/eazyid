import { oauthProviderClient } from '@better-auth/oauth-provider/client';
import { adminClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/svelte';

export const authClient = createAuthClient({
	plugins: [adminClient(), oauthProviderClient()]
});
