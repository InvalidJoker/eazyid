<script lang="ts">
	import ShieldIcon from '@lucide/svelte/icons/shield';
	import { cn } from '#lib/utils.js';

	let { class: className }: { class?: string } = $props();
</script>

<div
	class={cn(
		'flex size-7 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground',
		className
	)}
>
	<ShieldIcon class="size-1/2" />
</div>
