"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface ConnectionStatusBarProps {
  isSidebarCollapsed?: boolean
}

export default function ConnectionStatusBar({ isSidebarCollapsed = false }: ConnectionStatusBarProps) {
  const [isOnline, setIsOnline] = useState(true)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    // Set initial status
    setIsOnline(navigator.onLine)

    // Listen for online/offline events
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const leftPosition = isSidebarCollapsed ? "4rem" : "16rem"

  return (
    <AnimatePresence>
      {!isDismissed && (
        <motion.div
          className="fixed top-0 right-0 h-12 z-50 overflow-hidden backdrop-blur-sm border-b border-white/10 shadow-lg mb-[10px] bg-white/5 border-white/10 backdrop-blur-[10px]"
          style={{
            left: leftPosition,
            background: isOnline
              ? "linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)"
              : "linear-gradient(135deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%)",
          }}
          initial={{ opacity: 0, y: -48, scale: 0.95 }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
            boxShadow: isOnline ? "0 4px 20px rgba(16, 185, 129, 0.3)" : "0 4px 20px rgba(239, 68, 68, 0.3)",
          }}
          exit={{
            opacity: 0,
            y: -48,
            scale: 0.95,
            transition: { duration: 0.3 },
          }}
          transition={{
            duration: 0.6,
            ease: [0.25, 0.46, 0.45, 0.94],
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
          whileHover={{
            scale: 1.02,
            transition: { duration: 0.2 },
          }}
        >
          <motion.div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.1) 75%, transparent 100%)",
            }}
            animate={{
              x: ["-200%", "200%"],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              repeatDelay: 1,
            }}
          />

          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/40 rounded-full"
              style={{
                left: `${20 + i * 15}%`,
                top: "50%",
              }}
              animate={{
                y: [-10, -20, -10],
                opacity: [0.3, 0.8, 0.3],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 2 + i * 0.3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: i * 0.2,
              }}
            />
          ))}

          <div className="relative flex items-center justify-center h-full px-6">
            <motion.div
              className="flex items-center gap-3"
              animate={{
                opacity: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              <motion.div
                className={`w-3 h-3 rounded-full ${isOnline ? "bg-white" : "bg-white"} shadow-lg`}
                animate={{
                  scale: [1, 1.3, 1],
                  boxShadow: isOnline
                    ? ["0 0 0 0 rgba(255,255,255,0.7)", "0 0 0 8px rgba(255,255,255,0)", "0 0 0 0 rgba(255,255,255,0)"]
                    : ["0 0 0 0 rgba(255,255,255,0.7)", "0 0 0 8px rgba(255,255,255,0)", "0 0 0 0 rgba(255,255,255,0)"],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeOut",
                }}
              />

              <motion.span
                className="text-white font-semibold text-sm tracking-wide"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                {isOnline ? "Connected" : "Disconnected"}
              </motion.span>

              {isOnline && (
                <motion.div
                  className="flex gap-1"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-1 bg-white/80 rounded-full"
                      style={{ height: `${8 + i * 2}px` }}
                      animate={{
                        scaleY: [0.5, 1, 0.5],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 1.2,
                        repeat: Number.POSITIVE_INFINITY,
                        delay: i * 0.2,
                        ease: "easeInOut",
                      }}
                    />
                  ))}
                </motion.div>
              )}
            </motion.div>

            {/* <motion.button
              className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              onClick={() => setIsDismissed(true)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button> */}
          </div>

          <motion.div
            className="absolute inset-0 rounded-sm"
            style={{
              background: `linear-gradient(90deg, transparent, ${isOnline ? "rgba(16, 185, 129, 0.3)" : "rgba(239, 68, 68, 0.3)"}, transparent)`,
              filter: "blur(1px)",
            }}
            animate={{
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 2.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
