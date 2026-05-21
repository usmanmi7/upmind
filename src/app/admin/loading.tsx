import { TableSkeleton } from "@/components/dashboard/LoadingSkeleton"

export default function AdminLoading() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-48 bg-muted rounded animate-pulse mb-2" />
          <div className="h-4 w-64 bg-muted rounded animate-pulse" />
        </div>
      </div>
      <TableSkeleton rows={6} cols={5} />
    </div>
  )
}
