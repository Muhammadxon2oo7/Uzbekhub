import { Phone, Video, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

interface ChatHeaderProps {
  chatName: string
  chatAvatar: string
  onlineStatus: string
}

export default function ChatHeader({ chatName, chatAvatar, onlineStatus }: ChatHeaderProps) {
  return (
    <div className="p-4 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-white/5 to-transparent">
      <div className="flex items-center gap-3">
        <Avatar className="w-10 h-10">
          <AvatarImage src={chatAvatar} />
          <AvatarFallback>{chatName[0]}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-medium text-text">{chatName}</h3>
          <p className="text-sm text-green-400 flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            {onlineStatus}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button size="icon" variant="ghost" className="hover:bg-white/10 hover:scale-110 transition-all">
          <Phone className="w-4 h-4" />
        </Button>
        <Button size="icon" variant="ghost" className="hover:bg-white/10 hover:scale-110 transition-all">
          <Video className="w-4 h-4" />
        </Button>
        <Button size="icon" variant="ghost" className="hover:bg-white/10 hover:scale-110 transition-all">
          <MoreVertical className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}