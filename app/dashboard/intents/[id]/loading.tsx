import { Loader2 } from "lucide-react"

export default function IntentDetailLoading() {
  return (
    <div className="flex h-full items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  )
}
