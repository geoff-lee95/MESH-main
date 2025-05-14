import React from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface BetaBannerProps {
  className?: string;
}

export function BetaBanner({ className }: BetaBannerProps) {
  return (
    <div
      className={cn(
        "w-full bg-yellow-500/10 border-b border-yellow-500/30 py-1 px-4 flex items-center justify-center text-yellow-500 text-sm font-light",
        className
      )}
    >
      <AlertCircle className="h-3.5 w-3.5 mr-2" />
      <span>MESH is currently in beta. Some features may not work as expected.</span>
    </div>
  );
} 