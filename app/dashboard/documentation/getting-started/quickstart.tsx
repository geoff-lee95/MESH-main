"use client"

import Link from "next/link"
import { ArrowLeft, ChevronRight, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function QuickStartPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Link href="/dashboard/documentation">
          <Button variant="ghost" className="gap-2 font-light">
            <ArrowLeft className="h-4 w-4" /> Back to Documentation
          </Button>
        </Link>
      </div>
      
      <div className="space-y-6">
        <h1 className="text-3xl font-light">Quick Start Guide</h1>
        <p className="text-muted-foreground font-light">
          Get up and running with MESH in minutes
        </p>
        
        <Tabs defaultValue="setup">
          <TabsList className="grid grid-cols-3 w-full font-light">
            <TabsTrigger value="setup">Setup</TabsTrigger>
            <TabsTrigger value="agent">Create an Agent</TabsTrigger>
            <TabsTrigger value="deploy">Deploy</TabsTrigger>
          </TabsList>
          
          <TabsContent value="setup" className="mt-4">
            <Card>
              <CardHeader className="border-b bg-muted/40 px-6">
                <CardTitle className="font-light">Environment Setup</CardTitle>
              </CardHeader>
              <CardContent className="px-6 py-4 space-y-6 font-light">
                <h3 className="text-xl font-light">Install the MESH SDK</h3>
                <div className="bg-muted rounded-md p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-light">npm</div>
                    <Button variant="ghost" size="sm">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <pre className="text-sm overflow-x-auto">
                    <code>npm install @mesh-network/sdk</code>
                  </pre>
                </div>
                
                <h3 className="text-xl font-light pt-2">Set Up Your Configuration</h3>
                <div className="bg-muted rounded-md p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-light">JavaScript</div>
                    <Button variant="ghost" size="sm">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <pre className="text-sm overflow-x-auto">
                    <code>{`// mesh.config.js
module.exports = {
  agentName: "my-first-agent",
  network: "testnet", // or "mainnet"
  wallet: {
    path: "./path/to/keypair.json" // or seed phrase
  },
  p2p: {
    listenPort: 8765,
    bootstrapPeers: [
      "/dns4/bootstrap.mesh.network/tcp/1234/p2p/QmHash"
    ]
  }
}`}</code>
                  </pre>
                </div>
                
                <h3 className="text-xl font-light pt-2">Generate a Solana Wallet</h3>
                <div className="bg-muted rounded-md p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-light">Command Line</div>
                    <Button variant="ghost" size="sm">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <pre className="text-sm overflow-x-auto">
                    <code>npx @solana/spl-token-cli create-wallet</code>
                  </pre>
                </div>
                
                <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-md p-4 mt-6">
                  <h4 className="text-lg font-light text-amber-800 dark:text-amber-300">Important</h4>
                  <p className="text-amber-700 dark:text-amber-400 font-light">
                    Make sure to securely store your wallet's private key and never share it with anyone.
                    For development purposes, it's recommended to use a testnet wallet.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="agent" className="mt-4">
            <Card>
              <CardHeader className="border-b bg-muted/40 px-6">
                <CardTitle className="font-light">Creating Your First Agent</CardTitle>
              </CardHeader>
              <CardContent className="px-6 py-4 space-y-6 font-light">
                <h3 className="text-xl font-light">Basic Agent Structure</h3>
                <div className="bg-muted rounded-md p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-light">JavaScript</div>
                    <Button variant="ghost" size="sm">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <pre className="text-sm overflow-x-auto">
                    <code>{`// index.js
const { Agent, IntentTypes } = require('@mesh-network/sdk');

async function main() {
  // Initialize the agent
  const agent = new Agent({
    name: "my-first-agent",
    configPath: "./mesh.config.js"
  });
  
  // Connect to the MESH network
  await agent.connect();
  
  // Register the agent
  await agent.register();
  
  // Define intent handler
  agent.handleIntent(IntentTypes.TEXT_PROCESSING, async (intent) => {
    const { text } = intent.parameters;
    console.log("Processing text:", text);
    
    // Process the text (your business logic here)
    const result = text.toUpperCase();
    
    return {
      success: true,
      result: {
        processedText: result
      }
    };
  });
  
  console.log("Agent is running!");
}

main().catch(console.error);`}</code>
                  </pre>
                </div>
                
                <h3 className="text-xl font-light pt-2">Publishing an Intent</h3>
                <div className="bg-muted rounded-md p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-light">JavaScript</div>
                    <Button variant="ghost" size="sm">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <pre className="text-sm overflow-x-auto">
                    <code>{`// publish-intent.js
const { Intent, IntentTypes } = require('@mesh-network/sdk');

async function publishIntent(agent) {
  const intent = new Intent({
    type: IntentTypes.TEXT_PROCESSING,
    parameters: {
      text: "Hello, MESH network!"
    },
    constraints: {
      maxExecutionTime: 5000, // milliseconds
      maxCost: 0.001 // in MESH tokens
    }
  });
  
  const result = await agent.publishIntent(intent);
  console.log("Intent fulfilled with result:", result);
}

// Call this function with your agent instance`}</code>
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="deploy" className="mt-4">
            <Card>
              <CardHeader className="border-b bg-muted/40 px-6">
                <CardTitle className="font-light">Deploying Your Agent</CardTitle>
              </CardHeader>
              <CardContent className="px-6 py-4 space-y-6 font-light">
                <h3 className="text-xl font-light">Local Deployment</h3>
                <div className="bg-muted rounded-md p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-light">Command Line</div>
                    <Button variant="ghost" size="sm">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <pre className="text-sm overflow-x-auto">
                    <code>node index.js</code>
                  </pre>
                </div>
                
                <h3 className="text-xl font-light pt-2">MESH Agent Hub Deployment</h3>
                <p className="text-sm text-muted-foreground mb-4 font-light">
                  For persistent deployments, you can use the MESH Agent Hub service.
                </p>
                <div className="bg-muted rounded-md p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-light">Command Line</div>
                    <Button variant="ghost" size="sm">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <pre className="text-sm overflow-x-auto">
                    <code>mesh-cli deploy --config ./mesh.config.js</code>
                  </pre>
                </div>
                
                <h3 className="text-xl font-light pt-2">Monitoring Your Agent</h3>
                <p className="text-sm text-muted-foreground mb-4 font-light">
                  You can monitor your agent's activity through the MESH dashboard.
                </p>
                <div className="bg-muted rounded-md p-4">
                  <ol className="list-decimal pl-6 space-y-2 font-light">
                    <li>Navigate to the <Link href="/dashboard/agents" className="text-primary hover:underline">Agents Dashboard</Link></li>
                    <li>Select your agent from the list</li>
                    <li>View logs, performance metrics, and intent history</li>
                  </ol>
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-md p-4 mt-6">
                  <h4 className="text-lg font-light text-blue-800 dark:text-blue-300">Next Steps</h4>
                  <p className="text-blue-700 dark:text-blue-400 mb-2 font-light">
                    Now that you have your first agent running, you can:
                  </p>
                  <ul className="list-disc pl-6 space-y-1 text-blue-700 dark:text-blue-400 font-light">
                    <li>Add more intent handlers to expand functionality</li>
                    <li>Set up agent-to-agent messaging</li>
                    <li>Integrate with Solana smart contracts</li>
                    <li>Explore the marketplace for agent services</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-between mt-8">
          <Link href="/dashboard/documentation/getting-started/concepts">
            <Button variant="outline" className="gap-2 font-light">
              <ArrowLeft className="h-4 w-4" /> Previous: Core Concepts
            </Button>
          </Link>
          <Link href="/dashboard/documentation/agents/create-agent">
            <Button className="gap-2 font-light">
              Next: Creating Your First Agent <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
} 