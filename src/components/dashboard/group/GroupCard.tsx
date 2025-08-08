// components/GroupCard.tsx

"use client"
import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Crown, Shield, Hash } from "lucide-react"
import { useTranslation } from "react-i18next"

type Group = {
  id: string
  name: string
  description: string
  members: number
  avatar?: string
  role?: string
  unread?: number
  category: string
  isDiscover?: boolean
}

interface Props {
  group: Group
  index: number
}

export default function GroupCard({ group, index }: Props) {
  const { t } = useTranslation("translation")

  const getRoleIcon = (role?: string) => {
    switch (role) {
      case "admin":
        return <Crown className="w-4 h-4 text-yellow-500" />
      case "moderator":
        return <Shield className="w-4 h-4 text-blue-500" />
      default:
        return <Hash className="w-4 h-4 text-gray-400" />
    }
  }

  const getRoleBadge = (role?: string) => {
    const colors = {
      admin: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      moderator: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      member: "bg-gray-500/20 text-gray-400 border-gray-500/30",
    }
    return colors[role as keyof typeof colors] || colors.member
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white/5 backdrop-blur-[10px] border border-white/10 rounded-xl p-4 cursor-pointer group hover:border-primary/30 transition-all"
    >
      <div className="flex items-start gap-3 mb-3">
        <Avatar className="w-12 h-12">
          <AvatarImage src={group.avatar || "/placeholder.svg"} />
          <AvatarFallback>{group.name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-text truncate">{group.name}</h3>
            {getRoleIcon(group.role)}
          </div>
          <p className="text-sm text-gray-300 line-clamp-2">{group.description}</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {group.role && (
            <Badge className={`text-xs ${getRoleBadge(group.role)}`}>
              {t(`dashboard.role_${group.role}`)}
            </Badge>
          )}
          <span className="text-xs text-gray-400">
            {group.members} {t("dashboard.members")}
          </span>
        </div>
        {!group.isDiscover && group.unread && group.unread > 0 && (
          <Badge className="bg-primary text-white text-xs">{group.unread}</Badge>
        )}
      </div>

      <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10">
        <Badge variant="outline" className="text-xs border-white/20 text-gray-300">
          {group.category}
        </Badge>

        {group.isDiscover && (
          <Button className="bg-primary hover:bg-primary/80 text-xs px-3 py-1 h-auto" size="sm">
            {t("dashboard.join_group")}
          </Button>
        )}
      </div>
    </motion.div>
  )
}
