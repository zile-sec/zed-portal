"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { LogOut } from "lucide-react"

export function LogoutButton() {
  const { logout } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await logout()
    } catch (error) {
      console.error("Error during logout:", error)
      setIsLoggingOut(false)
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full"
    >
      {isLoggingOut ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-gray-500 mr-2"></div>
          <span>Logging out...</span>
        </>
      ) : (
        <>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </>
      )}
    </button>
  )
}
