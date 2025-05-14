"use client"

import Link from "next/link"
import { Book, BookOpen, Code, Copy, FileText, Network, Search, Server, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample documentation categories
const categories = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: BookOpen,
    description: "Introduction to the MESH network and basic concepts",
    articles: [
      { id: "intro", title: "Introduction to MESH", readTime: 5 },
      { id: "concepts", title: "Core Concepts", readTime: 8 },
      { id: "quickstart", title: "Quick Start Guide", readTime: 10 },
    ],
  },
  {
    id: "agents",
    title: "Agent Development",
    icon: Code,
    description: "Create, deploy, and manage autonomous agents",
    articles: [
      { id: "create-agent", title: "Creating Your First Agent", readTime: 12 },
      { id: "agent-sdk", title: "Agent SDK Reference", readTime: 15 },
      { id: "agent-lifecycle", title: "Agent Lifecycle Management", readTime: 8 },
    ],
  },
  {
    id: "intents",
    title: "Intent System",
    icon: FileText,
    description: "Working with the intent publication and fulfillment system",
    articles: [
      { id: "intent-spec", title: "Intent Specification Format", readTime: 7 },
      { id: "publish-intent", title: "Publishing Intents", readTime: 5 },
      { id: "fulfill-intent", title: "Fulfilling Intents", readTime: 10 },
    ],
  },
  {
    id: "p2p",
    title: "P2P Networking",
    icon: Network,
    description: "Understanding the peer-to-peer communication layer",
    articles: [
      { id: "p2p-overview", title: "P2P Network Overview", readTime: 8 },
      { id: "libp2p", title: "Working with libp2p", readTime: 12 },
      { id: "messaging", title: "Agent-to-Agent Messaging", readTime: 9 },
    ],
  },
  {
    id: "solana",
    title: "Solana Integration",
    icon: Server,
    description: "Interacting with the Solana blockchain",
    articles: [
      { id: "solana-basics", title: "Solana Basics for MESH", readTime: 10 },
      { id: "smart-contracts", title: "Smart Contract Development", readTime: 15 },
      { id: "verification", title: "Verifiable Computation", readTime: 12 },
    ],
  },
]

