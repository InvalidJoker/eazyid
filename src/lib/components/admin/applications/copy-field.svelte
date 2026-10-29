<script lang="ts">
	import CheckIcon from '@lucide/svelte/icons/check';
	import CopyIcon from '@lucide/svelte/icons/copy';
	import { Button } from '#lib/components/ui/button/index.js';

	let { label, value }: { label: string; value: string } = $props();

	let copied = $state(false);

	async function copy() {
		await navigator.clipboard.writeText(value);
		copied = true;
		setTimeout(() => (copied = false), 1500);
	}
</script>

<div class="flex flex-col gap-1.5">
	<span class="text-xs font-medium text-muted-foreground">{label}</span>
	<div class="flex items-center gap-2 rounded-lg border bg-muted/40 py-1 ps-3 pe-1">
		<code class="min-w-0 flex-1 truncate text-sm">{value}</code>
		<Button variant="ghost" size="icon-sm" onclick={copy}>
			{#if copied}<CheckIcon />{:else}<CopyIcon />{/if}
			<span class="sr-only">Copy {label}</span>
		</Button>
	</div>
</div>
