export { };

export interface ArgentXProvider {
    id: string
    isConnected: number
    name: string
    version: string
    icon: string
}

export interface BraavosProvider {
    id: string
    isConnected: number
    name: string
    version: string
    icon: string
}

declare global {
    interface Window {
        starknet_argentX?: ArgentXProvider
        starknet_braavos?: BraavosProvider
    }
}