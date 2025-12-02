"use client"

import type React from "react"

import { ActivityProvider } from "@/lib/activity-context"

export default function TransactionsLayout({ children }: { children: React.ReactNode }) {
  return <ActivityProvider>{children}</ActivityProvider>
}
