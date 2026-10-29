<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { authClient } from '#lib/auth-client.js';
	import AuthShell from '#lib/components/auth-shell.svelte';
	import { Button } from '#lib/components/ui/button/index.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	async function signOut() {
		await authClient.signOut();
		await invalidateAll();
	}
</script>

{#if data.user}
	<AuthShell heading="Hi, {data.user.name}" subtitle="You are signed in.">
		<div class="flex flex-col gap-2">
			<Button href="/account">Account</Button>
			{#if data.user.isAdmin}
				<Button variant="outline" href="/admin">Admin</Button>
			{/if}
			<Button variant="outline" onclick={signOut}>Sign out</Button>
		</div>
	</AuthShell>
{:else}
	<AuthShell heading={data.branding.instanceName} subtitle="Sign in to continue.">
		<Button href="/login" class="w-full">Sign in</Button>
	</AuthShell>
{/if}
