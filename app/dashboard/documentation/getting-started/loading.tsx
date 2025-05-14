export default function Loading() {
  return (
    <div className="container mx-auto p-6">
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-1/3 bg-muted rounded mb-2"></div>
        <div className="h-4 w-2/3 bg-muted rounded"></div>
        
        <div className="space-y-4 mt-8">
          <div className="h-64 bg-muted rounded-md"></div>
          <div className="h-64 bg-muted rounded-md"></div>
        </div>
        
        <div className="flex justify-between mt-8">
          <div className="h-10 w-32 bg-muted rounded"></div>
          <div className="h-10 w-32 bg-muted rounded"></div>
        </div>
      </div>
    </div>
  )
} 