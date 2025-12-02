import { Pool } from "pg"

// Create a connection pool using the Neon environment variables
let pool: Pool | null = null

try {
  pool = new Pool({
    connectionString: process.env.NEON_DATABASE_URL || process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false, // Required for Neon connections
    },
  })

  // Test the connection
  pool.query("SELECT NOW()", (err, res) => {
    if (err) {
      console.error("Database connection error:", err.message)
    } else {
      console.log("Database connected successfully")
    }
  })
} catch (error) {
  console.error("Failed to initialize database pool:", error)
}

// Safely execute database queries with proper error handling
export async function executeQuery(query: string, params: any[] = []) {
  if (!pool) {
    console.error("Database pool not initialized")
    throw new Error("Database connection not available")
  }

  try {
    const result = await pool.query(query, params)
    return result
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

// Create a SQL client with the connection string from environment variables
const connectionString = process.env.NEON_NEON_DATABASE_URL || process.env.DATABASE_URL || ""

if (!connectionString) {
  console.warn("No database connection string found in environment variables")
}

// User-related database functions
export async function getUserByEmail(email: string) {
  try {
    console.log(`Getting user by email: ${email}`)

    if (!pool) {
      console.error("Database pool not initialized")
      return null
    }

    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email])

    if (!result || !result.rows || result.rows.length === 0) {
      console.log(`No user found with email: ${email}`)
      return null
    }

    console.log(`User found with email: ${email}`)
    return result.rows[0]
  } catch (error) {
    console.error("Error getting user by email:", error)
    // Return null instead of throwing to prevent API crashes
    return null
  }
}

export async function validateUserCredentials(email: string, password: string) {
  try {
    console.log(`Validating credentials for email: ${email}`)
    const user = await getUserByEmail(email)

    if (!user) {
      console.log(`Authentication failed: User not found for email: ${email}`)
      return { success: false, message: "Invalid email or password" }
    }

    // For demo purposes, we're checking the password directly
    // In a real app, you would use bcrypt.compare
    if (password === "Finance123" || password === "Lands123" || password === "Admin123" || password === "Health123") {
      console.log(`Authentication successful for email: ${email}`)
      return { success: true, user }
    }

    console.log(`Authentication failed: Invalid password for email: ${email}`)
    return { success: false, message: "Invalid email or password" }
  } catch (error) {
    console.error("Error validating credentials:", error)
    return { success: false, message: "Authentication error" }
  }
}

async function updateUserLoginAttempts(userId: number, attempts: number, lockedUntil: Date | null = null) {
  try {
    await pool.query(
      `UPDATE users 
      SET login_attempts = $1, locked_until = $2
      WHERE id = $3`,
      [attempts, lockedUntil, userId],
    )
  } catch (error) {
    console.error("Error updating user login attempts:", error)
  }
}

export async function getAllUsers() {
  try {
    const result = await pool.query("SELECT * FROM users")
    return result.rows
  } catch (error) {
    console.error("Error getting all users:", error.message)
    throw new Error(`Database error: ${error.message}`)
  }
}

// Transaction-related database functions
export async function getTransactions(limit = 10) {
  try {
    console.log("Fetching transactions from database...")

    if (!pool) {
      console.error("Database pool not initialized")
      return []
    }

    const result = await pool.query(
      `SELECT t.*, u.first_name, u.last_name, u.department as sender_department
      FROM transactions t
      LEFT JOIN users u ON t.sender_id = u.id
      ORDER BY t.created_at DESC
      LIMIT $1`,
      [limit],
    )

    console.log(`Successfully fetched ${result.rows.length} transactions from database`)
    return result.rows
  } catch (error) {
    console.error("Error getting transactions:", error)
    // Return empty array instead of throwing
    return []
  }
}

export async function getPendingTransactions(limit = 10) {
  try {
    console.log("Fetching pending transactions from database...")

    if (!pool) {
      console.error("Database pool not initialized")
      return []
    }

    const result = await pool.query(
      `SELECT t.*, u.first_name, u.last_name, u.department as sender_department
      FROM transactions t
      LEFT JOIN users u ON t.sender_id = u.id
      WHERE t.status = 'pending'
      ORDER BY t.created_at DESC
      LIMIT $1`,
      [limit],
    )

    console.log(`Successfully fetched ${result.rows.length} pending transactions from database`)
    return result.rows
  } catch (error) {
    console.error("Error getting pending transactions:", error)
    // Return empty array instead of throwing
    return []
  }
}

export async function getTransactionById(id: string) {
  try {
    const result = await pool.query(
      `SELECT t.*, u.first_name, u.last_name, u.department as sender_department
      FROM transactions t
      LEFT JOIN users u ON t.sender_id = u.id
      WHERE t.id = $1
      LIMIT 1`,
      [id],
    )
    return result.rows[0] || null
  } catch (error) {
    console.error("Error getting transaction by ID:", error)
    throw new Error(`Database error: ${error.message}`)
  }
}

export async function getTransactionTimeline(transactionId: string) {
  try {
    const result = await pool.query(
      `SELECT tl.*, u.first_name, u.last_name, u.department
      FROM transaction_timeline tl
      LEFT JOIN users u ON tl.user_id = u.id
      WHERE tl.transaction_id = $1
      ORDER BY tl.created_at ASC`,
      [transactionId],
    )
    return result.rows
  } catch (error) {
    console.error("Error getting transaction timeline:", error)
    throw new Error(`Database error: ${error.message}`)
  }
}

export async function getTransactionBankDetails(transactionId: string) {
  try {
    const result = await pool.query(
      `SELECT * FROM bank_details
      WHERE transaction_id = $1
      LIMIT 1`,
      [transactionId],
    )
    return result.rows[0] || null
  } catch (error) {
    console.error("Error getting transaction bank details:", error)
    throw new Error(`Database error: ${error.message}`)
  }
}

