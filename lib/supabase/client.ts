import { createBrowserClient as _createBrowserClient } from '@supabase/ssr';
import type { Database } from "@/types/supabase";

// Client-side Supabase client (singleton pattern)
let browserClientInstance: ReturnType<typeof _createBrowserClient<Database>> | null = null;

export const createBrowserClient = () => {
  if (!browserClientInstance) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // Always log in both development and production for troubleshooting
    if (typeof window !== 'undefined') {
      console.log('[Supabase Client] Initializing with environment:', process.env.NODE_ENV);
      console.log('[Supabase Client] URL available:', !!supabaseUrl);
      console.log('[Supabase Client] Key available:', !!supabaseKey);
    }

    if (!supabaseUrl || !supabaseKey) {
      console.error('[Supabase Client] Environment variables are missing:', { 
        supabaseUrl: !!supabaseUrl, 
        supabaseKey: !!supabaseKey 
      });
      
      // Try to use the non-prefixed variables as fallback
      const fallbackUrl = process.env.SUPABASE_URL;
      const fallbackKey = process.env.SUPABASE_ANON_KEY;
      
      if (fallbackUrl && fallbackKey) {
        console.log('[Supabase Client] Using fallback variables');
        browserClientInstance = _createBrowserClient<Database>(fallbackUrl, fallbackKey);
        return browserClientInstance;
      }
      
      throw new Error('Supabase environment variables are missing. Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are defined in your .env file.');
    }
    
    try {
      // Simplified cookie domain handling - always use specific settings for production
      let cookieDomain;
      let cookiePath = '/';
      let cookieSecure = true;
      let sameSite = 'lax' as const;
      
      if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        console.log('[Supabase Client] Current hostname:', hostname);
        
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
          cookieDomain = undefined; // Default browser behavior for localhost
          cookieSecure = false;
        } else if (hostname.includes('meshp2p.dev')) {
          // In production, use the exact domain for cookies
          cookieDomain = hostname; // Use exact hostname, not .meshp2p.dev
          cookieSecure = true;
        } else {
          cookieDomain = hostname; // Use current hostname for other environments
        }
      } else {
        cookieDomain = undefined; // Default when window is not available
        cookieSecure = process.env.NODE_ENV === 'production';
      }
      
      // Always log cookie settings
      console.log('[Supabase Client] Cookie settings:', { 
        cookieDomain, 
        cookiePath, 
        cookieSecure,
        sameSite,
        env: process.env.NODE_ENV 
      });
      
      // Create a unique but deterministic name for cookie
      const cookieName = supabaseUrl ? 
        `sb-${supabaseUrl.split('//')[1].split('.')[0]}-auth` : 
        'sb-auth-cookie';
      
      browserClientInstance = _createBrowserClient<Database>(supabaseUrl, supabaseKey, {
        cookieOptions: {
          name: cookieName,
          maxAge: 60 * 60 * 24 * 7, // 7 days
          domain: cookieDomain,
          path: cookiePath,
          sameSite: sameSite,
          secure: cookieSecure
        },
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          flowType: 'pkce', // Use PKCE flow for better security
          debug: true // Always enable auth debugging in all environments
        },
        global: {
          headers: {
            'x-client-info': `next-js/${process.env.NODE_ENV}`
          }
        },
        realtime: {
          // Configure realtime with minimal params
          params: {
            eventsPerSecond: 10
          }
        }
      });
    } catch (error) {
      console.error('[Supabase Client] Error creating Supabase browser client:', error);
      throw error;
    }
  }
  return browserClientInstance;
}; 