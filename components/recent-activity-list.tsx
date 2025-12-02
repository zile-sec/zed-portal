"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { useActivity } from "@/lib/activity-context"
import { Clock, CheckCircle, XCircle, FileText, ArrowRight, AlertCircle, Loader2 } from "lucide-react"
import Link from "next/link"

export function RecentActivityList({ limit = 5 }) {
  const { user } = useAuth()
  const { getActivitiesForUser } = useActivity()
  const [activities, setActivities] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user) {
      // Get activities for the current user
      const userActivities = getActivitiesForUser(user.id)
      setActivities(userActivities.slice(0, limit))
      setIsLoading(false)
    }

    // Listen for activity updates
    const handleActivityUpdate = () => {
      if (user) {
        const userActivities = getActivitiesForUser(user.id)
        setActivities(userActivities.slice(0, limit))
      }
    }

    window.addEventListener("activitiesUpdated", handleActivityUpdate)
    window.addEventListener("transactionUpdated", handleActivityUpdate)

    return () => {
      window.removeEventListener("activitiesUpdated", handleActivityUpdate)
      window.removeEventListener("transactionUpdated", handleActivityUpdate)
    }
  }, [user, getActivitiesForUser, limit])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 text-green-500 animate-spin" />
      </div>
    )
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500">
        <Clock className="mx-auto h-12 w-12 text-gray-400 mb-3" />
        <p>No recent activity</p>
      </div>
    )
  }

  // Helper function to get the appropriate icon for an activity
  const getActivityIcon = (type) => {
    if (type === "transaction_approved") return <CheckCircle className="h-5 w-5 text-green-500" />
    if (type === "transaction_rejected") return <XCircle className="h-5 w-5 text-red-500" />
    if (type === "transaction_created") return <FileText className="h-5 w-5 text-blue-500" />
    if (type === "transaction_pending") return <AlertCircle className="h-5 w-5 text-yellow-500" />
    if (type === "transaction_received") return <ArrowRight className="h-5 w-5 text-purple-500" />
    return <Clock className="h-5 w-5 text-gray-500" />
  }

  // Helper function to extract transaction ID from metadata
  const getTransactionId = (activity) => {
    if (activity.reference_type === "transaction" && activity.reference_id) {
      return activity.reference_id
    }

    if (activity.metadata && activity.metadata.transaction_id) {
      return activity.metadata.transaction_id
    }

    return null
  }

  // Helper function to safely format dates
  const safeFormatDate = (dateString) => {
    if (!dateString) return "Date not available"

    try {
      // Check for both timestamp and created_at fields
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return "Invalid date"
      return date.toLocaleString()
    } catch (error) {
      console.error("Error formatting date:", error)
      return "Date error"
    }
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => {
        const transactionId = getTransactionId(activity)
        // Check for both timestamp and created_at fields
        const dateValue = activity.timestamp || activity.created_at

        return (
          <div key={activity.id} className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-0.5">{getActivityIcon(activity.type || activity.action)}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">{activity.description || activity.details}</p>
              <p className="text-xs text-gray-500 mt-0.5">{safeFormatDate(dateValue)}</p>
              {transactionId && (
                <Link
                  href={`/transactions/${transactionId}`}
                  className="text-xs text-green-600 hover:text-green-800 mt-1 inline-block"
                >
                  View Transaction
                </Link>
              )}
            </div>
          </div>
        )
      })}

      {activities.length >= limit && (
        <div className="pt-2 text-center">
          <Link href="/activity" className="text-sm text-green-600 hover:text-green-800">
            View All Activity
          </Link>
        </div>
      )}
    </div>
  )
}
