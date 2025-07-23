// "use client"

// import { useState, useRef, useEffect } from "react"
// import { motion, AnimatePresence } from "framer-motion"
// import {
//   Send,
//   Phone,
//   Video,
//   MoreVertical,
//   Search,
//   Plus,
//   MessageCircle,
//   Smile,
//   Paperclip,
//   Mic,
//   Camera,
//   File,
//   MapPin,
//   Reply,
//   Forward,
//   Play,
//   Pause,
//   Check,
//   CheckCheck,
//   ImageIcon,
// } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
// import { Badge } from "@/components/ui/badge"
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// import { Textarea } from "@/components/ui/textarea"
// import Image from 'next/image'
// export default function ChatView() {
//   const [selectedChat, setSelectedChat] = useState<string | null>("1")
//   const [message, setMessage] = useState("")
//   const [searchQuery, setSearchQuery] = useState("")
//   const [isRecording, setIsRecording] = useState(false)
//   const [isTyping, setIsTyping] = useState(false)
//   const [showEmojiPicker, setShowEmojiPicker] = useState(false)
//   const messagesEndRef = useRef<HTMLDivElement>(null)
//   const fileInputRef = useRef<HTMLInputElement>(null)

//   // Mock chat data
//   const chats = [
//     {
//       id: "1",
//       name: "Dilshod Rahimov",
//       avatar: "/placeholder.svg?height=40&width=40",
//       lastMessage: "Salom, qalaysan? 😊",
//       time: "2 daqiqa",
//       unread: 3,
//       online: true,
//       typing: false,
//       lastSeen: "Hozir faol",
//     },
//     {
//       id: "2",
//       name: "Malika Karimova",
//       avatar: "/placeholder.svg?height=40&width=40",
//       lastMessage: "🎵 Ovozli xabar",
//       time: "15 daqiqa",
//       unread: 0,
//       online: false,
//       typing: false,
//       lastSeen: "15 daqiqa oldin",
//     },
//     {
//       id: "3",
//       name: "IT Developers UZ",
//       avatar: "/placeholder.svg?height=40&width=40",
//       lastMessage: "📷 Rasm yuborildi",
//       time: "1 soat",
//       unread: 7,
//       online: true,
//       typing: true,
//       isGroup: true,
//       lastSeen: "Faol",
//     },
//   ]

//   const messages = [
//     {
//       id: "1",
//       sender: "Dilshod Rahimov",
//       content: "Salom! Qalaysan bugun? 😊",
//       time: "14:30",
//       isOwn: false,
//       type: "text",
//       status: "read",
//       reactions: [{ emoji: "👍", count: 2, users: ["Aziz", "Malika"] }],
//     },
//     {
//       id: "2",
//       sender: "Me",
//       content: "Salom! Yaxshi, rahmat. Sen-chi? Ishlar qanday ketayapti?",
//       time: "14:32",
//       isOwn: true,
//       type: "text",
//       status: "read",
//     },
//     {
//       id: "3",
//       sender: "Me",
//       content: "/images/elon.jpeg",
//       time: "14:33",
//       isOwn: true,
//       type: "image",
//       status: "delivered",
//       caption: "Bugun Samarqandda chiroyli manzara! 🏛️",
//     },
//     {
//       id: "4",
//       sender: "Dilshod Rahimov",
//       content: "Voy, qanday chiroyli! Men ham bormoqchiman tez orada 😍",
//       time: "14:35",
//       isOwn: false,
//       type: "text",
//       status: "read",
//       reactions: [{ emoji: "❤️", count: 1, users: ["Aziz"] }],
//     },
//     {
//       id: "5",
//       sender: "Dilshod Rahimov",
//       content: "voice_message_url",
//       time: "14:36",
//       isOwn: false,
//       type: "voice",
//       status: "read",
//       duration: "0:45",
//     },
//   ]

