import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import type { StorageDriver } from './driver';

export function createLocalDriver(root: string): StorageDriver {
	const rootPath = resolve(root);
	const pathFor = (key: string) => resolve(rootPath, key);

	return {
		async put(key, body) {
			const path = pathFor(key);
			await mkdir(dirname(path), { recursive: true });
			await writeFile(path, body);
		},

		async get(key) {
			try {
				return new Uint8Array(await readFile(pathFor(key)));
			} catch (error) {
				if ((error as NodeJS.ErrnoException).code === 'ENOENT') return null;
				throw error;
			}
		},

		async delete(key) {
			await rm(pathFor(key), { force: true });
		}
	};
}
