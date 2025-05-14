import React, { useState } from "react"
import { WalletMetadata } from "./wallet-provider"

export interface WalletItemProps {
  wallet: WalletMetadata
  isPrimary: boolean
  onSetPrimary: () => void
  onRemove: () => void
  onEditNickname?: (nickname: string) => void
}

const providerIcons: Record<string, string> = {
  phantom: "/wallets/phantom.svg",
  solflare: "/wallets/solflare.svg",
  backpack: "/wallets/backpack.svg",
  // Add more as needed
}

export function WalletItem({ wallet, isPrimary, onSetPrimary, onRemove, onEditNickname }: WalletItemProps) {
  const [editing, setEditing] = useState(false)
  const [nickname, setNickname] = useState(wallet.nickname || "")

  const handleEdit = () => setEditing(true)
  const handleBlur = () => {
    setEditing(false)
    if (onEditNickname && nickname !== wallet.nickname) onEditNickname(nickname)
  }
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setEditing(false)
      if (onEditNickname && nickname !== wallet.nickname) onEditNickname(nickname)
    }
  }

  const iconUrl = wallet.iconUrl || providerIcons[wallet.provider?.toLowerCase?.()] || undefined

  return (
    <li className={`flex items-center justify-between rounded-md border px-4 py-2 ${isPrimary ? "border-primary bg-primary/10" : "border-input"}`}>
      <div className="flex items-center gap-3">
        {/* Provider icon or fallback */}
        <span className="inline-block w-6 h-6 rounded-full bg-muted flex items-center justify-center">
          {iconUrl ? (
            <img src={iconUrl} alt={wallet.provider} className="w-4 h-4" />
          ) : (
            <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><circle cx="8" cy="8" r="8" fill="#6366F1" /></svg>
          )}
        </span>
        <span className="font-mono text-xs">{wallet.address.slice(0, 4)}...{wallet.address.slice(-4)}</span>
        {editing ? (
          <input
            className="ml-2 text-xs px-1 rounded border border-input bg-background text-muted-foreground w-24"
            value={nickname}
            onChange={e => setNickname(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        ) : (
          wallet.nickname && <span className="ml-2 text-xs text-muted-foreground">({wallet.nickname})</span>
        )}
        {onEditNickname && !editing && (
          <button className="ml-1 text-xs text-blue-500 underline" onClick={handleEdit}>Edit</button>
        )}
        {isPrimary && <span className="ml-2 px-2 py-0.5 rounded bg-primary text-primary-foreground text-xs">Primary</span>}
      </div>
      <div className="flex items-center gap-2">
        {!isPrimary && (
          <button onClick={onSetPrimary} className="text-xs px-2 py-1 rounded bg-muted hover:bg-primary/20">Set as Primary</button>
        )}
        <button onClick={onRemove} className="text-xs px-2 py-1 rounded bg-destructive text-white hover:bg-destructive/80">Remove</button>
      </div>
    </li>
  )
} 