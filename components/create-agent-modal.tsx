"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { AlertCircle, Check, Code, Code2, FileCode, Loader2, Network, Shield, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
  type: z.enum(["Analysis", "Creative", "Security", "Communication", "Utility"]),
  capabilities: z.array(z.string()).min(1, {
    message: "Select at least one capability.",
  }),
  autonomyLevel: z.number().min(1).max(10),
  isPublic: z.boolean(),
  maxTokens: z.number().min(100).max(10000),
  code: z.string().optional(),
})

type AgentFormValues = z.infer<typeof agentFormSchema>

// Default values for the form
const defaultValues: Partial<AgentFormValues> = {
  name: "",
  description: "",
  type: "Utility",
  capabilities: ["data-processing"],
  autonomyLevel: 5,
  isPublic: false,
  maxTokens: 1000,
  code: "",
}

// Capability options
const capabilities = [
  { id: "data-processing", label: "Data Processing", icon: <FileCode className="h-4 w-4" /> },
  { id: "smart-contract", label: "Smart Contract Interaction", icon: <Code className="h-4 w-4" /> },
  { id: "api-integration", label: "API Integration", icon: <Network className="h-4 w-4" /> },
  { id: "ai-reasoning", label: "AI Reasoning", icon: <Sparkles className="h-4 w-4" /> },
  { id: "security-audit", label: "Security Audit", icon: <Shield className="h-4 w-4" /> },
]

interface CreateAgentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateAgentModal({ open, onOpenChange }: CreateAgentModalProps) {
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
      // Transform form data to match AgentData type
      const agentData = {
        ...data,
        agentType: data.type, // Map 'type' to 'agentType'
        resourceLimit: data.maxTokens // resourceLimit is a number, not an object
      }
      
      // Call the server action to create the agent
      const result = await createAgent(agentData)

      if (result.success) {
        setSubmitSuccess(true)
        // Reset form after successful submission
        form.reset(defaultValues)
        // Close modal after a delay
        setTimeout(() => {
          onOpenChange(false)
          setSubmitSuccess(false)
          // Refresh the page to show the new agent
          router.refresh()
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
    setSelectedCapabilities((prev) => {
      if (prev.includes(capabilityId)) {
        return prev.filter((id) => id !== capabilityId)
      } else {
        return [...prev, capabilityId]
      }
    })

    // Update form value
    form.setValue(
      "capabilities",
      selectedCapabilities.includes(capabilityId)
        ? selectedCapabilities.filter((id) => id !== capabilityId)
        : [...selectedCapabilities, capabilityId],
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Code2 className="h-5 w-5" />
            Create New Agent
          </DialogTitle>
          <DialogDescription>Configure your autonomous agent to perform tasks on the MESH network.</DialogDescription>
        </DialogHeader>

        {submitSuccess ? (
          <div className="py-6">
            <Alert className="bg-green-500/20 border-green-500">
              <Check className="h-4 w-4 text-green-500" />
              <AlertTitle>Success!</AlertTitle>
              <AlertDescription>
                Your agent has been created successfully and is now being deployed to the network.
              </AlertDescription>
            </Alert>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="capabilities">Capabilities</TabsTrigger>
                  <TabsTrigger value="advanced">Advanced</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
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
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe what your agent does..."
                            className="min-h-[100px]"
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
                    name="type"
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
                            <SelectItem value="Analysis">Analysis</SelectItem>
                            <SelectItem value="Creative">Creative</SelectItem>
                            <SelectItem value="Security">Security</SelectItem>
                            <SelectItem value="Communication">Communication</SelectItem>
                            <SelectItem value="Utility">Utility</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>The primary function category of your agent.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="capabilities" className="space-y-4">
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
                </TabsContent>

                <TabsContent value="advanced" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="isPublic"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border border-input p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Public Agent</FormLabel>
                          <FormDescription>Make this agent discoverable by other users on the network.</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="maxTokens"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Tokens: {field.value}</FormLabel>
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
                        <FormDescription className="flex justify-between">
                          <span>100</span>
                          <span>10,000</span>
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Custom Code (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="// Add custom code for your agent..."
                            className="min-h-[150px] font-mono text-sm"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>Add custom code to extend your agent's functionality.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
              </Tabs>

              {submitError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{submitError}</AlertDescription>
                </Alert>
              )}

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Agent"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  )
}