//   const reactions = ["❤️", "👍", "😂", "😮", "😢", "😡"]
//   const emojis = ["😀", "😂", "😍", "🤔", "👍", "👎", "❤️", "🔥", "💯", "🎉", "😊", "😎"]

//   const handleSendMessage = () => {
//     if (message.trim()) {
//       console.log("Xabar yuborilmoqda:", message)
//       setMessage("")
//     }
//   }

//   const handleFileUpload = (type: string) => {
//     console.log("Fayl yuklash:", type)
//     fileInputRef.current?.click()
//   }

//   const handleVoiceRecord = () => {
//     setIsRecording(!isRecording)
//     console.log("Ovoz yozish:", !isRecording)
//   }

//   const addReaction = (messageId: string, emoji: string) => {
//     console.log("Reaktsiya qo'shish:", messageId, emoji)
//   }

//   const filteredChats = chats.filter((chat) => chat.name.toLowerCase().includes(searchQuery.toLowerCase()))

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
//   }, [messages])

//   // Simulate typing indicator
//   useEffect(() => {
//     if (message.length > 0) {
//       setIsTyping(true)
//       const timer = setTimeout(() => setIsTyping(false), 1000)
//       return () => clearTimeout(timer)
//     }
//   }, [message])

//   const MessageStatus = ({ status }: { status: string }) => {
//     switch (status) {
//       case "sent":
//         return <Check className="w-3 h-3 text-gray-400" />
//       case "delivered":
//         return <CheckCheck className="w-3 h-3 text-gray-400" />
//       case "read":
//         return <CheckCheck className="w-3 h-3 text-blue-400" />
//       default:
//         return null
//     }
//   }

//   const VoiceMessage = ({ duration, isOwn }: { duration: string; isOwn: boolean }) => {
//     const [isPlaying, setIsPlaying] = useState(false)

//     return (
//       <div className={`flex items-center gap-2 p-2 rounded-lg ${isOwn ? "bg-primary/20" : "bg-white/10"}`}>
//         <Button size="icon" variant="ghost" className="w-8 h-8" onClick={() => setIsPlaying(!isPlaying)}>
//           {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
//         </Button>
//         <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
//           <div className="h-full bg-primary w-1/3 rounded-full" />
//         </div>
//         <span className="text-xs text-gray-300">{duration}</span>
//       </div>
//     )
//   }

//   return (
//     <div className="h-full flex bg-white/5 backdrop-blur-[10px] border border-white/10 rounded-2xl overflow-hidden">
//       {/* Chat List */}
//       <div className="w-80 border-r border-white/10 flex flex-col">
//         {/* Chat Header */}
//         <div className="p-4 border-b border-white/10">
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="text-xl font-semibold text-text">Suhbatlar</h2>
//             <Button
//               size="icon"
//               variant="ghost"
//               className="hover:bg-white/10 hover:rotate-90 transition-all duration-300"
//             >
//               <Plus className="w-4 h-4" />
//             </Button>
//           </div>

//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//             <Input
//               placeholder="Suhbatlarni qidirish..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="pl-10 bg-white/5 border-white/20 text-text"
//             />
//           </div>
//         </div>

//         {/* Chat List */}
//         <div className="flex-1 overflow-y-auto">
//           {filteredChats.map((chat, index) => (
//             <motion.div
//               key={chat.id}
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: index * 0.1 }}
//               className={`p-4 cursor-pointer transition-all duration-300 border-b border-white/5 ${
//                 selectedChat === chat.id
//                   ? "bg-gradient-to-r from-primary/20 to-purple-500/10 border-l-4 border-l-primary"
//                   : "hover:bg-white/5"
//               }`}
//               onClick={() => setSelectedChat(chat.id)}
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//             >
//               <div className="flex items-center gap-3">
//                 <div className="relative">
//                   <Avatar className="w-12 h-12">
//                     <AvatarImage src={chat.avatar || "/placeholder.svg"} />
//                     <AvatarFallback>{chat.name[0]}</AvatarFallback>
//                   </Avatar>
//                   {chat.online && (
//                     <motion.div
//                       className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"
//                       animate={{ scale: [1, 1.2, 1] }}
//                       transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
//                     />
//                   )}
//                 </div>

