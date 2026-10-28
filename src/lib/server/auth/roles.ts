import type { AuthSession } from './index';

export function isAdmin(user: AuthSession['user'] | null) {
	// The admin plugin stores multiple roles as a comma separated string
	return user?.role?.split(',').includes('admin') ?? false;
}
