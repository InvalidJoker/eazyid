<script lang="ts">
	import ResendVerification from '#lib/components/auth/resend-verification.svelte';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import * as Card from '#lib/components/ui/card/index.js';

	let { email, verified, canVerify }: { email: string; verified: boolean; canVerify: boolean } =
		$props();
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Email</Card.Title>
		<Card.Description>Used to sign in and for account notifications.</Card.Description>
	</Card.Header>
	<Card.Content class="flex-row flex-wrap items-center">
		<div class="flex items-center gap-2">
			<span class="text-sm font-medium">{email}</span>
			{#if verified}
				<Badge variant="secondary">Verified</Badge>
			{:else}
				<Badge variant="outline">Not verified</Badge>
			{/if}
		</div>
		{#if !verified && canVerify}
			<ResendVerification {email} class="ms-auto" />
		{/if}
	</Card.Content>
</Card.Root>
