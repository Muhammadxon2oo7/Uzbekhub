
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { searchUsers } from "@/lib/api";

// API bazasi URL
const API_BASE_URL = "https://api.rozievich.uz";

export interface UserLocation {
  id: number;
  lat: string;
  long: string;
  country: string;
  city: string | null;
  county: string | null;
  neighbourhood: string | null;
  created_at: string;
  update_at: string;
}

export interface Chat {
  last_online: string | null;
  location: UserLocation | null;   // endi chalkashmaydi
  groups: string[];
  date_joined: string | null;
  is_staff: boolean;
  phone: string | null;
  bio: string | null;
  email: string;
  username: string | null;
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


interface ChatListProps {
  chats: Chat[];
  selectedChat: string;
  setSelectedChat: (id: string) => void;
  searchResults: Chat[];
  setSearchResults: React.Dispatch<React.SetStateAction<Chat[]>>;
}

export default function ChatList({ chats, selectedChat, setSelectedChat, searchResults, setSearchResults }: ChatListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { t } = useTranslation("dashboardChatList");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (searchQuery.trim() && token) {
      const fetchUsers = async () => {
        try {
          const response = await searchUsers(searchQuery, token);
          const users = response.data.map((user: any) => {
            const displayName =
              user.first_name && user.last_name
                ? `${user.first_name} ${user.last_name}`
                : user.username || user.email;

            const lastSeen = user.last_online
              ? new Date(user.last_online).toLocaleString("uz-UZ", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "Noma'lum";

            return {
              id: user.id.toString(),
              name: displayName,
              avatar: user.profile_picture ? `${API_BASE_URL}${user.profile_picture}` : "/placeholder.svg",
              lastMessage: "",
              time: "",
              unread: 0,
              online: user.is_active || false,
              typing: false,
              lastSeen: lastSeen,
              isGroup: false,
              // Qo'shimcha ma'lumotlar
              username: user.username || "Noma'lum",
              bio: user.bio || "Bio mavjud emas",
              phone: user.phone || "Telefon raqami kiritilmagan",
              email: user.email,
              last_online: user.last_online
                ? new Date(user.last_online).toLocaleString("uz-UZ", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Noma'lum",
              is_staff: user.is_staff,
              date_joined: user.date_joined
                ? new Date(user.date_joined).toLocaleString("uz-UZ", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })
                : "Noma'lum",
              groups: user.groups || [],
              location: user.location || null,
            };
          });
          setSearchResults(users);
        } catch (error) {
          console.error("Foydalanuvchilarni qidirishda xato:", error);
          setSearchResults([]);
        }
      };
      fetchUsers();
    } else {
      setSearchResults(chats);
    }
  }, [searchQuery, token, chats]);

  const displayedChats = searchQuery.trim() ? searchResults : chats;

  return (
    <div className="w-80 border-r border-white/10 flex flex-col">
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

      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        {displayedChats.map((chat, index) => (
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
                  <AvatarImage src={chat.avatar ?? "/placeholder.svg"} />
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
  );
}