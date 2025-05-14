"use client"

import Link from "next/link"
import { ChevronRight, FileText, LifeBuoy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"

export default function AgentLifecyclePage() {
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
              <Link href="/dashboard/documentation/agents">Agent Development</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>Agent Lifecycle Management</BreadcrumbPage>
          </BreadcrumbItem>
        </Breadcrumb>

        <div>
          <h1 className="text-3xl font-light">Agent Lifecycle Management</h1>
          <p className="text-muted-foreground font-light mt-2">Learn how to manage the complete lifecycle of MESH agents</p>
        </div>
        
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview" className="font-light">Overview</TabsTrigger>
            <TabsTrigger value="deployment" className="font-light">Deployment</TabsTrigger>
            <TabsTrigger value="monitoring" className="font-light">Monitoring</TabsTrigger>
            <TabsTrigger value="updates" className="font-light">Updates</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <section className="mt-6">
              <h2 className="text-2xl font-light mb-4">Agent Lifecycle Overview</h2>
              
              <p className="font-light mb-4">
                Managing the complete lifecycle of agents in the MESH network involves several distinct phases, from 
                initial development to retirement. Understanding these phases is critical for maintaining robust, 
                responsive, and effective agents.
              </p>
              
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-light">Development</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground font-light">Initial creation and testing of agent functionality in a local environment</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-light">Deployment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground font-light">Deploying agents to the MESH network and connecting to other peers</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-light">Monitoring</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground font-light">Tracking agent health, performance, and interaction patterns</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-light">Retirement</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground font-light">Gracefully shutting down and replacing agents as needed</p>
                  </CardContent>
                </Card>
              </div>
              
              <h3 className="text-xl font-light mt-8 mb-3">Agent States</h3>
              
              <p className="font-light mb-4">
                Throughout their lifecycle, agents transition through different operational states:
              </p>
              
              <ul className="list-disc pl-6 space-y-2 font-light">
                <li><span className="font-normal">Initialized:</span> Agent has been created but not yet connected to the network</li>
                <li><span className="font-normal">Connected:</span> Agent has established connection to the P2P network</li>
                <li><span className="font-normal">Registered:</span> Agent has registered its capabilities on the network</li>
                <li><span className="font-normal">Active:</span> Agent is fulfilling intents and interacting with other agents</li>
                <li><span className="font-normal">Paused:</span> Agent temporarily stops accepting new work but maintains network connection</li>
                <li><span className="font-normal">Disconnected:</span> Agent has gracefully disconnected from the network</li>
                <li><span className="font-normal">Terminated:</span> Agent has been permanently shut down</li>
              </ul>
            </section>
            
            <section className="mt-8">
              <h2 className="text-2xl font-light mb-4">Lifecycle Management Best Practices</h2>
              
              <div className="space-y-4">
                <div className="p-4 border rounded-md">
                  <h3 className="text-lg font-light mb-2">Robust Error Handling</h3>
                  <p className="font-light">
                    Implement comprehensive error handling to recover from failures. Agents should 
                    gracefully handle network disconnections, intent processing failures, and resource constraints.
                  </p>
                  
                  <div className="mt-3 bg-muted p-3 rounded-md">
                    <pre className="text-sm overflow-auto">
                      <code>{`
try {
  await agent.processIntent(intent);
} catch (error) {
  if (error.type === 'NETWORK_ERROR') {
    await agent.reconnect();
  } else if (error.type === 'RESOURCE_CONSTRAINT') {
    await agent.pauseProcessing();
    // Wait for resources to free up
    setTimeout(() => agent.resumeProcessing(), 5000);
  } else {
    // Log the error for monitoring
    agent.logError(error);
  }
}`}</code>
                    </pre>
                  </div>
                </div>
                
                <div className="p-4 border rounded-md">
                  <h3 className="text-lg font-light mb-2">State Persistence</h3>
                  <p className="font-light">
                    Implement state persistence so agents can resume operation after restarts or crashes.
                    Store critical state information either on-chain or in persistent storage.
                  </p>
                </div>
                
                <div className="p-4 border rounded-md">
                  <h3 className="text-lg font-light mb-2">Graceful Shutdown</h3>
                  <p className="font-light">
                    Implement proper shutdown procedures to ensure agents complete in-progress work and notify
                    connected peers before disconnecting from the network.
                  </p>
                </div>
                
                <div className="p-4 border rounded-md">
                  <h3 className="text-lg font-light mb-2">Version Management</h3>
                  <p className="font-light">
                    Maintain proper versioning of your agents and implement upgrade paths that minimize
                    disruption to the network and users.
                  </p>
                </div>
              </div>
            </section>
          </TabsContent>
          
          <TabsContent value="deployment" className="space-y-4">
            <section className="mt-6">
              <h2 className="text-2xl font-light mb-4">Agent Deployment</h2>
              
              <p className="font-light mb-4">
                Deploying agents to the MESH network requires careful consideration of infrastructure,
                networking, and initial configuration. This section covers best practices for reliable agent deployment.
              </p>
              
              <h3 className="text-xl font-light mt-6 mb-3">Deployment Options</h3>
              
              <div className="grid gap-4 md:grid-cols-2 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-light">Self-Hosted Deployment</CardTitle>
                    <CardDescription className="font-light">
                      Run agents on your own infrastructure with complete control
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-2 font-light">
                      <li>Run on bare metal, VMs, or container orchestration</li>
                      <li>Full control over runtime environment</li>
                      <li>Responsible for uptime and scaling</li>
                      <li>Recommended for agents handling sensitive data</li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-light">MESH Managed Deployment</CardTitle>
                    <CardDescription className="font-light">
                      Deploy to the MESH managed infrastructure with simplified operations
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-2 font-light">
                      <li>One-click deployment via dashboard</li>
                      <li>Automatic scaling and high availability</li>
                      <li>Built-in monitoring and logging</li>
                      <li>Simplified updates and rollbacks</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
              
              <h3 className="text-xl font-light mt-8 mb-3">Deployment Configuration</h3>
              
              <p className="font-light mb-4">
                Proper configuration during deployment is essential for agent functionality. The following
                parameters should be configured during deployment:
              </p>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2 font-light">Parameter</th>
                      <th className="text-left p-2 font-light">Description</th>
                      <th className="text-left p-2 font-light">Example</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-2 font-light">Agent Identity</td>
                      <td className="p-2 font-light">Cryptographic identity used for signing messages and transactions</td>
                      <td className="p-2 font-light"><code>{ "{pubKey: 'Ed25519...', privKey: '...'}" }</code></td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-light">Bootstrap Peers</td>
                      <td className="p-2 font-light">Initial peers to connect to when joining the network</td>
                      <td className="p-2 font-light"><code>['QmPeer1', 'QmPeer2']</code></td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-light">Capabilities</td>
                      <td className="p-2 font-light">Define what intents the agent can fulfill</td>
                      <td className="p-2 font-light"><code>['DATA_PROCESSING', 'TEXT_GENERATION']</code></td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-light">Resource Limits</td>
                      <td className="p-2 font-light">Define the maximum resources the agent can use</td>
                      <td className="p-2 font-light"><code>{ "{memory: '2GB', cpu: 2}" }</code></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </TabsContent>
          
          <TabsContent value="monitoring" className="space-y-4">
            <section className="mt-6">
              <h2 className="text-2xl font-light mb-4">Agent Monitoring and Maintenance</h2>
              
              <p className="font-light mb-4">
                Once deployed, agents require continuous monitoring to ensure optimal performance, detect issues,
                and maintain reliability. This section covers monitoring techniques and maintenance strategies.
              </p>
              
              <h3 className="text-xl font-light mt-6 mb-3">Key Metrics to Monitor</h3>
              
              <div className="grid gap-4 md:grid-cols-3 mt-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-light">Health Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-1 font-light">
                      <li>CPU/Memory utilization</li>
                      <li>Process uptime</li>
                      <li>Error rates</li>
                      <li>Response times</li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-light">Network Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-1 font-light">
                      <li>Connected peers count</li>
                      <li>Message latency</li>
                      <li>Bandwidth usage</li>
                      <li>Connection stability</li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-light">Business Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-1 font-light">
                      <li>Intents processed</li>
                      <li>Success rate</li>
                      <li>Average execution time</li>
                      <li>Resource consumption per intent</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
              
              <h3 className="text-xl font-light mt-8 mb-3">Monitoring Infrastructure</h3>
              
              <p className="font-light mb-4">
                MESH provides built-in monitoring tools that integrate with your agents:
              </p>
              
              <div className="p-4 border rounded-md bg-muted/30">
                <h4 className="text-md font-light mb-2">Monitoring Setup Example</h4>
                <pre className="text-sm overflow-auto">
                  <code>{`
import { createAgent, setupMonitoring } from '@mesh-network/sdk';

const agent = createAgent({
  name: 'processing-agent',
  // ... other configuration
});

// Enable monitoring with metrics publishing
setupMonitoring(agent, {
  metrics: {
    enabled: true,
    publishInterval: 60000, // milliseconds
    endpoint: 'https://metrics.mesh-network.io/agent-metrics'
  },
  logging: {
    level: 'info',
    destination: 'https://logs.mesh-network.io/agent-logs'
  },
  alerting: {
    errorThreshold: 5, // Number of errors before alert
    requestTimeout: 2000 // Alert if requests take longer than this
  }
});`}</code>
                </pre>
              </div>
            </section>
          </TabsContent>
          
          <TabsContent value="updates" className="space-y-4">
            <section className="mt-6">
              <h2 className="text-2xl font-light mb-4">Agent Updates and Versioning</h2>
              
              <p className="font-light mb-4">
                As your agent evolves, you'll need to release updates to fix bugs, add features, or improve performance.
                This section covers strategies for managing agent versions and deploying updates.
              </p>
              
              <h3 className="text-xl font-light mt-6 mb-3">Versioning Strategy</h3>
              
              <p className="font-light mb-4">
                Follow semantic versioning (SemVer) for your agents to clearly communicate the nature of changes:
              </p>
              
              <div className="grid gap-4 md:grid-cols-3 mt-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-light">Major Version (x.0.0)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground font-light">
                      Incompatible API changes that require updates to consumers
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-light">Minor Version (0.x.0)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground font-light">
                      Backward-compatible functionality additions
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-light">Patch Version (0.0.x)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground font-light">
                      Backward-compatible bug fixes and performance improvements
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <h3 className="text-xl font-light mt-8 mb-3">Update Strategies</h3>
              
              <div className="space-y-4 mt-4">
                <div className="p-4 border rounded-md">
                  <h4 className="text-lg font-light mb-2">Rolling Updates</h4>
                  <p className="font-light">
                    Gradually replace instances of your agent to minimize disruption.
                    New instances are deployed while old ones are gracefully terminated.
                  </p>
                </div>
                
                <div className="p-4 border rounded-md">
                  <h4 className="text-lg font-light mb-2">Blue-Green Deployment</h4>
                  <p className="font-light">
                    Run both old and new versions simultaneously, then switch traffic once
                    the new version is validated.
                  </p>
                </div>
                
                <div className="p-4 border rounded-md">
                  <h4 className="text-lg font-light mb-2">Canary Releases</h4>
                  <p className="font-light">
                    Deploy the update to a small subset of agent instances first to
                    validate its behavior before full rollout.
                  </p>
                </div>
              </div>
              
              <h3 className="text-xl font-light mt-8 mb-3">Update Considerations</h3>
              
              <ul className="list-disc pl-6 space-y-2 font-light">
                <li>
                  <span className="font-normal">State Migration:</span> Plan for how agent state will be preserved or migrated during updates
                </li>
                <li>
                  <span className="font-normal">Backward Compatibility:</span> Ensure your agent can interact with both older and newer versions of other agents
                </li>
                <li>
                  <span className="font-normal">Rollback Plan:</span> Always have a strategy to revert to the previous version if issues are detected
                </li>
                <li>
                  <span className="font-normal">Change Documentation:</span> Maintain clear documentation of changes for each version
                </li>
              </ul>
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
                <Link href="/dashboard/documentation/agents/create-agent" className="text-primary hover:underline font-light">
                  Creating Your First Agent
                </Link>
              </li>
              <li>
                <Link href="/dashboard/documentation/agents/agent-sdk" className="text-primary hover:underline font-light">
                  Agent SDK Reference
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
              <LifeBuoy className="h-5 w-5" />
              Need Help?
            </h2>
            <p className="font-light mb-4">
              If you're having trouble with agent lifecycle management, check out these resources:
            </p>
            <Button variant="outline" className="w-full font-light">
              <Link href="/dashboard/help">Contact Support</Link>
            </Button>
          </div>
        </div>
      </main>
    </>
  )
} 