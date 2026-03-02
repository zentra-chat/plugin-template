// Counter Click Plugin — a simple example showing how to build a Zentra plugin.
//
// This uses vanilla TypeScript to show that plugins are framework-agnostic.
// You could use React, Vue, Svelte, Solid, or anything else that renders to
// the DOM — just mount into the root element from getRootElement().
//
// The plugin runs inside a sandboxed iframe. It communicates with the host
// app through the bridge SDK (window.__zentra) which handles all the
// postMessage plumbing automatically.

import type { ZentraBridgeSDK, BridgeMessage } from '@zentra/plugin-sdk/bridge';

const sdk = window.__zentra as ZentraBridgeSDK;
const INCREMENT_PREFIX = '[[counter:+1]]';

// Register our channel type with the host so it shows up in the sidebar
// and the channel creation modal
sdk.registerChannelType({
	id: 'counter-click',
	icon: 'zap',
	label: 'Counter Click',
	description: 'Shared click counter synced by channel messages',
	showHash: false,
	headerActionIds: ['members']
});

// Build the UI
const root = sdk.getRootElement()!;
root.innerHTML = `
<div style="display:flex;flex-direction:column;min-height:100%;padding:24px;gap:24px;overflow-y:auto;">
	<div style="border-radius:12px;border:1px solid #1e293b;background:#131A2A;padding:24px;text-align:center;">
		<p style="font-size:14px;color:#94a3b8;margin-bottom:8px;">Counter Channel</p>
		<p id="count" style="font-size:48px;font-weight:bold;color:#f1f5f9;">0</p>
		<button id="increment" type="button" style="
			margin-top:20px;padding:10px 20px;border-radius:8px;background:#00FFA9;
			color:#0A1427;border:none;font-weight:600;cursor:pointer;font-size:14px;
		">Click to +1</button>
	</div>
	<div style="border-radius:12px;border:1px solid #1e293b;background:#131A2A;padding:16px;">
		<p style="font-size:14px;font-weight:600;color:#f1f5f9;margin-bottom:12px;">Recent increments</p>
		<div id="recent"><p style="font-size:14px;color:#94a3b8;">No increments yet.</p></div>
	</div>
</div>
`;

const countEl = root.querySelector('#count')!;
const recentEl = root.querySelector('#recent')!;
const btn = root.querySelector('#increment') as HTMLButtonElement;
let sending = false;

function countIncrements(messages: BridgeMessage[]): number {
	return (messages || []).filter((m) => (m.content || '').startsWith(INCREMENT_PREFIX)).length;
}

function renderRecent(messages: BridgeMessage[]): void {
	const recent = (messages || [])
		.filter((m) => (m.content || '').startsWith(INCREMENT_PREFIX))
		.slice(-5)
		.reverse();

	if (recent.length === 0) {
		recentEl.innerHTML = '<p style="font-size:14px;color:#94a3b8;">No increments yet.</p>';
		return;
	}

	recentEl.innerHTML = recent
		.map((msg) => {
			const name = msg.author?.displayName || msg.author?.username || 'Unknown';
			const time = new Date(msg.createdAt).toLocaleTimeString();
			return `<div style="border:1px solid #1e293b;border-radius:8px;padding:8px 12px;margin-bottom:8px;font-size:14px;color:#94a3b8;">
				${name} incremented at ${time}
			</div>`;
		})
		.join('');
}

// React to message changes — update the counter and recent list
sdk.stores.activeChannelMessages.subscribe((messages) => {
	countEl.textContent = String(countIncrements(messages));
	renderRecent(messages);
});

// Handle the increment button
btn.addEventListener('click', async () => {
	if (sending) return;
	const channel = sdk.stores.activeChannel.get();
	if (!channel?.id) return;

	sending = true;
	btn.textContent = 'Sending...';
	btn.style.opacity = '0.6';

	try {
		const payload = `${INCREMENT_PREFIX} ts=${Date.now()}`;
		await sdk.api.sendMessage(channel.id, { content: payload });
	} catch {
		sdk.ui.addToast({ type: 'error', message: 'Could not increment counter' });
	} finally {
		sending = false;
		btn.textContent = 'Click to +1';
		btn.style.opacity = '1';
	}
});
