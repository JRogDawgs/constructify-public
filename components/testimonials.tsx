"use client"

import { motion } from "framer-motion"
import { Star, Quote } from "lucide-react"
import { memo } from "react"

const testimonials = [
  {
    quote: "Constructify transformed our entire operation! We've seen a 45% increase in project efficiency and our safety compliance is now bulletproof. The AI-powered insights saved us over $2M in the first year alone.",
    author: "Marcus Rodriguez",
    role: "Project Director",
    company: "Apex Construction Group",
    rating: 5,
    projectSize: "$50M+ Commercial Projects",
    avatar: "MR"
  },
  {
    quote: "This platform is a game-changer for the construction industry. Real-time collaboration, automated reporting, and seamless project tracking - everything we needed in one place. Our clients are blown away by our efficiency.",
    author: "Sarah Chen",
    role: "Operations Manager", 
    company: "BuildTech Solutions",
    rating: 5,
    projectSize: "$25M+ Residential Developments",
    avatar: "SC"
  },
  {
    quote: "After 30 years in construction, I've never seen anything like Constructify. The predictive analytics helped us avoid 3 major delays this quarter. ROI was immediate - we recovered our investment in just 2 months!",
    author: "David Thompson",
    role: "CEO & Founder",
    company: "Thompson Heavy Industries",
    rating: 5,
    projectSize: "$100M+ Infrastructure Projects",
    avatar: "DT"
  }
]

const TestimonialCard = memo(({ testimonial, index }: { testimonial: typeof testimonials[0], index: number }) => {
  const gradients = [
    'from-blue-500/20 via-cyan-600/10 to-blue-500/20',
    'from-emerald-500/20 via-teal-600/10 to-green-500/20', 
    'from-purple-500/20 via-violet-600/10 to-indigo-500/20'
  ]
  
  const avatarColors = [
    'from-blue-400 to-cyan-500',
    'from-emerald-400 to-teal-500',
    'from-purple-400 to-violet-500'
  ]
  
  return (
    <motion.div 
      className="group relative overflow-hidden rounded-3xl border border-white/20 backdrop-blur-xl p-8 transition-all duration-500 hover:scale-105 hover:shadow-2xl"
      style={{
        background: `linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)`,
        boxShadow: '0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.2)',
        animation: `fadeInUp 0.6s ease-out ${index * 0.2}s both`
      }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.05) translateY(-8px)'
        e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.3)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1) translateY(0)'
        e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.2)'
      }}
    >
      {/* Animated gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradients[index]} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      
      {/* Quote icon */}
      <div className="relative mb-6">
        <Quote className="h-8 w-8 text-white/60 group-hover:text-white/80 transition-colors duration-300" />
      </div>
      
      {/* Quote text */}
      <div className="relative mb-8">
        <p className="text-lg leading-relaxed text-white/90 group-hover:text-white transition-colors duration-300" style={{
          textShadow: '0 2px 8px rgba(0,0,0,0.3)'
        }}>
          "{testimonial.quote}"
        </p>
      </div>
      
      {/* Rating stars */}
      <div className="relative mb-6 flex gap-1">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400 group-hover:scale-110 transition-transform duration-300" style={{
            transitionDelay: `${i * 50}ms`
          }} />
        ))}
      </div>
      
      {/* Author info */}
      <div className="relative flex items-center gap-4">
        {/* Avatar */}
        <div className={`flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br ${avatarColors[index]} font-bold text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          {testimonial.avatar}
        </div>
        
        {/* Author details */}
        <div className="flex-1">
          <div className="font-bold text-white group-hover:text-white transition-colors duration-300" style={{
            textShadow: '0 2px 8px rgba(0,0,0,0.3)'
          }}>
            {testimonial.author}
          </div>
          <div className="text-sm text-white/70 group-hover:text-white/90 transition-colors duration-300">
            {testimonial.role}
          </div>
          <div className="text-sm font-medium text-white/80 group-hover:text-white transition-colors duration-300">
            {testimonial.company}
          </div>
          <div className="text-xs text-white/60 group-hover:text-white/80 transition-colors duration-300 mt-1">
            {testimonial.projectSize}
          </div>
        </div>
      </div>
      
      {/* Shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000" />
    </motion.div>
  )
})

TestimonialCard.displayName = "TestimonialCard"

export default function Testimonials() {
  return (
    <section className="relative w-full py-24 md:py-32 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-600/20 via-slate-700/20 to-slate-600/20 animate-pulse"></div>
        {/* Floating particles */}
        <div className="absolute top-32 left-16 w-3 h-3 bg-white/20 rounded-full animate-bounce delay-1000"></div>
        <div className="absolute top-20 right-24 w-4 h-4 bg-white/10 rounded-full animate-bounce delay-2000"></div>
        <div className="absolute bottom-40 left-1/3 w-2 h-2 bg-white/30 rounded-full animate-bounce delay-3000"></div>
        <div className="absolute bottom-24 right-16 w-5 h-5 bg-white/15 rounded-full animate-bounce delay-500"></div>
      </div>

      <div className="container relative z-10 mx-auto px-6">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2 
            className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight"
            style={{
              textShadow: '0 0 20px rgba(255, 255, 255, 0.3), 0 0 40px rgba(255, 255, 255, 0.1)',
              background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 50%, #cbd5e1 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            CONSTRUCTION LEADERS
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500">
              LOVE CONSTRUCTIFY
            </span>
          </motion.h2>
          <motion.p 
            className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed"
            style={{
              textShadow: '0 2px 8px rgba(0,0,0,0.5)'
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Join thousands of construction professionals who've transformed their businesses with our platform. 
            See why industry leaders choose Constructify for their most critical projects.
          </motion.p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-cyan-500 mx-auto mt-6 rounded-full"></div>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={testimonial.author} testimonial={testimonial} index={index} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <p className="text-white/70 text-lg mb-6">Ready to join these industry leaders?</p>
          <div className="flex justify-center items-center gap-8 text-white/50 text-sm">
            <div>⭐ 4.9/5 Average Rating</div>
            <div>🏆 500+ Companies</div>
            <div>💰 $50M+ Projects Managed</div>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 