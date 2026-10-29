<script lang="ts">
	import ShieldIcon from '@lucide/svelte/icons/shield';
	import { page } from '$app/state';
	import { cn } from '#lib/utils.js';

	let { class: className }: { class?: string } = $props();

	const logo = $derived(page.data.branding?.logo);
</script>

{#if logo}
	<img src={logo} alt="" class={cn('size-7 shrink-0 rounded-md object-contain', className)} />
{:else}
	<div
		class={cn(
			'flex size-7 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground',
			className
		)}
	>
		<ShieldIcon class="size-1/2" />
	</div>
{/if}
