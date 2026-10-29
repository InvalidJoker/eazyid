/** Stores raw bytes under a key. Metadata like the content type lives in the `file` table. */
export interface StorageDriver {
	put(key: string, body: Uint8Array, contentType: string): Promise<void>;
	get(key: string): Promise<Uint8Array<ArrayBuffer> | null>;
	delete(key: string): Promise<void>;
}
