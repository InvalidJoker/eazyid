<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { invalidateAll } from '$app/navigation';
	import { authClient } from '#lib/auth-client.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import * as Card from '#lib/components/ui/card/index.js';
	import * as Field from '#lib/components/ui/field/index.js';
	import { Input } from '#lib/components/ui/input/index.js';

	let { name: initialName }: { name: string } = $props();

	let name = $state('');
	let pending = $state(false);

	$effect.pre(() => {
		name = initialName;
	});

	async function save(event: SubmitEvent) {
		event.preventDefault();
		pending = true;
		const { error } = await authClient.updateUser({ name });
		pending = false;

		if (error) {
			toast.error(error.message ?? 'Could not update your profile');
			return;
		}
		toast.success('Profile updated');
		await invalidateAll();
	}
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Profile</Card.Title>
		<Card.Description>How you appear to apps you sign in to.</Card.Description>
	</Card.Header>
	<Card.Content>
		<form onsubmit={save} class="flex items-end gap-3">
			<Field.Field class="flex-1">
				<Field.Label for="name">Name</Field.Label>
				<Input id="name" required bind:value={name} />
			</Field.Field>
			<Button type="submit" disabled={pending || name === initialName}>Save</Button>
		</form>
	</Card.Content>
</Card.Root>
