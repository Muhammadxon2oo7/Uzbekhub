"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import dynamic from "next/dynamic"
import DashboardSidebar from "@/components/dashboard/DashboardSidebar"
import ChatView from "@/components/dashboard/chat/ChatView"
import GroupsView from "@/components/dashboard/GroupsView"
import DiscoverView from "@/components/dashboard/DiscoverView"
import DonateView from "@/components/dashboard/DonateView"
import SettingsView from "@/components/dashboard/SettingsView"
import StoriesView from "@/components/dashboard/StoriesView"
import CallsView from "@/components/dashboard/CallsView"
import { useSearchParams } from "next/navigation"
import ConnectionStatusBar from "./connection-status-bar"



const ProfileView = dynamic(() => import("@/components/dashboard/ProfileView"), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
    </div>
  ),
})

export type DashboardView =
  | "chat"
  | "groups"
  | "profile"
  | "discover"
  | "donate"
  | "settings"
  | "stories"
  | "calls"

// Cookie dan token olish funksiyasi
const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
};

export default function Dashboard() {
  const searchParams = useSearchParams()
  const tab = searchParams.get("tab") as DashboardView | null

  const [activeView, setActiveView] = useState<DashboardView>("chat")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const wsRef = useRef<WebSocket | null>(null);

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

 
      <ConnectionStatusBar isSidebarCollapsed={sidebarCollapsed} />

      <main
        className={`flex-1 transition-all duration-300 ${
          sidebarCollapsed ? "ml-16" : "ml-64"
        }`}
      >
        <div className="p-6 h-screen overflow-hidden relative">
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