'use client'

import React, { useRef } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Instagram } from '../../../public/images/icons/instagram'
import { Telegram } from '../../../public/images/icons/telegram'
import { Github } from '../../../public/images/icons/github'
import { Gmail } from '../../../public/images/icons/gmail'

export const SectionPpl = ({
  name, role, desc, email, telegram, instagram, github, tools
}: {
  name: string,
  role: string,
  desc: string,
  email: string,
  telegram: string,
  instagram: string,
  github: string,
  tools: string[]
}) => {
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
      className="py-20 px-6 text-white"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      viewport={{ once: true }}
    >
      <div className="max-w-[750px] mx-auto flex flex-col md:flex-row items-center gap-8">
        <img
          src={`/${name}-avatar.png`}
          alt={name}
          className="w-40 h-40 rounded-full border-4 border-primary shadow-lg"
        />
        <div>
          <h2 className="text-3xl font-bold mb-2 flex items-center gap-2">
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
                className="absolute z-0 w-32 h-32 rounded-full bg-primary/40 blur-2xl opacity-0 transition-opacity duration-300 pointer-events-none"
                style={{ transform: 'translate(-50%, -50%)' }}
              />
            </span>
            – {role}
          </h2>

          <p className="text-gray-300 text-lg mb-4">{desc}</p>

          <div className="max-w-[550px] flex flex-wrap gap-2 mb-4">
            {tools.map((tool, index) => (
              <span
                key={index}
                className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm"
              >
                {tool}
              </span>
            ))}
          </div>

          {/* Кнопки соцсетей */}
          <div className="flex gap-[4px]">
            <Link href={`https://t.me/${telegram}`} target="_blank" rel="noopener noreferrer">
              <Telegram width={36} height={36} />
            </Link>
            <Link href={`https://instagram.com/${instagram}`} target="_blank" rel="noopener noreferrer">
              <Instagram width={36} height={36} />
            </Link>
            <Link href={`https://github.com/${github}`} target="_blank" rel="noopener noreferrer">
              <Github width={36} height={36} />
            </Link>
            <Link href={`mailto:${email}`}>
              <Gmail width={36} height={36} />
            </Link>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
