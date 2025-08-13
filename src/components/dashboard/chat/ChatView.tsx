// "use client"

// import { useState, useRef, useEffect } from "react"
// import { AnimatePresence, motion } from "framer-motion"
// import { MessageCircle } from "lucide-react"
// import ChatList from "./ChatList"
// import ChatHeader from "./ChatHeader"
// import MessageInput from "./MessageInput"
// import MessageBubble, { Message } from "./MessageBubble"

// const mockChats = [
//   {
//     id: "1",
//     name: "Dilshod Rahimov",
//     avatar: "/placeholder.svg",
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
//     avatar: "/placeholder.svg",
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
//     avatar: "/placeholder.svg",
//     lastMessage: "📷 Rasm yuborildi",
//     time: "1 soat",
//     unread: 7,
//     online: true,
//     typing: true,
//     isGroup: true,
//     lastSeen: "Faol",
//   },
// ]

// const mockMessagesByChatId: Record<string, Message[]> = {
//   "1": [
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
//       content: "Yaxshi, rahmat. Sen-chi?",
//       time: "14:31",
//       isOwn: true,
//       type: "text",
//       status: "read",
//     },
//   ],
//   "2": [
//     {
//       id: "1",
//       sender: "Malika Karimova",
//       content: "Salom! Yangi loyihang haqida eshitdim 😊",
//       time: "13:00",
//       isOwn: false,
//       type: "text",
//       status: "read",
//     },
//     {
//       id: "2",
//       sender: "Me",
//       content: "Ha, to‘g‘ri. Endi rasmiy beta bosqichda!",
//       time: "13:03",
//       isOwn: true,
//       type: "text",
//       status: "read",
//     },
//   ],
//   "3": [
//     {
//       id: "1",
//       sender: "IT Developers UZ",
//       content: "📢 Eslatma: ertaga miting 10:00da",
//       time: "10:00",
//       isOwn: false,
//       type: "text",
//       status: "delivered",
//     },
//     {
//       id: "2",
//       sender: "Me",
//       content: "Ok, qatnashaman!",
//       time: "10:02",
//       isOwn: true,
//       type: "text",
//       status: "read",
//     },
//   ],
// }

// export default function ChatView() {
//   const [selectedChat, setSelectedChat] = useState<string | null>("1")
//   const [message, setMessage] = useState("")
//   const [isRecording, setIsRecording] = useState(false)
//   const [isTyping, setIsTyping] = useState(false)
//   const [messagesByChatId, setMessagesByChatId] = useState(mockMessagesByChatId)
//   const messagesEndRef = useRef<HTMLDivElement>(null)
//   const fileInputRef = useRef<HTMLInputElement>(null)

//   const currentChat = mockChats.find((chat) => chat.id === selectedChat)
//   const messages = selectedChat ? messagesByChatId[selectedChat] || [] : []

//   const handleSendMessage = () => {
//     if (message.trim() && selectedChat) {
//       const newMessage: Message = {
//         id: Date.now().toString(),
//         sender: "Me",
//         content: message,
//         time: new Date().toLocaleTimeString().slice(0, 5),
//         isOwn: true,
//         type: "text",
//         status: "sent",
//       }

//       setMessagesByChatId((prev) => ({
//         ...prev,
//         [selectedChat]: [...(prev[selectedChat] || []), newMessage],
//       }))

//       console.log("Yangi xabar:", message)
//       setMessage("")
//     }
//   }

//   const handleFileUpload = () => {
//     fileInputRef.current?.click()
//   }

//   const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (selectedChat && e.target.files && e.target.files.length > 0) {
//       const file = e.target.files[0]
//       const fileUrl = URL.createObjectURL(file)

//       const fileType = file.type.startsWith("image/")
//         ? "image"
//         : file.type.startsWith("video/")
//         ? "video"
//         : "file"

//       const newMessage: Message = {
//         id: Date.now().toString(),
//         sender: "Me",
//         content: fileUrl,
//         time: new Date().toLocaleTimeString().slice(0, 5),
//         isOwn: true,
//         type: fileType,
//         status: "sent",
//       }

//       setMessagesByChatId((prev) => ({
//         ...prev,
//         [selectedChat]: [...(prev[selectedChat] || []), newMessage],
//       }))

//       console.log("Fayl yuborildi:", file)
//       e.target.value = ""
//     }
//   }

//   const handleVoiceRecord = () => {
//     setIsRecording(!isRecording)
//     console.log("Ovoz yozish:", !isRecording)
//   }

