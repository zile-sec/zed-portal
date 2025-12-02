"use client"

import { useState } from "react"
import Link from "next/link"

export default function TestDbPage() {
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const testDatabaseConnection = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch("/api/test-db")
      const data = await response.json()

      setTestResult(data)
    } catch (err) {
      console.error("Error testing database connection:", err)
      setError("An error occurred while testing the database connection")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Database Connection Test</h1>

        <button
          onClick={testDatabaseConnection}
          disabled={isLoading}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
        >
          {isLoading ? "Testing..." : "Test Database Connection"}
        </button>

        {testResult && (
          <div className={`mt-4 p-4 rounded-md ${testResult.success ? "bg-green-100" : "bg-red-100"}`}>
            <p className={`font-medium ${testResult.success ? "text-green-800" : "text-red-800"}`}>
              {testResult.success ? "Success!" : "Failed!"}
            </p>
            <p className="mt-1 text-gray-700">{testResult.message}</p>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-100 rounded-md">
            <p className="font-medium text-red-800">Error</p>
            <p className="mt-1 text-gray-700">{error}</p>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link href="/login" className="text-green-600 hover:text-green-800">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  )
}
