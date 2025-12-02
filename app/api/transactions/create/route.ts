export async function POST(request: Request) {
  console.log("Transaction create API called")

  try {
    // Parse the request body
    const data = await request.json()
    console.log("Received transaction data:", data)

    // Generate a transaction ID and reference
    const transactionId = `trx-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    const transactionRef = `TRX-${Date.now().toString().substring(6)}`

    // Create a new transaction object with all required fields
    const newTransaction = {
      id: transactionId,
      transaction_ref: transactionRef,
      department: data.department || "Unknown Department",
      purpose: data.purpose || "",
      amount: Number.parseFloat(data.amount) || 0,
      currency: data.currency || "ZMW",
      sender_id: data.sender_id || 1,
      recipient: data.recipient || "",
      recipient_department: data.recipient_department || "",
      payment_method: data.payment_method || "bank_transfer",
      status: "pending",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      description: data.description || "",
    }

    console.log("Created transaction object:", newTransaction)

    // Return the transaction object as JSON
    return new Response(JSON.stringify(newTransaction), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    console.error("Error in transaction create API:", error)

    // Return a detailed error response
    return new Response(
      JSON.stringify({
        error: "Failed to create transaction",
        message: error.message || "Unknown error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  }
}
