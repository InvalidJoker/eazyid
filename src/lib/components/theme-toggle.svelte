<script lang="ts">
	import CheckIcon from '@lucide/svelte/icons/check';
	import MonitorIcon from '@lucide/svelte/icons/monitor';
	import MoonIcon from '@lucide/svelte/icons/moon';
	import SunIcon from '@lucide/svelte/icons/sun';
	import { resetMode, setMode, userPrefersMode } from 'mode-watcher';
	import {
		buttonVariants,
		type ButtonSize,
		type ButtonVariant
	} from '#lib/components/ui/button/index.js';
	import * as DropdownMenu from '#lib/components/ui/dropdown-menu/index.js';

	let { variant = 'outline', size = 'icon' }: { variant?: ButtonVariant; size?: ButtonSize } =
		$props();

	const options = [
		{ mode: 'system', label: 'System', icon: MonitorIcon, select: () => resetMode() },
		{ mode: 'light', label: 'Light', icon: SunIcon, select: () => setMode('light') },
		{ mode: 'dark', label: 'Dark', icon: MoonIcon, select: () => setMode('dark') }
	] as const;
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger class={buttonVariants({ variant, size })}>
		<SunIcon class="size-4 scale-100 rotate-0 transition-all! dark:scale-0 dark:-rotate-90" />
		<MoonIcon
			class="absolute size-4 scale-0 rotate-90 transition-all! dark:scale-100 dark:rotate-0"
		/>
		<span class="sr-only">Toggle theme</span>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="end">
		{#each options as option (option.mode)}
			<DropdownMenu.Item onclick={option.select}>
				<option.icon />
				{option.label}
				{#if userPrefersMode.current === option.mode}
					<CheckIcon class="ms-auto" />
				{/if}
			</DropdownMenu.Item>
		{/each}
	</DropdownMenu.Content>
</DropdownMenu.Root>