//   const addReaction = (messageId: string, emoji: string) => {
//     console.log("Reaktsiya:", messageId, emoji)
//   }

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
//   }, [messages])

//   useEffect(() => {
//     if (message.length > 0) {
//       setIsTyping(true)
//       const timer = setTimeout(() => setIsTyping(false), 1000)
//       return () => clearTimeout(timer)
//     }
//   }, [message])

//   return (
//     <div className="h-full flex bg-white/5 backdrop-blur-[10px] border border-white/10 rounded-2xl overflow-hidden">
//       <ChatList chats={mockChats} selectedChat={selectedChat} setSelectedChat={setSelectedChat} />

//       {selectedChat && currentChat ? (
//         <div className="flex-1 flex flex-col">
//           <ChatHeader
//             chatName={currentChat.name}
//             chatAvatar={currentChat.avatar}
//             onlineStatus={currentChat.lastSeen}
//           />

//           <div className="flex-1 overflow-y-auto p-4 space-y-4">
//             <AnimatePresence>
//               {messages.map((msg, index) => (
//                 <motion.div
//                   key={msg.id}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: index * 0.05 }}
//                 >
//                   <MessageBubble message={msg} addReaction={addReaction} />
//                 </motion.div>
//               ))}
//             </AnimatePresence>
//             <div ref={messagesEndRef} />
//           </div>

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
//             onChange={handleFileSelect}
//           />
//         </div>
//       ) : (
//         <div className="flex-1 flex items-center justify-center">
//           <motion.div
//             className="text-center"
//             initial={{ opacity: 0, scale: 0.8 }}
//             animate={{ opacity: 1, scale: 1 }}
//           >
//             <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//             <h3 className="text-lg font-medium text-text mb-2">Suhbatni tanlang</h3>
//             <p className="text-gray-400">Xabar almashishni boshlash uchun suhbatni tanlang</p>
//           </motion.div>
//         </div>
//       )}
//     </div>
//   )
// }



"use client";

import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, User, Phone, Clock, MessageSquare, Mail, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import ChatList from "./ChatList";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageBubble, { Message } from "./MessageBubble";
import { getUserById } from "@/lib/api";

interface UserProfile {
  id: string;
  name: string;
  username: string | null;
  email: string;
  bio: string | null;
  phone: string | null;
  profile_picture: string | null;
  last_login: string | null;
  is_active: boolean;
  date_joined: string | null;
  groups: string[];
}

interface Chat {
  id: string;
  name: string;
  avatar: string | null;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  typing: boolean;
  lastSeen: string | null;
  isGroup: boolean;
}

