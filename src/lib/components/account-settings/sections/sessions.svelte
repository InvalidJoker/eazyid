<script lang="ts">
	import MonitorSmartphoneIcon from '@lucide/svelte/icons/monitor-smartphone';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { authClient } from '#lib/auth-client.js';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import { Button } from '#lib/components/ui/button/index.js';

	interface SessionItem {
		id: string;
		token: string;
		userAgent?: string | null;
		ipAddress?: string | null;
		createdAt: Date;
	}

	let { currentSessionId }: { currentSessionId: string } = $props();

	let sessions = $state<SessionItem[]>([]);
	let loading = $state(true);

	const hasOthers = $derived(sessions.some((session) => session.id !== currentSessionId));

	async function load() {
		const { data, error } = await authClient.listSessions();
		if (error) toast.error(error.message ?? 'Could not load your sessions');
		sessions = data ?? [];
		loading = false;
	}

	async function revoke(token: string) {
		const { error } = await authClient.revokeSession({ token });
		if (error) toast.error(error.message ?? 'Could not sign out the session');
		await load();
	}

	async function revokeOthers() {
		const { error } = await authClient.revokeOtherSessions();
		if (error) toast.error(error.message ?? 'Could not sign out other sessions');
		await load();
	}

	onMount(load);
</script>

<section class="flex flex-col gap-3">
	<div class="flex items-start justify-between gap-4">
		<div>
			<h3 class="text-sm font-medium">Signed-in devices</h3>
			<p class="text-xs text-muted-foreground">Sign out devices you do not recognize.</p>
		</div>
		{#if hasOthers}
			<Button variant="outline" size="sm" onclick={revokeOthers}>Sign out others</Button>
		{/if}
	</div>

	{#if loading}
		<p class="text-sm text-muted-foreground">Loading sessions...</p>
	{:else}
		<ul class="divide-y rounded-lg border">
			{#each sessions as session (session.id)}
				<li class="flex items-center gap-3 p-3">
					<MonitorSmartphoneIcon class="size-5 shrink-0 text-muted-foreground" />
					<div class="min-w-0 flex-1">
						<p class="truncate text-sm">{session.userAgent || 'Unknown device'}</p>
						<p class="text-xs text-muted-foreground">
							{session.ipAddress || 'Unknown IP'} · since {new Date(
								session.createdAt
							).toLocaleString()}
						</p>
					</div>
					{#if session.id === currentSessionId}
						<Badge variant="secondary">This device</Badge>
					{:else}
						<Button variant="ghost" size="sm" onclick={() => revoke(session.token)}>
							Sign out
						</Button>
					{/if}
				</li>
			{/each}
		</ul>
	{/if}
</section>
