<script lang="ts">
	import ImageIcon from '@lucide/svelte/icons/image';
	import { toast } from 'svelte-sonner';
	import { invalidateAll } from '$app/navigation';
	import { Button } from '#lib/components/ui/button/index.js';
	import { Input } from '#lib/components/ui/input/index.js';
	import { cn } from '#lib/utils.js';

	let {
		value,
		shape = 'wide',
		disabled = false,
		onUpload,
		onUseUrl,
		onRemove
	}: {
		value: string;
		shape?: 'wide' | 'square';
		disabled?: boolean;
		onUpload: (file: File) => Promise<unknown>;
		onUseUrl: (url: string) => Promise<unknown>;
		onRemove: () => Promise<unknown>;
	} = $props();

	let fileInput: HTMLInputElement | undefined = $state();
	let url = $state('');
	let pending = $state(false);

	$effect.pre(() => {
		url = value.startsWith('https://') ? value : '';
	});

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

		run(() => onUpload(file), 'Image uploaded');
	}

	function useUrl(event: SubmitEvent) {
		event.preventDefault();
		run(() => onUseUrl(url), 'Image URL saved');
	}

	const remove = () => run(onRemove, 'Image removed');
</script>

<div class="flex flex-col gap-4">
	<div class="flex items-center gap-4">
		<div
			class={cn(
				'flex shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-muted',
				shape === 'wide' ? 'aspect-[4/3] w-40' : 'size-24 p-3'
			)}
		>
			{#if value}
				<img
					src={value}
					alt=""
					class={cn('size-full', shape === 'wide' ? 'object-cover' : 'object-contain')}
				/>
			{:else}
				<ImageIcon class="size-6 text-muted-foreground" />
			{/if}
		</div>
		<div class="flex flex-col gap-2">
			<input
				bind:this={fileInput}
				type="file"
				accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
				class="hidden"
				onchange={upload}
			/>
			<Button
				variant="outline"
				size="sm"
				disabled={disabled || pending}
				onclick={() => fileInput?.click()}
			>
				{value ? 'Replace image' : 'Upload image'}
			</Button>
			{#if value}
				<Button variant="ghost" size="sm" disabled={disabled || pending} onclick={remove}>
					Remove
				</Button>
			{/if}
			<p class="text-xs text-muted-foreground">PNG, JPEG, WebP, GIF or AVIF, up to 2 MB.</p>
		</div>
	</div>

	<form onsubmit={useUrl} class="flex gap-2">
		<Input
			type="url"
			placeholder="Or use an image URL: https://..."
			pattern="https://.*"
			required
			disabled={disabled || pending}
			bind:value={url}
		/>
		<Button
			type="submit"
			variant="outline"
			size="sm"
			disabled={disabled || pending || url === value}
		>
			Use URL
		</Button>
	</form>
</div>
