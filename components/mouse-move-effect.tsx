"use client"

import { useEffect, useRef, useState } from "react"

export default function MouseMoveEffect() {
  const ref = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    const handleMouseMove = (event: MouseEvent) => {
      const el = ref.current
      if (!el) return
      el.style.setProperty("--mouse-x", `${event.clientX}px`)
      el.style.setProperty("--mouse-y", `${event.clientY}px`)
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div
      ref={ref}
      className="mouse-move-effect pointer-events-none fixed inset-0 z-30 transition-opacity duration-300"
    />
  )
}

