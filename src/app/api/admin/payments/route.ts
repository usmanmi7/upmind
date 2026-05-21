import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const status = searchParams.get("status") || ""
    const method = searchParams.get("method") || ""

    const where: Record<string, unknown> = {}
    if (status) where.status = status
    if (method) where.method = method

    const [payments, total] = await Promise.all([
      db.payment.findMany({
        where,
        include: {
          subscription: {
            include: {
              user: { select: { id: true, name: true, email: true } },
            },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      db.payment.count({ where }),
    ])

    // Revenue stats
    const totalRevenue = await db.payment.aggregate({
      where: { status: "COMPLETED" },
      _sum: { amount: true },
      _count: true,
    })

    const subscriptions = await db.subscription.findMany()
    const activeSubscriptions = subscriptions.filter(s => s.status === "ACTIVE")
    const mrr = activeSubscriptions.reduce((acc, sub) => {
      const amount = sub.plan === "ENTERPRISE" ? 149 : sub.plan === "GROWTH_PRO" ? 49 : 0
      return acc + amount
    }, 0)

    const planDistribution = await db.subscription.groupBy({
      by: ["plan"],
      _count: { plan: true },
    })

    return NextResponse.json({
      payments,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      stats: {
        totalRevenue: totalRevenue._sum.amount || 0,
        totalTransactions: totalRevenue._count,
        mrr,
        arpu: activeSubscriptions.length > 0 ? (mrr / activeSubscriptions.length) : 0,
        planDistribution,
      },
    })
  } catch (error) {
    console.error("Admin payments GET error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const body = await request.json()
    const { paymentId, status } = body

    if (!paymentId || !status) {
      return NextResponse.json({ error: "Payment ID and status are required" }, { status: 400 })
    }

    const payment = await db.payment.update({
      where: { id: paymentId },
      data: { status },
      include: {
        subscription: {
          include: { user: { select: { id: true, name: true, email: true } } },
        },
      },
    })

    return NextResponse.json({ payment })
  } catch (error) {
    console.error("Admin payments PUT error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
