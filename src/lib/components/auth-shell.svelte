<script lang="ts">
	import type { Snippet } from 'svelte';
	import { page } from '$app/state';
	import BrandMark from '#lib/components/brand-mark.svelte';
	import ThemeToggle from '#lib/components/theme-toggle.svelte';
	import { cn } from '#lib/utils.js';

	let {
		heading,
		subtitle,
		width = 'sm',
		children,
		footer
	}: {
		heading: string;
		subtitle?: string;
		width?: 'sm' | 'md';
		children: Snippet;
		footer?: Snippet;
	} = $props();

	const branding = $derived(page.data.branding);
	const split = $derived(branding?.loginLayout === 'split');
</script>

{#snippet column()}
	<div class={cn('relative w-full', width === 'md' ? 'max-w-md' : 'max-w-sm')}>
		<div class="mb-7 flex flex-col items-center text-center">
			<BrandMark class={cn('mb-4 size-11 rounded-xl', split && 'lg:hidden')} />
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
{/snippet}

<div class="fixed end-4 top-4 z-10">
	<ThemeToggle />
</div>

{#if split}
	<div class="flex min-h-svh flex-col lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
		<aside class="hidden flex-col justify-between border-e bg-muted/60 p-10 lg:flex xl:p-14">
			<div class="flex items-center gap-3">
				<BrandMark class="size-9 rounded-lg" />
				<span class="text-base font-semibold tracking-tight">{branding?.instanceName}</span>
			</div>
		</aside>

		<main class="flex flex-1 items-center justify-center p-4 sm:p-8">
			{@render column()}
		</main>
	</div>
{:else}
	<main
		class="relative flex min-h-svh items-center justify-center overflow-hidden bg-background p-4"
	>
		<div
			aria-hidden="true"
			class="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(60%_100%_at_50%_0%,var(--muted),transparent)] opacity-70"
		></div>
		{@render column()}
	</main>
{/if}