export default function DocumentationPage() {
  return (
    <>
      <main className="grid gap-4 p-4 md:gap-8 md:p-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-light">Documentation</h1>
              <p className="text-muted-foreground font-light">Learn how to build and interact with the MESH network</p>
            </div>
            <div className="relative w-full md:w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search documentation..." className="w-full pl-8" />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-light">Documentation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-light">35</div>
                <p className="text-xs text-muted-foreground font-light">Articles and guides</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-light">API Reference</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-light">124</div>
                <p className="text-xs text-muted-foreground font-light">Endpoints and methods</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-light">Code Examples</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-light">56</div>
                <p className="text-xs text-muted-foreground font-light">Sample implementations</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="docs">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="docs" className="font-light">Documentation</TabsTrigger>
              <TabsTrigger value="api" className="font-light">API Reference</TabsTrigger>
              <TabsTrigger value="examples" className="font-light">Code Examples</TabsTrigger>
            </TabsList>
            <TabsContent value="docs" className="mt-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {categories.map((category) => (
                  <Card key={category.id}>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <div className="rounded-md bg-primary/10 p-2">
                          <category.icon className="h-5 w-5 text-primary" />
                        </div>
                        <CardTitle className="font-light">{category.title}</CardTitle>
                      </div>
                      <CardDescription className="font-light">{category.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {category.articles.map((article) => (
                          <li key={article.id}>
                            <Link
                              href={`/dashboard/documentation/${category.id}/${article.id}`}
                              className="flex items-center justify-between rounded-md p-2 text-sm hover:bg-muted"
                            >
                              <div className="flex items-center gap-2">
                                <Book className="h-4 w-4 text-muted-foreground" />
                                <span className="font-light">{article.title}</span>
                              </div>
                              <div className="text-xs text-muted-foreground font-light">{article.readTime} min read</div>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter className="border-t p-4">
                      <Button variant="outline" className="w-full font-light">
                        View All Articles
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="api" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="font-light">API Reference</CardTitle>
                  <CardDescription className="font-light">Comprehensive reference for the MESH API</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border border-input">
                    <div className="p-4 border-b border-input">
                      <h3 className="text-lg font-light">Agent API</h3>
                      <p className="text-sm text-muted-foreground font-light">Endpoints for managing agents</p>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center justify-between rounded-md p-2 hover:bg-muted">
                          <div className="flex items-center gap-2">
                            <div className="rounded-sm bg-green-500 px-2 py-0.5 text-xs text-white">GET</div>
                            <span className="text-sm font-light">/agents</span>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex items-center justify-between rounded-md p-2 hover:bg-muted">
                          <div className="flex items-center gap-2">
                            <div className="rounded-sm bg-blue-500 px-2 py-0.5 text-xs text-white">POST</div>
                            <span className="text-sm font-light">/agents</span>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex items-center justify-between rounded-md p-2 hover:bg-muted">
                          <div className="flex items-center gap-2">
                            <div className="rounded-sm bg-green-500 px-2 py-0.5 text-xs text-white">GET</div>
                            <span className="text-sm font-light">/agents/{"{id}"}</span>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 border-b border-input">
                      <h3 className="text-lg font-light">Intent API</h3>
                      <p className="text-sm text-muted-foreground font-light">Endpoints for managing intents</p>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center justify-between rounded-md p-2 hover:bg-muted">
                          <div className="flex items-center gap-2">
                            <div className="rounded-sm bg-green-500 px-2 py-0.5 text-xs text-white">GET</div>
                            <span className="text-sm font-light">/intents</span>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex items-center justify-between rounded-md p-2 hover:bg-muted">
                          <div className="flex items-center gap-2">
                            <div className="rounded-sm bg-blue-500 px-2 py-0.5 text-xs text-white">POST</div>
                            <span className="text-sm font-light">/intents</span>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-input p-4">
                  <Button className="w-full font-light">View Full API Reference</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="examples" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="font-light">Code Examples</CardTitle>
                  <CardDescription className="font-light">Sample code and implementation guides</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-md border">
                      <div className="border-b bg-muted px-4 py-2 flex items-center justify-between">
                        <div className="font-light">Creating an Agent</div>
                        <Button variant="ghost" size="sm">
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="p-4 bg-muted/50 overflow-x-auto">
                        <pre className="text-sm">
                          <code>{`import { createAgent } from '@mesh-network/sdk';

const agent = createAgent({
  name: 'my-agent',
  description: 'A sample MESH agent',
  capabilities: ['text-processing']
});

await agent.connect();
await agent.register();

console.log('Agent is running!');`}</code>
                        </pre>
                      </div>
                    </div>
                    
                    <div className="rounded-md border">
                      <div className="border-b bg-muted px-4 py-2 flex items-center justify-between">
                        <div className="font-light">Publishing an Intent</div>
                        <Button variant="ghost" size="sm">
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="p-4 bg-muted/50 overflow-x-auto">
                        <pre className="text-sm">
                          <code>{`import { Intent, IntentTypes } from '@mesh-network/sdk';

const intent = new Intent({
  type: IntentTypes.TEXT_PROCESSING,
  parameters: {
    text: 'Hello, MESH network!'
  },
  constraints: {
    maxExecutionTime: 5000
  }
});

const result = await agent.publishIntent(intent);
console.log('Result:', result);`}</code>
                        </pre>
                      </div>
                    </div>
                    
                    <div className="rounded-md border">
                      <div className="border-b bg-muted px-4 py-2 flex items-center justify-between">
                        <div className="font-light">Setting Up P2P Communication</div>
                        <Button variant="ghost" size="sm">
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="p-4 bg-muted/50 overflow-x-auto">
                        <pre className="text-sm">
                          <code>{`import { createPeerNetwork } from '@mesh-network/sdk';

const p2p = createPeerNetwork({
  listenAddresses: ['/ip4/0.0.0.0/tcp/0'],
  bootstrapPeers: [
    '/dns4/bootstrap.mesh.network/tcp/1234/p2p/QmBootstrapPeerID'
  ]
});

await p2p.start();

// Send a message to another agent
await p2p.sendMessage(
  'QmTargetPeerID',
  { type: 'GREETING', payload: 'Hello!' }
);`}</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t p-4">
                  <Button variant="outline" className="w-full font-light">
                    Browse All Code Examples
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </>
  )
}
