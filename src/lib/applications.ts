export const applicationTypes = ['confidential', 'public'] as const;

export type ApplicationType = (typeof applicationTypes)[number];

export interface ApplicationFormValues {
	name: string;
	type: ApplicationType;
	redirectUris: string[];
	skipConsent: boolean;
	disabled: boolean;
}
