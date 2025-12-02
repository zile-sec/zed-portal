import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.NEON_NEON_DATABASE_URL!)

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = Number.parseInt(params.id)
    const { first_name, last_name, phone, location, bio } = await request.json()

    // Update user profile using tagged template literals
    const result = await sql`
      UPDATE users 
      SET first_name = ${first_name}, last_name = ${last_name}, phone = ${phone}, 
          location = ${location}, bio = ${bio}, updated_at = NOW()
      WHERE id = ${userId}
      RETURNING *
    `

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Remove sensitive data before returning
    const { password_hash, ...userWithoutPassword } = result.rows[0]
    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}
