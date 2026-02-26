"use client"

import { useState } from "react"
import Image from "next/image"
import { CeeboModal } from "@/components/ceebo"

export default function CeeboPlaceholder() {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <button
        type="button"
        className="fixed bottom-6 right-6 z-50 transition-transform duration-200 hover:scale-105"
        aria-label="Ceebo AI Assistant"
        onClick={() => setShowModal(true)}
      >
        <Image
          src="/images/Ceebo.png"
          alt="Ceebo AI Assistant"
          width={72}
          height={72}
          priority
        />
      </button>
      <CeeboModal open={showModal} onClose={() => setShowModal(false)} />
    </>
  )
}
