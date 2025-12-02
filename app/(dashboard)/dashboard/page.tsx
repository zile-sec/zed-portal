"use client"

import { useState, useEffect } from "react"
import { AlertCircle, RefreshCw } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { DashboardClient } from "./client"
import { RecentActivityList } from "@/components/recent-activity-list"
import { DebugPanel } from "@/components/debug-panel"

export default function Dashboard() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [notifications, setNotifications] = useState([])
  const [pendingTransactions, setPendingTransactions] = useState([])
  const [recentTransactions, setRecentTransactions] = useState([])
  const [pendingDocuments, setPendingDocuments] = useState([])
  const [showTransactionForm, setShowTransactionForm] = useState(false)
  const [receivedTransactions, setReceivedTransactions] = useState([])
  const [activities, setActivities] = useState([])

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Load activities from localStorage
      try {
        const storedActivities = localStorage.getItem("activities")
        if (storedActivities) {
          const parsedActivities = JSON.parse(storedActivities)

          // Filter activities visible to the current user
          const userActivities = parsedActivities.filter(
            (activity) =>
              activity.user_id === user?.id || (activity.visible_to && activity.visible_to.includes(user?.id)),
          )

          // Sort by date (newest first)
          userActivities.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

          setActivities(userActivities)
        } else {
          setActivities([])
        }
      } catch (error) {
        console.error("Error loading activities:", error)
        setActivities([])
      }

      // Load notifications from localStorage
      try {
        const storedNotifications = localStorage.getItem("notifications")
        if (storedNotifications) {
          const parsedNotifications = JSON.parse(storedNotifications)

          // Filter notifications for the current user
          const userNotifications = parsedNotifications.filter((notification) => notification.user_id === user?.id)

          // Sort by date (newest first)
          userNotifications.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

          setNotifications(userNotifications)
        } else {
          setNotifications([])
        }
      } catch (error) {
        console.error("Error loading notifications:", error)
        setNotifications([])
      }

      // Load transactions from localStorage
      try {
        const storedTransactions = localStorage.getItem("transactions")
        if (storedTransactions) {
          const parsedTransactions = JSON.parse(storedTransactions)

          // Filter pending transactions
          const pending = parsedTransactions.filter((t) => t.status === "pending")

          // Filter approved transactions
          const approved = parsedTransactions.filter((t) => t.status === "approved")

          if (user?.department !== "admin") {
            // For non-admin users, separate transactions they sent vs. received
            const sent = pending.filter(
              (t) => t.department === user?.department || t.sender_department === user?.department,
            )

            const received = pending.filter(
              (t) =>
                t.recipient_department === user?.department &&
                t.department !== user?.department &&
                t.sender_department !== user?.department,
            )

            setPendingTransactions(sent)
            setReceivedTransactions(received)
            setRecentTransactions(
              approved.filter(
                (t) =>
                  t.department === user?.department ||
                  t.sender_department === user?.department ||
                  t.recipient_department === user?.department,
              ),
            )
          } else {
            // For admin, all pending transactions need approval
            setPendingTransactions(pending)
            setRecentTransactions(approved)
          }
        } else {
          setPendingTransactions([])
          setReceivedTransactions([])
          setRecentTransactions([])
        }
      } catch (error) {
        console.error("Error loading transactions:", error)
        setPendingTransactions([])
        setReceivedTransactions([])
        setRecentTransactions([])
      }

      // Mock pending documents
      setPendingDocuments([
        {
          id: "d1",
          title: "Land Title Transfer",
          department: "Lands",
          priority: "high",
          updated_at: new Date().toISOString(),
        },
        {
          id: "d2",
          title: "Budget Approval",
          department: "Finance",
          priority: "medium",
          updated_at: new Date().toISOString(),
        },
      ])
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (user?.id) {
      fetchDashboardData()
    } else {
      setIsLoading(false)
    }

    // Set up event listener for storage changes
    const handleStorageChange = () => {
      fetchDashboardData()
    }

    window.addEventListener("storage", handleStorageChange)

    // Custom event for local updates
    window.addEventListener("localDataChanged", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("localDataChanged", handleStorageChange)
    }
  }, [user?.id])

  const handleTransactionSuccess = (transaction) => {
    // Add the new transaction to the pending transactions list
    setPendingTransactions((prev) => [transaction, ...prev])
    setShowTransactionForm(false)

    // Refresh data
    fetchDashboardData()

    // Dispatch event to notify other components
    window.dispatchEvent(new Event("localDataChanged"))
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full mt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full mt-20">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Dashboard</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={fetchDashboardData}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <DashboardClient
        pendingTransactions={pendingTransactions}
        recentActivity={activities}
        notifications={notifications}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="md:col-span-2">
          {/* Other dashboard content */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Dashboard Content</h2>
            <p>Welcome to your dashboard. Here you can manage transactions and documents.</p>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
            <RecentActivityList limit={5} />
          </div>
        </div>
      </div>

      {/* Debug panel */}
      <DebugPanel />
    </div>
  )
}
