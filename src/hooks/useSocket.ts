"use client"

import { useEffect, useRef, useCallback, useState } from "react"
import { useSession } from "next-auth/react"
import { io, Socket } from "socket.io-client"

interface UseSocketOptions {
  autoConnect?: boolean
}

interface UseSocketReturn {
  isConnected: boolean
  onlineUsers: string[]
  joinRoom: (userId1: string, userId2: string) => void
  leaveRoom: (userId1: string, userId2: string) => void
  sendMessage: (data: {
    senderId: string
    receiverId: string
    content: string
  }) => void
  emitTyping: (userId1: string, userId2: string, isTyping: boolean) => void
  markAsRead: (userId1: string, userId2: string, messageIds?: string[]) => void
  onNewMessage: (callback: (data: NewMessageData) => void) => () => void
  onMessageNotification: (callback: (data: MessageNotificationData) => void) => () => void
  onUserTyping: (callback: (data: TypingData) => void) => () => void
  onMessagesRead: (callback: (data: MessagesReadData) => void) => () => void
  onUserOnline: (callback: (data: { userId: string }) => void) => () => void
  onUserOffline: (callback: (data: { userId: string }) => void) => () => void
}

export interface NewMessageData {
  senderId: string
  receiverId: string
  content: string
  messageId: string
  timestamp: string
  roomId: string
}

export interface MessageNotificationData {
  senderId: string
  content: string
  timestamp: string
}

export interface TypingData {
  userId: string
  isTyping: boolean
}

export interface MessagesReadData {
  readBy: string
  messageIds?: string[]
}

export function useSocket(options: UseSocketOptions = {}): UseSocketReturn {
  const { autoConnect = true } = options
  const { data: session } = useSession()
  const socketRef = useRef<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [onlineUsers, setOnlineUsers] = useState<string[]>([])

  useEffect(() => {
    if (!session?.user?.id || !autoConnect) return

    const socketIo = io("/?XTransformPort=3003", {
      auth: {
        userId: session.user.id,
      },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    })

    socketIo.on("connect", () => {
      setIsConnected(true)
    })

    socketIo.on("disconnect", () => {
      setIsConnected(false)
    })

    socketIo.on("online-users", (data: { users: string[] }) => {
      setOnlineUsers(data.users)
    })

    socketIo.on("user-online", (data: { userId: string }) => {
      setOnlineUsers((prev) =>
        prev.includes(data.userId) ? prev : [...prev, data.userId]
      )
    })

    socketIo.on("user-offline", (data: { userId: string }) => {
      setOnlineUsers((prev) => prev.filter((id) => id !== data.userId))
    })

    socketRef.current = socketIo

    return () => {
      socketIo.disconnect()
      socketRef.current = null
      setIsConnected(false)
    }
  }, [session?.user?.id, autoConnect])

  const joinRoom = useCallback(
    (userId1: string, userId2: string) => {
      socketRef.current?.emit("join-room", { userId1, userId2 })
    },
    []
  )

  const leaveRoom = useCallback(
    (userId1: string, userId2: string) => {
      socketRef.current?.emit("leave-room", { userId1, userId2 })
    },
    []
  )

  const sendMessage = useCallback(
    (data: { senderId: string; receiverId: string; content: string }) => {
      socketRef.current?.emit("send-message", data)
    },
    []
  )

  const emitTyping = useCallback(
    (userId1: string, userId2: string, isTyping: boolean) => {
      socketRef.current?.emit("typing", { userId1, userId2, isTyping })
    },
    []
  )

  const markAsRead = useCallback(
    (userId1: string, userId2: string, messageIds?: string[]) => {
      socketRef.current?.emit("message-read", { userId1, userId2, messageIds })
    },
    []
  )

  const onNewMessage = useCallback(
    (callback: (data: NewMessageData) => void) => {
      const handler = (data: NewMessageData) => callback(data)
      socketRef.current?.on("new-message", handler)
      return () => {
        socketRef.current?.off("new-message", handler)
      }
    },
    []
  )

  const onMessageNotification = useCallback(
    (callback: (data: MessageNotificationData) => void) => {
      const handler = (data: MessageNotificationData) => callback(data)
      socketRef.current?.on("message-notification", handler)
      return () => {
        socketRef.current?.off("message-notification", handler)
      }
    },
    []
  )

  const onUserTyping = useCallback(
    (callback: (data: TypingData) => void) => {
      const handler = (data: TypingData) => callback(data)
      socketRef.current?.on("user-typing", handler)
      return () => {
        socketRef.current?.off("user-typing", handler)
      }
    },
    []
  )

  const onMessagesRead = useCallback(
    (callback: (data: MessagesReadData) => void) => {
      const handler = (data: MessagesReadData) => callback(data)
      socketRef.current?.on("messages-read", handler)
      return () => {
        socketRef.current?.off("messages-read", handler)
      }
    },
    []
  )

  const onUserOnline = useCallback(
    (callback: (data: { userId: string }) => void) => {
      const handler = (data: { userId: string }) => callback(data)
      socketRef.current?.on("user-online", handler)
      return () => {
        socketRef.current?.off("user-online", handler)
      }
    },
    []
  )

  const onUserOffline = useCallback(
    (callback: (data: { userId: string }) => void) => {
      const handler = (data: { userId: string }) => callback(data)
      socketRef.current?.on("user-offline", handler)
      return () => {
        socketRef.current?.off("user-offline", handler)
      }
    },
    []
  )

  return {
    isConnected,
    onlineUsers,
    joinRoom,
    leaveRoom,
    sendMessage,
    emitTyping,
    markAsRead,
    onNewMessage,
    onMessageNotification,
    onUserTyping,
    onMessagesRead,
    onUserOnline,
    onUserOffline,
  }
}
