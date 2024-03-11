<script>
	import '../app.css';

	// Components
	import NavItem from '../components/nav-item.svelte';

	// Icons
	import EthereumIcon from '~icons/mdi/ethereum';
	import TwitterIcon from '~icons/mdi/twitter';
	import GithubIcon from '~icons/mdi/github';
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
		<span class="invisible hidden sm:flex mr-auto my-2 text-xl gap-2 ml-4">
			<TwitterIcon />
			<GithubIcon />
		</span>
		<span class="flex sm:hidden w-0" />

		<NavItem href="/">Radio</NavItem>
		<NavItem href="/gallery">Gallery</NavItem>
		<NavItem href="/faq">FAQ</NavItem>

		<span class="ml-auto my-2 flex text-xl gap-2 mr-4 text-gray-700">
			<a class="hover:text-black" href="https://twitter.com/blobFM" target="_blank">
				<TwitterIcon />
			</a>
			<a class="hover:text-black" href="https://github.com/blobfm" target="_blank">
				<GithubIcon />
			</a>
		</span>
	</ul>
</nav>

<slot />
