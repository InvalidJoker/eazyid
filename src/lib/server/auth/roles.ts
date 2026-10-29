type RoleHolder = { role?: string | null } | Record<string, unknown> | null | undefined;

export function isAdmin(user: RoleHolder) {
	const role = user?.role;
	// The admin plugin stores multiple roles as a comma separated string
	return typeof role === 'string' && role.split(',').includes('admin');
}
