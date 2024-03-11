<script>
	import '../app.css';

	// Components
	import NavItem from '../components/nav-item.svelte';

	// Icons
	import EthereumIcon from '~icons/mdi/ethereum';
</script>

<header class="text-center">
	<img src="/logo.png" alt="Blob.fm" class="m-auto mt-4 mb-2" />

	<p>Home of Blobs and Beats</p>

	<div class="flex items-center justify-center my-4 gap-2">
		With <EthereumIcon class="inline text-red-500" /> by
		<a class="underline" href="https://twitter.com/filoozom">Philippe</a> and
		<a class="underline" href="https://twitter.com/davekpk">Dave</a>
	</div>
</header>

<nav>
	<ul class="flex gap-4 justify-center italic my-4">
		<NavItem href="/">Radio</NavItem>
		<NavItem href="/gallery">Gallery</NavItem>
	</ul>
</nav>

<slot />
