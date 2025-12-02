import { type NextRequest, NextResponse } from "next/server"
import { getUserActivityLog } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const activityLog = await getUserActivityLog(Number.parseInt(params.id))

    return NextResponse.json(activityLog)
  } catch (error) {
    console.error("Error fetching user activity log:", error)
    return NextResponse.json({ error: "Failed to fetch user activity log" }, { status: 500 })
  }
}
