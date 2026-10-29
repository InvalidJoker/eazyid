<script lang="ts">
	import ImageIcon from '@lucide/svelte/icons/image';
	import { toast } from 'svelte-sonner';
	import { invalidateAll } from '$app/navigation';
	import { Button } from '#lib/components/ui/button/index.js';
	import { rpc } from '#lib/rpc.js';
	import type { SettingKey } from '#lib/server/settings/definitions.js';

	let {
		settingKey,
		value,
		disabled = false
	}: { settingKey: SettingKey; value: string; disabled?: boolean } = $props();

	let input: HTMLInputElement | undefined = $state();
	let pending = $state(false);

	async function run(action: () => Promise<unknown>, done: string) {
		pending = true;
		try {
			await action();
			toast.success(done);
		} catch (error) {
			toast.error(error instanceof Error ? error.message : 'Something went wrong');
		} finally {
			pending = false;
		}
		await invalidateAll();
	}

	function upload(event: Event & { currentTarget: HTMLInputElement }) {
		const file = event.currentTarget.files?.[0];
		event.currentTarget.value = '';
		if (!file) return;

		run(() => rpc.settings.uploadImage({ key: settingKey, file }), 'Image uploaded');
	}

	const remove = () => run(() => rpc.settings.removeImage({ key: settingKey }), 'Image removed');
</script>

<div class="flex items-center gap-4">
	<div
		class="flex aspect-[4/3] w-40 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-muted"
	>
		{#if value}
			<img src={value} alt="" class="size-full object-cover" />
		{:else}
			<ImageIcon class="size-6 text-muted-foreground" />
		{/if}
	</div>
	<div class="flex flex-col gap-2">
		<input
			bind:this={input}
			type="file"
			accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
			class="hidden"
			onchange={upload}
		/>
		<Button
			variant="outline"
			size="sm"
			disabled={disabled || pending}
			onclick={() => input?.click()}
		>
			{value ? 'Replace image' : 'Upload image'}
		</Button>
		{#if value}
			<Button variant="ghost" size="sm" disabled={disabled || pending} onclick={remove}
				>Remove</Button
			>
		{/if}
		<p class="text-xs text-muted-foreground">PNG, JPEG, WebP, GIF or AVIF, up to 2 MB.</p>
	</div>
</div>
