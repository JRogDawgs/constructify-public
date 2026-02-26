"use client"

import React, { useCallback, useEffect } from "react"
import { CeeboHeader } from "./CeeboHeader"
import { CeeboChat } from "./CeeboChat"

export interface CeeboModalProps {
  open: boolean
  onClose: () => void
}

export function CeeboModal({ open, onClose }: CeeboModalProps) {
  const handleClose = useCallback(() => {
    onClose()
  }, [onClose])

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [open, handleClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden
      />
      <div
        className="ceebo-modal-border relative flex max-h-[75vh] w-full max-w-lg flex-col rounded-xl p-[2px] shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex min-h-[300px] flex-1 flex-col overflow-hidden rounded-[18px] bg-[#0D1B3D]">
          <CeeboHeader onClose={handleClose} />
          <div className="flex min-h-0 flex-1 flex-col">
            <CeeboChat />
          </div>
        </div>
      </div>
    </div>
  )
}
