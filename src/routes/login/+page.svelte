<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { authClient } from '#lib/auth-client.js';
	import AuthShell from '#lib/components/auth-shell.svelte';
	import CheckInbox from '#lib/components/auth/check-inbox.svelte';
	import { Button } from '#lib/components/ui/button/index.js';
	import * as Field from '#lib/components/ui/field/index.js';
	import { Input } from '#lib/components/ui/input/index.js';
	import { safeRedirect } from '#lib/safe-redirect.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let email = $state('');
	let password = $state('');
	let errorMessage = $state('');
	let pending = $state(false);
	let unverified = $state(false);

	const redirectTo = $derived(page.url.searchParams.get('redirectTo'));

	async function signIn(event: SubmitEvent) {
		event.preventDefault();
		pending = true;
		errorMessage = '';

		const { data: result, error } = await authClient.signIn.email({ email, password });

		pending = false;
		if (error?.code === 'EMAIL_NOT_VERIFIED') {
			unverified = true;
			return;
		}
		if (error) {
			errorMessage = error.message ?? 'Could not sign in';
			return;
		}

		// Set when signing in resumes an OAuth authorization request
		if (result?.redirect && result.url) {
			window.location.href = result.url;
			return;
		}
		await goto(safeRedirect(redirectTo), { invalidateAll: true });
	}
</script>

<svelte:head>
	<title>Sign in</title>
</svelte:head>

<AuthShell heading="Sign in" subtitle="Welcome back. Sign in to continue.">
	{#if !data.authOptions.emailPassword}
		<p class="text-center text-sm text-muted-foreground">
			Signing in with email and password is disabled on this instance.
		</p>
	{:else if unverified}
		<CheckInbox {email} />
	{:else}
		<form onsubmit={signIn}>
			<Field.Group>
				<Field.Field>
					<Field.Label for="email">Email</Field.Label>
					<Input id="email" type="email" autocomplete="email" required bind:value={email} />
				</Field.Field>
				<Field.Field>
					<Field.Label for="password">Password</Field.Label>
					<Input
						id="password"
						type="password"
						autocomplete="current-password"
						required
						bind:value={password}
					/>
				</Field.Field>
				{#if errorMessage}
					<Field.Error>{errorMessage}</Field.Error>
				{/if}
				<Button type="submit" class="w-full" disabled={pending}>Sign in</Button>
			</Field.Group>
		</form>
	{/if}

	{#snippet footer()}
		{#if data.authOptions.signUp && data.authOptions.emailPassword}
			No account yet?
			<a
				href="/register{page.url.search}"
				class="font-medium text-foreground underline-offset-4 hover:underline">Create one</a
			>
		{/if}
	{/snippet}
</AuthShell>
