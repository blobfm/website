<script>
	import '../app.css';
	import NavItem from '../components/nav-item.svelte';
</script>

<header class="text-center">
	<img src="/logo.png" alt="Blob.fm" class="m-auto mt-4 mb-2" />
	<p>Home of Blobs and Beats.</p>
</header>

<nav>
	<ul class="flex gap-4 justify-center italic my-4">
		<NavItem href="/">Radio</NavItem>
		<NavItem href="/gallery">Gallery</NavItem>
	</ul>
</nav>

<slot />
