"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Link from "next/link"
import {
  AlertCircle,
  ArrowLeft,
  Code,
  Code2,
  FileCode,
  Globe,
  Loader2,
  Network,
  Save,
  Shield,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { createAgent } from "@/app/actions/agent-actions"

// Define the form schema with Zod
const agentFormSchema = z.object({
  name: z.string().min(3, {
    message: "Agent name must be at least 3 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  agentType: z.string().min(1, {
    message: "Please select an agent type.",
  }),
  capabilities: z.array(z.string()).min(1, {
    message: "Select at least one capability.",
  }),
  autonomyLevel: z.number().min(1).max(10),
  isPublic: z.boolean(),
  resourceLimit: z.number().min(100).max(10000),
  customCode: z.string().optional(),
  deploymentEnvironment: z.enum(["development", "staging", "production"]),
  autoRestart: z.boolean(),
  loggingLevel: z.enum(["error", "warn", "info", "debug", "trace"]),
})

type AgentFormValues = z.infer<typeof agentFormSchema>

// Default values for the form
const defaultValues: Partial<AgentFormValues> = {
  name: "",
  description: "",
  agentType: "Utility",
  capabilities: ["data-processing"],
  autonomyLevel: 5,
  isPublic: false,
  resourceLimit: 1000,
  customCode: `// Define your agent's behavior here
async function handleIntent(intent) {
  // Process the intent
  console.log("Processing intent:", intent);
  
  // Return the result
  return {
    status: "success",
    result: "Intent processed successfully"
  };
}

// Export the handler
export { handleIntent };`,
  deploymentEnvironment: "development",
  autoRestart: true,
  loggingLevel: "info",
}

// Agent type options
const agentTypes = [
  { id: "Analysis", label: "Analysis", icon: <FileCode className="h-4 w-4" /> },
  { id: "Creative", label: "Creative", icon: <Sparkles className="h-4 w-4" /> },
  { id: "Security", label: "Security", icon: <Shield className="h-4 w-4" /> },
  { id: "Communication", label: "Communication", icon: <Globe className="h-4 w-4" /> },
  { id: "Utility", label: "Utility", icon: <Code className="h-4 w-4" /> },
]

// Capability options
const capabilities = [
  { id: "data-processing", label: "Data Processing", icon: <FileCode className="h-4 w-4" /> },
  { id: "smart-contract", label: "Smart Contract Interaction", icon: <Code className="h-4 w-4" /> },
  { id: "api-integration", label: "API Integration", icon: <Network className="h-4 w-4" /> },
  { id: "ai-reasoning", label: "AI Reasoning", icon: <Sparkles className="h-4 w-4" /> },
  { id: "security-audit", label: "Security Audit", icon: <Shield className="h-4 w-4" /> },
]

export default function CreateAgentPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [selectedCapabilities, setSelectedCapabilities] = useState<string[]>(["data-processing"])

  const form = useForm<AgentFormValues>({
    resolver: zodResolver(agentFormSchema),
    defaultValues,
  })

  async function onSubmit(data: AgentFormValues) {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      // Call the server action to create the agent
      const result = await createAgent(data)

      if (result.success) {
        setSubmitSuccess(true)
        // Redirect to the agents page after a delay
        setTimeout(() => {
          router.push("/dashboard/agents")
        }, 2000)
      } else {
        setSubmitError(result.error || "Failed to create agent")
      }
    } catch (error) {
      setSubmitError("An unexpected error occurred")
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleCapability = (capabilityId: string) => {
    const updatedCapabilities = selectedCapabilities.includes(capabilityId)
      ? selectedCapabilities.filter((id) => id !== capabilityId)
      : [...selectedCapabilities, capabilityId]

    setSelectedCapabilities(updatedCapabilities)
    form.setValue("capabilities", updatedCapabilities)
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/agents">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Create New Agent</h1>
        </div>
      </div>

      {submitSuccess ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-green-500">Agent Created Successfully!</CardTitle>
            <CardDescription>Your agent is now being deployed to the MESH network.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-6">
              <div className="mb-4 rounded-full bg-green-500/20 p-3">
                <Check className="h-8 w-8 text-green-500" />
              </div>
              <p className="text-center">
                Your agent has been created and is now being deployed. You will be redirected to the agents page
                shortly.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button asChild>
              <Link href="/dashboard/agents">Go to Agents</Link>
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs defaultValue="basic" className="w-full">
              <Card>
                <CardHeader>
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="basic">Basic Info</TabsTrigger>
                    <TabsTrigger value="capabilities">Capabilities</TabsTrigger>
                    <TabsTrigger value="code">Code</TabsTrigger>
                    <TabsTrigger value="deployment">Deployment</TabsTrigger>
                  </TabsList>
                </CardHeader>
                <CardContent className="pt-6">
                  <TabsContent value="basic" className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Agent Name</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Data Analyzer" {...field} />
                            </FormControl>
                            <FormDescription>A unique name for your agent.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="agentType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Agent Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select agent type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {agentTypes.map((type) => (
                                  <SelectItem key={type.id} value={type.id}>
                                    <div className="flex items-center gap-2">
                                      {type.icon}
                                      <span>{type.label}</span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormDescription>The primary function category of your agent.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe what your agent does..."
                              className="min-h-[120px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>Explain the purpose and capabilities of your agent.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="isPublic"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Public Agent</FormLabel>
                            <FormDescription>
                              Make this agent discoverable by other users on the network.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </TabsContent>

                  <TabsContent value="capabilities" className="space-y-6">
                    <FormField
                      control={form.control}
                      name="capabilities"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Agent Capabilities</FormLabel>
                          <FormDescription className="mb-4">
                            Select the capabilities your agent will have.
                          </FormDescription>
                          <FormControl>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {capabilities.map((capability) => (
                                <div
                                  key={capability.id}
                                  className={`flex items-center justify-between p-3 rounded-md border cursor-pointer transition-all ${
                                    selectedCapabilities.includes(capability.id)
                                      ? "border-primary bg-primary/10"
                                      : "border-input"
                                  }`}
                                  onClick={() => toggleCapability(capability.id)}
                                >
                                  <div className="flex items-center gap-2">
                                    {capability.icon}
                                    <span>{capability.label}</span>
                                  </div>
                                  {selectedCapabilities.includes(capability.id) && (
                                    <Check className="h-4 w-4 text-primary" />
                                  )}
                                </div>
                              ))}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="autonomyLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Autonomy Level: {field.value}</FormLabel>
                          <FormControl>
                            <Slider
                              min={1}
                              max={10}
                              step={1}
                              defaultValue={[field.value]}
                              onValueChange={(values) => field.onChange(values[0])}
                              className="py-4"
                            />
                          </FormControl>
                          <FormDescription className="flex justify-between">
                            <span>Low Autonomy</span>
                            <span>High Autonomy</span>
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="resourceLimit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Resource Limit: {field.value}</FormLabel>
                          <FormControl>
                            <Slider
                              min={100}
                              max={10000}
                              step={100}
                              defaultValue={[field.value]}
                              onValueChange={(values) => field.onChange(values[0])}
                              className="py-4"
                            />
                          </FormControl>
                          <FormDescription>
                            Maximum computational resources allocated to this agent (in tokens).
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>

                  <TabsContent value="code" className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-medium">Agent Code</h3>
                        <p className="text-sm text-muted-foreground">
                          Write custom code to define your agent's behavior. This code will be executed when your agent
                          receives an intent.
                        </p>
                      </div>

                      <FormField
                        control={form.control}
                        name="customCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <div className="rounded-md border">
                                <div className="flex items-center justify-between border-b bg-muted px-3 py-2">
                                  <div className="flex items-center gap-2">
                                    <Code2 className="h-4 w-4" />
                                    <span className="text-sm font-medium">agent.js</span>
                                  </div>
                                </div>
                                <Textarea
                                  className="min-h-[300px] font-mono text-sm border-0 rounded-t-none focus-visible:ring-0"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormDescription>
                              Use JavaScript to define your agent's behavior. The code will run in a secure, sandboxed
                              environment.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="deployment" className="space-y-6">
                    <FormField
                      control={form.control}
                      name="deploymentEnvironment"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Deployment Environment</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select environment" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="development">Development</SelectItem>
                              <SelectItem value="staging">Staging</SelectItem>
                              <SelectItem value="production">Production</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>The environment where your agent will be deployed.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="autoRestart"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Auto Restart</FormLabel>
                            <FormDescription>
                              Automatically restart the agent if it crashes or becomes unresponsive.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="loggingLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Logging Level</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select logging level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="error">Error</SelectItem>
                              <SelectItem value="warn">Warning</SelectItem>
                              <SelectItem value="info">Info</SelectItem>
                              <SelectItem value="debug">Debug</SelectItem>
                              <SelectItem value="trace">Trace</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>The level of detail in agent logs.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                </CardContent>
              </Card>
            </Tabs>

            {submitError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{submitError}</AlertDescription>
              </Alert>
            )}

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" asChild>
                <Link href="/dashboard/agents">Cancel</Link>
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Agent...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Create Agent
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  )
}

function Check(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}
