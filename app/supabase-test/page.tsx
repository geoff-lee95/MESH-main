"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SupabaseTestPage() {
  const [status, setStatus] = useState<string>("Not tested");
  const [error, setError] = useState<string | null>(null);
  const [envVars, setEnvVars] = useState<any>(null);
  const [siteInfo, setSiteInfo] = useState<any>(null);
  const [testEmail, setTestEmail] = useState<string>("");
  const [testPassword, setTestPassword] = useState<string>("");
  const [signUpResult, setSignUpResult] = useState<any>(null);

  const testConnection = async () => {
    try {
      setStatus("Testing...");
      setError(null);

      const supabase = createBrowserClient();
      console.log("Supabase client created");

      // Try a simple query to test the connection
      const { data, error } = await supabase.from("profiles").select("*").limit(1);

      if (error) {
        console.error("Supabase query error:", error);
        setStatus("Failed");
        setError(error.message);
        return;
      }

      console.log("Supabase query successful:", data);
      setStatus("Connected");
    } catch (err) {
      console.error("Unexpected error testing Supabase connection:", err);
      setStatus("Error");
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  const checkEnvVars = async () => {
    try {
      const response = await fetch("/api/supabase-test");
      const data = await response.json();
      setEnvVars(data);
    } catch (err) {
      console.error("Error checking environment variables:", err);
    }
  };

  const checkSiteInfo = async () => {
    try {
      const response = await fetch("/api/supabase-site-test");
      const data = await response.json();
      setSiteInfo(data);
    } catch (err) {
      console.error("Error checking site info:", err);
    }
  };

  const testSignUp = async () => {
    try {
      if (!testEmail || !testPassword) {
        setError("Please enter both email and password");
        return;
      }

      setError(null);
      setSignUpResult(null);
      setStatus("Testing sign up...");

      const supabase = createBrowserClient();
      console.log("Testing sign up with email:", testEmail);

      const response = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      console.log("Sign up response:", response);
      setSignUpResult(response);

      if (response.error) {
        setError(response.error.message);
        setStatus("Sign up failed");
      } else {
        setStatus("Sign up successful - check email");
      }
    } catch (err) {
      console.error("Unexpected error during sign up test:", err);
      setStatus("Error");
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  // Log environment variables on mount
  useEffect(() => {
    console.log("NEXT_PUBLIC_SUPABASE_URL:", process.env.NEXT_PUBLIC_SUPABASE_URL ? "Set" : "Not set");
    console.log("NEXT_PUBLIC_SUPABASE_ANON_KEY:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Set" : "Not set");
    checkEnvVars();
    checkSiteInfo();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Supabase Connection Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <p>
              Status: <strong>{status}</strong>
            </p>
            {error && <p className="text-red-500">Error: {error}</p>}
          </div>
          
          <Button onClick={testConnection} className="w-full">Test Supabase Connection</Button>
          
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-medium">Test Sign Up</h3>
            <div className="space-y-2">
              <Label htmlFor="test-email">Test Email</Label>
              <Input
                id="test-email"
                type="email"
                placeholder="test@example.com"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="test-password">Test Password</Label>
              <Input
                id="test-password"
                type="password"
                placeholder="password"
                value={testPassword}
                onChange={(e) => setTestPassword(e.target.value)}
              />
            </div>
            <Button onClick={testSignUp} className="w-full">Test Sign Up</Button>
            
            {signUpResult && (
              <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded">
                <pre className="text-xs overflow-auto">
                  {JSON.stringify(signUpResult, null, 2)}
                </pre>
              </div>
            )}
          </div>
          
          {envVars && (
            <div className="mt-4 space-y-2 border-t pt-4">
              <h3 className="font-medium">Environment Variables:</h3>
              <p>Environment: {envVars.environment}</p>
              <ul className="space-y-1">
                {Object.entries(envVars.variables).map(([key, value]) => (
                  <li key={key}>
                    {key}: {String(value)}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {siteInfo && (
            <div className="mt-4 space-y-2 border-t pt-4">
              <h3 className="font-medium">Site Information:</h3>
              <ul className="space-y-1">
                <li>Host: {siteInfo.site.host}</li>
                <li>Protocol: {siteInfo.site.protocol}</li>
                <li>Hostname: {siteInfo.site.hostname}</li>
                {siteInfo.site.port && <li>Port: {siteInfo.site.port}</li>}
              </ul>
              <details>
                <summary className="cursor-pointer text-sm">Request Headers</summary>
                <pre className="text-xs mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded overflow-auto">
                  {JSON.stringify(siteInfo.site.headers, null, 2)}
                </pre>
              </details>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 