import { getDefaultProvider, isAddress, AbiCoder } from 'ethers';
import { Gapless5 } from '@regosen/gapless-5';
import { get, writable } from 'svelte/store';

// Lib
import { toVersionedHash } from './blobs';
import type { Network } from './networks';
import { sleep } from './utils';

export let player: Gapless5;
export const stopped = writable(false);
let currentAddress: string | undefined;

const handleBlob = (hex: string, address: string) => {
	// Detect ogg header
	if (!hex.startsWith('0x004f676753')) {
		return;
	}

	// Convert to Uint8Array
	const cleaned = hex.startsWith('0x') ? hex.substring(2) : hex;
	const decoded = cleaned
		.match(/../g)
		?.flatMap((h: string, i: number) => (i % 32 === 0 ? [] : [parseInt(h, 16)]));
	const buffer = Uint8Array.from(decoded ?? []);

	// Create Blob
	const blob = new Blob([buffer], { type: 'audio/ogg; codecs=opus' });
	const url = URL.createObjectURL(blob);

	// Short-circuit
	if (address !== currentAddress) {
		return;
	}

	// Push to play queue
	player.addTrack(url);

	// Play last track
	if (!get(stopped) && !player.isPlaying()) {
		player.onload = (path, loaded) => {
			if (path === url && loaded) {
				player.play();
			}
		};
		player.gotoTrack(url);
	}
};

const fetchBlob = async (
	network: Network,
	slot: number,
	versionedHash: string,
	address: string
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
					handleBlob(blob.blob, address);
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

export const play = async (network: Network, address: string) => {
	if (address === currentAddress) {
		return;
	}

	player?.removeAllTracks();
	stopped.set(false);
	currentAddress = address;

	if (!isAddress(address)) {
		return;
	}

	const provider = getDefaultProvider(network.rpc);
	const logs = await provider.getLogs({
		address,
		topics: ['0x920bafc9b698db43ceb2a24a000b11adbc6618546595516600022ec103554902'],
		fromBlock: 0
	});

	for (const log of logs) {
		if (address !== currentAddress) {
			return;
		}

		const tx = await provider.getTransaction(log.transactionHash);
		const timestamp = Number(new AbiCoder().decode(['uint256'], log.data)[0]);
		const slot = (timestamp - network.genesis) / 5;

		if (!tx || tx.type !== 3) {
			continue;
		}

		for (const hash of tx.blobVersionedHashes ?? []) {
			await fetchBlob(network, slot, hash, address);
		}
	}
};

export const initialize = () => {
	player = new Gapless5({
		guiId: 'player',
		useWebAudio: true,
		useHTML5Audio: false
	});

	player.onstop = () => stopped.set(true);
	player.onpause = () => stopped.set(true);
	player.onplay = () => stopped.set(false);
};
