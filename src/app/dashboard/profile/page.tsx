"use client"

import * as React from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  User,
  Building2,
  Shield,
  Bell,
  Camera,
  Save,
  Globe,
  Linkedin,
  Twitter,
  Link as LinkIcon,
  Trophy,
  Star,
  Rocket,
  CheckCircle2,
  Download,
  UsersRound,
  Clock,
  Zap,
  Lock,
} from "lucide-react"
import { toast } from "sonner"

const allAchievements = [
  { type: "FIRST_LOGIN", title: "Welcome Aboard", description: "Logged in for the first time", icon: Rocket, color: "from-blue-500 to-cyan-500", xp: 10 },
  { type: "PROFILE_COMPLETE", title: "Profile Perfectionist", description: "Completed your full profile", icon: Star, color: "from-purple-500 to-pink-500", xp: 25 },
  { type: "FIRST_APPOINTMENT", title: "First Step", description: "Booked your first consultation", icon: CheckCircle2, color: "from-green-500 to-emerald-500", xp: 30 },
  { type: "RESOURCE_DOWNLOAD", title: "Knowledge Seeker", description: "Downloaded your first resource", icon: Download, color: "from-orange-500 to-red-500", xp: 15 },
  { type: "TASK_MASTER", title: "Task Master", description: "Completed 10 tasks on your roadmap", icon: Zap, color: "from-yellow-500 to-orange-500", xp: 50 },
  { type: "MILESTONE_5", title: "5 Milestones Strong", description: "Reached 5 startup milestones", icon: Trophy, color: "from-cyan-500 to-blue-500", xp: 40 },
  { type: "MILESTONE_10", title: "Double Digits", description: "Reached 10 startup milestones", icon: Trophy, color: "from-pink-500 to-purple-500", xp: 75 },
  { type: "COMMUNITY_MEMBER", title: "Community Builder", description: "Joined the community forum", icon: UsersRound, color: "from-emerald-500 to-green-500", xp: 20 },
  { type: "EARLY_ADOPTER", title: "Early Adopter", description: "Joined Upmind during early access", icon: Clock, color: "from-blue-500 to-purple-600", xp: 35 },
]

