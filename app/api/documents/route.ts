import { NextResponse } from "next/server"

// Mock documents data
const mockDocuments = [
  {
    id: "d1",
    title: "Annual Budget Proposal",
    department: "Finance Department",
    priority: "high",
    author_id: 1,
    status: "pending",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "d2",
    title: "Land Use Policy Update",
    department: "Lands Department",
    priority: "medium",
    author_id: 2,
    status: "pending",
    created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    updated_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "d3",
    title: "Healthcare Initiative Report",
    department: "Health Department",
    priority: "low",
    author_id: 4,
    status: "pending",
    created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    updated_at: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: "d4",
    title: "IT Infrastructure Upgrade Plan",
    department: "IT Department",
    priority: "high",
    author_id: 3,
    status: "approved",
    created_at: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    updated_at: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: "d5",
    title: "Employee Wellness Program",
    department: "Health Department",
    priority: "medium",
    author_id: 4,
    status: "approved",
    created_at: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
    updated_at: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    id: "d6",
    title: "Financial Audit Report",
    department: "Finance Department",
    priority: "high",
    author_id: 1,
    status: "rejected",
    created_at: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
    updated_at: new Date(Date.now() - 345600000).toISOString(),
  },
]

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")

    // Filter documents by status if provided
    let documents = mockDocuments
    if (status) {
      documents = documents.filter((doc) => doc.status === status)
    }

    return NextResponse.json(documents)
  } catch (error) {
    console.error("Error fetching documents:", error)
    return NextResponse.json({ error: "Failed to fetch documents" }, { status: 500 })
  }
}
