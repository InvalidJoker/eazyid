export const loginLayouts = ['centered', 'split'] as const;

export type LoginLayout = (typeof loginLayouts)[number];

export const loginLayoutDetails: Record<LoginLayout, { label: string; description: string }> = {
	centered: {
		label: 'Centered',
		description: 'A single card in the middle of the page.'
	},
	split: {
		label: 'Split',
		description: 'Brand panel on the left, form on the right.'
	}
};
