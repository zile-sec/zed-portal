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
    console.log("Starting database initialization...")

    // Get URL parameters
    const url = new URL(request.url)
    const forceReset = url.searchParams.get("force") === "true"

    // If force reset is enabled, drop all tables first
    if (forceReset) {
      console.log("Force reset enabled, dropping all tables...")
      try {
        await pool.query(`
          DROP TABLE IF EXISTS activity_log CASCADE;
          DROP TABLE IF EXISTS notifications CASCADE;
          DROP TABLE IF EXISTS attachments CASCADE;
          DROP TABLE IF EXISTS document_comments CASCADE;
          DROP TABLE IF EXISTS transaction_timeline CASCADE;
          DROP TABLE IF EXISTS bank_details CASCADE;
          DROP TABLE IF EXISTS transactions CASCADE;
          DROP TABLE IF EXISTS documents CASCADE;
          DROP TABLE IF EXISTS users CASCADE;
        `)
        console.log("All tables dropped successfully")
      } catch (error) {
        console.error("Error dropping tables:", error)
        return NextResponse.json({ error: "Failed to drop tables", details: error.message }, { status: 500 })
      }
    }

    // Create users table
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255),
          first_name VARCHAR(100) NOT NULL,
          last_name VARCHAR(100) NOT NULL,
          department VARCHAR(100) NOT NULL,
          role VARCHAR(50) NOT NULL,
          login_attempts INTEGER DEFAULT 0,
          locked_until TIMESTAMP,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `)
      console.log("Users table created or verified")
    } catch (error) {
      console.error("Error creating users table:", error)
      return NextResponse.json({ error: "Failed to create users table", details: error.message }, { status: 500 })
    }

    // Create transactions table - ENSURE recipient column exists
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS transactions (
          id SERIAL PRIMARY KEY,
          transaction_ref VARCHAR(50) UNIQUE NOT NULL,
          department VARCHAR(100) NOT NULL,
          purpose VARCHAR(255) NOT NULL,
          amount DECIMAL(15, 2) NOT NULL,
          currency VARCHAR(10) NOT NULL DEFAULT 'USD',
          recipient VARCHAR(255) NOT NULL,
          recipient_department VARCHAR(100) NOT NULL,
          payment_method VARCHAR(50),
          bank_name VARCHAR(255),
          account_number VARCHAR(50),
          description TEXT,
          sender_id INTEGER NOT NULL,
          status VARCHAR(20) NOT NULL DEFAULT 'pending',
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW()
        )
      `)
      console.log("Transactions table created or verified")
    } catch (error) {
      console.error("Error creating transactions table:", error)
      return NextResponse.json(
        { error: "Failed to create transactions table", details: error.message },
        { status: 500 },
      )
    }

    // Create documents table
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS documents (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          file_path VARCHAR(255),
          file_type VARCHAR(50),
          file_size INTEGER,
          author_id INTEGER,
          department VARCHAR(100),
          status VARCHAR(50) DEFAULT 'draft',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `)
      console.log("Documents table created or verified")
    } catch (error) {
      console.error("Error creating documents table:", error)
      return NextResponse.json({ error: "Failed to create documents table", details: error.message }, { status: 500 })
    }

    // Create transaction_timeline table
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS transaction_timeline (
          id SERIAL PRIMARY KEY,
          transaction_id INTEGER NOT NULL,
          status VARCHAR(50) NOT NULL,
          user_id INTEGER,
          department VARCHAR(100),
          notes TEXT,
          created_at TIMESTAMP NOT NULL DEFAULT NOW()
        )
      `)
      console.log("Transaction timeline table created or verified")
    } catch (error) {
      console.error("Error creating transaction timeline table:", error)
      return NextResponse.json(
        { error: "Failed to create transaction timeline table", details: error.message },
        { status: 500 },
      )
    }

    // Create bank_details table
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS bank_details (
          id SERIAL PRIMARY KEY,
          transaction_id INTEGER NOT NULL,
          bank_name VARCHAR(255) NOT NULL,
          account_number VARCHAR(50) NOT NULL,
          account_name VARCHAR(255) NOT NULL,
          swift_code VARCHAR(50),
          routing_number VARCHAR(50),
          created_at TIMESTAMP NOT NULL DEFAULT NOW()
        )
      `)
      console.log("Bank details table created or verified")
    } catch (error) {
      console.error("Error creating bank details table:", error)
      return NextResponse.json(
        { error: "Failed to create bank details table", details: error.message },
        { status: 500 },
      )
    }

    // Create document_comments table
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS document_comments (
          id SERIAL PRIMARY KEY,
          document_id INTEGER NOT NULL,
          user_id INTEGER,
          comment TEXT NOT NULL,
          parent_id INTEGER,
          created_at TIMESTAMP NOT NULL DEFAULT NOW()
        )
      `)
      console.log("Document comments table created or verified")
    } catch (error) {
      console.error("Error creating document comments table:", error)
      return NextResponse.json(
        { error: "Failed to create document comments table", details: error.message },
        { status: 500 },
      )
    }

    // Create attachments table
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS attachments (
          id SERIAL PRIMARY KEY,
          transaction_id INTEGER,
          document_id INTEGER,
          file_name VARCHAR(255) NOT NULL,
          file_path VARCHAR(255) NOT NULL,
          file_type VARCHAR(50),
          file_size INTEGER,
          uploaded_by INTEGER,
          created_at TIMESTAMP NOT NULL DEFAULT NOW()
        )
      `)
      console.log("Attachments table created or verified")
    } catch (error) {
      console.error("Error creating attachments table:", error)
      return NextResponse.json({ error: "Failed to create attachments table", details: error.message }, { status: 500 })
    }

    // Create notifications table
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS notifications (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL,
          title VARCHAR(255) NOT NULL,
          description TEXT NOT NULL,
          details TEXT,
          type VARCHAR(50) NOT NULL,
          related_type VARCHAR(50),
          related_id INTEGER,
          status VARCHAR(20) NOT NULL DEFAULT 'unread',
          is_read BOOLEAN NOT NULL DEFAULT FALSE,
          created_at TIMESTAMP NOT NULL DEFAULT NOW()
        )
      `)
      console.log("Notifications table created or verified")
    } catch (error) {
      console.error("Error creating notifications table:", error)
      return NextResponse.json(
        { error: "Failed to create notifications table", details: error.message },
        { status: 500 },
      )
    }

    // Create activity_log table
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS activity_log (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL,
          action VARCHAR(255) NOT NULL,
          details TEXT,
          created_at TIMESTAMP NOT NULL DEFAULT NOW()
        )
      `)
      console.log("Activity log table created or verified")
    } catch (error) {
      console.error("Error creating activity log table:", error)
      return NextResponse.json(
        { error: "Failed to create activity log table", details: error.message },
        { status: 500 },
      )
    }

    // Add demo users if they don't exist
    try {
      await pool.query(`
        INSERT INTO users (email, password_hash, first_name, last_name, department, role)
        SELECT 'finance@example.com', 'Finance123', 'Finance', 'User', 'finance', 'manager'
        WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'finance@example.com');

        INSERT INTO users (email, password_hash, first_name, last_name, department, role)
        SELECT 'lands@example.com', 'Lands123', 'Lands', 'User', 'lands', 'manager'
        WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'lands@example.com');

        INSERT INTO users (email, password_hash, first_name, last_name, department, role)
        SELECT 'admin@example.com', 'Admin123', 'Admin', 'User', 'admin', 'admin'
        WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@example.com');

        INSERT INTO users (email, password_hash, first_name, last_name, department, role)
        SELECT 'health@example.com', 'Health123', 'Health', 'User', 'health', 'manager'
        WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'health@example.com');
      `)
      console.log("Demo users created or verified")
    } catch (error) {
      console.error("Error creating demo users:", error)
      return NextResponse.json({ error: "Failed to create demo users", details: error.message }, { status: 500 })
    }

    // Verify the transactions table has the recipient column
    try {
      const result = await pool.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'transactions' 
        AND column_name = 'recipient'
      `)

      if (result.rows.length === 0) {
        // The recipient column doesn't exist, so we need to add it
        console.log("Recipient column missing, attempting to add it...")
        await pool.query(`
          ALTER TABLE transactions 
          ADD COLUMN recipient VARCHAR(255) NOT NULL DEFAULT 'Unknown Recipient'
        `)
        console.log("Recipient column added successfully")
      } else {
        console.log("Recipient column exists in transactions table")
      }
    } catch (error) {
      console.error("Error verifying recipient column:", error)
      return NextResponse.json({ error: "Failed to verify recipient column", details: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Database initialized successfully",
      note: "If you're still experiencing issues, try adding ?force=true to the URL to reset all tables",
    })
  } catch (error) {
    console.error("Database initialization failed:", error)
    return NextResponse.json(
      {
        error: "Database initialization failed",
        details: error.message,
        tip: "Try adding ?force=true to the URL to reset all tables",
      },
      { status: 500 },
    )
  }
}
