// 'use client'

// import { useRef, useState, useEffect } from "react"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import { MessageCircle, Search } from "lucide-react"
// import Link from "next/link"
// import { motion } from "framer-motion"
// import RecommendedCommunities from "../Recommended-Communities/RecommendedCommunities"

// export default function HeroSection() {
//   const [query, setQuery] = useState("")
//   const cardRef = useRef<HTMLDivElement | null>(null)
//   const spotRef = useRef<HTMLDivElement | null>(null)

//   const handleSearch = () => {
//     console.log("Qidirilyapti:", query)
//   }

//   useEffect(() => {
//     const card = cardRef.current
//     const spot = spotRef.current
//     if (!card || !spot) return

//     const handleMouseMove = (e: MouseEvent) => {
//       const rect = card.getBoundingClientRect()
//       const x = e.clientX - rect.left
//       const y = e.clientY - rect.top

//       // Spot position
//       spot.style.left = `${x - 80}px`
//       spot.style.top = `${y - 80}px`
//       spot.style.opacity = '1'

//       // Tilt
//       const centerX = rect.width / 2
//       const centerY = rect.height / 2
//       const rotateX = -(y - centerY) / 40
//       const rotateY = (x - centerX) / 40

//       card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
//     }

//     const handleMouseLeave = () => {
//       spot.style.opacity = '0'
//       card.style.transform = `rotateX(-10deg) rotateY(-5deg)`
//     }

//     card.addEventListener('mousemove', handleMouseMove)
//     card.addEventListener('mouseleave', handleMouseLeave)

//     return () => {
//       card.removeEventListener('mousemove', handleMouseMove)
//       card.removeEventListener('mouseleave', handleMouseLeave)
//     }
//   }, [])

//   return (
//     <div className="bg-radial-[at_50%_75%] from-[100%_0_0] via-[var(--bggradient)] to-[var(--bgbradientstart)] to-90% pt-[60px] flex items-center justify-center overflow-hidden">
//       <section className="container mx-auto flex items-center justify-center flex-wrap">
//         <div className="relative perspective-[1000px]">
//           {/* 🔆 SPOT */}
//           <div
//             ref={spotRef}
//             className="pointer-events-none absolute w-40 h-40 rounded-full bg-white/10 blur-2xl opacity-0 transition-opacity duration-200 z-0"
//           ></div>

//           {/* 💫 CARD + TILT */}
//           <motion.div
//             ref={cardRef}
//             initial={{ scale: 0, y: 200, rotateX: 0, rotateY: 0, opacity: 0 }}
//             animate={{ scale: 1, y: 0, rotateX: -10, rotateY: -5, opacity: 1 }}
//             transition={{ duration: 0.8, ease: "easeOut" }}
//             className=" cursor-defaultrelative z-10 transition-transform duration-200 ease-out will-change-transform border border-white/20 py-[60px] px-[100px] rounded-2xl bg-[#f7f7f726] backdrop-blur-[20px]"
//           >
//             <div className="flex flex-col items-center">
//               <Link href="/" className="flex items-center gap-2">
//                 <MessageCircle className="w-10 h-10 text-primary" />
//                 <span className="text-[40px] font-semibold text-text">UzbekHub</span>
//               </Link>
//               <div className="mb-[40px]">
//                 <h1 className="text-4xl md:text-5xl font-bold text-text text-left">
//                   O'zinga mos <span className="text-primary text-shadow-sm text-shadow-primary">jamiyatni</span> top!
//                 </h1>
//                 <p className="mt-3 text-text text-center md:text-lg">
//                   Qiziqarli mavzular atrofida jamiyatga qo‘shil, o‘rgan, fikr almash.
//                 </p>
//               </div>
//               <div className="w-[500px] flex items-center justify-between gap-2">
//                 <Input
//                   placeholder="Masalan: Dasturchilar, Kitobxonlar..."
//                   className="h-[55px] w-full text-[20px]"
//                   value={query}
//                   onChange={(e) => setQuery(e.target.value)}
//                 />
//                 <Button
//                   onClick={handleSearch}
//                   size="lg"
//                   className="h-[50px] bg-primary hover:scale-105 hover:rotate-3 cursor-pointer"
//                 >
//                   <Search className="w-4 h-4 mr-2" />
//                   Qidirish
//                 </Button>
//               </div>
//             </div>
//           </motion.div>
//         </div>
//         <RecommendedCommunities/>
//       </section>
     
//     </div>
//   )
// }
"use client"

import { useRef, useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { MessageCircle, Search } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import RecommendedCommunities from "../Recommended-Communities/RecommendedCommunities"
import { useTranslation } from "react-i18next"

export default function HeroSection() {
  const { t } = useTranslation("translation")
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
      spot.style.opacity = '1'

      const centerX = rect.width / 2
      const centerY = rect.height / 2
      const rotateX = -(y - centerY) / 40
      const rotateY = (x - centerX) / 40

      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
    }

    const handleMouseLeave = () => {
      spot.style.opacity = '0'
      card.style.transform = `rotateX(-10deg) rotateY(-5deg)`
    }

    card?.addEventListener('mousemove', handleMouseMove)
    card?.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      card?.removeEventListener('mousemove', handleMouseMove)
      card?.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return (
    <div className="bg-radial-[at_50%_75%] from-[100%_0_0] via-[var(--bggradient)] to-[var(--bgbradientstart)] to-90% pt-[60px] flex items-center justify-center overflow-hidden">
      <section className="container mx-auto flex items-center justify-center flex-wrap">
        <div className="relative perspective-[1000px]">
          {/* 🔆 SPOT */}
          <div
            ref={spotRef}
            className="pointer-events-none absolute w-40 h-40 rounded-full bg-white/10 blur-2xl opacity-0 transition-opacity duration-200 z-0"
          ></div>

          {/* 💫 CARD + TILT */}
          <motion.div
            ref={cardRef}
            initial={{ scale: 0, y: 200, rotateX: 0, rotateY: 0, opacity: 0 }}
            animate={{ scale: 1, y: 0, rotateX: -10, rotateY: -5, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="cursor-defaultrelative z-10 transition-transform duration-200 ease-out will-change-transform border border-white/20 py-[60px] px-[100px] rounded-2xl bg-[#f7f7f726] backdrop-blur-[20px]"
          >
            <div className="flex flex-col items-center">
              <Link href="/" className="flex items-center gap-2">
                <MessageCircle className="w-10 h-10 text-primary" />
                <span className="text-[40px] font-semibold text-text">UzbekHub</span>
              </Link>
              <div className="mb-[40px]">
                <h1 className="text-4xl md:text-5xl font-bold text-text text-left">
                  {t("hero.find_community_title")}{" "}
                  <span className="text-primary text-shadow-sm text-shadow-primary">
                    {t("hero.community")}
                  </span>{" "}
                  {t("hero.find_community_title_2")}
                </h1>
                <p className="mt-3 text-text text-center md:text-lg">
                  {t("hero.join_learn_share")}
                </p>
              </div>
              <div className="w-[500px] flex items-center justify-between gap-2">
                <Input
                  placeholder={t("hero.search_placeholder")}
                  className="h-[55px] w-full text-[20px]"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <Button
                  onClick={handleSearch}
                  size="lg"
                  className="h-[50px] bg-primary hover:scale-105 hover:rotate-3 cursor-pointer"
                >
                  <Search className="w-4 h-4 mr-2" />
                  {t("hero.search")}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
        <RecommendedCommunities />
      </section>
    </div>
  )
}
