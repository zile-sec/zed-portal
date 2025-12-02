import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Demo user data as a fallback when database is unreachable
const demoUsers = [
  {
    id: 1,
    email: "finance@example.com",
    first_name: "John",
    last_name: "Financial",
    department: "Finance Department",
    role: "Finance Manager",
  },
  {
    id: 2,
    email: "lands@example.com",
    first_name: "Mary",
    last_name: "Surveyor",
    department: "Lands Department",
    role: "Lands Commissioner",
  },
  {
    id: 3,
    email: "admin@example.com",
    first_name: "David",
    last_name: "Administrator",
    department: "IT Department",
    role: "System Administrator",
  },
  {
    id: 4,
    email: "health@example.com",
    first_name: "Sarah",
    last_name: "Medical",
    department: "Health Department",
    role: "Health Director",
  },
]

// Mapping of emails to passwords for demo purposes
const credentialsMap = {
  "finance@example.com": "Finance123",
  "lands@example.com": "Lands123",
  "admin@example.com": "Admin123",
  "health@example.com": "Health123",
}

export async function POST(request: NextRequest) {
  try {
    console.log("Login API called")

    // Parse request body
    const body = await request.json()
    const { email, password } = body

    console.log(`Login attempt for email: ${email}`)

    if (!email || !password) {
      console.log("Login failed: Email and password are required")
      return NextResponse.json({ success: false, message: "Email and password are required" }, { status: 400 })
    }

    // Simple direct validation without database
    const isValidCredentials = credentialsMap[email] === password

    if (isValidCredentials) {
      // Find the user in our demo data
      const demoUser = demoUsers.find((user) => user.email === email)

      if (demoUser) {
        console.log(`Login successful for email: ${email}`)
        return NextResponse.json({
          success: true,
          user: demoUser,
        })
      }
    }

    console.log(`Login failed: Invalid credentials for email: ${email}`)
    return NextResponse.json({ success: false, message: "Invalid email or password" }, { status: 401 })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { success: false, message: "An error occurred during login. Please try again." },
      { status: 500 },
    )
  }
}
