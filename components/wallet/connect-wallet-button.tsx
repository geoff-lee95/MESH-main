"use client"

import { useState } from "react"
import { Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useWallet } from "@solana/wallet-adapter-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ConnectWalletButtonProps {
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export function ConnectWalletButton({
  variant = "default",
  size = "default",
  className = "",
}: ConnectWalletButtonProps) {
  const { connected, connecting, connect, disconnect, publicKey, wallet } = useWallet()
  const [isHovering, setIsHovering] = useState(false)

  const handleClick = () => {
    if (
      connected &&
      wallet &&
      wallet.adapter &&
      (wallet.readyState === "Installed" || wallet.readyState === "Loadable")
    ) {
      disconnect()
    } else {
      connect()
    }
  }

  const displayAddress = connected && publicKey ? `${publicKey.toString().slice(0, 4)}...${publicKey.toString().slice(-4)}` : "Connect Wallet"

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={variant}
            size={size}
            className={className}
            onClick={handleClick}
            disabled={connecting}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <Wallet className="mr-2 h-4 w-4" />
            {connected && isHovering ? "Disconnect" : displayAddress}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {connected && publicKey ? `Connected: ${publicKey.toString().slice(0, 4)}...${publicKey.toString().slice(-4)}` : "Connect your Solana wallet to pay for intents"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
