"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Cookie testing component
export function CookieDebugger() {
  const [cookies, setCookies] = useState<string>("");
  const [cookieTest, setCookieTest] = useState<string>("");
  const [thirdPartyCookieStatus, setThirdPartyCookieStatus] = useState<string>("unknown");

  // Get all cookies
  useEffect(() => {
    setCookies(document.cookie);
  }, []);

  // Set a test cookie
  const setTestCookie = () => {
    const testValue = `test-${Date.now()}`;
    document.cookie = `test_cookie=${testValue}; path=/; max-age=3600; SameSite=Lax`;
    setCookieTest(testValue);
    setTimeout(() => {
      setCookies(document.cookie);
    }, 100);
  };

  // Test third-party cookie blocking
  useEffect(() => {
    const iframe = document.createElement("iframe");
    iframe.src = "about:blank";
    iframe.style.display = "none";
    document.body.appendChild(iframe);

    if (iframe.contentDocument) {
      try {
        // Try to set a cookie in the iframe
        iframe.contentDocument.cookie = "third_party_test=1; path=/";
        // Check if the cookie was set
        const success = iframe.contentDocument.cookie.indexOf("third_party_test=1") !== -1;
        setThirdPartyCookieStatus(success ? "allowed" : "blocked");
      } catch (e) {
        console.error("Error testing third-party cookies:", e);
        setThirdPartyCookieStatus("error");
      }
    }

    // Clean up
    return () => {
      document.body.removeChild(iframe);
    };
  }, []);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Cookie Diagnostics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="font-medium text-sm">Third-Party Cookie Status:</h3>
          <p className={`text-sm ${thirdPartyCookieStatus === "allowed" ? "text-green-600" : "text-red-600"}`}>
            {thirdPartyCookieStatus === "allowed" 
              ? "Third-party cookies are allowed ✅" 
              : thirdPartyCookieStatus === "blocked"
                ? "Third-party cookies are blocked ❌" 
                : "Unable to determine third-party cookie status ⚠️"}
          </p>
          {thirdPartyCookieStatus !== "allowed" && (
            <p className="text-xs text-gray-600">
              Third-party cookie blocking may prevent Supabase authentication from working properly in some browsers.
            </p>
          )}
        </div>

        <Separator />

        <div className="space-y-2">
          <h3 className="font-medium text-sm">Cookie Test:</h3>
          <div className="flex space-x-2 items-center">
            <Button onClick={setTestCookie} size="sm" variant="outline">
              Test Cookie
            </Button>
            <span className="text-xs">
              {cookieTest ? `Test value: ${cookieTest}` : "No test cookie set yet"}
            </span>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <h3 className="font-medium text-sm">All Cookies:</h3>
          <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-auto max-h-32">
            {cookies || "(No cookies found)"}
          </pre>
        </div>

        <div className="text-xs text-gray-500 mt-2">
          <p className="font-medium">Authentication Cookie Checklist:</p>
          <ul className="list-disc list-inside space-y-1 mt-1">
            <li>sb-{process.env.NEXT_PUBLIC_SUPABASE_URL?.split(".")[0]}-auth-token - Required for auth session</li>
            <li>If these cookies are missing, Supabase authentication will fail</li>
            <li>Incognito mode, privacy blockers, and 3rd-party cookie blocking can cause issues</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
} 