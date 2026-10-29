<script lang="ts">
	import { loginLayoutDetails, loginLayouts, type LoginLayout } from '#lib/login-layouts.js';
	import { cn } from '#lib/utils.js';

	let {
		value = $bindable(),
		image = '',
		disabled = false
	}: { value: LoginLayout; image?: string; disabled?: boolean } = $props();
</script>

<div role="radiogroup" class="grid grid-cols-2 gap-3">
	{#each loginLayouts as layout (layout)}
		{@const selected = value === layout}
		<button
			type="button"
			role="radio"
			aria-checked={selected}
			{disabled}
			onclick={() => (value = layout)}
			class={cn(
				'flex flex-col gap-2 rounded-xl border p-2 text-left transition-colors hover:bg-muted/50 disabled:pointer-events-none disabled:opacity-50',
				selected && 'border-primary ring-2 ring-primary/20'
			)}
		>
			<div class="flex aspect-[4/3] overflow-hidden rounded-md border bg-background">
				{#if layout === 'split'}
					<div class="relative w-2/5 overflow-hidden border-e bg-muted">
						{#if image}
							<img src={image} alt="" class="absolute inset-0 size-full object-cover" />
						{/if}
					</div>
					<div class="flex flex-1 items-center justify-center">
						<div class="h-2/5 w-3/5 rounded-sm border bg-card"></div>
					</div>
				{:else}
					<div class="relative flex flex-1 items-center justify-center">
						{#if image}
							<img src={image} alt="" class="absolute inset-0 size-full object-cover" />
							<div class="absolute inset-0 bg-background/70"></div>
						{/if}
						<div class="relative h-2/5 w-2/5 rounded-sm border bg-card"></div>
					</div>
				{/if}
			</div>
			<div class="px-1 pb-1">
				<div class="text-sm font-medium">{loginLayoutDetails[layout].label}</div>
				<div class="text-xs text-muted-foreground">{loginLayoutDetails[layout].description}</div>
			</div>
		</button>
	{/each}
</div>
