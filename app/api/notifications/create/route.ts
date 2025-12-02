import { NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Validate required fields
    const requiredFields = ["title", "description", "type"]
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Create a new notification
    const newNotification = {
      id: `n${uuidv4().substring(0, 8)}`,
      ...data,
      is_read: false,
      created_at: new Date().toISOString(),
    }

    // In a real application, you would save this to your database
    // For now, we'll just return the created notification
    console.log("Created new notification:", newNotification)

    // Simulate a database write delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    return NextResponse.json(newNotification)
  } catch (error) {
    console.error("Error creating notification:", error)
    return NextResponse.json({ error: "Failed to create notification" }, { status: 500 })
  }
}
