export type Network = {
	id: number;
	name: string;
	beacon: string;
	genesis: number;
	rpc: string;
	explorer: string;
	faucet?: string;
	gallery?: string;
};

export const networks: Record<string, Network> = {
	chiado: {
		id: 10200,
		name: 'Chiado',
		beacon: 'https://rpc-gbc.chiadochain.net',
		genesis: 1665396300,
		rpc: 'https://rpc.chiadochain.net',
		explorer: 'https://gnosis-chiado.blockscout.com',
		faucet: 'https://faucet.chiadochain.net',
		gallery: '0x8F47B2aA7B9C62aa9882bCf787B3E63f0005f19d'
	},
	gnosis: {
		id: 100,
		name: 'Gnosis',
		beacon: 'https://rpc-gbc.gnosischain.com',
		genesis: 1638993340,
		rpc: 'https://rpc.gnosischain.com',
		faucet: 'https://faucet.gnosischain.com',
		explorer: 'https://gnosisscan.io'
	}
} as const;
