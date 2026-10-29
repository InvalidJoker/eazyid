<script lang="ts">
	import './layout.css';
	import { ModeWatcher } from 'mode-watcher';
	import favicon from '#lib/assets/favicon.svg';
	import SettingsDialog from '#lib/components/account-settings/settings-dialog.svelte';
	import { Toaster } from '#lib/components/ui/sonner/index.js';
	import type { LayoutProps } from './$types';

	let { children, data }: LayoutProps = $props();

	const icon = $derived(data.branding.logo || favicon);
</script>

<svelte:head>
	<link rel="icon" href={icon} />
	<link rel="apple-touch-icon" href={icon} />
</svelte:head>

<ModeWatcher />
<Toaster richColors position="bottom-right" />

{@render children()}

{#if data.viewer}
	<SettingsDialog
		user={data.viewer.user}
		currentSessionId={data.viewer.sessionId}
		canVerify={data.authOptions.emailVerification !== 'disabled'}
	/>
{/if}
