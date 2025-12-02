import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    console.log(`Fetching timeline for transaction: ${params.id}`)

    // Create mock timeline events
    const mockTimeline = [
      {
        id: "tl-1",
        transaction_id: params.id,
        status: "Created",
        user_id: 1,
        department: "Finance",
        notes: "Transaction created",
        created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      },
      {
        id: "tl-2",
        transaction_id: params.id,
        status: "Reviewed",
        user_id: 2,
        department: "Audit",
        notes: "Transaction reviewed and forwarded for approval",
        created_at: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
      },
    ]

    return NextResponse.json(mockTimeline)
  } catch (error) {
    console.error("Error in timeline API route:", error)
    return NextResponse.json([], { status: 200 }) // Return empty array with 200 status
  }
}