//                 <div className="flex-1 min-w-0">
//                   <div className="flex items-center justify-between">
//                     <h3 className="font-medium text-text truncate">{chat.name}</h3>
//                     <span className="text-xs text-gray-400">{chat.time}</span>
//                   </div>
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-1">
//                       {chat.typing && (
//                         <motion.div
//                           className="flex gap-1"
//                           animate={{ opacity: [0.5, 1, 0.5] }}
//                           transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
//                         >
//                           <div className="w-1 h-1 bg-primary rounded-full" />
//                           <div className="w-1 h-1 bg-primary rounded-full" />
//                           <div className="w-1 h-1 bg-primary rounded-full" />
//                         </motion.div>
//                       )}
//                       <p className="text-sm text-gray-300 truncate">{chat.typing ? "yozmoqda..." : chat.lastMessage}</p>
//                     </div>
//                     {chat.unread > 0 && (
//                       <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} whileHover={{ scale: 1.1 }}>
//                         <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs">
//                           {chat.unread}
//                         </Badge>
//                       </motion.div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           ))}
//         </div>
//       </div>

//       {/* Chat Area */}
//       {selectedChat ? (
//         <div className="flex-1 flex flex-col">
//           {/* Chat Header */}
//           <div className="p-4 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-white/5 to-transparent">
//             <div className="flex items-center gap-3">
//               <Avatar className="w-10 h-10">
//                 <AvatarImage src="/placeholder.svg?height=40&width=40" />
//                 <AvatarFallback>D</AvatarFallback>
//               </Avatar>
//               <div>
//                 <h3 className="font-medium text-text">Dilshod Rahimov</h3>
//                 <p className="text-sm text-green-400 flex items-center gap-1">
//                   <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
//                   Hozir faol
//                 </p>
//               </div>
//             </div>

//             <div className="flex items-center gap-2">
//               <Button size="icon" variant="ghost" className="hover:bg-white/10 hover:scale-110 transition-all">
//                 <Phone className="w-4 h-4" />
//               </Button>
//               <Button size="icon" variant="ghost" className="hover:bg-white/10 hover:scale-110 transition-all">
//                 <Video className="w-4 h-4" />
//               </Button>
//               <Button size="icon" variant="ghost" className="hover:bg-white/10 hover:scale-110 transition-all">
//                 <MoreVertical className="w-4 h-4" />
//               </Button>
//             </div>
//           </div>

//           {/* Messages */}
//           <div className="flex-1 overflow-y-auto p-4 space-y-4">
//             <AnimatePresence>
//               {messages.map((msg, index) => (
//                 <motion.div
//                   key={msg.id}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: index * 0.1 }}
//                   className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}
//                 >
//                   <div className={`max-w-xs lg:max-w-md group ${msg.isOwn ? "order-2" : "order-1"}`}>
//                     <div
//                       className={`px-4 py-2 rounded-2xl relative ${
//                         msg.isOwn ? "bg-gradient-to-r from-primary to-purple-500 text-white" : "bg-white/10 text-text"
//                       }`}
//                     >
//                       {msg.type === "text" && <p className="text-sm">{msg.content}</p>}

//                       {msg.type === "image" && (
//                         <div className="space-y-2">
//                           <Image
//                             src={msg.content}
//                             alt="Yuborilgan rasm"
//                             className="rounded-lg max-w-full h-auto"
//                             width={100}
//                             height={100}
//                           />
                        
//                           {msg.caption && <p className="text-sm">{msg.caption}</p>}
//                         </div>
//                       )}
                    
//                       {msg.type === "voice" && <VoiceMessage duration={msg.duration || "0:00"} isOwn={msg.isOwn} />}

