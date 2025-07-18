// 'use client'

// import { motion } from "framer-motion"
// import { useInView } from "react-intersection-observer"
// import { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"

// const communities = [
//   { icon: "🧑‍💻", title: "Frontend Dasturchilar", desc: "React, Vue, JS ustalari", members: 1342 },
//   { icon: "📚", title: "Kitobxonlar", desc: "Har kuni yangi fikr", members: 847 },
//   { icon: "💬", title: "Suhbat guruhlari", desc: "Tanlovli muloqotlar", members: 560 },
//   { icon: "📸", title: "Fotografchilar", desc: "San’at bilan yashaydiganlar", members: 234 },
//   { icon: "🎨", title: "Dizaynerlar", desc: "UI/UX, Figma ustalari", members: 786 },
//   { icon: "💼", title: "Startupchilar", desc: "G‘oya va jamoa izlayotganlar", members: 491 },
//   { icon: "🧠", title: "O‘zini rivojlantirish", desc: "Disiplina, odatlar, vaqt", members: 1392 },
//   { icon: "🎵", title: "Musiqa sevuvchilar", desc: "Sof musiqaga bag‘ishlangan", members: 314 },
//   { icon: "🎮", title: "Geymerlar", desc: "PC va konsol o‘yinlari", members: 728 },
//   { icon: "🌐", title: "Ingliz tili", desc: "Speaking va grammar jamoasi", members: 1503 },
//   { icon: "🧘", title: "Ruhiy sog‘liq", desc: "Meditatsiya, stressdan qutulish", members: 376 },
//   { icon: "📈", title: "Moliyaviy savodxonlik", desc: "Byudjet, investitsiya, FIRE", members: 598 },
//   { icon: "⚙️", title: "Texnologiyalar", desc: "AI, Web3, IoT yangiliklari", members: 1049 },
//   { icon: "✍️", title: "Yozuvchilar", desc: "Ijod, hikoya va esse muxlislari", members: 218 },
//   { icon: "🏃", title: "Sportchilar", desc: "Fitnes, yugurish va motivatsiya", members: 467 },
// ]

// export default function RecommendedCommunities() {
//   const { ref, inView } = useInView({
//     triggerOnce: false,
//     threshold: 0.15,
//   })

//   const [animationCycle, setAnimationCycle] = useState(0)

//   // 👇 Har safar viewga kirganda qayta render qilish
//   useEffect(() => {
//     if (inView) {
//       setAnimationCycle(prev => prev + 1)
//     }
//   }, [inView])

//   return (
//     <section className="py-24 px-4 text-white overflow-hidden w-full" ref={ref}>
//       <div className="max-w-7xl mx-auto">
//         <motion.h2
//           key={`title-${animationCycle}`}
//           initial={{ opacity: 0, y: 40 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8 }}
//           className="text-center text-4xl md:text-5xl font-bold mb-16"
//         >
//           ✨ Tavsiya etilgan <span className="text-primary">jamiyatlar</span>
//         </motion.h2>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
//           {communities.map((community, i) => (
//             <motion.div
//               key={`${community.title}-${animationCycle}`}
//               initial={{ opacity: 0, y: 50, scale: 0.95 }}
//               animate={{ opacity: 1, y: 0, scale: 1 }}
//               transition={{ duration: 0.6, delay: i * 0.05 }}
//               whileHover={{
//                 scale: 1.03,
//                 rotate: [-1, 1, -1],
//                 transition: {
//                   duration: 0.6,
//                   repeat: Infinity,
//                   repeatType: "reverse",
//                 },
//               }}
//               className="relative bg-white/5 backdrop-blur-[10px] border border-white/10 rounded-2xl p-6 shadow-md overflow-hidden group"
//             >
//               {/* Spotlight */}
//               <div className="absolute -top-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl opacity-0 group-hover:opacity-60 transition duration-500 z-0" />

