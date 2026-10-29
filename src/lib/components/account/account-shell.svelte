<script lang="ts">
	import type { Snippet } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { authClient } from '#lib/auth-client.js';
	import BrandMark from '#lib/components/brand-mark.svelte';
	import ThemeToggle from '#lib/components/theme-toggle.svelte';
	import { Button } from '#lib/components/ui/button/index.js';

	let { isAdmin, children }: { isAdmin: boolean; children: Snippet } = $props();

	async function signOut() {
		await authClient.signOut();
		await goto('/login', { invalidateAll: true });
	}
</script>

<header class="border-b">
	<div class="mx-auto flex h-14 max-w-3xl items-center gap-3 px-4">
		<a href="/" class="flex items-center gap-2.5">
			<BrandMark />
			<span class="text-sm font-semibold">{page.data.branding?.instanceName}</span>
		</a>
		<div class="ms-auto flex items-center gap-1.5">
			{#if isAdmin}
				<Button variant="ghost" size="sm" href="/admin">Admin</Button>
			{/if}
			<Button variant="ghost" size="sm" onclick={signOut}>Sign out</Button>
			<ThemeToggle variant="ghost" size="icon-sm" />
		</div>
	</div>
</header>

<main class="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-8">
	{@render children()}
</main>
