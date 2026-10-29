<script lang="ts">
	import PageHeader from '#lib/components/admin/page-header.svelte';
	import UserActions from '#lib/components/admin/users/user-actions.svelte';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import { Input } from '#lib/components/ui/input/index.js';
	import * as Table from '#lib/components/ui/table/index.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Users</title>
</svelte:head>

<PageHeader title="Users" description="{data.total} total">
	{#snippet actions()}
		<form method="GET">
			<Input
				name="q"
				type="search"
				placeholder="Search by email"
				value={data.search}
				class="w-64"
			/>
		</form>
	{/snippet}
</PageHeader>

<div class="mt-6 rounded-xl border bg-card">
	<Table.Root>
		<Table.Header>
			<Table.Row>
				<Table.Head>User</Table.Head>
				<Table.Head>Status</Table.Head>
				<Table.Head>Created</Table.Head>
				<Table.Head class="w-12"></Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each data.users as user (user.id)}
				<Table.Row>
					<Table.Cell>
						<div class="font-medium">{user.name}</div>
						<div class="text-xs text-muted-foreground">{user.email}</div>
					</Table.Cell>
					<Table.Cell>
						<div class="flex flex-wrap gap-1.5">
							{#if user.isAdmin}<Badge>Admin</Badge>{/if}
							{#if user.banned}<Badge variant="destructive">Banned</Badge>{/if}
							<Badge variant={user.emailVerified ? 'secondary' : 'outline'}>
								{user.emailVerified ? 'Verified' : 'Unverified'}
							</Badge>
						</div>
					</Table.Cell>
					<Table.Cell class="text-sm text-muted-foreground">
						{new Date(user.createdAt).toLocaleDateString()}
					</Table.Cell>
					<Table.Cell>
						<UserActions {user} isSelf={user.id === data.currentUserId} />
					</Table.Cell>
				</Table.Row>
			{:else}
				<Table.Row>
					<Table.Cell colspan={4} class="py-8 text-center text-sm text-muted-foreground">
						No users found.
					</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</div>
