"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { User, MapPin, Phone, Mail, Calendar, Edit3, Camera, Heart, MessageCircle, Users, Loader2, Check, X, Shield, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useTranslation } from "react-i18next"
import { useDropzone } from "react-dropzone"
import { getProfile, updateProfile, checkUsername, changeEmail, confirmEmailChange } from "@/lib/api"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import debounce from "lodash/debounce"
import { useRouter } from "next/navigation"


interface Profile {
  first_name: string
  last_name: string
  username: string
  bio: string
  profile_picture: string
  phone: string
  email: string
  location: string
  created_at: string
}

export default function ProfileView() {
  const { t } = useTranslation("translation")
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isUsernameChangeOpen, setIsUsernameChangeOpen] = useState(false)
  const [isEmailChangeOpen, setIsEmailChangeOpen] = useState(false)
  const [isEmailVerifyOpen, setIsEmailVerifyOpen] = useState(false)
  const [usernameStatus, setUsernameStatus] = useState<"checking" | "available" | "taken" | null>(null)
  const [newUsername, setNewUsername] = useState("")
  const [emailChangeData, setEmailChangeData] = useState({ new_email: "", password: "" })
  const [emailVerifyCode, setEmailVerifyCode] = useState("")
  const [profile, setProfile] = useState<Profile>({
    first_name: "",
    last_name: "",
    username: "",
    bio: "",
    profile_picture: "",
    phone: "",
    email: "",
    location: "",
    created_at: "",
  })
  const [tempProfile, setTempProfile] = useState<Profile>(profile)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)

  const cardRef = useRef<HTMLDivElement>(null)
  const spotRef = useRef<HTMLDivElement>(null)
  const emailInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const stats = [
    { label: t("dashboard.messages"), value: 1247, icon: MessageCircle, color: "text-blue-400" },
    { label: t("dashboard.groups"), value: 12, icon: Users, color: "text-green-400" },
    { label: t("dashboard.donations"), value: 5, icon: Heart, color: "text-red-400" },
  ]

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token")
      if (!token) {
        toast.error("Token topilmadi. Iltimos, kirish qiling.")
        setIsLoading(false)
        return
      }

      try {
        const response = await getProfile(token)
        const data = response.data
        setProfile({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          username: data.username || "",
          bio: data.bio || "",
          profile_picture: data.profile_picture || "",
          phone: data.phone || "",
          email: data.email || "",
          location: data.location || "",
          created_at: data.created_at || "",
        })
        setTempProfile({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          username: data.username || "",
          bio: data.bio || "",
          profile_picture: data.profile_picture || "",
          phone: data.phone || "",
          email: data.email || "",
          location: data.location || "",
          created_at: data.created_at || "",
        })
      } catch (error: any) {
        toast.error(error.response?.data?.detail || "Profil yuklanmadi.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [])

  
  const checkUsernameAvailability = useCallback(
    debounce(async (username: string) => {
      if (!username || username === profile.username) {
        setUsernameStatus(null)
        return
      }

      setUsernameStatus("checking")
      try {
        const response = await checkUsername(username)
        setUsernameStatus(response.data.available ? "available" : "taken")
      } catch (error: any) {
        setUsernameStatus("taken")
        toast.error(error.response?.data?.detail || "Username tekshirishda xato.")
      }
    }, 300),
    [profile.username]
  )

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


  useEffect(() => {
    if (isEmailChangeOpen && emailInputRef.current) {
      emailInputRef.current.focus()
    }
  }, [isEmailChangeOpen])

  const handleSave = async () => {
    const token = localStorage.getItem("token")
    if (!token) {
      toast.error("Token topilmadi. Iltimos, kirish qiling.")
      return
    }

    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append("first_name", tempProfile.first_name)
      formData.append("last_name", tempProfile.last_name)
      formData.append("bio", tempProfile.bio)
      formData.append("phone", tempProfile.phone)
      formData.append("location", tempProfile.location)
      if (avatarFile) {
        formData.append("profile_picture", avatarFile)
      }

      const response = await updateProfile(token, formData)
      setProfile({ ...profile, ...response.data })
      if (avatarFile) {
        const updatedResponse = await getProfile(token)
        setProfile(updatedResponse.data)
        setAvatarFile(null)
      }
      setIsEditing(false)
      toast.success(response.data?.message || "Profil muvaffaqiyatli yangilandi.")
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Profil yangilashda xato.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setTempProfile(profile)
    setAvatarFile(null)
    setIsEditing(false)
  }

  const handleUsernameChange = async () => {
    if (usernameStatus !== "available") {
      toast.error("Username mavjud emas yoki band.")
      return
    }

    const token = localStorage.getItem("token")
    if (!token) {
      toast.error("Token topilmadi.")
      return
    }

    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append("username", newUsername)
      const response = await updateProfile(token, formData)
      setProfile({ ...profile, username: newUsername })
      setIsUsernameChangeOpen(false)
      setNewUsername("")
      setUsernameStatus(null)
      toast.success(response.data?.message || "Username muvaffaqiyatli o'zgartirildi.")
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Username o'zgartirishda xato.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailChangeRequest = async () => {
    const token = localStorage.getItem("token")
    if (!token) {
      toast.error("Token topilmadi.")
      return
    }

    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(emailChangeData.new_email)) {
      toast.error("Yaroqli email manzilini kiriting.")
      return
    }

    setIsLoading(true)
    try {
      const response = await changeEmail(token, emailChangeData)
      setIsEmailChangeOpen(false)
      setIsEmailVerifyOpen(true)
      toast.success(response.data?.message || "Tasdiqlash kodi yuborildi.")
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Email o'zgartirishni boshlashda xato.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailVerify = async () => {
    const token = localStorage.getItem("token")
    if (!token) {
      toast.error("Token topilmadi.")
      return
    }


    if (!/^\d{5}$/.test(emailVerifyCode)) {
      toast.error("Tasdiqlash kodi 6 raqamdan iborat bo'lishi kerak.")
      return
    }

    setIsLoading(true)
    try {
      const response = await confirmEmailChange(token, { code: emailVerifyCode })
      const updatedResponse = await getProfile(token)
      setProfile(updatedResponse.data)
      setTempProfile(updatedResponse.data)
      setIsEmailVerifyOpen(false)
      setEmailChangeData({ new_email: "", password: "" })
      setEmailVerifyCode("")
      toast.success(response.data?.message || "Email muvaffaqiyatli o'zgartirildi.")
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Tasdiqlash kodida xato.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {

    localStorage.removeItem("token")
    

    document.cookie.split(";").forEach((cookie) => {
      const name = cookie.split("=")[0].trim()
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
    })
    

    toast.success("Tizimdan chiqildi.")
    

    router.push("/")
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [] },
    onDrop: (acceptedFiles) => {
      if (acceptedFiles[0]) {
        setAvatarFile(acceptedFiles[0])
        const previewUrl = URL.createObjectURL(acceptedFiles[0])
        setTempProfile({ ...tempProfile, profile_picture: previewUrl })
      }
    },
    disabled: !isEditing,
  })


  const handleEmailModalClose = (open: boolean) => {
    setIsEmailChangeOpen(open)
    if (!open) {
      setEmailChangeData({ new_email: "", password: "" })
    }
  }

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="w-8 h-8 text-primary" />
        </motion.div>
      </div>
    )
  }

  const fullName = `${profile.first_name} ${profile.last_name}`.trim()

  return (
    <TooltipProvider>
      <div className="h-full overflow-y-auto p-4">
        <motion.div
          ref={cardRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative bg-white/5 backdrop-blur-[10px] border border-white/10 rounded-2xl p-6 overflow-hidden shadow-xl"
        >

          <motion.div
            ref={spotRef}
            className="pointer-events-none absolute w-32 h-32 rounded-full bg-white/10 blur-2xl opacity-0 transition-opacity duration-200 z-0"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />

          <div className="relative z-10 max-w-4xl mx-auto">

            <motion.div 
              className="flex items-center justify-between mb-8"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-3">
                <User className="w-8 h-8 text-primary" />
                <h1 className="text-2xl font-bold text-text">{t("dashboard.profile")}</h1>
              </div>
              <div className="flex gap-2">
                {isEditing && (
                  <Button variant="outline" onClick={handleCancel}>
                    Bekor qilish
                  </Button>
                )}
                <Button
                  onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                  className="bg-primary hover:bg-primary/80"
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Edit3 className="w-4 h-4 mr-2" />}
                  {isEditing ? "Saqlash" : "Tahrirlash"}
                </Button>
                <Button
                  onClick={handleLogout}
                  variant="destructive"
                  disabled={isLoading}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Chiqish
                </Button>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    
              <motion.div 
                className="lg:col-span-1"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="bg-white/5 border-white/10 backdrop-blur-[10px]">
                  <CardContent className="p-6 text-center">
                    <div
                      {...getRootProps()}
                      className={`relative inline-block mb-4 cursor-pointer group ${
                        isDragActive ? "ring-2 ring-primary animate-pulse" : ""
                      } ${isEditing ? "border-2 border-dashed border-gray-400 rounded-full" : ""}`}
                    >
                      <input {...getInputProps()} />
                      <Avatar className="w-32 h-32 mx-auto">
                        <AvatarImage src={'https://api.rozievich.uz/' + tempProfile.profile_picture || "/placeholder.svg"} />
                        <AvatarFallback className="text-2xl">
                          {profile.first_name[0] || "U"}
                        </AvatarFallback>
                      </Avatar>
                      {isEditing && (
                        <motion.div 
                          className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          whileHover={{ scale: 1.1 }}
                        >
                          <Camera className="w-8 h-8 text-white" />
                        </motion.div>
                      )}
                    </div>

                    {isEditing ? (
                      <div className="space-y-3">
                        <Input
                          value={tempProfile.first_name}
                          onChange={(e) => setTempProfile({ ...tempProfile, first_name: e.target.value })}
                          className="bg-white/5 border-white/20 text-text text-center"
                          placeholder="Ism"
                        />
                        <Input
                          value={tempProfile.last_name}
                          onChange={(e) => setTempProfile({ ...tempProfile, last_name: e.target.value })}
                          className="bg-white/5 border-white/20 text-text text-center"
                          placeholder="Familiya"
                        />
                      </div>
                    ) : (
                      <>
                        <h2 className="text-xl font-bold text-text mb-1">{fullName}</h2>
                        <div className="flex items-center justify-center gap-2 text-gray-400 mb-4">
                          <span>@{profile.username}</span>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Dialog open={isUsernameChangeOpen} onOpenChange={setIsUsernameChangeOpen}>
                                <DialogTrigger asChild>
                                  <Button variant="ghost" size="sm" className="p-1">
                                    <Edit3 className="w-4 h-4 text-primary" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="bg-white/5 backdrop-blur-[10px] border-white/10">
                                  <DialogHeader>
                                    <DialogTitle>Username o'zgartirish</DialogTitle>
                                  </DialogHeader>
                                  <div className="relative">
                                    <Input
                                      value={newUsername}
                                      onChange={(e) => {
                                        const value = e.target.value.toLowerCase();
                                        setNewUsername(value);
                                        checkUsernameAvailability(value);
                                      }}
                                      className={`bg-white/5 border-white/20 text-text ${
                                        usernameStatus === "taken" ? "border-red-500" : usernameStatus === "available" ? "border-green-500" : ""
                                      }`}
                                      placeholder="Yangi username"
                                    />
                                    {usernameStatus === "checking" && (
                                      <Loader2 className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-gray-400" />
                                    )}
                                    {usernameStatus === "available" && (
                                      <Check className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                                    )}
                                    {usernameStatus === "taken" && (
                                      <X className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500" />
                                    )}
                                  </div>
                                  <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsUsernameChangeOpen(false)}>
                                      Bekor qilish
                                    </Button>
                                    <Button
                                      onClick={handleUsernameChange}
                                      className="bg-primary hover:bg-primary/80"
                                      disabled={isLoading || usernameStatus !== "available"}
                                    >
                                      {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                      Saqlash
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </TooltipTrigger>
                            <TooltipContent>
                              Username o'zgartirish
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </>
                    )}

                    <div className="flex items-center justify-center gap-1 text-gray-400 mb-4">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">
                        Qo'shilgan: {new Date(profile.created_at).toLocaleDateString() || "N/A"}
                      </span>
                    </div>

                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Faol</Badge>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/10 backdrop-blur-[10px] mt-6">
                  <CardHeader>
                    <CardTitle className="text-text">Statistika</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {stats.map((stat, index) => (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + 0.4 }}
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
              </motion.div>

              {/* Profile Details */}
              <motion.div 
                className="lg:col-span-2"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Card className="bg-white/5 border-white/10 backdrop-blur-[10px] mb-6">
                  <CardHeader>
                    <CardTitle className="text-text">Profil ma'lumotlari</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Bio */}
                    <div>
                      <label className="block text-sm font-medium text-text mb-2">Bio</label>
                      {isEditing ? (
                        <Textarea
                          value={tempProfile.bio}
                          onChange={(e) => setTempProfile({ ...tempProfile, bio: e.target.value })}
                          className="bg-white/5 border-white/20 text-text"
                          rows={3}
                        />
                      ) : (
                        <p className="text-gray-300 bg-white/5 rounded-lg p-3 border border-white/10">{profile.bio || "Bio yo'q"}</p>
                      )}
                    </div>

                    {/* Contact Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-text mb-2">
                          <Phone className="w-4 h-4 inline mr-2" />
                          Telefon
                        </label>
                        {isEditing ? (
                          <Input
                            type="tel"
                            value={tempProfile.phone}
                            onChange={(e) => setTempProfile({ ...tempProfile, phone: e.target.value })}
                            className="bg-white/5 border-white/20 text-text"
                          />
                        ) : (
                          <p className="text-gray-300 bg-white/5 rounded-lg p-3 border border-white/10">
                            {profile.phone || "Telefon yo'q"}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text mb-2">
                          <MapPin className="w-4 h-4 inline mr-2" />
                          Manzil
                        </label>
                        {isEditing ? (
                          <Input
                            value={tempProfile.location}
                            onChange={(e) => setTempProfile({ ...tempProfile, location: e.target.value })}
                            className="bg-white/5 border-white/20 text-text"
                          />
                        ) : (
                          <p className="text-gray-300 bg-white/5 rounded-lg p-3 border border-white/10">
                            {profile.location || "Manzil yo'q"}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Security Section */}
                <Card className="bg-white/5 border-white/10 backdrop-blur-[10px]">
                  <CardHeader>
                    <CardTitle className="text-text flex items-center gap-2">
                      <Shield className="w-5 h-5 text-primary" />
                      Xavfsizlik
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-text" />
                        <span className="text-gray-300">{profile.email || "Email yo'q"}</span>
                      </div>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Dialog open={isEmailChangeOpen} onOpenChange={handleEmailModalClose}>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="p-1">
                                <Edit3 className="w-4 h-4 text-primary" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-white/5 backdrop-blur-[10px] border-white/10">
                              <DialogHeader>
                                <DialogTitle>Email o'zgartirish</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <label className="block text-sm font-medium text-text mb-2">Yangi email</label>
                                  <Input
                                    type="email"
                                    value={emailChangeData.new_email}
                                    onChange={(e) => setEmailChangeData({ ...emailChangeData, new_email: e.target.value })}
                                    className="bg-white/5 border-white/20 text-text"
                                    ref={emailInputRef}
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-text mb-2">Parol</label>
                                  <Input
                                    type="password"
                                    value={emailChangeData.password}
                                    onChange={(e) => setEmailChangeData({ ...emailChangeData, password: e.target.value })}
                                    className="bg-white/5 border-white/20 text-text"
                                  />
                                </div>
                              </div>
                              <DialogFooter>
                                <Button variant="outline" onClick={() => handleEmailModalClose(false)}>
                                  Bekor qilish
                                </Button>
                                <Button
                                  onClick={handleEmailChangeRequest}
                                  className="bg-primary hover:bg-primary/80"
                                  disabled={isLoading || !emailChangeData.new_email || !emailChangeData.password}
                                >
                                  {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                  Yuborish
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </TooltipTrigger>
                        <TooltipContent>
                          Email o'zgartirish
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Email Verification Dialog */}
        <Dialog open={isEmailVerifyOpen} onOpenChange={setIsEmailVerifyOpen}>
          <DialogContent className="bg-white/5 backdrop-blur-[10px] border-white/10">
            <DialogHeader>
              <DialogTitle>Email tasdiqlash</DialogTitle>
            </DialogHeader>
            <div>
              <label className="block text-sm font-medium text-text mb-2">Tasdiqlash kodi</label>
              <Input
                value={emailVerifyCode}
                onChange={(e) => setEmailVerifyCode(e.target.value)}
                className="bg-white/5 border-white/20 text-text"
                placeholder="6 raqamli kodni kiriting"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEmailVerifyOpen(false)}>
                Bekor qilish
              </Button>
              <Button
                onClick={handleEmailVerify}
                className="bg-primary hover:bg-primary/80"
                disabled={isLoading || !emailVerifyCode}
              >
                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Tasdiqlash
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  )
}