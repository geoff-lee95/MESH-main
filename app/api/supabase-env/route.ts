import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // Get all relevant environment variables for Supabase
  const env = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "[REDACTED]" : undefined,
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ? "[REDACTED]" : undefined,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? "[REDACTED]" : undefined,
    NODE_ENV: process.env.NODE_ENV,
    VERCEL_URL: process.env.VERCEL_URL,
    VERCEL_ENV: process.env.VERCEL_ENV,
  };

  // Extract and parse the request URL
  const requestUrl = new URL(request.url);
  const host = requestUrl.host;
  const protocol = requestUrl.protocol;
  const origin = requestUrl.origin;
  
  // Get all headers from the request
  const headers = Object.fromEntries(
    Array.from(request.headers.entries())
      .filter(([key]) => {
        // Filter out sensitive headers
        const lowerKey = key.toLowerCase();
        return !lowerKey.includes("cookie") && 
               !lowerKey.includes("authorization") && 
               !lowerKey.includes("secret") && 
               !lowerKey.includes("token");
      })
  );

  // Check if we have the required Supabase environment variables
  const hasRequiredVars = !!process.env.NEXT_PUBLIC_SUPABASE_URL && 
                        !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Get information about URL formats
  const urlInfo = process.env.NEXT_PUBLIC_SUPABASE_URL ? {
    baseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    domain: new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname,
    authEndpoint: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1`,
    redirectUrl: `${origin}/auth/callback`,
    resetPasswordRedirectUrl: `${origin}/auth/reset-password`,
  } : null;

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "unknown",
    deploymentInfo: {
      host,
      protocol,
      origin,
      isVercel: !!process.env.VERCEL,
      vercelEnv: process.env.VERCEL_ENV || "unknown",
    },
    supabaseConfig: {
      hasRequiredVars,
      urlInfo,
    },
    environmentVariables: env,
    requestHeaders: headers,
    recommendations: !hasRequiredVars ? [
      "Missing required Supabase environment variables. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to Vercel environment variables.",
      "Make sure environment variables are added to the production environment in Vercel, not just preview or development."
    ] : [
      "In Supabase Dashboard → API → Settings → API Settings, add your Vercel deployment URL to Additional Allowed Hosts.",
      "In Supabase Dashboard → Authentication → URL Configuration, ensure your site URL is set correctly.",
      "Add your Vercel deployment URL to the list of allowed redirect URLs in Supabase.",
      "Ensure third-party cookies are not blocked in your browser."
    ]
  });
} 