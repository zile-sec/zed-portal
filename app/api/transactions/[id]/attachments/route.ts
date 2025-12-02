import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    console.log(`Fetching attachments for transaction: ${params.id}`)

    // Create mock attachments
    const mockAttachments = [
      {
        id: "att-1",
        transaction_id: params.id,
        file_name: "Invoice.pdf",
        file_url: "#",
        file_size: "245 KB",
        uploaded_at: new Date().toISOString(),
        uploaded_by: "John Doe",
      },
      {
        id: "att-2",
        transaction_id: params.id,
        file_name: "Contract.docx",
        file_url: "#",
        file_size: "128 KB",
        uploaded_at: new Date().toISOString(),
        uploaded_by: "John Doe",
      },
    ]

    return NextResponse.json(mockAttachments)
  } catch (error) {
    console.error("Error in attachments API route:", error)
    return NextResponse.json([], { status: 200 }) // Return empty array with 200 status
  }
}
