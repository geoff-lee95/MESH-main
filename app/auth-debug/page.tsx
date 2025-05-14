"use client";

import { useState } from "react";
import { createBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CookieDebugger } from "./cookie-test";

export default function AuthDebugPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [signInResponse, setSignInResponse] = useState<any>(null);
  const [rawRequest, setRawRequest] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const validateInputs = () => {
    let isValid = true;
    setEmailError("");
    setPasswordError("");

    if (!email) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Email format is invalid");
      isValid = false;
    }

    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      isValid = false;
    }

    return isValid;
  };

  const handleSignIn = async () => {
    if (!validateInputs()) return;

    setIsLoading(true);
    setStatusMessage("Attempting sign in...");
    setSignInResponse(null);
    setRawRequest(null);

    try {
      // Create the Supabase client with detailed logging
      const supabase = createBrowserClient();
      console.log("Supabase client created:", !!supabase);
      
      // Log client details
      console.log("Checking Supabase configuration...");
      console.log("Current session check...");
      const sessionCheck = await supabase.auth.getSession();
      console.log("Session check result:", sessionCheck);

      // Detailed request logging
      const requestDetails = {
        email,
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
        timestamp: new Date().toISOString(),
        headers: { 
          "Content-Type": "application/json",
          "apikey": "***" // Masked for security
        }
      };
      setRawRequest(requestDetails);
      
      // Attempt sign in with debug mode
      console.log("Attempting sign in with email:", email);
      setStatusMessage("Sending authentication request...");
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      // Log full response for debugging
      console.log("Sign-in response:", { data, error });
      setSignInResponse({ data, error });

      if (error) {
        setStatusMessage(`Sign in failed: ${error.message}`);
        console.error("Sign in error details:", error);
      } else {
        setStatusMessage("Sign in successful!");
        console.log("Sign in successful, session:", data.session);
      }
    } catch (err) {
      console.error("Unexpected error during sign in:", err);
      setStatusMessage(`Unexpected error: ${err instanceof Error ? err.message : String(err)}`);
      setSignInResponse({ error: err });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-background p-4 py-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Authentication Debugging Tools</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Authentication Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <p className="text-sm">
                Status: <span className={statusMessage.includes("failed") || statusMessage.includes("error") ? "text-red-500 font-medium" : "font-medium"}>{statusMessage || "Ready"}</span>
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="debug-email">Email</Label>
                <Input
                  id="debug-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                />
                {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="debug-password">Password</Label>
                <Input
                  id="debug-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
                {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
              </div>

              <Button 
                onClick={handleSignIn} 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Debug Sign In"}
              </Button>
            </div>

            {rawRequest && (
              <div className="mt-4 space-y-2 border-t pt-4">
                <h3 className="font-medium text-sm">Request Details:</h3>
                <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-auto">
                  {JSON.stringify(rawRequest, null, 2)}
                </pre>
              </div>
            )}

            {signInResponse && (
              <div className="mt-4 space-y-2 border-t pt-4">
                <h3 className="font-medium text-sm">Response Details:</h3>
                <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-auto">
                  {JSON.stringify(signInResponse, null, 2)}
                </pre>
              </div>
            )}
            
            <div className="text-xs text-gray-500 mt-4">
              <p>Debugging tips:</p>
              <ul className="list-disc list-inside space-y-1 mt-1">
                <li>Check browser console for network errors</li>
                <li>Verify Supabase Site URL configuration</li>
                <li>Ensure CORS settings in Supabase allow this domain</li>
                <li>Confirm that your account exists and password is correct</li>
              </ul>
            </div>
          </CardContent>
        </Card>
        
        <CookieDebugger />
      </div>
      
      <Card className="w-full mt-6">
        <CardHeader>
          <CardTitle>Common Authentication Issues & Solutions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium">1. "Bad Request" (400) Errors</h3>
            <p className="text-sm">
              This typically means incorrect credentials or an issue with how the request is being formed.
              Make sure you're using a valid email/password combination that exists in your Supabase project.
            </p>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-medium">2. CORS Errors</h3>
            <p className="text-sm">
              Add your domain (<code>https://v0-mesh-mu.vercel.app</code>) to the list of allowed domains in 
              Supabase Dashboard → API → Settings → API Settings → Additional Allowed Hosts.
            </p>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-medium">3. Cookie Storage Issues</h3>
            <p className="text-sm">
              Supabase stores session data in cookies. If cookies can't be stored (due to browser settings, 
              third-party cookie blocking, or Incognito mode), authentication will fail. Try a different browser 
              or disable cookie blocking.
            </p>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-medium">4. Redirect URL Configuration</h3>
            <p className="text-sm">
              In Supabase Dashboard → Authentication → URL Configuration, ensure your site URL is 
              set correctly and your deployment URL is in the redirect URLs.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 