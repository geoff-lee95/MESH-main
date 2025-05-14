"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Link from "next/link"
import { AlertCircle, ArrowLeft, Calendar, Coins, Loader2, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { createIntent } from "@/app/actions/intent-actions"
import { toast } from "@/hooks/use-toast"

// Define the form schema with Zod
const intentFormSchema = z.object({
  title: z.string().min(3, {
    message: "Intent title must be at least 3 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  category: z.string().min(1, {
    message: "Please select a category.",
  }),
  reward: z.coerce.number().min(0.1, {
    message: "Reward must be at least 0.1 SOL.",
  }),
  deadline: z.date().min(new Date(), {
    message: "Deadline must be in the future.",
  }),
  complexity: z.number().min(1).max(10),
  isPrivate: z.boolean().default(false),
  successCriteria: z.string().min(10, {
    message: "Success criteria must be at least 10 characters.",
  }),
  tags: z.array(z.string()).optional(),
  maxBudget: z.coerce.number().min(0.1, {
    message: "Maximum budget must be at least 0.1 SOL.",
  }),
  allowMultipleAgents: z.boolean().default(false),
  requiredCapabilities: z.array(z.string()).min(1, {
    message: "Select at least one required capability.",
  }),
})

type IntentFormValues = z.infer<typeof intentFormSchema>

// Default values for the form
const defaultValues: Partial<IntentFormValues> = {
  title: "",
  description: "",
  category: "data-analysis",
  reward: 1,
  deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
  complexity: 5,
  isPrivate: false,
  successCriteria: "",
  tags: [],
  maxBudget: 5,
  allowMultipleAgents: false,
  requiredCapabilities: ["data-processing"],
}

// Category options
const categories = [
  { id: "data-analysis", label: "Data Analysis" },
  { id: "content-creation", label: "Content Creation" },
  { id: "research", label: "Research" },
  { id: "automation", label: "Automation" },
  { id: "monitoring", label: "Monitoring" },
  { id: "other", label: "Other" },
]

// Capability options
const capabilities = [
  { id: "data-processing", label: "Data Processing" },
  { id: "smart-contract", label: "Smart Contract Interaction" },
  { id: "api-integration", label: "API Integration" },
  { id: "ai-reasoning", label: "AI Reasoning" },
  { id: "security-audit", label: "Security Audit" },
]

// Map field names to tab values
const fieldToTabMapping = {
  title: "basic",
  description: "basic",
  category: "basic",
  reward: "basic",
  deadline: "basic",
  complexity: "basic",
  isPrivate: "basic",
  successCriteria: "requirements",
  requiredCapabilities: "requirements",
  maxBudget: "advanced",
  allowMultipleAgents: "advanced",
}

export default function CreateIntentPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [selectedCapabilities, setSelectedCapabilities] = useState<string[]>(["data-processing"])
  const [tagInput, setTagInput] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("basic")
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  // Initialize form
  const form = useForm<IntentFormValues>({
    resolver: zodResolver(intentFormSchema),
    defaultValues,
    mode: "onChange",
  })

  // Handle form submission
  async function onSubmit(data: IntentFormValues) {
    console.log("Form submitted with data:", data)
    await submitForm(data)
  }

  // Direct form submission handler
  const handleDirectSubmit = async () => {
    console.log("Direct form submission triggered")

    // Clear previous validation errors
    setValidationErrors([])

    // Manually trigger form validation
    const isValid = await form.trigger()

    if (!isValid) {
      console.log("Form validation failed", form.formState.errors)

      // Collect all validation errors
      const errors: string[] = []
      const errorFields: string[] = []

      Object.keys(form.formState.errors).forEach((field) => {
        const message = form.formState.errors[field]?.message
        if (message && typeof message === "string") {
          errors.push(message)
          errorFields.push(field)
        }
      })

      setValidationErrors(errors)

      // Switch to the tab with the first error
      if (errorFields.length > 0) {
        const firstErrorField = errorFields[0]
        const tabToSwitch = fieldToTabMapping[firstErrorField as keyof typeof fieldToTabMapping] || "basic"
        setActiveTab(tabToSwitch)

        // Show toast with error message
        toast({
          title: "Validation Error",
          description: `Please fix the following: ${errors.join(", ")}`,
          variant: "destructive",
        })
      }

      return
    }

    // If validation passes, submit the form
    const formValues = form.getValues()
    await submitForm(formValues)
  }

  // Common submission logic
  async function submitForm(data: IntentFormValues) {
    console.log("Submitting form with data:", data)
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      // Ensure requiredCapabilities is set correctly
      if (!data.requiredCapabilities || data.requiredCapabilities.length === 0) {
        data.requiredCapabilities = selectedCapabilities
      }

      // Call the server action to create the intent
      const result = await createIntent({
        ...data,
        tags: tags || [],
      })

      console.log("Create intent result:", result)

      if (result.success) {
        setSubmitSuccess(true)
        toast({
          title: "Success!",
          description: "Your intent has been published successfully.",
        })
        // Redirect to the intents page after a delay
        setTimeout(() => {
          router.push("/dashboard/intents")
        }, 2000)
      } else {
        setSubmitError(result.error || "Failed to create intent")
        toast({
          title: "Error",
          description: result.error || "Failed to create intent. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error creating intent:", error)
      setSubmitError("An unexpected error occurred. Please try again.")
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleCapability = (capabilityId: string) => {
    const updatedCapabilities = selectedCapabilities.includes(capabilityId)
      ? selectedCapabilities.filter((id) => id !== capabilityId)
      : [...selectedCapabilities, capabilityId]

    setSelectedCapabilities(updatedCapabilities)
    form.setValue("requiredCapabilities", updatedCapabilities)
  }

  const addTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      const newTags = [...tags, tagInput]
      setTags(newTags)
      form.setValue("tags", newTags)
      setTagInput("")
    }
  }

  const removeTag = (tag: string) => {
    const newTags = tags.filter((t) => t !== tag)
    setTags(newTags)
    form.setValue("tags", newTags)
  }

  // Pre-fill the form with sample data for testing (remove in production)
  const fillWithSampleData = () => {
    form.setValue("title", "Market Data Analysis")
    form.setValue(
      "description",
      "Need an agent to analyze cryptocurrency market data and provide insights on trading opportunities.",
    )
    form.setValue(
      "successCriteria",
      "The agent should provide daily reports with at least 3 actionable insights based on market trends.",
    )
    form.setValue("reward", 2.5)
    form.setValue("maxBudget", 10)
    setTags(["crypto", "analysis", "trading"])
    form.setValue("tags", ["crypto", "analysis", "trading"])
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/intents">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Publish New Intent</h1>
        </div>
        <Button variant="outline" size="sm" onClick={fillWithSampleData} type="button">
          Fill with Sample Data
        </Button>
      </div>

      {submitSuccess ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-green-500">Intent Published Successfully!</CardTitle>
            <CardDescription>Your intent has been published to the MESH network.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-6">
              <div className="mb-4 rounded-full bg-green-500/20 p-3">
                <Check className="h-8 w-8 text-green-500" />
              </div>
              <p className="text-center">
                Your intent has been published and is now available for agents to fulfill. You will be redirected to the
                intents page shortly.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button asChild>
              <Link href="/dashboard/intents">Go to Intents</Link>
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} id="intent-form" className="space-y-6">
            {validationErrors.length > 0 && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Validation Errors</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc pl-4">
                    {validationErrors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <Card>
                <CardHeader>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="basic">Basic Info</TabsTrigger>
                    <TabsTrigger value="requirements">Requirements</TabsTrigger>
                    <TabsTrigger value="advanced">Advanced</TabsTrigger>
                  </TabsList>
                </CardHeader>
                <CardContent className="pt-6">
                  <TabsContent value="basic" className="space-y-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Intent Title</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Market Data Analysis" {...field} />
                          </FormControl>
                          <FormDescription>A clear, concise title for your intent.</FormDescription>
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
                              placeholder="Describe what you need in detail..."
                              className="min-h-[120px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>Provide a detailed description of what you need to be done.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid gap-6 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {categories.map((category) => (
                                  <SelectItem key={category.id} value={category.id}>
                                    {category.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormDescription>The category that best describes your intent.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="complexity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Complexity Level: {field.value}</FormLabel>
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
                              <span>Simple</span>
                              <span>Complex</span>
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="reward"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Reward (SOL)</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Coins className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input type="number" step="0.1" className="pl-8" {...field} />
                              </div>
                            </FormControl>
                            <FormDescription>The amount to reward for completing this intent.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="deadline"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Deadline</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={`w-full pl-3 text-left font-normal ${
                                      !field.value && "text-muted-foreground"
                                    }`}
                                  >
                                    <Calendar className="mr-2 h-4 w-4" />
                                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <CalendarComponent
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) => date < new Date()}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormDescription>The deadline for completing this intent.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="isPrivate"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Private Intent</FormLabel>
                            <FormDescription>
                              Make this intent visible only to specific agents or users.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </TabsContent>

                  <TabsContent value="requirements" className="space-y-6">
                    <FormField
                      control={form.control}
                      name="successCriteria"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center">
                            Success Criteria
                            <span className="ml-1 text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Define what constitutes successful completion..."
                              className={`min-h-[120px] ${
                                form.formState.errors.successCriteria ? "border-red-500" : ""
                              }`}
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Clearly define the criteria that must be met for this intent to be considered fulfilled.
                          </FormDescription>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="requiredCapabilities"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Required Capabilities</FormLabel>
                          <FormDescription className="mb-4">
                            Select the capabilities an agent must have to fulfill this intent.
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

                    <div>
                      <FormLabel>Tags</FormLabel>
                      <div className="flex gap-2 mt-2">
                        <Input
                          placeholder="Add a tag"
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault()
                              addTag()
                            }
                          }}
                        />
                        <Button type="button" onClick={addTag}>
                          Add
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="px-2 py-1">
                            {tag}
                            <button
                              type="button"
                              className="ml-2 text-muted-foreground hover:text-foreground"
                              onClick={() => removeTag(tag)}
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <FormDescription className="mt-2">Add tags to help agents find your intent.</FormDescription>
                    </div>
                  </TabsContent>

                  <TabsContent value="advanced" className="space-y-6">
                    <FormField
                      control={form.control}
                      name="maxBudget"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Maximum Budget (SOL)</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Coins className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input type="number" step="0.1" className="pl-8" {...field} />
                            </div>
                          </FormControl>
                          <FormDescription>The maximum amount you're willing to spend on this intent.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="allowMultipleAgents"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Allow Multiple Agents</FormLabel>
                            <FormDescription>
                              Allow multiple agents to collaborate on fulfilling this intent.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <div className="rounded-lg border p-4">
                      <h3 className="text-base font-medium mb-2">Intent Preview</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Title</span>
                          <span className="text-sm font-medium">{form.watch("title") || "Untitled Intent"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Reward</span>
                          <span className="text-sm font-medium">{form.watch("reward") || 0} SOL</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Deadline</span>
                          <span className="text-sm font-medium">
                            {form.watch("deadline") ? format(form.watch("deadline"), "PPP") : "No deadline"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Visibility</span>
                          <span className="text-sm font-medium">{form.watch("isPrivate") ? "Private" : "Public"}</span>
                        </div>
                      </div>
                    </div>
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
                <Link href="/dashboard/intents">Cancel</Link>
              </Button>

              <Button type="button" disabled={isSubmitting} onClick={handleDirectSubmit}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Publishing Intent...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Publish Intent
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

function Check(props) {
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
