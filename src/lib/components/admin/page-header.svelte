<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		title,
		description,
		actions
	}: {
		title: string;
		description?: string;
		actions?: Snippet;
	} = $props();
</script>

<div class="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-b pb-4">
	<div class="min-w-0">
		<h1 class="truncate text-xl leading-tight font-semibold">{title}</h1>
		{#if description}
			<p class="mt-1.5 max-w-2xl text-sm text-muted-foreground">{description}</p>
		{/if}
	</div>
	{#if actions}
		<div class="flex shrink-0 items-center gap-2">
			{@render actions()}
		</div>
	{/if}
</div>
