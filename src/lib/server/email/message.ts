export interface EmailMessage {
	to: string;
	subject: string;
	text: string;
	html: string;
}

export type SendEmail = (from: string, message: EmailMessage) => Promise<void>;
