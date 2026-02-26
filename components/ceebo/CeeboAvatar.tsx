"use client"

import React from "react"
import Image from "next/image"

const SIZE_CLASSES: Record<number, string> = {
  16: "h-4 w-4",
  20: "h-5 w-5",
  24: "h-6 w-6",
  28: "h-7 w-7",
  32: "h-8 w-8",
  36: "h-9 w-9",
  40: "h-10 w-10",
  48: "h-12 w-12",
}

export interface CeeboAvatarProps {
  size?: number
}

export function CeeboAvatar({ size = 32 }: CeeboAvatarProps) {
  const sizeClass = SIZE_CLASSES[size] ?? SIZE_CLASSES[32]
  return (
    <div
      className={`${sizeClass} flex items-center justify-center overflow-hidden rounded-full bg-[#0D1B3D]`}
    >
      <Image
        src="/images/Ceebo.png"
        alt="Ceebo"
        width={size}
        height={size}
        className="object-contain"
      />
    </div>
  )
}
