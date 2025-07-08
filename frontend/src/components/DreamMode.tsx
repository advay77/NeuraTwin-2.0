"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useDreamSound } from "@/lib/useDreamSound";

const dreamTexts = [
  "In the depths of your subconscious...",
  "Dreams are the whispers of your soul",
  "Tonight, the universe speaks through stardust",
  "Your thoughts become constellations",
  "Every star holds a fragment of your destiny",
  "The cosmos awakens your inner vision",
  "Beyond reality lies infinite possibility",
]

export default function Component() {
 
  const router = useRouter()
  const [isActive, setIsActive] = useState(false)
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [showText, setShowText] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)
    const { playDreamSound, stopDreamSound } = useDreamSound();


 useEffect(() => {
  playDreamSound(); 
  return () => {
    stopDreamSound();
  };
}, [playDreamSound, stopDreamSound]); 

  useEffect(() => {
    if (isActive) {
      startStarAnimation()
      startTextSequence()
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isActive])

  const startStarAnimation = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const stars: Array<{
      x: number
      y: number
      size: number
      opacity: number
      twinkleSpeed: number
      color: string
    }> = []

    // Create stars
    for (let i = 0; i < 300; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 0.5,
        opacity: Math.random(),
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        color: `hsl(${200 + Math.random() * 60}, 70%, ${70 + Math.random() * 30}%)`,
      })
    }

    const animate = () => {
      // Clear canvas with gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, "#0a0a1a")
      gradient.addColorStop(0.5, "#1a0a2e")
      gradient.addColorStop(1, "#16213e")

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw and animate stars
      stars.forEach((star) => {
        star.opacity += Math.sin(Date.now() * star.twinkleSpeed) * 0.01
        star.opacity = Math.max(0.1, Math.min(1, star.opacity))

        ctx.save()
        ctx.globalAlpha = star.opacity
        ctx.fillStyle = star.color
        ctx.shadowBlur = star.size * 2
        ctx.shadowColor = star.color

        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx.fill()

        // Add cross sparkle effect for larger stars
        if (star.size > 2) {
          ctx.strokeStyle = star.color
          ctx.lineWidth = 0.5
          ctx.beginPath()
          ctx.moveTo(star.x - star.size * 2, star.y)
          ctx.lineTo(star.x + star.size * 2, star.y)
          ctx.moveTo(star.x, star.y - star.size * 2)
          ctx.lineTo(star.x, star.y + star.size * 2)
          ctx.stroke()
        }

        ctx.restore()
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()
  }

  const startTextSequence = () => {
    setShowText(true)
    setCurrentTextIndex(0)

    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => {
        if (prev < dreamTexts.length - 1) {
          return prev + 1
        } else {
          clearInterval(interval)
          return prev
        }
      })
    }, 4000)
  }



  const enterDreamMode = () => {
    setIsActive(true)
  }

  const exitDreamMode = () => {
    setIsActive(false)
    setShowText(false)
    setCurrentTextIndex(0)
    router.push("/home") 
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-gray-900 via-gray-800 to-indigo-500 w-full">
      <AnimatePresence>
        {isActive && (
          <motion.canvas
            ref={canvasRef}
            className="absolute inset-0 z-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
          />
        )}
      </AnimatePresence>

      {!isActive ? (
        <motion.div
          className="relative z-10 min-h-screen flex items-center justify-center"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 1 }}
        >
          <div className="text-center space-y-8">
            <motion.h1
              className="text-5xl md:text-6xl font-medium bg-gradient-to-b from-white via-gray-200 to-indigo-800/10 text-transparent bg-clip-text tracking-wider font-sora"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5 }}
            >
              DREAM
            </motion.h1>

            <motion.p
              className="text-xl text-gray-300 font-light tracking-wide font-inter"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, delay: 0.5 }}
            >
              Enter the realm of infinite possibilities
            </motion.p>

              <motion.p
              className="text-xl text-gray-300 font-light tracking-wide font-inter px-4 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, delay: 1 }}
            >
              NeuraTwin will simulate your future and tell you about your potential.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 1.5 }}
            >
              <Button
                onClick={enterDreamMode}
         
                className="bg-transparent border-2 border-gray-400 text-white hover:bg-indigo-500 hover:text-white px-12 py-4 text-lg font-light tracking-widest transition-all duration-500 hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] mt-8"
              >
                BEGIN JOURNEY
              </Button>
            </motion.div>

            

             <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 1.5 }}
              className="underline underline-offset-4 decoration-wavy text-white/70 font-inter mt-5"
              onClick={exitDreamMode}
            >

             Back Home
            </motion.div>
          </div>
        </motion.div>
      ) : (
        <div className="relative z-10 h-screen flex items-center justify-center">
          <AnimatePresence mode="wait">
            {showText && (
              <motion.div
                key={currentTextIndex}
                className="text-center max-w-4xl px-8"
                initial={{ opacity: 0, y: 50, scale: 0.8 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  textShadow: [
                    "0 0 0px rgba(34,211,238,0)",
                    "0 0 20px rgba(34,211,238,0.8)",
                    "0 0 0px rgba(34,211,238,0)",
                  ],
                }}
                exit={{
                  opacity: 0,
                  y: -30,
                  scale: 1.1,
                  filter: "blur(10px)",
                }}
                transition={{
                  duration: 1.5,
                  textShadow: {
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  },
                }}
              >
                <motion.h2
                  className="text-4xl md:text-5xl font-medium text-white leading-relaxed tracking-wide font-sora"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{
                    backgroundPosition: {
                      duration: 8,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    },
                  }}
                  style={{
                    backgroundSize: "200% 200%",
                  }}
                >
                  {dreamTexts[currentTextIndex]}
                </motion.h2>

                {/* Floating particles around text */}
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-cyan-400 rounded-full"
                    style={{
                      left: `${20 + Math.random() * 60}%`,
                      top: `${30 + Math.random() * 40}%`,
                    }}
                    animate={{
                      y: [-20, 20, -20],
                      x: [-10, 10, -10],
                      opacity: [0.3, 1, 0.3],
                      scale: [0.5, 1.5, 0.5],
                    }}
                    transition={{
                      duration: 4 + Math.random() * 2,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                      delay: Math.random() * 2,
                    }}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Progress indicator */}
          <motion.div
            className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
          >
            {dreamTexts.map((_, index) => (
              <motion.div
                key={index}
                className={`w-2 h-2 rounded-full ${index <= currentTextIndex ? "bg-indigo-400" : "bg-gray-600"}`}
                animate={{
                  scale: index === currentTextIndex ? [1, 1.5, 1] : 1,
                  opacity: index <= currentTextIndex ? 1 : 0.3,
                }}
                transition={{
                  scale: {
                    duration: 1,
                    repeat: index === currentTextIndex ? Number.POSITIVE_INFINITY : 0,
                    ease: "easeInOut",
                  },
                }}
              />
            ))}
          </motion.div>

          {/* Exit button */}
          <motion.button
            onClick={exitDreamMode}
            className="absolute top-8 right-8 text-gray-200 hover:text-white transition-colors font-inter duration-300 text-sm tracking-widest"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            whileHover={{ scale: 1.1 }}
          >
            EXIT DREAM
          </motion.button>
        </div>
      )}
    </div>
  )
}
