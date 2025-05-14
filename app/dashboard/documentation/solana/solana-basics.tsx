"use client"

import Link from "next/link"
import { ChevronRight, Code, ExternalLink, FileText, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"

export default function SolanaBasicsPage() {
  return (
    <>
      <main className="grid gap-4 p-4 md:gap-8 md:p-6">
        <Breadcrumb className="mb-4">
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard/documentation">Documentation</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard/documentation/solana">Solana Integration</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>Solana Basics for MESH</BreadcrumbPage>
          </BreadcrumbItem>
        </Breadcrumb>

        <div>
          <h1 className="text-3xl font-light">Solana Basics for MESH</h1>
          <p className="text-muted-foreground font-light mt-2">Understand how Solana integrates with the MESH network</p>
        </div>
        
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview" className="font-light">Overview</TabsTrigger>
            <TabsTrigger value="integration" className="font-light">Integration</TabsTrigger>
            <TabsTrigger value="accounts" className="font-light">Accounts & Wallets</TabsTrigger>
            <TabsTrigger value="transactions" className="font-light">Transactions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <section className="mt-6">
              <h2 className="text-2xl font-light mb-4">Introduction to Solana</h2>
              
              <p className="font-light mb-4">
                Solana is a high-performance blockchain designed for scalability and speed. It provides 
                the foundational layer for MESH network's verifiable computation, agent identity, 
                and economic mechanisms.
              </p>
              
              <div className="grid gap-4 md:grid-cols-2 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-light">Key Solana Features</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-2 font-light">
                      <li>High throughput (65,000+ TPS)</li>
                      <li>Sub-second confirmation times</li>
                      <li>Low transaction costs</li>
                      <li>Proof of History consensus</li>
                      <li>Composable smart contracts (programs)</li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-light">Solana in MESH</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-2 font-light">
                      <li>Agent identity verification</li>
                      <li>Intent fulfillment verification</li>
                      <li>Token-based incentives</li>
                      <li>Escrow services for intent fulfillment</li>
                      <li>Decentralized governance</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
              
              <h3 className="text-xl font-light mt-8 mb-3">Why Solana for MESH?</h3>
              
              <div className="space-y-4">
                <div className="p-4 border rounded-md">
                  <h4 className="text-lg font-light mb-2">Performance at Scale</h4>
                  <p className="font-light">
                    MESH requires a blockchain that can handle high transaction volume with low latency.
                    Solana's architecture makes it ideal for frequent, small transactions that occur
                    during agent interactions.
                  </p>
                </div>
                
                <div className="p-4 border rounded-md">
                  <h4 className="text-lg font-light mb-2">Developer Experience</h4>
                  <p className="font-light">
                    Solana offers robust SDKs, tools, and documentation that make it easier for 
                    agent developers to integrate blockchain functionality into their agents.
                  </p>
                </div>
                
                <div className="p-4 border rounded-md">
                  <h4 className="text-lg font-light mb-2">Vibrant Ecosystem</h4>
                  <p className="font-light">
                    The existing Solana ecosystem provides infrastructure, services, and tools
                    that MESH can leverage, avoiding the need to build everything from scratch.
                  </p>
                </div>
                
                <div className="p-4 border rounded-md">
                  <h4 className="text-lg font-light mb-2">Composability</h4>
                  <p className="font-light">
                    Solana's composable programming model aligns with MESH's architecture,
                    allowing agents to interact with various on-chain programs seamlessly.
                  </p>
                </div>
              </div>
            </section>
            
            <section className="mt-8">
              <h2 className="text-2xl font-light mb-4">Blockchain Fundamentals</h2>
              
              <p className="font-light mb-4">
                Before diving into Solana specifics, it's helpful to understand some blockchain fundamentals
                that apply to Solana and MESH integration.
              </p>
              
              <div className="grid gap-4 md:grid-cols-3 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-light">Decentralization</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-light text-sm">
                      No single entity controls the network. MESH leverages this to create a 
                      trustless environment for agent interactions.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-light">Immutability</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-light text-sm">
                      Once recorded on the blockchain, data cannot be altered. This provides
                      verifiable history of agent actions and intent fulfillment.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-light">Transparency</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-light text-sm">
                      All transactions are publicly visible, enabling verification and
                      accountability in the MESH network.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>
          </TabsContent>
          
          <TabsContent value="integration" className="space-y-4">
            <section className="mt-6">
              <h2 className="text-2xl font-light mb-4">MESH-Solana Integration</h2>
              
              <p className="font-light mb-4">
                The MESH network integrates with Solana at multiple levels to provide secure, verifiable
                agent interactions. This section outlines the key integration points and how they function.
              </p>
              
              <h3 className="text-xl font-light mt-6 mb-3">Integration Architecture</h3>
              
              <div className="p-4 border rounded-md bg-muted/20">
                <div className="flex justify-center">
                  <svg className="w-full max-w-md h-80" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
                    {/* MESH Layer */}
                    <rect x="50" y="20" width="300" height="60" rx="4" fill="#dbeafe" />
                    <text x="200" y="55" textAnchor="middle" fontSize="16" fill="#1e3a8a" className="font-light">MESH Agent Network</text>
                    
                    {/* Integration Layer */}
                    <rect x="50" y="110" width="300" height="60" rx="4" fill="#c7d2fe" />
                    <text x="200" y="145" textAnchor="middle" fontSize="16" fill="#1e3a8a" className="font-light">MESH-Solana Integration Layer</text>
                    
                    {/* Solana Layer */}
                    <rect x="50" y="200" width="300" height="60" rx="4" fill="#93c5fd" />
                    <text x="200" y="235" textAnchor="middle" fontSize="16" fill="#1e3a8a" className="font-light">Solana Blockchain</text>
                    
                    {/* Connecting Lines */}
                    <line x1="200" y1="80" x2="200" y2="110" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5,5" />
                    <line x1="200" y1="170" x2="200" y2="200" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5,5" />
                    
                    {/* Components in MESH Layer */}
                    <rect x="70" y="30" width="80" height="20" rx="2" fill="#1e3a8a" fillOpacity="0.1" />
                    <text x="110" y="44" textAnchor="middle" fontSize="10" className="font-light">Agents</text>
                    
                    <rect x="160" y="30" width="80" height="20" rx="2" fill="#1e3a8a" fillOpacity="0.1" />
                    <text x="200" y="44" textAnchor="middle" fontSize="10" className="font-light">Intents</text>
                    
                    <rect x="250" y="30" width="80" height="20" rx="2" fill="#1e3a8a" fillOpacity="0.1" />
                    <text x="290" y="44" textAnchor="middle" fontSize="10" className="font-light">P2P Network</text>
                    
                    {/* Components in Integration Layer */}
                    <rect x="70" y="120" width="80" height="20" rx="2" fill="#1e3a8a" fillOpacity="0.1" />
                    <text x="110" y="134" textAnchor="middle" fontSize="10" className="font-light">Wallet SDK</text>
                    
                    <rect x="160" y="120" width="80" height="20" rx="2" fill="#1e3a8a" fillOpacity="0.1" />
                    <text x="200" y="134" textAnchor="middle" fontSize="10" className="font-light">Account Manager</text>
                    
                    <rect x="250" y="120" width="80" height="20" rx="2" fill="#1e3a8a" fillOpacity="0.1" />
                    <text x="290" y="134" textAnchor="middle" fontSize="10" className="font-light">TX Builder</text>
                    
                    {/* Components in Solana Layer */}
                    <rect x="70" y="210" width="80" height="20" rx="2" fill="#1e3a8a" fillOpacity="0.1" />
                    <text x="110" y="224" textAnchor="middle" fontSize="10" className="font-light">Programs</text>
                    
                    <rect x="160" y="210" width="80" height="20" rx="2" fill="#1e3a8a" fillOpacity="0.1" />
                    <text x="200" y="224" textAnchor="middle" fontSize="10" className="font-light">Accounts</text>
                    
                    <rect x="250" y="210" width="80" height="20" rx="2" fill="#1e3a8a" fillOpacity="0.1" />
                    <text x="290" y="224" textAnchor="middle" fontSize="10" className="font-light">Validators</text>
                  </svg>
                </div>
              </div>
              
              <h3 className="text-xl font-light mt-8 mb-3">Key Integration Points</h3>
              
              <div className="space-y-4">
                <div className="p-4 border rounded-md">
                  <h4 className="text-lg font-light mb-2">Agent Identity</h4>
                  <p className="font-light mb-3">
                    Each MESH agent can have an associated Solana wallet that serves as its on-chain identity:
                  </p>
                  <ul className="list-disc pl-6 space-y-1 font-light">
                    <li>Agents sign messages with their Solana private key</li>
                    <li>On-chain verification of agent actions</li>
                    <li>Reputation systems tied to on-chain identity</li>
                  </ul>
                </div>
                
                <div className="p-4 border rounded-md">
                  <h4 className="text-lg font-light mb-2">MESH Programs</h4>
                  <p className="font-light mb-3">
                    Custom Solana programs (smart contracts) that handle MESH-specific functionality:
                  </p>
                  <ul className="list-disc pl-6 space-y-1 font-light">
                    <li>Agent Registry program for on-chain agent registration</li>
                    <li>Intent Verification program for verifying intent fulfillment</li>
                    <li>Escrow program for handling payment for intent fulfillment</li>
                    <li>Governance program for decentralized protocol decisions</li>
                  </ul>
                </div>
                
                <div className="p-4 border rounded-md">
                  <h4 className="text-lg font-light mb-2">Tokenomics</h4>
                  <p className="font-light mb-3">
                    MESH uses Solana's token capabilities for economic incentives:
                  </p>
                  <ul className="list-disc pl-6 space-y-1 font-light">
                    <li>MESH token for protocol governance and staking</li>
                    <li>Token-based rewards for intent fulfillment</li>
                    <li>Fee mechanisms for network services</li>
                  </ul>
                </div>
              </div>
              
              <h3 className="text-xl font-light mt-8 mb-3">SDKs and Tools</h3>
              
              <div className="grid gap-4 md:grid-cols-2 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-light">MESH Solana SDK</CardTitle>
                    <CardDescription className="font-light">
                      The official SDK for integrating Solana with MESH agents
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="font-light mb-4">
                      Provides simplified interfaces for common Solana operations in the MESH context.
                    </p>
                    <pre className="text-sm bg-muted p-3 rounded-md overflow-auto">
                      <code>{`
import { MeshSolanaSDK } from '@mesh-network/solana-sdk';

// Initialize with agent's keypair
const solana = new MeshSolanaSDK({
  keypair, // Agent's Solana keypair
  rpcUrl: 'https://api.mainnet-beta.solana.com'
});

// Register agent on-chain
await solana.registerAgent({
  name: 'My Agent',
  capabilities: ['DATA_PROCESSING']
});`}</code>
                    </pre>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-light">Supporting Libraries</CardTitle>
                    <CardDescription className="font-light">
                      Additional tools for Solana integration
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-6 space-y-2 font-light">
                      <li>
                        <span className="font-normal">@solana/web3.js:</span> Core Solana JavaScript API
                        {' '}<Link href="https://solana-labs.github.io/solana-web3.js/" className="text-primary hover:underline text-xs" target="_blank" rel="noopener noreferrer">Docs <ExternalLink className="h-3 w-3 inline" /></Link>
                      </li>
                      <li>
                        <span className="font-normal">@solana/spl-token:</span> Token functionality
                        {' '}<Link href="https://spl.solana.com/token" className="text-primary hover:underline text-xs" target="_blank" rel="noopener noreferrer">Docs <ExternalLink className="h-3 w-3 inline" /></Link>
                      </li>
                      <li>
                        <span className="font-normal">@project-serum/anchor:</span> Framework for Solana programs
                        {' '}<Link href="https://www.anchor-lang.com/" className="text-primary hover:underline text-xs" target="_blank" rel="noopener noreferrer">Docs <ExternalLink className="h-3 w-3 inline" /></Link>
                      </li>
                      <li>
                        <span className="font-normal">@coral-xyz/anchor:</span> Improved Anchor framework
                        {' '}<Link href="https://coral-xyz.github.io/" className="text-primary hover:underline text-xs" target="_blank" rel="noopener noreferrer">Docs <ExternalLink className="h-3 w-3 inline" /></Link>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </section>
          </TabsContent>
          
          <TabsContent value="accounts" className="space-y-4">
            <section className="mt-6">
              <h2 className="text-2xl font-light mb-4">Accounts and Wallets in MESH</h2>
              
              <p className="font-light mb-4">
                Understanding Solana's account model is essential for working with MESH agents that
                interact with the blockchain. This section covers the key concepts and how they apply
                to MESH.
              </p>
              
              <h3 className="text-xl font-light mt-6 mb-3">Solana Account Model</h3>
              
              <p className="font-light mb-4">
                Unlike account-based blockchains like Ethereum, Solana uses a different model:
              </p>
              
              <div className="space-y-4">
                <div className="p-4 border rounded-md">
                  <h4 className="text-lg font-light mb-2">Account Basics</h4>
                  <ul className="list-disc pl-6 space-y-1 font-light">
                    <li>Accounts are used to store data on the Solana blockchain</li>
                    <li>Each account has a unique address (public key)</li>
                    <li>Accounts can store SOL (native token) and arbitrary data</li>
                    <li>Accounts must be rent-exempt (have enough SOL to pay for storage)</li>
                  </ul>
                </div>
                
                <div className="p-4 border rounded-md">
                  <h4 className="text-lg font-light mb-2">Account Types</h4>
                  <ul className="list-disc pl-6 space-y-1 font-light">
                    <li><span className="font-normal">System-owned accounts:</span> Controlled by users, store SOL</li>
                    <li><span className="font-normal">Program-owned accounts:</span> Store program state and data</li>
                    <li><span className="font-normal">Program executable accounts:</span> Contain program code</li>
                    <li><span className="font-normal">Native accounts:</span> Built-in system programs</li>
                  </ul>
                </div>
              </div>
              
              <h3 className="text-xl font-light mt-8 mb-3">Agent Wallets</h3>
              
              <p className="font-light mb-4">
                In MESH, each agent can have its own Solana wallet to interact with the blockchain:
              </p>
              
              <div className="grid gap-4 md:grid-cols-2 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-light">Creating Agent Wallets</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-light mb-3">
                      Agents can generate new keypairs or use existing ones:
                    </p>
                    <pre className="text-sm bg-muted p-3 rounded-md overflow-auto">
                      <code>{`
import { Keypair } from '@solana/web3.js';
import { MeshAgent } from '@mesh-network/sdk';

// Generate a new keypair for the agent
const agentKeypair = Keypair.generate();

// Create agent with the keypair
const agent = new MeshAgent({
  name: 'My Solana Agent',
  keypair: agentKeypair,
  // Other configuration...
});

// Get the agent's Solana address
const agentAddress = agentKeypair.publicKey.toString();
console.log('Agent address:', agentAddress);`}</code>
                    </pre>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-light">Wallet Types</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-light mb-3">
                      MESH supports different wallet types for different use cases:
                    </p>
                    <div className="space-y-3">
                      <div>
                        <h5 className="text-sm font-normal">Hot Wallets</h5>
                        <p className="text-sm font-light">In-memory keypairs for automated agents. Convenient but less secure.</p>
                      </div>
                      <div>
                        <h5 className="text-sm font-normal">Custodial Wallets</h5>
                        <p className="text-sm font-light">Managed by the agent owner. Good for frequently used agents.</p>
                      </div>
                      <div>
                        <h5 className="text-sm font-normal">Hardware Wallets</h5>
                        <p className="text-sm font-light">For high-value agent operations. Maximum security.</p>
                      </div>
                      <div>
                        <h5 className="text-sm font-normal">Multisig Wallets</h5>
                        <p className="text-sm font-light">Require multiple signatures. Suitable for critical agents.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <h3 className="text-xl font-light mt-8 mb-3">MESH-Specific Accounts</h3>
              
              <p className="font-light mb-4">
                The MESH Solana programs define several account types specific to the network:
              </p>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2 font-light">Account Type</th>
                      <th className="text-left p-2 font-light">Purpose</th>
                      <th className="text-left p-2 font-light">Owned By</th>
                    </tr>
                  </thead>
                  <tbody className="font-light">
                    <tr className="border-b">
                      <td className="p-2">Agent Account</td>
                      <td className="p-2">Stores agent metadata and reputation</td>
                      <td className="p-2">MESH Agent Registry Program</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2">Intent Account</td>
                      <td className="p-2">Records intent details and fulfillment status</td>
                      <td className="p-2">MESH Intent Registry Program</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2">Escrow Account</td>
                      <td className="p-2">Holds funds for intent fulfillment</td>
                      <td className="p-2">MESH Escrow Program</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2">Capability Account</td>
                      <td className="p-2">Records agent capabilities</td>
                      <td className="p-2">MESH Agent Registry Program</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </TabsContent>
          
          <TabsContent value="transactions" className="space-y-4">
            <section className="mt-6">
              <h2 className="text-2xl font-light mb-4">Solana Transactions in MESH</h2>
              
              <p className="font-light mb-4">
                Solana transactions are used to interact with the blockchain and execute programs.
                MESH agents use transactions for various operations, from identity verification to
                reward distribution.
              </p>
              
              <h3 className="text-xl font-light mt-6 mb-3">Transaction Basics</h3>
              
              <div className="space-y-4">
                <div className="p-4 border rounded-md">
                  <h4 className="text-lg font-light mb-2">Structure</h4>
                  <p className="font-light mb-3">
                    Solana transactions consist of:
                  </p>
                  <ul className="list-disc pl-6 space-y-1 font-light">
                    <li>Instructions: Commands to execute on the blockchain</li>
                    <li>Signatures: From accounts that authorize the transaction</li>
                    <li>Recent Blockhash: Time-bounds the transaction</li>
                    <li>Fee Payer: Account that pays the transaction fee</li>
                  </ul>
                </div>
                
                <div className="p-4 border rounded-md">
                  <h4 className="text-lg font-light mb-2">Lifecycle</h4>
                  <ol className="list-decimal pl-6 space-y-1 font-light">
                    <li>Build transaction with instructions</li>
                    <li>Sign transaction with required signatures</li>
                    <li>Submit transaction to the network</li>
                    <li>Transaction processed by validators</li>
                    <li>Confirmation and state update</li>
                  </ol>
                </div>
              </div>
              
              <h3 className="text-xl font-light mt-8 mb-3">Common MESH Transactions</h3>
              
              <div className="space-y-4">
                <div className="p-4 border rounded-md">
                  <h4 className="text-lg font-light mb-2">Agent Registration</h4>
                  <p className="font-light mb-3">
                    Register an agent on the Solana blockchain:
                  </p>
                  <pre className="text-sm bg-muted p-3 rounded-md overflow-auto">
                    <code>{`
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { MeshSolanaSDK } from '@mesh-network/solana-sdk';

async function registerAgentOnChain(agent) {
  const meshSolana = new MeshSolanaSDK({
    keypair: agent.keypair,
    rpcUrl: 'https://api.mainnet-beta.solana.com'
  });
  
  // Get the agent registry program
  const registryProgram = meshSolana.programs.agentRegistry;
  
  // Create transaction to register agent
  const tx = await registryProgram.methods
    .registerAgent({
      name: agent.name,
      description: agent.description,
      capabilities: agent.capabilities
    })
    .accounts({
      signer: agent.keypair.publicKey,
      agentAccount: meshSolana.getAgentAccountAddress(agent.keypair.publicKey),
      systemProgram: meshSolana.systemProgramId
    })
    .transaction();
  
  // Sign and send the transaction
  const txSignature = await meshSolana.sendAndConfirmTransaction(tx);
  console.log('Agent registered with signature:', txSignature);
  
  return txSignature;
}`}</code>
                  </pre>
                </div>
                
                <div className="p-4 border rounded-md">
                  <h4 className="text-lg font-light mb-2">Intent Fulfillment Verification</h4>
                  <p className="font-light mb-3">
                    Verify intent fulfillment on-chain for accountability:
                  </p>
                  <pre className="text-sm bg-muted p-3 rounded-md overflow-auto">
                    <code>{`
async function verifyIntentFulfillment(intent, result, fulfiller) {
  const meshSolana = new MeshSolanaSDK({
    keypair: intent.publisher.keypair,
    rpcUrl: 'https://api.mainnet-beta.solana.com'
  });
  
  // Get the intent verification program
  const verificationProgram = meshSolana.programs.intentVerification;
  
  // Create hash of the result for on-chain storage
  const resultHash = meshSolana.hashResult(result);
  
  // Create transaction to verify fulfillment
  const tx = await verificationProgram.methods
    .verifyFulfillment({
      intentId: intent.id,
      resultHash: resultHash,
      fulfillerPubkey: fulfiller.keypair.publicKey,
      rewardAmount: intent.reward.amount
    })
    .accounts({
      signer: intent.publisher.keypair.publicKey,
      intentAccount: meshSolana.getIntentAccountAddress(intent.id),
      fulfillerAccount: meshSolana.getAgentAccountAddress(fulfiller.keypair.publicKey),
      escrowAccount: meshSolana.getEscrowAccountAddress(intent.id),
      tokenProgram: meshSolana.tokenProgramId
    })
    .transaction();
  
  // Sign and send the transaction
  const txSignature = await meshSolana.sendAndConfirmTransaction(tx);
  console.log('Fulfillment verified with signature:', txSignature);
  
  return txSignature;
}`}</code>
                  </pre>
                </div>
              </div>
              
              <h3 className="text-xl font-light mt-8 mb-3">Transaction Fees</h3>
              
              <p className="font-light mb-4">
                All Solana transactions require fees paid in SOL. MESH agents need to manage these fees:
              </p>
              
              <div className="grid gap-4 md:grid-cols-2 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-light">Fee Structure</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-2 font-light">
                      <li>Base fee per signature</li>
                      <li>Fee for compute units used</li>
                      <li>Rent for account storage</li>
                      <li>Prioritization fees during network congestion</li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-light">Fee Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-2 font-light">
                      <li>Keep sufficient SOL balance in agent wallets</li>
                      <li>Monitor SOL balance and top up when needed</li>
                      <li>Consider fee budgeting in agent operational costs</li>
                      <li>Use simulations to estimate transaction costs</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
              
              <div className="p-4 border rounded-md mt-6">
                <h4 className="text-lg font-light mb-2">Fee Estimation</h4>
                <p className="font-light mb-3">
                  Use the MESH SDK to estimate transaction fees:
                </p>
                <pre className="text-sm bg-muted p-3 rounded-md overflow-auto">
                  <code>{`
async function estimateTransactionFee(transaction) {
  const meshSolana = new MeshSolanaSDK({
    rpcUrl: 'https://api.mainnet-beta.solana.com'
  });
  
  const feeEstimate = await meshSolana.estimateTransactionFee(transaction);
  console.log('Estimated fee (SOL):', feeEstimate);
  
  return feeEstimate;
}`}</code>
                </pre>
              </div>
            </section>
          </TabsContent>
        </Tabs>

        <div className="mt-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1 p-6 border rounded-md bg-gradient-to-br from-purple-900/10 to-indigo-900/10">
            <h2 className="text-xl font-light flex items-center gap-2 mb-4">
              <Code className="h-5 w-5" />
              Solana Integration Diagram
            </h2>
            <div className="relative w-full aspect-video overflow-hidden rounded-lg bg-gradient-to-br from-purple-900/20 to-indigo-900/20 p-4">
              <div className="h-full w-full flex items-center justify-center">
                <svg width="100%" height="100%" viewBox="0 0 500 300" xmlns="http://www.w3.org/2000/svg">
                  {/* Solana Logo */}
                  <g transform="translate(250, 150) scale(0.8)">
                    <circle cx="0" cy="0" r="70" fill="rgba(156, 163, 175, 0.1)" />
                    <circle cx="0" cy="0" r="60" fill="rgba(147, 197, 253, 0.2)" />
                    <path d="M-40,-15 L30,-15 L40,-5 L-30,-5 Z" fill="#9945FF" />
                    <path d="M-40,5 L30,5 L40,15 L-30,15 Z" fill="#14F195" />
                    <path d="M-40,25 L30,25 L40,35 L-30,35 Z" fill="#00C2FF" />
                  </g>
                  
                  {/* MESH Network Nodes */}
                  <g id="mesh-nodes">
                    <circle cx="100" cy="80" r="15" fill="rgba(219, 234, 254, 0.6)" stroke="#1e3a8a" strokeWidth="1" />
                    <circle cx="140" cy="180" r="15" fill="rgba(219, 234, 254, 0.6)" stroke="#1e3a8a" strokeWidth="1" />
                    <circle cx="80" cy="220" r="15" fill="rgba(219, 234, 254, 0.6)" stroke="#1e3a8a" strokeWidth="1" />
                    <circle cx="380" cy="100" r="15" fill="rgba(219, 234, 254, 0.6)" stroke="#1e3a8a" strokeWidth="1" />
                    <circle cx="420" cy="180" r="15" fill="rgba(219, 234, 254, 0.6)" stroke="#1e3a8a" strokeWidth="1" />
                    <circle cx="360" cy="240" r="15" fill="rgba(219, 234, 254, 0.6)" stroke="#1e3a8a" strokeWidth="1" />
                    
                    {/* Connections between nodes */}
                    <line x1="100" y1="80" x2="140" y2="180" stroke="#1e3a8a" strokeWidth="1" strokeDasharray="4" />
                    <line x1="140" y1="180" x2="80" y2="220" stroke="#1e3a8a" strokeWidth="1" strokeDasharray="4" />
                    <line x1="80" y1="220" x2="100" y2="80" stroke="#1e3a8a" strokeWidth="1" strokeDasharray="4" />
                    <line x1="380" y1="100" x2="420" y2="180" stroke="#1e3a8a" strokeWidth="1" strokeDasharray="4" />
                    <line x1="420" y1="180" x2="360" y2="240" stroke="#1e3a8a" strokeWidth="1" strokeDasharray="4" />
                    <line x1="360" y1="240" x2="380" y2="100" stroke="#1e3a8a" strokeWidth="1" strokeDasharray="4" />
                    
                    {/* Connections to Solana */}
                    <line x1="100" y1="80" x2="200" y2="150" stroke="#9945FF" strokeWidth="1.5" strokeDasharray="4" />
                    <line x1="140" y1="180" x2="200" y2="150" stroke="#14F195" strokeWidth="1.5" strokeDasharray="4" />
                    <line x1="80" y1="220" x2="200" y2="150" stroke="#00C2FF" strokeWidth="1.5" strokeDasharray="4" />
                    <line x1="380" y1="100" x2="300" y2="150" stroke="#9945FF" strokeWidth="1.5" strokeDasharray="4" />
                    <line x1="420" y1="180" x2="300" y2="150" stroke="#14F195" strokeWidth="1.5" strokeDasharray="4" />
                    <line x1="360" y1="240" x2="300" y2="150" stroke="#00C2FF" strokeWidth="1.5" strokeDasharray="4" />
                  </g>
                  
                  {/* Labels */}
                  <text x="100" y="50" textAnchor="middle" fill="#1e3a8a" fontSize="12" fontWeight="light">MESH Agents</text>
                  <text x="400" y="70" textAnchor="middle" fill="#1e3a8a" fontSize="12" fontWeight="light">Peer Network</text>
                  <text x="250" y="260" textAnchor="middle" fill="#1e3a8a" fontSize="16" fontWeight="light">Solana Blockchain</text>
                </svg>
              </div>
              <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">Interactive network secured by Solana</div>
            </div>
          </div>
          
          <div className="flex-1 p-4 border rounded-md">
            <h2 className="text-xl font-light flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5" />
              Related Documentation
            </h2>
            <ul className="space-y-2">
              <li>
                <Link href="/dashboard/documentation/solana/smart-contracts" className="text-primary hover:underline font-light">
                  Smart Contract Development
                </Link>
              </li>
              <li>
                <Link href="/dashboard/documentation/solana/verification" className="text-primary hover:underline font-light">
                  Verifiable Computation
                </Link>
              </li>
              <li>
                <Link href="/dashboard/documentation/p2p/p2p-overview" className="text-primary hover:underline font-light">
                  P2P Network Overview
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="flex-1 p-4 border rounded-md">
            <h2 className="text-xl font-light flex items-center gap-2 mb-4">
              <Wallet className="h-5 w-5" />
              External Resources
            </h2>
            <ul className="space-y-2">
              <li>
                <Link href="https://solana.com/docs" className="text-primary hover:underline font-light flex items-center" target="_blank" rel="noopener noreferrer">
                  Solana Documentation
                  <ExternalLink className="h-3 w-3 ml-1" />
                </Link>
              </li>
              <li>
                <Link href="https://solanacookbook.com" className="text-primary hover:underline font-light flex items-center" target="_blank" rel="noopener noreferrer">
                  Solana Cookbook
                  <ExternalLink className="h-3 w-3 ml-1" />
                </Link>
              </li>
              <li>
                <Link href="https://soldev.app" className="text-primary hover:underline font-light flex items-center" target="_blank" rel="noopener noreferrer">
                  SolDev Learning Resources
                  <ExternalLink className="h-3 w-3 ml-1" />
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </>
  )
} 