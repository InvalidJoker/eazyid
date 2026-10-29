<script lang="ts">
	import { Badge } from '#lib/components/ui/badge/index.js';
	import type { AdminSetting } from '#lib/server/settings/admin-view.js';
	import SettingControl from './setting-control.svelte';
	import UnsafeBadge from './unsafe-badge.svelte';
	import { cn } from '#lib/utils.js';

	let {
		setting,
		groupValues,
		onSave
	}: {
		setting: AdminSetting;
		groupValues: Record<string, unknown>;
		onSave: (value: unknown) => void;
	} = $props();

	const stacked = $derived(setting.kind === 'login-layout' || setting.kind === 'image');
</script>

<div class={cn('flex gap-4 p-4', stacked ? 'flex-col' : 'flex-wrap items-center justify-between')}>
	<div class="min-w-0 flex-1">
		<div class="flex flex-wrap items-center gap-2">
			<span class="text-sm font-medium">{setting.label}</span>
			{#if setting.unsafe}
				<UnsafeBadge />
			{/if}
			{#if setting.source === 'env'}
				<Badge variant="secondary">Set by {setting.envName}</Badge>
			{/if}
		</div>
		<p class="mt-1 text-sm text-muted-foreground">{setting.description}</p>
		<code class="mt-1 block text-xs text-muted-foreground/70">{setting.envName}</code>
	</div>

	<div class={cn(stacked && 'max-w-md')}>
		<SettingControl {setting} {groupValues} {onSave} />
	</div>
</div>
