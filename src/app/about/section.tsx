'use client'

import React, { useRef } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Instagram } from '../../../public/images/icons/instagram'
import { Telegram } from '../../../public/images/icons/telegram'
import { Github } from '../../../public/images/icons/github'
import { Gmail } from '../../../public/images/icons/gmail'
import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'

export const SectionPpl = ({
  name, role, desc, github, tag, tools
}: {
  name: string,
  role: string,
  desc: string,
  tag: string,
  github: string,
  tools: string[]
}) => {
  const { t } = useTranslation("translation")
  const glowRef = useRef<HTMLSpanElement>(null)

  const handleMouseMove = (e: React.MouseEvent) => {
    const glow = glowRef.current
    const target = e.currentTarget
    const rect = target.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    if (glow) {
      glow.style.left = `${x}px`
      glow.style.top = `${y}px`
    }
  }

  const handleClick = () => {
    const glow = glowRef.current
    if (!glow) return

    glow.animate(
      [
        { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
        { transform: 'translate(-50%, -50%) scale(3)', opacity: 0 }
      ],
      {
        duration: 400,
        easing: 'ease-out'
      }
    )
  }

  return (
    <motion.section
      id={name}
      className="py-12 sm:py-20 px-4 sm:px-6 text-white"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      viewport={{ once: true }}
    >
      <div className="max-w-2xl md:max-w-[750px] mx-auto flex flex-col md:flex-row items-center gap-6 md:gap-8">
        <img
          src={`/${name}-avatar.png`}
          alt={name}
          className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-primary shadow-lg"
        />
        <div className="w-full">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 flex flex-wrap items-center gap-2">
            <span
              className="relative inline-block group"
              onMouseMove={handleMouseMove}
              onMouseLeave={() => {
                if (glowRef.current) glowRef.current.style.opacity = '0'
              }}
              onMouseEnter={() => {
                if (glowRef.current) glowRef.current.style.opacity = '1'
              }}
              onClick={handleClick}
            >
              <span className="relative z-10 cursor-pointer">{name}</span>
              <span
                ref={glowRef}
                className="absolute z-0 w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-primary/40 blur-2xl opacity-0 transition-opacity duration-300 pointer-events-none"
                style={{ transform: 'translate(-50%, -50%)' }}
              />
            </span>
            <span className="text-base sm:text-lg text-primary font-semibold">– {role}</span>
          </h2>

          <p className="text-gray-300 text-base sm:text-lg mb-4">{desc}</p>

          <div className="max-w-full flex flex-wrap gap-2 mb-4">
            {tools.map((tool, index) => (
              <span
                key={index}
                className="bg-[var(--tools-bg)] text-[var(--tools-txt)] px-3 py-1 rounded-full text-xs sm:text-sm"
              >
                {tool}
              </span>
            ))}
          </div>

          {/* Кнопки соцсетей */}
          <div className="flex flex-wrap gap-2 sm:gap-4">
            <Link href={`https://github.com/${github}`} target="_blank" rel="noopener noreferrer">
              <Github width={32} height={32} />
            </Link>
            <Link href={`/msg/${tag}`}>
              <Button>
                {t(`about.contact`)}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
