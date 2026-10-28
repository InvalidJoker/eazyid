<script lang="ts">
	import { onMount } from 'svelte';
	import { rpc } from '#lib/rpc.js';
	import * as Card from '#lib/components/ui/card/index.js';

	let status = $state('checking...');

	onMount(async () => {
		try {
			const result = await rpc.system.health();
			status = `${result.status} (${result.time})`;
		} catch {
			status = 'unreachable';
		}
	});
</script>

<main class="flex min-h-screen items-center justify-center p-4">
	<Card.Root class="w-full max-w-sm">
		<Card.Header>
			<Card.Title>EazyID</Card.Title>
			<Card.Description>API status: {status}</Card.Description>
		</Card.Header>
	</Card.Root>
</main>
