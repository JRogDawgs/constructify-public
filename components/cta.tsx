"use client"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"

export default function CTA() {
  return (
    <section className="border-t bg-gradient-to-b from-background to-background/95">
      <div className="container flex flex-col items-center gap-4 py-24 text-center md:py-32">
        <motion.h2 
          className="font-medium text-3xl leading-[1.1] sm:text-3xl md:text-5xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Ready to revolutionize your business?
        </motion.h2>
        <motion.p 
          className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Join leading companies who trust Constructify to drive their digital transformation and stay ahead in the
          rapidly evolving construction landscape.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Link href="/signup" aria-label="Get started with Constructify">
            <Button 
              size="lg" 
              className="mt-4 bg-constructify-gold-gradient hover:bg-constructify-gold-dark text-black font-semibold border-0 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              Get Started Today
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

