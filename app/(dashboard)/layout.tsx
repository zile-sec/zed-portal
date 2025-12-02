"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { ActivityProvider } from "@/lib/activity-context"
import { NotificationProvider } from "@/lib/notification-context"
import { AuthProvider, useAuth } from "@/lib/auth-context"

// Separate component for the authenticated content
function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const [isRedirecting, setIsRedirecting] = useState(false)

  useEffect(() => {
    console.log("Auth state in dashboard layout:", { isAuthenticated, loading, user })

    // Only redirect if not authenticated and not loading
    if (!loading && !isAuthenticated && !isRedirecting) {
      console.log("Not authenticated, redirecting to login")
      setIsRedirecting(true)
      router.push("/login")
    }
  }, [isAuthenticated, loading, router, isRedirecting])

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  // Show redirecting state
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  // Render the dashboard if authenticated
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="md:pl-64 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">{children}</div>
      </main>
    </div>
  )
}

// Main layout component
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <NotificationProvider>
        <ActivityProvider>
          <AuthenticatedLayout>{children}</AuthenticatedLayout>
        </ActivityProvider>
      </NotificationProvider>
    </AuthProvider>
  )
}
