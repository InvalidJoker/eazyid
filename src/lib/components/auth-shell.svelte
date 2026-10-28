<script lang="ts">
	import type { Snippet } from 'svelte';
	import BrandMark from '#lib/components/brand-mark.svelte';
	import ThemeToggle from '#lib/components/theme-toggle.svelte';

	let {
		heading,
		subtitle,
		children,
		footer
	}: {
		heading: string;
		subtitle?: string;
		children: Snippet;
		footer?: Snippet;
	} = $props();
</script>

<div class="fixed end-4 top-4 z-10">
	<ThemeToggle />
</div>

<main class="relative flex min-h-svh items-center justify-center overflow-hidden bg-background p-4">
	<div
		aria-hidden="true"
		class="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(60%_100%_at_50%_0%,var(--muted),transparent)] opacity-70"
	></div>

	<div class="relative w-full max-w-sm">
		<div class="mb-7 flex flex-col items-center text-center">
			<BrandMark class="mb-4 size-11 rounded-xl" />
			<h1 class="text-[1.375rem] font-semibold text-balance">{heading}</h1>
			{#if subtitle}
				<p class="mt-1.5 text-sm text-balance text-muted-foreground">{subtitle}</p>
			{/if}
		</div>

		<div class="rounded-2xl border bg-card p-6 shadow-sm sm:p-7">
			{@render children()}
		</div>

		{#if footer}
			<div class="mt-5 text-center text-sm text-muted-foreground">
				{@render footer()}
			</div>
		{/if}
	</div>
</main>
