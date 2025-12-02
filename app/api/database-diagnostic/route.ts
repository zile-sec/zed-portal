import { NextResponse } from "next/server"
import { Pool } from "pg"

// Create a connection pool
const pool = new Pool({
  connectionString: process.env.NEON_DATABASE_URL || process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
})

export async function GET() {
  try {
    console.log("Starting database diagnostic...")

    // Check which tables exist
    const tables = [
      "users",
      "transactions",
      "transaction_timeline",
      "bank_details",
      "attachments",
      "documents",
      "document_comments",
      "notifications",
      "activity_log",
    ]

    const tableExistence = {}

    for (const table of tables) {
      const result = await pool.query(
        `
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = $1
        ) as exists
      `,
        [table],
      )

      tableExistence[table] = result.rows[0].exists
    }

    // Get detailed info about transactions table if it exists
    let transactionsColumns = null
    if (tableExistence.transactions) {
      const columnsResult = await pool.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'transactions'
        ORDER BY ordinal_position
      `)

      transactionsColumns = columnsResult.rows
    }

    // Get sample data from transactions table
    let transactionsSample = null
    if (tableExistence.transactions) {
      try {
        const sampleResult = await pool.query(`
          SELECT * FROM transactions LIMIT 1
        `)

        if (sampleResult.rows.length > 0) {
          transactionsSample = sampleResult.rows[0]
        }
      } catch (error) {
        console.error("Error getting transactions sample:", error)
        // Continue without sample data
      }
    }

    // Get database connection info (without sensitive details)
    const connectionInfo = {
      database: process.env.NEON_PGDATABASE || process.env.POSTGRES_DATABASE || "unknown",
      host: "hidden for security",
      user: "hidden for security",
      ssl: true,
    }

    return NextResponse.json({
      tables: tableExistence,
      transactionsColumns,
      transactionsSample,
      connectionInfo,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error in database diagnostic:", error)
    return NextResponse.json(
      {
        error: "Failed to run database diagnostic",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
