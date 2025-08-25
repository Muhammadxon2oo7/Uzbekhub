// import { useState, useRef } from "react"
// import { motion, AnimatePresence } from "framer-motion"
// import { Send, Paperclip, Mic, ImageIcon, File, Camera, MapPin, Smile } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// import { Textarea } from "@/components/ui/textarea"

// interface MessageInputProps {
//   message: string
//   setMessage: (message: string) => void
//   handleSendMessage: () => void
//   handleFileUpload: (type: string) => void
//   handleVoiceRecord: () => void
//   isRecording: boolean
//   fileInputRef: React.RefObject<HTMLInputElement | null> // <- `| null` qo'shildi
// }

// const emojis = ["😀", "😂", "😍", "🤔", "👍", "👎", "❤️", "🔥", "💯", "🎉", "😊", "😎"]

// export default function MessageInput({
//   message,
//   setMessage,
//   handleSendMessage,
//   handleFileUpload,
//   handleVoiceRecord,
//   isRecording,
//   fileInputRef,
// }: MessageInputProps) {
//   const [showEmojiPicker, setShowEmojiPicker] = useState(false)

//   return (
//     <div className="p-4 border-t border-white/10 bg-gradient-to-r from-white/5 to-transparent">
//       <div className="flex items-end gap-2">
//         {/* Attachment Menu */}
//         <Popover>
//           <PopoverTrigger asChild>
//             <Button size="icon" variant="ghost" className="hover:bg-white/10 hover:rotate-45 transition-all">
//               <Paperclip className="w-4 h-4" />
//             </Button>
//           </PopoverTrigger>
//           <PopoverContent className="w-auto p-2 bg-white/10 backdrop-blur-md border-white/20">
//             <div className="grid grid-cols-2 gap-2">
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 className="flex flex-col gap-1 h-auto p-3 hover:bg-white/10"
//                 onClick={() => handleFileUpload("image")}
//               >
//                 <ImageIcon className="w-5 h-5 text-blue-400" />
//                 <span className="text-xs">Rasm</span>
//               </Button>
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 className="flex flex-col gap-1 h-auto p-3 hover:bg-white/10"
//                 onClick={() => handleFileUpload("file")}
//               >
//                 <File className="w-5 h-5 text-green-400" />
//                 <span className="text-xs">Fayl</span>
//               </Button>
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 className="flex flex-col gap-1 h-auto p-3 hover:bg-white/10"
//                 onClick={() => handleFileUpload("camera")}
//               >
//                 <Camera className="w-5 h-5 text-purple-400" />
//                 <span className="text-xs">Kamera</span>
//               </Button>
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 className="flex flex-col gap-1 h-auto p-3 hover:bg-white/10"
//                 onClick={() => handleFileUpload("location")}
//               >
//                 <MapPin className="w-5 h-5 text-red-400" />
//                 <span className="text-xs">Joylashuv</span>
//               </Button>
//             </div>
//           </PopoverContent>
//         </Popover>

//         {/* Message Input */}
//         <div className="flex-1 relative">
//           <Textarea
//             placeholder="Xabar yozing..."
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
//             className="min-h-[40px] max-h-32 bg-white/5 border-white/20 text-text resize-none pr-10"
//             rows={1}
//           />

//           {/* Emoji Picker */}
//           <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
//             <PopoverTrigger asChild>
//               <Button
//                 size="icon"
//                 variant="ghost"
//                 className="absolute right-2 top-1/2 transform -translate-y-1/2 w-6 h-6 hover:bg-white/10"
//               >
//                 <Smile className="w-4 h-4" />
//               </Button>
//             </PopoverTrigger>
//             <PopoverContent className="w-auto p-2 bg-white/10 backdrop-blur-md border-white/20">
//               <div className="grid grid-cols-6 gap-1">
//                 {emojis.map((emoji) => (
//                   <Button
//                     key={emoji}
//                     variant="ghost"
//                     size="icon"
//                     className="w-8 h-8 hover:scale-125 transition-transform"
//                     onClick={() => {
//                       setMessage(message + emoji)
//                       setShowEmojiPicker(false)
//                     }}
//                   >
//                     {emoji}
//                   </Button>
//                 ))}
//               </div>
//             </PopoverContent>
//           </Popover>
//         </div>

//         {/* Voice/Send Button */}
//         {message.trim() ? (
//           <Button
//             onClick={handleSendMessage}
//             className="bg-gradient-to-r from-primary to-purple-500 hover:scale-110 transition-all"
//             size="icon"
//           >
//             <Send className="w-4 h-4" />
//           </Button>
//         ) : (
//           <Button
//             onClick={handleVoiceRecord}
//             className={`transition-all ${
//               isRecording
//                 ? "bg-red-500 hover:bg-red-600 animate-pulse"
//                 : "bg-gradient-to-r from-green-500 to-blue-500 hover:scale-110"
//             }`}
//             size="icon"
//           >
//             <Mic className="w-4 h-4" />
//           </Button>
//         )}
//       </div>

