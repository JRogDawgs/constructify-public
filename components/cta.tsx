"use client"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

export default function CTA() {
  return (
    <>
      <section className="relative w-full py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-constructify-blue"></div>

        <div className="container relative z-10 mx-auto px-6">
          {/* Main CTA Container */}
          <motion.div 
            className="mx-auto max-w-5xl"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative overflow-hidden rounded-3xl p-12 md:p-16">
              
              <div className="text-center space-y-8">
                {/* Explosive Headline */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <h2 className="text-5xl md:text-7xl font-black text-white mb-4 leading-tight">
                    CONTROL YOUR
                    <br />
                    OPERATIONS
                  </h2>
                  <div className="w-32 h-1 bg-white/30 mx-auto rounded-full"></div>
                </motion.div>

                <motion.p 
                  className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  Workforce control, accurate scheduling, and compliance tracking. 
                  Put your data to work instead of chasing spreadsheets.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div 
                  className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-10"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  <Link href="https://app.constructifylabs.com/login" target="_self" rel="noopener" aria-label="Get started">
                    <Button 
                      size="lg"
                      className="group relative font-black border-2 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 rounded-2xl px-12 py-6 text-xl h-auto uppercase tracking-wide overflow-hidden cta-primary-button"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-700"></div>
                      <span className="relative z-10 flex items-center gap-3">
                        Get Started
                        <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}