//                       <div
//                         className={`flex items-center justify-between mt-1 ${msg.isOwn ? "text-white/70" : "text-gray-400"}`}
//                       >
//                         <p className="text-xs">{msg.time}</p>
                        
//                         {msg.isOwn && <MessageStatus status={msg.status || "sent"} />}
//                       </div>

//                       {/* Reactions */}
//                       {msg.reactions && msg.reactions.length > 0 && (
//                         <div className="absolute -bottom-4 right-2 flex gap-1"> 
//                           {msg.reactions.map((reaction, idx) => (
//                             <motion.div
//                               key={idx}
//                               initial={{ scale: 0 }}
//                               animate={{ scale: 1 }}
//                               className="bg-white/20 backdrop-blur-sm rounded-full px-2 py-1 text-xs flex items-center gap-1"
//                             >
//                               <span>{reaction.emoji}</span>
//                               <span>{reaction.count}</span>
//                             </motion.div>
//                           ))}
//                         </div>
//                       )}
//                     </div>

//                     {/* Message Actions */}
//                     <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 mt-1">
//                       <Popover>
//                         <PopoverTrigger asChild>
//                           <Button size="icon" variant="ghost" className="w-6 h-6 hover:bg-white/10">
//                             <Smile className="w-3 h-3" />
//                           </Button>
//                         </PopoverTrigger>
//                         <PopoverContent className="w-auto p-2 bg-white/10 backdrop-blur-md border-white/20">
//                           <div className="flex gap-1">
//                             {reactions.map((emoji) => (
//                               <Button
//                                 key={emoji}
//                                 variant="ghost"
//                                 size="icon"
//                                 className="w-8 h-8 hover:scale-125 transition-transform"
//                                 onClick={() => addReaction(msg.id, emoji)}
//                               >
//                                 {emoji}
//                               </Button>
//                             ))}
//                           </div>
//                         </PopoverContent>
//                       </Popover>
//                       <Button size="icon" variant="ghost" className="w-6 h-6 hover:bg-white/10">
//                         <Reply className="w-3 h-3" />
//                       </Button>
//                       <Button size="icon" variant="ghost" className="w-6 h-6 hover:bg-white/10">
//                         <Forward className="w-3 h-3" />
//                       </Button>
//                     </div>
//                   </div>
//                 </motion.div>
//               ))}
//             </AnimatePresence>
//             <div ref={messagesEndRef} />
//           </div>

//           {/* Message Input */}
//           <div className="p-4 border-t border-white/10 bg-gradient-to-r from-white/5 to-transparent">
//             <div className="flex items-end gap-2">
//               {/* Attachment Menu */}
//               <Popover>
//                 <PopoverTrigger asChild>
//                   <Button size="icon" variant="ghost" className="hover:bg-white/10 hover:rotate-45 transition-all">
//                     <Paperclip className="w-4 h-4" />
//                   </Button>
//                 </PopoverTrigger>
//                 <PopoverContent className="w-auto p-2 bg-white/10 backdrop-blur-md border-white/20">
//                   <div className="grid grid-cols-2 gap-2">
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       className="flex flex-col gap-1 h-auto p-3 hover:bg-white/10"
//                       onClick={() => handleFileUpload("image")}
//                     >
//                       <ImageIcon className="w-5 h-5 text-blue-400" />
//                       <span className="text-xs">Rasm</span>
//                     </Button>
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       className="flex flex-col gap-1 h-auto p-3 hover:bg-white/10"
//                       onClick={() => handleFileUpload("file")}
//                     >
//                       <File className="w-5 h-5 text-green-400" />
//                       <span className="text-xs">Fayl</span>
//                     </Button>
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       className="flex flex-col gap-1 h-auto p-3 hover:bg-white/10"
//                       onClick={() => handleFileUpload("camera")}
//                     >
//                       <Camera className="w-5 h-5 text-purple-400" />
//                       <span className="text-xs">Kamera</span>
//                     </Button>
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       className="flex flex-col gap-1 h-auto p-3 hover:bg-white/10"
//                       onClick={() => handleFileUpload("location")}
//                     >
//                       <MapPin className="w-5 h-5 text-red-400" />
//                       <span className="text-xs">Joylashuv</span>
//                     </Button>
//                   </div>
//                 </PopoverContent>
//               </Popover>

