"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { generateId } from "./utils"
import { useAuth } from "@/lib/auth-context"

export type Notification = {
  id: string
  user_id: number
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  read: boolean
  timestamp: string
  link?: string
}

type NotificationContextType = {
  notifications: Notification[]
  unreadCount: number
  addNotification: (notification: Omit<Notification, "id" | "read" | "timestamp">) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  getNotificationsForUser: (userId: number) => Notification[]
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const { user } = useAuth()

  // Load notifications from localStorage on mount
  useEffect(() => {
    try {
      const storedNotifications = localStorage.getItem("notifications")
      if (storedNotifications) {
        setNotifications(JSON.parse(storedNotifications))
      }
    } catch (error) {
      console.error("Error loading notifications from localStorage:", error)
    }
  }, [])

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("notifications", JSON.stringify(notifications))
    } catch (error) {
      console.error("Error saving notifications to localStorage:", error)
    }
  }, [notifications])

  // Add an effect to listen for notification updates
  useEffect(() => {
    const handleNotificationsUpdated = async () => {
      if (user?.id) {
        try {
          const response = await fetch(`/api/notifications?user_id=${user.id}`)
          if (response.ok) {
            const data = await response.json()
            setNotifications(data || [])
          }
        } catch (error) {
          console.error("Error fetching notifications:", error)
        }
      }
    }

    window.addEventListener("notificationsUpdated", handleNotificationsUpdated)

    return () => {
      window.removeEventListener("notificationsUpdated", handleNotificationsUpdated)
    }
  }, [user])

  const unreadCount = notifications.filter((notification) => !notification.read).length

  const addNotification = (notification: Omit<Notification, "id" | "read" | "timestamp">) => {
    const newNotification: Notification = {
      ...notification,
      id: generateId(),
      read: false,
      timestamp: new Date().toISOString(),
    }

    setNotifications((prevNotifications) => [...prevNotifications, newNotification])
  }

  const markAsRead = (id: string) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      ),
    )
  }

  const markAllAsRead = () => {
    setNotifications((prevNotifications) => prevNotifications.map((notification) => ({ ...notification, read: true })))
  }

  const getNotificationsForUser = (userId: number) => {
    return notifications.filter((notification) => notification.user_id === userId)
  }

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        getNotificationsForUser,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}
