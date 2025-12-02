"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"

type Activity = {
  id: string
  user_id: number
  type?: string
  action?: string
  description?: string
  details?: string
  timestamp?: string
  created_at?: string
  reference_id?: string
  reference_type?: string
  visible_to?: number[]
  metadata?: Record<string, any>
}

type ActivityContextType = {
  activities: Activity[]
  addActivity: (activity: Omit<Activity, "id" | "timestamp" | "created_at">) => void
  getActivitiesForUser: (userId: number) => Activity[]
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined)

// Generate a unique ID for activities
const generateId = () => {
  return `act-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

export function ActivityProvider({ children }: { children: ReactNode }) {
  const [activities, setActivities] = useState<Activity[]>([])

  // Load activities from localStorage on mount
  useEffect(() => {
    try {
      const storedActivities = localStorage.getItem("activities")
      if (storedActivities) {
        setActivities(JSON.parse(storedActivities))
      }
    } catch (error) {
      console.error("Error loading activities from localStorage:", error)
    }
  }, [])

  // Add a new activity
  const addActivity = useCallback((activity: Omit<Activity, "id" | "timestamp" | "created_at">) => {
    const now = new Date().toISOString()
    const newActivity: Activity = {
      ...activity,
      id: generateId(),
      timestamp: now,
      created_at: now,
    }

    setActivities((prevActivities) => {
      const updatedActivities = [newActivity, ...prevActivities]

      // Save to localStorage
      try {
        localStorage.setItem("activities", JSON.stringify(updatedActivities))
      } catch (error) {
        console.error("Error saving activities to localStorage:", error)
      }

      // Dispatch event to notify other components
      window.dispatchEvent(new CustomEvent("activitiesUpdated"))

      return updatedActivities
    })
  }, [])

  // Get activities for a specific user
  const getActivitiesForUser = useCallback(
    (userId: number) => {
      return activities.filter((activity) => {
        // If visible_to is defined, check if the user is in the list
        if (activity.visible_to) {
          return activity.visible_to.includes(userId)
        }
        // If visible_to is not defined, show to the activity creator only
        return activity.user_id === userId
      })
    },
    [activities],
  )

  // Listen for activities updated events from other components
  useEffect(() => {
    const handleActivitiesUpdated = () => {
      try {
        const storedActivities = localStorage.getItem("activities")
        if (storedActivities) {
          setActivities(JSON.parse(storedActivities))
        }
      } catch (error) {
        console.error("Error loading activities from localStorage:", error)
      }
    }

    window.addEventListener("activitiesUpdated", handleActivitiesUpdated)
    return () => {
      window.removeEventListener("activitiesUpdated", handleActivitiesUpdated)
    }
  }, [])

  return (
    <ActivityContext.Provider
      value={{
        activities,
        addActivity,
        getActivitiesForUser,
      }}
    >
      {children}
    </ActivityContext.Provider>
  )
}

// Create a fallback implementation for when the context is not available
const activityContextFallback: ActivityContextType = {
  activities: [],
  addActivity: (activity) => {
    console.warn("ActivityContext not found, using fallback implementation")
    try {
      const storedActivities = JSON.parse(localStorage.getItem("activities") || "[]")
      const now = new Date().toISOString()
      const newActivity = {
        ...activity,
        id: generateId(),
        timestamp: now,
        created_at: now,
      }
      storedActivities.unshift(newActivity)
      localStorage.setItem("activities", JSON.stringify(storedActivities))
      window.dispatchEvent(new CustomEvent("activitiesUpdated"))
    } catch (e) {
      console.error("Failed to add activity to localStorage:", e)
    }
  },
  getActivitiesForUser: (userId) => {
    console.warn("ActivityContext not found, using fallback implementation")
    try {
      const storedActivities = JSON.parse(localStorage.getItem("activities") || "[]")
      return storedActivities.filter((activity) => {
        if (activity.visible_to) {
          return activity.visible_to.includes(userId)
        }
        return activity.user_id === userId
      })
    } catch (e) {
      console.error("Failed to get activities from localStorage:", e)
      return []
    }
  },
}

export function useActivity() {
  const context = useContext(ActivityContext)
  if (context === undefined) {
    console.warn("useActivity must be used within an ActivityProvider. Using fallback implementation.")
    return activityContextFallback
  }
  return context
}
