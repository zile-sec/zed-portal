"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Bell, CheckCircle, Clock, FileText, X } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export function NotificationPanel() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch notifications when the component mounts or user changes
  useEffect(() => {
    const fetchNotifications = () => {
      if (user?.id) {
        try {
          setIsLoading(true)

          // Get notifications from localStorage
          const storedNotifications = localStorage.getItem("notifications") || "[]"
          const allNotifications = JSON.parse(storedNotifications)

          // Filter notifications for the current user
          const userNotifications = allNotifications.filter((n) => n.user_id === user.id)

          console.log(`Found ${userNotifications.length} notifications for user ${user.id} (${user.email})`)

          setNotifications(userNotifications)
          setUnreadCount(userNotifications.filter((n) => !n.is_read).length)
        } catch (error) {
          console.error("Error fetching notifications:", error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchNotifications()

    // Set up an interval to refresh notifications
    const intervalId = setInterval(fetchNotifications, 5000) // Every 5 seconds

    // Listen for notification updates
    const handleNotificationsUpdated = () => {
      console.log("Notification update event received")
      fetchNotifications()
    }

    window.addEventListener("notificationsUpdated", handleNotificationsUpdated)

    return () => {
      clearInterval(intervalId)
      window.removeEventListener("notificationsUpdated", handleNotificationsUpdated)
    }
  }, [user])

  const markAsRead = async (id) => {
    try {
      // Get notifications from localStorage
      const storedNotifications = localStorage.getItem("notifications") || "[]"
      const allNotifications = JSON.parse(storedNotifications)

      // Mark the notification as read
      const updatedNotifications = allNotifications.map((n) => (n.id === id ? { ...n, is_read: true } : n))

      // Save back to localStorage
      localStorage.setItem("notifications", JSON.stringify(updatedNotifications))

      // Update the local state
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)))
      setUnreadCount((prev) => Math.max(0, prev - 1))

      // Dispatch event to update other components
      window.dispatchEvent(new CustomEvent("notificationsUpdated"))
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  const markAllAsRead = async () => {
    if (user?.id) {
      try {
        // Get notifications from localStorage
        const storedNotifications = localStorage.getItem("notifications") || "[]"
        const allNotifications = JSON.parse(storedNotifications)

        // Mark all notifications for this user as read
        const updatedNotifications = allNotifications.map((n) => (n.user_id === user.id ? { ...n, is_read: true } : n))

        // Save back to localStorage
        localStorage.setItem("notifications", JSON.stringify(updatedNotifications))

        // Update the local state
        setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
        setUnreadCount(0)

        // Dispatch event to update other components
        window.dispatchEvent(new CustomEvent("notificationsUpdated"))
      } catch (error) {
        console.error("Error marking all notifications as read:", error)
      }
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "approved":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "rejected":
        return <X className="h-5 w-5 text-red-500" />
      default:
        return <Bell className="h-5 w-5 text-blue-500" />
    }
  }

  // Format date safely
  const formatDate = (dateString) => {
    if (!dateString) return "Date not available"

    try {
      const date = new Date(dateString)
      return !isNaN(date.getTime()) ? date.toLocaleString() : "Date not available"
    } catch (e) {
      return "Date not available"
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
        aria-label="Notifications"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-md shadow-lg overflow-hidden z-50">
          <div className="flex justify-between items-center px-4 py-3 bg-gray-50 border-b">
            <h3 className="text-sm font-semibold text-gray-700">Notifications</h3>
            <div className="flex space-x-2">
              {unreadCount > 0 && (
                <button onClick={markAllAsRead} className="text-xs text-green-600 hover:text-green-800">
                  Mark all as read
                </button>
              )}
              <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="px-4 py-3 text-sm text-gray-500">Loading notifications...</div>
            ) : notifications.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500">No notifications</div>
            ) : (
              <ul>
                {notifications.map((notification) => (
                  <li
                    key={notification.id}
                    className={`px-4 py-3 border-b hover:bg-gray-50 ${!notification.is_read ? "bg-blue-50" : ""}`}
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mr-3">
                        {notification.type === "transaction" && getStatusIcon(notification.status || "pending")}
                        {notification.type === "document" && <FileText className="h-5 w-5 text-blue-500" />}
                        {notification.type === "system" && <Bell className="h-5 w-5 text-gray-500" />}
                        {notification.type === "urgent" && <Bell className="h-5 w-5 text-red-500" />}
                        {notification.type === "info" && <Bell className="h-5 w-5 text-blue-500" />}
                      </div>
                      <div className="flex-1">
                        <div
                          className="text-sm font-medium text-gray-900 cursor-pointer"
                          onClick={() => markAsRead(notification.id)}
                        >
                          {notification.title}
                        </div>
                        <p className="text-sm text-gray-600">{notification.description}</p>

                        {notification.details && (
                          <div className="mt-1 p-2 bg-gray-50 rounded-md text-xs">
                            {notification.details.split("\n").map((line, i) => (
                              <p key={i}>{line}</p>
                            ))}
                          </div>
                        )}

                        <div className="flex justify-between items-center mt-2">
                          <p className="text-xs text-gray-500">{formatDate(notification.created_at)}</p>

                          {notification.related_type === "transaction" && notification.related_id && (
                            <Link
                              href={`/transactions/${notification.related_id}`}
                              className="text-xs font-medium text-green-600 hover:text-green-500"
                              onClick={() => {
                                markAsRead(notification.id)
                                setIsOpen(false)
                              }}
                            >
                              View
                            </Link>
                          )}

                          {notification.related_type === "document" && notification.related_id && (
                            <Link
                              href={`/documents/${notification.related_id}`}
                              className="text-xs font-medium text-blue-600 hover:text-blue-500"
                              onClick={() => {
                                markAsRead(notification.id)
                                setIsOpen(false)
                              }}
                            >
                              View
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="px-4 py-2 bg-gray-50 text-xs text-center">
            <Link href="/notifications" className="text-green-600 hover:text-green-800">
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
