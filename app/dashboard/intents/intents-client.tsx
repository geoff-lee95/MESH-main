"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus, ShoppingBag, UserCircle, Bookmark } from "lucide-react"
import { Button } from "@/components/ui/button"
import { IntentList } from "@/components/intents/intent-list"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface IntentsClientProps {
  marketplaceIntents: any[]
  myIntents: any[]
  savedIntentsList: any[]
  userAgents: any[]
  savedIntentIds: string[]
}

export function IntentsClient({
  marketplaceIntents,
  myIntents,
  savedIntentsList,
  userAgents,
  savedIntentIds
}: IntentsClientProps) {
  const [currentTime, setCurrentTime] = useState("")
  
  useEffect(() => {
    // Set the time when the component mounts
    setCurrentTime(new Date().toLocaleTimeString())
    
    // Debug log that we've rendered
    console.log("IntentsClient rendered", {
      timestamp: new Date().toISOString(),
      counts: {
        marketplace: marketplaceIntents.length,
        myIntents: myIntents.length,
        saved: savedIntentsList.length
      }
    })
  }, [marketplaceIntents.length, myIntents.length, savedIntentsList.length])

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-light">Intents</h1>
          <p className="text-muted-foreground font-light">Browse and manage intents on the MESH network</p>
          {/* Debug visibility marker */}
          <div className="mt-2 p-1 text-xs bg-green-500/10 border border-green-500/20 rounded text-green-500">
            Page loaded successfully at {currentTime}
          </div>
        </div>
        <Button asChild>
          <Link href="/dashboard/intents/create" prefetch={true}>
            <Plus className="mr-2 h-4 w-4" /> Publish New Intent
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="marketplace" className="w-full">
        <TabsList className="w-full max-w-md mx-auto mb-2">
          <TabsTrigger value="marketplace" icon={<ShoppingBag className="h-4 w-4" />}>
            Marketplace
          </TabsTrigger>
          <TabsTrigger value="my-intents" icon={<UserCircle className="h-4 w-4" />}>
            My Intents
          </TabsTrigger>
          <TabsTrigger value="saved" icon={<Bookmark className="h-4 w-4" />}>
            Saved
          </TabsTrigger>
        </TabsList>
        <TabsContent value="marketplace">
          <IntentList
            intents={marketplaceIntents}
            showPublisher
            userAgents={userAgents}
            savedIntentIds={savedIntentIds}
          />
        </TabsContent>
        <TabsContent value="my-intents">
          <IntentList
            intents={myIntents}
            savedIntentIds={savedIntentIds}
          />
        </TabsContent>
        <TabsContent value="saved">
          <IntentList
            intents={savedIntentsList}
            showPublisher
            userAgents={userAgents}
            savedIntentIds={savedIntentIds}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
} 