//       {/* Recording Indicator */}
//       <AnimatePresence>
//         {isRecording && (
//           <motion.div
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: 10 }}
//             className="mt-2 flex items-center gap-2 text-red-400"
//           >
//             <motion.div
//               animate={{ scale: [1, 1.2, 1] }}
//               transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
//               className="w-2 h-2 bg-red-500 rounded-full"
//             />
//             <span className="text-sm">Ovoz yozilmoqda...</span>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   )
// }



// import { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Send, Paperclip, Mic, ImageIcon, File, Camera, MapPin, Smile, X } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { Textarea } from "@/components/ui/textarea";
// import { Message } from "./MessageBubble";

// interface MessageInputProps {
//   message: string;
//   setMessage: (message: string) => void;
//   handleSendMessage: () => void;
//   handleFileUpload: (type: string) => void;
//   handleVoiceRecord: () => void;
//   isRecording: boolean;
//   fileInputRef: React.RefObject<HTMLInputElement>;
//   replyTo: Message | null;
//   clearReply: () => void;
// }

// const emojis = ["😀", "😂", "😍", "🤔", "👍", "👎", "❤️", "🔥", "💯", "🎉", "😊", "😎"];

// export default function MessageInput({
//   message,
//   setMessage,
//   handleSendMessage,
//   handleFileUpload,
//   handleVoiceRecord,
//   isRecording,
//   fileInputRef,
//   replyTo,
//   clearReply,
// }: MessageInputProps) {
//   const [showEmojiPicker, setShowEmojiPicker] = useState(false);

//   return (
//     <div className="p-4 border-t border-white/10 bg-gradient-to-r from-white/5 to-transparent">
//       {replyTo && (
//         <motion.div
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="mb-2 p-2 bg-white/10 rounded-lg flex items-center justify-between"
//         >
//           <div>
//             <p className="text-xs text-gray-400">Javob: {replyTo.sender}</p>
//             <p className="text-sm truncate">{replyTo.content}</p>
//           </div>
//           <Button size="icon" variant="ghost" onClick={clearReply} className="hover:bg-white/20">
//             <X className="w-4 h-4" />
//           </Button>
//         </motion.div>
//       )}
//       <div className="flex items-end gap-2">
//         <Popover>
//           <PopoverTrigger asChild>
//             <Button size="icon" variant="ghost" className="hover:bg-white/10 hover:rotate-45 transition-all">
//               <Paperclip className="w-4 h-4" />
//             </Button>
//           </PopoverTrigger>
//           <PopoverContent className="w-auto p-2 bg-white/10 backdrop-blur-md border-white/20">
//             <div className="grid grid-cols-2 gap-2">
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 className="flex flex-col gap-1 h-auto p-3 hover:bg-white/10"
//                 onClick={() => handleFileUpload("image")}
//               >
//                 <ImageIcon className="w-5 h-5 text-blue-400" />
//                 <span className="text-xs">Rasm</span>
//               </Button>
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 className="flex flex-col gap-1 h-auto p-3 hover:bg-white/10"
//                 onClick={() => handleFileUpload("file")}
//               >
//                 <File className="w-5 h-5 text-green-400" />
//                 <span className="text-xs">Fayl</span>
//               </Button>
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 className="flex flex-col gap-1 h-auto p-3 hover:bg-white/10"
//                 onClick={() => handleFileUpload("camera")}
//               >
//                 <Camera className="w-5 h-5 text-purple-400" />
//                 <span className="text-xs">Kamera</span>
//               </Button>
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 className="flex flex-col gap-1 h-auto p-3 hover:bg-white/10"
//                 onClick={() => handleFileUpload("location")}
//               >
//                 <MapPin className="w-5 h-5 text-red-400" />
//                 <span className="text-xs">Joylashuv</span>
//               </Button>
//             </div>
//           </PopoverContent>
//         </Popover>

//         <div className="flex-1 relative">
//           <Textarea
//             placeholder="Xabar yozing..."
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
//             className="min-h-[40px] max-h-32 bg-white/5 border-white/20 text-text resize-none pr-10"
//             rows={1}
//           />
//           <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
//             <PopoverTrigger asChild>
//               <Button
//                 size="icon"
//                 variant="ghost"
//                 className="absolute right-2 top-1/2 transform -translate-y-1/2 w-6 h-6 hover:bg-white/10"
//               >
//                 <Smile className="w-4 h-4" />
//               </Button>
//             </PopoverTrigger>
//             <PopoverContent className="w-auto p-2 bg-white/10 backdrop-blur-md border-white/20">
//               <div className="grid grid-cols-6 gap-1">
//                 {emojis.map((emoji) => (
//                   <Button
//                     key={emoji}
//                     variant="ghost"
//                     size="icon"
//                     className="w-8 h-8 hover:scale-125 transition-transform"
//                     onClick={() => {
//                       setMessage(message + emoji);
//                       setShowEmojiPicker(false);
//                     }}
//                   >
//                     {emoji}
//                   </Button>
//                 ))}
//               </div>
//             </PopoverContent>
//           </Popover>
//         </div>

