import { getDefaultProvider, isAddress, AbiCoder } from 'ethers';
import { writable } from 'svelte/store';

// Lib
import { toVersionedHash } from './blobs';
import type { Network } from './networks';
import { sleep } from './utils';
import type { Log } from 'ethers';

type Metadata = {
	transaction: string;
	from: string;
};

type GalleryItem = Metadata & {
	url: string;
};

let currentAddress: string | undefined;
let unsubscribe: () => void | undefined;

const { subscribe, set, update } = writable<GalleryItem[]>([]);

// TODO: Deduplicate most of this code with player.ts
const handleBlob = (hex: string, address: string, metadata: Metadata) => {
	// Convert to Uint8Array
	const cleaned = hex.startsWith('0x') ? hex.substring(2) : hex;
	const decoded = cleaned
		.match(/../g)
		?.flatMap((h: string, i: number) => (i % 32 === 0 ? [] : [parseInt(h, 16)]));
	const buffer = Uint8Array.from(decoded ?? []);

	// Create Blob
	const blob = new Blob([buffer], { type: 'image/jpeg' });
	const url = URL.createObjectURL(blob);

	// Short-circuit
	if (address !== currentAddress) {
		return;
	}

	// Add image
	update((elements) => [{ url, ...metadata }, ...elements]);
};

const fetchBlob = async (
	network: Network,
	slot: number,
	versionedHash: string,
	address: string,
	metadata: Metadata
) => {
	for (let i = 0; i < 3; i++) {
		try {
			const response = await fetch(network.beacon + `/eth/v1/beacon/blob_sidecars/${slot}`);
			const data = await response.json();

			if (address !== currentAddress) {
				return;
			}

			for (const blob of data.data) {
				const hash = await toVersionedHash(blob.kzg_commitment);
				if (hash === versionedHash) {
					handleBlob(blob.blob, address, metadata);
					return;
				}
			}

			console.warn(`Blob ${versionedHash} not found in slot ${slot}`);
			return;
		} catch (err) {
			await sleep(250);
		}
	}
};

const init = async (network: Network, address: string) => {
	if (address === currentAddress) {
		return;
	}

	set([]);
	unsubscribe?.();
	currentAddress = address;

	if (!isAddress(address)) {
		return;
	}

	const provider = getDefaultProvider(network.rpc);
	const topics = ['0x920bafc9b698db43ceb2a24a000b11adbc6618546595516600022ec103554902'];
	const handleLog = async (log: Log) => {
		if (address !== currentAddress) {
			return;
		}

		const tx = await provider.getTransaction(log.transactionHash);
		const timestamp = Number(new AbiCoder().decode(['uint256'], log.data)[0]);
		const slot = (timestamp - network.genesis) / 5;

		if (!tx || tx.type !== 3) {
			return;
		}

		for (const hash of tx.blobVersionedHashes ?? []) {
			await fetchBlob(network, slot, hash, address, {
				transaction: log.transactionHash,
				from: tx.from
			});
		}
	};

	// Set up listener
	const filter = { address, topics };
	provider.on(filter, handleLog);
	unsubscribe = () => void provider.off(filter, handleLog);

	// Fetch old logs
	const logs = await provider.getLogs({
		address,
		topics: ['0x920bafc9b698db43ceb2a24a000b11adbc6618546595516600022ec103554902'],
		fromBlock: 0
	});

	for (const log of logs) {
		await handleLog(log);
	}
};

// This should not be a singleton and exposed as a "createGallery" function or
// something similar, but we are on a time crunch so it'll have to make do for now
export const gallery = { subscribe, init };
