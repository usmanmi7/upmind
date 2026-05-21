import { TableSkeleton } from "@/components/dashboard/LoadingSkeleton"

export default function UsersLoading() {
  return <TableSkeleton rows={8} cols={6} />
}
