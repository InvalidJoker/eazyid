export const assetUrlPrefix = '/assets/';

export function isAssetOrHttpsUrl(value: string) {
	return value === '' || value.startsWith(assetUrlPrefix) || value.startsWith('https://');
}
