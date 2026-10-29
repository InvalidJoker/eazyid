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

	let name = $state('');
	let email = $state('');
	let password = $state('');
	let confirm = $state('');
	let errorMessage = $state('');
	let pending = $state(false);
	let awaitingVerification = $state(false);

	const open = $derived(data.authOptions.signUp && data.authOptions.emailPassword);
	const redirectTo = $derived(page.url.searchParams.get('redirectTo'));

	async function register(event: SubmitEvent) {
		event.preventDefault();
		errorMessage = '';

		if (password !== confirm) {
			errorMessage = 'Passwords do not match';
			return;
		}

		pending = true;
		const { data: result, error } = await authClient.signUp.email({
			name,
			email,
			password,
			callbackURL: '/verify-email'
		});
		pending = false;

		if (error) {
			errorMessage = error.message ?? 'Could not create the account';
			return;
		}

		if (data.authOptions.emailVerification === 'required') {
			awaitingVerification = true;
			return;
		}
		// Set when signing up resumes an OAuth authorization request
		if (result && 'url' in result && typeof result.url === 'string') {
			window.location.href = result.url;
			return;
		}
		await goto(safeRedirect(redirectTo), { invalidateAll: true });
	}
</script>

<svelte:head>
	<title>Create account</title>
</svelte:head>

<AuthShell heading="Create account" subtitle="Sign up to get started.">
	{#if !open}
		<p class="text-center text-sm text-muted-foreground">
			Sign-up is disabled on this instance. Ask an administrator for an account.
		</p>
	{:else if awaitingVerification}
		<CheckInbox {email} />
	{:else}
		<form onsubmit={register}>
			<Field.Group>
				<Field.Field>
					<Field.Label for="name">Name</Field.Label>
					<Input id="name" autocomplete="name" required bind:value={name} />
				</Field.Field>
				<Field.Field>
					<Field.Label for="email">Email</Field.Label>
					<Input id="email" type="email" autocomplete="email" required bind:value={email} />
				</Field.Field>
				<Field.Field>
					<Field.Label for="password">Password</Field.Label>
					<Input
						id="password"
						type="password"
						autocomplete="new-password"
						minlength={8}
						required
						bind:value={password}
					/>
					<Field.Description>At least 8 characters.</Field.Description>
				</Field.Field>
				<Field.Field>
					<Field.Label for="confirm">Confirm password</Field.Label>
					<Input
						id="confirm"
						type="password"
						autocomplete="new-password"
						required
						bind:value={confirm}
					/>
				</Field.Field>
				{#if errorMessage}
					<Field.Error>{errorMessage}</Field.Error>
				{/if}
				<Button type="submit" class="w-full" disabled={pending}>Create account</Button>
			</Field.Group>
		</form>
	{/if}

	{#snippet footer()}
		Already have an account?
		<a
			href="/login{page.url.search}"
			class="font-medium text-foreground underline-offset-4 hover:underline">Sign in</a
		>
	{/snippet}
</AuthShell>
