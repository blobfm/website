<script lang="ts">
	import { page } from '$app/stores';

	export let href: string;
	$: active = href === $page.url.pathname;
</script>

<li class:active class="px-4 py-2 rounded-xl">
	<a {...$$props} {href} aria-current={active ? 'page' : undefined}><slot /></a>
</li>

<style lang="postcss">
	.active {
		@apply bg-red-500;
	}
</style>
