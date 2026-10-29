<script lang="ts">
	import CircleCheckIcon from '@lucide/svelte/icons/circle-check';
	import CircleXIcon from '@lucide/svelte/icons/circle-x';
	import { page } from '$app/state';
	import AuthShell from '#lib/components/auth-shell.svelte';
	import { Button } from '#lib/components/ui/button/index.js';

	const failed = $derived(page.url.searchParams.has('error'));
</script>

<svelte:head>
	<title>Verify email</title>
</svelte:head>

<AuthShell heading="Verify email">
	<div class="flex flex-col items-center gap-4 text-center">
		{#if failed}
			<CircleXIcon class="size-10 text-destructive" />
			<div>
				<p class="font-medium">This link is invalid or has expired</p>
				<p class="mt-1 text-sm text-muted-foreground">Sign in to get a new verification email.</p>
			</div>
			<Button href="/login" class="w-full">Go to sign in</Button>
		{:else}
			<CircleCheckIcon class="size-10 text-primary" />
			<div>
				<p class="font-medium">Your email is verified</p>
				<p class="mt-1 text-sm text-muted-foreground">You can continue to your account.</p>
			</div>
			<Button href="/" class="w-full">Continue</Button>
		{/if}
	</div>
</AuthShell>
