<script lang="ts">
	import { onDestroy } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { authClient } from '#lib/auth-client.js';
	import { Button, type ButtonVariant } from '#lib/components/ui/button/index.js';

	const cooldownSeconds = 30;

	let {
		email,
		variant = 'outline',
		class: className
	}: { email: string; variant?: ButtonVariant; class?: string } = $props();

	let remaining = $state(0);
	let pending = $state(false);
	let timer: ReturnType<typeof setInterval> | undefined;

	function startCooldown() {
		remaining = cooldownSeconds;
		timer = setInterval(() => {
			remaining -= 1;
			if (remaining <= 0) clearInterval(timer);
		}, 1000);
	}

	async function resend() {
		pending = true;
		const { error } = await authClient.sendVerificationEmail({
			email,
			callbackURL: '/verify-email'
		});
		pending = false;

		if (error) {
			toast.error(error.message ?? 'Could not send the email');
			return;
		}
		toast.success('Verification email sent');
		startCooldown();
	}

	onDestroy(() => clearInterval(timer));
</script>

<Button {variant} class={className} disabled={pending || remaining > 0} onclick={resend}>
	{remaining > 0 ? `Resend in ${remaining}s` : 'Resend verification email'}
</Button>
