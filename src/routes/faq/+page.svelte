<section class="bg-[#f7f7f7] py-12 px-4 md:px-8 xl:px-16">
	<div class="max-w-4xl m-auto text-justify">
		<h2 class="text-2xl m-auto text-center">FAQ</h2>

		<h3 class="text-xl mt-8 mb-2">What is Blob.fm?</h3>
		<p class="mt-2">
			<a href="/" class="underline">Blob.fm </a> is a website that demonstrates fun use-cases of blobs
			on post-Dencun chains. While the main idea is to scale Ethereum with L2s, they are in fact just
			arbitrary data that can be stored on chain, and can thus be used for diverse experiments.
		</p>

		<h3 class="text-xl mt-8 mb-2">Which chains support Dencun?</h3>
		<p class="mt-2">The two first chains that are enabling Dencun so far are:</p>
		<ul class="list-disc list-inside ml-4 mt-2">
			<li>Gnosis Chain on March 11th, 2024</li>
			<li>Ethereum on March 13th, 2024</li>
		</ul>

		<h3 class="text-xl mt-8 mb-2">How much data can blobs store?</h3>
		<p class="mt-2">
			Blobs can store 131,072 bytes, although not each of those can be used, as each <code
				>FIELD_ELEMENT</code
			>
			(4096 bytes) needs to be smaller than <code>BLS_MODULUS</code>, as described in
			<a href="https://eips.ethereum.org/EIPS/eip-4844#point-evaluation-precompile">EIP-4844</a>. In
			practise, this is currently often achieved by setting the most significant byte to 0. This is
			not very efficient as it wastes some space, but doing otherwise would require more processing
			and will likely be optimized later down the line.
		</p>
		<p class="mt-2">
			Gnosis Chain produces one block every 5 seconds, and targets one blob per block, meaning that
			each block can now store roughly 125kb of additional data. This represents roughly 2.16 GB per
			day.
		</p>

		<h3 class="text-xl mt-8 mb-2">Doesn't this significantly worsen state bloat?</h3>
		<p class="mt-2">
			The whole point of Blob is that they are ephemeral. In practise, data is automatically
			discarded after about two weeks for both Ethereum and Gnosis Chain. This means that, on Gnosis
			Chain, nodes have to store at most around 30 GB of additional data since Dencun. That storage
			will constantly be recycled as old blobs automatically get deleted.
		</p>

		<h3 class="text-xl mt-8 mb-2">How do blobs work?</h3>
		<p class="mt-2">
			Blobs are a new type of transaction (type 3), that can do everything classic transactions can
			do as well, except they can upload blobs in addition. To do so, one has to create a blob that
			is exactly 131,072 bytes long, generate the KZG commitments, derive the versioned hashes and
			calculate proofs. An example of this procedure can be found <a
				class="underline"
				href="https://github.com/blobfm/website/blob/5dd4c82b619aa4f4a90c1c1bc5d3a40a89026461/src/routes/gallery/%2Bpage.svelte#L92-L113"
				>in the source code of this website</a
			>.
		</p>
		<p class="mt-2">
			As blobs are merely an extension to normal transactions, and can thus do whatever normal
			transactions can do as well, it is also possible to interact with contracts while creating
			blobs.
		</p>

		<h3 class="text-xl mt-8 mb-2">How can one retrieve the content of blobs?</h3>
		<p class="mt-2">
			This is a bit tricky. Indeed, until Dencun all data was always fetched through the RPC of an
			execution layer client. However, blobs live in the consensus layer, otherwise known as the
			beacon chain. This means that providers will now have to provide publicly accessible beacon
			chain nodes, which wasn't typically the case in the past.
		</p>
		<p class="mt-2">
			To fetch the content of a blob, one has to call the <code
				>/eth/v1/beacon/blob_sidecars/&lbrace;slot&rbrace;</code
			>
			endpoint with the slot number the blob was created in. To get that slot number, one has to know
			at which timestamp the transaction was mined, and then simply apply the following formula:
			<code>(TX_TIMESTAMP - GENESIS_TIMESTAMP) / SLOTS_PER_SECOND</code>. For example, on Gnosis
			Chain the genesis of the beacon chain is <code>1638993340</code>, and the chain produces 5
			slots per seconds.
		</p>

		<h3 class="text-xl mt-8 mb-2">How does on-demand audio work?</h3>
		<p class="mt-2">
			Audio streaming is achieved by cutting an audio file in many pieces that can fit in a blob, so
			around 125kb. We chose the Opus coding format to achieve this, and can fit around 14 seconds
			of audio in a blob, with a 16kHz sampling rate and 64kbps bitrate on two channels, which in
			our opinion is a good compromise between size and audio quality.
		</p>
		<p class="mt-2">
			These pieces are then published as blobs on a smart contract, whose only purpose is to provide
			an efficiently quieriable event source, so that the website can actually know that blobs have
			been created for its consumption. This contract can be found <a
				class="underline"
				href="https://github.com/filoozom/blob-feed-contracts/blob/main/src/BlobFeed.sol">here</a
			>, and comes with built-in authentication. Each podcast is this its own smart contract, on
			which the owner can add blobs as pieces of the audio stream. It also checks that the
			transaction does in fact contain a blob, so that no event is mistakenly emitted without there
			being an attached blob.
		</p>

		<h3 class="text-xl mt-8 mb-2">How does audio live streaming work?</h3>
		<p class="mt-2">
			Although not currently showcased, live streaming is also entirely possible thanks to the very
			same technology used for on-demand audio. The most important part is to make sure that audio
			can be delivered fast enough. This is fairly trivial on an empty chain, as blobs can store
			around 14 seconds of good quality audio, and there is at least one blob every 5 seconds. This
			means that even by missing 60% of the blobs it should still be possible to stream real-time
			audio with a fairly low latency (~15 seconds).
		</p>
		<p class="mt-2">
			For more congested chains it's still possible to make some compromises, like single channel
			audio with much lower bitrate for example. However, for congested chains, this would likely
			still be way too expensive.
		</p>

		<h3 class="text-xl mt-8 mb-2">How does the gallery work?</h3>
		<p class="mt-2">
			All in all it's quite similar to the on-demand audio streaming part as well. The only
			difference is that the smart contract allows anyone to post blobs to it (instead of just the
			owner), and that the blob is interpreted differently.
		</p>
		<p class="mt-2">
			The complicated part mostly creating blobs from inside the browser. Thankfully, the Ethereum
			Foundation provides great libraries for this use-case with their <code>@ethereumjs</code> npm packages.
		</p>

		<h3 class="text-xl mt-8 mb-2">Why does this website require a local wallet?</h3>
		<p class="mt-2">
			It is currently impossible to post blobs on-chain with browser extension wallets. This comes
			from the fact that <code>eth_sendTransaction</code> doesn't support the network format of
			Blobs. The only way to post blobs on-chain is thus to sign them directly in the browser and to
			post them using <code>eth_sendRawTransaction</code>, thus requiring a private key to be
			exposed directly to the browser and website.
		</p>
		<p class="mt-2">
			Of course, this is a huge security risk, which is why we only support an automatically
			generated address that you can fund with a small amount of native tokens. Expect to lose them
			and please don't send big amounts! On Gnosis Chain and Chiado, you can use the previded
			faucets to get enough xDAI to get you started, assuming the network isn't too congested.
		</p>
	</div>
</section>
