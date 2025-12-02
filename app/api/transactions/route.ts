import { NextResponse } from "next/server"

// Mock transactions data for fallback
const mockTransactions = [
  {
    id: "t1",
    transaction_ref: "TRX-2023-001",
    department: "Finance Department",
    purpose: "Office Supplies",
    amount: "1500.00",
    currency: "USD",
    sender_id: 1,
    recipient_name: "Office Depot",
    recipient_type: "Company",
    status: "pending",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    notes: "Monthly office supplies",
    sender_department: "Finance Department",
  },
  {
    id: "t2",
    transaction_ref: "TRX-2023-002",
    department: "Lands Department",
    purpose: "Survey Equipment",
    amount: "12750.00",
    currency: "USD",
    sender_id: 2,
    recipient_name: "GeoTech Solutions",
    recipient_type: "Company",
    status: "pending",
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
    notes: "New equipment for the field survey team",
    sender_department: "Lands Department",
  },
  {
    id: "t3",
    transaction_ref: "TRX-2023-003",
    department: "Health Department",
    purpose: "Medical Supplies",
    amount: "45000.00",
    currency: "USD",
    sender_id: 4,
    recipient_name: "Medical Supplies Inc.",
    recipient_type: "Company",
    status: "approved",
    created_at: new Date(Date.now() - 172800000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
    notes: "Urgent purchase for the new hospital wing",
    sender_department: "Health Department",
  },
  {
    id: "t4",
    transaction_ref: "TRX-2023-004",
    department: "IT Department",
    purpose: "Software Licenses",
    amount: "35000.00",
    currency: "USD",
    sender_id: 3,
    recipient_name: "TechSoft Inc.",
    recipient_type: "Company",
    status: "rejected",
    created_at: new Date(Date.now() - 259200000).toISOString(),
    updated_at: new Date(Date.now() - 172800000).toISOString(),
    notes: "Annual renewal of enterprise software licenses",
    sender_department: "IT Department",
  },
]

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const department = searchParams.get("department")

    // Use mock data for now to ensure the page loads
    let transactions = [...mockTransactions]

    // Filter by status if provided
    if (status && status !== "all") {
      transactions = transactions.filter((tx) => tx.status === status)
    }

    // Filter by department if specified
    if (department && department !== "all" && department !== "admin") {
      transactions = transactions.filter(
        (transaction) =>
          transaction.department === department ||
          transaction.sender_department === department ||
          transaction.recipient_department === department,
      )
    }

    // Always return a valid JSON response
    return NextResponse.json(transactions)
  } catch (error) {
    console.error("Error in transactions API route:", error)
    // Ensure we return a proper JSON response even on error
    return NextResponse.json(mockTransactions)
  }
}
