<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { goto, invalidateAll } from '$app/navigation';
	import ApplicationForm from '#lib/components/admin/applications/application-form.svelte';
	import CopyField from '#lib/components/admin/applications/copy-field.svelte';
	import SecretNotice from '#lib/components/admin/applications/secret-notice.svelte';
	import PageHeader from '#lib/components/admin/page-header.svelte';
	import ImageField from '#lib/components/image-field.svelte';
	import { Button } from '#lib/components/ui/button/index.js';
	import * as Card from '#lib/components/ui/card/index.js';
	import type { ApplicationFormValues } from '#lib/applications.js';
	import { rpc } from '#lib/rpc.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const application = $derived(data.application);
	let newSecret = $state<string | null>(null);

	function message(error: unknown, fallback: string) {
		return error instanceof Error ? error.message : fallback;
	}

	async function save(values: ApplicationFormValues) {
		try {
			const { type: _type, ...details } = values;
			await rpc.applications.update({ clientId: application.clientId, ...details });
			toast.success('Application saved');
			await invalidateAll();
			return null;
		} catch (error) {
			return message(error, 'Could not save the application');
		}
	}

	async function rotateSecret() {
		if (!confirm('Rotate the secret? The current one stops working right away.')) return;
		try {
			({ clientSecret: newSecret } = await rpc.applications.rotateSecret({
				clientId: application.clientId
			}));
		} catch (error) {
			toast.error(message(error, 'Could not rotate the secret'));
		}
	}

	async function remove() {
		if (!confirm(`Delete ${application.name}? Signed-in users of this app lose access.`)) return;
		try {
			await rpc.applications.remove({ clientId: application.clientId });
			toast.success('Application deleted');
			await goto('/admin/applications');
		} catch (error) {
			toast.error(message(error, 'Could not delete the application'));
		}
	}
</script>

<svelte:head>
	<title>{application.name}</title>
</svelte:head>

<PageHeader title={application.name} description="{application.type} application" />

<div class="mt-6 flex max-w-2xl flex-col gap-6">
	<Card.Root>
		<Card.Header>
			<Card.Title>Credentials</Card.Title>
			<Card.Description>Configure your app with these values.</Card.Description>
		</Card.Header>
		<Card.Content class="flex flex-col gap-4">
			<CopyField label="Client ID" value={application.clientId} />
			<CopyField label="Issuer" value={data.issuer} />
			<CopyField label="Discovery URL" value={data.discoveryUrl} />
			{#if newSecret}
				<SecretNotice secret={newSecret} />
			{/if}
		</Card.Content>
		{#if application.type === 'confidential' && application.ownedByInstance}
			<Card.Footer>
				<Button variant="outline" size="sm" onclick={rotateSecret}>Rotate client secret</Button>
			</Card.Footer>
		{/if}
	</Card.Root>

	<Card.Root>
		<Card.Header>
			<Card.Title>Logo</Card.Title>
			<Card.Description>Shown on the consent screen and the dashboard.</Card.Description>
		</Card.Header>
		<Card.Content>
			<ImageField
				value={application.logo}
				shape="square"
				onUpload={(file) => rpc.applications.uploadLogo({ clientId: application.clientId, file })}
				onUseUrl={(url) => rpc.applications.setLogoUrl({ clientId: application.clientId, url })}
				onRemove={() => rpc.applications.removeLogo({ clientId: application.clientId })}
			/>
		</Card.Content>
	</Card.Root>

	<Card.Root>
		<Card.Header>
			<Card.Title>Settings</Card.Title>
		</Card.Header>
		<Card.Content>
			<ApplicationForm
				mode="edit"
				initial={application}
				submitLabel="Save changes"
				onSubmit={save}
			/>
		</Card.Content>
	</Card.Root>

	<Card.Root class="border-destructive/40">
		<Card.Header>
			<Card.Title>Delete application</Card.Title>
			<Card.Description
				>Revokes all its tokens and consents. This cannot be undone.</Card.Description
			>
		</Card.Header>
		<Card.Footer>
			<Button variant="destructive" size="sm" onclick={remove}>Delete application</Button>
		</Card.Footer>
	</Card.Root>
</div>