export default function ChatView() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messagesByChatId, setMessagesByChatId] = useState<Record<string, Message[]>>({});
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isChatStarted, setIsChatStarted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getChatsFromStorage = (): Chat[] => {
    const chats = localStorage.getItem("chats");
    return chats ? JSON.parse(chats) : [];
  };

  const saveChatsToStorage = (chats: Chat[]) => {
    localStorage.setItem("chats", JSON.stringify(chats));
  };

  const getMessagesFromStorage = (): Record<string, Message[]> => {
    const messages = localStorage.getItem("messages");
    return messages ? JSON.parse(messages) : {};
  };

  const saveMessagesToStorage = (messages: Record<string, Message[]>) => {
    localStorage.setItem("messages", JSON.stringify(messages));
  };


  const fetchUserProfile = async (userId: string) => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const response = await getUserById(userId, token);
        const user = response.data;
        const profile: UserProfile = {
          id: user.id.toString(),
          name: user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : user.username || user.email,
          username: user.username || "Noma'lum",
          email: user.email,
          bio: user.bio || "Bio mavjud emas",
          phone: user.phone || "Telefon raqami kiritilmagan",
          profile_picture: user.profile_picture ? `${process.env.NEXT_PUBLIC_APPLE}${user.profile_picture}` : "/placeholder.svg",
          last_login: user.last_login
            ? new Date(user.last_login).toLocaleString("uz-UZ", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "Noma'lum",
          is_active: user.is_active,
          date_joined: user.date_joined
            ? new Date(user.date_joined).toLocaleString("uz-UZ", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })
            : "Noma'lum",
          groups: user.groups || [],
        };
        setUserProfile(profile);
        return profile;
      } catch (error) {
        console.error("Foydalanuvchi ma'lumotlarini olishda xato:", error);
        setUserProfile(null);
        return null;
      }
    }
    return null;
  };

  useEffect(() => {
    if (selectedChat) {
      const chats = getChatsFromStorage();
      const currentChat = chats.find((chat) => chat.id === selectedChat);
      if (currentChat) {
        setUserProfile({
          id: currentChat.id,
          name: currentChat.name,
          username: null,
          email: "Noma'lum",
          bio: "Bio mavjud emas",
          phone: "Telefon raqami kiritilmagan",
          profile_picture: currentChat.avatar,
          last_login: currentChat.lastSeen,
          is_active: currentChat.online,
          date_joined: "Noma'lum",
          groups: currentChat.isGroup ? [currentChat.name] : [],
        });
        setIsChatStarted(true);
      } else {
        fetchUserProfile(selectedChat).then((profile) => {
          if (profile) {
            setIsChatStarted(false);
          }
        });
      }
      setMessagesByChatId(getMessagesFromStorage());
    } else {
      setUserProfile(null);
      setIsChatStarted(false);
    }
  }, [selectedChat]);

  const handleSendMessage = () => {
    if (message.trim() && selectedChat) {
      const newMessage: Message = {
        id: Date.now().toString(),
        sender: "Me",
        content: message,
        time: new Date().toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" }),
        isOwn: true,
        type: "text",
        status: "sent",
      };

      setMessagesByChatId((prev) => {
        const updatedMessages = {
          ...prev,
          [selectedChat]: [...(prev[selectedChat] || []), newMessage],
        };
        saveMessagesToStorage(updatedMessages);
        return updatedMessages;
      });

      const chats = getChatsFromStorage();
      const updatedChats = chats.map((chat) =>
        chat.id === selectedChat ? { ...chat, lastMessage: message, time: newMessage.time } : chat
      );
      saveChatsToStorage(updatedChats);

      console.log("Yangi xabar:", message);
      setMessage("");
    }
  };

  const handleFileUpload = (type: string) => {
    if (type === "image" || type === "file" || type === "camera") {
      fileInputRef.current?.click();
    } else if (type === "location") {
      console.log("Joylashuv yuborish...");
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedChat && e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const fileUrl = URL.createObjectURL(file);

      const fileType = file.type.startsWith("image/")
        ? "image"
        : file.type.startsWith("video/")
        ? "video"
        : "file";

      const newMessage: Message = {
        id: Date.now().toString(),
        sender: "Me",
        content: fileUrl,
        time: new Date().toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" }),
        isOwn: true,
        type: fileType,
        status: "sent",
      };

      setMessagesByChatId((prev) => {
        const updatedMessages = {
          ...prev,
          [selectedChat]: [...(prev[selectedChat] || []), newMessage],
        };
        saveMessagesToStorage(updatedMessages);
        return updatedMessages;
      });

      const chats = getChatsFromStorage();
      const updatedChats = chats.map((chat) =>
        chat.id === selectedChat ? { ...chat, lastMessage: `[${fileType}]`, time: newMessage.time } : chat
      );
      saveChatsToStorage(updatedChats);

      console.log("Fayl yuborildi:", file);
      e.target.value = "";
    }
  };

  const handleVoiceRecord = () => {
    setIsRecording(!isRecording);
    console.log("Ovoz yozish:", !isRecording);
  };

  const addReaction = (messageId: string, emoji: string) => {
    console.log("Reaktsiya:", messageId, emoji);
  };

  const startChat = () => {
    if (userProfile) {
      const newChat: Chat = {
        id: userProfile.id,
        name: userProfile.name,
        avatar: userProfile.profile_picture,
        lastMessage: "",
        time: "",
        unread: 0,
        online: userProfile.is_active,
        typing: false,
        lastSeen: userProfile.last_login,
        isGroup: false,
      };
      const chats = getChatsFromStorage();
      if (!chats.find((chat) => chat.id === newChat.id)) {
        chats.push(newChat);
        saveChatsToStorage(chats);
      }
      setIsChatStarted(true);
      setSelectedChat(userProfile.id);
    }
  };

  const showUserProfile = async () => {
    if (selectedChat) {
      const profile = await fetchUserProfile(selectedChat);
      if (profile) {
        setIsChatStarted(false);
      }
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesByChatId[selectedChat]]);

  useEffect(() => {
    if (message.length > 0) {
      setIsTyping(true);
      const timer = setTimeout(() => setIsTyping(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="h-full flex bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden">
      <ChatList chats={getChatsFromStorage()} selectedChat={selectedChat} setSelectedChat={setSelectedChat} />

      {selectedChat ? (
        <div className="flex-1 flex flex-col">
          {isChatStarted && userProfile ? (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex-1 flex flex-col"
            >
              <ChatHeader
                chatName={userProfile.name}
                chatAvatar={userProfile.profile_picture || "/placeholder.svg"}
                onlineStatus={userProfile.last_login || "Noma'lum"}
                onAvatarClick={showUserProfile}
              />
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-transparent">
                <AnimatePresence>
                  {messagesByChatId[selectedChat]?.map((msg, index) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
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
                onChange={handleFileSelect}
              />
            </motion.div>
          ) : userProfile ? (
            <motion.div
              className="flex-1 flex flex-col items-center justify-center p-6 overflow-y-auto"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <div className="relative text-center bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/20 shadow-xl max-w-md w-full">
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  transition={{ duration: 0.3 }}
                  className="relative"
                >
                  <Avatar className="w-32 h-32 mx-auto mb-4 border-4 border-primary/20 rounded-full shadow-lg">
                    <AvatarImage src={userProfile.profile_picture} />
                    <AvatarFallback className="text-4xl">{userProfile.name[0]}</AvatarFallback>
                  </Avatar>
                  {userProfile.is_active && (
                    <motion.div
                      className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    />
                  )}
                </motion.div>
                <motion.h2
                  className="text-3xl font-bold text-white mb-2"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                >
                  {userProfile.name}
                </motion.h2>
                <motion.p
                  className="text-sm text-primary mb-4"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                >
                  @{userProfile.username}
                </motion.p>
                <motion.p
                  className="text-gray-300 mb-6 italic"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                >
                  {userProfile.bio}
                </motion.p>
                <motion.div
                  className="space-y-4 text-left"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.4 }}
                >
                  <motion.div
                    className="flex items-center gap-3"
                    whileHover={{ x: 5, scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                    style={{ color: "#ffffff" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#3b82f6")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#ffffff")}
                  >
                    <User className="w-5 h-5 text-primary" />
                    <p>Foydalanuvchi ID: {userProfile.id}</p>
                  </motion.div>
                  <motion.div
                    className="flex items-center gap-3"
                    whileHover={{ x: 5, scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                    style={{ color: "#ffffff" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#3b82f6")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#ffffff")}
                  >
                    <Phone className="w-5 h-5 text-primary" />
                    <p>{userProfile.phone}</p>
                  </motion.div>
                  <motion.div
                    className="flex items-center gap-3"
                    whileHover={{ x: 5, scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                    style={{ color: "#ffffff" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#3b82f6")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#ffffff")}
                  >
                    <Mail className="w-5 h-5 text-primary" />
                    <p>{userProfile.email}</p>
                  </motion.div>
                  <motion.div
                    className="flex items-center gap-3"
                    whileHover={{ x: 5, scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                    style={{ color: "#ffffff" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#3b82f6")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#ffffff")}
                  >
                    <Clock className="w-5 h-5 text-primary" />
                    <p>Oxirgi faollik: {userProfile.last_login}</p>
                  </motion.div>
                  <motion.div
                    className="flex items-center gap-3"
                    whileHover={{ x: 5, scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                    style={{ color: "#ffffff" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#3b82f6")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#ffffff")}
                  >
                    <Calendar className="w-5 h-5 text-primary" />
                    <p>Ro'yxatdan o'tgan: {userProfile.date_joined}</p>
                  </motion.div>
                  <motion.div
                    className="flex items-center gap-3"
                    whileHover={{ x: 5, scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                    style={{ color: "#ffffff" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#3b82f6")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#ffffff")}
                  >
                    <Users className="w-5 h-5 text-primary" />
                    <p>Guruhlar: {userProfile.groups.length > 0 ? userProfile.groups.join(", ") : "Hech qanday guruh yo'q"}</p>
                  </motion.div>
                </motion.div>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                >
                  <Button
                    className="mt-8 bg-gradient-to-r from-primary to-purple-500 hover:from-primary/80 hover:to-purple-500/80 text-white font-semibold py-3 px-6 rounded-full shadow-lg transition-all duration-300 hover:scale-105"
                    onClick={startChat}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Chatni boshlash
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              className="flex-1 flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <div className="text-center">
                <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">Suhbatni tanlang</h3>
                <p className="text-gray-400">Xabar almashishni boshlash uchun suhbatni tanlang</p>
              </div>
            </motion.div>
          )}
        </div>
      ) : (
        <motion.div
          className="flex-1 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="text-center">
            <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">Suhbatni tanlang</h3>
            <p className="text-gray-400">Xabar almashishni boshlash uchun suhbatni tanlang</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
