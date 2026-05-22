import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { ACHIEVEMENT_DEFS, checkLoginAchievements, checkProfileAchievements } from "@/lib/achievements"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const [startup, tasks, appointments, savedResources, notifications, achievements] = await Promise.all([
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
      db.achievement.findMany({
        where: { userId: session.user.id },
      }),
    ])

    // Auto-award first login achievement on dashboard visit
    if (achievements.length === 0) {
      const user = await db.user.findUnique({ where: { id: session.user.id }, select: { createdAt: true } })
      if (user) {
        checkLoginAchievements(session.user.id, user.createdAt).catch(() => {})
        checkProfileAchievements(session.user.id).catch(() => {})
      }
    }

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
    const hasStartupProfile = !!startup && startup.name !== "My Startup" && !!startup.industry
    const hasVisionAndGoals = !!startup?.vision && !!startup?.goals
    const roadmapItems = startup ? await db.roadmapItem.count({ where: { startupId: startup.id } }) : 0
    const hasRoadmapItems = roadmapItems > 0
    const hasBookedAppointment = appointments.length > 0
    const hasSavedResources = savedResources.length > 0
    const communityPosts = await db.communityPost.count({ where: { authorId: session.user.id } })
    const hasCommunityPost = communityPosts > 0

    const checklist = [
      { title: "Complete your startup profile", completed: hasStartupProfile, href: "/dashboard/startup", icon: "rocket" },
      { title: "Define your vision & goals", completed: hasVisionAndGoals, href: "/dashboard/startup", icon: "target" },
      { title: "Explore resources & save one", completed: hasSavedResources, href: "/dashboard/resources", icon: "book" },
      { title: "Join the community discussion", completed: hasCommunityPost, href: "/dashboard/community", icon: "users" },
      { title: "Build your roadmap", completed: hasRoadmapItems, href: "/dashboard/roadmap", icon: "map" },
      { title: "Book a consultation", completed: hasBookedAppointment, href: "/dashboard/appointments", icon: "calendar" },
    ]

    const checklistCompleted = checklist.filter((c) => c.completed).length

    // Calculate XP from earned achievements
    const earnedTypes = achievements.map((a) => a.type)
    const totalXP = earnedTypes.reduce((sum, type) => {
      const def = ACHIEVEMENT_DEFS[type]
      return sum + (def?.xp || 0)
    }, 0)

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
      achievements: {
        earned: earnedTypes.length,
        total: Object.keys(ACHIEVEMENT_DEFS).length,
        xp: totalXP,
        recent: achievements.slice(0, 3).map((a) => ({
          type: a.type,
          title: a.title,
        })),
      },
    })
  } catch (error) {
    console.error("Analytics GET error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
