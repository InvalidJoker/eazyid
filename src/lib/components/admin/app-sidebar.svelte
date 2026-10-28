<script lang="ts">
	import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';
	import HouseIcon from '@lucide/svelte/icons/house';
	import LogOutIcon from '@lucide/svelte/icons/log-out';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { authClient } from '#lib/auth-client.js';
	import BrandMark from '#lib/components/brand-mark.svelte';
	import * as Avatar from '#lib/components/ui/avatar/index.js';
	import * as DropdownMenu from '#lib/components/ui/dropdown-menu/index.js';
	import * as Sidebar from '#lib/components/ui/sidebar/index.js';
	import { adminNavigation } from './navigation';

	let { user }: { user: { name: string; email: string } } = $props();

	const initials = $derived(user.name.slice(0, 2).toUpperCase());

	function isActive(href: string, exact?: boolean) {
		const path = page.url.pathname;
		return exact ? path === href : path.startsWith(href);
	}

	async function signOut() {
		await authClient.signOut();
		await goto('/login', { invalidateAll: true });
	}
</script>

<Sidebar.Root collapsible="icon">
	<Sidebar.Header class="h-14 justify-center border-b px-3 py-0">
		<div class="flex items-center gap-2.5 overflow-hidden">
			<BrandMark />
			<span class="truncate text-sm font-semibold group-data-[collapsible=icon]:hidden">
				EazyID
			</span>
		</div>
	</Sidebar.Header>

	<Sidebar.Content class="gap-0 py-1">
		{#each adminNavigation as section, index (index)}
			<Sidebar.Group class="py-1">
				{#if section.label}
					<Sidebar.GroupLabel>{section.label}</Sidebar.GroupLabel>
				{/if}
				<Sidebar.GroupContent>
					<Sidebar.Menu class="gap-0.5">
						{#each section.items as item (item.href)}
							<Sidebar.MenuItem>
								<Sidebar.MenuButton
									isActive={isActive(item.href, item.exact)}
									tooltipContent={item.label}
									class="h-8 text-sidebar-foreground/70 hover:text-sidebar-foreground data-active:font-medium data-active:text-sidebar-foreground"
								>
									{#snippet child({ props })}
										<a href={item.href} {...props}>
											<item.icon />
											<span>{item.label}</span>
										</a>
									{/snippet}
								</Sidebar.MenuButton>
							</Sidebar.MenuItem>
						{/each}
					</Sidebar.Menu>
				</Sidebar.GroupContent>
			</Sidebar.Group>
		{/each}
	</Sidebar.Content>

	<Sidebar.Footer class="border-t p-2">
		<Sidebar.Menu>
			<Sidebar.MenuItem>
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						{#snippet child({ props })}
							<Sidebar.MenuButton {...props} size="lg" class="h-12 gap-2.5">
								<Avatar.Root class="size-7 rounded-md">
									<Avatar.Fallback class="rounded-md text-[0.625rem] font-semibold">
										{initials}
									</Avatar.Fallback>
								</Avatar.Root>
								<div class="flex min-w-0 flex-1 flex-col text-left leading-tight">
									<span class="truncate text-sm font-medium">{user.name}</span>
									<span class="truncate text-xs text-muted-foreground">{user.email}</span>
								</div>
								<ChevronsUpDownIcon class="ms-auto size-4 text-muted-foreground" />
							</Sidebar.MenuButton>
						{/snippet}
					</DropdownMenu.Trigger>
					<DropdownMenu.Content side="top" align="start" class="min-w-56">
						<DropdownMenu.Item onclick={() => goto('/')}>
							<HouseIcon />
							Home
						</DropdownMenu.Item>
						<DropdownMenu.Separator />
						<DropdownMenu.Item variant="destructive" onclick={signOut}>
							<LogOutIcon />
							Sign out
						</DropdownMenu.Item>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Footer>

	<Sidebar.Rail />
</Sidebar.Root>
