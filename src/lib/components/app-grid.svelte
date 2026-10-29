<script lang="ts">
	import AppWindowIcon from '@lucide/svelte/icons/app-window';

	interface DashboardApp {
		clientId: string;
		name: string;
		description: string;
		launchUrl: string;
		logo: string;
	}

	let { apps }: { apps: DashboardApp[] } = $props();
</script>

{#if apps.length === 0}
	<div class="rounded-xl border border-dashed p-10 text-center">
		<AppWindowIcon class="mx-auto size-8 text-muted-foreground" />
		<p class="mt-3 text-sm font-medium">No apps yet</p>
		<p class="mt-1 text-sm text-muted-foreground">Apps you can open will show up here.</p>
	</div>
{:else}
	<ul class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
		{#each apps as app (app.clientId)}
			<li>
				<a
					href={app.launchUrl}
					class="flex h-full items-start gap-3 rounded-xl border bg-card p-4 transition-colors hover:bg-muted/50"
				>
					<div
						class="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-muted"
					>
						{#if app.logo}
							<img src={app.logo} alt="" class="size-full object-contain p-1" />
						{:else}
							<span class="text-sm font-semibold text-muted-foreground">
								{app.name.charAt(0).toUpperCase()}
							</span>
						{/if}
					</div>
					<div class="min-w-0">
						<p class="truncate text-sm font-medium">{app.name}</p>
						{#if app.description}
							<p class="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{app.description}</p>
						{/if}
					</div>
				</a>
			</li>
		{/each}
	</ul>
{/if}
