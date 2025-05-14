"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { 
  Bell, 
  Check,
  Key, 
  Lock, 
  LogOut, 
  Network, 
  Save, 
  Shield, 
  User, 
  Wallet,
  Check as CheckIcon
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar" 
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { ReactNode } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { WalletList } from "@/components/wallet/WalletList"
import { CustomWalletModalButton } from "@/components/wallet/CustomWalletModalButton"
import { TwoFactorSetupModal } from "@/components/modals/TwoFactorSetupModal"
import { ApiKeyModal } from "@/components/modals/ApiKeyModal"
import { is2FAEnabled, disable2FA } from "@/services/two-factor-service"
import { generateApiKey } from "@/services/api-key-service"
import { Badge } from "@/components/ui/badge"

// TabItem component to properly handle icon and text
interface TabItemProps {
  icon: ReactNode;
  children: ReactNode;
}

function TabItem({ icon, children }: TabItemProps) {
  return (
    <div className="flex items-center">
      <div className="mr-2">{icon}</div>
      <div>{children}</div>
    </div>
  );
}

function WalletListItem({ address, isPrimary, onSetPrimary, onRemove }: { address: string, isPrimary: boolean, onSetPrimary: () => void, onRemove: () => void }) {
  // Optionally, you can add logic to detect provider by address or metadata
  return (
    <li className={`flex items-center justify-between rounded-md border px-4 py-2 ${isPrimary ? "border-primary bg-primary/10" : "border-input"}`}>
      <div className="flex items-center gap-3">
        {/* Placeholder for provider icon */}
        <span className="inline-block w-6 h-6 rounded-full bg-muted flex items-center justify-center">
          <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><circle cx="8" cy="8" r="8" fill="#6366F1" /></svg>
        </span>
        <span className="font-mono text-xs">{address.slice(0, 4)}...{address.slice(-4)}</span>
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

export default function SettingsPage() {
  const { toast } = useToast()
  const { user, profile, updateProfile, refreshProfile, setPrimaryWallet, removeWallet, addWallet, signOut } = useAuth()
  const { connected, publicKey } = useWallet()
  
  // Form states
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    intentUpdates: true,
    agentActivity: true,
    marketplaceUpdates: false,
    securityAlerts: true,
  })
  const [profileData, setProfileData] = useState({
    name: profile?.full_name || "User",
    email: user?.email || "user@example.com",
    bio: profile?.bio || "MESH network developer and agent creator.",
    website: profile?.website || "",
    github: profile?.github || "",
    twitter: profile?.twitter || ""
  })
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: ""
  })
  const [isSaving, setIsSaving] = useState(false)
  const [savedState, setSavedState] = useState({
    profile: false,
    notifications: false,
    security: false
  })
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || "")
  const [avatarLoading, setAvatarLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [walletNicknames, setWalletNicknames] = useState<Record<string, string>>({})
  const [optimisticWallets, setOptimisticWallets] = useState<string[]>(profile?.wallets || [])
  const [optimisticPrimary, setOptimisticPrimary] = useState<string | undefined>(profile?.primary_wallet || undefined)
  const [walletLoading, setWalletLoading] = useState<string | null>(null)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [showTwoFactorModal, setShowTwoFactorModal] = useState(false)
  const [securityLoading, setSecurityLoading] = useState(false)
  const [showApiKeyModal, setShowApiKeyModal] = useState(false)
  const [apiKey, setApiKey] = useState<string>("")
  const [apiKeyLoading, setApiKeyLoading] = useState(false)

  useEffect(() => {
    if (connected && publicKey) {
      const address = publicKey.toString()
      if (!profile?.wallets?.includes(address)) {
        addWallet(address).then(({ success, error }) => {
          if (success) {
            toast({ title: "Wallet added", description: `Wallet ${address.slice(0, 4)}...${address.slice(-4)} added to your account.` })
          } else if (error) {
            toast({ title: "Error adding wallet", description: error, variant: "destructive" })
          }
        })
      }
    }
    setOptimisticWallets(profile?.wallets || [])
    setOptimisticPrimary(profile?.primary_wallet || undefined)
  }, [connected, publicKey, profile?.wallets, profile?.primary_wallet])

  // Check 2FA status on component mount
  useEffect(() => {
    if (user) {
      const check2FAStatus = async () => {
        const enabled = await is2FAEnabled(user.id)
        setTwoFactorEnabled(enabled)
      }
      check2FAStatus()
    }
  }, [user])

  // Handle form submissions
  const handleSaveProfile = async () => {
    setIsSaving(true)
    
    try {
      // Update the profile in the database with all fields including the new ones
      const { error, success } = await updateProfile({
        full_name: profileData.name,
        bio: profileData.bio,
        website: profileData.website,
        github: profileData.github,
        twitter: profileData.twitter
      })
      
      if (success) {
        setSavedState({ ...savedState, profile: true })
        
        toast({
          title: "Profile updated",
          description: "Your profile information has been saved successfully.",
        })
        
        // Reset saved state after a delay
        setTimeout(() => setSavedState({ ...savedState, profile: false }), 3000)
      } else {
        toast({
          title: "Error updating profile",
          description: error || "Failed to update profile information.",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred while updating your profile.",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }
  
  const handleSaveNotifications = () => {
    setIsSaving(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
      setSavedState({ ...savedState, notifications: true })
      
      toast({
        title: "Notification preferences updated",
        description: "Your notification settings have been saved.",
      })
      
      // Reset saved state after a delay
      setTimeout(() => setSavedState({ ...savedState, notifications: false }), 3000)
    }, 800)
  }
  
  const handleUpdatePassword = () => {
    // Validation
    if (passwords.new !== passwords.confirm) {
      toast({
        title: "Passwords don't match",
        description: "Your new password and confirmation don't match.",
        variant: "destructive"
      })
      return
    }
    
    if (passwords.new.length < 8) {
      toast({
        title: "Password too short",
        description: "Your password must be at least 8 characters long.",
        variant: "destructive"
      })
      return
    }
    
    setIsSaving(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
      setSavedState({ ...savedState, security: true })
      
      // Reset password fields
      setPasswords({
        current: "",
        new: "",
        confirm: ""
      })
      
      toast({
        title: "Password updated",
        description: "Your password has been changed successfully.",
      })
      
      // Reset saved state after a delay
      setTimeout(() => setSavedState({ ...savedState, security: false }), 3000)
    }, 800)
  }

  // Helper to get provider from address (stub for now)
  const getProvider = (address: string) => "unknown"
  // Helper to get icon (stub for now)
  // const getIconUrl = (provider: string) => undefined

  // Optimistic set primary wallet
  const handleSetPrimary = async (address: string) => {
    setWalletLoading(address)
    const prevPrimary = optimisticPrimary
    setOptimisticPrimary(address)
    const { error, success } = await setPrimaryWallet(address)
    setWalletLoading(null)
    if (success) {
      toast({ title: "Primary wallet set", description: "This wallet is now your primary wallet." })
    } else {
      setOptimisticPrimary(prevPrimary)
      toast({ title: "Error", description: error || "Failed to set primary wallet.", variant: "destructive" })
    }
  }

  // Optimistic remove wallet
  const handleRemoveWallet = async (address: string) => {
    if (!window.confirm("Are you sure you want to remove this wallet?")) return
    setWalletLoading(address)
    const prevWallets = optimisticWallets
    setOptimisticWallets((prev) => prev.filter((a) => a !== address))
    if (optimisticPrimary === address) setOptimisticPrimary(undefined)
    const { error, success } = await removeWallet(address)
    setWalletLoading(null)
    if (success) {
      toast({ title: "Wallet removed", description: "Wallet has been removed from your account." })
    } else {
      setOptimisticWallets(prevWallets)
      toast({ title: "Error", description: error || "Failed to remove wallet.", variant: "destructive" })
    }
  }

  // Optimistic edit nickname (local only for now)
  const handleEditNickname = (address: string, nickname: string) => {
    setWalletNicknames((prev) => ({ ...prev, [address]: nickname }))
    // If backend persistence is added, implement optimistic rollback here
  }

  // Handle 2FA success
  const handle2FASuccess = () => {
    setTwoFactorEnabled(true)
    toast({ 
      title: "Two-Factor Authentication Enabled", 
      description: "Your account is now protected with 2FA."
    })
  }

  // Handle API key generation
  const handleGenerateApiKey = async () => {
    if (!user) return
    
    setApiKeyLoading(true)
    try {
      const { key, error } = await generateApiKey(user.id)
      
      if (error || !key) {
        toast({ 
          title: "Error", 
          description: error || "Failed to generate API key.", 
          variant: "destructive" 
        })
        return
      }
      
      // Set the key and show the modal
      setApiKey(key)
      setShowApiKeyModal(true)
      
      toast({ 
        title: "API Key Generated", 
        description: "Your new API key has been created." 
      })
    } catch (error) {
      console.error(error)
      toast({ 
        title: "Error", 
        description: "An unexpected error occurred.", 
        variant: "destructive" 
      })
    } finally {
      setApiKeyLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 px-4 md:px-6 py-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl font-light tracking-tight">Settings</h1>
            <p className="text-muted-foreground mt-1">
              Manage your account settings and preferences
            </p>
          </div>

          <Tabs defaultValue="profile" className="w-full">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-64 space-y-6">
                <div className="sticky top-20">
                  <TabsList className="flex flex-col h-auto p-0 bg-transparent w-full [&_span]:!flex [&_span]:!items-center">
                    <TabsTrigger 
                      value="profile" 
                      className="inline-flex w-full items-center justify-start px-4 py-3 h-10 data-[state=active]:bg-muted text-left"
                    >
                      <TabItem icon={<User className="h-4 w-4" />}>
                        Profile
                      </TabItem>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="wallet" 
                      className="inline-flex w-full items-center justify-start px-4 py-3 h-10 data-[state=active]:bg-muted text-left"
                    >
                      <TabItem icon={<Wallet className="h-4 w-4" />}>
                        Wallet
                      </TabItem>
                    </TabsTrigger>
                    <TabsTrigger
                      value="notifications"
                      className="inline-flex w-full items-center justify-start px-4 py-3 h-10 data-[state=active]:bg-muted text-left"
                    >
                      <TabItem icon={<Bell className="h-4 w-4" />}>
                        Notifications
                      </TabItem>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="security" 
                      className="inline-flex w-full items-center justify-start px-4 py-3 h-10 data-[state=active]:bg-muted text-left"
                    >
                      <TabItem icon={<Shield className="h-4 w-4" />}>
                        Security
                      </TabItem>
                    </TabsTrigger>

                    <Separator className="my-4" />
                    <Button 
                      variant="ghost" 
                      className="inline-flex w-full items-center justify-start px-4 py-3 h-10 text-left"
                      onClick={async () => {
                        await signOut();
                        window.location.href = "/auth/sign-in";
                      }}
                    >
                      <TabItem icon={<LogOut className="h-4 w-4" />}>
                        Log Out
                      </TabItem>
                    </Button>
                  </TabsList>
                </div>
              </div>
              
              <div className="flex-1 space-y-6">
                <TabsContent value="profile" className="mt-0 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Profile Information</CardTitle>
                      <CardDescription>Update your personal information and public profile</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex flex-col md:flex-row gap-6 md:items-center">
                        <Avatar className="h-24 w-24 border-2 border-border">
                          {avatarUrl ? (
                            <AvatarImage src={avatarUrl} alt={profileData.name || "User"} />
                          ) : null}
                          <AvatarFallback className="text-2xl">
                            {(profileData.name.charAt(0) || "U").toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="text-lg font-light">Profile Picture</h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            Upload a profile picture to personalize your account
                          </p>
                          <div className="flex gap-2">
                            <input
                              type="file"
                              accept="image/*"
                              ref={fileInputRef}
                              style={{ display: "none" }}
                              onChange={async (e) => {
                                const file = e.target.files?.[0]
                                if (!file) return
                                setAvatarLoading(true)
                                const reader = new FileReader()
                                reader.onload = async (ev) => {
                                  const dataUrl = ev.target?.result as string
                                  setAvatarUrl(dataUrl)
                                  // Persist to backend
                                  const { error, success } = await updateProfile({ avatar_url: dataUrl })
                                  setAvatarLoading(false)
                                  if (success) {
                                    toast({ title: "Profile picture updated", description: "Your profile picture has been updated." })
                                  } else {
                                    toast({ title: "Error updating profile picture", description: error || "Failed to update profile picture.", variant: "destructive" })
                                  }
                                }
                                reader.readAsDataURL(file)
                              }}
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => fileInputRef.current?.click()}
                              disabled={avatarLoading}
                            >
                              {avatarLoading ? "Uploading..." : "Upload"}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={async () => {
                                setAvatarLoading(true)
                                const { error, success } = await updateProfile({ avatar_url: "" })
                                setAvatarLoading(false)
                                if (success) {
                                  setAvatarUrl("")
                                  toast({ title: "Profile picture removed", description: "Your profile picture has been removed." })
                                } else {
                                  toast({ title: "Error removing profile picture", description: error || "Failed to remove profile picture.", variant: "destructive" })
                                }
                              }}
                              disabled={avatarLoading || !avatarUrl}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="grid gap-5">
                        <div className="grid gap-2">
                          <Label htmlFor="name">Name</Label>
                          <Input 
                            id="name" 
                            placeholder="Your name" 
                            value={profileData.name}
                            onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="email">Email</Label>
                          <Input 
                            id="email" 
                            type="email" 
                            placeholder="Your email" 
                            value={profileData.email}
                            onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="bio">Bio</Label>
                          <textarea
                            id="bio"
                            className="min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Tell us about yourself"
                            value={profileData.bio}
                            onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                          />
                        </div>
                        
                        <Separator className="my-2" />
                        <h3 className="text-sm font-medium">Social Profiles</h3>
                        
                        <div className="grid gap-2">
                          <Label htmlFor="website">Website</Label>
                          <Input 
                            id="website" 
                            placeholder="https://yourwebsite.com" 
                            value={profileData.website}
                            onChange={(e) => setProfileData({...profileData, website: e.target.value})}
                          />
                        </div>
                        
                        <div className="grid gap-2">
                          <Label htmlFor="github">GitHub</Label>
                          <Input 
                            id="github" 
                            placeholder="Your GitHub username" 
                            value={profileData.github}
                            onChange={(e) => setProfileData({...profileData, github: e.target.value})}
                          />
                          <p className="text-xs text-muted-foreground">github.com/<span className="font-medium">username</span></p>
                        </div>
                        
                        <div className="grid gap-2">
                          <Label htmlFor="twitter">Twitter / X</Label>
                          <Input 
                            id="twitter" 
                            placeholder="Your Twitter/X username" 
                            value={profileData.twitter}
                            onChange={(e) => setProfileData({...profileData, twitter: e.target.value})}
                          />
                          <p className="text-xs text-muted-foreground">twitter.com/<span className="font-medium">username</span></p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t border-input px-6 py-4 flex justify-between">
                      <p className="text-sm text-muted-foreground">
                        {savedState.profile && (
                          <span className="flex items-center text-green-500">
                            <CheckIcon className="h-4 w-4 mr-1" /> Saved successfully
                          </span>
                        )}
                      </p>
                      <Button onClick={handleSaveProfile} disabled={isSaving}>
                        {isSaving ? (
                          <div className="flex items-center">
                            <div className="h-4 w-4 mr-2 rounded-full border-2 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
                            Saving...
                          </div>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
                
                <TabsContent value="wallet" className="mt-0 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Wallet</CardTitle>
                      <CardDescription>Manage your connected wallets and transactions</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="mb-4">
                        <CustomWalletModalButton className="w-full" />
                      </div>
                      <div className="space-y-4">
                        <h3 className="font-medium mb-2">Connected Wallets</h3>
                        <WalletList
                          wallets={optimisticWallets.map((address: string) => ({
                            address,
                            provider: getProvider(address),
                            nickname: walletNicknames[address],
                          }))}
                          primaryWallet={optimisticPrimary}
                          onSetPrimary={handleSetPrimary}
                          onRemove={handleRemoveWallet}
                          onEditNickname={handleEditNickname}
                        />
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h3 className="font-medium mb-3">Recent Transactions</h3>
                        <div className="space-y-2 rounded-lg border border-input p-1">
                          <div className="flex items-center justify-between rounded-md p-3 hover:bg-muted cursor-pointer transition-colors">
                            <div>
                              <div className="font-medium">Intent Reward</div>
                              <div className="text-sm text-muted-foreground">May 10, 2025</div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium text-green-500">+25 SOL</div>
                              <div className="text-xs text-muted-foreground">Completed</div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between rounded-md p-3 hover:bg-muted cursor-pointer transition-colors">
                            <div>
                              <div className="font-medium">Agent Deployment</div>
                              <div className="text-sm text-muted-foreground">May 8, 2025</div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium text-destructive">-0.5 SOL</div>
                              <div className="text-xs text-muted-foreground">Completed</div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between rounded-md p-3 hover:bg-muted cursor-pointer transition-colors">
                            <div>
                              <div className="font-medium">Intent Publication</div>
                              <div className="text-sm text-muted-foreground">May 7, 2025</div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium text-destructive">-0.01 SOL</div>
                              <div className="text-xs text-muted-foreground">Completed</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t border-input px-6 py-4">
                      <Link href="/dashboard/transactions" className="w-full">
                        <Button variant="outline" className="w-full">
                          View All Transactions
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                </TabsContent>
                
                <TabsContent value="notifications" className="mt-0 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Notifications</CardTitle>
                      <CardDescription>Manage your notification preferences</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="font-medium text-lg">Notification Channels</h3>
                        <div className="space-y-4 rounded-lg border border-input p-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label htmlFor="email-notifications" className="text-base">Email Notifications</Label>
                              <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                            </div>
                            <div className="flex items-center gap-2">
                              {notifications.email && <Check className="h-4 w-4 text-green-500" />}
                              <Switch
                                id="email-notifications"
                                checked={notifications.email}
                                onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                              />
                            </div>
                          </div>
                          <Separator />
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label htmlFor="push-notifications" className="text-base">Push Notifications</Label>
                              <p className="text-sm text-muted-foreground">Receive notifications in your browser</p>
                            </div>
                            <div className="flex items-center gap-2">
                              {notifications.push && <Check className="h-4 w-4 text-green-500" />}
                              <Switch
                                id="push-notifications"
                                checked={notifications.push}
                                onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="font-medium text-lg">Notification Types</h3>
                        <div className="space-y-4 rounded-lg border border-input p-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label htmlFor="intent-updates" className="text-base">Intent Updates</Label>
                              <p className="text-sm text-muted-foreground">Notifications about your published intents</p>
                            </div>
                            <div className="flex items-center gap-2">
                              {notifications.intentUpdates && <Check className="h-4 w-4 text-green-500" />}
                              <Switch
                                id="intent-updates"
                                checked={notifications.intentUpdates}
                                onCheckedChange={(checked) =>
                                  setNotifications({ ...notifications, intentUpdates: checked })
                                }
                              />
                            </div>
                          </div>
                          <Separator />
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label htmlFor="agent-activity" className="text-base">Agent Activity</Label>
                              <p className="text-sm text-muted-foreground">Notifications about your agents' activities</p>
                            </div>
                            <div className="flex items-center gap-2">
                              {notifications.agentActivity && <Check className="h-4 w-4 text-green-500" />}
                              <Switch
                                id="agent-activity"
                                checked={notifications.agentActivity}
                                onCheckedChange={(checked) =>
                                  setNotifications({ ...notifications, agentActivity: checked })
                                }
                              />
                            </div>
                          </div>
                          <Separator />
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label htmlFor="marketplace-updates" className="text-base">Marketplace Updates</Label>
                              <p className="text-sm text-muted-foreground">
                                Notifications about new intents in the marketplace
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              {notifications.marketplaceUpdates && <Check className="h-4 w-4 text-green-500" />}
                              <Switch
                                id="marketplace-updates"
                                checked={notifications.marketplaceUpdates}
                                onCheckedChange={(checked) =>
                                  setNotifications({ ...notifications, marketplaceUpdates: checked })
                                }
                              />
                            </div>
                          </div>
                          <Separator />
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label htmlFor="security-alerts" className="text-base">Security Alerts</Label>
                              <p className="text-sm text-muted-foreground">Important security notifications</p>
                            </div>
                            <div className="flex items-center gap-2">
                              {notifications.securityAlerts && <Check className="h-4 w-4 text-green-500" />}
                              <Switch
                                id="security-alerts"
                                checked={notifications.securityAlerts}
                                onCheckedChange={(checked) =>
                                  setNotifications({ ...notifications, securityAlerts: checked })
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t border-input px-6 py-4 flex justify-between">
                      <p className="text-sm text-muted-foreground">
                        {savedState.notifications && (
                          <span className="flex items-center text-green-500">
                            <CheckIcon className="h-4 w-4 mr-1" /> Saved successfully
                          </span>
                        )}
                      </p>
                      <Button onClick={handleSaveNotifications} disabled={isSaving}>
                        {isSaving ? (
                          <div className="flex items-center">
                            <div className="h-4 w-4 mr-2 rounded-full border-2 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
                            Saving...
                          </div>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Preferences
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
                
                <TabsContent value="security" className="mt-0 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Security</CardTitle>
                      <CardDescription>Manage your account security settings</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="font-medium text-lg">Change Password</h3>
                        <div className="space-y-4 rounded-lg border border-input p-4">
                          <div className="grid gap-3">
                            <Label htmlFor="current-password">Current Password</Label>
                            <Input 
                              id="current-password" 
                              type="password" 
                              value={passwords.current}
                              onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                            />
                          </div>
                          <div className="grid gap-3">
                            <Label htmlFor="new-password">New Password</Label>
                            <Input 
                              id="new-password" 
                              type="password" 
                              value={passwords.new}
                              onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                            />
                          </div>
                          <div className="grid gap-3">
                            <Label htmlFor="confirm-password">Confirm New Password</Label>
                            <Input 
                              id="confirm-password" 
                              type="password" 
                              value={passwords.confirm}
                              onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                            />
                          </div>
                          
                          <div className="pt-2 flex justify-between items-center">
                            <p className="text-sm text-muted-foreground">
                              {savedState.security && (
                                <span className="flex items-center text-green-500">
                                  <CheckIcon className="h-4 w-4 mr-1" /> Password updated
                                </span>
                              )}
                            </p>
                            <Button 
                              onClick={handleUpdatePassword} 
                              disabled={isSaving || !passwords.current || !passwords.new || !passwords.confirm}
                            >
                              {isSaving ? (
                                <div className="flex items-center">
                                  <div className="h-4 w-4 mr-2 rounded-full border-2 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
                                  Updating...
                                </div>
                              ) : (
                                <>
                                  <Lock className="mr-2 h-4 w-4" />
                                  Update Password
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="font-medium text-lg">Two-Factor Authentication</h3>
                        <div className="rounded-lg border border-input p-4">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium">Two-Factor Authentication</h4>
                                {twoFactorEnabled ? (
                                  <Badge className="bg-green-600">Enabled</Badge>
                                ) : (
                                  <Badge variant="outline" className="text-muted-foreground">Disabled</Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {twoFactorEnabled 
                                  ? "Your account is protected with two-factor authentication."
                                  : "Add an extra layer of security to your account by requiring a verification code."}
                              </p>
                            </div>
                            {twoFactorEnabled ? (
                              <Button 
                                variant="outline" 
                                className="border-destructive text-destructive hover:bg-destructive/10"
                                disabled={securityLoading} 
                                onClick={async () => {
                                  if (!user) return
                                  if (confirm("Are you sure you want to disable two-factor authentication? This will make your account less secure.")) {
                                    setSecurityLoading(true)
                                    try {
                                      const { error, success } = await disable2FA(user.id)
                                      if (success) {
                                        setTwoFactorEnabled(false)
                                        toast({ 
                                          title: "Two-Factor Authentication Disabled", 
                                          description: "2FA has been disabled for your account."
                                        })
                                      } else {
                                        toast({ 
                                          title: "Error", 
                                          description: error || "Failed to disable 2FA.",
                                          variant: "destructive"
                                        })
                                      }
                                    } catch (error) {
                                      console.error(error)
                                      toast({ 
                                        title: "Error", 
                                        description: "An unexpected error occurred.",
                                        variant: "destructive"
                                      })
                                    } finally {
                                      setSecurityLoading(false)
                                    }
                                  }
                                }}
                              >
                                <Shield className="mr-2 h-4 w-4" />
                                {securityLoading ? "Disabling..." : "Disable 2FA"}
                              </Button>
                            ) : (
                              <Button 
                                onClick={() => setShowTwoFactorModal(true)}
                                disabled={securityLoading}
                              >
                                <Shield className="mr-2 h-4 w-4" />
                                {securityLoading ? "Processing..." : "Set Up 2FA"}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="font-medium text-lg">API Keys</h3>
                        <div className="rounded-lg border border-input p-4">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                              <h4 className="font-medium">Developer API Key</h4>
                              <p className="text-sm text-muted-foreground">For integrating with the MESH API</p>
                            </div>
                            <Button 
                              onClick={handleGenerateApiKey} 
                              disabled={apiKeyLoading}
                            >
                              <Key className="mr-2 h-4 w-4" />
                              {apiKeyLoading ? "Generating..." : "Generate Key"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                

              </div>
            </div>
          </Tabs>
        </div>
      </main>
      
      {/* 2FA Setup Modal */}
      {user && (
        <TwoFactorSetupModal
          userId={user.id}
          userEmail={user.email || ""}
          isOpen={showTwoFactorModal}
          onClose={() => setShowTwoFactorModal(false)}
          onSuccess={handle2FASuccess}
        />
      )}
      
      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={showApiKeyModal}
        onClose={() => setShowApiKeyModal(false)}
        apiKey={apiKey}
      />
    </div>
  )
}
