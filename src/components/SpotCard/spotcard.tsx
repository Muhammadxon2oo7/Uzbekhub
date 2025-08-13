// SpotCard.tsx
'use client'

import { useRef, useState } from "react"
import { useInView } from "react-intersection-observer"
import { motion } from "framer-motion"
import { t } from "i18next"

interface Community {
  icon: string
  title: string
  members: number
}

export function SpotCard({ community }: { community: Community }) {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [visible, setVisible] = useState(false)
  const cardRef = useRef<HTMLDivElement | null>(null)

  const { ref: inViewRef, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const combinedRef = (node: HTMLDivElement | null) => {
    if (node) {
      cardRef.current = node
      inViewRef(node)
    }
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
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: "easeOut" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative cursor-pointer transition-all duration-200 bg-[var(--spotcard)] backdrop-blur-[10px] border border-white/10 hover:border-white/25 rounded-2xl p-6 shadow-md overflow-hidden"
    >
      <div
        className="absolute w-32 h-32 rounded-full bg-primary blur-2xl pointer-events-none transition-opacity duration-300"
        style={{
          left: pos.x - 64,
          top: pos.y - 64,
          opacity: visible ? 0.2 : 0,
        }}
      ></div>

      <div className="relative z-10 flex gap-4">
        <div className="text-4xl">{community.icon}</div>
        <div>
          <h3 className="text-xl font-semibold">{t(community.title) || community.title}</h3>
          <span className="text-sm text-gray-400">
            {community.members} {t("members") || "members"}
          </span>
        </div>
      </div>
    </motion.div>
  )
}
