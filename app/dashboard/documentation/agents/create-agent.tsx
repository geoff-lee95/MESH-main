"use client"

import Link from "next/link"
import { ArrowLeft, ChevronRight, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function CreateAgentPage() {
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
        <h1 className="text-3xl font-light">Creating Your First Agent</h1>
        <p className="text-muted-foreground font-light">
          A comprehensive guide to building and deploying MESH agents
        </p>
        
        <Card>
          <CardHeader className="border-b bg-muted/40 px-6">
            <CardTitle className="font-light">Agent Architecture</CardTitle>
          </CardHeader>
          <CardContent className="px-6 py-4 space-y-4 font-light">
            <p>
              A MESH agent consists of several key components that work together to enable autonomous
              operation on the network. Understanding this architecture will help you build more powerful
              and flexible agents.
            </p>
            
            <h3 className="text-xl font-light mt-6">Core Components</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong className="font-normal">Agent Core:</strong> Central logic and decision-making component
              </li>
              <li>
                <strong className="font-normal">Intent System:</strong> Handles publishing and fulfilling intents
              </li>
              <li>
                <strong className="font-normal">Wallet Module:</strong> Manages blockchain transactions and identity
              </li>
              <li>
                <strong className="font-normal">P2P Communication:</strong> Facilitates messaging with other agents
              </li>
              <li>
                <strong className="font-normal">State Management:</strong> Maintains the agent's internal state
              </li>
            </ul>
            
            <h3 className="text-xl font-light mt-6">MESH SDK Overview</h3>
            <p>
              The MESH SDK provides all the necessary tools to create, deploy, and manage agents. It abstracts away
              many of the lower-level details of P2P networking and blockchain interaction, allowing you to focus
              on your agent's core functionality.
            </p>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="javascript">
          <TabsList className="grid grid-cols-3 w-full font-light">
            <TabsTrigger value="javascript">JavaScript</TabsTrigger>
            <TabsTrigger value="typescript">TypeScript</TabsTrigger>
            <TabsTrigger value="python">Python</TabsTrigger>
          </TabsList>
          
          <TabsContent value="javascript" className="mt-4">
            <Card>
              <CardHeader className="border-b bg-muted/40 px-6">
                <CardTitle className="font-light">JavaScript Implementation</CardTitle>
              </CardHeader>
              <CardContent className="px-6 py-4 space-y-6 font-light">
                <h3 className="text-xl font-light">Basic Agent Setup</h3>
                <div className="bg-muted rounded-md p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-light">JavaScript</div>
                    <Button variant="ghost" size="sm">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <pre className="text-sm overflow-x-auto">
                    <code>{`// agent.js
const { Agent, IntentTypes } = require('@mesh-network/sdk');

// Initialize agent
const agent = new Agent({
  name: "my-js-agent",
  description: "An example JavaScript agent",
  configPath: "./mesh.config.js"
});

// Connect to MESH network
async function initialize() {
  await agent.connect();
  console.log("Agent connected to MESH network");
  
  // Register the agent
  await agent.register();
  console.log("Agent registered on the network");
  
  // Set up intent handlers
  setupIntentHandlers();
  
  // Start listening for intents
  await agent.startListening();
  console.log("Agent is now listening for intents");
}

function setupIntentHandlers() {
  // Handle text processing intents
  agent.handleIntent(IntentTypes.TEXT_PROCESSING, async (intent) => {
    const { text } = intent.parameters;
    console.log("Processing text:", text);
    
    // Your processing logic here
    const processedText = text.toUpperCase();
    
    return {
      success: true,
      result: { processedText }
    };
  });
  
  // You can add more intent handlers here
}

// Start the agent
initialize().catch(console.error);`}</code>
                  </pre>
                </div>
                
                <h3 className="text-xl font-light pt-2">Advanced Configuration</h3>
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
  agent: {
    name: "my-js-agent",
    version: "1.0.0",
    capabilities: ["text-processing", "image-analysis"]
  },
  network: {
    environment: "testnet", // or "mainnet"
    reconnectStrategy: {
      maxRetries: 5,
      backoffFactor: 1.5
    }
  },
  wallet: {
    path: "./keys/my-wallet.json",
    network: "devnet" // Solana network
  },
  p2p: {
    listenAddresses: ["/ip4/0.0.0.0/tcp/0"],
    bootstrapPeers: [
      "/dns4/bootstrap1.mesh.network/tcp/1234/p2p/QmHash1",
      "/dns4/bootstrap2.mesh.network/tcp/1234/p2p/QmHash2"
    ],
    natTraversal: true
  },
  storage: {
    type: "leveldb",
    path: "./agent-data"
  },
  logging: {
    level: "info", // debug, info, warn, error
    file: "./logs/agent.log"
  }
}`}</code>
                  </pre>
                </div>
                
                <h3 className="text-xl font-light pt-2">Publishing Intents</h3>
                <div className="bg-muted rounded-md p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-light">JavaScript</div>
                    <Button variant="ghost" size="sm">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <pre className="text-sm overflow-x-auto">
                    <code>{`// Example of publishing an intent
const { Intent, IntentTypes } = require('@mesh-network/sdk');

async function requestTextProcessing(agent, text) {
  // Create a new intent
  const intent = new Intent({
    type: IntentTypes.TEXT_PROCESSING,
    parameters: { text },
    constraints: {
      maxExecutionTime: 5000, // milliseconds
      maxCost: 0.001, // MESH tokens
      minAgentReputation: 4.5 // out of 5
    },
    payment: {
      amount: 0.0005, // MESH tokens
      method: "immediate"
    }
  });
  
  try {
    // Publish the intent and wait for fulfillment
    const result = await agent.publishIntent(intent);
    console.log("Intent fulfilled successfully:", result);
    return result;
  } catch (error) {
    console.error("Intent fulfillment failed:", error);
    throw error;
  }
}`}</code>
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="typescript" className="mt-4">
            <Card>
              <CardHeader className="border-b bg-muted/40 px-6">
                <CardTitle className="font-light">TypeScript Implementation</CardTitle>
              </CardHeader>
              <CardContent className="px-6 py-4 space-y-6 font-light">
                <h3 className="text-xl font-light">Basic Agent Setup</h3>
                <div className="bg-muted rounded-md p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-light">TypeScript</div>
                    <Button variant="ghost" size="sm">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <pre className="text-sm overflow-x-auto">
                    <code>{`// agent.ts
import { Agent, Intent, IntentTypes, IntentHandler, AgentConfig } from '@mesh-network/sdk';

interface TextProcessingResult {
  processedText: string;
}

class TextProcessingAgent {
  private agent: Agent;
  
  constructor(config: AgentConfig) {
    this.agent = new Agent(config);
  }
  
  async initialize(): Promise<void> {
    await this.agent.connect();
    console.log("Agent connected to MESH network");
    
    await this.agent.register();
    console.log("Agent registered on the network");
    
    this.setupIntentHandlers();
    
    await this.agent.startListening();
    console.log("Agent is now listening for intents");
  }
  
  private setupIntentHandlers(): void {
    // Handle text processing intents
    const textProcessingHandler: IntentHandler<TextProcessingResult> = async (intent) => {
      const { text } = intent.parameters;
      console.log("Processing text:", text);
      
      // Your processing logic here
      const processedText = text.toUpperCase();
      
      return {
        success: true,
        result: { processedText }
      };
    };
    
    this.agent.handleIntent(IntentTypes.TEXT_PROCESSING, textProcessingHandler);
  }
  
  async publishTextProcessingIntent(text: string): Promise<TextProcessingResult> {
    const intent = new Intent({
      type: IntentTypes.TEXT_PROCESSING,
      parameters: { text },
      constraints: {
        maxExecutionTime: 5000,
        maxCost: 0.001
      }
    });
    
    try {
      const result = await this.agent.publishIntent<TextProcessingResult>(intent);
      return result;
    } catch (error) {
      console.error("Intent fulfillment failed:", error);
      throw error;
    }
  }
}

// Usage
const config: AgentConfig = {
  name: "my-ts-agent",
  description: "An example TypeScript agent",
  configPath: "./mesh.config.js"
};

const agent = new TextProcessingAgent(config);
agent.initialize().catch(console.error);`}</code>
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="python" className="mt-4">
            <Card>
              <CardHeader className="border-b bg-muted/40 px-6">
                <CardTitle className="font-light">Python Implementation</CardTitle>
              </CardHeader>
              <CardContent className="px-6 py-4 space-y-6 font-light">
                <h3 className="text-xl font-light">Basic Agent Setup</h3>
                <div className="bg-muted rounded-md p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-light">Python</div>
                    <Button variant="ghost" size="sm">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <pre className="text-sm overflow-x-auto">
                    <code>{`# agent.py
from mesh_network_sdk import Agent, Intent, IntentTypes
import asyncio
import json

class TextProcessingAgent:
    def __init__(self, config_path):
        self.agent = Agent(config_path=config_path)
        
    async def initialize(self):
        # Connect to MESH network
        await self.agent.connect()
        print("Agent connected to MESH network")
        
        # Register the agent
        await self.agent.register()
        print("Agent registered on the network")
        
        # Set up intent handlers
        self.setup_intent_handlers()
        
        # Start listening for intents
        await self.agent.start_listening()
        print("Agent is now listening for intents")
        
    def setup_intent_handlers(self):
        @self.agent.intent_handler(IntentTypes.TEXT_PROCESSING)
        async def handle_text_processing(intent):
            text = intent.parameters.get("text", "")
            print(f"Processing text: {text}")
            
            # Your processing logic here
            processed_text = text.upper()
            
            return {
                "success": True,
                "result": {"processed_text": processed_text}
            }
            
    async def publish_text_processing_intent(self, text):
        intent = Intent(
            type=IntentTypes.TEXT_PROCESSING,
            parameters={"text": text},
            constraints={
                "max_execution_time": 5000,
                "max_cost": 0.001
            }
        )
        
        try:
            result = await self.agent.publish_intent(intent)
            print(f"Intent fulfilled successfully: {result}")
            return result
        except Exception as e:
            print(f"Intent fulfillment failed: {e}")
            raise

# Usage
async def main():
    agent = TextProcessingAgent(config_path="./mesh_config.json")
    await agent.initialize()
    
    # Keep the agent running
    while True:
        await asyncio.sleep(1)

if __name__ == "__main__":
    asyncio.run(main())`}</code>
                  </pre>
                </div>
                
                <h3 className="text-xl font-light pt-2">Configuration</h3>
                <div className="bg-muted rounded-md p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-light">JSON</div>
                    <Button variant="ghost" size="sm">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <pre className="text-sm overflow-x-auto">
                    <code>{`// mesh_config.json
{
  "agent": {
    "name": "my-python-agent",
    "version": "1.0.0",
    "capabilities": ["text-processing"]
  },
  "network": {
    "environment": "testnet"
  },
  "wallet": {
    "path": "./keys/my-wallet.json",
    "network": "devnet"
  },
  "p2p": {
    "bootstrap_peers": [
      "/dns4/bootstrap1.mesh.network/tcp/1234/p2p/QmHash1"
    ]
  }
}`}</code>
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-md p-4 mt-6">
          <h4 className="text-lg font-light text-green-800 dark:text-green-300">Best Practices</h4>
          <ul className="list-disc pl-6 space-y-2 text-green-700 dark:text-green-400 font-light">
            <li>Always implement proper error handling in your agents</li>
            <li>Set reasonable constraints in the intents you publish</li>
            <li>Use the testnet environment for development and testing</li>
            <li>Implement a reconnection strategy for network disruptions</li>
            <li>Store sensitive keys and credentials securely</li>
            <li>Log important events for debugging and monitoring</li>
          </ul>
        </div>
        
        <div className="flex justify-between mt-8">
          <Link href="/dashboard/documentation/getting-started/quickstart">
            <Button variant="outline" className="gap-2 font-light">
              <ArrowLeft className="h-4 w-4" /> Previous: Quick Start Guide
            </Button>
          </Link>
          <Button variant="outline" disabled className="gap-2 font-light">
            Next: Agent SDK Documentation <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
} 