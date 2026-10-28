import { os } from '@orpc/server';

export interface RpcContext {
	headers: Headers;
}

export const base = os.$context<RpcContext>();
