import { type NextRequest, NextResponse } from "next/server"
import { updateDocumentStatus } from "@/lib/db"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { status, userId } = await request.json()

    if (!status || !userId) {
      return NextResponse.json({ error: "Status and userId are required" }, { status: 400 })
    }

    const updatedDocument = await updateDocumentStatus(params.id, status, userId)

    if (!updatedDocument) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

    return NextResponse.json(updatedDocument)
  } catch (error) {
    console.error("Error updating document status:", error)
    return NextResponse.json({ error: "Failed to update document status" }, { status: 500 })
  }
}
