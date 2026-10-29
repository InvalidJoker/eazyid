<script lang="ts">
	import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
	import LogOutIcon from '@lucide/svelte/icons/log-out';
	import SettingsIcon from '@lucide/svelte/icons/settings';
	import ShieldIcon from '@lucide/svelte/icons/shield';
	import { goto } from '$app/navigation';
	import { settingsHash } from '#lib/account-settings.js';
	import { authClient } from '#lib/auth-client.js';
	import * as Avatar from '#lib/components/ui/avatar/index.js';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import * as DropdownMenu from '#lib/components/ui/dropdown-menu/index.js';
	import type { SettingsUser } from './types';

	let { user }: { user: SettingsUser } = $props();

	const initials = $derived(user.name.slice(0, 2).toUpperCase());

	async function signOut() {
		await authClient.signOut();
		await goto('/login', { invalidateAll: true });
	}
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger
		class="flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-accent"
	>
		<Avatar.Root class="size-8">
			<Avatar.Fallback class="text-xs font-semibold">{initials}</Avatar.Fallback>
		</Avatar.Root>
		<span class="hidden text-sm font-medium sm:inline">{user.name}</span>
		{#if user.isAdmin}
			<Badge variant="secondary" class="hidden sm:inline-flex">Admin</Badge>
		{/if}
		<ChevronDownIcon class="size-3.5 text-muted-foreground" />
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="end" class="min-w-48">
		<DropdownMenu.Label class="flex flex-col gap-0.5 font-normal">
			<span class="font-semibold">{user.name}</span>
			<span class="truncate text-xs text-muted-foreground">{user.email}</span>
		</DropdownMenu.Label>
		<DropdownMenu.Separator />
		<DropdownMenu.Group>
			<DropdownMenu.Item onclick={() => (location.hash = settingsHash('profile'))}>
				<SettingsIcon />
				Settings
			</DropdownMenu.Item>
			{#if user.isAdmin}
				<DropdownMenu.Item onclick={() => goto('/admin')}>
					<ShieldIcon />
					Admin
				</DropdownMenu.Item>
			{/if}
		</DropdownMenu.Group>
		<DropdownMenu.Separator />
		<DropdownMenu.Item variant="destructive" onclick={signOut}>
			<LogOutIcon />
			Sign out
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
