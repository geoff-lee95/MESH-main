"use client"

import type React from "react"

import { useState } from "react"
import { AlertCircle, Bell, BellOff, Check, Plus, Settings, X } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for alerts
const initialAlerts = [
  {
    id: "1",
    name: "High CPU Usage",
    description: "Alert when CPU usage exceeds 80% for more than 5 minutes",
    type: "resource",
    severity: "high",
    enabled: true,
    triggered: false,
  },
  {
    id: "2",
    name: "Memory Limit",
    description: "Alert when memory usage exceeds 90% of allocated limit",
    type: "resource",
    severity: "critical",
    enabled: true,
    triggered: true,
  },
  {
    id: "3",
    name: "Agent Offline",
    description: "Alert when an agent goes offline unexpectedly",
    type: "status",
    severity: "high",
    enabled: true,
    triggered: false,
  },
  {
    id: "4",
    name: "Intent Processing Delay",
    description: "Alert when intent processing takes longer than 30 seconds",
    type: "performance",
    severity: "medium",
    enabled: false,
    triggered: false,
  },
  {
    id: "5",
    name: "Error Rate",
    description: "Alert when error rate exceeds 5% in the last hour",
    type: "error",
    severity: "medium",
    enabled: true,
    triggered: true,
  },
]

export function AlertsPanel() {
  const [alerts, setAlerts] = useState(initialAlerts)
  const [newAlertOpen, setNewAlertOpen] = useState(false)
  const [globalAlertsEnabled, setGlobalAlertsEnabled] = useState(true)

  const triggeredAlerts = alerts.filter((alert) => alert.enabled && alert.triggered)

  const toggleAlertEnabled = (id: string) => {
    setAlerts(alerts.map((alert) => (alert.id === id ? { ...alert, enabled: !alert.enabled } : alert)))
  }

  const dismissAlert = (id: string) => {
    setAlerts(alerts.map((alert) => (alert.id === id ? { ...alert, triggered: false } : alert)))
  }

  const addNewAlert = (alert: Omit<(typeof alerts)[0], "id" | "triggered">) => {
    setAlerts([
      ...alerts,
      {
        ...alert,
        id: `new-${Date.now()}`,
        triggered: false,
      },
    ])
    setNewAlertOpen(false)
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Alerts</CardTitle>
          <CardDescription>Configure and monitor agent alerts</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Switch checked={globalAlertsEnabled} onCheckedChange={setGlobalAlertsEnabled} id="alerts-enabled" />
          <Label htmlFor="alerts-enabled" className="text-sm">
            {globalAlertsEnabled ? (
              <span className="flex items-center">
                <Bell className="h-4 w-4 mr-1" />
                Enabled
              </span>
            ) : (
              <span className="flex items-center">
                <BellOff className="h-4 w-4 mr-1" />
                Disabled
              </span>
            )}
          </Label>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <h3 className="text-sm font-medium mb-2">Active Alerts</h3>
          {triggeredAlerts.length > 0 ? (
            <div className="space-y-2">
              {triggeredAlerts.map((alert) => (
                <div key={alert.id} className="flex items-start gap-2 p-3 border rounded-lg bg-muted/50">
                  <AlertCircle
                    className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
                      alert.severity === "critical"
                        ? "text-red-500"
                        : alert.severity === "high"
                          ? "text-amber-500"
                          : "text-orange-500"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{alert.name}</div>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => dismissAlert(alert.id)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">{alert.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center p-4 border rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground">No active alerts</p>
            </div>
          )}
        </div>

        <h3 className="text-sm font-medium mb-2">Configured Alerts</h3>
        <ScrollArea className="h-[200px]">
          <div className="space-y-2">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-2 border rounded-lg">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{alert.name}</div>
                  <div className="flex items-center gap-1 mt-1">
                    <Badge variant="outline" className="capitalize text-xs">
                      {alert.type}
                    </Badge>
                    <Badge
                      variant={
                        alert.severity === "critical"
                          ? "destructive"
                          : alert.severity === "high"
                            ? "warning"
                            : "secondary"
                      }
                      className="capitalize text-xs"
                    >
                      {alert.severity}
                    </Badge>
                  </div>
                </div>
                <Switch
                  checked={alert.enabled}
                  onCheckedChange={() => toggleAlertEnabled(alert.id)}
                  disabled={!globalAlertsEnabled}
                />
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/settings">
            <Settings className="h-4 w-4 mr-2" />
            Alert Settings
          </Link>
        </Button>

        <Dialog open={newAlertOpen} onOpenChange={setNewAlertOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Alert
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Alert</DialogTitle>
              <DialogDescription>Configure a new alert for your agents</DialogDescription>
            </DialogHeader>
            <NewAlertForm onSubmit={addNewAlert} onCancel={() => setNewAlertOpen(false)} />
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  )
}

interface NewAlertFormProps {
  onSubmit: (alert: Omit<(typeof initialAlerts)[0], "id" | "triggered">) => void
  onCancel: () => void
}

function NewAlertForm({ onSubmit, onCancel }: NewAlertFormProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [type, setType] = useState("resource")
  const [severity, setSeverity] = useState("medium")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      name,
      description,
      type,
      severity,
      enabled: true,
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Alert Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="High CPU Usage"
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Alert when CPU usage exceeds 80% for more than 5 minutes"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="type">Alert Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger id="type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="resource">Resource</SelectItem>
                <SelectItem value="status">Status</SelectItem>
                <SelectItem value="performance">Performance</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="security">Security</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="severity">Severity</Label>
            <Select value={severity} onValueChange={setSeverity}>
              <SelectTrigger id="severity">
                <SelectValue placeholder="Select severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          <Check className="h-4 w-4 mr-2" />
          Create Alert
        </Button>
      </DialogFooter>
    </form>
  )
}

function Link({ href, children, ...props }: React.ComponentProps<"a"> & { href: string }) {
  return (
    <a href={href} {...props}>
      {children}
    </a>
  )
}