//               {/* Message Input */}
//               <div className="flex-1 relative">
//                 <Textarea
//                   placeholder="Xabar yozing..."
//                   value={message}
//                   onChange={(e) => setMessage(e.target.value)}
//                   onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
//                   className="min-h-[40px] max-h-32 bg-white/5 border-white/20 text-text resize-none pr-10"
//                   rows={1}
//                 />

//                 {/* Emoji Picker */}
//                 <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
//                   <PopoverTrigger asChild>
//                     <Button
//                       size="icon"
//                       variant="ghost"
//                       className="absolute right-2 top-1/2 transform -translate-y-1/2 w-6 h-6 hover:bg-white/10"
//                     >
//                       <Smile className="w-4 h-4" />
//                     </Button>
//                   </PopoverTrigger>
//                   <PopoverContent className="w-auto p-2 bg-white/10 backdrop-blur-md border-white/20">
//                     <div className="grid grid-cols-6 gap-1">
//                       {emojis.map((emoji) => (
//                         <Button
//                           key={emoji}
//                           variant="ghost"
//                           size="icon"
//                           className="w-8 h-8 hover:scale-125 transition-transform"
//                           onClick={() => {
//                             setMessage(message + emoji)
//                             setShowEmojiPicker(false)
//                           }}
//                         >
//                           {emoji}
//                         </Button>
//                       ))}
//                     </div>
//                   </PopoverContent>
//                 </Popover>
//               </div>

//               {/* Voice/Send Button */}
//               {message.trim() ? (
//                 <Button
//                   onClick={handleSendMessage}
//                   className="bg-gradient-to-r from-primary to-purple-500 hover:scale-110 transition-all"
//                   size="icon"
//                 >
//                   <Send className="w-4 h-4" />
//                 </Button>
//               ) : (
//                 <Button
//                   onClick={handleVoiceRecord}
//                   className={`transition-all ${
//                     isRecording
//                       ? "bg-red-500 hover:bg-red-600 animate-pulse"
//                       : "bg-gradient-to-r from-green-500 to-blue-500 hover:scale-110"
//                   }`}
//                   size="icon"
//                 >
//                   <Mic className="w-4 h-4" />
//                 </Button>
//               )}
//             </div>

//             {/* Recording Indicator */}
//             <AnimatePresence>
//               {isRecording && (
//                 <motion.div
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: 10 }}
//                   className="mt-2 flex items-center gap-2 text-red-400"
//                 >
//                   <motion.div
//                     animate={{ scale: [1, 1.2, 1] }}
//                     transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
//                     className="w-2 h-2 bg-red-500 rounded-full"
//                   />
//                   <span className="text-sm">Ovoz yozilmoqda...</span>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </div>

//           <input
//             ref={fileInputRef}
//             type="file"
//             className="hidden"
//             accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
//             onChange={(e) => console.log("Fayl tanlandi:", e.target.files)}
//           />
//         </div>
//       ) : (
//         <div className="flex-1 flex items-center justify-center">
//           <motion.div className="text-center" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
//             <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//             <h3 className="text-lg font-medium text-text mb-2">Suhbatni tanlang</h3>
//             <p className="text-gray-400">Xabar almashishni boshlash uchun suhbatni tanlang</p>
//           </motion.div>
//         </div>
//       )}
//     </div>
//   )
// }
/////////////////////////////


// "use client"

// import { useState, useRef, useEffect } from "react"
// import { AnimatePresence, motion } from "framer-motion"
// import { MessageCircle } from "lucide-react"

