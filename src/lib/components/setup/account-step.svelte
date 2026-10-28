<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { Button } from '#lib/components/ui/button/index.js';
	import * as Field from '#lib/components/ui/field/index.js';
	import { Input } from '#lib/components/ui/input/index.js';
	import { rpc } from '#lib/rpc.js';

	let { onDone }: { onDone: () => void } = $props();

	let name = $state('');
	let email = $state('');
	let password = $state('');
	let confirm = $state('');
	let errorMessage = $state('');
	let pending = $state(false);

	async function submit(event: SubmitEvent) {
		event.preventDefault();
		errorMessage = '';

		if (password !== confirm) {
			errorMessage = 'Passwords do not match';
			return;
		}

		pending = true;
		try {
			await rpc.setup.createAdmin({ name, email, password });
			await invalidateAll();
			onDone();
		} catch (error) {
			errorMessage = error instanceof Error ? error.message : 'Could not create the admin account';
		} finally {
			pending = false;
		}
	}
</script>

<form onsubmit={submit}>
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
		<Button type="submit" class="w-full" disabled={pending}>Create admin account</Button>
	</Field.Group>
</form>
