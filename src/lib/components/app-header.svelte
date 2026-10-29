<script lang="ts">
	import { page } from '$app/state';
	import UserMenu from '#lib/components/account-settings/user-menu.svelte';
	import type { SettingsUser } from '#lib/components/account-settings/types.js';
	import BrandMark from '#lib/components/brand-mark.svelte';
	import ThemeToggle from '#lib/components/theme-toggle.svelte';

	let { user }: { user: SettingsUser } = $props();
</script>

<header class="sticky top-0 z-10 border-b bg-background">
	<div class="mx-auto flex h-14 max-w-5xl items-center justify-between gap-3 px-4 sm:px-6">
		<a href="/" class="flex items-center gap-2.5">
			<BrandMark />
			<span class="text-sm font-semibold tracking-tight">{page.data.branding?.instanceName}</span>
		</a>
		<div class="flex items-center gap-1.5">
			<ThemeToggle variant="ghost" size="icon-sm" />
			<UserMenu {user} />
		</div>
	</div>
</header>
