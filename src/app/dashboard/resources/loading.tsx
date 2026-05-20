import { CardGridSkeleton } from "@/components/dashboard/LoadingSkeleton"

export default function ResourcesLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-32 bg-muted rounded animate-pulse mb-2" />
          <div className="h-4 w-48 bg-muted rounded animate-pulse" />
        </div>
      </div>
      <div className="flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-9 w-20 bg-muted rounded animate-pulse" />
        ))}
      </div>
      <CardGridSkeleton count={6} />
    </div>
  )
}
