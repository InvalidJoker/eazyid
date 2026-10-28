<script lang="ts">
	import AppSidebar from '#lib/components/admin/app-sidebar.svelte';
	import ThemeToggle from '#lib/components/theme-toggle.svelte';
	import * as Sidebar from '#lib/components/ui/sidebar/index.js';
	import type { LayoutProps } from './$types';

	let { children, data }: LayoutProps = $props();
</script>

<Sidebar.Provider>
	<AppSidebar user={data.user} />

	<Sidebar.Inset class="min-w-0">
		<header class="flex h-14 shrink-0 items-center gap-2 border-b px-4">
			<Sidebar.Trigger class="-ms-1.5 text-muted-foreground hover:text-foreground" />
			<div class="ms-auto">
				<ThemeToggle variant="ghost" size="icon-sm" />
			</div>
		</header>

		<main class="mx-auto w-full max-w-5xl flex-1 p-6">
			{@render children()}
		</main>
	</Sidebar.Inset>
</Sidebar.Provider>
