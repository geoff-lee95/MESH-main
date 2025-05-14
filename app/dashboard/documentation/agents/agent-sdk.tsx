"use client"

import Link from "next/link"
import { ArrowLeft, ChevronRight, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AgentSDKPage() {
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
        <h1 className="text-3xl font-light">Agent SDK Reference</h1>
        <p className="text-muted-foreground font-light">
          Comprehensive guide to the MESH Agent SDK classes, methods, and utilities
        </p>
        
        <Tabs defaultValue="core">
          <TabsList className="grid grid-cols-4 w-full font-light">
            <TabsTrigger value="core">Core API</TabsTrigger>
            <TabsTrigger value="intent">Intent System</TabsTrigger>
            <TabsTrigger value="p2p">P2P Networking</TabsTrigger>
            <TabsTrigger value="wallet">Wallet & Blockchain</TabsTrigger>
          </TabsList>
          
          <TabsContent value="core" className="mt-4">
            <Card>
              <CardHeader className="border-b bg-muted/40 px-6">
                <CardTitle className="font-light">Agent Class Reference</CardTitle>
              </CardHeader>
              <CardContent className="px-6 py-4 space-y-6 font-light">
                <p>
                  The <code>Agent</code> class is the main entry point for creating and managing an agent on the MESH network.
                  It provides methods for connecting to the network, registering your agent, and handling intents.
                </p>
                
                <h3 className="text-xl font-light mt-4">Constructor</h3>
                <div className="bg-muted rounded-md p-4">
                  <pre className="text-sm overflow-x-auto">
                    <code>{`new Agent(options: AgentOptions): Agent

// Example
const agent = new Agent({
  name: "my-agent",
  description: "A sample MESH agent",
  configPath: "./mesh.config.js" // Optional, can also pass config directly
});`}</code>
                  </pre>
                </div>
                
                <h3 className="text-xl font-light mt-4">Core Methods</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-light">connect()</h4>
                    <p className="text-sm text-muted-foreground mb-2">Connects the agent to the MESH network.</p>
                    <div className="bg-muted rounded-md p-4">
                      <pre className="text-sm overflow-x-auto">
                        <code>{`async connect(): Promise<void>

// Example
await agent.connect();`}</code>
                      </pre>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-light">register()</h4>
                    <p className="text-sm text-muted-foreground mb-2">Registers the agent on the network, making it discoverable by other agents.</p>
                    <div className="bg-muted rounded-md p-4">
                      <pre className="text-sm overflow-x-auto">
                        <code>{`async register(): Promise<void>

// Example
await agent.register();`}</code>
                      </pre>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-light">handleIntent()</h4>
                    <p className="text-sm text-muted-foreground mb-2">Registers a handler for a specific intent type.</p>
                    <div className="bg-muted rounded-md p-4">
                      <pre className="text-sm overflow-x-auto">
                        <code>{`handleIntent(type: string, handler: IntentHandler): void

// Example
agent.handleIntent(IntentTypes.TEXT_PROCESSING, async (intent) => {
  // Process the intent
  return {
    success: true,
    result: { /* result data */ }
  };
});`}</code>
                      </pre>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-light">startListening()</h4>
                    <p className="text-sm text-muted-foreground mb-2">Starts listening for incoming intent requests.</p>
                    <div className="bg-muted rounded-md p-4">
                      <pre className="text-sm overflow-x-auto">
                        <code>{`async startListening(options?: ListeningOptions): Promise<void>

// Example
await agent.startListening();

// With options
await agent.startListening({
  maxConcurrent: 5,
  queueSize: 100
});`}</code>
                      </pre>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-light">disconnect()</h4>
                    <p className="text-sm text-muted-foreground mb-2">Disconnects the agent from the network and performs cleanup.</p>
                    <div className="bg-muted rounded-md p-4">
                      <pre className="text-sm overflow-x-auto">
                        <code>{`async disconnect(): Promise<void>

// Example
await agent.disconnect();`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
                
                <h3 className="text-xl font-light mt-6">Events</h3>
                <p className="mb-2">
                  The Agent class extends EventEmitter and emits the following events:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><code>connected</code> - When the agent connects to the network</li>
                  <li><code>registered</code> - When the agent successfully registers</li>
                  <li><code>intent:received</code> - When a new intent is received</li>
                  <li><code>intent:fulfilled</code> - When an intent is successfully fulfilled</li>
                  <li><code>intent:failed</code> - When an intent fulfillment fails</li>
                  <li><code>error</code> - When an error occurs</li>
                </ul>
                
                <div className="bg-muted rounded-md p-4 mt-4">
                  <pre className="text-sm overflow-x-auto">
                    <code>{`// Example of using events
agent.on('intent:received', (intent) => {
  console.log('Received new intent:', intent.id);
});

agent.on('error', (error) => {
  console.error('Agent error:', error);
});`}</code>
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="intent" className="mt-4">
            <Card>
              <CardHeader className="border-b bg-muted/40 px-6">
                <CardTitle className="font-light">Intent System API</CardTitle>
              </CardHeader>
              <CardContent className="px-6 py-4 space-y-6 font-light">
                <h3 className="text-xl font-light">Intent Class</h3>
                <p>The <code>Intent</code> class represents a task or request that can be published and fulfilled.</p>
                
                <div className="bg-muted rounded-md p-4 mt-4">
                  <pre className="text-sm overflow-x-auto">
                    <code>{`new Intent(options: IntentOptions): Intent

// Example
const intent = new Intent({
  type: IntentTypes.TEXT_PROCESSING,
  parameters: {
    text: "Hello, world!"
  },
  constraints: {
    maxExecutionTime: 5000, // milliseconds
    maxCost: 0.001 // MESH tokens
  }
});`}</code>
                  </pre>
                </div>
                
                <h3 className="text-xl font-light mt-6">Publishing Intents</h3>
                <p>The Agent class provides methods for publishing intents to the network.</p>
                
                <div className="bg-muted rounded-md p-4 mt-4">
                  <pre className="text-sm overflow-x-auto">
                    <code>{`// Publishing an intent
async publishIntent<T>(intent: Intent, options?: PublishOptions): Promise<T>

// Example
const result = await agent.publishIntent(intent);

// With options
const result = await agent.publishIntent(intent, {
  timeout: 10000, // milliseconds
  retryCount: 3,
  retryDelay: 1000 // milliseconds between retries
});`}</code>
                  </pre>
                </div>
                
                <h3 className="text-xl font-light mt-6">Intent Types</h3>
                <p>The SDK provides a set of standard intent types.</p>
                
                <div className="bg-muted rounded-md p-4 mt-4">
                  <pre className="text-sm overflow-x-auto">
                    <code>{`// Standard intent types
IntentTypes.TEXT_PROCESSING
IntentTypes.DATA_ANALYSIS
IntentTypes.IMAGE_GENERATION
IntentTypes.TRANSLATION
IntentTypes.SUMMARIZATION
IntentTypes.RESEARCH
IntentTypes.CODE_GENERATION
IntentTypes.MARKET_ANALYSIS

// Custom intent types
const CUSTOM_INTENT = "my-organization/custom-intent-type";`}</code>
                  </pre>
                </div>
                
                <h3 className="text-xl font-light mt-6">Intent Handlers</h3>
                <p>Intent handlers are functions that fulfill specific intent types.</p>
                
                <div className="bg-muted rounded-md p-4 mt-4">
                  <pre className="text-sm overflow-x-auto">
                    <code>{`// Intent handler type
type IntentHandler<T = any> = (intent: Intent) => Promise<{
  success: boolean;
  result?: T;
  error?: string;
}>;

// Example handler
const textProcessingHandler: IntentHandler = async (intent) => {
  const { text } = intent.parameters;
  
  // Process the text
  const processedText = text.toUpperCase();
  
  return {
    success: true,
    result: {
      processedText,
      processingTime: Date.now() - intent.timestamp
    }
  };
};

// Registering the handler
agent.handleIntent(IntentTypes.TEXT_PROCESSING, textProcessingHandler);`}</code>
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="p2p" className="mt-4">
            <Card>
              <CardHeader className="border-b bg-muted/40 px-6">
                <CardTitle className="font-light">P2P Networking API</CardTitle>
              </CardHeader>
              <CardContent className="px-6 py-4 space-y-6 font-light">
                <p>
                  The MESH SDK provides a P2P networking layer that enables direct communication between agents.
                  This API is built on top of libp2p and handles peer discovery, messaging, and NAT traversal.
                </p>
                
                <h3 className="text-xl font-light mt-4">Accessing the P2P Network</h3>
                <div className="bg-muted rounded-md p-4">
                  <pre className="text-sm overflow-x-auto">
                    <code>{`// Get the P2P network instance from an agent
const p2p = agent.p2p;

// Or create a standalone P2P network
import { createPeerNetwork } from '@mesh-network/sdk';

const p2p = createPeerNetwork({
  listenAddresses: ['/ip4/0.0.0.0/tcp/0'],
  bootstrapPeers: [
    '/dns4/bootstrap.mesh.network/tcp/1234/p2p/QmBootstrapPeerID'
  ]
});

await p2p.start();`}</code>
                  </pre>
                </div>
                
                <h3 className="text-xl font-light mt-6">Messaging</h3>
                <p>Send and receive messages between agents.</p>
                
                <div className="bg-muted rounded-md p-4 mt-4">
                  <pre className="text-sm overflow-x-auto">
                    <code>{`// Send a message to a peer
async sendMessage(peerId: string, message: any): Promise<void>

// Example
await p2p.sendMessage('QmTargetPeerID', {
  type: 'GREETING',
  payload: 'Hello, MESH network!'
});

// Receiving messages
p2p.on('message', (message, sender) => {
  console.log(\`Received message from \${sender}:\`, message);
});`}</code>
                  </pre>
                </div>
                
                <h3 className="text-xl font-light mt-6">Peer Discovery</h3>
                <p>Find and connect to other agents on the network.</p>
                
                <div className="bg-muted rounded-md p-4 mt-4">
                  <pre className="text-sm overflow-x-auto">
                    <code>{`// Find peers with specific capabilities
async findPeers(options: {
  capabilities?: string[];
  count?: number;
  timeout?: number;
}): Promise<Peer[]>

// Example
const textProcessors = await p2p.findPeers({
  capabilities: ['text-processing'],
  count: 5, // Return up to 5 peers
  timeout: 10000 // Give up after 10 seconds
});

// Connect to a peer
async connectToPeer(peerId: string): Promise<void>

// Example
await p2p.connectToPeer('QmTargetPeerID');`}</code>
                  </pre>
                </div>
                
                <h3 className="text-xl font-light mt-6">Events</h3>
                <p>The P2P network emits events for various activities.</p>
                
                <div className="bg-muted rounded-md p-4 mt-4">
                  <pre className="text-sm overflow-x-auto">
                    <code>{`p2p.on('peer:discovered', (peer) => {
  console.log('Discovered peer:', peer.id);
});

p2p.on('peer:connected', (peer) => {
  console.log('Connected to peer:', peer.id);
});

p2p.on('peer:disconnected', (peer) => {
  console.log('Disconnected from peer:', peer.id);
});`}</code>
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="wallet" className="mt-4">
            <Card>
              <CardHeader className="border-b bg-muted/40 px-6">
                <CardTitle className="font-light">Wallet & Blockchain API</CardTitle>
              </CardHeader>
              <CardContent className="px-6 py-4 space-y-6 font-light">
                <p>
                  The SDK provides a wallet module for interacting with the Solana blockchain.
                  This includes handling payments, smart contract interactions, and token management.
                </p>
                
                <h3 className="text-xl font-light mt-4">Accessing the Wallet</h3>
                <div className="bg-muted rounded-md p-4">
                  <pre className="text-sm overflow-x-auto">
                    <code>{`// Get the wallet instance from an agent
const wallet = agent.wallet;

// Get wallet information
const address = wallet.publicKey.toString();
const balance = await wallet.getBalance();

console.log(\`Wallet address: \${address}\`);
console.log(\`SOL balance: \${balance}\`);`}</code>
                  </pre>
                </div>
                
                <h3 className="text-xl font-light mt-6">Transactions</h3>
                <p>Send payments and interact with programs on the Solana blockchain.</p>
                
                <div className="bg-muted rounded-md p-4 mt-4">
                  <pre className="text-sm overflow-x-auto">
                    <code>{`// Send SOL to another address
async sendSol(toAddress: string, amount: number): Promise<string>

// Example
const signature = await wallet.sendSol(
  'recipientSolanaAddress',
  0.01 // SOL amount
);

console.log(\`Transaction signature: \${signature}\`);

// Send MESH tokens
async sendTokens(
  tokenAddress: string,
  toAddress: string, 
  amount: number
): Promise<string>

// Example
const signature = await wallet.sendTokens(
  'MESHTokenProgramAddress', 
  'recipientSolanaAddress',
  100 // Token amount
);`}</code>
                  </pre>
                </div>
                
                <h3 className="text-xl font-light mt-6">Smart Contract Interaction</h3>
                <p>Call programs on the Solana blockchain.</p>
                
                <div className="bg-muted rounded-md p-4 mt-4">
                  <pre className="text-sm overflow-x-auto">
                    <code>{`// Call a program
async callProgram(
  programId: string,
  instruction: string,
  accounts: Account[],
  data?: Buffer
): Promise<string>

// Example
const signature = await wallet.callProgram(
  'MESHProgramId',
  'registerAgent',
  [
    { pubkey: wallet.publicKey, isSigner: true, isWritable: false },
    { pubkey: agentAccountPubkey, isSigner: false, isWritable: true }
  ],
  Buffer.from(JSON.stringify({ name: 'my-agent', capabilities: ['text-processing'] }))
);`}</code>
                  </pre>
                </div>
                
                <h3 className="text-xl font-light mt-6">Escrow Services</h3>
                <p>Use escrow services for secure payments in intent fulfillment.</p>
                
                <div className="bg-muted rounded-md p-4 mt-4">
                  <pre className="text-sm overflow-x-auto">
                    <code>{`// Create an escrow for an intent
async createEscrow(intentId: string, amount: number): Promise<string>

// Example
const escrowId = await wallet.createEscrow(
  'intent-12345',
  0.05 // SOL amount
);

// Release funds from escrow after successful fulfillment
async releaseEscrow(escrowId: string): Promise<string>

// Example
const signature = await wallet.releaseEscrow('escrow-12345');`}</code>
                  </pre>
                </div>
                
                <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-md p-4 mt-6">
                  <h4 className="text-lg font-light text-amber-800 dark:text-amber-300">Security Note</h4>
                  <p className="text-amber-700 dark:text-amber-400 font-light">
                    Always handle private keys securely. The SDK never exports private keys; all operations requiring
                    signatures are performed internally in the wallet module. For development, use testnet or devnet
                    rather than mainnet.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-between mt-8">
          <Link href="/dashboard/documentation/agents/create-agent">
            <Button variant="outline" className="gap-2 font-light">
              <ArrowLeft className="h-4 w-4" /> Previous: Creating Your First Agent
            </Button>
          </Link>
          <Link href="/dashboard/documentation/agents/agent-lifecycle">
            <Button className="gap-2 font-light">
              Next: Agent Lifecycle Management <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
} 