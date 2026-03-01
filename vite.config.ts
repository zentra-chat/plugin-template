import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [svelte({
		compilerOptions: {
			customElement: true
		}
	})],
	resolve: {
		alias: {
			'@zentra/plugin-sdk/runtime': new URL('../plugin-sdk/src/runtime.ts', import.meta.url).pathname,
			'@zentra/plugin-sdk': new URL('../plugin-sdk/src', import.meta.url).pathname
		}
	},
	build: {
		lib: {
			entry: new URL('./src/index.ts', import.meta.url).pathname,
			name: 'ZentraCounterChannelPlugin',
			formats: ['es'],
			fileName: () => 'counter-channel-plugin.js'
		},
		rollupOptions: {
			treeshake: false,
			output: {
				inlineDynamicImports: true
			}
		},
		target: 'es2022',
		minify: true,
		sourcemap: false,
		emptyOutDir: true
	}
});
