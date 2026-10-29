<script lang="ts">
	import MailCheckIcon from '@lucide/svelte/icons/mail-check';
	import ResendVerification from './resend-verification.svelte';

	let { email }: { email: string } = $props();
</script>

<div class="flex flex-col items-center gap-4 text-center">
	<MailCheckIcon class="size-10 text-primary" />
	<div>
		<p class="font-medium">Check your inbox</p>
		<p class="mt-1 text-sm text-muted-foreground">
			We sent a verification link to <span class="font-medium text-foreground">{email}</span>. Open
			it to finish signing in.
		</p>
	</div>
	<ResendVerification {email} class="w-full" />
</div>
