<script lang="ts">
	import MonitorIcon from '@lucide/svelte/icons/monitor';
	import MoonIcon from '@lucide/svelte/icons/moon';
	import SunIcon from '@lucide/svelte/icons/sun';
	import { resetMode, setMode, userPrefersMode } from 'mode-watcher';
	import * as Tabs from '#lib/components/ui/tabs/index.js';

	function applyTheme(value: string) {
		if (value === 'light' || value === 'dark') setMode(value);
		else resetMode();
	}
</script>

<section class="flex flex-col gap-3">
	<div>
		<h3 class="text-sm font-medium">Theme</h3>
		<p class="text-xs text-muted-foreground">Follow your system or pick light or dark.</p>
	</div>
	<Tabs.Root value={userPrefersMode.current} onValueChange={applyTheme}>
		<Tabs.List class="grid w-full grid-cols-3">
			<Tabs.Trigger value="system"><MonitorIcon data-icon="inline-start" />System</Tabs.Trigger>
			<Tabs.Trigger value="light"><SunIcon data-icon="inline-start" />Light</Tabs.Trigger>
			<Tabs.Trigger value="dark"><MoonIcon data-icon="inline-start" />Dark</Tabs.Trigger>
		</Tabs.List>
	</Tabs.Root>
</section>
