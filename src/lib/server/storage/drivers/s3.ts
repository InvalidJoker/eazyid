import {
	DeleteObjectCommand,
	GetObjectCommand,
	NoSuchKey,
	PutObjectCommand,
	S3Client
} from '@aws-sdk/client-s3';
import type { StorageConfig } from '../config';
import type { StorageDriver } from './driver';

export function createS3Driver(config: Extract<StorageConfig, { driver: 's3' }>): StorageDriver {
	const client = new S3Client({
		region: config.region,
		endpoint: config.endpoint || undefined,
		forcePathStyle: config.forcePathStyle,
		credentials: { accessKeyId: config.accessKeyId, secretAccessKey: config.secretAccessKey }
	});
	const Bucket = config.bucket;

	return {
		async put(key, body, contentType) {
			await client.send(
				new PutObjectCommand({ Bucket, Key: key, Body: body, ContentType: contentType })
			);
		},

		async get(key) {
			try {
				const object = await client.send(new GetObjectCommand({ Bucket, Key: key }));
				return object.Body ? new Uint8Array(await object.Body.transformToByteArray()) : null;
			} catch (error) {
				if (error instanceof NoSuchKey) return null;
				throw error;
			}
		},

		async delete(key) {
			await client.send(new DeleteObjectCommand({ Bucket, Key: key }));
		}
	};
}
