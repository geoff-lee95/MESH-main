import React from "react"
import { WalletMetadata } from "./wallet-provider"
import { WalletItem } from "./WalletItem"
// If the error persists, try: import { WalletItem } from "./WalletItem.tsx"

export interface WalletListProps {
  wallets: WalletMetadata[]
  primaryWallet?: string
  onSetPrimary: (address: string) => void
  onRemove: (address: string) => void
  onEditNickname?: (address: string, nickname: string) => void
}

export function WalletList({ wallets, primaryWallet, onSetPrimary, onRemove, onEditNickname }: WalletListProps) {
  if (!wallets.length) {
    return <p className="text-muted-foreground text-sm">No wallets connected.</p>
  }
  return (
    <ul className="space-y-2">
      {wallets.map((wallet) => (
        <WalletItem
          key={wallet.address}
          wallet={wallet}
          isPrimary={primaryWallet === wallet.address}
          onSetPrimary={() => onSetPrimary(wallet.address)}
          onRemove={() => onRemove(wallet.address)}
          onEditNickname={onEditNickname ? (nickname: string) => onEditNickname(wallet.address, nickname) : undefined}
        />
      ))}
    </ul>
  )
} 