"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function FixActivitiesPage() {
  const [isFixing, setIsFixing] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [activities, setActivities] = useState<any[]>([])

  useEffect(() => {
    try {
      const storedActivities = localStorage.getItem("activities")
      if (storedActivities) {
        setActivities(JSON.parse(storedActivities))
      }
    } catch (error) {
      console.error("Error loading activities:", error)
    }
  }, [])

  const fixActivities = () => {
    setIsFixing(true)
    setResult(null)

    try {
      // Get activities from localStorage
      const storedActivities = localStorage.getItem("activities")
      if (!storedActivities) {
        setResult("No activities found in localStorage")
        setIsFixing(false)
        return
      }

      // Parse activities
      const activities = JSON.parse(storedActivities)
      if (!Array.isArray(activities)) {
        setResult("Activities is not an array")
        setIsFixing(false)
        return
      }

      // Fix activities
      const now = new Date().toISOString()
      const fixedActivities = activities.map((activity) => {
        // Ensure both timestamp and created_at are present and valid
        const timestamp = activity.timestamp || activity.created_at || now
        return {
          ...activity,
          timestamp,
          created_at: timestamp,
        }
      })

      // Save fixed activities
      localStorage.setItem("activities", JSON.stringify(fixedActivities))
      setActivities(fixedActivities)
      setResult(`Fixed ${fixedActivities.length} activities`)

      // Dispatch event to notify other components
      window.dispatchEvent(new CustomEvent("activitiesUpdated"))
    } catch (error) {
      console.error("Error fixing activities:", error)
      setResult(`Error: ${error.message}`)
    } finally {
      setIsFixing(false)
    }
  }

  const clearActivities = () => {
    if (confirm("Are you sure you want to clear all activities?")) {
      localStorage.removeItem("activities")
      setActivities([])
      setResult("All activities cleared")
      window.dispatchEvent(new CustomEvent("activitiesUpdated"))
    }
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Fix Activities</CardTitle>
          <CardDescription>
            This utility fixes the date format issues in the activities stored in localStorage.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex space-x-4">
              <Button onClick={fixActivities} disabled={isFixing}>
                {isFixing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Fixing...
                  </>
                ) : (
                  "Fix Activities"
                )}
              </Button>
              <Button variant="destructive" onClick={clearActivities} disabled={isFixing}>
                Clear All Activities
              </Button>
            </div>
            {result && <div className="text-sm text-gray-500">{result}</div>}
          </div>
        </CardContent>
        <CardFooter>
          <div className="w-full">
            <h3 className="text-lg font-medium mb-2">Current Activities ({activities.length})</h3>
            <div className="max-h-96 overflow-y-auto border rounded p-4">
              {activities.length === 0 ? (
                <div className="text-gray-500">No activities found</div>
              ) : (
                <ul className="space-y-2">
                  {activities.map((activity, index) => (
                    <li key={index} className="text-sm border-b pb-2">
                      <div>
                        <strong>ID:</strong> {activity.id}
                      </div>
                      <div>
                        <strong>User ID:</strong> {activity.user_id}
                      </div>
                      <div>
                        <strong>Type:</strong> {activity.type || activity.action || "N/A"}
                      </div>
                      <div>
                        <strong>Description:</strong> {activity.description || activity.details || "N/A"}
                      </div>
                      <div>
                        <strong>Timestamp:</strong> {activity.timestamp || "N/A"}
                      </div>
                      <div>
                        <strong>Created At:</strong> {activity.created_at || "N/A"}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
