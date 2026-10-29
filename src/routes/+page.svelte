<script lang="ts">
	import AppHeader from '#lib/components/app-header.svelte';
	import AuthShell from '#lib/components/auth-shell.svelte';
	import { Button } from '#lib/components/ui/button/index.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

{#if data.viewer}
	<AppHeader user={data.viewer.user} />

	<main class="mx-auto max-w-5xl px-4 py-10 sm:px-6">
		<h1 class="text-2xl font-semibold">Hi, {data.viewer.user.name}</h1>
		<p class="mt-1 text-sm text-muted-foreground">
			You are signed in to {data.branding.instanceName}.
		</p>
	</main>
{:else}
	<AuthShell heading={data.branding.instanceName} subtitle="Sign in to continue.">
		<Button href="/login" class="w-full">Sign in</Button>
	</AuthShell>
{/if}
