"use client"

import type React from "react"

import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { ToastProvider } from "@/components/providers/toast-provider"
import { WalletProvider } from "@/components/wallet/wallet-provider"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <WalletProvider>
          <ToastProvider />
          {children}
        </WalletProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
