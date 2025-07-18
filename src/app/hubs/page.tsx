// 'use client'

// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Search } from 'lucide-react'
// import { useState, useRef } from 'react'
// import { motion } from 'framer-motion'
// import { useInView } from 'react-intersection-observer'

// const communities = [
//   { icon: "🧑‍💻", title: "Frontend Dasturchilar", desc: "React, Vue, JS ustalari", members: 1342 },
//   { icon: "📚", title: "Kitobxonlar", desc: "Har kuni yangi fikr", members: 847 },
//   { icon: "💬", title: "Suhbat guruhlari", desc: "Tanlovli muloqotlar", members: 560 },
//   { icon: "📸", title: "Fotografchilar", desc: "San’at bilan yashaydiganlar", members: 234 },
//   { icon: "🎨", title: "Dizayнерlar", desc: "UI/UX, Figma ustalari", members: 786 },
//   { icon: "💼", title: "Startupchilar", desc: "G‘oya va jamoa izlayotganlar", members: 491 },
//   { icon: "🧠", title: "O‘zini rivojlantirish", desc: "Disiplina, odatlar, vaqt", members: 1392 },
//   { icon: "🎵", title: "Musiqa sevuvchilar", desc: "Sof musiqaga bag‘ishlangan", members: 314 },
//   { icon: "🎮", title: "Geyмерлар", desc: "PC ва консоль ўйинлари", members: 728 },
//   { icon: "🌐", title: "Ingliz tili", desc: "Speaking ва grammar жамоаси", members: 1503 },
//   { icon: "🧘", title: "Ruhiy sog‘liq", desc: "Медитация, стрессдан қутулиш", members: 376 },
//   { icon: "📈", title: "Moliyaviy savodxonlik", desc: "Бюджет, инвестиция, FIRE", members: 598 },
//   { icon: "⚙️", title: "Texnologiyalar", desc: "AI, Web3, IoT янгиликлари", members: 1049 },
//   { icon: "✍️", title: "Yozuvchilar", desc: "Ижод, ҳикоя ва эссе мухлислари", members: 218 },
//   { icon: "🏃", title: "Sportchilar", desc: "Фитнес, югуриш ва мотивация", members: 467 },
// ]

// const Hubs = () => {
//   const [query, setQuery] = useState("")
//   const handleSearch = () => {
//     console.log("Qidirilyapti:", query)
//   }

//   return (
//     <section>
//       <div className='container mx-auto'>
//         <div className='h-[80vh] w-full flex items-center justify-center relative'>
//           <div className='absolute blur-[100px] w-[500px] h-[100px] bg-primary rounded-full shadow-[0px_0px_100px] shadow-primary'></div>
//           <form
//             onSubmit={(e) => e.preventDefault()}
//             className="z-10 w-[500px] flex flex-col items-end justify-between gap-2"
//           >
//             <Input
//               placeholder="Jamiyat yoki mavzuni qidiring..."
//               className="h-[55px] w-full text-[20px]"
//               value={query}
//               onChange={(e) => setQuery(e.target.value)}
//             />
//             <Button
//               onClick={handleSearch}
//               size="lg"
//               className="w-[200px] h-[50px] hover:scale-[0.95] bg-primary cursor-pointer"
//             >
//               <Search className="w-4 h-4 mr-2" />
//               Qidirish
//             </Button>
//           </form>
//         </div>

//         <div className="w-[90%] perspective-[1000px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mt-20">
//           {
//             communities.map((community, i) => (
//               <SpotCard key={i} community={community} />
//             ))
//           }
//         </div>
//       </div>
//     </section>
//   )
// }

// function SpotCard({ community }: { community: any }) {
//   const [pos, setPos] = useState({ x: 0, y: 0 })
//   const [visible, setVisible] = useState(false)
//   const cardRef = useRef<HTMLDivElement>(null)

//   const { ref: inViewRef, inView } = useInView({
//     triggerOnce: true,
//     threshold: 0.1,
//   })

//   const combinedRef = (node: HTMLDivElement) => {
//     cardRef.current = node
//     inViewRef(node)
//   }

