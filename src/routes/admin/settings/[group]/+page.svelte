<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { invalidateAll } from '$app/navigation';
	import PageHeader from '#lib/components/admin/page-header.svelte';
	import SettingRow from '#lib/components/admin/settings/setting-row.svelte';
	import { Button } from '#lib/components/ui/button/index.js';
	import { rpc } from '#lib/rpc.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const groupValues = $derived(
		Object.fromEntries(data.group.settings.map((setting) => [setting.key, setting.value]))
	);

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

	async function sendTestEmail() {
		try {
			const { sentTo } = await rpc.email.sendTest();
			toast.success(`Test email sent to ${sentTo}`);
		} catch (error) {
			toast.error(errorMessage(error, 'Could not send test email'));
		}
	}
</script>

<svelte:head>
	<title>{data.group.label} settings</title>
</svelte:head>

<PageHeader title={data.group.label} description={data.group.description}>
	{#snippet actions()}
		{#if data.group.id === 'email'}
			<Button variant="outline" size="sm" onclick={sendTestEmail}>Send test email</Button>
		{/if}
	{/snippet}
</PageHeader>

<p class="mt-4 text-sm text-muted-foreground">
	Values set through environment variables are locked and shown read-only.
</p>

<div class="mt-4 divide-y rounded-xl border bg-card">
	{#each data.group.settings as setting (setting.key)}
		<SettingRow {setting} {groupValues} onSave={(value) => save(setting.key, value)} />
	{/each}
</div>
