import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function LoadingProfilePage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center gap-2">
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-9 w-36" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <div className="flex flex-col items-center text-center">
              <Skeleton className="h-24 w-24 rounded-full mb-4" />
              <Skeleton className="h-8 w-40 mb-2" />
              <Skeleton className="h-4 w-52 mb-2" />
              <Skeleton className="h-6 w-28" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div>
                <Skeleton className="h-5 w-20 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              
              <Separator />
              
              <div>
                <Skeleton className="h-5 w-20 mb-2" />
                <div className="grid grid-cols-2 gap-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
              
              <Separator />
              
              <div>
                <Skeleton className="h-5 w-20 mb-2" />
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-6 w-28" />
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <Skeleton className="h-6 w-40 mb-2" />
            <Skeleton className="h-4 w-60" />
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {[1, 2].map((i) => (
                <div key={i} className="rounded-lg border p-4">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <Skeleton className="h-10 w-10 rounded" />
                      <div>
                        <Skeleton className="h-6 w-40 mb-2" />
                        <Skeleton className="h-4 w-full mb-1" />
                        <Skeleton className="h-4 w-3/4" />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 md:text-right">
                      <div className="flex items-center md:justify-end gap-2">
                        <Skeleton className="h-6 w-28" />
                        <Skeleton className="h-6 w-24" />
                      </div>
                      <Skeleton className="h-4 w-36" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 