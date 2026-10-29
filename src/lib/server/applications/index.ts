import { desc, eq } from 'drizzle-orm';
import { getAuth } from '#lib/server/auth/index.js';
import { toStringArray } from '#lib/server/db/arrays.js';
import { db, schema } from '#lib/server/db/index.js';
import type { ApplicationType } from '#lib/applications.js';

export interface ApplicationDetails {
	name: string;
	redirectUris: string[];
	skipConsent: boolean;
}

export type Application = ReturnType<typeof toApplication>;

const loopbackHosts = ['localhost', '127.0.0.1', '[::1]'];

/** OIDC only allows https on public hosts for web clients; loopback and app schemes are native. */
function inferApplicationType(redirectUris: string[]) {
	const allPublicHttps = redirectUris.every((uri) => {
		const url = new URL(uri);
		return url.protocol === 'https:' && !loopbackHosts.includes(url.hostname);
	});
	return allPublicHttps ? 'web' : 'native';
}

function toApplication(client: typeof schema.oauthClient.$inferSelect) {
	return {
		clientId: client.clientId,
		name: client.name ?? client.clientId,
		type: (client.tokenEndpointAuthMethod === 'none'
			? 'public'
			: 'confidential') as ApplicationType,
		redirectUris: toStringArray(client.redirectUris),
		skipConsent: client.skipConsent ?? false,
		disabled: client.disabled ?? false,
		ownedByInstance: client.referenceId === 'instance',
		createdAt: client.createdAt
	};
}

export async function listApplications() {
	const clients = await db
		.select()
		.from(schema.oauthClient)
		.orderBy(desc(schema.oauthClient.createdAt));
	return clients.map(toApplication);
}

export async function getApplication(clientId: string) {
	const [client] = await db
		.select()
		.from(schema.oauthClient)
		.where(eq(schema.oauthClient.clientId, clientId))
		.limit(1);
	return client ? toApplication(client) : null;
}

/** Admin sessions create instance-owned applications, see `clientReference` in the auth config. */
export async function createApplication(
	headers: Headers,
	details: ApplicationDetails & { type: ApplicationType }
) {
	const auth = await getAuth();
	const client = await auth.api.adminCreateOAuthClient({
		headers,
		body: {
			client_name: details.name,
			redirect_uris: details.redirectUris,
			application_type: inferApplicationType(details.redirectUris),
			token_endpoint_auth_method: details.type === 'public' ? 'none' : 'client_secret_basic',
			grant_types: ['authorization_code', 'refresh_token'],
			response_types: ['code'],
			skip_consent: details.skipConsent
		}
	});

	return { clientId: client.client_id, clientSecret: client.client_secret ?? null };
}

export async function updateApplication(
	headers: Headers,
	clientId: string,
	details: ApplicationDetails & { disabled: boolean }
) {
	const auth = await getAuth();
	await auth.api.adminUpdateOAuthClient({
		headers,
		body: {
			client_id: clientId,
			update: {
				client_name: details.name,
				redirect_uris: details.redirectUris,
				application_type: inferApplicationType(details.redirectUris),
				skip_consent: details.skipConsent,
				disabled: details.disabled
			}
		}
	});
}

export async function rotateApplicationSecret(headers: Headers, clientId: string) {
	const auth = await getAuth();
	const client = await auth.api.rotateClientSecret({ headers, body: { client_id: clientId } });
	return { clientSecret: client.client_secret ?? null };
}

// Deleted directly so admins can also remove applications users registered themselves;
// tokens and consents go with it through the foreign keys
export async function deleteApplication(clientId: string) {
	await db.delete(schema.oauthClient).where(eq(schema.oauthClient.clientId, clientId));
}
