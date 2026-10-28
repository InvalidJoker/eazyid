<script lang="ts">
	import { untrack } from 'svelte';
	import AuthShell from '#lib/components/auth-shell.svelte';
	import AccountStep from '#lib/components/setup/account-step.svelte';
	import DoneStep from '#lib/components/setup/done-step.svelte';
	import InstanceStep from '#lib/components/setup/instance-step.svelte';
	import StepIndicator from '#lib/components/setup/step-indicator.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const steps = [
		{ id: 'account', label: 'Admin account', subtitle: 'Create the first admin account.' },
		{ id: 'instance', label: 'Instance', subtitle: 'Name your instance and pick a login page.' },
		{ id: 'done', label: 'Done', subtitle: 'Everything is set up.' }
	];

	let current = $state(untrack(() => (data.required ? 'account' : 'instance')));
	const step = $derived(steps.find((s) => s.id === current)!);
</script>

<svelte:head>
	<title>Setup</title>
</svelte:head>

<AuthShell heading="Set up EazyID" subtitle={step.subtitle} width="md">
	<StepIndicator {steps} {current} />

	{#if current === 'account'}
		<AccountStep onDone={() => (current = 'instance')} />
	{:else if current === 'instance'}
		<InstanceStep onDone={() => (current = 'done')} />
	{:else}
		<DoneStep />
	{/if}
</AuthShell>
