"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { Session, User } from "@supabase/supabase-js"
import { createBrowserClient } from "@/lib/supabase/client"

// Define profile type
type Profile = {
  id: string
  full_name: string | null
  avatar_url: string | null
  role: string | null
  bio: string | null
  website: string | null
  github: string | null
  twitter: string | null
  updated_at: string | null
  wallets: string[]
  primary_wallet: string | null
}

type AuthContextType = {
  user: User | null
  session: Session | null
  profile: Profile | null
  isLoading: boolean
  signUp: (email: string, password: string) => Promise<{ error: any | null; data: any | null }>
  signIn: (email: string, password: string) => Promise<{ error: any | null; data: any | null }>
  signOut: () => Promise<void>
  updateProfile: (profileData: Partial<Profile>) => Promise<{ error: any | null; success: boolean }>
  refreshProfile: () => Promise<void>
  addWallet: (address: string) => Promise<{ error: any | null; success: boolean }>
  removeWallet: (address: string) => Promise<{ error: any | null; success: boolean }>
  setPrimaryWallet: (address: string) => Promise<{ error: any | null; success: boolean }>
  resetPassword: (email: string) => Promise<{ error: any | null; data: any | null }>
  updatePassword: (password: string) => Promise<{ error: any | null; data: any | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Create a singleton instance of the Supabase client
const supabase = createBrowserClient()

// Simplified auth state change logging
supabase.auth.onAuthStateChange((event, session) => {
  if (process.env.NODE_ENV === 'development') {
    console.log("Auth event:", event);
  }
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Function to fetch user profile - with caching
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single()

      if (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error("Error fetching profile:", error)
        }
        return null
      }

      return data as Profile
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error("Unexpected error fetching profile:", error)
      }
      return null
    }
  }

  // Function to refresh the profile data
  const refreshProfile = async () => {
    if (!user) return
    
    const profileData = await fetchProfile(user.id)
    if (profileData) {
      setProfile(profileData)
    }
  }

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()

        if (error && process.env.NODE_ENV === 'development') {
          console.error("Error getting session:", error)
        }

        setSession(data.session)
        const currentUser = data.session?.user ?? null
        setUser(currentUser)

        // Fetch profile if user exists
        if (currentUser) {
          fetchProfile(currentUser.id).then(profileData => {
            if (profileData) setProfile(profileData)
            setIsLoading(false) // Complete loading after profile fetch
          })
        } else {
          setIsLoading(false) // Complete loading if no user
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error("Unexpected error getting session:", error)
        }
        setIsLoading(false)
      }
    }

    getInitialSession()

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (process.env.NODE_ENV === 'development') {
        console.log("Auth state change event:", _event)
      }
      
      setSession(session)
      const currentUser = session?.user ?? null
      setUser(currentUser)
      
      // Fetch profile if user exists
      if (currentUser) {
        const profileData = await fetchProfile(currentUser.id)
        setProfile(profileData)
      } else {
        setProfile(null)
      }
      
      setIsLoading(false)
    })

    // Set a timeout to force isLoading to false after 2.5 seconds (reduced)
    const loadingTimeoutId = setTimeout(() => {
      if (isLoading) {
        if (process.env.NODE_ENV === 'development') {
          console.warn("Auth loading timeout reached, forcing loading state to complete")
        }
        setIsLoading(false)
        
        // Check for cached session in local storage as fallback
        try {
          const cachedSession = localStorage.getItem('supabase.auth.token');
          if (cachedSession && !session) {
            // Force a session refresh attempt
            supabase.auth.getSession().then(({ data }) => {
              if (data.session) {
                setSession(data.session);
                setUser(data.session.user);
                fetchProfile(data.session.user.id).then(profileData => {
                  if (profileData) setProfile(profileData);
                });
              }
            });
          }
        } catch (e) {
          if (process.env.NODE_ENV === 'development') {
            console.error("Error checking local storage:", e);
          }
        }
      }
    }, 2500) // Reduced to 2.5 seconds

    // Clean up subscription and timeout
    return () => {
      subscription.unsubscribe()
      clearTimeout(loadingTimeoutId)
    }
  }, [])

  const signUp = async (email: string, password: string) => {
    setIsLoading(true)
    const response = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    setIsLoading(false)
    return response
  }

  const signIn = async (email: string, password: string) => {
    setIsLoading(true)
    console.log("Attempting sign in with:", { email });
    
    try {
      // Log the request details
      console.log("Sign in request details:", {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL,
        origin: window.location.origin,
        hostname: window.location.hostname
      });
      
      const response = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      console.log("Sign in response:", response);
      setIsLoading(false)
      return response;
    } catch (error) {
      console.error("Sign in exception:", error);
      setIsLoading(false)
      return { error, data: null };
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setProfile(null)
  }

  // Password reset - request reset email
  const resetPassword = async (email: string) => {
    setIsLoading(true)
    const response = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })
    setIsLoading(false)
    return response
  }
  
  // Update password after reset
  const updatePassword = async (password: string) => {
    setIsLoading(true)
    const response = await supabase.auth.updateUser({
      password: password,
    })
    setIsLoading(false)
    return response
  }

  // Function to update profile
  const updateProfile = async (profileData: Partial<Profile>) => {
    if (!user) {
      return { error: "User not authenticated", success: false }
    }

    try {
      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          ...profileData,
          updated_at: new Date().toISOString(),
        })

      if (error) {
        console.error("Error updating profile:", error)
        return { error: error.message, success: false }
      }

      // Refresh profile data after update
      await refreshProfile()
      return { error: null, success: true }
    } catch (error: any) {
      console.error("Unexpected error updating profile:", error)
      return { error: error.message, success: false }
    }
  }

  // Add a wallet address to the user's wallets array
  const addWallet = async (address: string) => {
    if (!user) return { error: "User not authenticated", success: false }
    if (!address) return { error: "Invalid wallet address", success: false }
    // Case-sensitive, prevent duplicates
    const currentWallets: string[] = Array.isArray(profile?.wallets) ? profile.wallets : []
    if (currentWallets.includes(address)) {
      return { error: "Wallet already connected", success: false }
    }
    const newWallets = [...currentWallets, address]
    const { error } = await supabase
      .from("profiles")
      .update({ wallets: newWallets })
      .eq("id", user.id)
    if (error) {
      return { error: error.message, success: false }
    }
    await refreshProfile()
    return { error: null, success: true }
  }

  // Remove a wallet address from the user's wallets array
  const removeWallet = async (address: string) => {
    if (!user) return { error: "User not authenticated", success: false }
    if (!address) return { error: "Invalid wallet address", success: false }
    const currentWallets: string[] = Array.isArray(profile?.wallets) ? profile.wallets : []
    const newWallets = currentWallets.filter((w) => w !== address)
    // If removing the primary wallet, unset it
    let updateObj: any = { wallets: newWallets }
    if (profile?.primary_wallet === address) {
      updateObj.primary_wallet = null
    }
    const { error } = await supabase
      .from("profiles")
      .update(updateObj)
      .eq("id", user.id)
    if (error) {
      return { error: error.message, success: false }
    }
    await refreshProfile()
    return { error: null, success: true }
  }

  // Set the primary wallet
  const setPrimaryWallet = async (address: string) => {
    if (!user) return { error: "User not authenticated", success: false }
    if (!address) return { error: "Invalid wallet address", success: false }
    const currentWallets: string[] = Array.isArray(profile?.wallets) ? profile.wallets : []
    if (!currentWallets.includes(address)) {
      return { error: "Wallet not connected", success: false }
    }
    const { error } = await supabase
      .from("profiles")
      .update({ primary_wallet: address })
      .eq("id", user.id)
    if (error) {
      return { error: error.message, success: false }
    }
    await refreshProfile()
    return { error: null, success: true }
  }

  const value = {
    user,
    session,
    profile,
    isLoading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    refreshProfile,
    addWallet,
    removeWallet,
    setPrimaryWallet,
    resetPassword,
    updatePassword
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
