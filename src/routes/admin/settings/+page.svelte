<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { invalidateAll } from '$app/navigation';
	import PageHeader from '#lib/components/admin/page-header.svelte';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import { Input } from '#lib/components/ui/input/index.js';
	import { Switch } from '#lib/components/ui/switch/index.js';
	import { rpc } from '#lib/rpc.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	async function save(key: string, value: unknown) {
		try {
			await rpc.settings.update({ [key]: value });
			toast.success('Setting saved');
		} catch (error) {
			toast.error(error instanceof Error ? error.message : 'Could not save setting');
		}
		await invalidateAll();
	}
</script>

<PageHeader
	title="Settings"
	description="Values set through environment variables are locked and shown read-only."
/>

<div class="mt-6 divide-y rounded-xl border bg-card">
	{#each data.settings as setting (setting.key)}
		{@const locked = setting.source === 'env'}
		<div class="flex flex-wrap items-center justify-between gap-4 p-4">
			<div class="min-w-0">
				<div class="flex items-center gap-2">
					<code class="text-sm font-medium">{setting.key}</code>
					{#if locked}
						<Badge variant="secondary">Set by {setting.envName}</Badge>
					{/if}
				</div>
				<p class="mt-1 text-sm text-muted-foreground">{setting.description}</p>
			</div>

			{#if typeof setting.value === 'boolean'}
				<Switch
					checked={setting.value}
					disabled={locked}
					onCheckedChange={(checked) => save(setting.key, checked)}
				/>
			{:else}
				<Input
					class="w-64"
					value={String(setting.value)}
					disabled={locked}
					onchange={(event) => save(setting.key, event.currentTarget.value)}
				/>
			{/if}
		</div>
	{/each}
</div>
