import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import Icons from 'unplugin-icons/vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
	plugins: [
		Icons({
			compiler: 'svelte'
		}),
		nodePolyfills({
			include: ['events'],
			globals: {
				process: false
			},
			exclude: ['process']
		}),
		sveltekit()
	],
	define: {
		process: {}
	}
});
