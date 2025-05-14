"use client"

import Link from "next/link"
import { FileQuestion } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="container mx-auto p-6 flex flex-col items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-6 max-w-md">
        <div className="bg-primary/10 p-3 rounded-full w-fit mx-auto">
          <FileQuestion className="h-10 w-10 text-primary" />
        </div>
        
        <h2 className="text-2xl font-light">Documentation not found</h2>
        
        <p className="text-muted-foreground font-light">
          Sorry, we couldn't find the documentation article you were looking for. The article may have been
          moved, renamed, or is still being written.
        </p>
        
        <div className="pt-4">
          <Link href="/dashboard/documentation">
            <Button variant="default" className="font-light">Return to Documentation Home</Button>
          </Link>
        </div>
        
        <p className="text-sm text-muted-foreground pt-4 font-light">
          If you believe this is an error, please contact our support team.
        </p>
      </div>
    </div>
  )
} 