// // Import custom components
// import ChatList from "./ChatList"
// import ChatHeader from "./ChatHeader"
// import MessageInput from "./MessageInput"
// import MessageBubble from "./MessageBubble"
// import {Message} from "./MessageBubble"

// // Mock data (could be fetched from API in a real app)
// const mockChats = [
//   {
//     id: "1",
//     name: "Dilshod Rahimov",
//     avatar: "/placeholder.svg?height=40&width=40",
//     lastMessage: "Salom, qalaysan? 😊",
//     time: "2 daqiqa",
//     unread: 3,
//     online: true,
//     typing: false,
//     lastSeen: "Hozir faol",
//   },
//   {
//     id: "2",
//     name: "Malika Karimova",
//     avatar: "/placeholder.svg?height=40&width=40",
//     lastMessage: "🎵 Ovozli xabar",
//     time: "15 daqiqa",
//     unread: 0,
//     online: false,
//     typing: false,
//     lastSeen: "15 daqiqa oldin",
//   },
//   {
//     id: "3",
//     name: "IT Developers UZ",
//     avatar: "/placeholder.svg?height=40&width=40",
//     lastMessage: "📷 Rasm yuborildi",
//     time: "1 soat",
//     unread: 7,
//     online: true,
//     typing: true,
//     isGroup: true,
//     lastSeen: "Faol",
//   },
// ]

// const mockMessages: Message[] = [ 
//   {
//     id: "1",
//     sender: "Dilshod Rahimov",
//     content: "Salom! Qalaysan bugun? 😊",
//     time: "14:30",
//     isOwn: false,
//     type: "text",
//     status: "read",
//     reactions: [{ emoji: "👍", count: 2, users: ["Aziz", "Malika"] }],
//   },
//   {
//     id: "2",
//     sender: "Me",
//     content: "Salom! Yaxshi, rahmat. Sen-chi? Ishlar qanday ketayapti?",
//     time: "14:32",
//     isOwn: true,
//     type: "text",
//     status: "read",
//   },
//   {
//     id: "3",
//     sender: "Me",
//     content: "/images/elon.jpeg",
//     time: "14:33",
//     isOwn: true,
//     type: "image",
//     status: "delivered",
//     caption: "Bugun Samarqandda chiroyli manzara! 🏛️",
//   },
//   {
//     id: "4",
//     sender: "Dilshod Rahimov",
//     content: "Voy, qanday chiroyli! Men ham bormoqchiman tez orada 😍",
//     time: "14:35",
//     isOwn: false,
//     type: "text",
//     status: "read",
//     reactions: [{ emoji: "❤️", count: 1, users: ["Aziz"] }],
//   },
//   {
//     id: "5",
//     sender: "Dilshod Rahimov",
//     content: "voice_message_url",
//     time: "14:36",
//     isOwn: false,
//     type: "voice",
//     status: "read",
//     duration: "0:45",
//   },
// ]

// export default function ChatView() {
//   const [selectedChat, setSelectedChat] = useState<string | null>("1")
//   const [message, setMessage] = useState("")
//   const [isRecording, setIsRecording] = useState(false)
//   const [isTyping, setIsTyping] = useState(false) // Still useful for general typing status, though individual chat typing is in ChatList
//   const messagesEndRef = useRef<HTMLDivElement>(null)
//   const fileInputRef = useRef<HTMLInputElement>(null)

//   // Find the currently selected chat to pass its data to ChatHeader
//   const currentChat = mockChats.find((chat) => chat.id === selectedChat);


//   const handleSendMessage = () => {
//     if (message.trim()) {
//       console.log("Xabar yuborilmoqda:", message)
//       // In a real app, you would send this message to a backend and then update the messages state
//       // For now, let's just clear the input
//       setMessage("")
//     }
//   }

//   const handleFileUpload = (type: string) => {
//     console.log("Fayl yuklash:", type)
//     // Trigger the hidden file input
//     fileInputRef.current?.click()
//   }

