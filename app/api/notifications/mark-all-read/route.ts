import { NextResponse } from "next/server"
import { Pool } from "pg"

// Create a connection pool
const pool = new Pool({
  connectionString: process.env.NEON_DATABASE_URL || process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
})

export async function POST(request: Request) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Check if the notifications table exists
    try {
      const tableCheck = await pool.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'notifications'
        )
      `)

      // If notifications table doesn't exist, return success
      if (!tableCheck.rows[0].exists) {
        return NextResponse.json({ success: true })
      }
    } catch (error) {
      console.error("Error checking if notifications table exists:", error)
      return NextResponse.json({ error: "Failed to mark notifications as read" }, { status: 500 })
    }

    // Mark all notifications as read
    await pool.query(
      `
      UPDATE notifications 
      SET is_read = TRUE
      WHERE user_id = $1 AND is_read = FALSE
    `,
      [userId],
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error marking all notifications as read:", error)
    return NextResponse.json({ error: "Failed to mark notifications as read" }, { status: 500 })
  }
}
