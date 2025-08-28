"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Camera, Plus, Play, Pause, Volume2, VolumeX, Heart, Send, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog"
import { DialogHeader } from "../ui/dialog"
import { set } from "lodash"
import { useTranslation } from "react-i18next"
import { Stories } from "./stories/Stories" 

export default function StoriesView() {
  const [selectedStory, setSelectedStory] = useState<string | null>(null)
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const [replyText, setReplyText] = useState("")
  const cardRef = useRef<HTMLDivElement>(null)
  const spotRef = useRef<HTMLDivElement>(null)
  const [isPosting, setIsPosting] = useState(false)

  const { t } = useTranslation("DashboardStories")

  // Mock stories data
  const stories = [
    {
      id: "my",
      user: "Siz",
      avatar: "/placeholder.svg?height=60&width=60",
      stories: [],
      isOwn: true,
    },
    {
      id: "1",
      user: "Dilshod Rahimov",
      avatar: "/placeholder.svg?height=60&width=60",
      stories: [
        {
          id: "s1",
          type: "image",
          content: "/placeholder.svg?height=400&width=300",
          caption: "Bugun oshxonada yangi taom tayyorladim! 🍛",
          timestamp: "2",
          views: 45,
          likes: 12,
        },
        {
          id: "s2",
          type: "video",
          content: "/placeholder.svg?height=400&width=300",
          caption: "Toshkentning chiroyli manzarasi 🌆",
          timestamp: "4",
          views: 67,
          likes: 23,
        },
      ],
    },
    {
      id: "2",
      user: "Malika Karimova",
      avatar: "/placeholder.svg?height=60&width=60",
      stories: [
        {
          id: "s3",
          type: "image",
          content: "/placeholder.svg?height=400&width=300",
          caption: "Yangi kitob o'qiyapman 📚✨",
          timestamp: "6",
          views: 89,
          likes: 34,
        },
      ],
    },
    {
      id: "3",
      user: "Bobur Alimov",
      avatar: "/placeholder.svg?height=60&width=60",
      stories: [
        {
          id: "s4",
          type: "image",
          content: "/placeholder.svg?height=400&width=300",
          caption: "Yangi loyiha ustida ishlayapman 💻",
          timestamp: "8",
          views: 156,
          likes: 67,
        },
      ],
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

  // Story progress timer
  useEffect(() => {
    if (selectedStory && isPlaying) {
      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            // Move to next story
            const currentUser = stories.find((s) => s.id === selectedStory)
            if (currentUser && currentStoryIndex < currentUser.stories.length - 1) {
              setCurrentStoryIndex(currentStoryIndex + 1)
              return 0
            } else {
              // Move to next user or close
              setSelectedStory(null)
              setCurrentStoryIndex(0)
              return 0
            }
          }
          return prev + 2
        })
      }, 100)

      return () => clearInterval(timer)
    }
  }, [selectedStory, isPlaying, currentStoryIndex])

  const openStory = (storyId: string) => {
    if (storyId === "my") {
      // Open camera for new story
      console.log("Yangi hikoya yaratish")
      setIsPosting(true)
      return
    }
    setSelectedStory(storyId)
    setCurrentStoryIndex(0)
    setProgress(0)
  }

  const closeStory = () => {
    setSelectedStory(null)
    setCurrentStoryIndex(0)
    setProgress(0)
    setIsPlaying(true)
  }

  const sendReply = () => {
    if (replyText.trim()) {
      console.log("Javob yuborish:", replyText)
      setReplyText("")
    }
  }

  const currentUser = stories.find((s) => s.id === selectedStory)
  const currentStoryData = currentUser?.stories[currentStoryIndex]

  return (
    <div className="h-full">
      <Stories isPosting={isPosting} setIsPosting={setIsPosting} />
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-white/5 backdrop-blur-[10px] border border-white/10 rounded-2xl p-6 h-full overflow-hidden"
      >
        {/* Hover spot effect */}
        <div
          ref={spotRef}
          className="pointer-events-none absolute w-32 h-32 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-2xl opacity-0 transition-opacity duration-200 z-0"
        />

        <div className="relative z-10 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <Camera className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold text-text">{t("title")}</h1>
          </div>

          {/* Stories Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
            {stories.map((story, index) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="cursor-pointer"
                onClick={() => openStory(story.id)}
              >
                <div className="relative">
                  <div
                    className={`w-full aspect-[3/4] rounded-xl overflow-hidden ${
                      story.isOwn
                        ? "border-2 border-dashed border-primary/50 bg-gradient-to-br from-primary/20 to-purple-500/20"
                        : story.stories.length > 0
                          ? "ring-2 ring-gradient-to-r from-primary to-purple-500 ring-offset-2 ring-offset-transparent"
                          : "opacity-50"
                    }`}
                  >
                    {story.isOwn ? (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 to-purple-500/10">
                        <Plus className="w-8 h-8 text-primary mb-2" />
                        <span className="text-sm text-text font-medium">{t("add")}</span>
                      </div>
                    ) : story.stories.length > 0 ? (
                      <img
                        src={story.stories[0].content || "/placeholder.svg"}
                        alt={story.user}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-600" />
                    )}
                  </div>

                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                    <Avatar className="w-8 h-8 ring-2 ring-white">
                      <AvatarImage src={story.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{story.user[0]}</AvatarFallback>
                    </Avatar>
                  </div>
                </div>

                <p className="text-center text-sm text-text mt-3 truncate">{story.user}</p>
              </motion.div>
            ))}
          </div>

          {/* Recent Stories */}
          <div className="flex-1 overflow-y-auto">
            <h2 className="text-lg font-semibold text-text mb-4">{t("lastStories")}</h2>
            <div className="space-y-4">
              {stories
                .filter((s) => !s.isOwn && s.stories.length > 0)
                .map((story) => (
                  <motion.div
                    key={story.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white/5 rounded-xl p-4 border border-white/10 cursor-pointer hover:bg-white/10 transition-all"
                    onClick={() => openStory(story.id)}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={story.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{story.user[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-medium text-text">{story.user}</h3>
                        <p className="text-sm text-gray-400">
                          {story.stories.length} {t("count")} • {story.stories[0].timestamp} {t("hours_ago")}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-400">{story.stories[0].views} {t("views")}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Story Viewer Modal */}
      <AnimatePresence>
        {selectedStory && currentUser && currentStoryData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center"
            onClick={closeStory}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative w-full max-w-md h-full max-h-[80vh] bg-black rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Progress bars */}
              <div className="absolute top-4 left-4 right-4 z-10 flex gap-1">
                {currentUser.stories.map((_, index) => (
                  <div key={index} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white transition-all duration-100"
                      style={{
                        width: index < currentStoryIndex ? "100%" : index === currentStoryIndex ? `${progress}%` : "0%",
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Header */}
              <div className="absolute top-8 left-4 right-4 z-10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={currentUser.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{currentUser.user[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-white font-medium text-sm">{currentUser.user}</p>
                    <p className="text-white/70 text-xs">{currentStoryData.timestamp}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="w-8 h-8 text-white hover:bg-white/20"
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="w-8 h-8 text-white hover:bg-white/20"
                    onClick={() => setIsMuted(!isMuted)}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="w-8 h-8 text-white hover:bg-white/20"
                    onClick={closeStory}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Story Content */}
              <div className="w-full h-full flex items-center justify-center">
                {currentStoryData.type === "image" ? (
                  <img
                    src={currentStoryData.content || "/placeholder.svg"}
                    alt="Story"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <video
                    src={currentStoryData.content}
                    className="w-full h-full object-cover"
                    autoPlay
                    muted={isMuted}
                    loop
                  />
                )}
              </div>

              {/* Caption */}
              {currentStoryData.caption && (
                <div className="absolute bottom-20 left-4 right-4 z-10">
                  <p className="text-white text-sm bg-black/50 backdrop-blur-sm rounded-lg p-3">
                    {currentStoryData.caption}
                  </p>
                </div>
              )}

              {/* Story Stats */}
              <div className="absolute bottom-4 left-4 right-4 z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4 text-white/70 text-sm">
                    <span className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      {currentStoryData.likes}
                    </span>
                    <span>{currentStoryData.views} ko'rishlar</span>
                  </div>
                </div>

                {/* Reply Input */}
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Javob yozing..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="flex-1 bg-white/20 border-white/30 text-white placeholder:text-white/50"
                    onKeyPress={(e) => e.key === "Enter" && sendReply()}
                  />
                  <Button
                    size="icon"
                    className="bg-primary hover:bg-primary/80"
                    onClick={sendReply}
                    disabled={!replyText.trim()}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Navigation areas */}
              <div className="absolute inset-0 flex">
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => {
                    if (currentStoryIndex > 0) {
                      setCurrentStoryIndex(currentStoryIndex - 1)
                      setProgress(0)
                    }
                  }}
                />
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => {
                    if (currentStoryIndex < currentUser.stories.length - 1) {
                      setCurrentStoryIndex(currentStoryIndex + 1)
                      setProgress(0)
                    } else {
                      closeStory()
                    }
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
