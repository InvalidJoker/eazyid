<script lang="ts">
	import CircleCheckIcon from '@lucide/svelte/icons/circle-check';
	import { Button } from '#lib/components/ui/button/index.js';
</script>

<div class="flex flex-col items-center gap-4 text-center">
	<CircleCheckIcon class="size-10 text-primary" />
	<div>
		<p class="font-medium">Your instance is ready</p>
		<p class="mt-1 text-sm text-muted-foreground">
			You can change everything later in the admin settings.
		</p>
	</div>
	<Button href="/admin" class="w-full">Open admin</Button>
</div>
