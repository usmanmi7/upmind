"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  HelpCircle,
  MessageSquareQuote,
  Eye,
  EyeOff,
  GripVertical,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface FAQItem {
  id: string
  question: string
  answer: string
  category: string | null
  order: number
  isPublished: boolean
}

interface TestimonialItem {
  id: string
  name: string
  role: string | null
  company: string | null
  content: string
  rating: number | null
  isPublished: boolean
  order: number
}

export default function AdminCMSPage() {
  const { toast } = useToast()
  const [faqs, setFaqs] = React.useState<FAQItem[]>([])
  const [testimonials, setTestimonials] = React.useState<TestimonialItem[]>([])
  const [loading, setLoading] = React.useState(true)

  // FAQ dialog
  const [faqDialogOpen, setFaqDialogOpen] = React.useState(false)
  const [faqForm, setFaqForm] = React.useState({ id: "", question: "", answer: "", category: "", order: 0, isPublished: true })
  const [isEditFaq, setIsEditFaq] = React.useState(false)

  // Testimonial dialog
  const [testimonialDialogOpen, setTestimonialDialogOpen] = React.useState(false)
  const [testimonialForm, setTestimonialForm] = React.useState({ id: "", name: "", role: "", company: "", content: "", rating: 5, isPublished: true, order: 0 })
  const [isEditTestimonial, setIsEditTestimonial] = React.useState(false)

  // Delete dialog
  const [deleteOpen, setDeleteOpen] = React.useState(false)
  const [deleteTarget, setDeleteTarget] = React.useState<{ type: string; id: string } | null>(null)

  const fetchContent = React.useCallback(async () => {
    try {
      const res = await fetch("/api/admin/cms?type=all")
      if (res.ok) {
        const json = await res.json()
        setFaqs(json.faqs || [])
        setTestimonials(json.testimonials || [])
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => { fetchContent() }, [fetchContent])

  // FAQ CRUD
  const handleFaqSave = async () => {
    try {
      const url = "/api/admin/cms"
      const method = isEditFaq ? "PUT" : "POST"
      const body = { contentType: "faq", ...faqForm }
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
      if (res.ok) {
        toast({ title: isEditFaq ? "FAQ updated" : "FAQ created" })
        setFaqDialogOpen(false)
        fetchContent()
      }
    } catch {
      toast({ title: "Failed to save FAQ", variant: "destructive" })
    }
  }

  // Testimonial CRUD
  const handleTestimonialSave = async () => {
    try {
      const url = "/api/admin/cms"
      const method = isEditTestimonial ? "PUT" : "POST"
      const body = { contentType: "testimonial", ...testimonialForm }
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
      if (res.ok) {
        toast({ title: isEditTestimonial ? "Testimonial updated" : "Testimonial created" })
        setTestimonialDialogOpen(false)
        fetchContent()
      }
    } catch {
      toast({ title: "Failed to save testimonial", variant: "destructive" })
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      const res = await fetch(`/api/admin/cms?type=${deleteTarget.type}&id=${deleteTarget.id}`, { method: "DELETE" })
      if (res.ok) {
        toast({ title: "Item deleted" })
        setDeleteOpen(false)
        fetchContent()
      }
    } catch {
      toast({ title: "Failed to delete", variant: "destructive" })
    }
  }

  const publishedFaqs = faqs.filter((f) => f.isPublished).length
  const publishedTestimonials = testimonials.filter((t) => t.isPublished).length

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Content Management</h2>
        <p className="text-sm text-muted-foreground">Manage FAQs and testimonials shown on your website</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="border-0 bg-gradient-to-br from-background to-muted/30 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#3B82F6] to-[#1E3A8A] flex items-center justify-center shrink-0">
              <HelpCircle className="size-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold">{faqs.length}</p>
              <p className="text-xs text-muted-foreground">Total FAQs</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 bg-gradient-to-br from-background to-muted/30 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shrink-0">
              <Eye className="size-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold">{publishedFaqs}</p>
              <p className="text-xs text-muted-foreground">Published FAQs</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 bg-gradient-to-br from-background to-muted/30 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#1E3A8A] to-[#93C5FD] flex items-center justify-center shrink-0">
              <MessageSquareQuote className="size-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold">{testimonials.length}</p>
              <p className="text-xs text-muted-foreground">Total Testimonials</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 bg-gradient-to-br from-background to-muted/30 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shrink-0">
              <Eye className="size-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold">{publishedTestimonials}</p>
              <p className="text-xs text-muted-foreground">Published Testimonials</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="faqs">
        <TabsList>
          <TabsTrigger value="faqs" className="gap-1.5"><HelpCircle className="size-4" />FAQs</TabsTrigger>
          <TabsTrigger value="testimonials" className="gap-1.5"><MessageSquareQuote className="size-4" />Testimonials</TabsTrigger>
        </TabsList>

        {/* FAQS TAB */}
        <TabsContent value="faqs" className="space-y-4 mt-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              These FAQs appear on the <a href="/faq" target="_blank" className="text-[#3B82F6] hover:underline">public FAQ page</a>
            </p>
            <Button
              onClick={() => {
                setIsEditFaq(false)
                setFaqForm({ id: "", question: "", answer: "", category: "", order: faqs.length, isPublished: true })
                setFaqDialogOpen(true)
              }}
              className="bg-gradient-to-r from-[#5CBF00] to-[#1E3A8A] text-white"
            >
              <Plus className="size-4 mr-2" />New FAQ
            </Button>
          </div>
          <Card className="border-0 bg-gradient-to-br from-background to-muted/30 shadow-sm">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10">#</TableHead>
                    <TableHead>Question</TableHead>
                    <TableHead className="hidden md:table-cell">Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <TableRow key={i}><TableCell colSpan={5} className="h-16"><div className="animate-pulse bg-muted rounded h-8" /></TableCell></TableRow>
                    ))
                  ) : faqs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No FAQs yet. Create your first FAQ to display on the website.
                      </TableCell>
                    </TableRow>
                  ) : faqs.map((faq) => (
                    <TableRow key={faq.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <GripVertical className="size-3 text-muted-foreground/40" />
                          <span className="text-xs text-muted-foreground">{faq.order}</span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[400px]">
                        <p className="text-sm font-medium truncate">{faq.question}</p>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">{faq.answer}</p>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="secondary" className="text-xs">{faq.category || "General"}</Badge>
                      </TableCell>
                      <TableCell>
                        {faq.isPublished ? (
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30"><Eye className="size-3 mr-1" />Live</Badge>
                        ) : (
                          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30"><EyeOff className="size-3 mr-1" />Draft</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="size-8"><MoreHorizontal className="size-4" /></Button></DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => { setIsEditFaq(true); setFaqForm({ id: faq.id, question: faq.question, answer: faq.answer, category: faq.category || "", order: faq.order, isPublished: faq.isPublished }); setFaqDialogOpen(true) }}>
                              <Edit className="size-4 mr-2" />Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive" onClick={() => { setDeleteTarget({ type: "faq", id: faq.id }); setDeleteOpen(true) }}>
                              <Trash2 className="size-4 mr-2" />Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TESTIMONIALS TAB */}
        <TabsContent value="testimonials" className="space-y-4 mt-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              These testimonials appear on the <a href="/success-stories" target="_blank" className="text-[#3B82F6] hover:underline">Success Stories page</a>
            </p>
            <Button
              onClick={() => {
                setIsEditTestimonial(false)
                setTestimonialForm({ id: "", name: "", role: "", company: "", content: "", rating: 5, isPublished: true, order: testimonials.length })
                setTestimonialDialogOpen(true)
              }}
              className="bg-gradient-to-r from-[#5CBF00] to-[#1E3A8A] text-white"
            >
              <Plus className="size-4 mr-2" />New Testimonial
            </Button>
          </div>
          <Card className="border-0 bg-gradient-to-br from-background to-muted/30 shadow-sm">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden md:table-cell">Company</TableHead>
                    <TableHead className="hidden lg:table-cell">Rating</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <TableRow key={i}><TableCell colSpan={5} className="h-16"><div className="animate-pulse bg-muted rounded h-8" /></TableCell></TableRow>
                    ))
                  ) : testimonials.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No testimonials yet. Add testimonials to showcase on the Success Stories page.
                      </TableCell>
                    </TableRow>
                  ) : testimonials.map((t) => (
                    <TableRow key={t.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium">{t.name}</p>
                          <p className="text-xs text-muted-foreground">{t.role || ""} {t.company ? `at ${t.company}` : ""}</p>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm">{t.company || "—"}</TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="flex items-center gap-1">
                          <span className="text-sm">{"★".repeat(t.rating || 0)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {t.isPublished ? (
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30"><Eye className="size-3 mr-1" />Live</Badge>
                        ) : (
                          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30"><EyeOff className="size-3 mr-1" />Draft</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="size-8"><MoreHorizontal className="size-4" /></Button></DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => { setIsEditTestimonial(true); setTestimonialForm({ id: t.id, name: t.name, role: t.role || "", company: t.company || "", content: t.content, rating: t.rating || 5, isPublished: t.isPublished, order: t.order }); setTestimonialDialogOpen(true) }}>
                              <Edit className="size-4 mr-2" />Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive" onClick={() => { setDeleteTarget({ type: "testimonial", id: t.id }); setDeleteOpen(true) }}>
                              <Trash2 className="size-4 mr-2" />Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* FAQ Dialog */}
      <Dialog open={faqDialogOpen} onOpenChange={setFaqDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{isEditFaq ? "Edit" : "New"} FAQ</DialogTitle>
            <DialogDescription>{isEditFaq ? "Update" : "Create"} a frequently asked question for the website</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div><Label>Question</Label><Input value={faqForm.question} onChange={(e) => setFaqForm((p) => ({ ...p, question: e.target.value }))} placeholder="e.g., What is Enginest?" /></div>
            <div><Label>Answer</Label><Textarea value={faqForm.answer} onChange={(e) => setFaqForm((p) => ({ ...p, answer: e.target.value }))} rows={4} placeholder="Provide a clear answer..." /></div>
            <div><Label>Category</Label><Input value={faqForm.category} onChange={(e) => setFaqForm((p) => ({ ...p, category: e.target.value }))} placeholder="e.g., General, Pricing, Consulting" /></div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <Label>Published</Label>
                <p className="text-xs text-muted-foreground">Make this FAQ visible on the website</p>
              </div>
              <Switch checked={faqForm.isPublished} onCheckedChange={(c) => setFaqForm((p) => ({ ...p, isPublished: c }))} />
            </div>
            <Button onClick={handleFaqSave} className="w-full bg-gradient-to-r from-[#5CBF00] to-[#1E3A8A] text-white">
              {isEditFaq ? "Update" : "Create"} FAQ
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Testimonial Dialog */}
      <Dialog open={testimonialDialogOpen} onOpenChange={setTestimonialDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{isEditTestimonial ? "Edit" : "New"} Testimonial</DialogTitle>
            <DialogDescription>{isEditTestimonial ? "Update" : "Create"} a testimonial for the Success Stories page</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div><Label>Name</Label><Input value={testimonialForm.name} onChange={(e) => setTestimonialForm((p) => ({ ...p, name: e.target.value }))} placeholder="e.g., Sarah Chen" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Role</Label><Input value={testimonialForm.role} onChange={(e) => setTestimonialForm((p) => ({ ...p, role: e.target.value }))} placeholder="e.g., CEO" /></div>
              <div><Label>Company</Label><Input value={testimonialForm.company} onChange={(e) => setTestimonialForm((p) => ({ ...p, company: e.target.value }))} placeholder="e.g., TechFlow" /></div>
            </div>
            <div><Label>Content</Label><Textarea value={testimonialForm.content} onChange={(e) => setTestimonialForm((p) => ({ ...p, content: e.target.value }))} rows={3} placeholder="The testimonial quote..." /></div>
            <div><Label>Rating (1-5)</Label><Input type="number" min={1} max={5} value={testimonialForm.rating} onChange={(e) => setTestimonialForm((p) => ({ ...p, rating: parseInt(e.target.value) || 5 }))} /></div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <Label>Published</Label>
                <p className="text-xs text-muted-foreground">Show on the Success Stories page</p>
              </div>
              <Switch checked={testimonialForm.isPublished} onCheckedChange={(c) => setTestimonialForm((p) => ({ ...p, isPublished: c }))} />
            </div>
            <Button onClick={handleTestimonialSave} className="w-full bg-gradient-to-r from-[#5CBF00] to-[#1E3A8A] text-white">
              {isEditTestimonial ? "Update" : "Create"} Testimonial
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Item</DialogTitle>
            <DialogDescription>Are you sure? This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