//               {/* Content */}
//               <div className="relative z-10 cursor-pointer">
//                 <div className="text-4xl mb-4">{community.icon}</div>
//                 <h3 className="text-xl font-semibold mb-2">{community.title}</h3>
//                 <p className="text-sm text-gray-300 mb-4">{community.desc}</p>
//                 <div className="flex items-center justify-between">
//                   <span className="text-sm text-gray-400">{community.members} a'zo</span>
//                   <Button
//                     variant="secondary"
//                     className="cursor-pointer text-sm px-4 py-1 bg-primary hover:bg-primary/80"
//                   >
//                     Qo‘shilish
//                   </Button>
//                 </div>
//               </div>
//             </motion.div>
//           ))}
//         </div>
//       </div>
//     </section>
//   )
// }

"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useTranslation } from "react-i18next"

export default function RecommendedCommunities() {
  const { t } = useTranslation("translation")
  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0.15,
  })

  const [animationCycle, setAnimationCycle] = useState(0)

  useEffect(() => {
    if (inView) {
      setAnimationCycle(prev => prev + 1)
    }
  }, [inView])

  const communities = [
    {
      icon: "🧑‍💻",
      title: t("recommended.frontend.title"),
      desc: t("recommended.frontend.desc"),
      members: 1342,
    },
    {
      icon: "📚",
      title: t("recommended.readers.title"),
      desc: t("recommended.readers.desc"),
      members: 847,
    },
    {
      icon: "💬",
      title: t("recommended.chat.title"),
      desc: t("recommended.chat.desc"),
      members: 560,
    },
    {
      icon: "📸",
      title: t("recommended.photographers.title"),
      desc: t("recommended.photographers.desc"),
      members: 234,
    },
    {
      icon: "🎨",
      title: t("recommended.designers.title"),
      desc: t("recommended.designers.desc"),
      members: 786,
    },
    {
      icon: "💼",
      title: t("recommended.startup.title"),
      desc: t("recommended.startup.desc"),
      members: 491,
    },
    {
      icon: "🧠",
      title: t("recommended.selfdev.title"),
      desc: t("recommended.selfdev.desc"),
      members: 1392,
    },
    {
      icon: "🎵",
      title: t("recommended.music.title"),
      desc: t("recommended.music.desc"),
      members: 314,
    },
    {
      icon: "🎮",
      title: t("recommended.gamers.title"),
      desc: t("recommended.gamers.desc"),
      members: 728,
    },
    {
      icon: "🌐",
      title: t("recommended.english.title"),
      desc: t("recommended.english.desc"),
      members: 1503,
    },
    {
      icon: "🧘",
      title: t("recommended.mental.title"),
      desc: t("recommended.mental.desc"),
      members: 376,
    },
    {
      icon: "📈",
      title: t("recommended.finance.title"),
      desc: t("recommended.finance.desc"),
      members: 598,
    },
    {
      icon: "⚙️",
      title: t("recommended.tech.title"),
      desc: t("recommended.tech.desc"),
      members: 1049,
    },
    {
      icon: "✍️",
      title: t("recommended.writers.title"),
      desc: t("recommended.writers.desc"),
      members: 218,
    },
    {
      icon: "🏃",
      title: t("recommended.sport.title"),
      desc: t("recommended.sport.desc"),
      members: 467,
    },
  ]

  return (
    <section className="py-24 px-4 text-white overflow-hidden w-full" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <motion.h2
          key={`title-${animationCycle}`}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center text-4xl md:text-5xl font-bold mb-16"
        >
          ✨ {t("recommended.title")} <span className="text-primary">{t("recommended.highlight")}</span>
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {communities.map((community, i) => (
            <motion.div
              key={`${community.title}-${animationCycle}`}
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: i * 0.05 }}
              whileHover={{
                scale: 1.03,
                rotate: [-1, 1, -1],
                transition: {
                  duration: 0.6,
                  repeat: Infinity,
                  repeatType: "reverse",
                },
              }}
              className="relative bg-white/5 backdrop-blur-[10px] border border-white/10 rounded-2xl p-6 shadow-md overflow-hidden group"
            >
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl opacity-0 group-hover:opacity-60 transition duration-500 z-0" />
              <div className="relative z-10 cursor-pointer">
                <div className="text-4xl mb-4">{community.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{community.title}</h3>
                <p className="text-sm text-gray-300 mb-4">{community.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">{community.members} {t("recommended.members")}</span>
                  <Button
                    variant="secondary"
                    className="cursor-pointer text-sm px-4 py-1 bg-primary hover:bg-primary/80"
                  >
                    {t("recommended.join")}
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
