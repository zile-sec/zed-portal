"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, RefreshCw } from "lucide-react"

export default function FixTransactionsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{
    success?: boolean
    message?: string
    action?: string
    error?: string
    details?: string
  } | null>(null)

  const fixTransactionsTable = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/fix-transactions-table")
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({
        success: false,
        error: "Failed to fix transactions table",
        details: error.message,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Fix Transactions Table</CardTitle>
          <CardDescription>
            This utility will fix the transactions table schema issue without affecting your user accounts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>
              If you're seeing an error about the &quot;recipient&quot; column not existing, this utility will fix that
              by:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Checking if the transactions table exists</li>
              <li>Adding the missing recipient column if needed</li>
              <li>Preserving any existing data</li>
            </ul>

            {result && (
              <Alert variant={result.success ? "default" : "destructive"} className="mt-4">
                {result.success ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                <AlertTitle>{result.success ? "Success" : "Error"}</AlertTitle>
                <AlertDescription>
                  {result.message || result.error}
                  {result.details && <div className="text-sm mt-2 opacity-80">{result.details}</div>}
                  {result.action === "altered" && (
                    <div className="text-sm mt-2">
                      Note: Existing transactions have been updated with a default recipient value.
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={fixTransactionsTable} disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Fixing...
              </>
            ) : (
              "Fix Transactions Table"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
