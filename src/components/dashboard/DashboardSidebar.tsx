"use client"

import { useRef, useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  MessageCircle,
  Users,
  User,
  MapPin,
  Heart,
  Settings,
  ChevronLeft,
  ChevronRight,
  Search,
  Bell,
  Camera,
  Phone,
  Sparkles,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import type { DashboardView } from "@/app/main/page"

interface DashboardSidebarProps {
  activeView: DashboardView
  setActiveView: (view: DashboardView) => void
  collapsed: boolean
  setCollapsed: (collapsed: boolean) => void
}

export default function DashboardSidebar({
  activeView,
  setActiveView,
  collapsed,
  setCollapsed,
}: DashboardSidebarProps) {
  const sidebarRef = useRef<HTMLDivElement>(null)
  const spotRef = useRef<HTMLDivElement>(null)
  const [currentTime, setCurrentTime] = useState(new Date())

  // Mock user data
  const user = {
    name: "Aziz Karimov",
    username: "@azizkarimov",
    avatar: "/placeholder.svg?height=40&width=40",
    location: "Toshkent, O'zbekiston",
    status: "Faol",
    mood: "😊",
  }

  const menuItems = [
    { id: "chat", icon: MessageCircle, label: "Suhbatlar", badge: 5, color: "text-blue-400" },
    { id: "stories", icon: Camera, label: "Hikoyalar", badge: 3, color: "text-purple-400" },
    { id: "calls", icon: Phone, label: "Qo'ng'iroqlar", badge: 2, color: "text-green-400" },
    { id: "groups", icon: Users, label: "Guruhlar", badge: 12, color: "text-orange-400" },
    { id: "discover", icon: MapPin, label: "Kashf etish", color: "text-pink-400" },
    { id: "donate", icon: Heart, label: "Xayriya", color: "text-red-400" },
    { id: "profile", icon: User, label: "Profil", color: "text-indigo-400" },
    { id: "settings", icon: Settings, label: "Sozlamalar", color: "text-gray-400" },
  ]

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  // Glass morphism hover effect
  useEffect(() => {
    const sidebar = sidebarRef.current
    const spot = spotRef.current
    if (!sidebar || !spot || collapsed) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = sidebar.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      spot.style.left = `${x - 60}px`
      spot.style.top = `${y - 60}px`
      spot.style.opacity = "0.4"
    }

    const handleMouseLeave = () => {
      spot.style.opacity = "0"
    }

    sidebar.addEventListener("mousemove", handleMouseMove)
    sidebar.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      sidebar.removeEventListener("mousemove", handleMouseMove)
      sidebar.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [collapsed])

  return (
    <motion.div
      ref={sidebarRef}
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1, width: collapsed ? 64 : 256 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="fixed left-0 top-0 h-screen bg-[#f7f7f726] backdrop-blur-[20px] border-r border-white/20 z-40 overflow-hidden"
    >
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full"
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 4 + i,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.5,
            }}
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + i * 10}%`,
            }}
          />
        ))}
      </div>

      {/* Hover spot effect */}
      <div
        ref={spotRef}
        className="pointer-events-none absolute w-32 h-32 rounded-full bg-gradient-to-r from-primary/20 to-purple-500/20 blur-2xl opacity-0 transition-opacity duration-300 z-0"
      />

      <div className="relative z-10 p-4 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2"
            >
              <div className="relative">
                <MessageCircle className="w-8 h-8 text-primary" />
                <motion.div
                  className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                />
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                  UzbekHub
                </span>
                <div className="text-xs text-gray-400">
                  {currentTime.toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            </motion.div>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="hover:bg-white/10 hover:rotate-180 transition-all duration-300"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        </div>

        {/* User Profile */}
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-4 mb-6 border border-white/20 backdrop-blur-sm"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="w-12 h-12 ring-2 ring-primary/30">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                <motion.div
                  className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                />
                <div className="absolute -top-1 -right-1 text-lg">{user.mood}</div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-text truncate">{user.name}</h3>
                <p className="text-sm text-gray-300 truncate">{user.username}</p>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <MapPin className="w-3 h-3" />
                  <span className="truncate">{user.location}</span>
                </div>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                <Zap className="w-3 h-3 mr-1" />
                {user.status}
              </Badge>
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">
                <Sparkles className="w-3 h-3 mr-1" />
                Pro
              </Badge>
            </div>
          </motion.div>
        )}

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Button
                variant={activeView === item.id ? "secondary" : "ghost"}
                className={`w-full justify-start gap-3 h-12 transition-all duration-300 group ${
                  activeView === item.id
                    ? "bg-gradient-to-r from-primary/30 to-purple-500/20 text-primary border border-primary/30 shadow-lg"
                    : "hover:bg-white/10 text-text hover:scale-105"
                } ${collapsed ? "px-3" : "px-4"}`}
                onClick={() => setActiveView(item.id as DashboardView)}
              >
                <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                  <item.icon
                    className={`w-5 h-5 flex-shrink-0 ${item.color} group-hover:scale-110 transition-transform`}
                  />
                </motion.div>
                {!collapsed && (
                  <>
                    <span className="flex-1 text-left font-medium">{item.label}</span>
                    <AnimatePresence>
                      {item.badge && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                          <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs shadow-lg">
                            {item.badge}
                          </Badge>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                )}
              </Button>
            </motion.div>
          ))}
        </nav>

        {!collapsed && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6 space-y-2">
            <Button variant="ghost" className="w-full justify-start gap-3 h-10 hover:bg-white/10 text-text group">
              <Search className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>Qidirish</span>
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3 h-10 hover:bg-white/10 text-text group">
              <Bell className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>Bildirishnomalar</span>
              <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs ml-auto shadow-lg">
                8
              </Badge>
            </Button>
          </motion.div>
        )}

     
        {!collapsed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 pt-4 border-t border-white/10">
            <div className="text-center text-xs text-gray-400">
              <p>UzbekHub v2.0</p>
              <p>© 2024 Barcha huquqlar himoyalangan</p>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
