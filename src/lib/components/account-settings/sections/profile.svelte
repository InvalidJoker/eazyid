<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { invalidateAll } from '$app/navigation';
	import { authClient } from '#lib/auth-client.js';
	import ResendVerification from '#lib/components/auth/resend-verification.svelte';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import * as Field from '#lib/components/ui/field/index.js';
	import { Input } from '#lib/components/ui/input/index.js';
	import { Separator } from '#lib/components/ui/separator/index.js';
	import type { SettingsUser } from '../types';

	let { user, canVerify }: { user: SettingsUser; canVerify: boolean } = $props();

	let name = $state('');
	let pending = $state(false);

	$effect.pre(() => {
		name = user.name;
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

<form onsubmit={save}>
	<Field.Group>
		<Field.Field>
			<Field.Label for="settings-name">Name</Field.Label>
			<Input id="settings-name" required bind:value={name} />
			<Field.Description>How you appear to apps you sign in to.</Field.Description>
		</Field.Field>
		<div>
			<Button type="submit" size="sm" disabled={pending || name === user.name}>Save</Button>
		</div>
	</Field.Group>
</form>

<Separator />

<section class="flex flex-col gap-3">
	<div>
		<h3 class="text-sm font-medium">Email</h3>
		<p class="text-xs text-muted-foreground">Used to sign in and for account notifications.</p>
	</div>
	<div class="flex flex-wrap items-center gap-2">
		<span class="text-sm">{user.email}</span>
		{#if user.emailVerified}
			<Badge variant="secondary">Verified</Badge>
		{:else}
			<Badge variant="outline">Not verified</Badge>
		{/if}
		{#if !user.emailVerified && canVerify}
			<ResendVerification email={user.email} class="ms-auto" />
		{/if}
	</div>
</section>
