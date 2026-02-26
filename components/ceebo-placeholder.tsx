"use client"

import Image from "next/image"

export default function CeeboPlaceholder() {
  return (
    <button
      type="button"
      className="fixed bottom-6 right-6 z-50 transition-transform duration-200 hover:scale-105"
      aria-label="Ceebo AI Assistant"
    >
      <Image
        src="/images/Ceebo.png"
        alt="Ceebo AI Assistant"
        width={72}
        height={72}
        priority
      />
    </button>
  )
}
