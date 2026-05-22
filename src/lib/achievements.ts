import { db } from "@/lib/db"

// Achievement definitions with XP values
export const ACHIEVEMENT_DEFS: Record<string, { title: string; description: string; xp: number }> = {
  FIRST_LOGIN: { title: "Welcome Aboard", description: "Logged in for the first time", xp: 10 },
  PROFILE_COMPLETE: { title: "Profile Perfectionist", description: "Completed your full profile", xp: 25 },
  FIRST_APPOINTMENT: { title: "First Step", description: "Booked your first consultation", xp: 30 },
  RESOURCE_DOWNLOAD: { title: "Knowledge Seeker", description: "Saved your first resource", xp: 15 },
  TASK_MASTER: { title: "Task Master", description: "Completed 10 tasks on your roadmap", xp: 50 },
  MILESTONE_5: { title: "5 Milestones Strong", description: "Completed 5 roadmap tasks", xp: 40 },
  MILESTONE_10: { title: "Double Digits", description: "Completed 10 roadmap tasks", xp: 75 },
  COMMUNITY_MEMBER: { title: "Community Builder", description: "Created your first community post", xp: 20 },
  EARLY_ADOPTER: { title: "Early Adopter", description: "Joined Upmind during early access", xp: 35 },
  ROADMAP_STARTER: { title: "Roadmap Starter", description: "Added your first roadmap task", xp: 15 },
  RESOURCE_EXPLORER: { title: "Resource Explorer", description: "Saved 5 resources to your library", xp: 30 },
  SOCIAL_BUTTERFLY: { title: "Social Butterfly", description: "Created 5 community posts", xp: 45 },
  CONSULTATION_PRO: { title: "Consultation Pro", description: "Booked 3 consultations", xp: 40 },
  VISIONARY: { title: "Visionary", description: "Defined your startup vision and goals", xp: 20 },
  STARTUP_PROFILE: { title: "Identity Set", description: "Completed your startup profile", xp: 20 },
}

/**
 * Award an achievement to a user if they don't already have it.
 * Returns { awarded: true } if newly earned, { awarded: false } if already had it.
 */
export async function awardAchievement(userId: string, type: string): Promise<{ awarded: boolean; achievement?: unknown }> {
  const def = ACHIEVEMENT_DEFS[type]
  if (!def) {
    console.warn(`Unknown achievement type: ${type}`)
    return { awarded: false }
  }

  try {
    // Check if already earned
    const existing = await db.achievement.findFirst({
      where: { userId, type },
    })

    if (existing) {
      return { awarded: false }
    }

    // Award the achievement
    const achievement = await db.achievement.create({
      data: {
        userId,
        type,
        title: def.title,
        description: def.description,
      },
    })

    // Create notification
    await db.notification.create({
      data: {
        userId,
        title: "Achievement Unlocked!",
        message: `You earned "${def.title}" (+${def.xp} XP)`,
        type: "SYSTEM",
        link: "/dashboard/profile",
      },
    })

    return { awarded: true, achievement }
  } catch (error) {
    console.error(`Failed to award achievement ${type}:`, error)
    return { awarded: false }
  }
}

/**
 * Check and award milestone achievements based on roadmap progress.
 * Call this after a roadmap item is toggled.
 */
export async function checkRoadmapAchievements(userId: string): Promise<void> {
  try {
    const startup = await db.startup.findUnique({
      where: { userId },
      select: { id: true },
    })
    if (!startup) return

    const completedCount = await db.roadmapItem.count({
      where: { startupId: startup.id, isCompleted: true },
    })

    if (completedCount >= 5) {
      await awardAchievement(userId, "MILESTONE_5")
    }
    if (completedCount >= 10) {
      await awardAchievement(userId, "TASK_MASTER")
      await awardAchievement(userId, "MILESTONE_10")
    }
  } catch (error) {
    console.error("Failed to check roadmap achievements:", error)
  }
}

/**
 * Check and award profile-related achievements.
 * Call this after profile/startup updates.
 */
export async function checkProfileAchievements(userId: string): Promise<void> {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { name: true, bio: true, country: true, phone: true },
    })

    const startup = await db.startup.findUnique({
      where: { userId },
      select: { name: true, industry: true, vision: true, goals: true, website: true },
    })

    // Check startup profile completion
    if (startup && startup.name !== "My Startup" && startup.industry) {
      await awardAchievement(userId, "STARTUP_PROFILE")
    }

    // Check if vision and goals are defined
    if (startup?.vision && startup?.goals) {
      await awardAchievement(userId, "VISIONARY")
    }

    // Check full user profile
    if (user?.name && user?.bio && user?.country) {
      await awardAchievement(userId, "PROFILE_COMPLETE")
    }
  } catch (error) {
    console.error("Failed to check profile achievements:", error)
  }
}

/**
 * Check and award appointment achievements.
 * Call this after booking an appointment.
 */
export async function checkAppointmentAchievements(userId: string): Promise<void> {
  try {
    const appointmentCount = await db.appointment.count({
      where: { userId },
    })

    if (appointmentCount >= 1) {
      await awardAchievement(userId, "FIRST_APPOINTMENT")
    }
    if (appointmentCount >= 3) {
      await awardAchievement(userId, "CONSULTATION_PRO")
    }
  } catch (error) {
    console.error("Failed to check appointment achievements:", error)
  }
}

/**
 * Check and award resource achievements.
 * Call this after saving a resource.
 */
export async function checkResourceAchievements(userId: string): Promise<void> {
  try {
    const savedCount = await db.savedResource.count({
      where: { userId },
    })

    if (savedCount >= 1) {
      await awardAchievement(userId, "RESOURCE_DOWNLOAD")
    }
    if (savedCount >= 5) {
      await awardAchievement(userId, "RESOURCE_EXPLORER")
    }
  } catch (error) {
    console.error("Failed to check resource achievements:", error)
  }
}

/**
 * Check and award community achievements.
 * Call this after creating a community post.
 */
export async function checkCommunityAchievements(userId: string): Promise<void> {
  try {
    const postCount = await db.communityPost.count({
      where: { authorId: userId },
    })

    if (postCount >= 1) {
      await awardAchievement(userId, "COMMUNITY_MEMBER")
    }
    if (postCount >= 5) {
      await awardAchievement(userId, "SOCIAL_BUTTERFLY")
    }
  } catch (error) {
    console.error("Failed to check community achievements:", error)
  }
}

/**
 * Award first login achievement and early adopter badge.
 * Call this on the user's first session.
 */
export async function checkLoginAchievements(userId: string, userCreatedAt: Date): Promise<void> {
  try {
    await awardAchievement(userId, "FIRST_LOGIN")

    // Early adopter: users who joined in the first 6 months of the platform
    const platformLaunchDate = new Date("2024-01-01")
    const sixMonthsAfterLaunch = new Date(platformLaunchDate)
    sixMonthsAfterLaunch.setMonth(sixMonthsAfterLaunch.getMonth() + 6)

    if (userCreatedAt <= sixMonthsAfterLaunch) {
      await awardAchievement(userId, "EARLY_ADOPTER")
    }
  } catch (error) {
    console.error("Failed to check login achievements:", error)
  }
}
