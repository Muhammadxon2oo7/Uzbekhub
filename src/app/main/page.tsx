// "use client"

// import { useState } from "react"
// import { motion, AnimatePresence } from "framer-motion"
// import DashboardSidebar from "@/components/dashboard/DashboardSidebar"
// import ChatView from "@/components/dashboard/chat/ChatView"
// import GroupsView from "@/components/dashboard/GroupsView"
// import ProfileView from "@/components/dashboard/ProfileView"
// import DiscoverView from "@/components/dashboard/DiscoverView"
// import DonateView from "@/components/dashboard/DonateView"
// import SettingsView from "@/components/dashboard/SettingsView"
// import StoriesView from "@/components/dashboard/StoriesView"
// import CallsView from "@/components/dashboard/CallsView"
// import { useSearchParams } from "next/navigation"


// export type DashboardView = "chat" | "groups" | "profile" | "discover" | "donate" | "settings" | "stories" | "calls"

// export default function Dashboard() {
//   const searchParams = useSearchParams();
//   const tab = searchParams.get("tab");

//   const [activeView, setActiveView] = useState<DashboardView>("chat")
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

//   const renderView = () => {
//     switch (activeView) {
//       case "chat":
//         return <ChatView />
//       case "groups":
//         return <GroupsView />
//       case "profile":
//         return <ProfileView />
//       case "discover":
//         return <DiscoverView />
//       case "donate":
//         return <DonateView />
//       case "settings":
//         return <SettingsView />
//       case "stories":
//         return <StoriesView />
//       case "calls":
//         return <CallsView />
//       default:
//         return <ChatView />
//     }
//   }

//   return (
//     <div className="bg-radial-[at_50%_75%] from-[100%_0_0] via-[var(--bggradient)] to-[var(--bgbradientstart)] to-90% min-h-screen flex">
//       <DashboardSidebar
//         activeView={activeView}
//         setActiveView={setActiveView}
//         collapsed={sidebarCollapsed}
//         setCollapsed={setSidebarCollapsed}
//       />

//       <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? "ml-16" : "ml-64"}`}>
//         <div className="p-6 h-screen overflow-hidden">
//           <AnimatePresence mode="wait">
//             <motion.div
//               key={activeView}
//               initial={{ opacity: 0, y: 20, scale: 0.95 }}
//               animate={{ opacity: 1, y: 0, scale: 1 }}
//               exit={{ opacity: 0, y: -20, scale: 0.95 }}
//               transition={{ duration: 0.4, ease: "easeInOut" }}
//               className="h-full"
//             >
//               {renderView()}
//             </motion.div>
//           </AnimatePresence>
//         </div>
//       </main>
//     </div>
//   )
// }


"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import DashboardSidebar from "@/components/dashboard/DashboardSidebar"
import ChatView from "@/components/dashboard/chat/ChatView"
import GroupsView from "@/components/dashboard/GroupsView"
import ProfileView from "@/components/dashboard/ProfileView"
import DiscoverView from "@/components/dashboard/DiscoverView"
import DonateView from "@/components/dashboard/DonateView"
import SettingsView from "@/components/dashboard/SettingsView"
import StoriesView from "@/components/dashboard/StoriesView"
import CallsView from "@/components/dashboard/CallsView"
import { useSearchParams } from "next/navigation"

export type DashboardView =
  | "chat"
  | "groups"
  | "profile"
  | "discover"
  | "donate"
  | "settings"
  | "stories"
  | "calls"

export default function Dashboard() {
  const searchParams = useSearchParams()
  const tab = searchParams.get("tab") as DashboardView | null

  // URL dagi tab bo‘yicha boshlang‘ich activeView ni o‘rnatamiz
  const [activeView, setActiveView] = useState<DashboardView>("chat")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  useEffect(() => {
    if (tab) {
      setActiveView(tab)
    }
  }, [tab])

  const renderView = () => {
    switch (activeView) {
      case "chat":
        return <ChatView />
      case "groups":
        return <GroupsView />
      case "profile":
        return <ProfileView />
      case "discover":
        return <DiscoverView />
      case "donate":
        return <DonateView />
      case "settings":
        return <SettingsView />
      case "stories":
        return <StoriesView />
      case "calls":
        return <CallsView />
      default:
        return <ChatView />
    }
  }

  return (
    <div className="bg-radial-[at_50%_75%] from-[100%_0_0] via-[var(--bggradient)] to-[var(--bgbradientstart)] to-90% min-h-screen flex">
      <DashboardSidebar
        activeView={activeView}
        setActiveView={setActiveView}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />

      <main
        className={`flex-1 transition-all duration-300 ${
          sidebarCollapsed ? "ml-16" : "ml-64"
        }`}
      >
        <div className="p-6 h-screen overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="h-full"
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}
