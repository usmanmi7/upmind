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

    const [startup, tasks, appointments, resources, savedResources, notifications] = await Promise.all([
      db.startup.findUnique({ where: { userId: session.user.id } }),
      db.task.findMany({
        where: { startup: { userId: session.user.id } },
      }),
      db.appointment.findMany({
        where: { userId: session.user.id },
      }),
      db.savedResource.findMany({
        where: { userId: session.user.id },
      }),
      db.savedResource.count({ where: { userId: session.user.id } }),
      db.notification.findMany({
        where: { userId: session.user.id },
      }),
    ])

    const completedTasks = tasks.filter((t) => t.status === "COMPLETED").length
    const inProgressTasks = tasks.filter((t) => t.status === "IN_PROGRESS").length
    const todoTasks = tasks.filter((t) => t.status === "TODO").length
    const completedAppointments = appointments.filter((a) => a.status === "COMPLETED").length
    const unreadNotifications = notifications.filter((n) => !n.isRead).length

    const startupScore = startup?.progress || 0

    return NextResponse.json({
      overview: {
        tasksCompleted: completedTasks,
        totalTasks: tasks.length,
        appointmentsAttended: completedAppointments,
        totalAppointments: appointments.length,
        resourcesUsed: resources,
        savedResources,
        startupScore,
        unreadNotifications,
      },
      taskBreakdown: {
        completed: completedTasks,
        inProgress: inProgressTasks,
        todo: todoTasks,
      },
      progress: startup?.progress || 0,
      startup,
    })
  } catch (error) {
    console.error("Analytics GET error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
