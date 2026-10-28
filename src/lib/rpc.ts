import { createORPCClient } from '@orpc/client';
import { RPCLink } from '@orpc/client/fetch';
import type { RouterClient } from '@orpc/server';
import type { Router } from '#lib/server/rpc/router.js';

const link = new RPCLink({
	url: () => `${window.location.origin}/rpc`
});

export const rpc: RouterClient<Router> = createORPCClient(link);
