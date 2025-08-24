"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Heart, Send, History, TrendingUp, Gift, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslation } from "react-i18next"

export default function DonateView() {
  const { t } = useTranslation("DashboardDonate")
  const [amount, setAmount] = useState("")
  const [recipient, setRecipient] = useState("")
  const cardRef = useRef<HTMLDivElement>(null)
  const spotRef = useRef<HTMLDivElement>(null)

  // Mock donation data
  const recentDonations = [
    {
      id: "1",
      recipient: "Malika Karimova",
      avatar: "/placeholder.svg?height=40&width=40",
      amount: 50000,
      currency: "UZS",
      message: "Tug'ilgan kuning bilan!",
      date: "2024-01-20",
      type: "sent",
    },
    {
      id: "2",
      sender: "Bobur Rahimov",
      avatar: "/placeholder.svg?height=40&width=40",
      amount: 25000,
      currency: "UZS",
      message: "Yordam uchun rahmat!",
      date: "2024-01-18",
      type: "received",
    },
    {
      id: "3",
      recipient: "IT Developers UZ",
      avatar: "/placeholder.svg?height=40&width=40",
      amount: 100000,
      currency: "UZS",
      message: "Jamoa uchun qo'llab-quvvatlash",
      date: "2024-01-15",
      type: "sent",
    },
  ]

  const quickAmounts = [10000, 25000, 50000, 100000, 250000, 500000]

  const stats = {
    totalSent: 275000,
    totalReceived: 125000,
    thisMonth: 150000,
    donationsCount: 12,
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("uz-UZ").format(amount) + " UZS"
  }

  const handleSendDonation = () => {
    if (amount && recipient) {
      console.log("Sending donation:", { amount, recipient })
      setAmount("")
      setRecipient("")
    }
  }

  return (
    <div className="h-full">
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-white/5 backdrop-blur-[10px] border border-white/10 rounded-2xl p-6 h-full overflow-scroll"
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
              <Heart className="w-8 h-8 text-primary" />
              <h1 className="text-2xl font-bold text-text">{t("title")}</h1>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            {/* Send Donation */}
            <div className="lg:col-span-1">
              <Card className="bg-white/5 border-white/10 backdrop-blur-[10px] mb-6">
                <CardHeader>
                  <CardTitle className="text-text flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    {t("send_donation")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text mb-2">{t("recipient")}</label>
                    <Input
                      placeholder="@username"
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      className="bg-white/5 border-white/20 text-text"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text mb-2">{t("amount")}</label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="bg-white/5 border-white/20 text-text"
                    />
                  </div>

                  {/* Quick amounts */}
                  <div>
                    <label className="block text-sm font-medium text-text mb-2">{t("quick_amounts")}</label>
                    <div className="grid grid-cols-2 gap-2">
                      {quickAmounts.map((quickAmount) => (
                        <Button
                          key={quickAmount}
                          variant="outline"
                          size="sm"
                          onClick={() => setAmount(quickAmount.toString())}
                          className="border-white/20 hover:bg-white/10 text-text"
                        >
                          {formatCurrency(quickAmount)}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={handleSendDonation}
                    className="w-full bg-primary hover:bg-primary/80"
                    disabled={!amount || !recipient}
                  >
                    <Gift className="w-4 h-4 mr-2" />
                    {t("send")}
                  </Button>
                </CardContent>
              </Card>

              {/* Stats */}
              <Card className="bg-white/5 border-white/10 backdrop-blur-[10px]">
                <CardHeader>
                  <CardTitle className="text-text flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    {t("statistics")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-300">{t("total_sent")}</span>
                    <span className="font-semibold text-red-400">{formatCurrency(stats.totalSent)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">{t("total_received")}</span>
                    <span className="font-semibold text-green-400">{formatCurrency(stats.totalReceived)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">{t("this_month")}</span>
                    <span className="font-semibold text-primary">{formatCurrency(stats.thisMonth)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">{t("donations_count")}</span>
                    <span className="font-semibold text-text">{stats.donationsCount}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Transaction History */}
            <div className="lg:col-span-2">
              <Card className="bg-white/5 border-white/10 backdrop-blur-[10px] h-full">
                <CardHeader>
                  <CardTitle className="text-text flex items-center gap-2">
                    <History className="w-5 h-5" />
                    {t("transaction_history")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-full overflow-y-auto">
                  <div className="space-y-4">
                    {recentDonations.map((donation, index) => (
                      <motion.div
                        key={donation.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white/5 rounded-lg p-4 border border-white/10"
                      >
                        <div className="flex items-start gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={donation.avatar || "/placeholder.svg"} />
                            <AvatarFallback>
                              {donation.type === "sent" ? donation.recipient?.[0] : donation.sender?.[0]}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-text">
                                  {donation.type === "sent"
                                    ? `${t("sent_to")} ${donation.recipient}${t("ga")}`
                                    : `${t("received_from")} ${donation.sender}${t("dan")}`}
                                </p>
                                <p className="text-sm text-gray-400">{new Date(donation.date).toLocaleDateString()}</p>
                              </div>
                              <div className="text-right">
                                <p
                                  className={`font-semibold ${
                                    donation.type === "sent" ? "text-red-400" : "text-green-400"
                                  }`}
                                >
                                  {donation.type === "sent" ? "-" : "+"}
                                  {formatCurrency(donation.amount)}
                                </p>
                                <Badge
                                  className={`text-xs ${
                                    donation.type === "sent"
                                      ? "bg-red-500/20 text-red-400 border-red-500/30"
                                      : "bg-green-500/20 text-green-400 border-green-500/30"
                                  }`}
                                >
                                  {donation.type === "sent" ? t("sent") : t("received")}
                                </Badge>
                              </div>
                            </div>
                            {donation.message && (
                              <p className="text-sm text-gray-300 mt-2 bg-white/5 rounded p-2">"{donation.message}"</p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
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
