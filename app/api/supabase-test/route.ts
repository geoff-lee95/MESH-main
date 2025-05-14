import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Check for environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const serverSupabaseUrl = process.env.SUPABASE_URL;
    const serverSupabaseKey = process.env.SUPABASE_ANON_KEY;
    
    // Return status of environment variables
    return NextResponse.json({
      status: "success",
      message: "Environment variables check",
      environment: process.env.NODE_ENV,
      variables: {
        NEXT_PUBLIC_SUPABASE_URL: !!supabaseUrl,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: !!supabaseKey,
        SUPABASE_URL: !!serverSupabaseUrl,
        SUPABASE_ANON_KEY: !!serverSupabaseKey
      }
    });
  } catch (error) {
    console.error("Error in Supabase test route:", error);
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
} 