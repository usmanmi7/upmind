// Access control system for free vs paid users

export const FREE_USER_LIMITS = {
  appointments: 1,        // per month
  resourceDownloads: 5,   // per month
  premiumResources: false,
  directChat: false,
  advancedAnalytics: false,
  customRoadmap: false,
  aiAssistant: true,      // Limited access
  communityAccess: true,  // Read only
  businessPlanGenerator: false,
  pitchFeedback: false,
  startupScore: true,     // 1 per month
}

export const PAID_USER_LIMITS = {
  appointments: Infinity,
  resourceDownloads: Infinity,
  premiumResources: true,
  directChat: true,
  advancedAnalytics: true,
  customRoadmap: true,
  aiAssistant: true,
  communityAccess: true,
  businessPlanGenerator: true,
  pitchFeedback: true,
  startupScore: true,
}

export type Feature =
  | "appointments"
  | "resourceDownloads"
  | "premiumResources"
  | "directChat"
  | "advancedAnalytics"
  | "customRoadmap"
  | "aiAssistant"
  | "communityAccess"
  | "businessPlanGenerator"
  | "pitchFeedback"
  | "startupScore"

export function canAccess(
  userRole: string,
  feature: Feature
): boolean {
  if (
    userRole === "PAID_USER" ||
    userRole === "ADMIN" ||
    userRole === "SUPER_ADMIN"
  ) {
    return PAID_USER_LIMITS[feature] as boolean
  }
  return FREE_USER_LIMITS[feature] as boolean
}

export function getFeatureLimit(
  userRole: string,
  feature: "appointments" | "resourceDownloads"
): number {
  if (
    userRole === "PAID_USER" ||
    userRole === "ADMIN" ||
    userRole === "SUPER_ADMIN"
  ) {
    return PAID_USER_LIMITS[feature]
  }
  return FREE_USER_LIMITS[feature]
}

export function isPremiumUser(userRole: string): boolean {
  return (
    userRole === "PAID_USER" ||
    userRole === "ADMIN" ||
    userRole === "SUPER_ADMIN"
  )
}
