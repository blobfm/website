<script lang="ts">
	import { onMount } from 'svelte';
	import type { EventHandler } from 'svelte/elements';
	import { browser } from '$app/environment';
	import { JsonRpcProvider, Wallet, parseEther, BrowserProvider } from 'ethers';
	import { createKZG } from 'kzg-wasm';
	import {
		Address,
		initKZG,
		type Kzg,
		commitmentsToVersionedHashes,
		blobsToCommitments,
		blobsToProofs,
		hexToBytes,
		bytesToHex
	} from '@ethereumjs/util';
	import { Common, Hardfork } from '@ethereumjs/common';
	import { BlobEIP4844Transaction, type BlobEIP4844TxData } from '@ethereumjs/tx';

	// Lib
	import { resizeImage } from '$lib/image';
	import { formatAddress, randomBetween } from '$lib/utils';
	import { networks } from '$lib/networks';

	// Icons
	import UploadIcon from '~icons/mdi/upload-box';
	import { gallery } from '$lib/gallery';

	let upload: HTMLInputElement;
	let kzg: Promise<Kzg>;
	let tx: string | undefined;

	const loadWallet = () => {
		if (!browser) {
			return;
		}

		const key = 'blobfm-wallet';
		const privateKey = localStorage.getItem(key);
		if (privateKey) {
			return new Wallet(privateKey);
		}

		const wallet = Wallet.createRandom();
		localStorage.setItem(key, wallet.privateKey);
		return wallet;
	};

	const wallet = loadWallet();
	const network = networks.chiado;

	const images = Array.from({ length: 30 }, (_, i) => ({
		image: `https://picsum.photos/400/${randomBetween(200, 800)}`,
		transaction: '0x8405293bfeda26a160d51afd244279b36e5f1718db15cd1aa6b95f73f6214a0f'
	}));

	const createBlob = (data: Uint8Array): Uint8Array => {
		const blob = new Uint8Array(32 * 4096);
		for (let i = 0; i < 4096; i++) {
			const chunk = new Uint8Array(32);
			chunk.set(data.subarray(i * 31, (i + 1) * 31), 1);
			blob.set(chunk, i * 32);
		}
		return blob;
	};

	const uploadPicture = async (blob: Uint8Array) => {
		if (!network.gallery) {
			console.warn('Gallery address not configured');
			return;
		}

		if (!wallet) {
			console.warn('Wallet not configured');
			return;
		}

		const provider = new JsonRpcProvider(networks.chiado.rpc);
		const common = Common.custom(
			{
				name: 'chiado',
				chainId: network.id,
				networkId: network.id
			},
			{
				hardfork: Hardfork.Cancun,
				eips: [4844],
				customCrypto: { kzg: await kzg }
			}
		);

		const nonce = await provider.getTransactionCount(wallet.address);
		const blobs = [createBlob(blob)];
		const kzgCommitments = blobsToCommitments(blobs);
		const txData: BlobEIP4844TxData = {
			data: '0x8d7cd6da',
			gasLimit: 50000,
			to: Address.fromString(network.gallery),
			chainId: 10200,
			maxFeePerBlobGas: 1e9,
			maxPriorityFeePerGas: 2e9,
			maxFeePerGas: 50e9,
			blobs,
			kzgCommitments,
			blobVersionedHashes: commitmentsToVersionedHashes(kzgCommitments),
			kzgProofs: blobsToProofs(blobs, kzgCommitments),
			nonce
		};

		const blobTx = BlobEIP4844Transaction.fromTxData(txData, { common });
		const signed = blobTx.sign(hexToBytes(wallet.privateKey));
		const raw = bytesToHex(signed.serializeNetworkWrapper());
		tx = (await provider.send('eth_sendRawTransaction', [raw])) as string;
	};

	const handlePicture: EventHandler<Event, HTMLInputElement> = (event) => {
		if (!event.currentTarget.files) {
			return;
		}

		const image = event.currentTarget.files[0];
		const reader = new FileReader();
		reader.onload = async (event) => {
			if (!event.target) {
				return;
			}

			const blob = await resizeImage(event.target.result as string);
			const buffer = await blob?.arrayBuffer();

			if (!buffer) {
				return;
			}

			uploadPicture(new Uint8Array(buffer));
		};
		reader.readAsDataURL(image);
	};

	const fundFromWallet = async () => {
		if (!wallet) {
			return;
		}

		const chainId = '0x' + network.id.toString(16);
		const provider = new BrowserProvider((window as any).ethereum, {
			name: network.name,
			chainId: network.id
		});

		try {
			await provider.send('wallet_switchEthereumChain', [{ chainId }]);
		} catch ({ error = {} }: any) {
			if (error.code === 4902) {
				await provider.send('wallet_addEthereumChain', [
					{
						chainId,
						chainName: network.name,
						rpcUrls: [network.rpc],
						blockExplorerUrls: [network.explorer],
						nativeCurrency: {
							symbol: 'xDAI',
							decimals: 18
						}
					}
				]);
				await provider.send('wallet_switchEthereumChain', [{ chainId }]);
			} else {
				return;
			}
		}

		const signer = await provider.getSigner();
		await signer.sendTransaction({ to: wallet.address, value: parseEther('0.5') });
	};

	onMount(() => {
		kzg = createKZG();
		kzg.then((kzg) => initKZG(kzg, ''));

		if (network.gallery) {
			gallery.init(network, network.gallery);
		}
	});
