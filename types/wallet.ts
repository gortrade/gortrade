declare global {
  interface Window {
    solana?: {
      isPhantom?: boolean
      connect: () => Promise<{ publicKey: { toString: () => string } }>
      disconnect: () => Promise<void>
      signTransaction: (transaction: any) => Promise<any>
      signAllTransactions: (transactions: any[]) => Promise<any[]>
      publicKey?: { toString: () => string }
      isConnected?: boolean
    }
    backpack?: {
      isBackpack: boolean
      connect: () => Promise<{ publicKey: string | { toString: () => string } }>
      disconnect: () => Promise<void>
      signTransaction: (transaction: any) => Promise<any>
      signAllTransactions: (transactions: any[]) => Promise<any[]>
      publicKey?: { toString: () => string } | string
      isConnected?: boolean
    }
  }
}

export {}