//   const handleVoiceRecord = () => {
//     setIsRecording(!isRecording)
//     console.log("Ovoz yozish:", !isRecording)
//     // In a real app, you would start/stop actual audio recording here
//   }

//   const addReaction = (messageId: string, emoji: string) => {
//     console.log("Reaktsiya qo'shish:", messageId, emoji)
//     // In a real app, you would update the specific message's reactions state or send to backend
//   }

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
//   }, [mockMessages]) // Ensure messages are scrolled to bottom when they update

//   // Simulate typing indicator for the current user's input
//   useEffect(() => {
//     if (message.length > 0) {
//       setIsTyping(true)
//       const timer = setTimeout(() => setIsTyping(false), 1000)
//       return () => clearTimeout(timer)
//     }
//   }, [message])


//   return (
//     <div className="h-full flex bg-white/5 backdrop-blur-[10px] border border-white/10 rounded-2xl overflow-hidden">
//       {/* Chat List */}
//       <ChatList chats={mockChats} selectedChat={selectedChat} setSelectedChat={setSelectedChat} />

//       {/* Chat Area */}
//       {selectedChat && currentChat ? (
//         <div className="flex-1 flex flex-col">
//           {/* Chat Header */}
//           <ChatHeader
//             chatName={currentChat.name}
//             chatAvatar={currentChat.avatar}
//             onlineStatus={currentChat.lastSeen} // Using lastSeen as onlineStatus for display
//           />

//           {/* Messages */}
//           <div className="flex-1 overflow-y-auto p-4 space-y-4">
//             <AnimatePresence>
//               {mockMessages.map((msg, index) => (
//                 <motion.div
//                   key={msg.id}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: index * 0.1 }}
//                 >
//                   <MessageBubble message={msg} addReaction={addReaction} />
//                 </motion.div>
//               ))}
//             </AnimatePresence>
//             <div ref={messagesEndRef} />
//           </div>

//           {/* Message Input */}
//           <MessageInput
//             message={message}
//             setMessage={setMessage}
//             handleSendMessage={handleSendMessage}
//             handleFileUpload={handleFileUpload}
//             handleVoiceRecord={handleVoiceRecord}
//             isRecording={isRecording}
//             fileInputRef={fileInputRef}
//           />

//           <input
//             ref={fileInputRef}
//             type="file"
//             className="hidden"
//             accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
//             onChange={(e) => console.log("Fayl tanlandi:", e.target.files)}
//           />
//         </div>
//       ) : (
//         <div className="flex-1 flex items-center justify-center">
//           <motion.div className="text-center" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
//             <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//             <h3 className="text-lg font-medium text-text mb-2">Suhbatni tanlang</h3>
//             <p className="text-gray-400">Xabar almashishni boshlash uchun suhbatni tanlang</p>
//           </motion.div>
//         </div>
//       )}
//     </div>
//   )
// }






"use client"

