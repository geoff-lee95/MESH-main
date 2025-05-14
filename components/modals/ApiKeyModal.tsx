"use client"

import { useState } from "react"
import { Copy, Check, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ApiKeyModalProps {
  isOpen: boolean
  onClose: () => void
  apiKey: string
}

export function ApiKeyModal({
  isOpen,
  onClose,
  apiKey,
}: ApiKeyModalProps) {
  const [copied, setCopied] = useState(false)
  const [showKey, setShowKey] = useState(false)
  
  // Copy API key to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  
  // Toggle key visibility
  const toggleKeyVisibility = () => {
    setShowKey(!showKey)
  }
  
  // Mask API key
  const maskKey = (key: string) => {
    if (!key) return ''
    const prefix = key.substring(0, 5)
    const suffix = key.substring(key.length - 5)
    return `${prefix}${'.'.repeat(20)}${suffix}`
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Your New API Key</DialogTitle>
          <DialogDescription>
            Copy your API key now. For security reasons, we won't show it again.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <Alert className="bg-amber-50 text-amber-900 border-amber-200">
            <AlertDescription>
              Store this key securely. Treat it like a password - anyone with this key can access the MESH API on your behalf.
            </AlertDescription>
          </Alert>
          
          <div className="space-y-2">
            <div className="flex relative">
              <div className="relative flex-1">
                <Input
                  readOnly
                  value={showKey ? apiKey : maskKey(apiKey)}
                  className="font-mono text-sm pr-20"
                  type={showKey ? "text" : "password"}
                />
                <div className="absolute inset-y-0 right-0 flex items-center">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-full rounded-none px-2"
                    onClick={toggleKeyVisibility}
                  >
                    {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-full rounded-none px-2"
                    onClick={copyToClipboard}
                  >
                    {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              {copied ? 'Copied to clipboard!' : 'Click to copy'}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="default" onClick={onClose}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 