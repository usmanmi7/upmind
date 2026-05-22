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

    // Fetch roadmap items and resource views (depend on startup id)
    const [roadmapItems, resourceViews] = await Promise.all([
      startup?.id
        ? db.roadmapItem.findMany({ where: { startupId: startup.id } })
        : Promise.resolve([]),
      db.resourceView.findMany({
        where: { userId: session.user.id },
        include: { resource: { select: { type: true } } },
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

    // Count roadmap task completions (what users actually interact with)
    const completedRoadmapItems = roadmapItems.filter((r) => r.isCompleted).length
    const totalRoadmapItems = roadmapItems.length

    // Combine Task model + RoadmapItem model for accurate "Tasks Completed"
    const totalTasksCompleted = completedTasks + completedRoadmapItems
    const totalTasksCount = tasks.length + totalRoadmapItems

    // Resource views (what users actually opened)
    const resourceViewCount = resourceViews.length
    // Deduplicate: count unique resources viewed
    const uniqueResourcesViewed = new Set(resourceViews.map((rv) => rv.resourceId)).size

    // Calculate startup score based on actual data
    const taskScore = totalTasksCount > 0 ? Math.round((totalTasksCompleted / totalTasksCount) * 25) : 0
    const appointmentScore = Math.min(completedAppointments * 5, 25)
    const resourceScore = Math.min(uniqueResourcesViewed * 3, 25)
    const profileScore = (startup?.vision ? 5 : 0) + (startup?.goals ? 5 : 0) + (startup?.industry ? 5 : 0) + (startup?.website ? 5 : 0) + (startup?.name && startup.name !== "My Startup" ? 5 : 0)
    const startupScore = Math.min(taskScore + appointmentScore + resourceScore + profileScore, 100)

    // Resource type breakdown from views
    const resourceByType: Record<string, number> = {}
    resourceViews.forEach((rv) => {
      const type = rv.resource?.type || "OTHER"
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

    // Recent tasks (combine Task model + RoadmapItem for display)
    const recentTasks = [
      ...tasks.map((t) => ({ id: t.id, title: t.title, status: t.status, dueDate: t.dueDate?.toISOString() || null })),
      ...roadmapItems.map((r) => ({
        id: r.id,
        title: r.title,
        status: r.isCompleted ? "COMPLETED" as const : "TODO" as const,
        dueDate: null,
      })),
    ].slice(0, 5)

    // Getting started checklist - based on actual user activity
    const hasStartupProfile = !!startup && startup.name !== "My Startup" && !!startup.industry
    const hasVisionAndGoals = !!startup?.vision && !!startup?.goals
    const hasRoadmapItems = totalRoadmapItems > 0
    const hasBookedAppointment = appointments.length > 0
    const hasViewedResources = resourceViewCount > 0
    const communityPosts = await db.communityPost.count({ where: { authorId: session.user.id } })
    const hasCommunityPost = communityPosts > 0

    const checklist = [
      { title: "Complete your startup profile", completed: hasStartupProfile, href: "/dashboard/startup", icon: "rocket" },
      { title: "Define your vision & goals", completed: hasVisionAndGoals, href: "/dashboard/startup", icon: "target" },
      { title: "Explore resources", completed: hasViewedResources, href: "/dashboard/resources", icon: "book" },
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
        tasksCompleted: totalTasksCompleted,
        totalTasks: totalTasksCount,
        appointmentsAttended: completedAppointments,
        totalAppointments: appointments.length,
        scheduledAppointments,
        resourcesUsed: uniqueResourcesViewed,
        startupScore,
        unreadNotifications,
      },
      taskBreakdown: {
        completed: totalTasksCompleted,
        inProgress: inProgressTasks,
        todo: todoTasks + (totalRoadmapItems - completedRoadmapItems),
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
