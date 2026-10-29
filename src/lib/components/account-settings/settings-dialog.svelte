<script lang="ts">
	import MonitorSmartphoneIcon from '@lucide/svelte/icons/monitor-smartphone';
	import PaletteIcon from '@lucide/svelte/icons/palette';
	import ShieldIcon from '@lucide/svelte/icons/shield';
	import UserRoundIcon from '@lucide/svelte/icons/user-round';
	import XIcon from '@lucide/svelte/icons/x';
	import { onMount } from 'svelte';
	import { parseSettingsHash, settingsHash, type SettingsSection } from '#lib/account-settings.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import * as Dialog from '#lib/components/ui/dialog/index.js';
	import { ScrollArea } from '#lib/components/ui/scroll-area/index.js';
	import Appearance from './sections/appearance.svelte';
	import Profile from './sections/profile.svelte';
	import Security from './sections/security.svelte';
	import Sessions from './sections/sessions.svelte';
	import type { SettingsUser } from './types';

	let {
		user,
		currentSessionId,
		canVerify
	}: { user: SettingsUser; currentSessionId: string; canVerify: boolean } = $props();

	const sections: Record<
		SettingsSection,
		{ label: string; description: string; icon: typeof UserRoundIcon }
	> = {
		profile: { label: 'Profile', description: 'Your name and email address.', icon: UserRoundIcon },
		security: { label: 'Security', description: 'Your password.', icon: ShieldIcon },
		sessions: {
			label: 'Sessions',
			description: 'Devices that are signed in to your account.',
			icon: MonitorSmartphoneIcon
		},
		appearance: { label: 'Appearance', description: 'How EazyID looks for you.', icon: PaletteIcon }
	};

	// The server never sees the hash, so it is read after mount to avoid a hydration mismatch
	let hash = $state('');
	const section = $derived(parseSettingsHash(hash));

	function syncHash() {
		hash = window.location.hash;
	}

	onMount(() => {
		syncHash();
		window.addEventListener('hashchange', syncHash);
		return () => window.removeEventListener('hashchange', syncHash);
	});

	// replaceState so switching sections or closing does not pile up history entries
	function setHash(next: string) {
		hash = next;
		history.replaceState(history.state, '', location.pathname + location.search + next);
	}

	const select = (next: SettingsSection) => setHash(settingsHash(next));
	const close = () => setHash('');
</script>

<Dialog.Root open={section !== null} onOpenChange={(open) => !open && close()}>
	<Dialog.Content
		showCloseButton={false}
		class="block h-[min(36rem,calc(100dvh-3rem))] gap-0 overflow-hidden p-0 sm:max-w-3xl"
	>
		<div class="flex h-full min-h-0 flex-col sm:flex-row">
			<div
				class="flex shrink-0 flex-col gap-2 border-b bg-muted/40 p-2 sm:w-52 sm:gap-3 sm:border-e sm:border-b-0 sm:p-3"
			>
				<p
					class="hidden px-2 pt-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase sm:block"
				>
					Settings
				</p>
				<nav class="flex gap-1 overflow-x-auto sm:flex-col">
					{#each Object.entries(sections) as [id, item] (id)}
						<Button
							variant={section === id ? 'secondary' : 'ghost'}
							size="sm"
							class="shrink-0 justify-start sm:w-full"
							aria-current={section === id ? 'page' : undefined}
							onclick={() => select(id as SettingsSection)}
						>
							<item.icon data-icon="inline-start" />
							{item.label}
						</Button>
					{/each}
				</nav>
			</div>

			<div class="flex min-w-0 flex-1 flex-col">
				<div class="flex shrink-0 items-start justify-between gap-4 border-b px-5 py-4 sm:px-6">
					<div class="flex min-w-0 flex-col gap-0.5">
						<Dialog.Title class="text-base">{sections[section ?? 'profile'].label}</Dialog.Title>
						<Dialog.Description class="text-xs">
							{sections[section ?? 'profile'].description}
						</Dialog.Description>
					</div>
					<Button
						variant="ghost"
						size="icon-sm"
						class="-me-1 text-muted-foreground"
						onclick={close}
					>
						<XIcon />
						<span class="sr-only">Close</span>
					</Button>
				</div>

				<ScrollArea class="min-h-0 flex-1">
					<div class="flex flex-col gap-6 px-5 py-5 sm:px-6">
						{#if section === 'profile'}
							<Profile {user} {canVerify} />
						{:else if section === 'security'}
							<Security />
						{:else if section === 'sessions'}
							<Sessions {currentSessionId} />
						{:else if section === 'appearance'}
							<Appearance />
						{/if}
					</div>
				</ScrollArea>
			</div>
		</div>
	</Dialog.Content>
</Dialog.Root>
