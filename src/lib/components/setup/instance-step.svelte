<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/state';
	import LoginLayoutPicker from '#lib/components/login-layout-picker.svelte';
	import { Button } from '#lib/components/ui/button/index.js';
	import * as Field from '#lib/components/ui/field/index.js';
	import { Input } from '#lib/components/ui/input/index.js';
	import type { LoginLayout } from '#lib/login-layouts.js';
	import { rpc } from '#lib/rpc.js';

	let { onDone }: { onDone: () => void } = $props();

	let instanceName = $state<string>(page.data.branding?.instanceName ?? 'EazyID');
	let loginLayout = $state<LoginLayout>(page.data.branding?.loginLayout ?? 'centered');
	let errorMessage = $state('');
	let pending = $state(false);

	async function submit(event: SubmitEvent) {
		event.preventDefault();
		errorMessage = '';
		pending = true;

		try {
			await rpc.settings.update({
				'instance.name': instanceName,
				'auth.loginLayout': loginLayout
			});
			await invalidateAll();
			onDone();
		} catch (error) {
			errorMessage = error instanceof Error ? error.message : 'Could not save settings';
		} finally {
			pending = false;
		}
	}
</script>

<form onsubmit={submit}>
	<Field.Group>
		<Field.Field>
			<Field.Label for="instance-name">Instance name</Field.Label>
			<Input id="instance-name" required bind:value={instanceName} />
			<Field.Description>Shown on sign-in pages and in emails.</Field.Description>
		</Field.Field>
		<Field.Field>
			<Field.Label>Login page</Field.Label>
			<LoginLayoutPicker bind:value={loginLayout} />
		</Field.Field>
		{#if errorMessage}
			<Field.Error>{errorMessage}</Field.Error>
		{/if}
		<div class="flex gap-2">
			<Button type="button" variant="outline" class="flex-1" onclick={onDone}>Skip</Button>
			<Button type="submit" class="flex-1" disabled={pending}>Continue</Button>
		</div>
	</Field.Group>
</form>
