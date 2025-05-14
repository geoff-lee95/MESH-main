"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, X, AlertTriangle, RefreshCw, Server, Globe, KeyRound, Cookie, Shield } from "lucide-react";

interface CheckResult {
  status: "success" | "error" | "warning" | "pending";
  message: string;
  details?: string;
}

export default function SupabaseDiagnosticsPage() {
  const [envVars, setEnvVars] = useState<any>(null);
  const [corsTest, setCorsTest] = useState<CheckResult>({ status: "pending", message: "Not tested yet" });
  const [cookieTest, setCookieTest] = useState<CheckResult>({ status: "pending", message: "Not tested yet" });
  const [authTest, setAuthTest] = useState<CheckResult>({ status: "pending", message: "Not tested yet" });
  const [testEmail, setTestEmail] = useState<string>("");
  const [testPassword, setTestPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [testResponse, setTestResponse] = useState<any>(null);

  // Fetch environment variable information
  useEffect(() => {
    const fetchEnvInfo = async () => {
      try {
        const response = await fetch("/api/supabase-env");
        const data = await response.json();
        setEnvVars(data);
        
        // Check environment variables
        if (!data.supabaseConfig.hasRequiredVars) {
          setCorsTest({
            status: "error",
            message: "Cannot test CORS - missing Supabase environment variables",
          });
        }
      } catch (error) {
        console.error("Error fetching environment info:", error);
      }
    };

    fetchEnvInfo();
  }, []);

  // Test CORS configuration
  const testCors = async () => {
    setCorsTest({ status: "pending", message: "Testing CORS..." });
    
    try {
      if (!envVars || !envVars.supabaseConfig.urlInfo) {
        setCorsTest({ 
          status: "error", 
          message: "Cannot test CORS - missing Supabase URL" 
        });
        return;
      }
      
      // Test a direct request to the Supabase API
      const authEndpoint = `${envVars.supabaseConfig.urlInfo.authEndpoint}/config?apikey=${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`;
      
      const response = await fetch(authEndpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (response.ok) {
        setCorsTest({ 
          status: "success", 
          message: "CORS is configured correctly", 
          details: `Successfully connected to ${envVars.supabaseConfig.urlInfo.domain}` 
        });
      } else {
        setCorsTest({ 
          status: "error", 
          message: `CORS error: ${response.status} ${response.statusText}`, 
          details: "This may indicate that your domain is not in the allowed hosts list in Supabase" 
        });
      }
    } catch (error) {
      console.error("CORS test error:", error);
      setCorsTest({ 
        status: "error", 
        message: "CORS error", 
        details: error instanceof Error ? error.message : String(error) 
      });
    }
  };

  // Test cookie functionality
  const testCookies = () => {
    try {
      // Test setting a cookie
      const testValue = `test-${Date.now()}`;
      document.cookie = `supabase_test_cookie=${testValue}; path=/; max-age=60`;
      
      // Check if cookie was set
      const cookies = document.cookie;
      const hasCookie = cookies.includes(`supabase_test_cookie=${testValue}`);
      
      // Test iframe cookie - to check third-party cookie blocking
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      document.body.appendChild(iframe);
      
      let thirdPartyCookieStatus = "unknown";
      
      if (iframe.contentDocument) {
        try {
          iframe.contentDocument.cookie = "iframe_test=1; path=/";
          thirdPartyCookieStatus = iframe.contentDocument.cookie.includes("iframe_test=1") 
            ? "allowed" : "blocked";
        } catch (e) {
          thirdPartyCookieStatus = "blocked";
        }
      }
      
      document.body.removeChild(iframe);
      
      if (hasCookie) {
        setCookieTest({
          status: thirdPartyCookieStatus === "allowed" ? "success" : "warning",
          message: hasCookie 
            ? "Basic cookies are working" 
            : "Failed to set test cookie",
          details: thirdPartyCookieStatus === "allowed" 
            ? "Both first-party and third-party cookies are working" 
            : "Third-party cookies appear to be blocked, which may cause problems with Supabase auth"
        });
      } else {
        setCookieTest({
          status: "error",
          message: "Failed to set test cookie",
          details: "This may indicate that cookies are being blocked by your browser"
        });
      }
    } catch (error) {
      console.error("Cookie test error:", error);
      setCookieTest({
        status: "error",
        message: "Error testing cookies",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  };

  // Test authentication
  const testAuth = async () => {
    if (!testEmail || !testPassword) {
      setAuthTest({
        status: "error",
        message: "Please enter both email and password"
      });
      return;
    }
    
    setIsLoading(true);
    setAuthTest({ status: "pending", message: "Testing authentication..." });
    setTestResponse(null);
    
    try {
      const supabase = createBrowserClient();
      console.log("Testing authentication with Supabase client");
      
      // Try to sign in
      const response = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword
      });
      
      setTestResponse(response);
      
      if (response.error) {
        setAuthTest({
          status: "error",
          message: `Authentication failed: ${response.error.message}`,
          details: JSON.stringify(response.error, null, 2)
        });
      } else {
        setAuthTest({
          status: "success",
          message: "Authentication successful!",
          details: `User logged in: ${response.data.user?.email}`
        });
      }
    } catch (error) {
      console.error("Authentication test error:", error);
      setAuthTest({
        status: "error",
        message: "Error during authentication test",
        details: error instanceof Error ? error.message : String(error)
      });
      setTestResponse({ error });
    } finally {
      setIsLoading(false);
    }
  };

  const StatusIcon = ({ status }: { status: CheckResult["status"] }) => {
    switch (status) {
      case "success":
        return <Check className="h-5 w-5 text-green-500" />;
      case "error":
        return <X className="h-5 w-5 text-red-500" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case "pending":
        return <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 min-h-screen">
      <div className="max-w-4xl w-full">
        <h1 className="text-3xl font-bold mb-6 text-center">Supabase Authentication Diagnostics</h1>
        
        <Tabs defaultValue="env">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="env">Environment</TabsTrigger>
            <TabsTrigger value="compatibility">Compatibility</TabsTrigger>
            <TabsTrigger value="auth">Authentication</TabsTrigger>
          </TabsList>
          
          <TabsContent value="env">
            <Card>
              <CardHeader>
                <div className="flex items-center">
                  <Server className="h-5 w-5 mr-2" />
                  <CardTitle>Environment Variables</CardTitle>
                </div>
                <CardDescription>
                  Checking if all required Supabase environment variables are set correctly
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!envVars ? (
                  <div className="flex items-center justify-center p-8">
                    <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="font-medium">Environment:</div>
                      <div>{envVars.environment}</div>
                      
                      <div className="font-medium">Host:</div>
                      <div>{envVars.deploymentInfo.host}</div>
                      
                      <div className="font-medium">Supabase URL:</div>
                      <div className="flex items-center">
                        {envVars.environmentVariables.NEXT_PUBLIC_SUPABASE_URL ? (
                          <>
                            <Check className="h-4 w-4 text-green-500 mr-1" />
                            {envVars.environmentVariables.NEXT_PUBLIC_SUPABASE_URL}
                          </>
                        ) : (
                          <>
                            <X className="h-4 w-4 text-red-500 mr-1" />
                            <span className="text-red-500">Missing</span>
                          </>
                        )}
                      </div>
                      
                      <div className="font-medium">Supabase Anon Key:</div>
                      <div className="flex items-center">
                        {envVars.environmentVariables.NEXT_PUBLIC_SUPABASE_ANON_KEY ? (
                          <>
                            <Check className="h-4 w-4 text-green-500 mr-1" />
                            <span>Present (redacted)</span>
                          </>
                        ) : (
                          <>
                            <X className="h-4 w-4 text-red-500 mr-1" />
                            <span className="text-red-500">Missing</span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    {envVars.recommendations && (
                      <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
                        <h3 className="font-medium text-amber-800 mb-2">Recommendations:</h3>
                        <ul className="list-disc list-inside space-y-1 text-sm text-amber-700">
                          {envVars.recommendations.map((rec: string, i: number) => (
                            <li key={i}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="compatibility">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center">
                    <Globe className="h-5 w-5 mr-2" />
                    <CardTitle>CORS Configuration</CardTitle>
                  </div>
                  <CardDescription>
                    Test if your Supabase project allows requests from this domain
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <StatusIcon status={corsTest.status} />
                      <span>{corsTest.message}</span>
                    </div>
                    {corsTest.details && (
                      <p className="text-sm text-muted-foreground">{corsTest.details}</p>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={testCors} 
                    disabled={!envVars || !envVars.supabaseConfig.hasRequiredVars || corsTest.status === "pending"}
                    variant="outline"
                    className="w-full"
                  >
                    Test CORS Configuration
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center">
                    <Cookie className="h-5 w-5 mr-2" />
                    <CardTitle>Cookie Functionality</CardTitle>
                  </div>
                  <CardDescription>
                    Test if cookies can be stored in your browser
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <StatusIcon status={cookieTest.status} />
                      <span>{cookieTest.message}</span>
                    </div>
                    {cookieTest.details && (
                      <p className="text-sm text-muted-foreground">{cookieTest.details}</p>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={testCookies} 
                    disabled={cookieTest.status === "pending"}
                    variant="outline"
                    className="w-full"
                  >
                    Test Cookie Storage
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="auth">
            <Card>
              <CardHeader>
                <div className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  <CardTitle>Authentication Test</CardTitle>
                </div>
                <CardDescription>
                  Test if you can sign in with Supabase
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="test-email">Email</Label>
                    <Input
                      id="test-email"
                      type="email"
                      placeholder="your@email.com"
                      value={testEmail}
                      onChange={(e) => setTestEmail(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="test-password">Password</Label>
                    <Input
                      id="test-password"
                      type="password"
                      placeholder="••••••••"
                      value={testPassword}
                      onChange={(e) => setTestPassword(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <StatusIcon status={authTest.status} />
                    <span>{authTest.message}</span>
                  </div>
                  
                  {authTest.details && (
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{authTest.details}</p>
                  )}
                  
                  {testResponse && (
                    <div className="mt-4 p-2 bg-gray-100 dark:bg-gray-800 rounded overflow-auto max-h-40">
                      <pre className="text-xs">
                        {JSON.stringify(testResponse, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  onClick={testAuth} 
                  disabled={isLoading || !testEmail || !testPassword}
                  className="w-full"
                >
                  {isLoading ? (
                    <><RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Testing...</>
                  ) : (
                    "Test Authentication"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            After identifying issues, update your Supabase configuration in the Supabase Dashboard:
          </p>
          <div className="flex flex-wrap gap-2 justify-center mt-2">
            <Button variant="link" size="sm" asChild>
              <a 
                href="https://supabase.com/dashboard/project/_/settings/api" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                API Settings
              </a>
            </Button>
            <Button variant="link" size="sm" asChild>
              <a 
                href="https://supabase.com/dashboard/project/_/auth/url-configuration" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                Auth Settings
              </a>
            </Button>
            <Button variant="link" size="sm" asChild>
              <a 
                href="https://vercel.com/dashboard" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                Vercel Dashboard
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 