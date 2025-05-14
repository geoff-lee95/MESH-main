"use client"

import { useEffect, useState } from "react"
import { createBrowserClient } from "@/lib/supabase/client"
import { ProfileForm } from "@/components/profile/profile-form"
import { AgentList } from "@/components/agents/agent-list"
import { IntentList } from "@/components/intents/intent-list"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const router = useRouter()
  const { user: authUser, isLoading: authLoading } = useAuth()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [agents, setAgents] = useState<any[]>([])
  const [intents, setIntents] = useState<any[]>([])
  const [marketplaceIntents, setMarketplaceIntents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  // Add debug logging on mount
  useEffect(() => {
    console.log("Dashboard Page Mount State:", {
      authLoading,
      hasAuthUser: !!authUser,
      user,
      loading,
      error,
      retryCount
    });
    
    // Force exit loading state after 5 seconds in production
    const timeoutId = setTimeout(() => {
      if (loading) {
        console.log("Dashboard: Forcing exit from loading state after timeout");
        setLoading(false);
      }
    }, 5000);
    
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    // If we're still loading auth, wait but not too long
    if (authLoading) {
      // If auth is taking too long, proceed anyway after a short delay
      const timeoutId = setTimeout(() => {
        if (authLoading) {
          console.log("Dashboard: Auth loading timeout, proceeding anyway");
          proceedWithDataFetch(null);
        }
      }, 2000);
      
      return () => clearTimeout(timeoutId);
    }

    // Use auth context user if available
    if (authUser && !user) {
      console.log("Dashboard: Using auth context user", authUser.email);
      setUser(authUser);
      proceedWithDataFetch(authUser);
    } else if (!authLoading) {
      // Auth not loading but no user, try to fetch directly
      proceedWithDataFetch(null);
    }
  }, [authUser, authLoading, user, retryCount, router]);

  const proceedWithDataFetch = async (currentUser: any) => {
    try {
      setLoading(true);
      console.log("Dashboard: Starting data fetch", { hasUser: !!currentUser });
      const supabase = createBrowserClient();
      
      // Get the current user if not provided
      if (!currentUser) {
        console.log("Dashboard: No user in auth context, fetching directly");
        const { data: { user: supabaseUser }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          console.error("Dashboard: Error fetching user:", userError);
        }
        
        currentUser = supabaseUser;
        if (currentUser) {
          console.log("Dashboard: Retrieved user directly", currentUser.email);
          setUser(currentUser);
        }
      }
      
      if (!currentUser) {
        console.warn("Dashboard: No authenticated user found");
        if (retryCount < 3) {
          setRetryCount(prev => prev + 1);
          setLoading(false);
          // Try again in 1 second
          setTimeout(() => {
            proceedWithDataFetch(null);
          }, 1000);
          return;
        } else {
          // Instead of an error, just show empty state and don't redirect
          console.log("Dashboard: Showing empty state after retries");
          setLoading(false);
          return;
        }
      }
      
      // Get user profile - this can proceed even without a user in production
      try {
        console.log("Dashboard: Fetching profile");
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", currentUser?.id || 'no-user')
          .single();
        
        if (profileError) {
          console.error("Dashboard: Error fetching profile:", profileError);
        } else if (profileData) {
          console.log("Dashboard: Profile loaded successfully");
          setProfile(profileData);
        }
      } catch (profileErr) {
        console.error("Dashboard: Exception fetching profile:", profileErr);
      }
      
      // Get agents - this can proceed even without a user in production
      try {
        console.log("Dashboard: Fetching agents");
        const { data: agentsData, error: agentsError } = await supabase
          .from("agents")
          .select("*")
          .eq("user_id", currentUser?.id || 'no-user')
          .order("created_at", { ascending: false })
          .limit(3);
        
        if (agentsError) {
          console.error("Dashboard: Error fetching agents:", agentsError);
        } else {
          console.log(`Dashboard: Loaded ${agentsData?.length || 0} agents`);
          setAgents(agentsData || []);
        }
      } catch (agentsErr) {
        console.error("Dashboard: Exception fetching agents:", agentsErr);
      }
      
      // Get intents - this can proceed even without a user in production
      try {
        console.log("Dashboard: Fetching intents");
        const { data: intentsData, error: intentsError } = await supabase
          .from("intents")
          .select("*")
          .eq("user_id", currentUser?.id || 'no-user')
          .order("created_at", { ascending: false })
          .limit(3);
        
        if (intentsError) {
          console.error("Dashboard: Error fetching intents:", intentsError);
        } else {
          console.log(`Dashboard: Loaded ${intentsData?.length || 0} intents`);
          setIntents(intentsData || []);
        }
      } catch (intentsErr) {
        console.error("Dashboard: Exception fetching intents:", intentsErr);
      }
      
      // Get marketplace intents - this can proceed even without a user in production
      try {
        console.log("Dashboard: Fetching marketplace intents");
        const { data: marketIntents, error: marketError } = await supabase
          .from("intents")
          .select("*")
          .neq("user_id", currentUser?.id || 'no-user')
          .eq("status", "open")
          .order("created_at", { ascending: false })
          .limit(5);
        
        if (marketError) {
          console.error("Dashboard: Error fetching marketplace intents:", marketError);
        } else {
          console.log(`Dashboard: Loaded ${marketIntents?.length || 0} marketplace intents`);
          setMarketplaceIntents(marketIntents || []);
        }
      } catch (marketErr) {
        console.error("Dashboard: Exception fetching marketplace intents:", marketErr);
      }
      
      // Always complete loading to avoid stuck state
      console.log("Dashboard: Data fetch complete");
    } catch (err) {
      console.error("Dashboard: Error fetching dashboard data:", err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  // Show loading for maximum 3 seconds
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (loading) {
        console.log("Dashboard: Force exiting loading state after timeout");
        setLoading(false);
      }
    }, 3000);
    
    return () => clearTimeout(timeoutId);
  }, [loading]);

  if (loading && authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Always show dashboard content, even with errors or empty data
  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-light">Dashboard</h1>
        <p className="text-muted-foreground">
          {error ? (
            <span className="text-red-500">{error}</span>
          ) : (
            <>Welcome back, {profile?.full_name || user?.email || "User"}</>
          )}
        </p>
      </div>
      
      {/* Dashboard content sections - changed to vertical layout */}
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-light">Your Profile</CardTitle>
            <CardDescription>Manage your personal information</CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileForm profile={profile} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-light">Recent Agents</CardTitle>
            <CardDescription>Your most recently created agents</CardDescription>
          </CardHeader>
          <CardContent>
            <AgentList agents={agents || []} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-light">Your Intents</CardTitle>
            <CardDescription>Intents you've published</CardDescription>
          </CardHeader>
          <CardContent>
            <IntentList intents={intents || []} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-light">Marketplace Intents</CardTitle>
            <CardDescription>Recent intents from other users</CardDescription>
          </CardHeader>
          <CardContent>
            <IntentList intents={marketplaceIntents || []} showPublisher />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
