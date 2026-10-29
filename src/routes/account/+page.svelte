<script lang="ts">
	import AccountShell from '#lib/components/account/account-shell.svelte';
	import EmailCard from '#lib/components/account/email-card.svelte';
	import PasswordCard from '#lib/components/account/password-card.svelte';
	import ProfileCard from '#lib/components/account/profile-card.svelte';
	import SessionsCard from '#lib/components/account/sessions-card.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Account</title>
</svelte:head>

<AccountShell isAdmin={data.user.isAdmin}>
	<div>
		<h1 class="text-xl font-semibold">Account</h1>
		<p class="mt-1 text-sm text-muted-foreground">Manage your profile, password and sessions.</p>
	</div>

	<ProfileCard name={data.user.name} />
	<EmailCard
		email={data.user.email}
		verified={data.user.emailVerified}
		canVerify={data.authOptions.emailVerification !== 'disabled'}
	/>
	<PasswordCard />
	<SessionsCard sessions={data.sessions} currentSessionId={data.currentSessionId} />
</AccountShell>
