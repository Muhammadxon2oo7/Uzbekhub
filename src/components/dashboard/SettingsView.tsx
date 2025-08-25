"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Settings, Bell, Shield, Globe, Moon, Sun, Volume2, Lock, Eye, Smartphone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTranslation } from "react-i18next"
import i18n from "@/lib/i18n"
import { SelectGroup } from "@radix-ui/react-select"

const languages = [
  { code: "uz", label: "O‘zbek" },
  { code: "en", label: "English" },
  { code: "ru", label: "Русский" },
];

export default function SettingsView() {
  const { t } = useTranslation("translation")
  const [darkMode, setDarkMode] = useState(false)
  const [currentLang, setCurrentLang] = useState<string | undefined>(undefined); 
  useEffect(() => {
    setCurrentLang(i18n.language);
  }, []);
  const [notifications, setNotifications] = useState({
    messages: true,
    groups: true,
    donations: false,
    mentions: true,
  })
  const [privacy, setPrivacy] = useState({
    showOnline: true,
    showLocation: false,
    allowDonations: true,
    profileVisibility: "public",
  })

  const cardRef = useRef<HTMLDivElement>(null)
  const spotRef = useRef<HTMLDivElement>(null)

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

  const handleChange = (langCode: string) => {
    setCurrentLang(langCode)
    i18n.changeLanguage(langCode)
  }

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
          <div className="flex items-center gap-3 mb-6">
            <Settings className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold text-text">{t("dashboard.settings")}</h1>
          </div>

          {/* Settings Tabs */}
          <Tabs defaultValue="general" className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-4 bg-white/5 border border-white/10">
              <TabsTrigger value="general" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                {t("dashboard.general")}
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                {t("dashboard.notifications")}
              </TabsTrigger>
              <TabsTrigger value="privacy" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                {t("dashboard.privacy")}
              </TabsTrigger>
              <TabsTrigger value="security" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                {t("dashboard.security")}
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 mt-6 overflow-y-auto">
              <TabsContent value="general" className="space-y-6">
                <Card className="bg-white/5 border-white/10 backdrop-blur-[10px]">
                  <CardHeader>
                    <CardTitle className="text-text flex items-center gap-2">
                      <Globe className="w-5 h-5" />
                      {t("dashboard.appearance")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-text">{t("dashboard.language")}</label>
                      <Select defaultValue="uz" value={currentLang} onValueChange={handleChange}>
                        <SelectTrigger className="bg-white/5 border-white/20 text-text">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {
                              currentLang && 
                              languages.map((lang) => (
                                <SelectItem
                                  key={lang.code}
                                  value={lang.code}
                                >
                                  {lang.label}
                                </SelectItem>
                              ))
                            }
                            
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/10 backdrop-blur-[10px]">
                  <CardHeader>
                    <CardTitle className="text-text flex items-center gap-2">
                      <Volume2 className="w-5 h-5" />
                      {t("dashboard.sound")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-text">{t("dashboard.message_sounds")}</p>
                        <p className="text-sm text-gray-400">{t("dashboard.message_sounds_desc")}</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-text">{t("dashboard.notification_sounds")}</p>
                        <p className="text-sm text-gray-400">{t("dashboard.notification_sounds_desc")}</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications" className="space-y-6">
                <Card className="bg-white/5 border-white/10 backdrop-blur-[10px]">
                  <CardHeader>
                    <CardTitle className="text-text flex items-center gap-2">
                      <Bell className="w-5 h-5" />
                      {t("dashboard.notification_settings")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-text">{t("dashboard.message_notifications")}</p>
                        <p className="text-sm text-gray-400">{t("dashboard.message_notifications_desc")}</p>
                      </div>
                      <Switch
                        checked={notifications.messages}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, messages: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-text">{t("dashboard.group_notifications")}</p>
                        <p className="text-sm text-gray-400">{t("dashboard.group_notifications_desc")}</p>
                      </div>
                      <Switch
                        checked={notifications.groups}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, groups: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-text">{t("dashboard.donation_notifications")}</p>
                        <p className="text-sm text-gray-400">{t("dashboard.donation_notifications_desc")}</p>
                      </div>
                      <Switch
                        checked={notifications.donations}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, donations: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-text">{t("dashboard.mention_notifications")}</p>
                        <p className="text-sm text-gray-400">{t("dashboard.mention_notifications_desc")}</p>
                      </div>
                      <Switch
                        checked={notifications.mentions}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, mentions: checked })}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="privacy" className="space-y-6">
                <Card className="bg-white/5 border-white/10 backdrop-blur-[10px]">
                  <CardHeader>
                    <CardTitle className="text-text flex items-center gap-2">
                      <Eye className="w-5 h-5" />
                      {t("dashboard.privacy_settings")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-text">{t("dashboard.show_online_status")}</p>
                        <p className="text-sm text-gray-400">{t("dashboard.show_online_status_desc")}</p>
                      </div>
                      <Switch
                        checked={privacy.showOnline}
                        onCheckedChange={(checked) => setPrivacy({ ...privacy, showOnline: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-text">{t("dashboard.show_location")}</p>
                        <p className="text-sm text-gray-400">{t("dashboard.show_location_desc")}</p>
                      </div>
                      <Switch
                        checked={privacy.showLocation}
                        onCheckedChange={(checked) => setPrivacy({ ...privacy, showLocation: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-text">{t("dashboard.allow_donations")}</p>
                        <p className="text-sm text-gray-400">{t("dashboard.allow_donations_desc")}</p>
                      </div>
                      <Switch
                        checked={privacy.allowDonations}
                        onCheckedChange={(checked) => setPrivacy({ ...privacy, allowDonations: checked })}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-text">{t("dashboard.profile_visibility")}</label>
                      <Select
                        value={privacy.profileVisibility}
                        onValueChange={(value) => setPrivacy({ ...privacy, profileVisibility: value })}
                      >
                        <SelectTrigger className="bg-white/5 border-white/20 text-text">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">{t("dashboard.public")}</SelectItem>
                          <SelectItem value="friends">{t("dashboard.friends_only")}</SelectItem>
                          <SelectItem value="private">{t("dashboard.private")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="space-y-6">
                <Card className="bg-white/5 border-white/10 backdrop-blur-[10px]">
                  <CardHeader>
                    <CardTitle className="text-text flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      {t("dashboard.security_settings")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button className="w-full justify-start bg-white/5 hover:bg-white/10 border border-white/20">
                      <Lock className="w-4 h-4 mr-3" />
                      {t("dashboard.change_password")}
                    </Button>

                    <Button className="w-full justify-start bg-white/5 hover:bg-white/10 border border-white/20">
                      <Smartphone className="w-4 h-4 mr-3" />
                      {t("dashboard.two_factor_auth")}
                    </Button>

                    <div className="pt-4 border-t border-white/10">
                      <h3 className="font-medium text-text mb-3">{t("dashboard.active_sessions")}</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                          <div>
                            <p className="font-medium text-text">Current Session</p>
                            <p className="text-sm text-gray-400">Chrome on Windows • Tashkent, UZ</p>
                          </div>
                          <div className="w-3 h-3 bg-green-500 rounded-full" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </motion.div>
    </div>
  )
}
