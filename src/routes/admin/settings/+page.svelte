<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { invalidateAll } from '$app/navigation';
	import PageHeader from '#lib/components/admin/page-header.svelte';
	import SettingRow from '#lib/components/admin/settings/setting-row.svelte';
	import { rpc } from '#lib/rpc.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	function errorMessage(error: unknown, fallback: string) {
		return error instanceof Error ? error.message : fallback;
	}

	async function save(key: string, value: unknown) {
		try {
			await rpc.settings.update({ [key]: value });
			toast.success('Setting saved');
		} catch (error) {
			toast.error(errorMessage(error, 'Could not save setting'));
		}
		await invalidateAll();
	}

</script>

<PageHeader
	title="Settings"
	description="Values set through environment variables are locked and shown read-only."
/>

{#each data.groups as group (group.id)}
	<section class="mt-8">
		<div class="mb-3 flex items-center justify-between">
			<h2 class="text-sm font-semibold">{group.label}</h2>
		</div>
		<div class="divide-y rounded-xl border bg-card">
			{#each group.settings as setting (setting.key)}
				<SettingRow {setting} onSave={(value) => save(setting.key, value)} />
			{/each}
		</div>
	</section>
{/each}
