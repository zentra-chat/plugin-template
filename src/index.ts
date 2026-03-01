import { definePlugin, type ZentraPluginSDK } from '@zentra/plugin-sdk';

export const register = definePlugin((sdk: ZentraPluginSDK) => {
	sdk.registerChannelType({
		id: 'counter-click',
		icon: 'zap',
		viewElement: {
				tagName: 'zentra-plugin-counter-channel-view',
			module: () => import('./CounterChannelView.svelte')
		},
		label: 'Counter Click',
		description: 'Shared click counter synced by channel messages',
		showHash: false,
		headerActionIds: ['members']
	});
});
