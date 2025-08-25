import { useState } from "react"
import { motion } from "framer-motion"
import Image from 'next/image'
import {
  Play,
  Pause,
  Check,
  CheckCheck,
  Smile,
  Reply,
  Forward,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export  interface Message {
  id: string
  sender: string
  content: string
  time: string
  isOwn: boolean
  type: "text" | "image" | "voice"
  status?: "sent" | "delivered" | "read"
  caption?: string
  duration?: string
  reactions?: { emoji: string; count: number; users: string[] }[]
}

interface MessageBubbleProps {
  message: Message
  addReaction: (messageId: string, emoji: string) => void
}

const reactions = ["❤️", "👍", "😂", "😮", "😢", "😡"]

const MessageStatus = ({ status }: { status: string }) => {
  switch (status) {
    case "sent":
      return <Check className="w-3 h-3 text-gray-400" />
    case "delivered":
      return <CheckCheck className="w-3 h-3 text-gray-400" />
    case "read":
      return <CheckCheck className="w-3 h-3 text-blue-400" />
    default:
      return null
  }
}

const VoiceMessage = ({ duration, isOwn }: { duration: string; isOwn: boolean }) => {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <div className={`flex items-center gap-2 p-2 rounded-lg ${isOwn ? "bg-primary/20" : "bg-white/10"}`}>
      <Button size="icon" variant="ghost" className="w-8 h-8" onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
      </Button>
      <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
        <div className="h-full bg-primary w-1/3 rounded-full" /> {/* Simulating progress */}
      </div>
      <span className="text-xs text-gray-300">{duration}</span>
    </div>
  )
}

export default function MessageBubble({ message, addReaction }: MessageBubbleProps) {
  return (
    <div className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-xs lg:max-w-md group ${message.isOwn ? "order-2" : "order-1"}`}>
        <div
          className={`px-4 py-2 rounded-2xl relative ${
            message.isOwn ? "bg-gradient-to-r from-primary to-purple-500 text-white" : "bg-white/10 text-text"
          }`}
        >
          {message.type === "text" && <p className="text-sm">{message.content}</p>}

          {message.type === "image" && (
            <div className="space-y-2">
              <Image
                src={message.content}
                alt="Yuborilgan rasm"
                className="rounded-lg max-w-full h-auto"
                width={200} // Adjust width as needed
                height={150} // Adjust height as needed
              />
              {message.caption && <p className="text-sm">{message.caption}</p>}
            </div>
          )}

          {message.type === "voice" && <VoiceMessage duration={message.duration || "0:00"} isOwn={message.isOwn} />}

          <div
            className={`flex items-center justify-between mt-1 ${message.isOwn ? "text-white/70" : "text-gray-400"}`}
          >
            <p className="text-xs">{message.time}</p>
            {message.isOwn && <MessageStatus status={message.status || "sent"} />}
          </div>

          {/* Reactions */}
          {message.reactions && message.reactions.length > 0 && (
            <div className="absolute -bottom-4 right-2 flex gap-1">
              {message.reactions.map((reaction, idx) => (
                <motion.div
                  key={idx}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="bg-white/20 backdrop-blur-sm rounded-full px-2 py-1 text-xs flex items-center gap-1"
                >
                  <span>{reaction.emoji}</span>
                  <span>{reaction.count}</span>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Message Actions */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 mt-1">
          <Popover>
            <PopoverTrigger asChild>
              <Button size="icon" variant="ghost" className="w-6 h-6 hover:bg-white/10">
                <Smile className="w-3 h-3" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2 bg-white/10 backdrop-blur-md border-white/20">
              <div className="flex gap-1">
                {reactions.map((emoji) => (
                  <Button
                    key={emoji}
                    variant="ghost"
                    size="icon"
                    className="w-8 h-8 hover:scale-125 transition-transform"
                    onClick={() => addReaction(message.id, emoji)}
                  >
                    {emoji}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
          <Button size="icon" variant="ghost" className="w-6 h-6 hover:bg-white/10">
            <Reply className="w-3 h-3" />
          </Button>
          <Button size="icon" variant="ghost" className="w-6 h-6 hover:bg-white/10">
            <Forward className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  )
}