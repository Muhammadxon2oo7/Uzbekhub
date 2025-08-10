"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { MapPin, Users, MessageCircle, Heart, Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { useTranslation } from "react-i18next"

export default function DiscoverView() {
  const { t } = useTranslation("translation")
  const [radius, setRadius] = useState([5])
  const cardRef = useRef<HTMLDivElement>(null)
  const spotRef = useRef<HTMLDivElement>(null)

  // Mock nearby users data 
  const nearbyUsers = [
    {
      id: "1",
      name: "Malika Karimova",
      username: "@malika_k",
      avatar: "/placeholder.svg?height=60&width=60",
      distance: "0.8 km",
      bio: "UX Designer | Coffee lover ☕",
      location: "Chilonzor, Tashkent",
      interests: ["Design", "Art", "Photography"],
      online: true,
    },
    {
      id: "2",
      name: "Bobur Rahimov",
      username: "@bobur_dev",
      avatar: "/placeholder.svg?height=60&width=60",
      distance: "1.2 km",
      bio: "Full-stack Developer | React enthusiast",
      location: "Yunusobod, Tashkent",
      interests: ["Programming", "Gaming", "Music"],
      online: false,
    },
    {
      id: "3",
      name: "Nigora Sultanova",
      username: "@nigora_s",
      avatar: "/placeholder.svg?height=60&width=60",
      distance: "2.1 km",
      bio: "English Teacher | Travel enthusiast 🌍",
      location: "Mirzo Ulugbek, Tashkent",
      interests: ["Teaching", "Travel", "Languages"],
      online: true,
    },
    {
      id: "4",
      name: "Sardor Alimov",
      username: "@sardor_photo",
      avatar: "/placeholder.svg?height=60&width=60",
      distance: "3.5 km",
      bio: "Professional Photographer 📸",
      location: "Shaykhontohur, Tashkent",
      interests: ["Photography", "Art", "Nature"],
      online: true,
    },
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

  return (
    <div className="h-full">
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
              <MapPin className="w-8 h-8 text-primary" />
              <h1 className="text-2xl font-bold text-text">{t("dashboard.discover")}</h1>
            </div>
            <Button className="bg-primary hover:bg-primary/80">
              <Navigation className="w-4 h-4 mr-2" />
              {t("dashboard.update_location")}
            </Button>
          </div>

          {/* Location Info */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-[10px] mb-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <span className="text-text font-medium">{t("dashboard.your_location")}: Tashkent, Uzbekistan</span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">{t("dashboard.search_radius")}</span>
                  <span className="text-sm text-primary font-medium">{radius[0]} km</span>
                </div>
                <Slider value={radius} onValueChange={setRadius} max={50} min={1} step={1} className="w-full" />
              </div>
            </CardContent>
          </Card>

          {/* Nearby Users */}
          <div className="flex-1 overflow-y-auto">
            <h2 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              {t("dashboard.nearby_people")} ({nearbyUsers.length})
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {nearbyUsers.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, rotate: 1 }}
                  className="bg-white/5 backdrop-blur-[10px] border border-white/10 rounded-xl p-4 cursor-pointer group hover:border-primary/30 transition-all duration-300"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="relative">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                      </Avatar>
                      {user.online && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-text truncate">{user.name}</h3>
                        <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                          {user.distance}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-400 truncate">{user.username}</p>
                      <p className="text-sm text-gray-300 line-clamp-2 mt-1">{user.bio}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-gray-400 mb-3">
                    <MapPin className="w-3 h-3" />
                    <span>{user.location}</span>
                  </div>

                  {/* Interests */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {user.interests.slice(0, 3).map((interest) => (
                      <Badge key={interest} variant="outline" className="text-xs border-white/20 text-gray-300">
                        {interest}
                      </Badge>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1 bg-primary hover:bg-primary/80">
                      <MessageCircle className="w-3 h-3 mr-1" />
                      {t("dashboard.message")}
                    </Button>
                    <Button size="sm" variant="outline" className="border-white/20 hover:bg-white/10 bg-transparent">
                      <Heart className="w-3 h-3 mr-1" />
                      {t("dashboard.donate")}
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
