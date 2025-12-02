"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"

export function DebugNotifications() {
  const { user } = useAuth()
  const [allNotifications, setAllNotifications] = useState([])
  const [userNotifications, setUserNotifications] = useState([])
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const loadNotifications = () => {
      try {
        // Get all notifications
        const storedNotifications = localStorage.getItem("notifications") || "[]"
        const notifications = JSON.parse(storedNotifications)
        setAllNotifications(notifications)

        // Filter for current user
        if (user?.id) {
          const forUser = notifications.filter((n) => n.user_id === user.id)
          setUserNotifications(forUser)
        }
      } catch (error) {
        console.error("Error loading notifications for debug:", error)
      }
    }

    loadNotifications()

    // Listen for notification updates
    const handleNotificationsUpdated = () => loadNotifications()
    window.addEventListener("notificationsUpdated", handleNotificationsUpdated)

    return () => {
      window.removeEventListener("notificationsUpdated", handleNotificationsUpdated)
    }
  }, [user])

  // Only show in development
  if (process.env.NODE_ENV !== "development" && !isVisible) {
    return null
  }

  return (
    <div className="fixed bottom-0 right-0 bg-white border border-gray-300 shadow-lg p-4 m-4 rounded-lg max-w-lg max-h-96 overflow-auto z-50">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold">Notification Debug</h3>
        <button onClick={() => setIsVisible(false)} className="text-gray-500 hover:text-gray-700">
          Close
        </button>
      </div>

      <div className="mb-4">
        <p className="text-sm font-medium">Current User: {user ? `${user.id} (${user.email})` : "Not logged in"}</p>
      </div>

      <div className="mb-4">
        <h4 className="font-medium text-sm mb-1">User Notifications ({userNotifications.length})</h4>
        {userNotifications.length === 0 ? (
          <p className="text-sm text-gray-500">No notifications for current user</p>
        ) : (
          <ul className="text-xs space-y-2">
            {userNotifications.map((n) => (
              <li key={n.id} className="border-b pb-1">
                <div className="font-medium">{n.title}</div>
                <div className="text-gray-600">{n.description}</div>
                <div className="text-gray-400 text-xs">
                  ID: {n.id} | Read: {n.is_read ? "Yes" : "No"} | Type: {n.type}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h4 className="font-medium text-sm mb-1">All Notifications ({allNotifications.length})</h4>
        <ul className="text-xs space-y-2">
          {allNotifications.map((n) => (
            <li key={n.id} className="border-b pb-1">
              <div className="font-medium">{n.title}</div>
              <div className="text-gray-600">
                User ID: {n.user_id} | {n.description}
              </div>
              <div className="text-gray-400 text-xs">
                ID: {n.id} | Read: {n.is_read ? "Yes" : "No"} | Type: {n.type}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4">
        <button
          onClick={() => {
            localStorage.removeItem("notifications")
            setAllNotifications([])
            setUserNotifications([])
            window.dispatchEvent(new CustomEvent("notificationsUpdated"))
          }}
          className="text-xs text-red-600 hover:text-red-800"
        >
          Clear All Notifications
        </button>
      </div>
    </div>
  )
}
