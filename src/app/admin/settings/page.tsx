"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Settings,
  Mail,
  DollarSign,
  Bell,
  AlertTriangle,
  Globe,
  Save,
  Shield,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PlatformSettings {
  siteName: string
  siteDescription: string
  contactEmail: string
  contactPhone: string
  socialLinks: { twitter: string; linkedin: string; github: string }
  emailTemplates: { welcome: string; appointmentReminder: string; paymentConfirmation: string; planExpiryNotice: string }
  pricing: {
    free: { name: string; price: number; features: string[] }
    growthPro: { name: string; price: number; features: string[] }
    enterprise: { name: string; price: number; features: string[] }
  }
  notifications: { newUserSignup: boolean; newAppointment: boolean; paymentReceived: boolean; supportTicket: boolean }
}

export default function AdminSettingsPage() {
  const { toast } = useToast()
  const [settings, setSettings] = React.useState<PlatformSettings | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [maintenanceMode, setMaintenanceMode] = React.useState(false)

  React.useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch("/api/admin/settings")
        if (res.ok) {
          const json = await res.json()
          setSettings(json.settings)
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchSettings()
  }, [])

  const handleSave = async (section: string) => {
    if (!settings) return
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      })
      if (res.ok) {
        toast({ title: `${section} settings saved` })
      }
    } catch {
      toast({ title: "Failed to save settings", variant: "destructive" })
    }
  }

  const updateSettings = (path: string, value: unknown) => {
    if (!settings) return
    const newSettings = { ...settings }
    const keys = path.split(".")
    let current: Record<string, unknown> = newSettings as unknown as Record<string, unknown>
    for (let i = 0; i < keys.length - 1; i++) {
      current[keys[i]] = { ...(current[keys[i]] as Record<string, unknown>) }
      current = current[keys[i]] as Record<string, unknown>
    }
    current[keys[keys.length - 1]] = value
    setSettings(newSettings)
  }

  if (loading || !settings) {
    return <div className="animate-pulse space-y-4"><div className="h-64 bg-muted rounded" /></div>
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Admin Settings</h2>
        <p className="text-sm text-muted-foreground">Configure platform settings</p>
      </div>

      <Tabs defaultValue="platform">
        <TabsList className="flex-wrap">
          <TabsTrigger value="platform" className="gap-1.5"><Globe className="size-4" />Platform</TabsTrigger>
          <TabsTrigger value="emails" className="gap-1.5"><Mail className="size-4" />Emails</TabsTrigger>
          <TabsTrigger value="pricing" className="gap-1.5"><DollarSign className="size-4" />Pricing</TabsTrigger>
          <TabsTrigger value="notifications" className="gap-1.5"><Bell className="size-4" />Notifications</TabsTrigger>
          <TabsTrigger value="danger" className="gap-1.5"><AlertTriangle className="size-4" />Danger Zone</TabsTrigger>
        </TabsList>

        {/* Platform Tab */}
        <TabsContent value="platform" className="space-y-4 mt-4">
          <Card className="border-0 bg-gradient-to-br from-background to-muted/30 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2"><Globe className="size-5" />Platform Settings</CardTitle>
              <CardDescription>General platform configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><Label>Site Name</Label><Input value={settings.siteName} onChange={(e) => updateSettings("siteName", e.target.value)} /></div>
                <div><Label>Contact Email</Label><Input value={settings.contactEmail} onChange={(e) => updateSettings("contactEmail", e.target.value)} /></div>
              </div>
              <div><Label>Site Description</Label><Textarea value={settings.siteDescription} onChange={(e) => updateSettings("siteDescription", e.target.value)} rows={2} /></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><Label>Contact Phone</Label><Input value={settings.contactPhone} onChange={(e) => updateSettings("contactPhone", e.target.value)} /></div>
              </div>
              <Separator />
              <h4 className="font-medium">Social Media Links</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div><Label>Twitter</Label><Input value={settings.socialLinks.twitter} onChange={(e) => updateSettings("socialLinks.twitter", e.target.value)} /></div>
                <div><Label>LinkedIn</Label><Input value={settings.socialLinks.linkedin} onChange={(e) => updateSettings("socialLinks.linkedin", e.target.value)} /></div>
                <div><Label>GitHub</Label><Input value={settings.socialLinks.github} onChange={(e) => updateSettings("socialLinks.github", e.target.value)} /></div>
              </div>
              <Button onClick={() => handleSave("Platform")} className="bg-gradient-to-r from-[#5CBF00] to-[#2D4A2D] text-white">
                <Save className="size-4 mr-2" />Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Templates Tab */}
        <TabsContent value="emails" className="space-y-4 mt-4">
          <Card className="border-0 bg-gradient-to-br from-background to-muted/30 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2"><Mail className="size-5" />Email Templates</CardTitle>
              <CardDescription>Customize automated email content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Welcome Email</Label>
                <Textarea value={settings.emailTemplates.welcome} onChange={(e) => updateSettings("emailTemplates.welcome", e.target.value)} rows={3} />
              </div>
              <div>
                <Label>Appointment Reminder</Label>
                <Textarea value={settings.emailTemplates.appointmentReminder} onChange={(e) => updateSettings("emailTemplates.appointmentReminder", e.target.value)} rows={3} />
                <p className="text-xs text-muted-foreground mt-1">Variables: {`{name}, {consultant}, {time}`}</p>
              </div>
              <div>
                <Label>Payment Confirmation</Label>
                <Textarea value={settings.emailTemplates.paymentConfirmation} onChange={(e) => updateSettings("emailTemplates.paymentConfirmation", e.target.value)} rows={3} />
                <p className="text-xs text-muted-foreground mt-1">Variables: {`{name}, {amount}`}</p>
              </div>
              <div>
                <Label>Plan Expiry Notice</Label>
                <Textarea value={settings.emailTemplates.planExpiryNotice} onChange={(e) => updateSettings("emailTemplates.planExpiryNotice", e.target.value)} rows={3} />
                <p className="text-xs text-muted-foreground mt-1">Variables: {`{name}, {plan}, {date}`}</p>
              </div>
              <Button onClick={() => handleSave("Email")} className="bg-gradient-to-r from-[#5CBF00] to-[#2D4A2D] text-white">
                <Save className="size-4 mr-2" />Save Templates
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pricing Tab */}
        <TabsContent value="pricing" className="space-y-4 mt-4">
          <Card className="border-0 bg-gradient-to-br from-background to-muted/30 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2"><DollarSign className="size-5" />Pricing Configuration</CardTitle>
              <CardDescription>Manage plan names, prices, and features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { key: "free" as const, label: "Free Plan", color: "from-slate-500 to-slate-600" },
                { key: "growthPro" as const, label: "Growth Pro Plan", color: "from-[#5CBF00] to-[#2D4A2D]" },
                { key: "enterprise" as const, label: "Enterprise Plan", color: "from-[#8FBC8F] to-[#2D4A2D]" },
              ].map((plan) => (
                <div key={plan.key} className="p-4 rounded-lg border bg-muted/30 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${plan.color}`} />
                    <h4 className="font-medium">{plan.label}</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div><Label>Plan Name</Label><Input value={settings.pricing[plan.key].name} onChange={(e) => updateSettings(`pricing.${plan.key}.name`, e.target.value)} /></div>
                    <div><Label>Price (monthly)</Label><Input type="number" value={settings.pricing[plan.key].price} onChange={(e) => updateSettings(`pricing.${plan.key}.price`, parseFloat(e.target.value) || 0)} /></div>
                  </div>
                  <div>
                    <Label>Features (one per line)</Label>
                    <Textarea
                      value={settings.pricing[plan.key].features.join("\n")}
                      onChange={(e) => updateSettings(`pricing.${plan.key}.features`, e.target.value.split("\n"))}
                      rows={4}
                    />
                  </div>
                </div>
              ))}
              <Button onClick={() => handleSave("Pricing")} className="bg-gradient-to-r from-[#5CBF00] to-[#2D4A2D] text-white">
                <Save className="size-4 mr-2" />Save Pricing
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4 mt-4">
          <Card className="border-0 bg-gradient-to-br from-background to-muted/30 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2"><Bell className="size-5" />Notification Settings</CardTitle>
              <CardDescription>Configure which notifications you receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: "newUserSignup" as const, label: "New User Signup", description: "Get notified when a new user registers" },
                { key: "newAppointment" as const, label: "New Appointment", description: "Get notified when an appointment is booked" },
                { key: "paymentReceived" as const, label: "Payment Received", description: "Get notified when a payment is processed" },
                { key: "supportTicket" as const, label: "Support Ticket", description: "Get notified when a new support ticket is opened" },
              ].map((notif) => (
                <div key={notif.key} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium">{notif.label}</p>
                    <p className="text-sm text-muted-foreground">{notif.description}</p>
                  </div>
                  <Switch
                    checked={settings.notifications[notif.key]}
                    onCheckedChange={(checked) => updateSettings(`notifications.${notif.key}`, checked)}
                  />
                </div>
              ))}
              <Button onClick={() => handleSave("Notification")} className="bg-gradient-to-r from-[#5CBF00] to-[#2D4A2D] text-white">
                <Save className="size-4 mr-2" />Save Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Danger Zone Tab */}
        <TabsContent value="danger" className="space-y-4 mt-4">
          <Card className="border border-red-500/30 bg-red-500/5">
            <CardHeader>
              <CardTitle className="text-base text-red-500 flex items-center gap-2"><AlertTriangle className="size-5" />Danger Zone</CardTitle>
              <CardDescription>Irreversible actions — proceed with caution</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border border-red-500/20 bg-red-500/5">
                <div>
                  <p className="font-medium">Maintenance Mode</p>
                  <p className="text-sm text-muted-foreground">Temporarily disable the platform for maintenance</p>
                </div>
                <Switch
                  checked={maintenanceMode}
                  onCheckedChange={setMaintenanceMode}
                />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg border border-red-500/20 bg-red-500/5">
                <div>
                  <p className="font-medium">Reset Database</p>
                  <p className="text-sm text-muted-foreground">This will delete all data and re-seed the database</p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => toast({ title: "Database reset is disabled in demo mode" })}
                >
                  <Shield className="size-4 mr-2" />Reset
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
