import { NextResponse } from "next/server"
import { Pool } from "pg"

// Create a connection pool
const pool = new Pool({
  connectionString: process.env.NEON_DATABASE_URL || process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
})

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("user_id")

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

      // If notifications table doesn't exist, return empty array instead of error
      if (!tableCheck.rows[0].exists) {
        console.log("Notifications table does not exist, returning empty array")
        return NextResponse.json([])
      }
    } catch (error) {
      console.error("Error checking if notifications table exists:", error)
      // Return empty array instead of error
      return NextResponse.json([])
    }

    // Get notifications from the database
    const result = await pool.query(
      `
      SELECT * FROM notifications
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 10
    `,
      [userId],
    )

    return NextResponse.json(result.rows || [])
  } catch (error) {
    console.error("Error fetching notifications:", error)
    // Return empty array instead of error
    return NextResponse.json([])
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Validate required fields
    if (!data.user_id || !data.message || !data.type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
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

      // If notifications table doesn't exist, create it
      if (!tableCheck.rows[0].exists) {
        console.log("Creating notifications table")
        await pool.query(`
          CREATE TABLE notifications (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL,
            title VARCHAR(255) NOT NULL,
            description TEXT NOT NULL,
            details TEXT,
            type VARCHAR(50) NOT NULL,
            related_type VARCHAR(50),
            related_id VARCHAR(50),
            status VARCHAR(50) DEFAULT 'unread',
            is_read BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `)
      }
    } catch (error) {
      console.error("Error checking/creating notifications table:", error)
      return NextResponse.json({ error: "Failed to create notification" }, { status: 500 })
    }

    // Create a new notification
    const result = await pool.query(
      `
      INSERT INTO notifications (
        user_id, 
        title, 
        description, 
        details, 
        type, 
        related_type, 
        related_id, 
        status, 
        is_read
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `,
      [
        data.user_id,
        data.title,
        data.message,
        data.details || null,
        data.type,
        data.related_type || null,
        data.related_id || null,
        data.status || "unread",
        false,
      ],
    )

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error("Error creating notification:", error)
    return NextResponse.json({ error: "Failed to create notification" }, { status: 500 })
  }
}
