import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const [startup, tasks, appointments, savedResources, notifications] = await Promise.all([
      db.startup.findUnique({ where: { userId: session.user.id } }),
      db.task.findMany({
        where: { startup: { userId: session.user.id } },
      }),
      db.appointment.findMany({
        where: { userId: session.user.id },
      }),
      db.savedResource.findMany({
        where: { userId: session.user.id },
        include: { resource: true },
      }),
      db.notification.findMany({
        where: { userId: session.user.id },
      }),
    ])

    const completedTasks = tasks.filter((t) => t.status === "COMPLETED").length
    const inProgressTasks = tasks.filter((t) => t.status === "IN_PROGRESS").length
    const todoTasks = tasks.filter((t) => t.status === "TODO").length
    const completedAppointments = appointments.filter((a) => a.status === "COMPLETED").length
    const scheduledAppointments = appointments.filter((a) => a.status === "SCHEDULED").length
    const unreadNotifications = notifications.filter((n) => !n.isRead).length

    // Calculate startup score based on actual data
    const taskScore = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 25) : 0
    const appointmentScore = Math.min(completedAppointments * 5, 25)
    const resourceScore = Math.min(savedResources.length * 3, 25)
    const profileScore = (startup?.vision ? 5 : 0) + (startup?.goals ? 5 : 0) + (startup?.industry ? 5 : 0) + (startup?.website ? 5 : 0) + (startup?.name && startup.name !== "My Startup" ? 5 : 0)
    const startupScore = Math.min(taskScore + appointmentScore + resourceScore + profileScore, 100)

    // Resource type breakdown
    const resourceByType: Record<string, number> = {}
    savedResources.forEach((sr) => {
      const type = sr.resource?.type || "OTHER"
      resourceByType[type] = (resourceByType[type] || 0) + 1
    })

    // Health score dimensions
    const healthDimensions = {
      product: Math.min(taskScore * 4 + (startup?.businessStage ? 10 : 0), 100),
      market: Math.min(appointmentScore * 2 + (startup?.industry ? 15 : 0) + resourceScore, 100),
      team: Math.min((startup?.teamSize ? 20 : 0) + profileScore * 2, 100),
      financials: Math.min(completedAppointments * 10 + (startup?.revenueStage ? 20 : 0), 100),
    }

    // Next upcoming appointment
    const upcomingAppointments = appointments
      .filter((a) => a.status === "SCHEDULED" && new Date(a.date) > new Date())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    // Recent tasks (last 5)
    const recentTasks = tasks.slice(0, 5)

    // Getting started checklist - based on actual user activity
    const hasStartupProfile = !!startup && startup.name !== "My Startup"
    const hasVision = !!startup?.vision
    const hasUsedAI = false // We'll track this separately
    const hasRoadmapItems = false // We'll check from roadmap
    const hasBookedAppointment = appointments.length > 0

    const checklist = [
      { title: "Create your startup profile", completed: hasStartupProfile, href: "/dashboard/startup" },
      { title: "Define your vision & goals", completed: hasVision, href: "/dashboard/startup" },
      { title: "Try the AI Assistant", completed: hasUsedAI, href: "/dashboard/ai-assistant" },
      { title: "Build your first roadmap", completed: hasRoadmapItems, href: "/dashboard/roadmap" },
      { title: "Book a consultation", completed: hasBookedAppointment, href: "/dashboard/appointments" },
    ]

    const checklistCompleted = checklist.filter((c) => c.completed).length

    return NextResponse.json({
      overview: {
        tasksCompleted: completedTasks,
        totalTasks: tasks.length,
        appointmentsAttended: completedAppointments,
        totalAppointments: appointments.length,
        scheduledAppointments,
        resourcesUsed: savedResources.length,
        startupScore,
        unreadNotifications,
      },
      taskBreakdown: {
        completed: completedTasks,
        inProgress: inProgressTasks,
        todo: todoTasks,
      },
      resourceByType,
      healthDimensions,
      progress: startup?.progress || 0,
      startup,
      recentTasks,
      upcomingAppointments: upcomingAppointments.slice(0, 3),
      checklist,
      checklistCompleted,
    })
  } catch (error) {
    console.error("Analytics GET error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
