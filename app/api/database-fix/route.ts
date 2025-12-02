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
    // Get the fix method from the query parameters
    const { searchParams } = new URL(request.url)
    const method = searchParams.get("method")

    if (!method) {
      return NextResponse.json(
        {
          error: "Missing method parameter",
        },
        { status: 400 },
      )
    }

    console.log(`Starting database fix with method: ${method}`)

    if (method === "add-column") {
      // Check if transactions table exists
      const tableExists = await pool.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = 'transactions'
        ) as exists
      `)

      if (!tableExists.rows[0].exists) {
        return NextResponse.json(
          {
            error: "Transactions table doesn't exist",
            solution: "Try the 'recreate-table' method instead",
          },
          { status: 400 },
        )
      }

      // Check if recipient column already exists
      const columnExists = await pool.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.columns 
          WHERE table_name = 'transactions' 
          AND column_name = 'recipient'
        ) as exists
      `)

      if (columnExists.rows[0].exists) {
        return NextResponse.json({
          method,
          message: "Recipient column already exists",
          action: "none",
        })
      }

      // Add recipient column
      await pool.query(`
        ALTER TABLE transactions 
        ADD COLUMN recipient VARCHAR(255) NOT NULL DEFAULT 'Unknown Recipient'
      `)

      return NextResponse.json({
        method,
        message: "Successfully added recipient column to transactions table",
        action: "added-column",
      })
    } else if (method === "recreate-table") {
      // Drop transactions table if it exists
      await pool.query(`
        DROP TABLE IF EXISTS transactions CASCADE
      `)

      // Create transactions table with correct schema
      await pool.query(`
        CREATE TABLE transactions (
          id SERIAL PRIMARY KEY,
          transaction_ref VARCHAR(50) NOT NULL,
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

      // Create transaction_timeline table if it doesn't exist
      await pool.query(`
        CREATE TABLE IF NOT EXISTS transaction_timeline (
          id SERIAL PRIMARY KEY,
          transaction_id INTEGER,
          status VARCHAR(50) NOT NULL,
          user_id INTEGER,
          department VARCHAR(100),
          notes TEXT,
          created_at TIMESTAMP NOT NULL DEFAULT NOW()
        )
      `)

      return NextResponse.json({
        method,
        message: "Successfully recreated transactions table with correct schema",
        action: "recreated-table",
      })
    } else if (method === "full-reset") {
      // Drop all tables
      await pool.query(`
        DROP TABLE IF EXISTS transactions CASCADE;
        DROP TABLE IF EXISTS transaction_timeline CASCADE;
        DROP TABLE IF EXISTS bank_details CASCADE;
        DROP TABLE IF EXISTS attachments CASCADE;
        DROP TABLE IF EXISTS documents CASCADE;
        DROP TABLE IF EXISTS document_comments CASCADE;
        DROP TABLE IF EXISTS notifications CASCADE;
        DROP TABLE IF EXISTS activity_log CASCADE;
        DROP TABLE IF EXISTS users CASCADE;
      `)

      // Create users table
      await pool.query(`
        CREATE TABLE users (
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

      // Create transactions table
      await pool.query(`
        CREATE TABLE transactions (
          id SERIAL PRIMARY KEY,
          transaction_ref VARCHAR(50) NOT NULL,
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

      // Create transaction_timeline table
      await pool.query(`
        CREATE TABLE transaction_timeline (
          id SERIAL PRIMARY KEY,
          transaction_id INTEGER,
          status VARCHAR(50) NOT NULL,
          user_id INTEGER,
          department VARCHAR(100),
          notes TEXT,
          created_at TIMESTAMP NOT NULL DEFAULT NOW()
        )
      `)

      // Create bank_details table
      await pool.query(`
        CREATE TABLE bank_details (
          id SERIAL PRIMARY KEY,
          transaction_id INTEGER,
          bank_name VARCHAR(255) NOT NULL,
          account_number VARCHAR(50) NOT NULL,
          account_name VARCHAR(255) NOT NULL,
          swift_code VARCHAR(50),
          routing_number VARCHAR(50),
          created_at TIMESTAMP NOT NULL DEFAULT NOW()
        )
      `)

      // Create documents table
      await pool.query(`
        CREATE TABLE documents (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          file_path VARCHAR(255),
          file_type VARCHAR(50),
          file_size INTEGER,
          author_id INTEGER,
          department VARCHAR(100),
          status VARCHAR(50) DEFAULT 'draft',
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW()
        )
      `)

      // Create attachments table
      await pool.query(`
        CREATE TABLE attachments (
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

      // Create document_comments table
      await pool.query(`
        CREATE TABLE document_comments (
          id SERIAL PRIMARY KEY,
          document_id INTEGER,
          user_id INTEGER,
          comment TEXT NOT NULL,
          parent_id INTEGER,
          created_at TIMESTAMP NOT NULL DEFAULT NOW()
        )
      `)

      // Create notifications table
      await pool.query(`
        CREATE TABLE notifications (
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

      // Create activity_log table
      await pool.query(`
        CREATE TABLE activity_log (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL,
          action VARCHAR(255) NOT NULL,
          details TEXT,
          created_at TIMESTAMP NOT NULL DEFAULT NOW()
        )
      `)

      // Add demo users
      await pool.query(`
        INSERT INTO users (email, password_hash, first_name, last_name, department, role)
        VALUES 
          ('finance@example.com', 'Finance123', 'Finance', 'User', 'finance', 'manager'),
          ('lands@example.com', 'Lands123', 'Lands', 'User', 'lands', 'manager'),
          ('admin@example.com', 'Admin123', 'Admin', 'User', 'admin', 'admin'),
          ('health@example.com', 'Health123', 'Health', 'User', 'health', 'manager')
      `)

      return NextResponse.json({
        method,
        message: "Successfully reset the entire database and created demo users",
        action: "full-reset",
      })
    } else {
      return NextResponse.json(
        {
          error: "Invalid method parameter",
          validMethods: ["add-column", "recreate-table", "full-reset"],
        },
        { status: 400 },
      )
    }
  } catch (error) {
    console.error("Error fixing database:", error)
    return NextResponse.json(
      {
        error: "Failed to fix database",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