//   const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
//     const rect = cardRef.current?.getBoundingClientRect()
//     if (!rect) return
//     const x = e.clientX - rect.left
//     const y = e.clientY - rect.top
//     setPos({ x, y })
//     setVisible(true)
//   }

//   const handleMouseLeave = () => {
//     setVisible(false)
//   }

//   return (
//     <motion.div
//       ref={combinedRef}
//       initial={{ opacity: 0, y: 50}}
//       animate={inView ? { opacity: 1, y: 0} : {}}
//       transition={{ duration: 0.5, ease: "easeOut" }}
//       onMouseMove={handleMouseMove}
//       onMouseLeave={handleMouseLeave}
//       className="group relative cursor-pointer transition-all duration-200 bg-white/5 backdrop-blur-[10px] border border-white/10 hover:border-white/25 transition-colors rounded-2xl p-6 shadow-md overflow-hidden"
//     >
//       {/* Moving Spot */}
//       <div
//         className="absolute w-32 h-32 rounded-full bg-primary blur-2xl pointer-events-none transition-opacity duration-300"
//         style={{
//           left: pos.x - 64,
//           top: pos.y - 64,
//           opacity: visible ? 0.2 : 0,
//         }}
//       />

//       {/* Content */}
//       <div className="relative z-10 flex gap-4">
//         <div className="text-4xl">{community.icon}</div>
//         <div>
//           <h3 className="text-xl font-semibold">{community.title}</h3>
//           <span className="text-sm text-gray-400">{community.members} a'zo</span>
//         </div>
//       </div>
//     </motion.div>
//   )
// }

// export default Hubs




'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useTranslation } from 'react-i18next'
import { t } from 'i18next'

const Hubs = () => {
  const [query, setQuery] = useState("")
  const { t } = useTranslation()

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

  const handleSearch = () => {
    console.log("Qidirilyapti:", query)
  }

  return (
    <section>
      <div className='container mx-auto'>
        <div className='h-[80vh] w-full flex items-center justify-center relative'>
          <div className='absolute blur-[100px] w-[500px] h-[100px] bg-primary rounded-full shadow-[0px_0px_100px] shadow-primary'></div>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="z-10 w-[500px] flex flex-col items-end justify-between gap-2"
          >
            <Input
              placeholder={t("hubs.search_placeholder")}
              className="h-[55px] w-full text-[20px]"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button
              onClick={handleSearch}
              size="lg"
              className="w-[200px] h-[50px] hover:scale-[0.95] bg-primary cursor-pointer"
            >
              <Search className="w-4 h-4 mr-2" />
              {t("hubs.search_button")}
            </Button>
          </form>
        </div>

        <div className="w-[90%] perspective-[1000px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mt-20">
          {
            communities.map((community, i) => (
              <SpotCard key={i} community={community} />
            ))
          }
        </div>
      </div>
    </section>
  )
}

function SpotCard({ community }: { community: any }) {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [visible, setVisible] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const { ref: inViewRef, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const combinedRef = (node: HTMLDivElement) => {
    cardRef.current = node
    inViewRef(node)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    setPos({ x, y })
    setVisible(true)
  }

  const handleMouseLeave = () => {
    setVisible(false)
  }

  return (
    <motion.div
      ref={combinedRef}
      initial={{ opacity: 0, y: 50}}
      animate={inView ? { opacity: 1, y: 0} : {}}
      transition={{ duration: 0.5, ease: "easeOut" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative cursor-pointer transition-all duration-200 bg-white/5 backdrop-blur-[10px] border border-white/10 hover:border-white/25 transition-colors rounded-2xl p-6 shadow-md overflow-hidden"
    >
      <div
        className="absolute w-32 h-32 rounded-full bg-primary blur-2xl pointer-events-none transition-opacity duration-300"
        style={{
          left: pos.x - 64,
          top: pos.y - 64,
          opacity: visible ? 0.2 : 0,
        }}
      />

      <div className="relative z-10 flex gap-4">
        <div className="text-4xl">{community.icon}</div>
        <div>
          <h3 className="text-xl font-semibold">{community.title}</h3>
          <span className="text-sm text-gray-400">{community.members} {` `}{t("hubs.members")}</span>
        </div>
      </div>
    </motion.div>
  )
}

export default Hubs
