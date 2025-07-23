'use client'

import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { SectionPpl } from './section'
import { members } from '@/components/fake-backends/members'

export default function AboutPage() {
  const { t } = useTranslation("translation")
  const ref = useRef<HTMLDivElement>(null)

  // motion values (начало = немного наклонён)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const rotateX = useTransform(y, [0, 1], [8, -8])
  const rotateY = useTransform(x, [0, 1], [-8, 8])

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return

    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    const percentX = mouseX / rect.width
    const percentY = mouseY / rect.height

    x.set(percentX)
    y.set(percentY)
  }

  const handleMouseLeave = () => {
    // Возвращаем к начальному положению
    animate(x, 0, { duration: 0.4 })
    animate(y, 0, { duration: 0.4 })
  }

  return (
    <div className="bg-radial-[at_50%_75%] from-[var(--bggradientend)] via-[var(--bggradient)] to-[var(--bgbradientstart)] to-90% text-white">
      <div className="container mx-auto px-2">
        <div className="flex items-center justify-center py-8 sm:py-12 md:py-20 px-2">
          <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              rotateX,
              rotateY,
              transformPerspective: 1000
            }}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="bg-[var(--card-bg-gray)] backdrop-blur-[10px] border-1 border-white rounded-3xl p-4 sm:p-8 md:p-16 shadow-xl max-w-full sm:max-w-2xl md:max-w-4xl w-full text-center space-y-8"
          >
            <div className="flex items-center justify-center gap-3">
              <MessageCircle className="text-primary w-8 h-8 sm:w-10 sm:h-10" />
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-text">UzbekHub</h1>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-base sm:text-lg md:text-xl text-[var(--darker-text)]"
            >
              {t("about.description", {
                defaultValue:
                  "Bizning jamoa foydalanuvchilar uchun eng mos va qiziqarli jamiyatlarni yaratishga intiladi. Frontend, backend va dizayn bo‘yicha tajribali jamoamiz siz uchun shu yerda."
              })}
            </motion.p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 text-left mt-6 md:mt-10">
              {members.map((member, i) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.2 }}
                  className="bg-white/5 rounded-xl p-4 sm:p-5 border border-white/10 backdrop-blur-sm hover:scale-[1.03] transition-transform duration-300"
                >
                  <Link href={`#${member.name}`}>
                    <h3 className="text-primary text-base sm:text-lg font-semibold">{member.role}</h3>
                    <p className="text-text text-sm mt-1">{member.name}</p>
                    <p className="text-gray-400 text-xs sm:text-sm">{t(`about.members_desc.${member.tag}`)}</p>
                  </Link>
                </motion.div>
              ))}
            </div>

            <Link href="/">
              <Button variant="secondary" className="mt-6 bg-primary text-white hover:bg-primary/80 transition w-full sm:w-auto">
                {t("about.back_to_home", { defaultValue: "Bosh sahifaga qaytish" })}
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Секции участников */}
        <div className="space-y-8 sm:space-y-12 mt-8">
          {members.map((member) => (
            <SectionPpl
              key={member.name}
              name={member.name}
              role={member.role}
              desc={t(`about.members_desc.${member.tag}`)}
              tag={member.tag}
              github={member.github}
              tools={member.tools}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
