<script lang="ts">
	import ApplicationForm from '#lib/components/admin/applications/application-form.svelte';
	import CopyField from '#lib/components/admin/applications/copy-field.svelte';
	import SecretNotice from '#lib/components/admin/applications/secret-notice.svelte';
	import PageHeader from '#lib/components/admin/page-header.svelte';
	import { Button } from '#lib/components/ui/button/index.js';
	import type { ApplicationFormValues } from '#lib/applications.js';
	import { rpc } from '#lib/rpc.js';

	let created = $state<{ clientId: string; clientSecret: string | null } | null>(null);

	const initial: ApplicationFormValues = {
		name: '',
		type: 'confidential',
		description: '',
		launchUrl: '',
		redirectUris: [],
		skipConsent: false,
		showOnDashboard: false,
		disabled: false
	};

	async function create({ disabled: _disabled, ...details }: ApplicationFormValues) {
		try {
			created = await rpc.applications.create(details);
			return null;
		} catch (error) {
			return error instanceof Error ? error.message : 'Could not create the application';
		}
	}
</script>

<svelte:head>
	<title>New application</title>
</svelte:head>

<PageHeader title="New application" description="Register an app that signs users in here." />

<div class="mt-6 max-w-2xl rounded-xl border bg-card p-6">
	{#if created}
		<div class="flex flex-col gap-4">
			<p class="text-sm font-medium">Application created.</p>
			<CopyField label="Client ID" value={created.clientId} />
			{#if created.clientSecret}
				<SecretNotice secret={created.clientSecret} />
			{/if}
			<div>
				<Button href="/admin/applications/{created.clientId}">Go to application</Button>
			</div>
		</div>
	{:else}
		<ApplicationForm mode="create" {initial} submitLabel="Create application" onSubmit={create} />
	{/if}
</div>
