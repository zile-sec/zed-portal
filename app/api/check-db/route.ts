import { NextResponse } from "next/server"
import { Pool } from "pg"

export async function GET() {
  console.log("Database check API called")

  try {
    // Create a connection pool
    const pool = new Pool({
      connectionString: process.env.NEON_DATABASE_URL || process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    })

    // Test the connection
    const client = await pool.connect()
    try {
      const result = await client.query("SELECT NOW()")
      const now = result.rows[0].now

      return NextResponse.json({
        status: "connected",
        timestamp: now,
        database_url: process.env.DATABASE_URL ? "Set" : "Not set",
        neon_database_url: process.env.NEON_DATABASE_URL ? "Set" : "Not set",
      })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error("Database connection error:", error)

    return NextResponse.json(
      {
        status: "error",
        message: error.message,
        database_url: process.env.DATABASE_URL ? "Set" : "Not set",
        neon_database_url: process.env.NEON_DATABASE_URL ? "Set" : "Not set",
      },
      { status: 500 },
    )
  }
}
