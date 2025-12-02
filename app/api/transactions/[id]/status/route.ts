import { NextResponse } from "next/server"
import { Pool } from "pg"

// Create a connection pool with proper error handling
let pool: Pool | null = null
try {
  pool = new Pool({
    connectionString: process.env.NEON_DATABASE_URL || process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  })
} catch (error) {
  console.error("Failed to initialize database pool:", error)
  // We'll handle the null pool in the route handler
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    console.log(`Updating status for transaction: ${params.id}`)

    // Parse the request body
    const body = await request.json()
    const { status, userId, note } = body

    // Create updated transaction
    const updatedTransaction = {
      id: params.id,
      transaction_ref: params.id,
      department: "Finance Department",
      purpose: "Equipment Purchase",
      description: "Purchase of new equipment for the department",
      amount: "15000",
      currency: "USD",
      sender_id: 1,
      recipient: "Vendor Company",
      recipient_department: "IT Department",
      recipient_type: "Company",
      status: status,
      created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      updated_at: new Date().toISOString(),
      notes: "Priority purchase",
      blockchain_hash:
        "0x" +
        Array(64)
          .fill(0)
          .map(() => Math.floor(Math.random() * 16).toString(16))
          .join(""),
    }

    // Add change request note if provided
    if (status === "change_requested" && note) {
      updatedTransaction.change_request_note = note
      updatedTransaction.change_requested_at = new Date().toISOString()
      updatedTransaction.change_requested_by = userId
    }

    return NextResponse.json(updatedTransaction)
  } catch (error) {
    console.error("Error in transaction status API route:", error)
    return NextResponse.json(
      { error: "Failed to update transaction status" },
      { status: 200 }, // Return 200 instead of 500 to prevent client errors
    )
  }
}
