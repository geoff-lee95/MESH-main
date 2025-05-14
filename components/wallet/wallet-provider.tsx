"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { PublicKey } from "@solana/web3.js"
import { toast } from "@/components/ui/use-toast"
import { ConnectionProvider, WalletProvider as SolanaWalletProvider } from "@solana/wallet-adapter-react"
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom"
import { SolflareWalletAdapter } from "@solana/wallet-adapter-solflare"
import { BackpackWalletAdapter } from "@solana/wallet-adapter-backpack"
import { useMemo } from "react"
import "@solana/wallet-adapter-react-ui/styles.css"
import { useWallet as useSolanaWallet } from "@solana/wallet-adapter-react"

// Define the wallet metadata type
export interface WalletMetadata {
  address: string
  provider: string
  nickname?: string
  iconUrl?: string
}

// Define the wallet adapter interface
interface WalletAdapter {
  publicKey: PublicKey | null
  connected: boolean
  connecting: boolean
  connect: () => Promise<void>
  disconnect: () => Promise<void>
  signTransaction: (transaction: any) => Promise<any>
  signAllTransactions: (transactions: any[]) => Promise<any[]>
  signMessage: (message: Uint8Array) => Promise<{ signature: Uint8Array }>
}

// Define the wallet context type
interface WalletContextType {
  wallet: WalletAdapter | null
  publicKey: PublicKey | null
  connected: boolean
  connecting: boolean
  connect: () => Promise<void>
  disconnect: () => Promise<void>
  walletAddress: string
  solanaExplorerUrl: string
  wallets: WalletMetadata[]
  addWallet: (wallet: WalletMetadata) => void
  removeWallet: (address: string) => void
  setPrimaryWallet: (address: string) => void
  primaryWallet: WalletMetadata | null
}

// Create the wallet context
const WalletContext = createContext<WalletContextType>({
  wallet: null,
  publicKey: null,
  connected: false,
  connecting: false,
  connect: async () => {},
  disconnect: async () => {},
  walletAddress: "",
  solanaExplorerUrl: "",
  wallets: [],
  addWallet: () => {},
  removeWallet: () => {},
  setPrimaryWallet: () => {},
  primaryWallet: null,
})

// Wallet provider component
export function WalletProvider({ children }: { children: ReactNode }) {
  // You can set this to mainnet-beta, testnet, or devnet
  const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK || "devnet"
  const endpoint = useMemo(() =>
    network === "mainnet-beta"
      ? "https://api.mainnet-beta.solana.com"
      : network === "testnet"
      ? "https://api.testnet.solana.com"
      : "https://api.devnet.solana.com",
    [network]
  )

  // Wallets you want to support
  const wallets = useMemo(
    () => [
      new BackpackWalletAdapter(),
      // Add more non-standard adapters here if needed
    ],
    []
  )

  // New: Manage wallet metadata state
  const [walletsState, setWalletsState] = useState<WalletMetadata[]>([])
  const [primaryWallet, setPrimaryWalletState] = useState<WalletMetadata | null>(null)

  // New: Add wallet
  const addWallet = (wallet: WalletMetadata) => {
    setWalletsState((prev) => {
      if (prev.find((w) => w.address === wallet.address)) return prev // Prevent duplicates
      return [...prev, wallet]
    })
    // Optionally set as primary if none exists
    setPrimaryWalletState((prev) => prev || wallet)
  }

  // New: Remove wallet
  const removeWallet = (address: string) => {
    setWalletsState((prev) => prev.filter((w) => w.address !== address))
    setPrimaryWalletState((prev) => (prev && prev.address === address ? null : prev))
  }

  // New: Set primary wallet
  const setPrimaryWallet = (address: string) => {
    const found = walletsState.find((w) => w.address === address)
    if (found) setPrimaryWalletState(found)
  }

  return (
    <ConnectionProvider endpoint={endpoint}>
      <SolanaWalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <WalletContext.Provider
            value={{
              wallet: null, // You may want to wire this up to the actual wallet adapter
              publicKey: null, // Ditto
              connected: false, // Ditto
              connecting: false, // Ditto
              connect: async () => {}, // Ditto
              disconnect: async () => {}, // Ditto
              walletAddress: "", // Ditto
              solanaExplorerUrl: "", // Ditto
              wallets: walletsState,
              addWallet,
              removeWallet,
              setPrimaryWallet,
              primaryWallet,
            }}
          >
            {children}
          </WalletContext.Provider>
        </WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  )
}

// Export the hook from Solana wallet adapter
export { useSolanaWallet as useWallet }
