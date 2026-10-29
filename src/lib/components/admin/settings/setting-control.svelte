<script lang="ts">
	import ImageField from '#lib/components/image-field.svelte';
	import LoginLayoutPicker from '#lib/components/login-layout-picker.svelte';
	import { Input } from '#lib/components/ui/input/index.js';
	import * as Select from '#lib/components/ui/select/index.js';
	import { Switch } from '#lib/components/ui/switch/index.js';
	import type { LoginLayout } from '#lib/login-layouts.js';
	import { rpc } from '#lib/rpc.js';
	import type { AdminSetting } from '#lib/server/settings/admin-view.js';
	import UnsafeBadge from './unsafe-badge.svelte';

	let {
		setting,
		groupValues,
		onSave
	}: {
		setting: AdminSetting;
		/** Values of the other settings in the group, for controls that preview them. */
		groupValues: Record<string, unknown>;
		onSave: (value: unknown) => void;
	} = $props();

	const locked = $derived(setting.source === 'env');
	const selected = $derived(setting.options?.find((option) => option.value === setting.value));
</script>

{#if setting.kind === 'login-layout'}
	<LoginLayoutPicker
		bind:value={() => setting.value as LoginLayout, (layout) => onSave(layout)}
		image={String(groupValues['auth.loginImage'] ?? '')}
		disabled={locked}
	/>
{:else if setting.kind === 'image' || setting.kind === 'logo'}
	<ImageField
		value={String(setting.value)}
		shape={setting.kind === 'logo' ? 'square' : 'wide'}
		disabled={locked}
		onUpload={(file) => rpc.settings.uploadImage({ key: setting.key, file })}
		onUseUrl={(url) => rpc.settings.setImageUrl({ key: setting.key, url })}
		onRemove={() => rpc.settings.removeImage({ key: setting.key })}
	/>
{:else if setting.kind === 'boolean'}
	<Switch
		checked={setting.value === true}
		disabled={locked}
		onCheckedChange={(checked) => onSave(checked)}
	/>
{:else if setting.kind === 'enum' && setting.options}
	<Select.Root
		type="single"
		value={String(setting.value)}
		disabled={locked}
		onValueChange={(value) => onSave(value)}
	>
		<Select.Trigger class="w-64">{selected?.label ?? setting.value}</Select.Trigger>
		<Select.Content>
			{#each setting.options as option (option.value)}
				<Select.Item value={option.value} label={option.label} disabled={option.unavailable}>
					<span>{option.label}</span>
					{#if option.unavailable}
						<span class="ms-auto text-xs text-muted-foreground">Needs email</span>
					{:else if option.unsafe}
						<span class="ms-auto"><UnsafeBadge /></span>
					{/if}
				</Select.Item>
			{/each}
		</Select.Content>
	</Select.Root>
{:else if setting.secret}
	<Input
		type="password"
		class="w-64"
		autocomplete="off"
		placeholder={setting.hasValue ? 'Saved, type to replace' : 'Not set'}
		disabled={locked}
		onchange={(event) => {
			onSave(event.currentTarget.value);
			event.currentTarget.value = '';
		}}
	/>
{:else}
	<Input
		type={setting.kind === 'number' ? 'number' : 'text'}
		class="w-64"
		value={String(setting.value)}
		disabled={locked}
		onchange={(event) =>
			onSave(
				setting.kind === 'number' ? Number(event.currentTarget.value) : event.currentTarget.value
			)}
	/>
{/if}
