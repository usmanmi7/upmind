"use client"

import * as React from "react"
import Link from "next/link"
import { MessageSquare, Plus, Trash2, Pencil, Check, X, Sparkles, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export interface ChatSummary {
  id: string
  title: string
  updatedAt: string
  messageCount?: number
}

interface ChatSidebarProps {
  chats: ChatSummary[]
  activeChatId: string | null
  isAuthenticated: boolean
  loading: boolean
  onSelect: (id: string) => void
  onNew: () => void
  onRename: (id: string, title: string) => void
  onDelete: (id: string) => void
}

function relativeTime(dateStr: string): string {
  const d = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const sec = Math.floor(diffMs / 1000)
  if (sec < 60) return "just now"
  const min = Math.floor(sec / 60)
  if (min < 60) return `${min}m ago`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr}h ago`
  const day = Math.floor(hr / 24)
  if (day < 7) return `${day}d ago`
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" })
}

/**
 * Inner content of the chat sidebar — used by both the desktop sticky aside
 * and the mobile Sheet drawer. Stateless; all behavior comes from props.
 */
export function ChatSidebarContent({
  chats,
  activeChatId,
  isAuthenticated,
  loading,
  onSelect,
  onNew,
  onRename,
  onDelete,
}: ChatSidebarProps) {
  return (
    <div className="flex flex-col h-full min-w-0 overflow-hidden">
      {/* Header: brand + New chat */}
      <div className="px-4 pt-4 pb-3 space-y-3 shrink-0">
        <Link href="/ai-assistant" className="flex items-center gap-2 text-sm font-semibold min-w-0">
          <span className="size-7 rounded-lg bg-[#3B82F6]/15 text-[#3B82F6] grid place-items-center shrink-0">
            <Sparkles className="size-4" />
          </span>
          <span className="text-foreground truncate">Upmind AI</span>
        </Link>

        <Button
          onClick={onNew}
          variant="outline"
          className="w-full justify-start gap-2 rounded-lg border-black/10 dark:border-white/15 hover:border-[#3B82F6]/50 hover:text-[#3B82F6] hover:bg-[#3B82F6]/5"
        >
          <Plus className="size-4 shrink-0" />
          <span className="truncate">New chat</span>
        </Button>
      </div>

      {/* Auth banner */}
      {!isAuthenticated && (
        <div className="mx-4 mb-2 px-3 py-2 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-xs text-amber-800 dark:text-amber-200 flex items-start gap-2 shrink-0">
          <LogIn className="size-3.5 mt-0.5 shrink-0" />
          <span className="min-w-0 break-words">
            Chats are kept only for this session.{" "}
            <Link href="/auth/login" className="underline font-medium whitespace-nowrap">
              Sign in
            </Link>{" "}
            to save them.
          </span>
        </div>
      )}

      {/* Chat list header */}
      <div className="px-2 pb-2 shrink-0">
        <div className="px-2 py-1.5 text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
          {isAuthenticated ? "Your chats" : "Session chats"}
        </div>
      </div>

      <ScrollArea className="flex-1 px-2 min-w-0">
        {loading ? (
          <div className="px-2 py-4 space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 rounded-lg bg-muted/40 animate-pulse" />
            ))}
          </div>
        ) : chats.length === 0 ? (
          <div className="px-3 py-8 text-center text-sm text-muted-foreground">
            <MessageSquare className="size-5 mx-auto mb-2 opacity-40" />
            No chats yet.
            <br />
            Start a new one above.
          </div>
        ) : (
          <ul className="space-y-0.5 px-1 pb-3">
            {chats.map((chat) => (
              <ChatRow
                key={chat.id}
                chat={chat}
                active={chat.id === activeChatId}
                onSelect={() => onSelect(chat.id)}
                onRename={(t) => onRename(chat.id, t)}
                onDelete={() => onDelete(chat.id)}
              />
            ))}
          </ul>
        )}
      </ScrollArea>
    </div>
  )
}

interface ChatRowProps {
  chat: ChatSummary
  active: boolean
  onSelect: () => void
  onRename: (title: string) => void
  onDelete: () => void
}

function ChatRow({ chat, active, onSelect, onRename, onDelete }: ChatRowProps) {
  const [editing, setEditing] = React.useState(false)
  const [draft, setDraft] = React.useState(chat.title)

  React.useEffect(() => {
    if (!editing) setDraft(chat.title)
  }, [chat.title, editing])

  const commit = () => {
    const t = draft.trim()
    if (t && t !== chat.title) onRename(t)
    setEditing(false)
  }

  if (editing) {
    return (
      <li className="px-1 py-1 flex items-center gap-1">
        <Input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") commit()
            if (e.key === "Escape") setEditing(false)
          }}
          className="h-8 text-sm rounded-md min-w-0 flex-1"
        />
        <Button size="icon" variant="ghost" className="size-8 shrink-0" onClick={commit}>
          <Check className="size-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="size-8 shrink-0"
          onClick={() => setEditing(false)}
        >
          <X className="size-4" />
        </Button>
      </li>
    )
  }

  return (
    <li>
      <div
        role="button"
        tabIndex={0}
        onClick={onSelect}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            onSelect()
          }
        }}
        className={cn(
          "group flex items-center gap-2 px-2.5 py-2 rounded-lg cursor-pointer text-sm transition-colors overflow-hidden",
          active
            ? "bg-[#3B82F6]/10 text-foreground"
            : "hover:bg-muted/60 text-muted-foreground hover:text-foreground"
        )}
      >
        <MessageSquare
          className={cn(
            "size-4 shrink-0",
            active ? "text-[#3B82F6]" : "text-muted-foreground/70"
          )}
        />
        <div className="flex-1 min-w-0 overflow-hidden">
          <div className="truncate font-medium leading-tight" title={chat.title}>
            {chat.title}
          </div>
          <div className="text-[10.5px] text-muted-foreground/80 leading-tight mt-0.5 truncate">
            {relativeTime(chat.updatedAt)}
            {typeof chat.messageCount === "number" && chat.messageCount > 0
              ? ` · ${chat.messageCount} msg`
              : ""}
          </div>
        </div>

        {/* Hover actions */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                onClick={(e) => e.stopPropagation()}
                className="size-6 grid place-items-center rounded hover:bg-background/80 text-muted-foreground"
                aria-label="Chat options"
              >
                <Pencil className="size-3.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  setEditing(true)
                }}
              >
                <Pencil className="size-3.5 mr-2" /> Rename
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete()
                }}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="size-3.5 mr-2" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </li>
  )
}
