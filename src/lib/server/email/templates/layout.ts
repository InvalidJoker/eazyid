function escapeHtml(value: string) {
	return value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;');
}

interface EmailContent {
	footer: string;
	heading: string;
	paragraphs: string[];
	action?: { label: string; url: string };
}

export function renderEmail({ footer, heading, paragraphs, action }: EmailContent) {
	const text = [
		heading,
		'',
		...paragraphs,
		...(action ? ['', `${action.label}: ${action.url}`] : []),
		'',
		`- ${footer}`
	].join('\n');

	const button = action
		? `<p><a href="${escapeHtml(action.url)}" style="display:inline-block;padding:10px 18px;background:#171717;color:#fff;border-radius:8px;text-decoration:none">${escapeHtml(action.label)}</a></p>`
		: '';

	const html = `<!doctype html>
<html>
	<body style="margin:0;padding:32px;background:#f5f5f5;font-family:system-ui,sans-serif;color:#171717">
		<div style="max-width:480px;margin:0 auto;padding:32px;background:#fff;border-radius:12px">
			<h1 style="margin:0 0 16px;font-size:20px">${escapeHtml(heading)}</h1>
			${paragraphs.map((p) => `<p style="line-height:1.5">${escapeHtml(p)}</p>`).join('')}
			${button}
			<p style="margin-top:32px;font-size:12px;color:#737373">${escapeHtml(footer)}</p>
		</div>
	</body>
</html>`;

	return { text, html };
}
