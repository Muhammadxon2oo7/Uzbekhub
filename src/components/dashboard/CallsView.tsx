"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Phone, PhoneIncoming, PhoneMissed, Search, PhoneOutgoing, PhoneOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useTranslation } from "react-i18next"

type CallType = "incoming" | "outgoing" | "missed"
type MediaType = "audio" | "video"

interface CallLog {
  id: string
  name: string
  avatar?: string
  time: string
  type: CallType
  media: MediaType
  duration?: string
}

export default function CallsView() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCallId, setActiveCallId] = useState<string | null>(null)
  const { t } = useTranslation("DashboardCalls")

  // 💾  Mock call history
  const callLogs: CallLog[] = [
    {
      id: "1",
      name: "Dilshod Rahimov",
      avatar: "/placeholder.svg?height=60&width=60",
      time: "Bugun, 14:30",
      type: "incoming",
      media: "audio",
      duration: "05:23",
    },
    {
      id: "2",
      name: "Malika Karimova",
      avatar: "/placeholder.svg?height=60&width=60",
      time: "Bugun, 10:14",
      type: "missed",
      media: "video",
    },
    {
      id: "3",
      name: "IT Developers UZ",
      avatar: "/placeholder.svg?height=60&width=60",
      time: "Kecha, 21:05",
      type: "outgoing",
      media: "audio",
      duration: "12:47",
    },
  ]

  const filteredCalls = callLogs.filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const getTypeIcon = (type: CallType) => {
    switch (type) {
      case "incoming":
        return <PhoneIncoming className="w-4 h-4 text-green-400" />
      case "outgoing":
        return <PhoneOutgoing className="w-4 h-4 text-blue-400" />
      case "missed":
        return <PhoneMissed className="w-4 h-4 text-red-400" />
      default:
        return null
    }
  }

  const getMediaBadge = (media: MediaType) => (
    <Badge
      className={`text-xs ${
        media === "audio"
          ? "bg-green-500/20 text-green-400 border-green-500/30"
          : "bg-purple-500/20 text-purple-400 border-purple-500/30"
      }`}
    >
      {media === "audio" ? "Audio" : "Video"}
    </Badge>
  )

  return (
    <div className="h-full overflow-hidden flex flex-col bg-white/5 backdrop-blur-[10px] border border-white/10 rounded-2xl">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center gap-3">
        <Phone className="w-6 h-6 text-primary" />
        <h1 className="text-xl font-bold text-text flex-1">{t("title")}</h1>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder={t("search")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/5 border-white/20 text-text h-9"
          />
        </div>
      </div>

      {/* Call list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredCalls.map((call, i) => (
          <motion.div
            key={call.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`flex items-center justify-between p-3 rounded-lg cursor-pointer ${
              activeCallId === call.id ? "bg-primary/10" : "hover:bg-white/10"
            }`}
            onClick={() => setActiveCallId(call.id)}
          >
            <div className="flex items-center gap-3 min-w-0">
              <Avatar className="w-10 h-10">
                <AvatarImage src={call.avatar || "/placeholder.svg"} />
                <AvatarFallback>{call.name[0]}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="font-medium text-text truncate flex items-center gap-1">
                  {call.name} {getTypeIcon(call.type)}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {call.time} {call.duration && `• ${call.duration}`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getMediaBadge(call.media)}
              <Button
                size="icon"
                variant="ghost"
                className="hover:bg-white/10"
                onClick={(e) => {
                  e.stopPropagation()
                  console.log("Call ended")
                  setActiveCallId(null)
                }}
              >
                <PhoneOff className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
