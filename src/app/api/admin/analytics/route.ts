import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // User stats
    const totalUsers = await db.user.count()
    const paidUsers = await db.user.count({ where: { role: { in: ["PAID_USER"] } } })
    const freeUsers = await db.user.count({ where: { role: "FREE_USER" } })
    const consultantUsers = await db.user.count({ where: { role: "CONSULTANT" } })
    const adminUsers = await db.user.count({ where: { role: { in: ["ADMIN", "SUPER_ADMIN"] } } })

    // Subscription stats
    const activeSubscriptions = await db.subscription.count({ where: { status: "ACTIVE" } })
    const cancelledSubscriptions = await db.subscription.count({ where: { status: "CANCELLED" } })
    const expiredSubscriptions = await db.subscription.count({ where: { status: "EXPIRED" } })

    const planDistribution = await db.subscription.groupBy({
      by: ["plan"],
      _count: { plan: true },
    })

    // Revenue stats
    const revenueData = await db.payment.aggregate({
      where: { status: "COMPLETED" },
      _sum: { amount: true },
    })

    // Appointment stats
    const totalAppointments = await db.appointment.count()
    const scheduledAppointments = await db.appointment.count({ where: { status: "SCHEDULED" } })
    const completedAppointments = await db.appointment.count({ where: { status: "COMPLETED" } })
    const cancelledAppointments = await db.appointment.count({ where: { status: "CANCELLED" } })

    // Resource stats
    const totalResources = await db.resource.count()
    const premiumResources = await db.resource.count({ where: { isPremium: true } })
    const totalDownloads = await db.resource.aggregate({ _sum: { downloadCount: true } })

    const resourcesByType = await db.resource.groupBy({
      by: ["type"],
      _count: { type: true },
    })

    const resourcesByCategory = await db.resource.groupBy({
      by: ["category"],
      _count: { category: true },
    })

    // Message stats
    const totalMessages = await db.message.count()
    const unreadMessages = await db.message.count({ where: { isRead: false } })

    // Recent users (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const recentUsers = await db.user.count({
      where: { createdAt: { gte: thirtyDaysAgo } },
    })

    // Today's appointments
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    const todayEnd = new Date()
    todayEnd.setHours(23, 59, 59, 999)
    const todayAppointments = await db.appointment.findMany({
      where: { date: { gte: todayStart, lte: todayEnd } },
      include: {
        user: { select: { name: true, email: true } },
        consultant: { include: { user: { select: { name: true } } } },
      },
    })

    // User growth by month (last 6 months)
    const userGrowth = []
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date()
      monthStart.setMonth(monthStart.getMonth() - i, 1)
      monthStart.setHours(0, 0, 0, 0)
      const monthEnd = new Date(monthStart)
      monthEnd.setMonth(monthEnd.getMonth() + 1)
      monthEnd.setDate(0)
      monthEnd.setHours(23, 59, 59, 999)
      
      const count = await db.user.count({
        where: { createdAt: { lt: monthEnd } },
      })
      
      const newUsers = await db.user.count({
        where: { createdAt: { gte: monthStart, lte: monthEnd } },
      })

      userGrowth.push({
        month: monthStart.toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
        total: count,
        new: newUsers,
      })
    }

    // Revenue by month (last 6 months)
    const revenueByMonth = []
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date()
      monthStart.setMonth(monthStart.getMonth() - i, 1)
      monthStart.setHours(0, 0, 0, 0)
      const monthEnd = new Date(monthStart)
      monthEnd.setMonth(monthEnd.getMonth() + 1)
      monthEnd.setDate(0)
      monthEnd.setHours(23, 59, 59, 999)

      const result = await db.payment.aggregate({
        where: {
          status: "COMPLETED",
          createdAt: { gte: monthStart, lte: monthEnd },
        },
        _sum: { amount: true },
        _count: true,
      })

      revenueByMonth.push({
        month: monthStart.toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
        revenue: result._sum.amount || 0,
        transactions: result._count,
      })
    }

    // User distribution by country
    const usersByCountry = await db.user.groupBy({
      by: ["country"],
      _count: { country: true },
      orderBy: { _count: { country: "desc" } },
      take: 10,
    })

    // Resource top downloads
    const topResources = await db.resource.findMany({
      orderBy: { downloadCount: "desc" },
      take: 5,
      select: { id: true, title: true, type: true, downloadCount: true, isPremium: true },
    })

    return NextResponse.json({
      users: {
        total: totalUsers,
        paid: paidUsers,
        free: freeUsers,
        consultants: consultantUsers,
        admins: adminUsers,
        recent: recentUsers,
        growth: userGrowth,
        byCountry: usersByCountry,
      },
      subscriptions: {
        active: activeSubscriptions,
        cancelled: cancelledSubscriptions,
        expired: expiredSubscriptions,
        planDistribution,
      },
      revenue: {
        total: revenueData._sum.amount || 0,
        byMonth: revenueByMonth,
      },
      appointments: {
        total: totalAppointments,
        scheduled: scheduledAppointments,
        completed: completedAppointments,
        cancelled: cancelledAppointments,
        today: todayAppointments,
      },
      resources: {
        total: totalResources,
        premium: premiumResources,
        totalDownloads: totalDownloads._sum.downloadCount || 0,
        byType: resourcesByType,
        byCategory: resourcesByCategory,
        topDownloads: topResources,
      },
      messages: { total: totalMessages, unread: unreadMessages },
    })
  } catch (error) {
    console.error("Admin analytics GET error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
