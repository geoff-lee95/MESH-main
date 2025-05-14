import { createServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    // Get the host from the request
    const requestUrl = new URL(request.url);
    const host = requestUrl.origin;
    
    return NextResponse.json({
      status: "success",
      site: {
        host: host,
        protocol: requestUrl.protocol,
        hostname: requestUrl.hostname,
        port: requestUrl.port,
        pathname: requestUrl.pathname,
        fullUrl: request.url,
        headers: Object.fromEntries(
          Array.from(request.headers.entries())
            .filter(([key]) => 
              key === 'host' || 
              key === 'x-forwarded-host' || 
              key === 'x-vercel-deployment-url' || 
              key === 'x-vercel-url' || 
              key.includes('forwarded')
            )
        )
      }
    });
  } catch (error) {
    console.error("Error in site test route:", error);
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
} 