import { useState, useRef, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { MessageCircle } from "lucide-react"
import ChatList from "./ChatList"
import ChatHeader from "./ChatHeader"
import MessageInput from "./MessageInput"
import MessageBubble, { Message } from "./MessageBubble"

const mockChats = [
  {
    id: "1",
    name: "Dilshod Rahimov",
    avatar: "/placeholder.svg",
    lastMessage: "Salom, qalaysan? 😊",
    time: "2 daqiqa",
    unread: 3,
    online: true,
    typing: false,
    lastSeen: "Hozir faol",
  },
  {
    id: "2",
    name: "Malika Karimova",
    avatar: "/placeholder.svg",
    lastMessage: "🎵 Ovozli xabar",
    time: "15 daqiqa",
    unread: 0,
    online: false,
    typing: false,
    lastSeen: "15 daqiqa oldin",
  },
  {
    id: "3",
    name: "IT Developers UZ",
    avatar: "/placeholder.svg",
    lastMessage: "📷 Rasm yuborildi",
    time: "1 soat",
    unread: 7,
    online: true,
    typing: true,
    isGroup: true,
    lastSeen: "Faol",
  },
]

const mockMessagesByChatId: Record<string, Message[]> = {
  "1": [
    {
      id: "1",
      sender: "Dilshod Rahimov",
      content: "Salom! Qalaysan bugun? 😊",
      time: "14:30",
      isOwn: false,
      type: "text",
      status: "read",
      reactions: [{ emoji: "👍", count: 2, users: ["Aziz", "Malika"] }],
    },
    {
      id: "2",
      sender: "Me",
      content: "Yaxshi, rahmat. Sen-chi?",
      time: "14:31",
      isOwn: true,
      type: "text",
      status: "read",
    },
  ],
  "2": [
    {
      id: "1",
      sender: "Malika Karimova",
      content: "Salom! Yangi loyihang haqida eshitdim 😊",
      time: "13:00",
      isOwn: false,
      type: "text",
      status: "read",
    },
    {
      id: "2",
      sender: "Me",
      content: "Ha, to‘g‘ri. Endi rasmiy beta bosqichda!",
      time: "13:03",
      isOwn: true,
      type: "text",
      status: "read",
    },
  ],
  "3": [
    {
      id: "1",
      sender: "IT Developers UZ",
      content: "📢 Eslatma: ertaga miting 10:00da",
      time: "10:00",
      isOwn: false,
      type: "text",
      status: "delivered",
    },
    {
      id: "2",
      sender: "Me",
      content: "Ok, qatnashaman!",
      time: "10:02",
      isOwn: true,
      type: "text",
      status: "read",
    },
  ],
}

export default function ChatView() {
  const [selectedChat, setSelectedChat] = useState<string | null>("1")
  const [message, setMessage] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const currentChat = mockChats.find((chat) => chat.id === selectedChat)
  const messages = selectedChat ? mockMessagesByChatId[selectedChat] || [] : []

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log("Yangi xabar:", message)
      setMessage("")
    }
  }

  const handleFileUpload = (type: string) => {
    console.log("Fayl yuklash:", type)
    fileInputRef.current?.click()
  }

  const handleVoiceRecord = () => {
    setIsRecording(!isRecording)
    console.log("Ovoz yozish:", !isRecording)
  }

  const addReaction = (messageId: string, emoji: string) => {
    console.log("Reaktsiya:", messageId, emoji)
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    if (message.length > 0) {
      setIsTyping(true)
      const timer = setTimeout(() => setIsTyping(false), 1000)
      return () => clearTimeout(timer)
    }
  }, [message])

  return (
    <div className="h-full flex bg-white/5 backdrop-blur-[10px] border border-white/10 rounded-2xl overflow-hidden">

      <ChatList chats={mockChats} selectedChat={selectedChat} setSelectedChat={setSelectedChat} />


      {selectedChat && currentChat ? (
        <div className="flex-1 flex flex-col">

          <ChatHeader
            chatName={currentChat.name}
            chatAvatar={currentChat.avatar}
            onlineStatus={currentChat.lastSeen}
          />

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <AnimatePresence>
              {messages.map((msg, index) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <MessageBubble message={msg} addReaction={addReaction} />
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          <MessageInput
            message={message}
            setMessage={setMessage}
            handleSendMessage={handleSendMessage}
            handleFileUpload={handleFileUpload}
            handleVoiceRecord={handleVoiceRecord}
            isRecording={isRecording}
            fileInputRef={fileInputRef}
          />

          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
            onChange={(e) => console.log("Fayl tanlandi:", e.target.files)}
          />
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-text mb-2">Suhbatni tanlang</h3>
            <p className="text-gray-400">Xabar almashishni boshlash uchun suhbatni tanlang</p>
          </motion.div>
        </div>
      )}
    </div>
  )
}
