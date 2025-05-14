import { Loader2 } from "lucide-react"

export default function CreateIntentLoading() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-lg font-medium">Loading form...</p>
        <p className="text-sm text-muted-foreground">Please wait while we prepare the intent form</p>
      </div>
    </div>
  )
}
