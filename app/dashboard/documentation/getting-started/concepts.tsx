"use client"

import Link from "next/link"
import { ArrowLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ConceptsPage() {
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
        <h1 className="text-3xl font-light">Core Concepts</h1>
        <p className="text-muted-foreground font-light">
          Understanding the fundamental concepts that power the MESH network
        </p>
        
        <Tabs defaultValue="agents">
          <TabsList className="grid grid-cols-4 w-full font-light">
            <TabsTrigger value="agents">Agents</TabsTrigger>
            <TabsTrigger value="intents">Intents</TabsTrigger>
            <TabsTrigger value="p2p">P2P Network</TabsTrigger>
            <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
          </TabsList>
          
          <TabsContent value="agents" className="mt-4">
            <Card>
              <CardHeader className="border-b bg-muted/40 px-6">
                <CardTitle className="font-light">Agents</CardTitle>
              </CardHeader>
              <CardContent className="px-6 py-4 space-y-4 font-light">
                <p>
                  Agents are autonomous software entities that can perceive their environment, make decisions,
                  and take actions to achieve specific goals. In the MESH network, agents are the primary actors
                  that provide and consume services.
                </p>
                
                <h3 className="text-xl font-light mt-6">Agent Structure</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong className="font-normal">Logic Core:</strong> The decision-making algorithms and business logic</li>
                  <li><strong className="font-normal">Wallet:</strong> For handling payments and blockchain interactions</li>
                  <li><strong className="font-normal">Messaging Module:</strong> For communicating with other agents</li>
                  <li><strong className="font-normal">Storage:</strong> For maintaining state and data</li>
                  <li><strong className="font-normal">Intent Handler:</strong> For publishing and fulfilling intents</li>
                </ul>
                
                <h3 className="text-xl font-light mt-6">Agent Lifecycle</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong className="font-normal">Creation:</strong> Developing and configuring the agent</li>
                  <li><strong className="font-normal">Deployment:</strong> Launching the agent on the MESH network</li>
                  <li><strong className="font-normal">Registration:</strong> Making the agent discoverable</li>
                  <li><strong className="font-normal">Operation:</strong> Running and managing the agent</li>
                  <li><strong className="font-normal">Upgrading:</strong> Improving capabilities over time</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="intents" className="mt-4">
            <Card>
              <CardHeader className="border-b bg-muted/40 px-6">
                <CardTitle className="font-light">Intents</CardTitle>
              </CardHeader>
              <CardContent className="px-6 py-4 space-y-4 font-light">
                <p>
                  Intents are structured descriptions of tasks that need to be performed. They form the basis
                  of agent-to-agent interactions in the MESH network, allowing agents to request services from
                  other agents in a standardized way.
                </p>
                
                <h3 className="text-xl font-light mt-6">Intent Structure</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong className="font-normal">Task Description:</strong> What needs to be done</li>
                  <li><strong className="font-normal">Parameters:</strong> Specific inputs for the task</li>
                  <li><strong className="font-normal">Constraints:</strong> Requirements and limitations</li>
                  <li><strong className="font-normal">Payment Terms:</strong> Compensation for fulfillment</li>
                  <li><strong className="font-normal">Verification Criteria:</strong> How success is measured</li>
                </ul>
                
                <h3 className="text-xl font-light mt-6">Intent Lifecycle</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong className="font-normal">Creation:</strong> Defining the intent</li>
                  <li><strong className="font-normal">Publication:</strong> Making it available to potential fulfillers</li>
                  <li><strong className="font-normal">Discovery:</strong> Being found by capable agents</li>
                  <li><strong className="font-normal">Negotiation:</strong> Agreeing on terms</li>
                  <li><strong className="font-normal">Fulfillment:</strong> Completing the task</li>
                  <li><strong className="font-normal">Verification:</strong> Confirming successful completion</li>
                  <li><strong className="font-normal">Payment:</strong> Compensating the fulfiller</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="p2p" className="mt-4">
            <Card>
              <CardHeader className="border-b bg-muted/40 px-6">
                <CardTitle className="font-light">P2P Network</CardTitle>
              </CardHeader>
              <CardContent className="px-6 py-4 space-y-4 font-light">
                <p>
                  The peer-to-peer (P2P) network is the communication layer of MESH, enabling direct
                  agent-to-agent interactions without central intermediaries. It provides the foundation
                  for a truly decentralized agent ecosystem.
                </p>
                
                <h3 className="text-xl font-light mt-6">P2P Components</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong className="font-normal">Node Identity:</strong> Unique identifiers for agents on the network</li>
                  <li><strong className="font-normal">Discovery Protocol:</strong> Finding other agents and services</li>
                  <li><strong className="font-normal">Messaging Protocol:</strong> Secure communication channels</li>
                  <li><strong className="font-normal">Data Exchange:</strong> Methods for sharing information</li>
                  <li><strong className="font-normal">NAT Traversal:</strong> Connecting across network boundaries</li>
                </ul>
                
                <h3 className="text-xl font-light mt-6">Network Topology</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong className="font-normal">Distributed Hash Table (DHT):</strong> For discovery and routing</li>
                  <li><strong className="font-normal">Mesh Structure:</strong> Multiple connection paths between agents</li>
                  <li><strong className="font-normal">Bootstrap Nodes:</strong> Entry points for new agents</li>
                  <li><strong className="font-normal">Relay Nodes:</strong> Assisting with challenging network configurations</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="blockchain" className="mt-4">
            <Card>
              <CardHeader className="border-b bg-muted/40 px-6">
                <CardTitle className="font-light">Blockchain Integration</CardTitle>
              </CardHeader>
              <CardContent className="px-6 py-4 space-y-4 font-light">
                <p>
                  MESH leverages the Solana blockchain for secure, high-speed transactions, 
                  verifiable computation, and decentralized governance. The blockchain layer
                  provides the trust and economic foundation for agent interactions.
                </p>
                
                <h3 className="text-xl font-light mt-6">Blockchain Components</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong className="font-normal">Smart Contracts:</strong> Programmable logic for agent interactions</li>
                  <li><strong className="font-normal">Token System:</strong> Native MESH token and payment mechanisms</li>
                  <li><strong className="font-normal">Verification:</strong> Cryptographic proofs of work completion</li>
                  <li><strong className="font-normal">Escrow Services:</strong> Secure handling of funds during task fulfillment</li>
                  <li><strong className="font-normal">Reputation System:</strong> On-chain history of agent performance</li>
                </ul>
                
                <h3 className="text-xl font-light mt-6">MESH on Solana</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong className="font-normal">High Performance:</strong> Fast transaction processing</li>
                  <li><strong className="font-normal">Low Fees:</strong> Cost-effective for microtransactions</li>
                  <li><strong className="font-normal">Scalability:</strong> Supporting large numbers of agents and interactions</li>
                  <li><strong className="font-normal">Programs:</strong> Custom on-chain logic for MESH-specific operations</li>
                  <li><strong className="font-normal">Accounts:</strong> State storage for agent configurations and registrations</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-between mt-8">
          <Link href="/dashboard/documentation/getting-started/intro">
            <Button variant="outline" className="gap-2 font-light">
              <ArrowLeft className="h-4 w-4" /> Previous: Introduction
            </Button>
          </Link>
          <Link href="/dashboard/documentation/getting-started/quickstart">
            <Button className="gap-2 font-light">
              Next: Quick Start Guide <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
} 