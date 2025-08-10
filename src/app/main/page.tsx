"use client"
import Dashboard from "@/components/dashboard/Main"
import { Suspense } from "react"

export default function MainPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Dashboard />
    </Suspense>
  )
}