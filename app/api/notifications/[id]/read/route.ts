import { NextResponse } from "next/server"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const notificationId = params.id

    // In a real application, you would update the notification in your database
    console.log(`Marking notification ${notificationId} as read`)

    // Simulate a database write delay
    await new Promise((resolve) => setTimeout(resolve, 200))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error marking notification as read:", error)
    return NextResponse.json({ error: "Failed to mark notification as read" }, { status: 500 })
  }
}
