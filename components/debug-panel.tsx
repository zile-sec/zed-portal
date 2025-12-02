"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"

export function DebugPanel() {
  const { user, isAuthenticated, loading } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  if (process.env.NODE_ENV === "production") {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button onClick={() => setIsOpen(!isOpen)} className="bg-gray-800 text-white px-4 py-2 rounded-md text-sm">
        Debug
      </button>

      {isOpen && (
        <div className="absolute bottom-12 right-0 w-96 bg-white border border-gray-200 rounded-md shadow-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Debug Information</h3>

          <div className="mb-4">
            <h4 className="font-medium">Auth State:</h4>
            <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-40">
              {JSON.stringify({ isAuthenticated, loading, user }, null, 2)}
            </pre>
          </div>

          <div className="mb-4">
            <h4 className="font-medium">Session Storage:</h4>
            <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-40">
              {JSON.stringify(
                {
                  user: sessionStorage.getItem("user") ? JSON.parse(sessionStorage.getItem("user")) : null,
                },
                null,
                2,
              )}
            </pre>
          </div>

          <div className="flex justify-end">
            <button onClick={() => setIsOpen(false)} className="text-sm text-gray-600 hover:text-gray-900">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
