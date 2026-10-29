<script lang="ts">
	import EllipsisIcon from '@lucide/svelte/icons/ellipsis';
	import { toast } from 'svelte-sonner';
	import { invalidateAll } from '$app/navigation';
	import { authClient } from '#lib/auth-client.js';
	import { buttonVariants } from '#lib/components/ui/button/index.js';
	import * as DropdownMenu from '#lib/components/ui/dropdown-menu/index.js';

	interface UserRow {
		id: string;
		email: string;
		isAdmin: boolean;
		banned: boolean;
	}

	let { user, isSelf }: { user: UserRow; isSelf: boolean } = $props();

	async function run(action: () => Promise<{ error: { message?: string } | null }>, done: string) {
		const { error } = await action();
		if (error) {
			toast.error(error.message ?? 'Action failed');
		} else {
			toast.success(done);
		}
		await invalidateAll();
	}

	const toggleAdmin = () =>
		run(
			() => authClient.admin.setRole({ userId: user.id, role: user.isAdmin ? 'user' : 'admin' }),
			user.isAdmin ? 'Admin role removed' : 'User is now an admin'
		);

	const toggleBan = () =>
		run(
			() =>
				user.banned
					? authClient.admin.unbanUser({ userId: user.id })
					: authClient.admin.banUser({ userId: user.id }),
			user.banned ? 'User unbanned' : 'User banned'
		);

	const revokeSessions = () =>
		run(() => authClient.admin.revokeUserSessions({ userId: user.id }), 'Sessions revoked');

	function remove() {
		if (!confirm(`Delete ${user.email}? This cannot be undone.`)) return;
		run(() => authClient.admin.removeUser({ userId: user.id }), 'User deleted');
	}
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger class={buttonVariants({ variant: 'ghost', size: 'icon-sm' })}>
		<EllipsisIcon />
		<span class="sr-only">Actions</span>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="end">
		<DropdownMenu.Item disabled={isSelf} onclick={toggleAdmin}>
			{user.isAdmin ? 'Remove admin role' : 'Make admin'}
		</DropdownMenu.Item>
		<DropdownMenu.Item onclick={revokeSessions}>Revoke sessions</DropdownMenu.Item>
		<DropdownMenu.Item disabled={isSelf} onclick={toggleBan}>
			{user.banned ? 'Unban' : 'Ban'}
		</DropdownMenu.Item>
		<DropdownMenu.Separator />
		<DropdownMenu.Item variant="destructive" disabled={isSelf} onclick={remove}>
			Delete
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
