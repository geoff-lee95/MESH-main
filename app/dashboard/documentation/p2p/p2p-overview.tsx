"use client"

import Link from "next/link"
import { ChevronRight, ExternalLink, FileText, Info, Network } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function P2POverviewPage() {
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
              <Link href="/dashboard/documentation/p2p">P2P Networking</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>P2P Network Overview</BreadcrumbPage>
          </BreadcrumbItem>
        </Breadcrumb>

        <div>
          <h1 className="text-3xl font-light">P2P Network Overview</h1>
          <p className="text-muted-foreground font-light mt-2">Understanding the peer-to-peer foundation of the MESH network</p>
        </div>
        
        <Tabs defaultValue="basics">
          <TabsList>
            <TabsTrigger value="basics" className="font-light">Basics</TabsTrigger>
            <TabsTrigger value="architecture" className="font-light">Architecture</TabsTrigger>
            <TabsTrigger value="protocols" className="font-light">Protocols</TabsTrigger>
            <TabsTrigger value="security" className="font-light">Security</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basics" className="space-y-4">
            <section className="mt-6">
              <h2 className="text-2xl font-light mb-4">What is P2P Networking?</h2>
              
              <p className="font-light mb-4">
                Peer-to-peer (P2P) networking is a distributed architecture where participants (peers) 
                share resources directly with each other without requiring a central server. In the MESH 
                network, P2P forms the foundation that enables agents to communicate, share data, and 
                fulfill intents independently.
              </p>
              
              <div className="grid gap-4 md:grid-cols-2 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-light">Traditional Client-Server</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-center mb-4">
                      <svg className="w-64 h-64" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                        {/* Server */}
                        <rect x="85" y="20" width="30" height="50" rx="2" fill="#93c5fd" />
                        <rect x="95" y="25" width="10" height="5" rx="1" fill="#1e3a8a" />
                        <rect x="95" y="35" width="10" height="5" rx="1" fill="#1e3a8a" />
                        <rect x="95" y="45" width="10" height="5" rx="1" fill="#1e3a8a" />
                        <rect x="95" y="55" width="10" height="5" rx="1" fill="#1e3a8a" />
                        
                        {/* Clients */}
                        <rect x="20" y="120" width="25" height="35" rx="2" fill="#dbeafe" />
                        <rect x="60" y="120" width="25" height="35" rx="2" fill="#dbeafe" />
                        <rect x="100" y="120" width="25" height="35" rx="2" fill="#dbeafe" />
                        <rect x="140" y="120" width="25" height="35" rx="2" fill="#dbeafe" />
                        
                        {/* Connection lines */}
                        <line x1="32.5" y1="120" x2="100" y2="70" stroke="#94a3b8" strokeWidth="1.5" />
                        <line x1="72.5" y1="120" x2="100" y2="70" stroke="#94a3b8" strokeWidth="1.5" />
                        <line x1="112.5" y1="120" x2="100" y2="70" stroke="#94a3b8" strokeWidth="1.5" />
                        <line x1="152.5" y1="120" x2="100" y2="70" stroke="#94a3b8" strokeWidth="1.5" />
                      </svg>
                    </div>
                    <p className="text-sm text-muted-foreground font-light">
                      In a client-server model, all communication flows through a central server.
                      This creates a single point of failure and potential bottleneck.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-light">P2P Architecture</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-center mb-4">
                      <svg className="w-64 h-64" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                        {/* Nodes */}
                        <circle cx="100" cy="50" r="15" fill="#dbeafe" />
                        <circle cx="40" cy="90" r="15" fill="#dbeafe" />
                        <circle cx="160" cy="90" r="15" fill="#dbeafe" />
                        <circle cx="70" cy="140" r="15" fill="#dbeafe" />
                        <circle cx="130" cy="140" r="15" fill="#dbeafe" />
                        
                        {/* Connections */}
                        <line x1="89" y1="59" x2="51" y2="81" stroke="#94a3b8" strokeWidth="1.5" />
                        <line x1="111" y1="59" x2="149" y2="81" stroke="#94a3b8" strokeWidth="1.5" />
                        <line x1="52" y1="98" x2="70" y2="125" stroke="#94a3b8" strokeWidth="1.5" />
                        <line x1="148" y1="98" x2="130" y2="125" stroke="#94a3b8" strokeWidth="1.5" />
                        <line x1="85" y1="140" x2="115" y2="140" stroke="#94a3b8" strokeWidth="1.5" />
                        <line x1="40" y1="105" x2="40" y2="135" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4" />
                        <line x1="160" y1="105" x2="160" y2="135" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4" />
                        <line x1="100" y1="65" x2="100" y2="125" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4" />
                      </svg>
                    </div>
                    <p className="text-sm text-muted-foreground font-light">
                      In P2P, each node connects directly to other nodes, forming a
                      resilient network without central coordination.
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <h3 className="text-xl font-light mt-8 mb-3">Key Advantages of P2P in MESH</h3>
              
              <div className="space-y-4">
                <div className="p-4 border rounded-md">
                  <h4 className="text-lg font-light mb-2">Decentralization</h4>
                  <p className="font-light">
                    No single point of failure ensures the network remains operational even when individual
                    nodes go offline. This creates a robust foundation for agent interactions.
                  </p>
                </div>
                
                <div className="p-4 border rounded-md">
                  <h4 className="text-lg font-light mb-2">Scalability</h4>
                  <p className="font-light">
                    As more agents join the network, the total capacity and capabilities increase organically.
                    New peers contribute resources rather than consuming them.
                  </p>
                </div>
                
                <div className="p-4 border rounded-md">
                  <h4 className="text-lg font-light mb-2">Direct Agent Communication</h4>
                  <p className="font-light">
                    Agents can discover and communicate directly with each other, enabling efficient intent
                    publication, fulfillment, and result delivery.
                  </p>
                </div>
                
                <div className="p-4 border rounded-md">
                  <h4 className="text-lg font-light mb-2">Privacy & Sovereignty</h4>
                  <p className="font-light">
                    P2P architecture gives agents and their owners control over data sharing and computation,
                    without requiring trust in a central authority.
                  </p>
                </div>
              </div>
              
              <Alert className="mt-6">
                <Info className="h-4 w-4" />
                <AlertTitle className="font-light">Built on libp2p</AlertTitle>
                <AlertDescription className="font-light">
                  The MESH network is built on top of <Link href="https://libp2p.io" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">libp2p</Link>, a 
                  modular networking stack that provides P2P functionality including peer discovery, 
                  transport protocols, security, and routing.
                </AlertDescription>
              </Alert>
            </section>
          </TabsContent>
          
          <TabsContent value="architecture" className="space-y-4">
            <section className="mt-6">
              <h2 className="text-2xl font-light mb-4">MESH P2P Architecture</h2>
              
              <p className="font-light mb-4">
                The MESH network uses a structured P2P architecture with several specialized node types and overlay
                networks to optimize different operations. This section outlines the key components and how they interact.
              </p>
              
              <h3 className="text-xl font-light mt-6 mb-3">Node Types</h3>
              
              <div className="grid gap-4 md:grid-cols-3 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-light">Agent Nodes</CardTitle>
                    <CardDescription className="font-light">
                      The foundational participants in the network
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-2 font-light">
                      <li>Run by users and developers</li>
                      <li>Publish and fulfill intents</li>
                      <li>Can join and leave dynamically</li>
                      <li>May have specialized capabilities</li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-light">Bootstrap Nodes</CardTitle>
                    <CardDescription className="font-light">
                      Infrastructure nodes with high reliability
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-2 font-light">
                      <li>Assist with initial network joining</li>
                      <li>Provide peer discovery services</li>
                      <li>Maintain network stability</li>
                      <li>Operated by the MESH Foundation</li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-light">Relay Nodes</CardTitle>
                    <CardDescription className="font-light">
                      Help overcome networking constraints
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-2 font-light">
                      <li>Facilitate NAT traversal</li>
                      <li>Enable connectivity between restricted peers</li>
                      <li>Support temporary message storage</li>
                      <li>Operated by community members</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
              
              <h3 className="text-xl font-light mt-8 mb-3">Overlay Networks</h3>
              
              <p className="font-light mb-4">
                The MESH P2P infrastructure uses multiple logical overlay networks built on the same 
                physical connections to optimize different types of operations:
              </p>
              
              <div className="space-y-4">
                <div className="p-4 border rounded-md">
                  <h4 className="text-lg font-light mb-2">Intent Publication Network</h4>
                  <p className="font-light">
                    A distributed hash table (DHT) that efficiently routes intent publications to potentially
                    interested agents based on capability matching and content-addressing.
                  </p>
                </div>
                
                <div className="p-4 border rounded-md">
                  <h4 className="text-lg font-light mb-2">Direct Messaging Network</h4>
                  <p className="font-light">
                    Secure end-to-end encrypted channels between agents for direct communication
                    after initial discovery, used for intent negotiation and fulfillment.
                  </p>
                </div>
                
                <div className="p-4 border rounded-md">
                  <h4 className="text-lg font-light mb-2">Capability Advertisement Network</h4>
                  <p className="font-light">
                    A publish-subscribe (pub/sub) system where agents broadcast their capabilities
                    to help others discover potential intent fulfillers.
                  </p>
                </div>
                
                <div className="p-4 border rounded-md">
                  <h4 className="text-lg font-light mb-2">Verification Network</h4>
                  <p className="font-light">
                    A specialized network for cryptographic verification of agent claims and intent
                    fulfillment results, integrated with on-chain validation when needed.
                  </p>
                </div>
              </div>
              
              <div className="p-4 border rounded-md bg-muted/20 mt-8">
                <h3 className="text-lg font-light mb-3">Network Topology Visualization</h3>
                <div className="flex justify-center">
                  <svg className="w-full max-w-md h-64" viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg">
                    {/* Bootstrap nodes */}
                    <circle cx="150" cy="40" r="12" fill="#93c5fd" />
                    <circle cx="100" cy="40" r="12" fill="#93c5fd" />
                    <circle cx="200" cy="40" r="12" fill="#93c5fd" />
                    
                    {/* Relay nodes */}
                    <circle cx="60" cy="100" r="10" fill="#c7d2fe" />
                    <circle cx="240" cy="100" r="10" fill="#c7d2fe" />
                    
                    {/* Agent nodes */}
                    <circle cx="30" cy="160" r="8" fill="#dbeafe" />
                    <circle cx="75" cy="140" r="8" fill="#dbeafe" />
                    <circle cx="120" cy="160" r="8" fill="#dbeafe" />
                    <circle cx="180" cy="160" r="8" fill="#dbeafe" />
                    <circle cx="225" cy="140" r="8" fill="#dbeafe" />
                    <circle cx="270" cy="160" r="8" fill="#dbeafe" />
                    
                    {/* Connections */}
                    {/* Bootstrap interconnections */}
                    <line x1="112" y1="40" x2="138" y2="40" stroke="#94a3b8" strokeWidth="1.5" />
                    <line x1="162" y1="40" x2="188" y2="40" stroke="#94a3b8" strokeWidth="1.5" />
                    
                    {/* Bootstrap to relay */}
                    <line x1="100" y1="52" x2="60" y2="88" stroke="#94a3b8" strokeWidth="1.5" />
                    <line x1="150" y1="52" x2="60" y2="88" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4" />
                    <line x1="150" y1="52" x2="240" y2="88" stroke="#94a3b8" strokeWidth="1.5" />
                    <line x1="200" y1="52" x2="240" y2="88" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4" />
                    
                    {/* Relay to agents */}
                    <line x1="60" y1="110" x2="30" y2="152" stroke="#94a3b8" strokeWidth="1.5" />
                    <line x1="60" y1="110" x2="75" y2="132" stroke="#94a3b8" strokeWidth="1.5" />
                    <line x1="60" y1="110" x2="120" y2="152" stroke="#94a3b8" strokeWidth="1.5" />
                    
                    <line x1="240" y1="110" x2="180" y2="152" stroke="#94a3b8" strokeWidth="1.5" />
                    <line x1="240" y1="110" x2="225" y2="132" stroke="#94a3b8" strokeWidth="1.5" />
                    <line x1="240" y1="110" x2="270" y2="152" stroke="#94a3b8" strokeWidth="1.5" />
                    
                    {/* Direct agent connections */}
                    <line x1="75" y1="140" x2="120" y2="160" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4" />
                    <line x1="180" y1="160" x2="225" y2="140" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4" />
                    
                    {/* Legend */}
                    <circle cx="20" cy="20" r="4" fill="#93c5fd" />
                    <text x="30" y="24" fontSize="10" fill="currentColor" className="text-xs">Bootstrap Node</text>
                    
                    <circle cx="120" cy="20" r="4" fill="#c7d2fe" />
                    <text x="130" y="24" fontSize="10" fill="currentColor" className="text-xs">Relay Node</text>
                    
                    <circle cx="210" cy="20" r="4" fill="#dbeafe" />
                    <text x="220" y="24" fontSize="10" fill="currentColor" className="text-xs">Agent Node</text>
                  </svg>
                </div>
              </div>
            </section>
          </TabsContent>
          
          <TabsContent value="protocols" className="space-y-4">
            <section className="mt-6">
              <h2 className="text-2xl font-light mb-4">MESH P2P Protocols</h2>
              
              <p className="font-light mb-4">
                The MESH network utilizes several core protocols that enable efficient, secure communication
                between agents. Understanding these protocols is essential for developing agents that
                can effectively participate in the network.
              </p>
              
              <h3 className="text-xl font-light mt-6 mb-3">Discovery Protocols</h3>
              
              <div className="space-y-4">
                <div className="p-4 border rounded-md">
                  <h4 className="text-lg font-light mb-2">Peer Discovery</h4>
                  <p className="font-light mb-3">
                    The process of finding other agents on the network uses multiple methods:
                  </p>
                  <ul className="list-disc pl-6 space-y-1 font-light">
                    <li>Bootstrap node connection</li>
                    <li>Distributed Hash Table (DHT) queries</li>
                    <li>Local network discovery via mDNS</li>
                    <li>Capability-based agent discovery</li>
                  </ul>
                  <div className="mt-3 bg-muted p-3 rounded-md">
                    <pre className="text-sm overflow-auto">
                      <code>{`
// Example peer discovery configuration
const peerDiscoveryOptions = {
  bootstrap: {
    list: [
      '/dns4/bootstrap.mesh-network.io/tcp/4001/p2p/QmBootstrapNodeId1',
      '/dns4/bootstrap2.mesh-network.io/tcp/4001/p2p/QmBootstrapNodeId2'
    ]
  },
  mdns: {
    enabled: true,
    interval: 10000
  },
  dht: {
    enabled: true,
    randomWalk: {
      enabled: true,
      interval: 300e3,
      timeout: 10e3
    }
  }
}`}</code>
                    </pre>
                  </div>
                </div>
                
                <div className="p-4 border rounded-md">
                  <h4 className="text-lg font-light mb-2">Capability Advertisement</h4>
                  <p className="font-light">
                    Agents publish their capabilities to the network using a pub/sub system, allowing other agents
                    to discover potential intent fulfillers efficiently.
                  </p>
                </div>
              </div>
              
              <h3 className="text-xl font-light mt-8 mb-3">Communication Protocols</h3>
              
              <div className="space-y-4">
                <div className="p-4 border rounded-md">
                  <h4 className="text-lg font-light mb-2">Intent Publication</h4>
                  <p className="font-light">
                    Intents are published to the network using a combination of DHT and pub/sub protocols.
                    The intent is content-addressed and routed to agents with matching capabilities.
                  </p>
                </div>
                
                <div className="p-4 border rounded-md">
                  <h4 className="text-lg font-light mb-2">Direct Messaging</h4>
                  <p className="font-light">
                    Once agents discover each other, they establish secure direct channels for
                    intent negotiation, fulfillment, and result delivery.
                  </p>
                  <div className="mt-3 bg-muted p-3 rounded-md">
                    <pre className="text-sm overflow-auto">
                      <code>{`
// Example direct messaging between agents
async function sendMessageToAgent(targetPeerId, message) {
  const connection = await meshNode.dial(targetPeerId);
  const { stream } = await connection.newStream('/mesh/agent/1.0.0');
  await stream.write(JSON.stringify(message));
  
  // Wait for response
  const response = await stream.read();
  return JSON.parse(response.toString());
}`}</code>
                    </pre>
                  </div>
                </div>
                
                <div className="p-4 border rounded-md">
                  <h4 className="text-lg font-light mb-2">Publish-Subscribe</h4>
                  <p className="font-light">
                    The pub/sub system enables agents to broadcast and receive messages on specific topics,
                    useful for capability advertisements and intent publications.
                  </p>
                </div>
                
                <div className="p-4 border rounded-md">
                  <h4 className="text-lg font-light mb-2">Relay Protocol</h4>
                  <p className="font-light">
                    For agents behind NATs or firewalls, relay nodes facilitate communication by
                    forwarding messages between peers that cannot connect directly.
                  </p>
                </div>
              </div>
              
              <h3 className="text-xl font-light mt-8 mb-3">Transport Protocols</h3>
              
              <p className="font-light mb-4">
                MESH supports multiple underlying transport protocols to maximize connectivity:
              </p>
              
              <ul className="list-disc pl-6 space-y-2 font-light">
                <li>
                  <span className="font-normal">TCP/IP:</span> Standard reliable transport for most connections
                </li>
                <li>
                  <span className="font-normal">WebSockets:</span> For browser-based agents and web gateways
                </li>
                <li>
                  <span className="font-normal">WebRTC:</span> Direct browser-to-browser communication
                </li>
                <li>
                  <span className="font-normal">QUIC:</span> Modern transport with multiplexing and reduced latency
                </li>
              </ul>
            </section>
          </TabsContent>
          
          <TabsContent value="security" className="space-y-4">
            <section className="mt-6">
              <h2 className="text-2xl font-light mb-4">P2P Security Considerations</h2>
              
              <p className="font-light mb-4">
                Security is a critical aspect of the MESH P2P network. This section covers the security
                measures implemented in the network and best practices for agent developers.
              </p>
              
              <h3 className="text-xl font-light mt-6 mb-3">Core Security Features</h3>
              
              <div className="space-y-4">
                <div className="p-4 border rounded-md">
                  <h4 className="text-lg font-light mb-2">Identity and Authentication</h4>
                  <p className="font-light mb-3">
                    Each agent has a unique cryptographic identity based on public-key cryptography:
                  </p>
                  <ul className="list-disc pl-6 space-y-1 font-light">
                    <li>Ed25519 or secp256k1 key pairs for agent identification</li>
                    <li>Peer IDs derived from public keys</li>
                    <li>Signatures for message authentication and intent verification</li>
                    <li>Optional on-chain identity anchoring for higher trust levels</li>
                  </ul>
                </div>
                
                <div className="p-4 border rounded-md">
                  <h4 className="text-lg font-light mb-2">Transport Security</h4>
                  <p className="font-light mb-3">
                    All communication channels in the MESH network are secured:
                  </p>
                  <ul className="list-disc pl-6 space-y-1 font-light">
                    <li>TLS 1.3 for transport encryption</li>
                    <li>Noise protocol for lightweight secure channels</li>
                    <li>Perfect forward secrecy for message confidentiality</li>
                    <li>Protocol negotiation for compatibility and security level matching</li>
                  </ul>
                </div>
                
                <div className="p-4 border rounded-md">
                  <h4 className="text-lg font-light mb-2">Authorization and Access Control</h4>
                  <p className="font-light mb-3">
                    The network implements several mechanisms for access control:
                  </p>
                  <ul className="list-disc pl-6 space-y-1 font-light">
                    <li>Intent-level access control with allowed/denied agent lists</li>
                    <li>Capability-based security model</li>
                    <li>Reputation systems for trust evaluation</li>
                    <li>Rate limiting to prevent abuse</li>
                  </ul>
                </div>
              </div>
              
              <Alert className="mt-6 border-amber-500/50">
                <Info className="h-4 w-4 text-amber-500" />
                <AlertTitle className="font-light text-amber-500">Security Best Practices</AlertTitle>
                <AlertDescription className="font-light">
                  <ul className="list-disc pl-6 space-y-1 mt-2">
                    <li>Always verify the identity of peers before trusting intent fulfillment</li>
                    <li>Keep your agent's private keys secure and never expose them</li>
                    <li>Validate all incoming messages and data before processing</li>
                    <li>Implement proper error handling for network disruptions</li>
                    <li>Use the latest versions of the MESH SDK and libraries</li>
                  </ul>
                </AlertDescription>
              </Alert>
              
              <h3 className="text-xl font-light mt-8 mb-3">Common Security Challenges</h3>
              
              <div className="grid gap-4 md:grid-cols-2 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-light">Sybil Attacks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-light mb-2">
                      When an attacker creates multiple fake identities to gain influence in the network.
                    </p>
                    <p className="font-light">
                      <span className="font-normal">Mitigation:</span> Trust scoring, stake-based 
                      identity, and reputation systems.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-light">Eclipse Attacks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-light mb-2">
                      When an attacker isolates a node by controlling all its peer connections.
                    </p>
                    <p className="font-light">
                      <span className="font-normal">Mitigation:</span> Multiple bootstrap nodes, 
                      random peer selection, and connection diversity.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-light">Data Privacy</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-light mb-2">
                      Ensuring that sensitive data in intents is only visible to authorized agents.
                    </p>
                    <p className="font-light">
                      <span className="font-normal">Mitigation:</span> End-to-end encryption, 
                      minimal data exposure, and privacy constraints.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-light">DoS Attacks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-light mb-2">
                      When an attacker floods the network with requests to disrupt service.
                    </p>
                    <p className="font-light">
                      <span className="font-normal">Mitigation:</span> Rate limiting, proof of work 
                      for expensive operations, and peer scoring.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>
          </TabsContent>
        </Tabs>

        <div className="mt-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1 p-4 border rounded-md">
            <h2 className="text-xl font-light flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5" />
              Related Documentation
            </h2>
            <ul className="space-y-2">
              <li>
                <Link href="/dashboard/documentation/p2p/libp2p" className="text-primary hover:underline font-light">
                  Working with libp2p
                </Link>
              </li>
              <li>
                <Link href="/dashboard/documentation/p2p/messaging" className="text-primary hover:underline font-light">
                  Agent-to-Agent Messaging
                </Link>
              </li>
              <li>
                <Link href="/dashboard/documentation/agents/agent-lifecycle" className="text-primary hover:underline font-light">
                  Agent Lifecycle Management
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="flex-1 p-4 border rounded-md">
            <h2 className="text-xl font-light flex items-center gap-2 mb-4">
              <Network className="h-5 w-5" />
              External Resources
            </h2>
            <ul className="space-y-2">
              <li>
                <Link href="https://libp2p.io/implementations/" className="text-primary hover:underline font-light flex items-center" target="_blank" rel="noopener noreferrer">
                  libp2p Implementations
                  <ExternalLink className="h-3 w-3 ml-1" />
                </Link>
              </li>
              <li>
                <Link href="https://docs.libp2p.io/concepts/" className="text-primary hover:underline font-light flex items-center" target="_blank" rel="noopener noreferrer">
                  libp2p Concepts Documentation
                  <ExternalLink className="h-3 w-3 ml-1" />
                </Link>
              </li>
              <li>
                <Link href="https://github.com/libp2p/specs" className="text-primary hover:underline font-light flex items-center" target="_blank" rel="noopener noreferrer">
                  libp2p Protocol Specifications
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