"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

type User = {
  id: number
  email: string
  first_name: string
  last_name: string
  department: string
  role: string
}

type AuthContextType = {
  user: User | null
  loading: boolean
  login: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; message: string; locked?: boolean; lockTimer?: number }>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    console.log("Auth provider initializing")

    // Check if user is stored in session storage
    const storedUser = sessionStorage.getItem("user")
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        console.log("Found stored user:", parsedUser)
        setUser(parsedUser)
      } catch (error) {
        console.error("Error parsing stored user:", error)
        sessionStorage.removeItem("user")
      }
    } else {
      console.log("No stored user found")
    }

    // Set a timeout to ensure loading state is not stuck
    const timer = setTimeout(() => {
      setLoading(false)
      console.log("Auth loading completed")
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      console.log(`Attempting to login with email: ${email}`)

      // For demo purposes, let's create mock users if they don't exist
      if (email === "admin@example.com" && password === "Admin123") {
        const adminUser = {
          id: 1,
          email: "admin@example.com",
          first_name: "Admin",
          last_name: "User",
          department: "admin",
          role: "admin",
        }

        setUser(adminUser)
        sessionStorage.setItem("user", JSON.stringify(adminUser))

        // Add a cookie for the middleware
        document.cookie = "session=true; path=/; max-age=86400" // 24 hours

        console.log("Admin login successful")
        return { success: true, message: "Login successful" }
      }

      if (email === "finance@example.com" && password === "Finance123") {
        const financeUser = {
          id: 2,
          email: "finance@example.com",
          first_name: "Finance",
          last_name: "User",
          department: "finance",
          role: "user",
        }

        setUser(financeUser)
        sessionStorage.setItem("user", JSON.stringify(financeUser))

        // Add a cookie for the middleware
        document.cookie = "session=true; path=/; max-age=86400" // 24 hours

        console.log("Finance login successful")
        return { success: true, message: "Login successful" }
      }

      // Try the API login if the hardcoded credentials don't match
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      // Immediately convert response to text to handle any parsing errors
      const responseText = await response.text()

      // Try to parse the response as JSON
      let data
      try {
        data = JSON.parse(responseText)
      } catch (e) {
        console.error("Failed to parse response as JSON:", responseText)
        return {
          success: false,
          message: "Server returned invalid data. Please try again.",
        }
      }

      console.log("Login response:", data)

      if (data.success && data.user) {
        setUser(data.user)
        sessionStorage.setItem("user", JSON.stringify(data.user))

        // Add a cookie for the middleware
        document.cookie = "session=true; path=/; max-age=86400" // 24 hours

        return { success: true, message: "Login successful" }
      }

      return {
        success: false,
        message: data.message || "Login failed. Please try again.",
      }
    } catch (error) {
      console.error("Login error:", error)
      return {
        success: false,
        message: "An error occurred during login. Please try again.",
      }
    }
  }

  // Simplified logout function to avoid fetch errors
  const logout = () => {
    console.log("Logging out")

    // Clear client-side state
    setUser(null)
    sessionStorage.removeItem("user")

    // Clear the session cookie on the client side
    document.cookie = "session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"

    // Navigate to login page
    router.push("/login")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
