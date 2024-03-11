export type Network = {
    id: number
    beacon: string
    genesis: number
    rpc: string
}

export const networks: Record<string, Network> = {
    chiado: {
        id: 10200,
        beacon: "https://rpc-gbc.chiadochain.net",
        genesis: 1665396300,
        rpc: "https://rpc.chiadochain.net"
    },
    gnosis: {
        id: 100,
        beacon: "https://rpc-gbc.gnosischain.com",
        genesis: 1638993340,
        rpc: "https://rpc.gnosischain.com"
    },
} as const
