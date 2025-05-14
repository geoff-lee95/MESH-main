"use client"

import { useEffect, useState } from "react"
import React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Loader2, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { getAgentById, updateAgent } from "@/app/actions/agent-actions"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MultiSelect } from "@/components/ui/multi-select"

// Define proper types for the params
type PageParams = {
  id: string;
}

// Available capabilities for agents to select from
const CAPABILITIES_OPTIONS = [
  { label: "Data Processing", value: "data_processing" },
  { label: "Machine Learning", value: "machine_learning" },
  { label: "Natural Language", value: "natural_language" },
  { label: "Computer Vision", value: "computer_vision" },
  { label: "API Integration", value: "api_integration" },
  { label: "Blockchain", value: "blockchain" },
  { label: "Monitoring", value: "monitoring" },
  { label: "Notifications", value: "notifications" },
  { label: "Scheduling", value: "scheduling" },
  { label: "Reporting", value: "reporting" },
];

export default function EditAgentPage({ params }: { params: PageParams | Promise<PageParams> }) {
  // Unwrap params with React.use() if it's a promise
  const unwrappedParams = params instanceof Promise ? React.use(params) : params;
  const { id } = unwrappedParams;
  
  const router = useRouter();
  const [agent, setAgent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isPublic: false,
    capabilities: [] as string[],
    resourceLimit: 0
  });

  useEffect(() => {
    async function loadAgent() {
      try {
        const result = await getAgentById(id)
        if (result.success) {
          setAgent(result.data)
          // Initialize form data with agent values
          setFormData({
            name: result.data.name,
            description: result.data.description || "",
            isPublic: result.data.is_public,
            capabilities: result.data.capabilities || [],
            resourceLimit: result.data.resource_limit
          });
        } else {
          setError(result.error || "Failed to load agent")
        }
      } catch (err) {
        setError("An unexpected error occurred")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadAgent()
  }, [id])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData({
      ...formData,
      isPublic: checked
    });
  };

  const handleCapabilitiesChange = (newCapabilities: string[]) => {
    setFormData({
      ...formData,
      capabilities: newCapabilities
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const result = await updateAgent(id, {
        name: formData.name,
        description: formData.description,
        isPublic: formData.isPublic,
        capabilities: formData.capabilities,
        resourceLimit: formData.resourceLimit
      });
      
      if (result.success) {
        router.push(`/dashboard/agents/${id}`);
      } else {
        setError(result.error || "Failed to update agent");
        setSaving(false);
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button asChild>
            <Link href={`/dashboard/agents/${id}`}>Back to Agent</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (!agent) {
    return (
      <div className="container mx-auto py-6">
        <Alert>
          <AlertTitle>Agent Not Found</AlertTitle>
          <AlertDescription>The requested agent could not be found.</AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button asChild>
            <Link href="/dashboard/agents">Back to Agents</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/dashboard/agents/${id}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Edit Agent</h1>
          <Badge variant={agent.is_public ? "default" : "outline"}>{agent.is_public ? "Public" : "Private"}</Badge>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Edit the basic details of your agent</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Agent Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="isPublic"
                checked={formData.isPublic}
                onCheckedChange={handleSwitchChange}
              />
              <Label htmlFor="isPublic">Public Agent</Label>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Capabilities</CardTitle>
            <CardDescription>Select the capabilities of your agent</CardDescription>
          </CardHeader>
          <CardContent>
            <MultiSelect
              options={CAPABILITIES_OPTIONS}
              selected={formData.capabilities}
              onChange={handleCapabilitiesChange}
              placeholder="Select capabilities..."
            />
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Resource Limits</CardTitle>
            <CardDescription>Set resource allocation for this agent</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="resourceLimit">Resource Limit (units)</Label>
              <Input
                id="resourceLimit"
                name="resourceLimit"
                type="number"
                min="1"
                max="100"
                value={formData.resourceLimit}
                onChange={handleInputChange}
              />
              <p className="text-sm text-muted-foreground">
                This determines how many compute resources the agent can use.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="button" variant="outline" className="mr-2" asChild>
            <Link href={`/dashboard/agents/${id}`}>Cancel</Link>
          </Button>
          <Button type="submit" disabled={saving} className="gap-2">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  )
} 