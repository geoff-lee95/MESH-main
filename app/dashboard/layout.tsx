"use client"

import type React from "react"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Activity,
  BarChart3,
  Bot,
  Calendar,
  Code2,
  CreditCard,
  ExternalLink,
  FileText,
  HelpCircle,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  Network,
  Search,
  Settings,
  Shield,
  Trophy,
  User,
  X,
  Computer,
  Cpu,
  Gamepad2,
  ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/contexts/auth-context"
import { useState, useEffect } from "react"
import { RouteGuard } from "@/components/auth/route-guard"
import { NotificationsDropdown } from "@/components/notifications/notifications-dropdown"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { CustomWalletModalButton } from "@/components/wallet/CustomWalletModalButton"
import { BetaBanner } from "@/components/ui/beta-banner"
import Image from "next/image"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LineChart } from "lucide-react"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <RouteGuard>
      <DashboardContent children={children} />
    </RouteGuard>
  )
}

function DashboardContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, profile, signOut } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Use this effect to ensure we're only rendering on the client side
  useEffect(() => {
    setMounted(true)
    
    // Add shorter timeout for client-side mounting
    const timeoutId = setTimeout(() => {
      if (!mounted) {
        setMounted(true)
      }
    }, 1000) // 1 second timeout for client rendering
    
    return () => clearTimeout(timeoutId)
  }, [mounted])

  // Handle client-side rendering
  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  const navigationLinks = [
    {
      href: "/dashboard",
      label: "Overview",
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
    {
      href: "/dashboard/agent-dashboard",
      label: "Agent Dashboard",
      icon: <Computer className="h-4 w-4" />,
    },
    {
      href: "/dashboard/agents",
      label: "My Agents",
      icon: <Cpu className="h-4 w-4" />,
    },
    {
      href: "/dashboard/intents",
      label: "Intents",
      icon: <FileText className="h-4 w-4" />,
    },
    {
      href: "/dashboard/leaderboard",
      label: "Leaderboard",
      icon: <LineChart className="h-4 w-4" />,
    },
  ]

  const resourceLinks = [
    { href: "https://meshai.mintlify.app/", label: "Documentation", icon: <FileText className="h-5 w-5" />, external: true },
    { href: "/dashboard/help", label: "Help & Support", icon: <HelpCircle className="h-5 w-5" /> },
    { href: "/dashboard/settings", label: "Settings", icon: <Settings className="h-5 w-5" /> },
  ]

  return (
    <div className="flex min-h-screen bg-background flex-col">
      <BetaBanner />
      <div className="flex flex-1">
        {/* Sidebar - hidden on mobile */}
        <div className="hidden md:flex w-64 flex-col bg-background border-r border-[rgba(255,255,255,0.1)]">
          <div className="flex h-14 items-center border-b border-[rgba(255,255,255,0.1)] px-4">
            <Link href="/" className="flex items-center gap-3 font-light">
              <Image src="/MESH-gradient.svg" alt="MESH Logo" width={40} height={40} />
            </Link>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <div className="px-3 py-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="w-full appearance-none bg-background pl-8 shadow-none"
                />
              </div>
            </div>
            <nav className="grid gap-1 px-2">
              {navigationLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  prefetch={true}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-accent-foreground font-light ${
                    (link.href === "/dashboard" && pathname === "/dashboard") || 
                    (link.href !== "/dashboard" && pathname.startsWith(link.href))
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent"
                  }`}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              ))}
            </nav>
            <div className="mt-4 px-4 py-2">
              <h3 className="mb-2 text-xs font-light text-muted-foreground">Resources</h3>
              <nav className="grid gap-1">
                {resourceLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-accent-foreground font-light ${
                      !link.external && pathname.startsWith(link.href)
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:bg-accent"
                    }`}
                  >
                    {link.icon}
                    <span>{link.label}</span>
                    {link.external && <ExternalLink className="ml-auto h-3 w-3" />}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
          <div className="mt-auto border-t border-[rgba(255,255,255,0.1)] p-4">
            <div className="flex flex-col space-y-3">
              <div className="flex items-center justify-between">
                <NotificationsDropdown />
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => signOut()}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign out</span>
                </Button>
              </div>
              
              <div className="flex items-center gap-3 rounded-lg bg-secondary/20 px-3 py-2">
                <Avatar className="h-9 w-9">
                  {profile?.avatar_url ? (
                    <AvatarImage src={profile.avatar_url} alt={profile.full_name || "User"} />
                  ) : null}
                  <AvatarFallback>
                    {(profile?.full_name?.charAt(0) || user?.email?.charAt(0) || "U").toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-light">
                    {profile?.full_name || user?.email?.split("@")[0] || "User"}
                  </span>
                  <span className="text-xs text-muted-foreground">{user?.email || ""}</span>
                </div>
              </div>
              
              <CustomWalletModalButton className="w-full" />
            </div>
          </div>
        </div>

        {/* Main content with mobile header */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile Header - only visible on mobile */}
          <header className="md:hidden flex h-14 items-center border-b border-[rgba(255,255,255,0.1)] px-4 justify-between">
            <Link href="/" className="flex items-center gap-3 font-light">
              <Image src="/MESH-gradient.svg" alt="MESH Logo" width={40} height={40} />
            </Link>
            
            <div className="flex items-center gap-2">
              <NotificationsDropdown />
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[280px] p-0">
                  <div className="flex flex-col h-full bg-background">
                    <div className="flex h-14 items-center border-b border-[rgba(255,255,255,0.1)] px-4 justify-between">
                      <Link href="/" className="flex items-center gap-3 font-light">
                        <Image src="/MESH-gradient.svg" alt="MESH Logo" width={40} height={40} />
                      </Link>
                    </div>
                    
                    <div className="flex-1 overflow-auto py-4">
                      <div className="px-3 py-2">
                        <div className="relative">
                          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="search"
                            placeholder="Search..."
                            className="w-full appearance-none bg-background pl-8 shadow-none"
                          />
                        </div>
                      </div>
                      
                      <div className="px-2 py-2">
                        <div className="flex items-center gap-3 rounded-lg bg-secondary/20 px-3 py-3 mb-4">
                          <Avatar className="h-10 w-10">
                            {profile?.avatar_url ? (
                              <AvatarImage src={profile.avatar_url} alt={profile.full_name || "User"} />
                            ) : null}
                            <AvatarFallback>
                              {(profile?.full_name?.charAt(0) || user?.email?.charAt(0) || "U").toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="text-sm font-light">
                              {profile?.full_name || user?.email?.split("@")[0] || "User"}
                            </span>
                            <span className="text-xs text-muted-foreground">{user?.email || ""}</span>
                          </div>
                        </div>
                        
                        <CustomWalletModalButton className="w-full mb-6" />
                        
                        <nav className="grid gap-1">
                          {navigationLinks.map((link) => (
                            <Link
                              key={link.href}
                              href={link.href}
                              prefetch={true}
                              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-accent-foreground font-light ${
                                (link.href === "/dashboard" && pathname === "/dashboard") || 
                                (link.href !== "/dashboard" && pathname.startsWith(link.href))
                                  ? "bg-accent text-accent-foreground"
                                  : "text-muted-foreground hover:bg-accent"
                              }`}
                            >
                              {link.icon}
                              <span>{link.label}</span>
                            </Link>
                          ))}
                        </nav>
                        
                        <div className="mt-6 mb-2">
                          <h3 className="px-3 text-xs font-light text-muted-foreground">Resources</h3>
                        </div>
                        
                        <nav className="grid gap-1">
                          {resourceLinks.map((link) => (
                            <Link
                              key={link.href}
                              href={link.href}
                              target={link.external ? "_blank" : undefined}
                              rel={link.external ? "noopener noreferrer" : undefined}
                              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-accent-foreground font-light ${
                                !link.external && pathname.startsWith(link.href)
                                  ? "bg-accent text-accent-foreground"
                                  : "text-muted-foreground hover:bg-accent"
                              }`}
                            >
                              {link.icon}
                              <span>{link.label}</span>
                              {link.external && <ExternalLink className="ml-auto h-3 w-3" />}
                            </Link>
                          ))}
                        </nav>
                      </div>
                    </div>
                    
                    <div className="mt-auto border-t border-[rgba(255,255,255,0.1)] p-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full flex items-center justify-center gap-2"
                        onClick={() => signOut()}
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign out</span>
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </header>
          
          {/* Page content */}
          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
