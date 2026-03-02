import { defineConfig } from 'vite';

// Plugin builds produce a single ES module that runs inside a sandboxed iframe.
// No framework-specific plugins needed — use whatever you want (or nothing).
// If you want to use Svelte/React/Vue, add the appropriate vite plugin here.
export default defineConfig({
	resolve: {
		alias: {
			'@zentra/plugin-sdk/bridge': new URL('../plugin-sdk/src/bridge.ts', import.meta.url).pathname,
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
