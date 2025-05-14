import { createServerClient as _createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from "next/headers";
import type { Database } from "@/types/supabase";

// Server Client - intended to be called from Server Components, Route Handlers, or Server Actions
export async function createServerClient() {
  // In Next.js middleware and server actions, cookies() is synchronous
  // In React server components, we should handle as needed
  
  // Create the Supabase client
  const supabase = _createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          // In Next.js, cookies() returns directly and doesn't need await
          try {
            // @ts-ignore - The type definitions are incorrect, cookies() doesn't return a Promise
            return cookies().get(name)?.value;
          } catch (error) {
            console.warn('Error getting cookie:', name, error);
            return undefined;
          }
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            // @ts-ignore - The type definitions are incorrect, cookies() doesn't return a Promise
            cookies().set({ name, value, ...options });
          } catch (error) {
            console.warn('Error setting cookie:', name, error);
            // This is expected in server components and can be ignored
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            // @ts-ignore - The type definitions are incorrect, cookies() doesn't return a Promise
            cookies().delete({ name, ...options });
          } catch (error) {
            console.warn('Error removing cookie:', name, error);
            // This is expected in server components and can be ignored
          }
        },
      },
    }
  );

  // Debug auth state in development
  if (process.env.NODE_ENV === 'development') {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.warn('[Server Auth] Error getting user:', error.message);
    } else if (!data.user) {
      console.warn('[Server Auth] No user found in server component');
    }
  }

  return supabase;
} 