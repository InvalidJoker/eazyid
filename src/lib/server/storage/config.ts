import type { SettingValues } from '#lib/server/settings/definitions.js';

export type StorageConfig =
	| { driver: 'database' }
	| { driver: 'local'; path: string }
	| {
			driver: 's3';
			bucket: string;
			region: string;
			endpoint: string;
			accessKeyId: string;
			secretAccessKey: string;
			forcePathStyle: boolean;
	  };

export type StorageDriverName = StorageConfig['driver'];

/** Config for one driver, or `null` when that driver is missing required values. */
export function getStorageConfig(
	settings: SettingValues,
	driver: StorageDriverName = settings['storage.driver']
): StorageConfig | null {
	switch (driver) {
		case 'database':
			return { driver };
		case 'local':
			return settings['storage.local.path']
				? { driver, path: settings['storage.local.path'] }
				: null;
		case 's3': {
			const config = {
				driver,
				bucket: settings['storage.s3.bucket'],
				region: settings['storage.s3.region'],
				endpoint: settings['storage.s3.endpoint'],
				accessKeyId: settings['storage.s3.accessKeyId'],
				secretAccessKey: settings['storage.s3.secretAccessKey'],
				forcePathStyle: settings['storage.s3.forcePathStyle']
			};
			return config.bucket && config.accessKeyId && config.secretAccessKey ? config : null;
		}
	}
}
