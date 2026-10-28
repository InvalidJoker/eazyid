<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { authClient } from '#lib/auth-client.js';
	import AuthShell from '#lib/components/auth-shell.svelte';
	import { Button } from '#lib/components/ui/button/index.js';
	import * as Field from '#lib/components/ui/field/index.js';
	import { Input } from '#lib/components/ui/input/index.js';
	import { safeRedirect } from '#lib/safe-redirect.js';

	let email = $state('');
	let password = $state('');
	let errorMessage = $state('');
	let pending = $state(false);

	async function signIn(event: SubmitEvent) {
		event.preventDefault();
		pending = true;
		errorMessage = '';

		const { error } = await authClient.signIn.email({ email, password });

		pending = false;
		if (error) {
			errorMessage = error.message ?? 'Could not sign in';
			return;
		}

		await goto(safeRedirect(page.url.searchParams.get('redirectTo')), { invalidateAll: true });
	}
</script>

<AuthShell heading="Sign in" subtitle="Welcome back. Sign in to continue.">
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
</AuthShell>
