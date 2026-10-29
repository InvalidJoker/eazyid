<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { authClient } from '#lib/auth-client.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import * as Field from '#lib/components/ui/field/index.js';
	import { Input } from '#lib/components/ui/input/index.js';

	let currentPassword = $state('');
	let newPassword = $state('');
	let confirm = $state('');
	let errorMessage = $state('');
	let pending = $state(false);

	async function change(event: SubmitEvent) {
		event.preventDefault();
		errorMessage = '';

		if (newPassword !== confirm) {
			errorMessage = 'Passwords do not match';
			return;
		}

		pending = true;
		const { error } = await authClient.changePassword({
			currentPassword,
			newPassword,
			revokeOtherSessions: true
		});
		pending = false;

		if (error) {
			errorMessage = error.message ?? 'Could not change your password';
			return;
		}

		currentPassword = newPassword = confirm = '';
		toast.success('Password changed. Other sessions were signed out.');
	}
</script>

<section class="flex flex-col gap-3">
	<div>
		<h3 class="text-sm font-medium">Password</h3>
		<p class="text-xs text-muted-foreground">Changing it signs you out everywhere else.</p>
	</div>
	<form onsubmit={change}>
		<Field.Group>
			<Field.Field>
				<Field.Label for="current-password">Current password</Field.Label>
				<Input
					id="current-password"
					type="password"
					autocomplete="current-password"
					required
					bind:value={currentPassword}
				/>
			</Field.Field>
			<Field.Field>
				<Field.Label for="new-password">New password</Field.Label>
				<Input
					id="new-password"
					type="password"
					autocomplete="new-password"
					minlength={8}
					required
					bind:value={newPassword}
				/>
			</Field.Field>
			<Field.Field>
				<Field.Label for="confirm-password">Confirm new password</Field.Label>
				<Input
					id="confirm-password"
					type="password"
					autocomplete="new-password"
					required
					bind:value={confirm}
				/>
			</Field.Field>
			{#if errorMessage}
				<Field.Error>{errorMessage}</Field.Error>
			{/if}
			<div>
				<Button type="submit" size="sm" disabled={pending}>Change password</Button>
			</div>
		</Field.Group>
	</form>
</section>
