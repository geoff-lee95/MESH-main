import { Loader2 } from "lucide-react"

export default function AgentDashboardLoading() {
  return (
    <div className="flex h-full items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <span className="ml-2 text-lg">Loading agent dashboard...</span>
    </div>
  )
}