//         {message.trim() ? (
//           <Button
//             onClick={handleSendMessage}
//             className="bg-gradient-to-r from-primary to-purple-500 hover:scale-110 transition-all"
//             size="icon"
//           >
//             <Send className="w-4 h-4" />
//           </Button>
//         ) : (
//           <Button
//             onClick={handleVoiceRecord}
//             className={`transition-all ${
//               isRecording
//                 ? "bg-red-500 hover:bg-red-600 animate-pulse"
//                 : "bg-gradient-to-r from-green-500 to-blue-500 hover:scale-110"
//             }`}
//             size="icon"
//           >
//             <Mic className="w-4 h-4" />
//           </Button>
//         )}
//       </div>

//       <AnimatePresence>
//         {isRecording && (
//           <motion.div
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: 10 }}
//             className="mt-2 flex items-center gap-2 text-red-400"
//           >
//             <motion.div
//               animate={{ scale: [1, 1.2, 1] }}
//               transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
//               className="w-2 h-2 bg-red-500 rounded-full"
//             />
//             <span className="text-sm">Ovoz yozilmoqda...</span>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }
import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Paperclip, Mic, ImageIcon, File, Camera, MapPin, Smile } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { useTranslation } from "react-i18next"

interface MessageInputProps {
  message: string
  setMessage: (message: string) => void
  handleSendMessage: () => void
  handleFileUpload: (type: string) => void
  handleVoiceRecord: () => void
  isRecording: boolean
  fileInputRef: React.RefObject<HTMLInputElement | null> // <- `| null` qo'shildi
}

const emojis = ["😀", "😂", "😍", "🤔", "👍", "👎", "❤️", "🔥", "💯", "🎉", "😊", "😎"]

export default function MessageInput({
  message,
  setMessage,
  handleSendMessage,
  handleFileUpload,
  handleVoiceRecord,
  isRecording,
  fileInputRef,
}: MessageInputProps) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const { t } = useTranslation("DashboardChatList")

  return (
    <div className="p-4 border-t border-white/10 bg-gradient-to-r from-white/5 to-transparent">
      <div className="flex items-end gap-2">
        {/* Attachment Menu */}
        <Popover>
          <PopoverTrigger asChild>
            <Button size="icon" variant="ghost" className="hover:bg-white/10 hover:rotate-45 transition-all">
              <Paperclip className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2 bg-white/10 backdrop-blur-md border-white/20">
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="flex flex-col gap-1 h-auto p-3 hover:bg-white/10"
                onClick={() => handleFileUpload("image")}
              >
                <ImageIcon className="w-5 h-5 text-blue-400" />
                <span className="text-xs">Rasm</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex flex-col gap-1 h-auto p-3 hover:bg-white/10"
                onClick={() => handleFileUpload("file")}
              >
                <File className="w-5 h-5 text-green-400" />
                <span className="text-xs">Fayl</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex flex-col gap-1 h-auto p-3 hover:bg-white/10"
                onClick={() => handleFileUpload("camera")}
              >
                <Camera className="w-5 h-5 text-purple-400" />
                <span className="text-xs">Kamera</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex flex-col gap-1 h-auto p-3 hover:bg-white/10"
                onClick={() => handleFileUpload("location")}
              >
                <MapPin className="w-5 h-5 text-red-400" />
                <span className="text-xs">Joylashuv</span>
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Message Input */}
        <div className="flex-1 relative">
          <Textarea
            placeholder={t("messageInputPlaceholder")}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
            className="min-h-[40px] max-h-32 bg-white/5 border-white/20 text-text resize-none pr-10"
            rows={1}
          />

          {/* Emoji Picker */}
          <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
            <PopoverTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 w-6 h-6 hover:bg-white/10"
              >
                <Smile className="w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2 bg-white/10 backdrop-blur-md border-white/20">
              <div className="grid grid-cols-6 gap-1">
                {emojis.map((emoji) => (
                  <Button
                    key={emoji}
                    variant="ghost"
                    size="icon"
                    className="w-8 h-8 hover:scale-125 transition-transform"
                    onClick={() => {
                      setMessage(message + emoji)
                      setShowEmojiPicker(false)
                    }}
                  >
                    {emoji}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Voice/Send Button */}
        {message.trim() ? (
          <Button
            onClick={handleSendMessage}
            className="bg-gradient-to-r from-primary to-purple-500 hover:scale-110 transition-all"
            size="icon"
          >
            <Send className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            onClick={handleVoiceRecord}
            className={`transition-all ${
              isRecording
                ? "bg-red-500 hover:bg-red-600 animate-pulse"
                : "bg-gradient-to-r from-green-500 to-blue-500 hover:scale-110"
            }`}
            size="icon"
          >
            <Mic className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Recording Indicator */}
      <AnimatePresence>
        {isRecording && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-2 flex items-center gap-2 text-red-400"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
              className="w-2 h-2 bg-red-500 rounded-full"
            />
            <span className="text-sm">Ovoz yozilmoqda...</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}