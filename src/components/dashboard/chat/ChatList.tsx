import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useTranslation } from "react-i18next"

interface Chat {
  id: string
  name: string
  avatar: string
  lastMessage: string
  time: string
  unread: number
  online: boolean
  typing: boolean
  lastSeen: string
  isGroup?: boolean
}

interface ChatListProps {
  chats: Chat[]
  selectedChat: string | null
  setSelectedChat: (id: string) => void
}

export default function ChatList({ chats, selectedChat, setSelectedChat }: ChatListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const { t } = useTranslation("dashboardChatList")

  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="w-80 border-r border-white/10 flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-text">{t("title")}</h2>
          <Button
            size="icon"
            variant="ghost"
            className="hover:bg-white/10 hover:rotate-90 transition-all duration-300"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder={`${t("search")} ...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/5 border-white/20 text-text"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        {filteredChats.map((chat, index) => (
          <motion.div
            key={chat.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 cursor-pointer transition-all duration-300 border-b border-white/5 ${
              selectedChat === chat.id
                ? "bg-gradient-to-r from-primary/20 to-purple-500/10 border-l-4 border-l-primary"
                : "hover:bg-white/5"
            }`}
            onClick={() => setSelectedChat(chat.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={chat.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{chat.name[0]}</AvatarFallback>
                </Avatar>
                {chat.online && (
                  <motion.div
                    className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-text truncate">{chat.name}</h3>
                  <span className="text-xs text-gray-400">{chat.time}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {chat.typing && (
                      <motion.div
                        className="flex gap-1"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                      >
                        <div className="w-1 h-1 bg-primary rounded-full" />
                        <div className="w-1 h-1 bg-primary rounded-full" />
                        <div className="w-1 h-1 bg-primary rounded-full" />
                      </motion.div>
                    )}
                    <p className="text-sm text-gray-300 truncate">{chat.typing ? "yozmoqda..." : chat.lastMessage}</p>
                  </div>
                  {chat.unread > 0 && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} whileHover={{ scale: 1.1 }}>
                      <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs">
                        {chat.unread}
                      </Badge>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}