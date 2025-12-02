import { NextResponse } from "next/server"
import { Pool } from "pg"
import fs from "fs"
import path from "path"

// Create a connection pool
const pool = new Pool({
  connectionString: process.env.NEON_DATABASE_URL || process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
})

export async function GET(request: Request) {
  try {
    // Test the database connection
    const result = await pool.query("SELECT NOW()")
    const currentTime = result.rows[0].now

    // Run the setup script
    try {
      const setupScriptPath = path.join(process.cwd(), "setup-database.sql")
      const setupScript = fs.readFileSync(setupScriptPath, "utf8")

      // Split the script by semicolons to execute each statement separately
      const statements = setupScript.split(";").filter((stmt) => stmt.trim() !== "")

      for (const statement of statements) {
        await pool.query(statement)
      }

      return NextResponse.json({
        success: true,
        message: "Database connection successful and setup script executed",
        time: currentTime,
      })
    } catch (setupError) {
      console.error("Error executing setup script:", setupError)

      return NextResponse.json({
        success: false,
        message: "Database connection successful but setup script failed",
        error: setupError.message,
        time: currentTime,
      })
    }
  } catch (error) {
    console.error("Database connection error:", error)

    return NextResponse.json(
      {
        success: false,
        message: "Database connection failed",
        error: error.message,
      },
      { status: 500 },
    )
  }
}
