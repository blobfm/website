export type Network = {
	id: number;
	beacon: string;
	genesis: number;
	rpc: string;
	explorer: string;
	gallery?: string;
};

export const networks: Record<string, Network> = {
	chiado: {
		id: 10200,
		beacon: 'https://rpc-gbc.chiadochain.net',
		genesis: 1665396300,
		rpc: 'https://rpc.chiadochain.net',
		explorer: 'https://gnosis-chiado.blockscout.com',
		gallery: '0x8F47B2aA7B9C62aa9882bCf787B3E63f0005f19d'
	},
	gnosis: {
		id: 100,
		beacon: 'https://rpc-gbc.gnosischain.com',
		genesis: 1638993340,
		rpc: 'https://rpc.gnosischain.com',
		explorer: 'https://gnosisscan.io'
	}
} as const;
