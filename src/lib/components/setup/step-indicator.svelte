<script lang="ts">
	import { cn } from '#lib/utils.js';

	let { steps, current }: { steps: { id: string; label: string }[]; current: string } = $props();

	const currentIndex = $derived(steps.findIndex((step) => step.id === current));
</script>

<ol class="mb-6 flex items-center gap-2">
	{#each steps as step, index (step.id)}
		<li class="flex flex-1 flex-col gap-1.5">
			<div
				class={cn(
					'h-1 rounded-full bg-muted transition-colors',
					index <= currentIndex && 'bg-primary'
				)}
			></div>
			<span
				class={cn(
					'text-xs text-muted-foreground',
					index === currentIndex && 'font-medium text-foreground'
				)}
			>
				{step.label}
			</span>
		</li>
	{/each}
</ol>
