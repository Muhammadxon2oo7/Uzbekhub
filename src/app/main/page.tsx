// "use client"
// import Dashboard from "@/components/dashboard/Main"
// import { Suspense } from "react"

// export default function MainPage() {
//   return (
//     <Suspense fallback={<div>Loading...</div>}>
//       <Dashboard />
//     </Suspense>
//   )
// }

"use client"

import dynamic from "next/dynamic"

// Dashboard ni dinamik import qilish, SSR ni o‘chirish
const Dashboard = dynamic(() => import("@/components/dashboard/Main"), {
  ssr: false,
  loading: () => (
    <div className="h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
    </div>
  ),
})

export default function MainPage() {
  return <Dashboard />
}