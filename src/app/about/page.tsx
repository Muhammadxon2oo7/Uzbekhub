'use client'

import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function AboutPage() {
  const { t } = useTranslation("translation")

  return (
    <div className="min-h-screen bg-radial-[at_50%_75%] from-[100%_0_0] via-[var(--bggradient)] to-[var(--bgbradientstart)] to-90% text-white flex items-center justify-center py-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="bg-white/5 backdrop-blur-[10px] border border-white/10 rounded-3xl p-10 md:p-16 shadow-xl max-w-4xl text-center space-y-8"
      >
        <div className="flex items-center justify-center gap-3">
          <MessageCircle className="text-primary w-10 h-10" />
          <h1 className="text-4xl md:text-5xl font-bold text-text">UzbekHub</h1>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-lg md:text-xl text-gray-300"
        >
          {t("about.description", {
            defaultValue: "Bizning jamoa foydalanuvchilar uchun eng mos va qiziqarli jamiyatlarni yaratishga intiladi. Frontend, backend va dizayn bo‘yicha tajribali jamoamiz siz uchun shu yerda."
          })}
        </motion.p>

        <div className="grid md:grid-cols-3 gap-6 text-left mt-10">
          {[
            { role: 'Frontend Developer', name: 'Muhammadxon', desc: '2 yillik tajribaga ega dasturchi' },
            { role: 'Frontend Developer', name: 'Sirojiddin', desc: 'kuchli qobilyatlik dasturchi' },
            { role: 'Backend Developer', name: 'Oybek', desc: '2+ yillik tajribaga ega dasturchi' },
          ].map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.2 }}
              className="bg-white/5 rounded-xl p-5 border border-white/10 backdrop-blur-sm hover:scale-[1.03] transition-transform duration-300"
            >
              <h3 className="text-primary text-lg font-semibold">{member.role}</h3>
              <p className="text-text text-sm mt-1">{member.name}</p>
              <p className="text-gray-400 text-sm">{member.desc}</p>
            </motion.div>
          ))}
        </div>

        <Link href="/">
          <Button variant="secondary" className="mt-6 bg-primary text-white hover:bg-primary/80 transition">
             {t("about.back_to_home", { defaultValue: "Bosh sahifaga qaytish" })}
          </Button>
        </Link>
      </motion.div>
    </div>
  )
}
