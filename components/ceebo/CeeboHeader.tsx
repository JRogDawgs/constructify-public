"use client"

import React from "react"
import Image from "next/image"

export interface CeeboHeaderProps {
  onClose: () => void
}

export const CeeboHeader = React.memo(function CeeboHeader({
  onClose,
}: CeeboHeaderProps) {
  return (
    <>
      <div className="flex flex-row items-center justify-between px-6 py-4">
        <div className="flex flex-1 flex-row items-center">
          <Image
            src="/images/Ceebo.png"
            alt="Ceebo"
            width={36}
            height={36}
            className="object-contain"
          />
          <div className="ml-4">
            <p className="text-base font-bold text-white">Ceebo</p>
            <div className="mt-0.5 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span className="text-xs font-bold text-emerald-500">Online</span>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border-2 border-slate-300/80 bg-[#0D1B3D] px-6 py-2 text-base font-bold text-white transition-opacity hover:opacity-85"
          aria-label="Close"
        >
          ✕
        </button>
      </div>
      <div className="h-px bg-white/10" />
    </>
  )
})
