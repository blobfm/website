<script lang="ts">
	import { onMount } from 'svelte';

	// Lib
	import { player, initialize, play, networks, stopped } from '$lib/player';
	import { type Episode, epicenter } from '$lib/data';

	// Icons
	import PlayIcon from '~icons/mdi/play-circle';
	import PauseIcon from '~icons/mdi/pause-circle';

	type Tracks = { current: number; total: number };

	let playing: Episode | undefined;
	let tracks: Tracks = { current: 0, total: 0 };

	const start = (episode: Episode) => {
		if (episode.hash === playing?.hash) {
			player.play();
			return;
		}

		playing = episode;
		play(networks.chiado, playing.hash);
		tracks = {
			current: 0,
			total: 0
		};
	};

	const trackCallback = () => {
		tracks = {
			current: player.getIndex(),
			total: player.getTracks().length
		};
	};

	onMount(() => {
		initialize();
		player.onloadstart = trackCallback;
		player.onfinishedtrack = trackCallback;
		player.onunload = trackCallback;
	});
</script>

<section class="bg-[#f7f7f7] py-4 px-4 md:px-8 xl:px-16" class:mb-16={playing}>
	<h2 class="text-2xl m-auto my-8 text-center">Podcasts</h2>

	<div class="grid gap-8 my-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
		{#each epicenter as episode}
			{@const shouldPause = playing?.hash === episode.hash && !$stopped}
			<div class="bg-white rounded-b-xl">
				<div class="flex flex-col h-full pb-6">
					<img src={episode.image} alt={episode.title} class="rounded-t-lg" />
					<h3 class="text-center text-lg mt-6 px-6">{episode.title}</h3>
					<p class="text-justify my-4 px-6">{episode.summary}</p>
					<div class="flex justify-between items-center mt-auto px-6">
						<button
							class="shrink-0 flex flex-row items-center bg-[#f7f7f7] rounded rounded-lg px-4 py-2 gap-4"
							on:click={() => (shouldPause ? player.pause() : start(episode))}
						>
							{#if shouldPause}
								<PauseIcon /> Pause
							{:else}
								<PlayIcon /> Play
							{/if}
						</button>
						<p class="text-right">By {episode.speakers}</p>
					</div>
				</div>
			</div>
		{/each}
	</div>
</section>

{#if playing}
	<section class="fixed bottom-0 h-16 bg-white w-full flex items-center px-4 gap-4">
		{#if $stopped}
			<button on:click={() => player.play()}><PlayIcon class="text-4xl shrink-0" /></button>
		{:else}
			<button on:click={() => player.pause()}><PauseIcon class="text-4xl shrink-0" /></button>
		{/if}

		<p class="truncate text-ellipsis overflow-hidden max-h-16 grow">
			{playing.title}
		</p>

		<p class="shrink-0">
			<span title="Currently playing blob">{tracks.current}</span> /
			<span title="Loaded blobs for this track">{tracks.total}</span>
		</p>
	</section>
{/if}
