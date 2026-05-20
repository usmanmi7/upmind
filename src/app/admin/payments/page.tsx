"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  DollarSign,
  TrendingUp,
  Users,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  RotateCcw,
  Download,
  Filter,
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { useToast } from "@/hooks/use-toast"

interface Payment {
  id: string
  amount: number
  currency: string
  status: string
  method: string | null
  createdAt: string
  subscription: {
    user: { id: string; name: string; email: string }
    plan: string
  }
}

const paymentStatusColors: Record<string, string> = {
  PENDING: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  COMPLETED: "bg-green-500/20 text-green-400 border-green-500/30",
  FAILED: "bg-red-500/20 text-red-400 border-red-500/30",
  REFUNDED: "bg-purple-500/20 text-purple-400 border-purple-500/30",
}

const planColors: Record<string, string> = {
  FREE: "#94a3b8",
  GROWTH_PRO: "#8b5cf6",
  ENTERPRISE: "#06b6d4",
}

export default function AdminPaymentsPage() {
  const { toast } = useToast()
  const [payments, setPayments] = React.useState<Payment[]>([])
  const [loading, setLoading] = React.useState(true)
  const [stats, setStats] = React.useState({ totalRevenue: 0, totalTransactions: 0, mrr: 0, arpu: 0, planDistribution: [] as Array<{ plan: string; _count: { plan: number } }> })
  const [statusFilter, setStatusFilter] = React.useState("all")
  const [page, setPage] = React.useState(1)
  const [totalPages, setTotalPages] = React.useState(1)
  const [total, setTotal] = React.useState(0)
  const [refundOpen, setRefundOpen] = React.useState(false)
  const [selectedPayment, setSelectedPayment] = React.useState<Payment | null>(null)

  const fetchPayments = React.useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set("page", page.toString())
      params.set("limit", "10")
      if (statusFilter && statusFilter !== "all") params.set("status", statusFilter)

      const res = await fetch(`/api/admin/payments?${params}`)
      if (res.ok) {
        const json = await res.json()
        setPayments(json.payments)
        setTotalPages(json.pagination.totalPages)
        setTotal(json.pagination.total)
        setStats(json.stats)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [page, statusFilter])

  React.useEffect(() => { fetchPayments() }, [fetchPayments])

  const handleRefund = async () => {
    if (!selectedPayment) return
    try {
      const res = await fetch("/api/admin/payments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId: selectedPayment.id, status: "REFUNDED" }),
      })
      if (res.ok) {
        toast({ title: "Refund processed successfully" })
        setRefundOpen(false)
        fetchPayments()
      }
    } catch {
      toast({ title: "Failed to process refund", variant: "destructive" })
    }
  }

  // Revenue chart data (mock monthly breakdown)
  const revenueChartData = [
    { month: "Jan", revenue: 346 },
    { month: "Feb", revenue: 445 },
    { month: "Mar", revenue: 594 },
    { month: "Apr", revenue: 643 },
    { month: "May", revenue: 791 },
    { month: "Jun", revenue: stats.mrr || 890 },
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Payments & Billing</h2>
          <p className="text-sm text-muted-foreground">Revenue and transaction management</p>
        </div>
        <Button variant="outline" onClick={() => toast({ title: "CSV export started (demo)" })}>
          <Download className="size-4 mr-2" />Export CSV
        </Button>
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Total Revenue", value: `$${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: "from-green-500 to-emerald-500", change: "+12.5%" },
          { title: "MRR", value: `$${stats.mrr.toLocaleString()}`, icon: TrendingUp, color: "from-purple-500 to-violet-500", change: "+8.3%" },
          { title: "ARPU", value: `$${stats.arpu.toFixed(2)}`, icon: Users, color: "from-blue-500 to-cyan-500", change: "+2.1%" },
          { title: "Transactions", value: stats.totalTransactions, icon: CreditCard, color: "from-orange-500 to-red-500", change: "+5.7%" },
        ].map((stat) => (
          <Card key={stat.title} className="border-0 bg-gradient-to-br from-background to-muted/30 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <ArrowUpRight className="size-3 text-green-500" />
                    <span className="text-xs text-green-500">{stat.change}</span>
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="size-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue Chart */}
        <Card className="border-0 bg-gradient-to-br from-background to-muted/30 shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Monthly Revenue</CardTitle>
            <CardDescription>Revenue over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                  <Bar dataKey="revenue" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Revenue ($)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Plan Distribution */}
        <Card className="border-0 bg-gradient-to-br from-background to-muted/30 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Plan Distribution</CardTitle>
            <CardDescription>Active subscriptions by plan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.planDistribution.map((p) => ({ name: p.plan, value: p._count.plan }))}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {stats.planDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={planColors[entry.plan] || "#94a3b8"} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-2">
              {stats.planDistribution.map((p) => (
                <div key={p.plan} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: planColors[p.plan] || "#94a3b8" }} />
                  <span className="text-xs text-muted-foreground">{p.plan.replace("_", " ")} ({p._count.plan})</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card className="border-0 bg-gradient-to-br from-background to-muted/30 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <CardTitle className="text-base">Transactions</CardTitle>
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1) }}>
              <SelectTrigger className="w-full sm:w-40"><Filter className="size-4 mr-2" /><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="FAILED">Failed</SelectItem>
                <SelectItem value="REFUNDED">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead className="hidden md:table-cell">Plan</TableHead>
                  <TableHead className="hidden md:table-cell">Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden lg:table-cell">Date</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}><TableCell colSpan={7} className="h-16"><div className="animate-pulse bg-muted rounded h-8" /></TableCell></TableRow>
                  ))
                ) : payments.length === 0 ? (
                  <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No transactions found</TableCell></TableRow>
                ) : (
                  payments.map((payment) => (
                    <TableRow key={payment.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium">{payment.subscription.user.name}</p>
                          <p className="text-xs text-muted-foreground">{payment.subscription.user.email}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">${payment.amount.toFixed(2)}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="secondary" className="text-xs">
                          {payment.subscription.plan.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-muted-foreground capitalize">
                        {payment.method || "—"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={paymentStatusColors[payment.status] || ""}>
                          {payment.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {payment.status === "COMPLETED" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs"
                            onClick={() => { setSelectedPayment(payment); setRefundOpen(true) }}
                          >
                            <RotateCcw className="size-3 mr-1" />Refund
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between px-4 py-3 border-t">
            <p className="text-sm text-muted-foreground">Page {page} of {totalPages} ({total} transactions)</p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}><ChevronLeft className="size-4" /></Button>
              <Button variant="outline" size="sm" onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages}><ChevronRight className="size-4" /></Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Refund Dialog */}
      <Dialog open={refundOpen} onOpenChange={setRefundOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Process Refund</DialogTitle>
            <DialogDescription>This will refund the payment and update the status</DialogDescription>
          </DialogHeader>
          {selectedPayment && (
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-sm font-medium">{selectedPayment.subscription.user.name}</p>
                <p className="text-lg font-bold">${selectedPayment.amount.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">{selectedPayment.subscription.plan.replace("_", " ")}</p>
              </div>
              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setRefundOpen(false)}>Cancel</Button>
                <Button variant="destructive" onClick={handleRefund}>
                  <RotateCcw className="size-4 mr-2" />Confirm Refund
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
