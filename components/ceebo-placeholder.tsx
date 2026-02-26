"use client"

import { Button } from "@/components/ui/button"

export default function CeeboPlaceholder() {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="relative">
        <Button
          className="relative h-16 rounded-full px-6 bg-gradient-to-br from-[hsl(225,70%,12%)] via-[hsl(220,80%,8%)] to-[hsl(225,70%,12%)] hover:from-[hsl(220,80%,8%)] hover:via-[hsl(225,70%,12%)] hover:to-[hsl(220,80%,8%)] shadow-2xl hover:shadow-[hsl(225,70%,12%)]/50 transition-all duration-500 hover:scale-105 border-2 border-[hsl(48,8%,85%)]/30 hover:border-[hsl(48,8%,85%)]/60"
          aria-label="Ceebo"
        >
          <span className="text-white font-bold">Ceebo</span>
        </Button>
      </div>
    </div>
  )
}
