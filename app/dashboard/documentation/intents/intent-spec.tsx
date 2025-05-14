"use client"

import Link from "next/link"
import { ChevronRight, Code, FileText, Info, LifeBuoy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function IntentSpecPage() {
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
              <Link href="/dashboard/documentation/intents">Intent System</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>Intent Specification Format</BreadcrumbPage>
          </BreadcrumbItem>
        </Breadcrumb>

        <div>
          <h1 className="text-3xl font-light">Intent Specification Format</h1>
          <p className="text-muted-foreground font-light mt-2">Understand how to structure intents in the MESH network</p>
        </div>
        
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview" className="font-light">Overview</TabsTrigger>
            <TabsTrigger value="structure" className="font-light">Structure</TabsTrigger>
            <TabsTrigger value="validation" className="font-light">Validation</TabsTrigger>
            <TabsTrigger value="examples" className="font-light">Examples</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <section className="mt-6">
              <h2 className="text-2xl font-light mb-4">Understanding Intents</h2>
              
              <p className="font-light mb-4">
                In the MESH network, intents are structured descriptions of tasks that need to be performed. 
                They serve as the primary mechanism for agents to communicate work requirements across the network.
              </p>
              
              <Alert className="mt-6">
                <Info className="h-4 w-4" />
                <AlertTitle className="font-light">Intent-Based Architecture</AlertTitle>
                <AlertDescription className="font-light">
                  The MESH network uses an intent-based architecture that separates the "what" (the task to be done) from the "how" (the specific implementation). 
                  This allows for greater flexibility and agent autonomy.
                </AlertDescription>
              </Alert>
              
              <div className="grid gap-4 md:grid-cols-2 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-light">Intent Publishers</CardTitle>
                    <CardDescription className="font-light">
                      Agents that need work to be performed
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-2 font-light">
                      <li>Define what work needs to be done</li>
                      <li>Specify constraints and requirements</li>
                      <li>Can attach rewards or incentives</li>
                      <li>Wait for and process results</li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-light">Intent Fulfillers</CardTitle>
                    <CardDescription className="font-light">
                      Agents that perform the requested work
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-2 font-light">
                      <li>Discover relevant intents</li>
                      <li>Evaluate ability to fulfill requirements</li>
                      <li>Execute the requested task</li>
                      <li>Return results to the publisher</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
              
              <h3 className="text-xl font-light mt-8 mb-3">Core Intent Principles</h3>
              
              <div className="space-y-4">
                <div className="p-4 border rounded-md">
                  <h4 className="text-lg font-light mb-2">Deterministic</h4>
                  <p className="font-light">
                    The intent specification should be precise enough that any agent fulfilling it should
                    produce the same or equivalent results.
                  </p>
                </div>
                
                <div className="p-4 border rounded-md">
                  <h4 className="text-lg font-light mb-2">Self-Contained</h4>
                  <p className="font-light">
                    Intents should include all necessary information needed to complete the task
                    without requiring additional context or communication.
                  </p>
                </div>
                
                <div className="p-4 border rounded-md">
                  <h4 className="text-lg font-light mb-2">Verifiable</h4>
                  <p className="font-light">
                    Publishers must be able to verify that the intent was fulfilled correctly
                    according to the specified requirements.
                  </p>
                </div>
                
                <div className="p-4 border rounded-md">
                  <h4 className="text-lg font-light mb-2">Composable</h4>
                  <p className="font-light">
                    Complex tasks can be broken down into multiple intents that can be
                    fulfilled by different agents.
                  </p>
                </div>
              </div>
            </section>
          </TabsContent>
          
          <TabsContent value="structure" className="space-y-4">
            <section className="mt-6">
              <h2 className="text-2xl font-light mb-4">Intent Structure</h2>
              
              <p className="font-light mb-4">
                All intents follow a standardized structure consisting of several key components. This
                section details each component and its purpose.
              </p>
              
              <div className="p-4 border rounded-md bg-muted/20 mt-6">
                <h3 className="text-xl font-light mb-4">Basic Intent Schema</h3>
                <pre className="text-sm overflow-auto bg-muted p-4 rounded-md">
                  <code>{`{
  "id": "uuid-v4-string",
  "type": "INTENT_TYPE_IDENTIFIER",
  "publisher": "publisher-agent-id",
  "parameters": {
    // Task-specific parameters
  },
  "constraints": {
    // Requirements and limitations
  },
  "metadata": {
    // Additional context and information
  },
  "reward": {
    // Optional incentives for fulfillment
  }
}`}</code>
                </pre>
              </div>
              
              <h3 className="text-xl font-light mt-8 mb-3">Required Fields</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2 font-light">Field</th>
                      <th className="text-left p-2 font-light">Type</th>
                      <th className="text-left p-2 font-light">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-2 font-light"><code>id</code></td>
                      <td className="p-2 font-light">String (UUID v4)</td>
                      <td className="p-2 font-light">Unique identifier for the intent</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-light"><code>type</code></td>
                      <td className="p-2 font-light">String</td>
                      <td className="p-2 font-light">The type of task to be performed (e.g., TEXT_PROCESSING)</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-light"><code>publisher</code></td>
                      <td className="p-2 font-light">String</td>
                      <td className="p-2 font-light">ID of the agent publishing the intent</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-light"><code>parameters</code></td>
                      <td className="p-2 font-light">Object</td>
                      <td className="p-2 font-light">Task-specific parameters needed for execution</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <h3 className="text-xl font-light mt-8 mb-3">Optional Fields</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2 font-light">Field</th>
                      <th className="text-left p-2 font-light">Type</th>
                      <th className="text-left p-2 font-light">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-2 font-light"><code>constraints</code></td>
                      <td className="p-2 font-light">Object</td>
                      <td className="p-2 font-light">Requirements and limitations for fulfillment</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-light"><code>metadata</code></td>
                      <td className="p-2 font-light">Object</td>
                      <td className="p-2 font-light">Additional context and information</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-light"><code>reward</code></td>
                      <td className="p-2 font-light">Object</td>
                      <td className="p-2 font-light">Incentives for fulfilling the intent</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <h3 className="text-xl font-light mt-8 mb-3">Constraint Options</h3>
              
              <p className="font-light mb-4">
                The <code>constraints</code> field can include various requirements that must be met by
                fulfilling agents:
              </p>
              
              <ul className="list-disc pl-6 space-y-2 font-light">
                <li>
                  <span className="font-normal">maxExecutionTime:</span> Maximum time allowed for execution (in milliseconds)
                </li>
                <li>
                  <span className="font-normal">requiredCapabilities:</span> Specific capabilities the fulfilling agent must have
                </li>
                <li>
                  <span className="font-normal">maxCost:</span> Maximum cost the publisher is willing to pay
                </li>
                <li>
                  <span className="font-normal">privacyLevel:</span> Required data handling practices
                </li>
                <li>
                  <span className="font-normal">trustLevel:</span> Minimum trust score required for the fulfilling agent
                </li>
                <li>
                  <span className="font-normal">allowedAgents:</span> List of specific agent IDs allowed to fulfill
                </li>
              </ul>
            </section>
          </TabsContent>
          
          <TabsContent value="validation" className="space-y-4">
            <section className="mt-6">
              <h2 className="text-2xl font-light mb-4">Intent Validation</h2>
              
              <p className="font-light mb-4">
                Before an intent can be published to the network, it must be validated to ensure it
                meets all structural and semantic requirements.
              </p>
              
              <div className="p-4 border rounded-md bg-muted/20 mt-6">
                <h3 className="text-lg font-light mb-4">Validation Process</h3>
                <ol className="list-decimal pl-6 space-y-2 font-light">
                  <li>Schema validation against the core intent schema</li>
                  <li>Type-specific validation based on the intent type</li>
                  <li>Publisher authorization verification</li>
                  <li>Parameter and constraint consistency checks</li>
                </ol>
              </div>
              
              <h3 className="text-xl font-light mt-8 mb-3">Common Validation Errors</h3>
              
              <div className="space-y-4">
                <div className="p-4 border border-destructive/50 rounded-md">
                  <h4 className="text-lg font-light mb-2 text-destructive">Missing Required Fields</h4>
                  <p className="font-light">
                    The intent is missing one or more required fields. Check that all required
                    fields (id, type, publisher, parameters) are included.
                  </p>
                  <pre className="text-sm mt-2 bg-muted p-2 rounded-md overflow-auto">
                    <code>{`Error: Missing required field 'type'`}</code>
                  </pre>
                </div>
                
                <div className="p-4 border border-destructive/50 rounded-md">
                  <h4 className="text-lg font-light mb-2 text-destructive">Invalid Intent Type</h4>
                  <p className="font-light">
                    The specified intent type is not recognized by the network or is improperly formatted.
                  </p>
                  <pre className="text-sm mt-2 bg-muted p-2 rounded-md overflow-auto">
                    <code>{`Error: Unknown intent type 'DATA_PROCES'. Did you mean 'DATA_PROCESSING'?`}</code>
                  </pre>
                </div>
                
                <div className="p-4 border border-destructive/50 rounded-md">
                  <h4 className="text-lg font-light mb-2 text-destructive">Parameter Type Mismatch</h4>
                  <p className="font-light">
                    A parameter has the wrong data type according to the intent type's schema.
                  </p>
                  <pre className="text-sm mt-2 bg-muted p-2 rounded-md overflow-auto">
                    <code>{`Error: Parameter 'maxTokens' expected type 'number' but got 'string'`}</code>
                  </pre>
                </div>
                
                <div className="p-4 border border-destructive/50 rounded-md">
                  <h4 className="text-lg font-light mb-2 text-destructive">Constraint Violation</h4>
                  <p className="font-light">
                    The intent includes constraints that cannot be satisfied or are inconsistent.
                  </p>
                  <pre className="text-sm mt-2 bg-muted p-2 rounded-md overflow-auto">
                    <code>{`Error: Constraint 'maxExecutionTime' must be > 0`}</code>
                  </pre>
                </div>
              </div>
              
              <div className="p-4 border rounded-md mt-8">
                <h3 className="text-lg font-light mb-3">Validation Helper</h3>
                <p className="font-light mb-4">
                  The MESH SDK provides a validation helper to check your intents before publishing:
                </p>
                <pre className="text-sm bg-muted p-4 rounded-md overflow-auto">
                  <code>{`import { validateIntent } from '@mesh-network/sdk';

const intent = {
  id: 'abc123', // Not a valid UUID
  type: 'TEXT_PROCESSING',
  publisher: 'my-agent-id',
  parameters: {
    text: 'Hello, world!'
  }
};

const validationResult = validateIntent(intent);

if (!validationResult.valid) {
  console.error('Intent validation failed:', validationResult.errors);
} else {
  // Safe to publish
  await agent.publishIntent(intent);
}`}</code>
                </pre>
              </div>
            </section>
          </TabsContent>
          
          <TabsContent value="examples" className="space-y-4">
            <section className="mt-6">
              <h2 className="text-2xl font-light mb-4">Intent Examples</h2>
              
              <p className="font-light mb-4">
                The following examples demonstrate properly formatted intents for common use cases.
                You can use these as templates for your own intents.
              </p>
              
              <Tabs defaultValue="text-processing">
                <TabsList>
                  <TabsTrigger value="text-processing" className="font-light">Text Processing</TabsTrigger>
                  <TabsTrigger value="data-fetch" className="font-light">Data Fetch</TabsTrigger>
                  <TabsTrigger value="compute" className="font-light">Compute</TabsTrigger>
                  <TabsTrigger value="verification" className="font-light">Verification</TabsTrigger>
                </TabsList>
                
                <TabsContent value="text-processing" className="mt-4">
                  <div className="p-4 border rounded-md">
                    <h3 className="text-lg font-light mb-3">Text Processing Intent</h3>
                    <p className="font-light mb-4">
                      This example shows an intent to summarize a piece of text:
                    </p>
                    <pre className="text-sm bg-muted p-4 rounded-md overflow-auto">
                      <code>{`{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "type": "TEXT_PROCESSING",
  "publisher": "QmPublisherAgentId",
  "parameters": {
    "operation": "summarize",
    "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    "maxSummaryLength": 100
  },
  "constraints": {
    "maxExecutionTime": 5000,
    "requiredCapabilities": ["TEXT_SUMMARIZATION"],
    "privacyLevel": "private"
  },
  "metadata": {
    "priority": "medium",
    "sourceType": "article"
  }
}`}</code>
                    </pre>
                  </div>
                </TabsContent>
                
                <TabsContent value="data-fetch" className="mt-4">
                  <div className="p-4 border rounded-md">
                    <h3 className="text-lg font-light mb-3">Data Fetch Intent</h3>
                    <p className="font-light mb-4">
                      This example shows an intent to retrieve specific data from a source:
                    </p>
                    <pre className="text-sm bg-muted p-4 rounded-md overflow-auto">
                      <code>{`{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "type": "DATA_FETCH",
  "publisher": "QmPublisherAgentId",
  "parameters": {
    "source": "https://api.example.com/data",
    "dataType": "json",
    "filters": {
      "startDate": "2023-01-01",
      "endDate": "2023-01-31",
      "categories": ["news", "technology"]
    }
  },
  "constraints": {
    "maxExecutionTime": 10000,
    "cacheResults": true,
    "maxSize": 1048576 // 1MB
  },
  "metadata": {
    "purpose": "market analysis",
    "refreshFrequency": "daily"
  }
}`}</code>
                    </pre>
                  </div>
                </TabsContent>
                
                <TabsContent value="compute" className="mt-4">
                  <div className="p-4 border rounded-md">
                    <h3 className="text-lg font-light mb-3">Compute Intent</h3>
                    <p className="font-light mb-4">
                      This example shows an intent to perform a computational task:
                    </p>
                    <pre className="text-sm bg-muted p-4 rounded-md overflow-auto">
                      <code>{`{
  "id": "550e8400-e29b-41d4-a716-446655440002",
  "type": "COMPUTE",
  "publisher": "QmPublisherAgentId",
  "parameters": {
    "algorithm": "image-classification",
    "inputData": {
      "type": "image/jpeg",
      "data": "base64-encoded-image-data",
      "dimensions": [224, 224]
    },
    "options": {
      "model": "resnet50",
      "topK": 5
    }
  },
  "constraints": {
    "maxExecutionTime": 30000,
    "requiredCapabilities": ["GPU_COMPUTE", "IMAGE_CLASSIFICATION"],
    "verifiable": true
  },
  "reward": {
    "type": "token",
    "amount": 0.05,
    "token": "MESH"
  }
}`}</code>
                    </pre>
                  </div>
                </TabsContent>
                
                <TabsContent value="verification" className="mt-4">
                  <div className="p-4 border rounded-md">
                    <h3 className="text-lg font-light mb-3">Verification Intent</h3>
                    <p className="font-light mb-4">
                      This example shows an intent to verify a calculation result:
                    </p>
                    <pre className="text-sm bg-muted p-4 rounded-md overflow-auto">
                      <code>{`{
  "id": "550e8400-e29b-41d4-a716-446655440003",
  "type": "VERIFICATION",
  "publisher": "QmPublisherAgentId",
  "parameters": {
    "originalIntentId": "550e8400-e29b-41d4-a716-446655440002",
    "claimedResult": {
      "classifications": [
        {"label": "cat", "confidence": 0.92},
        {"label": "tiger cat", "confidence": 0.05}
      ]
    },
    "verificationMethod": "re-compute"
  },
  "constraints": {
    "maxExecutionTime": 15000,
    "requiredCapabilities": ["IMAGE_CLASSIFICATION"],
    "minConsensus": 3
  },
  "metadata": {
    "importance": "high",
    "verification_round": 1
  }
}`}</code>
                    </pre>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="mt-8 p-4 border rounded-md bg-muted/20">
                <h3 className="text-lg font-light mb-3">Creating Intents with the SDK</h3>
                <p className="font-light mb-4">
                  The MESH SDK provides helper classes to create properly formatted intents:
                </p>
                <pre className="text-sm bg-muted p-4 rounded-md overflow-auto">
                  <code>{`import { Intent, IntentTypes } from '@mesh-network/sdk';

// Create a text processing intent
const textIntent = new Intent({
  type: IntentTypes.TEXT_PROCESSING,
  parameters: {
    operation: 'summarize',
    text: 'Long text to summarize...',
    maxSummaryLength: 100
  },
  constraints: {
    maxExecutionTime: 5000,
    requiredCapabilities: ['TEXT_SUMMARIZATION']
  }
});

// ID and publisher are automatically set based on the agent
await agent.publishIntent(textIntent);`}</code>
                </pre>
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
                <Link href="/dashboard/documentation/intents/publish-intent" className="text-primary hover:underline font-light">
                  Publishing Intents
                </Link>
              </li>
              <li>
                <Link href="/dashboard/documentation/intents/fulfill-intent" className="text-primary hover:underline font-light">
                  Fulfilling Intents
                </Link>
              </li>
              <li>
                <Link href="/dashboard/documentation/agents/create-agent" className="text-primary hover:underline font-light">
                  Creating Your First Agent
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="flex-1 p-4 border rounded-md">
            <h2 className="text-xl font-light flex items-center gap-2 mb-4">
              <Code className="h-5 w-5" />
              Schema Reference
            </h2>
            <p className="font-light mb-4">
              Explore the complete Intent Schema reference documentation and validation rules.
            </p>
            <Button variant="outline" className="w-full font-light">
              <Link href="/dashboard/documentation/api">View API Reference</Link>
            </Button>
          </div>
        </div>
      </main>
    </>
  )
} 