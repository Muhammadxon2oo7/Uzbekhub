"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Users, Plus, Search, Crown, Shield, Hash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTranslation } from "react-i18next"

export default function GroupsView() {
  const { t } = useTranslation("DashboardGroups")
  const [searchQuery, setSearchQuery] = useState("")
  const cardRef = useRef<HTMLDivElement>(null)
  const spotRef = useRef<HTMLDivElement>(null)

  // Mock groups data
  const myGroups = [
    {
      id: "1",
      name: "IT Developers UZ",
      description: "O'zbekistondagi dasturchilar jamoasi",
      members: 1250,
      avatar: "/placeholder.svg?height=60&width=60",
      role: "admin",
      unread: 5,
      category: "Technology",
    },
    {
      id: "2",
      name: "Tashkent Startups",
      description: "Toshkentdagi startaplar va tadbirkorlar",
      members: 890,
      avatar: "/placeholder.svg?height=60&width=60",
      role: "member",
      unread: 12,
      category: "Business",
    },
    {
      id: "3",
      name: "UzbekHub Community",
      description: "Rasmiy UzbekHub jamoasi",
      members: 2340,
      avatar: "/placeholder.svg?height=60&width=60",
      role: "moderator",
      unread: 3,
      category: "Community",
    },
  ]

  const discoverGroups = [
    {
      id: "4",
      name: "Samarkand Tourism",
      description: "Samarqand shahri va turizm haqida",
      members: 567,
      avatar: "/placeholder.svg?height=60&width=60",
      category: "Travel",
    },
    {
      id: "5",
      name: "Uzbek Cuisine Lovers",
      description: "O'zbek milliy taomlari va retseptlar",
      members: 1890,
      avatar: "/placeholder.svg?height=60&width=60",
      category: "Food",
    },
    {
      id: "6",
      name: "Freelancers UZ",
      description: "O'zbekistondagi frilanserlar",
      members: 445,
      avatar: "/placeholder.svg?height=60&width=60",
      category: "Work",
    },
  ]

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Crown className="w-4 h-4 text-yellow-500" />
      case "moderator":
        return <Shield className="w-4 h-4 text-blue-500" />
      default:
        return <Hash className="w-4 h-4 text-gray-400" />
    }
  }

  const getRoleBadge = (role: string) => {
    const colors = {
      admin: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      moderator: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      member: "bg-gray-500/20 text-gray-400 border-gray-500/30",
    }
    return colors[role as keyof typeof colors] || colors.member
  }

  // Glass morphism hover effect
  useEffect(() => {
    const card = cardRef.current
    const spot = spotRef.current
    if (!card || !spot) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      spot.style.left = `${x - 80}px`
      spot.style.top = `${y - 80}px`
      spot.style.opacity = "0.3"
    }

    const handleMouseLeave = () => {
      spot.style.opacity = "0"
    }

    card.addEventListener("mousemove", handleMouseMove)
    card.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      card.removeEventListener("mousemove", handleMouseMove)
      card.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  return (
    <div className="h-[90vh] relative top-4">
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-white/5 backdrop-blur-[10px] border border-white/10 rounded-2xl p-6 h-full overflow-hidden"
      >
        {/* Hover spot effect */}
        <div
          ref={spotRef}
          className="pointer-events-none absolute w-32 h-32 rounded-full bg-white/10 blur-2xl opacity-0 transition-opacity duration-200 z-0"
        />

        <div className="relative z-10 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-primary" />
              <h1 className="text-2xl font-bold text-text">{t("title")}</h1>
            </div>
            <Button className="bg-primary hover:bg-primary/80">
              <Plus className="w-4 h-4 mr-2" />
              {t("create")}
            </Button>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder={t("search")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/5 border-white/20 text-text"
            />
          </div>

          {/* Tabs */}
          <Tabs defaultValue="my-groups" className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-2 bg-white/5 border border-white/10">
              <TabsTrigger value="my-groups" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                {t("myGroups")}
              </TabsTrigger>
              <TabsTrigger value="discover" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                {t("discoverGroups")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="my-groups" className="flex-1 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto">
                {myGroups.map((group, index) => (
                  <motion.div
                    key={group.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    // whileHover={{ scale: 1.02, rotate: 1 }}
                    className="bg-white/5 backdrop-blur-[10px] border border-white/10 rounded-xl p-4 cursor-pointer group hover:border-primary/30 transition-all duration-300"
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

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge className={`text-xs ${getRoleBadge(group.role)}`}>
                          {t(`role.${group.role}`)}
                        </Badge>
                        <span className="text-xs text-gray-400">
                          {group.members} {t("members")}
                        </span>
                      </div>
                      {group.unread > 0 && <Badge className="bg-primary text-white text-xs">{group.unread}</Badge>}
                    </div>

                    <div className="mt-3 pt-3 border-t border-white/10">
                      <Badge variant="outline" className="text-xs border-white/20 text-gray-300">
                        {group.category}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="discover" className="flex-1 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto">
                {discoverGroups.map((group, index) => (
                  <motion.div
                    key={group.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    // whileHover={{ scale: 1.02, rotate: -1 }}
                    className="bg-white/5 backdrop-blur-[10px] border border-white/10 rounded-xl p-4 cursor-pointer group hover:border-primary/30 transition-all duration-300"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={group.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{group.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-text truncate">{group.name}</h3>
                        <p className="text-sm text-gray-300 line-clamp-2">{group.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-gray-400">
                        {group.members} {t("members")}
                      </span>
                      <Badge variant="outline" className="text-xs border-white/20 text-gray-300">
                        {group.category}
                      </Badge>
                    </div>

                    <Button className="w-full bg-primary hover:bg-primary/80" size="sm">
                      {t("join_group")}
                    </Button>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>
    </div>
  )
}
