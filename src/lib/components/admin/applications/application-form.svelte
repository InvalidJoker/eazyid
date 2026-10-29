<script lang="ts">
	import { Button } from '#lib/components/ui/button/index.js';
	import * as Field from '#lib/components/ui/field/index.js';
	import { Input } from '#lib/components/ui/input/index.js';
	import { Switch } from '#lib/components/ui/switch/index.js';
	import { Textarea } from '#lib/components/ui/textarea/index.js';
	import type { ApplicationFormValues, ApplicationType } from '#lib/applications.js';
	import { cn } from '#lib/utils.js';

	let {
		mode,
		initial,
		submitLabel,
		onSubmit
	}: {
		mode: 'create' | 'edit';
		initial: ApplicationFormValues;
		submitLabel: string;
		onSubmit: (values: ApplicationFormValues) => Promise<string | null>;
	} = $props();

	const types: { value: ApplicationType; label: string; description: string }[] = [
		{
			value: 'confidential',
			label: 'Confidential',
			description: 'Runs on a server and can keep a client secret.'
		},
		{
			value: 'public',
			label: 'Public',
			description: 'Single-page or mobile app. No secret, PKCE only.'
		}
	];

	let name = $state('');
	let type = $state<ApplicationType>('confidential');
	let redirectUris = $state('');
	let skipConsent = $state(false);
	let enabled = $state(true);
	let errorMessage = $state('');
	let pending = $state(false);

	$effect.pre(() => {
		name = initial.name;
		type = initial.type;
		redirectUris = initial.redirectUris.join('\n');
		skipConsent = initial.skipConsent;
		enabled = !initial.disabled;
	});

	async function submit(event: SubmitEvent) {
		event.preventDefault();
		pending = true;
		errorMessage =
			(await onSubmit({
				name,
				type,
				redirectUris: redirectUris
					.split('\n')
					.map((uri) => uri.trim())
					.filter(Boolean),
				skipConsent,
				disabled: !enabled
			})) ?? '';
		pending = false;
	}
</script>

<form onsubmit={submit}>
	<Field.Group>
		<Field.Field>
			<Field.Label for="application-name">Name</Field.Label>
			<Input id="application-name" required bind:value={name} />
			<Field.Description>Shown to users on the consent screen.</Field.Description>
		</Field.Field>

		{#if mode === 'create'}
			<Field.Field>
				<Field.Label>Type</Field.Label>
				<div role="radiogroup" class="grid gap-3 sm:grid-cols-2">
					{#each types as option (option.value)}
						<button
							type="button"
							role="radio"
							aria-checked={type === option.value}
							onclick={() => (type = option.value)}
							class={cn(
								'rounded-xl border p-3 text-left transition-colors hover:bg-muted/50',
								type === option.value && 'border-primary ring-2 ring-primary/20'
							)}
						>
							<div class="text-sm font-medium">{option.label}</div>
							<div class="text-xs text-muted-foreground">{option.description}</div>
						</button>
					{/each}
				</div>
				<Field.Description>The type cannot be changed later.</Field.Description>
			</Field.Field>
		{/if}

		<Field.Field>
			<Field.Label for="application-redirects">Redirect URIs</Field.Label>
			<Textarea
				id="application-redirects"
				rows={3}
				required
				placeholder="https://app.example.com/callback"
				class="font-mono text-sm"
				bind:value={redirectUris}
			/>
			<Field.Description>
				One per line. Use https on public hosts; http works for localhost and 127.0.0.1.
			</Field.Description>
		</Field.Field>

		<Field.Field orientation="horizontal">
			<Field.Content>
				<Field.Label for="application-skip-consent">Skip consent</Field.Label>
				<Field.Description>For your own apps users already trust.</Field.Description>
			</Field.Content>
			<Switch id="application-skip-consent" bind:checked={skipConsent} />
		</Field.Field>

		{#if mode === 'edit'}
			<Field.Field orientation="horizontal">
				<Field.Content>
					<Field.Label for="application-enabled">Enabled</Field.Label>
					<Field.Description>Disabled applications cannot sign anyone in.</Field.Description>
				</Field.Content>
				<Switch id="application-enabled" bind:checked={enabled} />
			</Field.Field>
		{/if}

		{#if errorMessage}
			<Field.Error>{errorMessage}</Field.Error>
		{/if}

		<div>
			<Button type="submit" disabled={pending}>{submitLabel}</Button>
		</div>
	</Field.Group>
</form>