function AchievementGrid() {
  const [earnedAchievements, setEarnedAchievements] = React.useState<string[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    async function fetchAchievements() {
      try {
        const res = await fetch("/api/achievements")
        if (res.ok) {
          const data = await res.json()
          setEarnedAchievements(data.achievements.map((a: { type: string }) => a.type))
        }
      } catch {
        // Use empty on error
      } finally {
        setLoading(false)
      }
    }
    fetchAchievements()
  }, [])

  const totalXP = allAchievements
    .filter((a) => earnedAchievements.includes(a.type))
    .reduce((sum, a) => sum + a.xp, 0)

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="rounded-xl bg-muted/30 p-4 animate-pulse">
            <div className="w-12 h-12 rounded-full bg-muted mx-auto mb-2" />
            <div className="h-3 w-20 bg-muted rounded mx-auto mb-1" />
            <div className="h-2 w-28 bg-muted rounded mx-auto" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-600/10 border border-blue-200/50 dark:border-blue-800/50">
        <div className="flex items-center gap-2">
          <Trophy className="size-5 text-yellow-500" />
          <span className="text-sm font-medium">Total XP</span>
        </div>
        <span className="text-lg font-bold">{totalXP} XP</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {allAchievements.map((achievement) => {
          const isEarned = earnedAchievements.includes(achievement.type)
          const Icon = achievement.icon
          return (
            <div
              key={achievement.type}
              className={`relative rounded-xl p-4 text-center transition-all duration-200 ${
                isEarned
                  ? "bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200/50 dark:border-blue-800/50"
                  : "bg-muted/20 opacity-60"
              }`}
            >
              {!isEarned && (
                <Lock className="absolute top-2 right-2 size-3 text-muted-foreground/40" />
              )}
              <div
                className={`w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center ${
                  isEarned
                    ? `bg-gradient-to-br ${achievement.color}`
                    : "bg-muted/50"
                }`}
              >
                <Icon className={`size-5 ${isEarned ? "text-white" : "text-muted-foreground/40"}`} />
              </div>
              <p className={`text-xs font-semibold ${isEarned ? "" : "text-muted-foreground/60"}`}>
                {achievement.title}
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {achievement.description}
              </p>
              {isEarned && (
                <Badge className="mt-1.5 text-[10px] bg-green-500/10 text-green-600 dark:text-green-400 border-0">
                  +{achievement.xp} XP
                </Badge>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function ProfilePage() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = React.useState("profile")

  const userInitials = session?.user?.name
    ? session.user.name.split(" ").map((n) => n[0]).join("").toUpperCase()
    : "U"

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold">Profile & Account</h1>
        <p className="text-muted-foreground mt-1">Manage your profile, company, and preferences</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
          <TabsTrigger value="profile" className="gap-2">
            <User className="size-4" /> <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="company" className="gap-2">
            <Building2 className="size-4" /> <span className="hidden sm:inline">Company</span>
          </TabsTrigger>
          <TabsTrigger value="achievements" className="gap-2">
            <Trophy className="size-4" /> <span className="hidden sm:inline">Badges</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="size-4" /> <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="size-4" /> <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="mt-6">
          <Card className="border-0 shadow-md shadow-black/5 dark:shadow-black/20">
            <CardHeader>
              <CardTitle className="text-base font-heading">My Profile</CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="size-20">
                    <AvatarImage src={session?.user?.image || undefined} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <Button size="icon" variant="outline" className="absolute -bottom-1 -right-1 size-8 rounded-full">
                    <Camera className="size-3.5" />
                  </Button>
                </div>
                <div>
                  <p className="font-medium">{session?.user?.name || "User"}</p>
                  <p className="text-sm text-muted-foreground">{session?.user?.email}</p>
                  <Badge variant="secondary" className="mt-1 text-xs">
                    {session?.user ? (session.user as { role: string }).role : "FREE_USER"}
                  </Badge>
                </div>
              </div>

              <Separator />

              {/* Form */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Full Name</label>
                  <Input defaultValue={session?.user?.name || ""} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Email</label>
                  <Input defaultValue={session?.user?.email || ""} type="email" disabled />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Phone</label>
                  <Input placeholder="+1 (555) 123-4567" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Country</label>
                  <Input placeholder="United States" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Bio</label>
                <Textarea placeholder="Tell us about yourself..." rows={3} />
              </div>
              <Button
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                onClick={() => toast.success("Profile updated successfully!")}
              >
                <Save className="size-4 mr-2" /> Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Company Tab */}
        <TabsContent value="company" className="mt-6">
          <Card className="border-0 shadow-md shadow-black/5 dark:shadow-black/20">
            <CardHeader>
              <CardTitle className="text-base font-heading">Company Profile</CardTitle>
              <CardDescription>Update your startup information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Startup Name</label>
                  <Input placeholder="Your startup name" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Industry</label>
                  <Input placeholder="e.g., SaaS, FinTech, HealthTech" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Team Size</label>
                  <Input placeholder="e.g., 1-5, 6-20, 20-50" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Website</label>
                  <Input placeholder="https://yourstartup.com" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Vision</label>
                <Textarea placeholder="What's the long-term vision for your startup?" rows={3} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Goals</label>
                <Textarea placeholder="What are your key goals for the next 6-12 months?" rows={3} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Pitch Deck</label>
                <div className="border-2 border-dashed rounded-xl p-6 text-center">
                  <p className="text-sm text-muted-foreground">Upload your pitch deck (PDF, max 20MB)</p>
                  <Button variant="outline" size="sm" className="mt-3">
                    Choose File
                  </Button>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Social Links</label>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Twitter className="size-4 text-muted-foreground shrink-0" />
                    <Input placeholder="Twitter/X profile URL" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Linkedin className="size-4 text-muted-foreground shrink-0" />
                    <Input placeholder="LinkedIn company URL" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="size-4 text-muted-foreground shrink-0" />
                    <Input placeholder="Other URL" />
                  </div>
                </div>
              </div>
              <Button
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                onClick={() => toast.success("Company profile updated!")}
              >
                <Save className="size-4 mr-2" /> Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="mt-6 space-y-6">
          <Card className="border-0 shadow-md shadow-black/5 dark:shadow-black/20">
            <CardHeader>
              <CardTitle className="text-base font-heading flex items-center gap-2">
                <Trophy className="size-5 text-yellow-500" /> Achievements & Badges
              </CardTitle>
              <CardDescription>Track your milestones and earn rewards</CardDescription>
            </CardHeader>
            <CardContent>
              <AchievementGrid />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="mt-6 space-y-6">
          <Card className="border-0 shadow-md shadow-black/5 dark:shadow-black/20">
            <CardHeader>
              <CardTitle className="text-base font-heading">Change Password</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Current Password</label>
                <Input type="password" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">New Password</label>
                  <Input type="password" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Confirm New Password</label>
                  <Input type="password" />
                </div>
              </div>
              <Button
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                onClick={() => toast.success("Password updated successfully!")}
              >
                Update Password
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md shadow-black/5 dark:shadow-black/20">
            <CardHeader>
              <CardTitle className="text-base font-heading">Two-Factor Authentication</CardTitle>
              <CardDescription>Add an extra layer of security to your account</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Enable 2FA</p>
                  <p className="text-xs text-muted-foreground">Use an authenticator app for verification</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md shadow-black/5 dark:shadow-black/20">
            <CardHeader>
              <CardTitle className="text-base font-heading">Login Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { device: "Chrome on macOS", location: "San Francisco, CA", time: "Current session", active: true },
                  { device: "Safari on iPhone", location: "San Francisco, CA", time: "2 hours ago", active: false },
                  { device: "Firefox on Windows", location: "New York, NY", time: "3 days ago", active: false },
                ].map((session, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div>
                      <p className="text-sm font-medium">{session.device}</p>
                      <p className="text-xs text-muted-foreground">{session.location} &middot; {session.time}</p>
                    </div>
                    {session.active ? (
                      <Badge className="bg-green-500 text-white text-xs">Active</Badge>
                    ) : (
                      <Button variant="ghost" size="sm" className="text-destructive text-xs h-7">Revoke</Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="mt-6">
          <Card className="border-0 shadow-md shadow-black/5 dark:shadow-black/20">
            <CardHeader>
              <CardTitle className="text-base font-heading">Notification Preferences</CardTitle>
              <CardDescription>Choose how you want to be notified</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { category: "Email Notifications", items: [
                  { label: "Appointment reminders", description: "Get notified before your scheduled consultations" },
                  { label: "New messages", description: "Email alerts when you receive a new message" },
                  { label: "Resource updates", description: "Notifications about new resources in your areas" },
                  { label: "Weekly digest", description: "A weekly summary of your startup progress" },
                ]},
                { category: "SMS Notifications", items: [
                  { label: "Appointment reminders", description: "SMS reminders 1 hour before consultations" },
                  { label: "Critical alerts", description: "Important account and security alerts" },
                ]},
                { category: "Push Notifications", items: [
                  { label: "Real-time messages", description: "Browser push for new messages" },
                  { label: "Task reminders", description: "Reminders for upcoming task deadlines" },
                ]},
              ].map((group) => (
                <div key={group.category}>
                  <h3 className="text-sm font-semibold mb-3">{group.category}</h3>
                  <div className="space-y-3">
                    {group.items.map((item) => (
                      <div key={item.label} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                        <div>
                          <p className="text-sm font-medium">{item.label}</p>
                          <p className="text-xs text-muted-foreground">{item.description}</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    ))}
                  </div>
                  <Separator className="mt-4" />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
