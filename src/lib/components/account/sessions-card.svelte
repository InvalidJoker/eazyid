<script lang="ts">
	import MonitorSmartphoneIcon from '@lucide/svelte/icons/monitor-smartphone';
	import { toast } from 'svelte-sonner';
	import { invalidateAll } from '$app/navigation';
	import { authClient } from '#lib/auth-client.js';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import * as Card from '#lib/components/ui/card/index.js';

	interface SessionItem {
		id: string;
		token: string;
		userAgent?: string | null;
		ipAddress?: string | null;
		createdAt: Date;
	}

	let { sessions, currentSessionId }: { sessions: SessionItem[]; currentSessionId: string } =
		$props();

	const hasOthers = $derived(sessions.some((session) => session.id !== currentSessionId));

	async function revoke(token: string) {
		const { error } = await authClient.revokeSession({ token });
		if (error) toast.error(error.message ?? 'Could not sign out the session');
		await invalidateAll();
	}

	async function revokeOthers() {
		const { error } = await authClient.revokeOtherSessions();
		if (error) toast.error(error.message ?? 'Could not sign out other sessions');
		await invalidateAll();
	}
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Sessions</Card.Title>
		<Card.Description>Devices that are signed in to your account.</Card.Description>
		{#if hasOthers}
			<Card.Action>
				<Button variant="outline" size="sm" onclick={revokeOthers}>Sign out others</Button>
			</Card.Action>
		{/if}
	</Card.Header>
	<Card.Content>
		<ul class="divide-y">
			{#each sessions as session (session.id)}
				<li class="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
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
	</Card.Content>
</Card.Root>
