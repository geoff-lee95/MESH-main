"use client"

import { useState } from "react"
import Image from "next/image"
import { QrCode, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { generateQRCode, verify2FACode, enable2FA } from "@/services/two-factor-service"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface TwoFactorSetupModalProps {
  userId: string
  userEmail: string
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function TwoFactorSetupModal({
  userId,
  userEmail,
  isOpen,
  onClose,
  onSuccess,
}: TwoFactorSetupModalProps) {
  const [currentStep, setCurrentStep] = useState<"setup" | "verify">("setup")
  const [qrCodeData, setQrCodeData] = useState<string>("")
  const [verificationCode, setVerificationCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Generate QR code on modal open
  const handleSetup = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const qrCode = await generateQRCode(userEmail)
      setQrCodeData(qrCode)
    } catch (err) {
      setError("Failed to generate 2FA setup code")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle verification code submission
  const handleVerify = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError("Please enter a 6-digit verification code")
      return
    }

    setIsLoading(true)
    setError(null)
    
    try {
      // Verify the code
      const { error, success } = await verify2FACode(userId, verificationCode)
      
      if (!success) {
        setError(error || "Invalid verification code")
        return
      }
      
      // Enable 2FA in the database
      const result = await enable2FA(userId)
      
      if (!result.success) {
        setError(result.error || "Failed to enable 2FA")
        return
      }
      
      // Success!
      onSuccess()
      onClose()
    } catch (err) {
      setError("An unexpected error occurred")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  // Reset state when modal is closed
  const handleClose = () => {
    setCurrentStep("setup")
    setVerificationCode("")
    setError(null)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Enable Two-Factor Authentication</DialogTitle>
          <DialogDescription>
            Protect your account with two-factor authentication.
          </DialogDescription>
        </DialogHeader>

        <Tabs
          defaultValue="setup"
          value={currentStep}
          onValueChange={(value) => setCurrentStep(value as "setup" | "verify")}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="setup" disabled={isLoading}>Setup</TabsTrigger>
            <TabsTrigger value="verify" disabled={isLoading || !qrCodeData}>Verify</TabsTrigger>
          </TabsList>
          
          <TabsContent value="setup" className="py-4">
            <div className="space-y-4">
              <div className="text-center space-y-2">
                <QrCode className="mx-auto h-12 w-12 text-primary/80" />
                <h3 className="text-lg font-medium">Scan QR Code</h3>
                <p className="text-sm text-muted-foreground">
                  Scan this QR code with an authenticator app like Google Authenticator, Authy, or 1Password.
                </p>
              </div>

              {!qrCodeData ? (
                <Button 
                  className="w-full" 
                  onClick={handleSetup} 
                  disabled={isLoading}
                >
                  {isLoading ? "Generating..." : "Generate QR Code"}
                </Button>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <div className="border p-2 rounded-lg inline-block bg-white">
                    <Image
                      src={qrCodeData}
                      alt="2FA QR Code"
                      width={200}
                      height={200}
                      priority
                    />
                  </div>
                  <div className="text-center text-sm text-muted-foreground">
                    <p>Once scanned, your authenticator app will show a 6-digit code that changes every 30 seconds.</p>
                  </div>
                  <Button 
                    className="w-full" 
                    onClick={() => setCurrentStep("verify")}
                  >
                    Continue to Verification
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="verify" className="py-4">
            <div className="space-y-4">
              <div className="text-center space-y-2">
                <Check className="mx-auto h-12 w-12 text-primary/80" />
                <h3 className="text-lg font-medium">Verify Setup</h3>
                <p className="text-sm text-muted-foreground">
                  Enter the 6-digit code currently shown in your authenticator app to complete the setup.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="verification-code">Verification Code</Label>
                <Input
                  id="verification-code"
                  placeholder="000000"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                  maxLength={6}
                  className="text-center text-xl tracking-widest"
                />
                {error && <p className="text-sm text-destructive">{error}</p>}
              </div>

              <div className="text-sm text-muted-foreground">
                <p className="mb-2">Important:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Keep your authenticator app safe and accessible.</li>
                  <li>You'll need a code from this app every time you log in.</li>
                  <li>Consider setting up backup options in case you lose access to your device.</li>
                </ul>
              </div>

              <Button 
                className="w-full" 
                onClick={handleVerify}
                disabled={isLoading || verificationCode.length !== 6}
              >
                {isLoading ? "Verifying..." : "Enable 2FA"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between">
          <Button
            variant="outline"
            onClick={handleClose}
            className="mt-2 sm:mt-0"
            disabled={isLoading}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 