"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function AuthTestPage() {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    console.log("Auth Test Page - Auth State:", {
      user,
      isAuthenticated,
      loading,
      sessionStorage: typeof window !== "undefined" ? sessionStorage.getItem("user") : null,
      cookies: document.cookie,
    })
  }, [user, isAuthenticated, loading])

  const handleGoToDashboard = () => {
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">Authentication Test Page</h1>

        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-md">
            <p className="font-medium">
              Loading: <span className="font-normal">{loading ? "Yes" : "No"}</span>
            </p>
            <p className="font-medium">
              Authenticated: <span className="font-normal">{isAuthenticated ? "Yes" : "No"}</span>
            </p>
            <p className="font-medium">
              User: <span className="font-normal">{user ? `${user.first_name} ${user.last_name}` : "None"}</span>
            </p>
          </div>

          {isAuthenticated ? (
            <div className="p-4 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-800">You are authenticated!</p>
              <div className="mt-2">
                <button
                  onClick={handleGoToDashboard}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800">You are not authenticated.</p>
              <div className="mt-2">
                <button
                  onClick={() => router.push("/login")}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Go to Login
                </button>
              </div>
            </div>
          )}

          <div className="mt-4">
            <h2 className="text-lg font-medium mb-2">Debug Information:</h2>
            <pre className="p-3 bg-gray-100 rounded-md text-xs overflow-auto max-h-40">
              {JSON.stringify({ user, isAuthenticated, loading }, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