</script>

<section class="bg-[#f7f7f7] py-4 px-4 md:px-8 xl:px-16">
	<h2 class="text-2xl m-auto my-8 text-center">Gallery</h2>

	<div class="columns-1 md:columns-2 xl:columns-3 gap-8">
		<div class="bg-white rounded-xl mb-8 p-8">
			<input
				type="file"
				accept=".jpg, .jpeg, .png"
				class="hidden"
				id="upload"
				bind:this={upload}
				on:change={(e) => handlePicture(e)}
			/>

			<div class="flex items-center">
				<p class="grow">Add your own!</p>

				<button
					class="py-2 px-4 bg-[#f7f7f7] rounded-xl flex items-center gap-2"
					on:click={() => upload.click()}
				>
					<UploadIcon /> Upload
				</button>
			</div>

			{#if tx}
				<p class="w-2/3 m-auto text-gray-500 mt-4 text-center">
					Transaction send: <a href={`${network.explorer}/tx/${tx}`} target="_blank">
						{formatAddress(tx)}
					</a>
				</p>
			{/if}

			{#if wallet}
				<p class="w-2/3 m-auto text-gray-500 mt-4 text-center">
					This process requires a local wallet, please fund <a
						title={wallet.address}
						href={`${network.explorer}/address/${wallet.address}`}
						target="_blank"
					>
						{formatAddress(wallet.address, 4)}
					</a>
					with some xDAI.
				</p>

				<button on:click={fundFromWallet} class="underline mt-2 text-xs m-auto block">
					Click here to send 0.5 xDAI from brower wallet.
				</button>
			{/if}
		</div>

		{#each $gallery as element}
			<div class="group w-full mb-8 relative">
				<img class="w-full rounded-xl" src={element.url} alt={formatAddress(element.transaction)} />
				<div
					class="rounded-xl h-full opacity-0 group-hover:opacity-100 duration-300 absolute inset-x-0 bottom-0 flex justify-center items-end text-xl items-center text-black bg-gray-200 bg-opacity-75 flex-col gap-2"
				>
					<a href={`${network.explorer}/tx/${element.transaction}`} target="_blank">
						{formatAddress(element.transaction)}
					</a>
					by
					<a href={`${network.explorer}/address/${element.from}`} target="_blank">
						{formatAddress(element.from)}
					</a>
				</div>
			</div>
		{/each}
	</div>
</section>
