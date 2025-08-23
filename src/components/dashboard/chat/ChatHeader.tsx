import { Phone, Video, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";

interface ChatHeaderProps {
  chatName: string;
  chatAvatar: string;
  onlineStatus: string;
  onAvatarClick: () => void;
}

export default function ChatHeader({ chatName, chatAvatar, onlineStatus, onAvatarClick }: ChatHeaderProps) {
  return (
    <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5 backdrop-blur-lg">
      <motion.div
        className="flex items-center gap-3 cursor-pointer"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
        onClick={onAvatarClick}
      >
        <Avatar className="w-10 h-10 border-2 border-primary/20">
          <AvatarImage src={chatAvatar} />
          <AvatarFallback>{chatName[0]}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-medium text-white">{chatName}</h3>
          <p className="text-sm text-green-400 flex items-center gap-1">
            <motion.span
              className="w-2 h-2 bg-green-500 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            />
            {onlineStatus}
          </p>
        </div>
      </motion.div>

      <div className="flex items-center gap-2">
        <Button size="icon" variant="ghost" className="hover:bg-primary/20 hover:scale-110 transition-all">
          <Phone className="w-4 h-4 text-primary" />
        </Button>
        <Button size="icon" variant="ghost" className="hover:bg-primary/20 hover:scale-110 transition-all">
          <Video className="w-4 h-4 text-primary" />
        </Button>
        <Button size="icon" variant="ghost" className="hover:bg-primary/20 hover:scale-110 transition-all">
          <MoreVertical className="w-4 h-4 text-primary" />
        </Button>
      </div>
    </div>
  );
}