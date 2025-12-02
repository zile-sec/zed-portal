import { type NextRequest, NextResponse } from "next/server"
import { getDocumentComments, addDocumentComment } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const comments = await getDocumentComments(params.id)

    return NextResponse.json(comments)
  } catch (error) {
    console.error("Error fetching document comments:", error)
    return NextResponse.json({ error: "Failed to fetch document comments" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { comment, userId, parentId } = await request.json()

    if (!comment || !userId) {
      return NextResponse.json({ error: "Comment and userId are required" }, { status: 400 })
    }

    const newComment = await addDocumentComment(params.id, userId, comment, parentId)

    return NextResponse.json(newComment)
  } catch (error) {
    console.error("Error adding document comment:", error)
    return NextResponse.json({ error: "Failed to add document comment" }, { status: 500 })
  }
}
