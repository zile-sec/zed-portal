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
    console.log("Starting transactions table fix...")

    // Check if transactions table exists
    const tableExists = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'transactions'
      ) as exists
    `)

    if (!tableExists.rows[0].exists) {
      console.log("Transactions table doesn't exist, creating it...")
      await pool.query(`
        CREATE TABLE transactions (
          id SERIAL PRIMARY KEY,
          transaction_ref VARCHAR(50) UNIQUE NOT NULL,
          department VARCHAR(100) NOT NULL,
          purpose VARCHAR(255) NOT NULL,
          amount DECIMAL(15, 2) NOT NULL,
          currency VARCHAR(3) DEFAULT 'USD',
          recipient VARCHAR(255) NOT NULL,
          recipient_department VARCHAR(100) NOT NULL,
          payment_method VARCHAR(50),
          bank_name VARCHAR(255),
          account_number VARCHAR(50),
          description TEXT,
          sender_id INTEGER NOT NULL,
          status VARCHAR(50) DEFAULT 'pending',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `)

      return NextResponse.json({
        success: true,
        message: "Transactions table created successfully",
        action: "created",
      })
    }

    // Table exists, check if it has the recipient column
    const hasRecipientColumn = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'transactions' 
        AND column_name = 'recipient'
      ) as exists
    `)

    if (hasRecipientColumn.rows[0].exists) {
      console.log("Recipient column already exists in transactions table")
      return NextResponse.json({
        success: true,
        message: "Transactions table already has recipient column",
        action: "none",
      })
    }

    // Get all columns in the transactions table
    const columnsResult = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'transactions'
    `)

    const columns = columnsResult.rows.map((row) => row.column_name)
    console.log("Current columns in transactions table:", columns)

    // Check if the table has any data
    const dataCount = await pool.query(`SELECT COUNT(*) FROM transactions`)
    const hasData = Number.parseInt(dataCount.rows[0].count) > 0

    if (hasData) {
      console.log("Transactions table has data, adding recipient column...")
      // Add the recipient column with a default value
      await pool.query(`
        ALTER TABLE transactions 
        ADD COLUMN recipient VARCHAR(255) NOT NULL DEFAULT 'Unknown Recipient'
      `)

      return NextResponse.json({
        success: true,
        message: "Added recipient column to existing transactions table",
        action: "altered",
        note: "Existing transactions have 'Unknown Recipient' as the recipient value",
      })
    } else {
      console.log("Transactions table is empty, recreating it with correct schema...")
      // Drop and recreate the table since it's empty
      await pool.query(`DROP TABLE transactions CASCADE`)

      await pool.query(`
        CREATE TABLE transactions (
          id SERIAL PRIMARY KEY,
          transaction_ref VARCHAR(50) UNIQUE NOT NULL,
          department VARCHAR(100) NOT NULL,
          purpose VARCHAR(255) NOT NULL,
          amount DECIMAL(15, 2) NOT NULL,
          currency VARCHAR(3) DEFAULT 'USD',
          recipient VARCHAR(255) NOT NULL,
          recipient_department VARCHAR(100) NOT NULL,
          payment_method VARCHAR(50),
          bank_name VARCHAR(255),
          account_number VARCHAR(50),
          description TEXT,
          sender_id INTEGER NOT NULL,
          status VARCHAR(50) DEFAULT 'pending',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `)

      return NextResponse.json({
        success: true,
        message: "Recreated transactions table with correct schema",
        action: "recreated",
      })
    }
  } catch (error) {
    console.error("Error fixing transactions table:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fix transactions table",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
