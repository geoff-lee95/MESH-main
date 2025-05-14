"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { createAgent, updateAgent } from "@/app/actions/agent-actions"
import { toast } from "@/components/ui/use-toast"
import { MultiSelect } from "@/components/ui/multi-select"

// Define the form schema
const agentFormSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  agent_type: z.string().min(1, { message: "Agent type is required" }),
  capabilities: z.array(z.string()).min(1, { message: "At least one capability is required" }),
  is_public: z.boolean().default(true),
  resource_limit: z.number().min(1, { message: "Resource limit must be at least 1" }),
  custom_code: z.string().optional(),
  wallet_address: z
    .string()
    .optional()
    .refine((val) => !val || /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(val), "Invalid Solana wallet address format"),
})

type AgentFormValues = z.infer<typeof agentFormSchema>

// Available agent types
const agentTypes = [
  { value: "data-processor", label: "Data Processor" },
  { value: "ai-assistant", label: "AI Assistant" },
  { value: "automation", label: "Automation" },
  { value: "integration", label: "Integration" },
  { value: "custom", label: "Custom" },
]

// Available capabilities
const availableCapabilities = [
  { value: "data-processing", label: "Data Processing" },
  { value: "api-integration", label: "API Integration" },
  { value: "ai-reasoning", label: "AI Reasoning" },
  { value: "automation", label: "Automation" },
  { value: "web-scraping", label: "Web Scraping" },
  { value: "natural-language", label: "Natural Language" },
  { value: "image-processing", label: "Image Processing" },
  { value: "blockchain", label: "Blockchain" },
]

interface AgentFormProps {
  agent?: any // Optional agent for editing
}

export function AgentForm({ agent }: AgentFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Default values for the form
  const defaultValues: Partial<AgentFormValues> = {
    name: agent?.name || "",
    description: agent?.description || "",
    agent_type: agent?.agent_type || "",
    capabilities: agent?.capabilities || [],
    is_public: agent?.is_public ?? true,
    resource_limit: agent?.resource_limit || 100,
    custom_code: agent?.custom_code || "",
    wallet_address: agent?.wallet_address || "",
  }

  const form = useForm<AgentFormValues>({
    resolver: zodResolver(agentFormSchema),
    defaultValues,
  })

  async function onSubmit(values: AgentFormValues) {
    setIsSubmitting(true)

    try {
      if (agent) {
        // Update existing agent
        const result = await updateAgent(agent.id, values)
        if (result.success) {
          toast({
            title: "Agent updated",
            description: "Your agent has been updated successfully.",
          })
          router.push(`/dashboard/agents/${agent.id}`)
        } else {
          throw new Error(result.error || "Failed to update agent")
        }
      } else {
        // Create new agent
        const result = await createAgent(values)
        if (result.success) {
          toast({
            title: "Agent created",
            description: "Your agent has been created successfully.",
          })
          router.push(`/dashboard/agents/${result.data.id}`)
        } else {
          throw new Error(result.error || "Failed to create agent")
        }
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "An error occurred. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter agent name" {...field} />
              </FormControl>
              <FormDescription>A descriptive name for your agent.</FormDescription>
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
                <Textarea placeholder="Describe what your agent does" {...field} />
              </FormControl>
              <FormDescription>Provide a detailed description of your agent's capabilities.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="agent_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Agent Type</FormLabel>
                <FormControl>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    {...field}
                  >
                    <option value="" disabled>
                      Select agent type
                    </option>
                    {agentTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormDescription>Select the type of agent you're creating.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="resource_limit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Resource Limit</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    {...field}
                    onChange={(e) => field.onChange(Number.parseInt(e.target.value))}
                  />
                </FormControl>
                <FormDescription>Maximum resources this agent can consume.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="capabilities"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Capabilities</FormLabel>
              <FormControl>
                <MultiSelect
                  options={availableCapabilities}
                  selected={field.value}
                  onChange={field.onChange}
                  placeholder="Select capabilities"
                />
              </FormControl>
              <FormDescription>Select the capabilities your agent provides.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="wallet_address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Solana Wallet Address</FormLabel>
              <FormControl>
                <Input placeholder="Enter your Solana wallet address" {...field} />
              </FormControl>
              <FormDescription>
                The Solana wallet address where you'll receive payments for completed intents.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="is_public"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Public Agent</FormLabel>
                <FormDescription>
                  Make this agent publicly available for matching with intents from other users.
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
          name="custom_code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Custom Code (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter custom code for your agent"
                  className="font-mono h-32"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormDescription>Advanced: Add custom code to extend your agent's functionality.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/agents")}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : agent ? "Update Agent" : "Create Agent"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
