"use client"

import { useRef, useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { MessageCircle, Search } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useTranslation } from "react-i18next"
import RecommendedCommunities from "../Recommended-Communities/RecommendedCommunities"

export default function HeroSection() {
  const { t } = useTranslation("hero")
  const [query, setQuery] = useState("")
  const cardRef = useRef<HTMLDivElement | null>(null)
  const spotRef = useRef<HTMLDivElement | null>(null)

  const handleSearch = () => {
    console.log("Qidirilyapti:", query)
  }

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
      spot.style.opacity = "1"

      const centerX = rect.width / 2
      const centerY = rect.height / 2
      const rotateX = -(y - centerY) / 40
      const rotateY = (x - centerX) / 40

      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
    }

    const handleMouseLeave = () => {
      spot.style.opacity = "0"
      card.style.transform = `rotateX(-10deg) rotateY(-5deg)`
    }

    card.addEventListener("mousemove", handleMouseMove)
    card.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      card.removeEventListener("mousemove", handleMouseMove)
      card.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  return (
    <div className="bg-radial-[at_50%_75%] from-[var(--bggradientend)] via-[var(--bggradient)] to-[var(--bgbradientstart)] to-90% pt-10 flex items-center justify-center overflow-hidden min-h-[70vh]">
      <section className="container mx-auto flex flex-col items-center justify-center flex-wrap px-2">
        <div className="relative perspective-[1000px] w-full max-w-2xl md:max-w-3xl lg:max-w-4xl">
          {/* 🔆 SPOT */}
          <div
            ref={spotRef}
            className="pointer-events-none absolute w-32 h-32 md:w-40 md:h-40 rounded-full bg-white/10 blur-2xl opacity-0 transition-opacity duration-200 z-0"
          ></div>

          {/* 💫 CARD + TILT */}
          <motion.div
            ref={cardRef}
            initial={{ scale: 0, y: 200, rotateX: 0, rotateY: 0, opacity: 0 }}
            animate={{ scale: 1, y: 0, rotateX: -10, rotateY: -5, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-10 transition-transform duration-200 ease-out will-change-transform border border-white/20 py-8 px-4 sm:py-12 sm:px-8 md:py-16 md:px-16 rounded-2xl bg-[var(--card-bg-gray)] backdrop-blur-[20px] w-full"
          >
            <div className="flex flex-col items-center">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <MessageCircle className="w-8 h-8 md:w-10 md:h-10 text-primary" />
                <span className="text-2xl md:text-4xl font-semibold text-text">
                  UzbekHub
                </span>
              </Link>
              <div className="mb-8 w-full">
                <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-text text-center">
                  {t("find_community_title")}{" "}
                  <span className="text-primary text-shadow-sm text-shadow-primary">
                    {t("community")}
                  </span>{" "}
                  {t("find_community_title_2")}
                </h1>
                <p className="mt-3 text-text text-center text-base md:text-lg">
                  {t("join_learn_share")}
                </p>
              </div>
              <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-2">
                <Input
                  placeholder={t("search_placeholder")}
                  className="h-12 w-full text-base md:text-lg"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <Button
                  onClick={handleSearch}
                  size="lg"
                  className="h-12 w-full sm:w-auto mt-2 sm:mt-0 bg-primary hover:scale-105 hover:rotate-3 cursor-pointer"
                >
                  <Search className="w-4 h-4 mr-2" />
                  {t("search")}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
        <div className="w-full mt-8">
          <RecommendedCommunities />
        </div>
      </section>
    </div>
  )
}
