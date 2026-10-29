import type { EmailMessage } from '../message';
import { renderEmail } from './layout';

/** Every template can use `{{instanceName}}` in addition to its own placeholders. */
export interface EmailTemplate<Placeholder extends string> {
	placeholders: readonly Placeholder[];
	subject: string;
	heading: string;
	paragraphs: string[];
	action?: { label: string; url: string };
}

type TemplateValues<Placeholder extends string> = Record<Placeholder | 'instanceName', string>;

function fill(text: string, values: Record<string, string>) {
	return text.replaceAll(/\{\{\s*(\w+)\s*\}\}/g, (match, name: string) => values[name] ?? match);
}

export function renderTemplate<Placeholder extends string>(
	template: EmailTemplate<Placeholder>,
	to: string,
	values: TemplateValues<Placeholder>
): EmailMessage {
	return {
		to,
		subject: fill(template.subject, values),
		...renderEmail({
			footer: values.instanceName,
			heading: fill(template.heading, values),
			paragraphs: template.paragraphs.map((paragraph) => fill(paragraph, values)),
			action: template.action && {
				label: fill(template.action.label, values),
				url: fill(template.action.url, values)
			}
		})
	};
}
