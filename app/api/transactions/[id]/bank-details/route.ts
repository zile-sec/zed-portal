import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    console.log(`Fetching bank details for transaction: ${params.id}`)

    // Create mock bank details
    const mockBankDetails = {
      id: "bd-1",
      transaction_id: params.id,
      bank_name: "National Bank",
      account_number: "****5678",
      account_name: "Vendor Company Ltd",
      swift_code: "NATBKZM",
      created_at: new Date().toISOString(),
    }

    return NextResponse.json(mockBankDetails)
  } catch (error) {
    console.error("Error in bank details API route:", error)
    return NextResponse.json(null, { status: 200 }) // Return null with 200 status
  }
}