export async function getTransactionAttachments(transactionId: string) {
  try {
    const result = await pool.query(
      `SELECT * FROM attachments
      WHERE transaction_id = $1`,
      [transactionId],
    )
    return result.rows
  } catch (error) {
    console.error("Error getting transaction attachments:", error)
    throw new Error(`Database error: ${error.message}`)
  }
}

export async function updateTransactionStatus(id: string, status: string, userId: number) {
  try {
    // Get user department
    const userResult = await pool.query(`SELECT department FROM users WHERE id = $1`, [userId])

    const userDepartment = userResult.rows[0]?.department || "Unknown"

    // Update transaction status
    const result = await pool.query(
      `UPDATE transactions 
      SET status = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING *`,
      [status, id],
    )

    // Add to timeline
    await pool.query(
      `INSERT INTO transaction_timeline (transaction_id, status, user_id, department, notes)
      VALUES (
        $1, 
        $2, 
        $3, 
        $4, 
        $5
      )`,
      [
        id,
        status.charAt(0).toUpperCase() + status.slice(1),
        userId,
        userDepartment,
        status === "approved" ? "Transaction approved for payment" : "Transaction rejected",
      ],
    )

    // Log activity
    await pool.query(
      `INSERT INTO activity_log (user_id, action, details)
      VALUES (
        $1, 
        $2, 
        $3
      )`,
      [userId, status === "approved" ? "Approved transaction" : "Rejected transaction", "Transaction ID: " + id],
    )

    return result.rows[0]
  } catch (error) {
    console.error("Error updating transaction status:", error)
    throw new Error(`Database error: ${error.message}`)
  }
}

// Notification-related database functions
export async function getUserNotifications(userId: number, limit = 10) {
  try {
    const result = await pool.query(
      `SELECT * FROM notifications
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT $2`,
      [userId, limit],
    )
    return result.rows
  } catch (error) {
    console.error("Error getting user notifications:", error)
    throw new Error(`Database error: ${error.message}`)
  }
}

export async function markNotificationAsRead(id: string) {
  try {
    const result = await pool.query(
      `UPDATE notifications 
      SET is_read = TRUE
      WHERE id = $1
      RETURNING *`,
      [id],
    )
    return result.rows[0]
  } catch (error) {
    console.error("Error marking notification as read:", error)
    throw new Error(`Database error: ${error.message}`)
  }
}

export async function markAllNotificationsAsRead(userId: number) {
  try {
    await pool.query(
      `UPDATE notifications 
      SET is_read = TRUE
      WHERE user_id = $1 AND is_read = FALSE`,
      [userId],
    )
    return true
  } catch (error) {
    console.error("Error marking all notifications as read:", error)
    throw new Error(`Database error: ${error.message}`)
  }
}

// Activity log functions
export async function getUserActivityLog(userId: number, limit = 5) {
  try {
    const result = await pool.query(
      `SELECT * FROM activity_log
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT $2`,
      [userId, limit],
    )
    return result.rows
  } catch (error) {
    console.error("Error getting user activity log:", error)
    throw new Error(`Database error: ${error.message}`)
  }
}

// Document-related database functions
export async function getDocumentById(id: string) {
  try {
    const result = await pool.query(
      `SELECT d.*, u.first_name, u.last_name FROM documents d LEFT JOIN users u ON d.author_id = u.id WHERE d.id = $1`,
      [id],
    )
    return result.rows[0] || null
  } catch (error) {
    console.error("Error getting document by ID:", error)
    throw new Error(`Database error: ${error.message}`)
  }
}

export async function getDocumentComments(documentId: string) {
  try {
    const result = await pool.query(
      `SELECT dc.*, u.first_name, u.last_name, u.department FROM document_comments dc LEFT JOIN users u ON dc.user_id = u.id WHERE dc.document_id = $1 ORDER BY dc.created_at DESC`,
      [documentId],
    )
    return result.rows
  } catch (error) {
    console.error("Error getting document comments:", error)
    throw new Error(`Database error: ${error.message}`)
  }
}

export async function addDocumentComment(
  documentId: string,
  userId: number,
  comment: string,
  parentId: number | null = null,
) {
  try {
    const result = await pool.query(
      `INSERT INTO document_comments (document_id, user_id, comment, parent_id) VALUES ($1, $2, $3, $4) RETURNING *`,
      [documentId, userId, comment, parentId],
    )

    // Fetch user details for the comment
    const userResult = await pool.query(`SELECT first_name, last_name, department FROM users WHERE id = $1`, [userId])

    const newComment = {
      ...result.rows[0],
      first_name: userResult.rows[0].first_name,
      last_name: userResult.rows[0].last_name,
      department: userResult.rows[0].department,
    }

    return newComment
  } catch (error) {
    console.error("Error adding document comment:", error)
    throw new Error(`Database error: ${error.message}`)
  }
}

export async function updateDocumentStatus(id: string, status: string, userId: number) {
  try {
    const result = await pool.query(`UPDATE documents SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`, [
      status,
      id,
    ])

    // Log activity
    await pool.query(`INSERT INTO activity_log (user_id, action, details) VALUES ($1, $2, $3)`, [
      userId,
      `Updated document status to ${status}`,
      `Document ID: ${id}`,
    ])

    return result.rows[0]
  } catch (error) {
    console.error("Error updating document status:", error)
    throw new Error(`Database error: ${error.message}`)
  }
}

export default {
  executeQuery,
  getUserByEmail,
  validateUserCredentials,
  getTransactions,
  getPendingTransactions,
  // ... other exported functions
}
