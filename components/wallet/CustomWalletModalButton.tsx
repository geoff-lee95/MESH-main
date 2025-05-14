"use client"

import { useState } from "react"
import { Wallet } from "lucide-react"
import { useWalletModal } from "@solana/wallet-adapter-react-ui"
import { useWallet } from "@solana/wallet-adapter-react"
import { Button } from "@/components/ui/button"

interface CustomWalletModalButtonProps {
  className?: string
}

export function CustomWalletModalButton({ className = "" }: CustomWalletModalButtonProps) {
  const { connected, connecting, publicKey, disconnect } = useWallet()
  const { setVisible } = useWalletModal()
  const [isHovering, setIsHovering] = useState(false)

  const displayAddress = connected && publicKey ? `${publicKey.toString().slice(0, 4)}...${publicKey.toString().slice(-4)}` : "Connect Wallet"

  const handleClick = () => {
    if (connected && isHovering) {
      disconnect()
    } else {
      setVisible(true)
    }
  }

  return (
    <Button
      className={`w-full ${className}`}
      onClick={handleClick}
      disabled={connecting}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Wallet className="mr-2 h-4 w-4" />
      {connected && isHovering ? "Disconnect" : displayAddress}
    </Button>
  )
} 