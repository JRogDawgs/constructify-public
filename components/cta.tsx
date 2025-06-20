"use client"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Zap, Shield, TrendingUp, Users } from "lucide-react"
import { useState } from "react"
import DemoModal from "./demo-modal"

export default function CTA() {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false)

  const stats = [
    { icon: Users, value: "500+", label: "Companies Trust Us" },
    { icon: TrendingUp, value: "40%", label: "Productivity Increase" },
    { icon: Shield, value: "99.9%", label: "Uptime Guarantee" },
    { icon: Zap, value: "24/7", label: "Expert Support" }
  ]

  return (
    <>
      <section className="relative w-full py-24 md:py-32 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-800/20 via-blue-900/20 to-slate-800/20 animate-pulse"></div>
          {/* Floating particles */}
          <div className="absolute top-20 left-20 w-4 h-4 bg-blue-800/30 rounded-full animate-bounce delay-1000"></div>
          <div className="absolute top-40 right-32 w-6 h-6 bg-blue-900/30 rounded-full animate-bounce delay-2000"></div>
          <div className="absolute bottom-32 left-1/4 w-3 h-3 bg-slate-700/30 rounded-full animate-bounce delay-3000"></div>
          <div className="absolute bottom-20 right-20 w-5 h-5 bg-blue-800/30 rounded-full animate-bounce delay-500"></div>
        </div>

        <div className="container relative z-10 mx-auto px-6">
          {/* Main CTA Container */}
          <motion.div 
            className="mx-auto max-w-5xl"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Glass Morphism Container */}
            <div className="relative overflow-hidden rounded-3xl border-2 border-white/20 backdrop-blur-2xl p-12 md:p-16" style={{
              background: `linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)`,
              boxShadow: '0 25px 80px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.4)'
            }}>
              {/* Animated shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 translate-x-full animate-pulse"></div>
              
              <div className="text-center space-y-8">
                {/* Explosive Headline */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <h2 className="text-5xl md:text-7xl font-black text-white mb-4 leading-tight" style={{
                    textShadow: '0 0 20px rgba(59, 130, 246, 0.5), 0 0 40px rgba(147, 51, 234, 0.3)',
                    background: 'linear-gradient(135deg, #ffffff 0%, #60a5fa 50%, #a855f7 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
                    TRANSFORM YOUR
                    <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-500">
                      CONSTRUCTION EMPIRE
                    </span>
                  </h2>
                  <div className="w-32 h-1 bg-gradient-to-r from-blue-800 to-slate-700 mx-auto rounded-full"></div>
                </motion.div>

                {/* Power Description */}
                <motion.p 
                  className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed font-medium"
                  style={{
                    textShadow: '0 2px 8px rgba(0,0,0,0.5)'
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  Join the construction revolution! 🚀 Experience 40% faster project completion, 
                  bulletproof safety compliance, and AI-powered insights that turn your data into profit.
                </motion.p>

                {/* Stats Grid */}
                <motion.div 
                  className="grid grid-cols-2 md:grid-cols-4 gap-6 my-12"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  {stats.map((stat, index) => (
                    <motion.div 
                      key={stat.label}
                      className="text-center p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105"
                      whileHover={{ y: -5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <stat.icon className="h-8 w-8 text-blue-300 mx-auto mb-2" />
                      <div className="text-2xl md:text-3xl font-black text-white">{stat.value}</div>
                      <div className="text-sm text-white/80 font-medium">{stat.label}</div>
                    </motion.div>
                  ))}
                </motion.div>

                {/* CTA Buttons */}
                <motion.div 
                  className="flex flex-col sm:flex-row gap-6 justify-center items-center"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  {/* Primary CTA - Start Free Trial */}
                  <Link href="/signup" aria-label="Start your free trial">
                    <Button 
                      size="lg"
                      className="group relative font-black border-2 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 rounded-2xl px-12 py-6 text-xl h-auto uppercase tracking-wide overflow-hidden"
                      style={{
                        background: `linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)`,
                        borderColor: 'rgba(255,255,255,0.3)',
                        color: '#fefefe',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                        boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.2), 0 8px 25px rgba(0,0,0,0.4)'
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-700"></div>
                      <span className="relative z-10 flex items-center gap-3">
                        🚀 START FREE TRIAL
                        <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </Button>
                  </Link>

                  {/* Secondary CTA - Watch Demo */}
                  <Button 
                    size="lg"
                    onClick={() => setIsDemoModalOpen(true)}
                    className="group relative font-black border-2 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 rounded-2xl px-12 py-6 text-xl h-auto uppercase tracking-wide overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, hsl(var(--constructify-tan-light)) 0%, hsl(var(--constructify-tan)) 100%)`,
                      borderColor: `hsl(var(--constructify-tan))`,
                      color: '#fefefe',
                      textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                      boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.2), 0 8px 25px rgba(0,0,0,0.4)',
                      animation: 'subtle-glow 2s ease-in-out infinite'
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-700"></div>
                    <span className="relative z-10 flex items-center gap-3">
                      🎬 WATCH DEMO
                    </span>
                  </Button>
                </motion.div>

                {/* Trust Indicators */}
                <motion.div 
                  className="mt-8 text-center"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 1.0 }}
                >
                  <p className="text-white/70 text-sm mb-4">Trusted by industry leaders</p>
                  <div className="flex justify-center items-center gap-8 opacity-60">
                    <div className="text-white/50 font-bold">ACME CONSTRUCTION</div>
                    <div className="text-white/50 font-bold">BUILDER PRO</div>
                    <div className="text-white/50 font-bold">MEGA PROJECTS</div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <DemoModal 
        isOpen={isDemoModalOpen} 
        onClose={() => setIsDemoModalOpen(false)} 
      />
    </>
  )
}

