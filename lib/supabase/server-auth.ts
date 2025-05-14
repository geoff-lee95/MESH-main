import { createServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

// Helper function for server components to get authenticated user
export async function getAuthenticatedUser() {
  try {
    const supabase = await createServerClient();
    
    const {
      data: { user },
      error
    } = await supabase.auth.getUser();
    
    if (error) {
      console.error("[Server Auth] Authentication error:", error.message);
      return { user: null, error: error.message, supabase };
    }
    
    if (!user) {
      console.warn("[Server Auth] No authenticated user found");
      return { user: null, error: "No authenticated user found", supabase };
    }
    
    return { user, error: null, supabase };
  } catch (err) {
    console.error("[Server Auth] Unexpected error:", err);
    return { user: null, error: "Unexpected authentication error", supabase: null };
  }
}

// Helper function for server components that require authentication
export async function requireAuth() {
  const { user, error, supabase } = await getAuthenticatedUser();
  
  // Only redirect if we're sure there's no user and there was no error
  // This prevents redirect loops when there are temporary auth issues
  if (!user && error && !error.includes("Unexpected")) {
    redirect("/auth/sign-in");
  }
  
  return { user, supabase };
} 