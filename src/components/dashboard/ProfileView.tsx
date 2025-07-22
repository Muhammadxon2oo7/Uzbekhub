"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { User, MapPin, Phone, Mail, Calendar, Edit3, Camera, Heart, MessageCircle, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslation } from "react-i18next"

export default function ProfileView() {
  const { t } = useTranslation("translation")
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    name: "Aziz Karimov",
    username: "azizkarimov",
    bio: "Software Developer | Tech Enthusiast | Tashkent, Uzbekistan",
    location: "Tashkent, Uzbekistan",
    phone: "+998 90 123 45 67",
    email: "aziz@example.com",
    joinDate: "2023-01-15",
    avatar: "/placeholder.svg?height=120&width=120",
  })

  const cardRef = useRef<HTMLDivElement>(null)
  const spotRef = useRef<HTMLDivElement>(null)

  const stats = [
    { label: t("dashboard.messages"), value: 1247, icon: MessageCircle, color: "text-blue-400" },
    { label: t("dashboard.groups"), value: 12, icon: Users, color: "text-green-400" },
    { label: t("dashboard.donations"), value: 5, icon: Heart, color: "text-red-400" },
  ]

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

  const handleSave = () => {
    setIsEditing(false)
    // Here you would typically save to backend
    console.log("Profile saved:", profile)
  }

  return (
    <div className="h-full overflow-y-auto">
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-white/5 backdrop-blur-[10px] border border-white/10 rounded-2xl p-6 overflow-hidden"
      >
        {/* Hover spot effect */}
        <div
          ref={spotRef}
          className="pointer-events-none absolute w-32 h-32 rounded-full bg-white/10 blur-2xl opacity-0 transition-opacity duration-200 z-0"
        />

        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <User className="w-8 h-8 text-primary" />
              <h1 className="text-2xl font-bold text-text">{t("dashboard.profile")}</h1>
            </div>
            <Button
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
              className="bg-primary hover:bg-primary/80"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              {isEditing ? t("dashboard.save") : t("dashboard.edit")}
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <Card className="bg-white/5 border-white/10 backdrop-blur-[10px]">
                <CardContent className="p-6 text-center">
                  <div className="relative inline-block mb-4">
                    <Avatar className="w-32 h-32 mx-auto">
                      <AvatarImage src={profile.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="text-2xl">{profile.name[0]}</AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <Button
                        size="icon"
                        className="absolute bottom-0 right-0 rounded-full bg-primary hover:bg-primary/80"
                      >
                        <Camera className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="space-y-3">
                      <Input
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        className="bg-white/5 border-white/20 text-text text-center"
                      />
                      <Input
                        value={profile.username}
                        onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                        className="bg-white/5 border-white/20 text-text text-center"
                        placeholder="Username"
                      />
                    </div>
                  ) : (
                    <>
                      <h2 className="text-xl font-bold text-text mb-1">{profile.name}</h2>
                      <p className="text-gray-400 mb-4">@{profile.username}</p>
                    </>
                  )}

                  <div className="flex items-center justify-center gap-1 text-gray-400 mb-4">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">
                      {t("dashboard.joined")} {new Date(profile.joinDate).toLocaleDateString()}
                    </span>
                  </div>

                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">{t("dashboard.active")}</Badge>
                </CardContent>
              </Card>

              {/* Stats */}
              <Card className="bg-white/5 border-white/10 backdrop-blur-[10px] mt-6">
                <CardHeader>
                  <CardTitle className="text-text">{t("dashboard.statistics")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <stat.icon className={`w-5 h-5 ${stat.color}`} />
                        <span className="text-text">{stat.label}</span>
                      </div>
                      <span className="font-semibold text-text">{stat.value}</span>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Profile Details */}
            <div className="lg:col-span-2">
              <Card className="bg-white/5 border-white/10 backdrop-blur-[10px]">
                <CardHeader>
                  <CardTitle className="text-text">{t("dashboard.profile_details")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Bio */}
                  <div>
                    <label className="block text-sm font-medium text-text mb-2">{t("dashboard.bio")}</label>
                    {isEditing ? (
                      <Textarea
                        value={profile.bio}
                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                        className="bg-white/5 border-white/20 text-text"
                        rows={3}
                      />
                    ) : (
                      <p className="text-gray-300 bg-white/5 rounded-lg p-3 border border-white/10">{profile.bio}</p>
                    )}
                  </div>

                  {/* Contact Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text mb-2">
                        <Mail className="w-4 h-4 inline mr-2" />
                        {t("dashboard.email")}
                      </label>
                      {isEditing ? (
                        <Input
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                          className="bg-white/5 border-white/20 text-text"
                        />
                      ) : (
                        <p className="text-gray-300 bg-white/5 rounded-lg p-3 border border-white/10">
                          {profile.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text mb-2">
                        <Phone className="w-4 h-4 inline mr-2" />
                        {t("dashboard.phone")}
                      </label>
                      {isEditing ? (
                        <Input
                          type="tel"
                          value={profile.phone}
                          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                          className="bg-white/5 border-white/20 text-text"
                        />
                      ) : (
                        <p className="text-gray-300 bg-white/5 rounded-lg p-3 border border-white/10">
                          {profile.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-text mb-2">
                      <MapPin className="w-4 h-4 inline mr-2" />
                      {t("dashboard.location")}
                    </label>
                    {isEditing ? (
                      <Input
                        value={profile.location}
                        onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                        className="bg-white/5 border-white/20 text-text"
                      />
                    ) : (
                      <p className="text-gray-300 bg-white/5 rounded-lg p-3 border border-white/10">
                        {profile.location}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
