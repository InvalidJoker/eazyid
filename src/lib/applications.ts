export const applicationTypes = ['confidential', 'public'] as const;

export type ApplicationType = (typeof applicationTypes)[number];

export interface ApplicationFormValues {
	name: string;
	type: ApplicationType;
	description: string;
	launchUrl: string;
	redirectUris: string[];
	skipConsent: boolean;
	showOnDashboard: boolean;
	disabled: boolean;
}
