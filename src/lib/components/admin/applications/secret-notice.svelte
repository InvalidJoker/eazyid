<script lang="ts">
	import TriangleAlertIcon from '@lucide/svelte/icons/triangle-alert';
	import CopyField from './copy-field.svelte';

	let { secret }: { secret: string } = $props();
</script>

<div class="flex flex-col gap-3 rounded-xl border border-amber-500/40 bg-amber-500/5 p-4">
	<div class="flex items-start gap-2 text-sm">
		<TriangleAlertIcon class="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" />
		<p>Copy the client secret now. It is shown only once and cannot be retrieved later.</p>
	</div>
	<CopyField label="Client secret" value={secret} />
</div>
