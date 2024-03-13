export type Network = {
	id: number;
	name: string;
	nativeCurrency: {
		symbol: string;
		decimals: number;
	};
	beacon?: string;
	genesis: number;
	slotsPerSecond: number;
	rpc: string;
	explorer: string;
	faucet?: string;
	gallery?: string;
	galleryFrom?: number;
	blobscan?: string;
};

export const networks: Record<string, Network> = {
	chiado: {
		id: 10200,
		name: 'Chiado',
		nativeCurrency: {
			symbol: 'xDAI',
			decimals: 18
		},
		beacon: 'https://rpc-gbc.chiadochain.net',
		genesis: 1665396300,
		slotsPerSecond: 5,
		rpc: 'https://rpc.chiadochain.net',
		explorer: 'https://gnosis-chiado.blockscout.com',
		faucet: 'https://faucet.chiadochain.net',
		gallery: '0x8F47B2aA7B9C62aa9882bCf787B3E63f0005f19d',
		galleryFrom: 8678183
	},
	gnosis: {
		id: 100,
		name: 'Gnosis',
		nativeCurrency: {
			symbol: 'xDAI',
			decimals: 18
		},
		beacon: 'https://rpc-gbc.gnosischain.com',
		genesis: 1638993340,
		slotsPerSecond: 5,
		rpc: 'https://rpc.eu-central-2.gateway.fm/v4/gnosis/archival/mainnet?apiKey=p1X65e5DK1o2anD3nrz1TmndQtQge836.MMOUt06fjNxzbh1y',
		faucet: 'https://faucet.gnosischain.com',
		explorer: 'https://gnosisscan.io',
		gallery: '0x53EB1EB37b3DDEacB3627Ea670256412Cd7dC419',
		galleryFrom: 32880747
	},
	sepolia: {
		id: 11155111,
		name: 'Sepolia',
		nativeCurrency: {
			symbol: 'ETH',
			decimals: 18
		},
		genesis: 1655733600,
		slotsPerSecond: 12,
		rpc: 'https://sepolia.infura.io/v3/0de1a96486754f8b98f284d093905198',
		faucet: 'https://www.alchemy.com/faucets/ethereum-sepolia',
		explorer: 'https://sepolia.etherscan.io/',
		gallery: '0x07609f0AD8898b4bf411685AEc6536CDcE0e2eC7',
		galleryFrom: 5477155,
		blobscan: 'https://api.sepolia.blobscan.com/api'
	}
} as const;

export const enabledNetworks: (keyof typeof networks)[] = ['chiado', 'gnosis', 'sepolia'] as const;
