<script lang="ts">
	import PlusIcon from '@lucide/svelte/icons/plus';
	import PageHeader from '#lib/components/admin/page-header.svelte';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import * as Table from '#lib/components/ui/table/index.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Applications</title>
</svelte:head>

<PageHeader title="Applications" description="Apps that sign users in with OpenID Connect.">
	{#snippet actions()}
		<Button href="/admin/applications/new" size="sm">
			<PlusIcon data-icon="inline-start" />
			New application
		</Button>
	{/snippet}
</PageHeader>

<div class="mt-6 rounded-xl border bg-card">
	<Table.Root>
		<Table.Header>
			<Table.Row>
				<Table.Head>Application</Table.Head>
				<Table.Head>Type</Table.Head>
				<Table.Head>Status</Table.Head>
				<Table.Head>Created</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each data.applications as application (application.clientId)}
				<Table.Row class="cursor-pointer">
					<Table.Cell>
						<a href="/admin/applications/{application.clientId}" class="block">
							<div class="font-medium">{application.name}</div>
							<code class="text-xs text-muted-foreground">{application.clientId}</code>
						</a>
					</Table.Cell>
					<Table.Cell class="capitalize">{application.type}</Table.Cell>
					<Table.Cell>
						<div class="flex flex-wrap gap-1.5">
							<Badge variant={application.disabled ? 'outline' : 'secondary'}>
								{application.disabled ? 'Disabled' : 'Enabled'}
							</Badge>
							{#if application.skipConsent}
								<Badge variant="outline">Skips consent</Badge>
							{/if}
							{#if !application.ownedByInstance}
								<Badge variant="outline">User registered</Badge>
							{/if}
						</div>
					</Table.Cell>
					<Table.Cell class="text-sm text-muted-foreground">
						{application.createdAt ? new Date(application.createdAt).toLocaleDateString() : '-'}
					</Table.Cell>
				</Table.Row>
			{:else}
				<Table.Row>
					<Table.Cell colspan={4} class="py-8 text-center text-sm text-muted-foreground">
						No applications yet.
					</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</div>
