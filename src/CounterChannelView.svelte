<script lang="ts">
	import { countMessagesByPrefix, getSDK } from '@zentra/plugin-sdk/runtime';

	const sdk = getSDK();
	const { activeChannel, activeChannelMessages, currentUserId } = sdk.stores;
	const INCREMENT_PREFIX = '[[counter:+1]]';

	let sending = $state(false);

	const count = $derived(countMessagesByPrefix($activeChannelMessages || [], INCREMENT_PREFIX));
	const lastFive = $derived(($activeChannelMessages || [])
		.filter((msg) => (msg.content || '').startsWith(INCREMENT_PREFIX))
		.slice(-5)
		.reverse());

	async function incrementCounter() {
		if (sending || !$activeChannel?.id) return;
		sending = true;
		try {
			const payload = `${INCREMENT_PREFIX} user=${$currentUserId || 'unknown'} ts=${Date.now()}`;
			const message = await sdk.api.sendMessage($activeChannel.id, {
				content: payload
			});
			sdk.ui.addMessage($activeChannel.id, message);
		} catch (error) {
			console.error('Failed to increment counter:', error);
			sdk.ui.addToast({ type: 'error', message: 'Could not increment counter' });
		} finally {
			sending = false;
		}
	}
</script>

<svelte:options customElement={{ tag: 'zentra-plugin-counter-channel-view', shadow: 'none' }} />

<div class="flex-1 flex flex-col min-h-0 p-6 gap-6 overflow-y-auto">
	<div class="rounded-xl border border-border bg-surface p-6 text-center">
		<p class="text-sm text-text-muted mb-2">Counter Channel</p>
		<p class="text-5xl font-bold text-text-primary">{count}</p>

		<button
			type="button"
			onclick={incrementCounter}
			disabled={sending}
			class="mt-5 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium disabled:opacity-60"
		>
			{sending ? 'Sending...' : 'Click to +1'}
		</button>
	</div>

	<div class="rounded-xl border border-border bg-surface p-4">
		<p class="text-sm font-semibold text-text-primary mb-3">Recent increments</p>
		{#if lastFive.length === 0}
			<p class="text-sm text-text-muted">No increments yet.</p>
		{:else}
			<ul class="space-y-2">
				{#each lastFive as msg (msg.id)}
					<li class="text-sm text-text-secondary border border-border rounded px-3 py-2">
						{msg.author?.displayName || msg.author?.username || 'Unknown user'} incremented at {new Date(msg.createdAt).toLocaleTimeString()}
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</div>
