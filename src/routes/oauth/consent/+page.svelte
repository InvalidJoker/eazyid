<script lang="ts">
	import CheckIcon from '@lucide/svelte/icons/check';
	import { authClient } from '#lib/auth-client.js';
	import AuthShell from '#lib/components/auth-shell.svelte';
	import { Button } from '#lib/components/ui/button/index.js';
	import { describeScope } from '#lib/oidc-scopes.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let pending = $state(false);
	let errorMessage = $state('');

	async function decide(accept: boolean) {
		pending = true;
		errorMessage = '';

		const { data: result, error } = await authClient.oauth2.consent({ accept });
		if (error) {
			pending = false;
			errorMessage = error.message ?? 'Something went wrong';
			return;
		}
		if (result?.url) window.location.href = result.url;
	}
</script>

<svelte:head>
	<title>Authorize {data.client.name}</title>
</svelte:head>

<AuthShell heading="Authorize {data.client.name}" subtitle="Signed in as {data.user.email}">
	<div class="flex flex-col gap-5">
		{#if data.client.logo}
			<img src={data.client.logo} alt="" class="mx-auto size-12 rounded-lg object-contain" />
		{/if}

		<div>
			<p class="text-sm font-medium">
				{#if data.client.uri}
					<a href={data.client.uri} class="underline-offset-4 hover:underline" rel="noreferrer">
						{data.client.name}
					</a>
				{:else}
					{data.client.name}
				{/if}
				wants to:
			</p>
			<ul class="mt-3 flex flex-col gap-2">
				{#each data.scopes as scope (scope)}
					<li class="flex items-center gap-2 text-sm">
						<CheckIcon class="size-4 shrink-0 text-primary" />
						{describeScope(scope)}
					</li>
				{/each}
			</ul>
		</div>

		{#if errorMessage}
			<p class="text-sm text-destructive">{errorMessage}</p>
		{/if}

		<div class="flex gap-2">
			<Button variant="outline" class="flex-1" disabled={pending} onclick={() => decide(false)}>
				Deny
			</Button>
			<Button class="flex-1" disabled={pending} onclick={() => decide(true)}>Allow</Button>
		</div>
	</div>
</AuthShell>
