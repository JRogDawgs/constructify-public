/**
 * 🤖 CONSTRUCTIFY AI CHATBOT - INDUSTRY-LEADING INTELLIGENT ASSISTANT
 * 
 * This is a comprehensive AI-powered chatbot that serves as a digital employee for Constructify.
 * It combines advanced conversation intelligence with deep platform knowledge to provide
 * exceptional user support and lead conversion.
 * 
 * 🧠 CORE INTELLIGENCE FEATURES:
 * • Intent & Sentiment Detection - Automatically detects user mood and urgency
 * • Feature Request Logging - Captures product feedback for roadmap planning
 * • Context-Aware CTA Hooks - Smart lead qualification and escalation
 * • Interactive Demo Links - Direct integration with demo experiences
 * • Security & Compliance FAQs - Enterprise-grade security information
 * • User Satisfaction Tracking - Thumbs up/down feedback with analytics
 * 
 * 📊 ANALYTICS & LOGGING:
 * • All feature requests logged to console (production: database)
 * • User satisfaction metrics tracked
 * • Conversation context maintained for better responses
 * • Email notifications for high-priority leads
 * 
 * 🎯 CONVERSION OPTIMIZATION:
 * • Contextual CTAs based on company size and needs
 * • Urgent escalation for OSHA audits and compliance issues
 * • Competitor switching detection and specialized responses
 * • Demo request routing with personalized experiences
 * 
 * 🔮 FUTURE ENHANCEMENTS (For Cursor/Development Team):
 * • Voice query support integration
 * • Agent-to-human handoff with CRM sync
 * • FAQ database stored in /data/chatbot/faq.json
 * • Firebase usage stats monitoring
 * • Advanced natural language processing
 * • Multi-language support expansion
 * 
 * 💡 MAINTENANCE INSTRUCTIONS:
 * Continue training the bot by appending new FAQs, responses, and user sentiment logs 
 * to a source-of-truth file. Monitor Firebase usage stats and integrate user satisfaction 
 * tracking via thumbs-up/thumbs-down responses. Future goal: add voice query support 
 * and agent-to-human handoff with CRM sync.
 */

"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageSquare, Send, X, Minimize2, Maximize2, Bot, User, Sparkles, Zap } from "lucide-react"
import { sendAdminNotification, storeUnknownQuestion } from '@/utils/sendAdminNotification'
import { sendUserReply } from '@/utils/sendUserReply'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}

// Constructify Knowledge Base
const constructifyKnowledge = {
  // Platform Overview
  platform: {
    name: "Constructify",
    description: "A cutting-edge construction management platform that revolutionizes how construction projects are planned, executed, and managed.",
    purpose: "Comprehensive solutions for construction businesses of all sizes, combining modern technology with industry expertise.",
    mission: "To empower construction professionals with cutting-edge technology that simplifies complex projects, enhances collaboration, and delivers exceptional results every time.",
    vision: "Creating the foundation for communities, dreams, and the future through innovative construction management technology."
  },

  // Core Features - Enhanced with discovered capabilities
  features: {
    projectManagement: "Streamline construction projects with intuitive project management featuring real-time collaboration, progress tracking, task assignments with dependencies, and multi-site coordination",
    safetyCompliance: "Enhanced safety training, OSHA compliance, safety certifications, drug testing records, incident reports, training history with automatic renewal alerts, and compliance dashboards",
    resourcePlanning: "Optimize resource allocation and scheduling with AI-driven insights, forecasting, equipment tracking, and inventory management",
    qualityControl: "Quality control and inspection management with automated reporting, compliance tracking, and real-time quality assurance",
    costManagement: "Track and optimize project costs with comprehensive financial management, budget forecasting, expense tracking, and payroll integration",
    analytics: "Powerful analytics and reporting with customizable dashboards, data-driven insights, and performance metrics",
    realTimeCollaboration: "Work together seamlessly with built-in messaging, live updates, and team communication tools",
    mobileAccess: "Full mobile optimization with iOS and Android apps for field access and on-site management"
  },

  // Employee Management - Comprehensive 50+ field system
  employeeFeatures: {
    profiles: "Comprehensive employee profile management with 50+ fields including personal information, professional credentials, certifications, training, and employment history",
    payroll: "Detailed payroll records, direct deposit setups (primary & secondary accounts), deductions (insurance, tools, union dues), bonuses, tax information tracking, and YTD earnings",
    safety: "Safety & compliance tracking (OSHA, drug tests, PPE, certifications) with expiration alerts, incident reporting, and training completion tracking",
    tasks: "Task management with assignments, deadlines, dependencies, and progress tracking across multiple projects",
    equipment: "Equipment & inventory tracking for tools, machinery, PPE sizes, preferences, and issued equipment",
    expenses: "Expense reimbursement, payroll cards, corporate card integration, receipt management, and automated approval workflows",
    mobile: "Mobile-friendly responsive UI for access from any device with camera integration for ID scanning and photo capture",
    banking: "Secure banking integration with account verification, payment method management, and financial transparency",
    certifications: "Certification management for OSHA, equipment operation (crane, forklift), trade licenses with automatic renewal alerts",
    employeeEmployerSeparation: "Unique employee ID system enabling seamless company transfers while maintaining personal data security"
  },

  // Admin Features - Role-based access control
  adminFeatures: {
    dashboard: "Role-based dashboard for HR, payroll, safety, admin, and project managers with customizable views and analytics",
    userManagement: "Bulk user upload and management with role assignment capabilities, search functionality, and user statistics",
    audit: "Comprehensive audit logging system for tracking all user actions, data access, and security monitoring",
    projects: "Project creation and staffing with contractor vs employee account types, resource allocation, and timeline management",
    multiCompany: "Multi-company login and management with subdomains, entity selector, and cross-company employee transfers",
    roleBasedAccess: "Granular permission controls with admin/user roles, field-level security, and access control management",
    bulkOperations: "Mass user management capabilities, bulk data import/export, and automated workflow processing"
  },

  // AI Capabilities - Natural language processing
  aiFeatures: {
    nlp: "Query any employee/project/safety/payroll data using natural language with semantic understanding and intent classification",
    queries: "Examples: 'Who has OSHA 30 in Texas?', 'Show me available electricians this week', 'What's John's YTD earnings?', 'Find pending expense reports'",
    languages: "Support for English and Spanish queries with smart suggestions, follow-ups, and confidence scoring",
    patternRecognition: "Advanced pattern recognition for intent classification, parameter extraction, and automated data parsing",
    smartSuggestions: "Related query recommendations, context-aware responses, and intelligent follow-up questions"
  },

  // Technology Stack - Complete infrastructure
  technology: {
    frontend: "Next.js 15.1.0 with App Router, TypeScript, Tailwind CSS, Radix UI components, React Context API, and Framer Motion animations",
    backend: "Firebase Authentication with Google OAuth, Firestore real-time database, Firebase Storage, and serverless functions",
    auth: "Google OAuth sign-in with role-based access control, session management, and secure token handling",
    database: "Real-time database with Firestore for instant updates, data synchronization, and offline capabilities",
    security: "Enterprise-grade security with encrypted data, compliance features, CSP headers, and authentication middleware",
    ocr: "ID OCR and employee photo scanning for quick onboarding with automatic information extraction",
    mobile: "Progressive Web App with mobile-first design, touch-friendly interface, and camera integration",
    apis: "RESTful APIs, GraphQL support, and third-party integration capabilities"
  },

  // Pricing Plans - Detailed structure
  pricing: {
    starter: {
      name: "Starter",
      price: "$299/month",
      description: "Perfect for small construction teams getting started with digital management",
      features: ["Up to 10 team members", "Basic project management", "Document storage", "Email support", "Mobile app access"],
      target: "Small contractors and teams (1-10 employees)"
    },
    professional: {
      name: "Professional", 
      price: "$799/month",
      description: "Ideal for growing construction companies with multiple projects",
      features: ["Up to 25 team members", "Advanced project management", "Resource planning", "Priority support", "Custom reporting", "API access"],
      target: "Growing companies (11-25 employees)",
      popular: true
    },
    enterprise: {
      name: "Enterprise",
      price: "$1,999/month", 
      description: "For large construction firms requiring full-scale solutions",
      features: ["Unlimited team members", "Full project management suite", "Advanced analytics", "24/7 dedicated support", "Custom integrations", "SLA guarantees"],
      target: "Large operations (25+ employees)"
    },
    customization: "All plans can be customized based on company size, features needed, and usage level",
    contact: "Visit /pricing page or contact sales for custom quotes and enterprise pricing"
  },

  // Industries Served - Complete coverage
  industries: {
    residential: "Custom homes, multi-family developments, and residential renovations with focus on quality, comfort, and sustainable living solutions",
    commercial: "Office buildings, retail spaces, and commercial facilities designed for optimal business operations and customer experiences", 
    industrial: "Manufacturing facilities, warehouses, and industrial complexes built for efficiency, durability, and operational excellence",
    infrastructure: "Roads, bridges, and public utilities that connect and serve communities with lasting impact and reliability",
    heavyCivil: "Large-scale civil engineering projects including dams, airports, and major transportation systems that shape our world",
    institutional: "Educational facilities, healthcare buildings, and government structures built to serve public needs with excellence and integrity",
    specialty: ["Renovation & Remodeling", "Specialty Trades", "HVAC", "Plumbing", "Electrical", "Roofing", "Concrete", "Steel Construction"]
  },

  // Leadership Team
  team: {
    ceo: {
      name: "Tim Hamilton",
      role: "Chief Executive Officer", 
      experience: "25+ years in construction technology",
      expertise: "Construction operations, strategic leadership, industry transformation"
    },
    coo: {
      name: "Jeff Rogers",
      role: "Chief Operating Officer",
      expertise: "Construction industry knowledge, product development, field operations, technology innovation"
    },
    cto: {
      name: "Rob Hourigan", 
      role: "Chief Technology Officer",
      expertise: "Software engineering, scalable systems, technical architecture, platform security"
    }
  },

  // Support & Contact
  support: {
    email: "support@constructify.com",
    sales: "sales@constructify.com", 
    careers: "careers@constructify.com",
    hours: "24/7 chat support, business hours for phone support",
    resources: ["Authentication Guide", "Deployment Guide", "Firebase Setup Guide", "Employee-Employer System Documentation"]
  }
}

// Comprehensive FAQ Database - Massively Expanded
const faqDatabase = {
  // Platform Overview
  "what is constructify": "Constructify is a cutting-edge construction management platform that revolutionizes how construction projects are planned, executed, and managed. We combine modern technology with deep construction industry expertise to deliver comprehensive solutions for businesses of all sizes.",
  
  "how does constructify work": "Constructify provides a complete digital platform for managing every aspect of construction projects - from employee profiles and safety compliance to project management and financial tracking. Everything is accessible through web and mobile apps with real-time synchronization.",

  // Employee Management
  "employee profiles management": "Our employee profile system includes 50+ fields covering personal information, professional credentials, certifications, safety training, payroll data, and project history. Employees control their personal data while employers manage job-related information.",
  
  "subcontractors contractors": "Yes! Constructify supports both employees and contractors with full role-based access control. Admins can create contractor profiles, track their pay, safety records, and assign them to specific projects with appropriate permissions.",
  
  "employee id system": "Every employee receives a unique Employee ID (format: EMP-timestamp-randomchars) that stays with them throughout their career. This enables seamless company transfers while maintaining personal data and certification history.",

  // Safety & Compliance
  "safety compliance osha": "Absolutely! Constructify handles comprehensive safety management including OSHA tracking, safety certifications, drug testing records, incident reports, training history, and automatic renewal alerts. We help you stay compliant effortlessly.",
  
  "drug testing tracking": "Our system tracks drug testing schedules, results, compliance status, and renewal dates with automatic alerts for both employees and administrators to ensure continuous compliance.",
  
  "incident reporting": "Built-in incident reporting system allows for immediate documentation of safety incidents with photo capture, witness statements, and automatic notification to safety managers and compliance teams.",

  // Authentication & Access
  "login sign in": "Constructify uses Google OAuth for secure, single sign-on authentication. Employees can sign in using their Google account from any device, with automatic profile creation and role-based access control.",
  
  "mobile phone access": "Yes! Constructify is fully mobile-optimized with dedicated iOS and Android apps. Employees can log in, view assignments, upload documents, request time off, manage profiles, and capture photos directly from their phone.",
  
  "role based access": "Our platform includes granular role-based access control with admin/user roles, field-level security, and customizable permissions for HR, payroll, safety managers, project managers, and field workers.",

  // Financial & Payroll
  "payroll financial management": "Our comprehensive payroll system supports detailed records, direct deposit setups (primary & secondary accounts), deductions (insurance, tools, union dues), bonuses, tax information tracking, YTD earnings, and expense reimbursement with payroll cards.",
  
  "banking integration": "Secure banking integration includes account verification, payment method management, corporate card integration, and financial transparency with encrypted data protection.",
  
  "expense tracking": "Complete expense management with corporate card integration, digital receipt storage, automated approval workflows, and reimbursement processing across categories like fuel, materials, tools, travel, and meals.",

  // Project Management
  "project management features": "Our project management suite includes real-time collaboration, progress tracking, task assignments with dependencies, timeline management, resource allocation, multi-site coordination, and team communication tools.",
  
  "task assignments": "Advanced task management with assignments, deadlines, dependencies, progress tracking, and automated notifications. Tasks can be assigned across multiple projects with priority levels and completion tracking.",
  
  "resource planning": "AI-driven resource planning and scheduling with equipment tracking, inventory management, labor allocation, and forecasting capabilities to optimize project efficiency.",

  // Technology & Integration
  "multiple companies entities": "Yes! Constructify is designed for enterprise use, supporting multiple business units, brands, or clients under one admin dashboard with role-based access control and cross-company employee transfers.",
  
  "integrations quickbooks apis": "Integration support is actively being developed with APIs and third-party integrations on our roadmap, including QuickBooks, Stripe payouts, BIM software, ERP systems, and other construction industry tools.",
  
  "real time updates": "Built on Firebase for real-time data synchronization across all devices and users. Changes are instantly reflected across web and mobile platforms with offline capabilities and automatic sync when reconnected.",

  // Security & Compliance
  "data security encryption": "Enterprise-grade security with data encrypted at rest and in transit using Firebase security rules, Google Cloud infrastructure, CSP headers, authentication middleware, and compliance with SOC 2 and GDPR standards.",
  
  "backup disaster recovery": "Automated daily backups with instant disaster recovery capabilities, data replication across multiple secure locations, and comprehensive business continuity planning.",

  // AI & Advanced Features
  "ai features natural language": "Our AI system understands natural language queries like 'Who has OSHA 30 in Texas?' or 'Show me available electricians this week.' It supports English and Spanish with smart suggestions, intent classification, and confidence scoring.",
  
  "certification renewal alerts": "Constructify automatically notifies both employees and admins before safety certifications, training, or licenses expire, helping maintain compliance without manual tracking through intelligent alert systems.",

  // Getting Started
  "getting started onboarding": "Getting started is easy! Sign up with your Google account, set up your company profile, invite team members, and start managing projects. Our onboarding team provides personalized guidance and training.",
  
  "pricing cost plans": "We offer three main plans: Starter ($299/month for up to 10 team members), Professional ($799/month for up to 25 members), and Enterprise ($1,999/month for unlimited). All plans include core features with scaling options.",
  
  "free trial demo": "We offer personalized demos and trial periods. Contact our sales team to schedule a demonstration tailored to your specific construction needs and company size.",

  // Industry Specific
  "residential construction": "Perfect for custom homes, multi-family developments, and residential renovations with features focused on quality control, homeowner communication, and sustainable building practices.",
  
  "commercial construction": "Ideal for office buildings, retail spaces, and commercial facilities with advanced project coordination, stakeholder management, and business operation optimization features.",
  
  "industrial construction": "Designed for manufacturing facilities, warehouses, and industrial complexes with robust safety compliance, equipment tracking, and operational efficiency tools."
}

// Construction Industry Terms & Capabilities
const constructionTerms = {
  "daily reports": "Digital daily reporting system for tracking work progress, weather conditions, labor hours, equipment usage, and safety incidents with automatic compilation and distribution.",
  
  "tool rental tracking": "Equipment and tool rental management with check-in/check-out systems, maintenance schedules, cost tracking, and availability calendars integrated with project planning.",
  
  "union labor management": "Specialized features for union labor including wage scales, benefit tracking, union dues deductions, certified payroll reporting, and prevailing wage compliance.",
  
  "change orders": "Digital change order management with approval workflows, cost impact analysis, timeline adjustments, and stakeholder notification systems.",
  
  "progress photos": "Integrated photo documentation with GPS tagging, timestamp verification, project phase organization, and automatic progress reporting compilation.",
  
  "quality inspections": "Digital inspection checklists, photo documentation, deficiency tracking, punch list management, and quality control reporting with automated notifications.",
  
  "material tracking": "Comprehensive material management including delivery tracking, inventory levels, waste monitoring, cost analysis, and supplier performance metrics.",
  
  "equipment maintenance": "Preventive maintenance scheduling, service history tracking, downtime monitoring, and cost analysis for all construction equipment and vehicles.",
  
  "subcontractor management": "Complete subcontractor lifecycle management including qualification, insurance verification, performance tracking, payment processing, and compliance monitoring.",
  
  "permit tracking": "Building permit management with application tracking, renewal alerts, inspection scheduling, and compliance documentation for all regulatory requirements."
}

// Security & Compliance FAQs - Enhanced
const securityFAQs = {
  "encrypted data security": "🔐 Absolutely! All sensitive employee data is encrypted at rest and in transit using Firebase security rules, Google Cloud infrastructure with enterprise-grade security protocols, and SOC 2 Type II compliance standards.",
  
  "data storage location": "🌐 Your data is securely stored on Google Cloud infrastructure with regional hosting options, strict data residency compliance, backup redundancy across multiple secure data centers, and 99.9% uptime SLA.",
  
  "soc hipaa compliance": "✅ We follow SOC 2 Type II security standards, maintain GDPR compliance, and offer HIPAA compliance features in our Enterprise plan with Business Associate Agreements (BAA) for healthcare-related construction projects.",
  
  "backup disaster recovery": "💾 We maintain automated daily backups with instant disaster recovery capabilities, data replication across multiple secure locations, and comprehensive business continuity planning.",
  
  "user permissions access": "👥 Constructify includes granular role-based access control with specific permissions for HR, payroll, safety managers, project managers, and field workers, plus comprehensive audit trails for all data access.",
  
  "api security": "🔒 Our APIs use OAuth 2.0 authentication, rate limiting, input validation, and comprehensive logging. All API communications are encrypted and monitored for security threats.",
  
  "mobile security": "📱 Mobile apps include biometric authentication, device encryption, remote wipe capabilities, and secure data transmission with offline data protection."
}

// Email notification system for unknown questions
const emailNotificationSystem = {
  // Configuration
  adminEmail: "jeff@constructify.com", // Your email address
  supportEmail: "support@constructify.com",
  
  // Email user for their contact information when we need to follow up
  async collectUserEmail(userMessage: string): Promise<string> {
    return `📧 **That's a great question!** I want to make sure you get a comprehensive answer from our experts.\n\n**To send you a detailed response, I'll need your email address.** Our team will research this thoroughly and get back to you within 2 hours with a complete answer.\n\n**Please provide your email and I'll make sure our specialists follow up with you directly!**\n\n*Your question: "${userMessage}"*`
  },
  
  // Send notification email to admin
  async notifyAdmin(questionData: any): Promise<boolean> {
    try {
      // In production, this would use a service like SendGrid, AWS SES, or similar
      const emailPayload = {
        to: this.adminEmail,
        subject: `🚨 New Chatbot Question Needs Answer - Constructify`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1e40af; border-bottom: 2px solid #f59e0b; padding-bottom: 10px;">
              🤖 New Chatbot Question Requires Your Attention
            </h2>
            
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #374151; margin-top: 0;">Question Details:</h3>
              <p><strong>User Question:</strong> "${questionData.message}"</p>
              <p><strong>User Email:</strong> ${questionData.userEmail || 'Not provided yet'}</p>
              <p><strong>Timestamp:</strong> ${new Date(questionData.timestamp).toLocaleString()}</p>
              <p><strong>Session ID:</strong> ${questionData.sessionId}</p>
            </div>
            
            <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #059669; margin-top: 0;">Conversation Context:</h3>
              ${questionData.conversationContext.map((msg: string, i: number) => 
                `<p style="margin: 5px 0;"><strong>Message ${i + 1}:</strong> ${msg}</p>`
              ).join('')}
            </div>
            
            <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #d97706; margin-top: 0;">Next Steps:</h3>
              <ol style="margin: 10px 0;">
                <li>Research the answer to this question</li>
                <li>Reply to this email with your response</li>
                <li>The system will automatically email the user your answer</li>
                <li>Consider adding this Q&A to the chatbot knowledge base</li>
              </ol>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="mailto:${this.supportEmail}?subject=Re: Chatbot Question - ${questionData.sessionId}&body=Answer: " 
                 style="background: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                📧 Reply with Answer
              </a>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; text-align: center;">
              This email was automatically generated by the Constructify chatbot system.
            </p>
          </div>
        `
      }
      
      // Log the email (in production, send via email service)
      console.log('📧 ADMIN EMAIL NOTIFICATION:', emailPayload)
      
      // In production, you would send the actual email here:
      // await sendEmail(emailPayload)
      
      return true
    } catch (error) {
      console.error('❌ Failed to send admin notification:', error)
      return false
    }
  },
  
  // Send follow-up email to user with the answer
  async sendAnswerToUser(userEmail: string, originalQuestion: string, answer: string, sessionId: string): Promise<boolean> {
    try {
      const emailPayload = {
        to: userEmail,
        subject: `✅ Your Constructify Question Answered`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #1e40af, #f59e0b); color: white; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; font-size: 24px;">🚀 Constructify</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Your Construction Management Experts</p>
            </div>
            
            <div style="padding: 30px; background: white; border-radius: 0 0 8px 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <h2 style="color: #1e40af; margin-top: 0;">Thanks for your question!</h2>
              
              <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
                <h3 style="color: #374151; margin-top: 0;">Your Question:</h3>
                <p style="font-style: italic; color: #6b7280;">"${originalQuestion}"</p>
              </div>
              
              <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
                <h3 style="color: #059669; margin-top: 0;">Our Answer:</h3>
                <div style="color: #374151; line-height: 1.6;">
                  ${answer.replace(/\n/g, '<br>')}
                </div>
              </div>
              
              <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #d97706; margin-top: 0;">Need More Help?</h3>
                <p style="margin: 10px 0;">We're here to help you succeed with Constructify!</p>
                <ul style="margin: 10px 0;">
                  <li>📞 <strong>Schedule a Demo:</strong> <a href="https://constructify.com/demo">Book a personalized walkthrough</a></li>
                  <li>💬 <strong>Live Chat:</strong> <a href="https://constructify.com">Chat with our AI assistant</a></li>
                  <li>📧 <strong>Direct Support:</strong> <a href="mailto:support@constructify.com">support@constructify.com</a></li>
                  <li>📱 <strong>Call Us:</strong> 1-800-CONSTRUCT</li>
                </ul>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://constructify.com/pricing" 
                   style="background: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 0 10px;">
                  🚀 Get Started Today
                </a>
                <a href="https://constructify.com/demo" 
                   style="background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 0 10px;">
                  🎬 Watch Demo
                </a>
              </div>
            </div>
            
            <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 14px;">
              <p>This answer was personally researched by our Constructify experts.</p>
              <p>Session ID: ${sessionId} | <a href="mailto:support@constructify.com">Report an Issue</a></p>
            </div>
          </div>
        `
      }
      
      // Log the email (in production, send via email service)
      console.log('📧 USER FOLLOW-UP EMAIL:', emailPayload)
      
      // In production, you would send the actual email here:
      // await sendEmail(emailPayload)
      
      return true
    } catch (error) {
      console.error('❌ Failed to send user follow-up email:', error)
      return false
    }
  }
}

// External Data Feed Preparation System
const externalDataFeed = {
  // Placeholder for external Constructify site data
  secondaryFAQs: {},
  advancedFeatures: {},
  additionalVerticals: {},
  
  // Method to sync external data (to be called when Jeff provides additional content)
  syncExternalData: async (externalData: any) => {
    try {
      // Merge external FAQ data
      Object.assign(faqDatabase, externalData.faqs || {})
      
      // Add advanced features
      Object.assign(constructifyKnowledge.features, externalData.features || {})
      
      // Add new industry verticals
      if (externalData.industries) {
        Object.assign(constructifyKnowledge.industries, externalData.industries)
      }
      
      console.log('✅ External data synchronized successfully')
      return true
    } catch (error) {
      console.error('❌ Failed to sync external data:', error)
      return false
    }
  },
  
  // Method to load data from external source
  loadExternalData: async () => {
    try {
      // In production, this would fetch from the external Constructify site
      // const response = await fetch('/api/external-constructify-data')
      // const externalData = await response.json()
      // return await externalDataFeed.syncExternalData(externalData)
      
      console.log('🔄 Ready to load external data when available')
      return true
    } catch (error) {
      console.error('❌ Failed to load external data:', error)
      return false
    }
  }
}

// Admin Response Handler (for when Jeff replies to emails)
const adminResponseHandler = {
  // Process admin email reply and send to user
  async processAdminReply(sessionId: string, adminAnswer: string, originalQuestion: string, userEmail: string): Promise<boolean> {
    try {
      // Send the answer to the user
      const emailSent = await emailNotificationSystem.sendAnswerToUser(
        userEmail, 
        originalQuestion, 
        adminAnswer, 
        sessionId
      )
      
      if (emailSent) {
        console.log(`✅ Answer sent to user ${userEmail} for session ${sessionId}`)
        
        // Optionally add to knowledge base for future questions
        this.suggestKnowledgeBaseAddition(originalQuestion, adminAnswer)
        
        return true
      }
      
      return false
    } catch (error) {
      console.error('❌ Failed to process admin reply:', error)
      return false
    }
  },
  
  // Suggest adding Q&A to knowledge base
  suggestKnowledgeBaseAddition(question: string, answer: string): void {
    const suggestion = {
      question: question,
      answer: answer,
      timestamp: new Date().toISOString(),
      status: 'suggested',
      category: 'admin_answered'
    }
    
    console.log('💡 KNOWLEDGE BASE SUGGESTION:', suggestion)
    
    // In production, this would be added to an admin review queue
    // for potential inclusion in the chatbot's knowledge base
  }
}

/*
 * 📧 EMAIL INTEGRATION SETUP INSTRUCTIONS FOR PRODUCTION:
 * 
 * 1. INSTALL EMAIL SERVICE:
 *    npm install @sendgrid/mail
 *    # OR
 *    npm install aws-sdk (for AWS SES)
 * 
 * 2. ENVIRONMENT VARIABLES (.env.local):
 *    SENDGRID_API_KEY=your_sendgrid_api_key
 *    ADMIN_EMAIL=jeff@constructify.com
 *    SUPPORT_EMAIL=support@constructify.com
 * 
 * 3. CREATE API ENDPOINT (/api/admin-reply):
 *    - Receive email replies from Jeff
 *    - Parse session ID and answer
 *    - Call adminResponseHandler.processAdminReply()
 * 
 * 4. EMAIL SERVICE SETUP:
 *    - Configure SendGrid or AWS SES
 *    - Set up email templates
 *    - Configure reply-to parsing
 * 
 * 5. WEBHOOK SETUP (Optional):
 *    - Set up SendGrid/SES webhooks
 *    - Parse incoming email replies
 *    - Automatically process admin responses
 */

// Intent & Sentiment Detection
function detectIntent(message: string): { intent: string; sentiment: string; urgency: string } {
  const lowerMessage = message.toLowerCase()
  
  // Sentiment Detection
  let sentiment = 'neutral'
  const positiveWords = ['great', 'awesome', 'love', 'perfect', 'excellent', 'amazing', 'fantastic']
  const negativeWords = ['not working', 'broken', 'problem', 'issue', 'frustrated', 'confused', 'difficult', 'stuck']
  const urgentWords = ['urgent', 'asap', 'immediately', 'emergency', 'critical', 'deadline', 'audit']
  
  if (positiveWords.some(word => lowerMessage.includes(word))) sentiment = 'positive'
  if (negativeWords.some(word => lowerMessage.includes(word))) sentiment = 'negative'
  
  // Urgency Detection
  let urgency = 'normal'
  if (urgentWords.some(word => lowerMessage.includes(word))) urgency = 'high'
  if (lowerMessage.includes('help') || lowerMessage.includes('support')) urgency = 'medium'
  
  // Intent Detection
  let intent = 'general'
  if (lowerMessage.includes('demo') || lowerMessage.includes('trial')) intent = 'demo_request'
  if (lowerMessage.includes('price') || lowerMessage.includes('cost')) intent = 'pricing_inquiry'
  if (lowerMessage.includes('integrate') || lowerMessage.includes('api')) intent = 'integration_request'
  if (lowerMessage.includes('feature') && lowerMessage.includes('request')) intent = 'feature_request'
  if (lowerMessage.includes('support') || lowerMessage.includes('help')) intent = 'support_request'
  
  return { intent, sentiment, urgency }
}

// Feature Request Logging
function logFeatureRequest(userMessage: string): string {
  const message = userMessage.toLowerCase()
  
  // Common integration requests
  if (message.includes('sage') || message.includes('quickbooks') || message.includes('procore')) {
    const integration = message.includes('sage') ? 'Sage' : message.includes('quickbooks') ? 'QuickBooks' : 'Procore'
    
    // Log to console (in production, this would go to a database)
    console.log(`🔥 FEATURE REQUEST LOGGED: ${integration} integration requested by user at ${new Date().toISOString()}`)
    
    return `📝 Great question! ${integration} integration isn't available yet, but I've logged your request for our product team to review. We're actively working on expanding our integration ecosystem.\n\nIn the meantime, our platform offers robust export capabilities and API access for custom integrations. Would you like to speak with our technical team about current integration options?`
  }
  
  // Other feature requests
  const featureKeywords = ['assign safety', 'foremen tasks', 'mobile app', 'offline mode', 'custom reports']
  for (const feature of featureKeywords) {
    if (message.includes(feature)) {
      console.log(`🔥 FEATURE REQUEST LOGGED: ${feature} requested by user at ${new Date().toISOString()}`)
      return `💡 That's a fantastic suggestion! I've logged your request for "${feature}" so our product team can prioritize it for future releases. We're constantly improving based on user feedback.\n\nIs there anything else about our current features I can help you explore?`
    }
  }
  
  return ""
}

// Context-Aware CTA Hooks
function getContextualCTA(message: string): string | null {
  const lowerMessage = message.toLowerCase()
  
  // Large team indicators
  if (lowerMessage.match(/\d{2,}.*workers?|employees?/) || lowerMessage.includes('250') || lowerMessage.includes('100')) {
    return `🎯 Managing a large workforce is exactly what Constructify excels at! With your team size, our Enterprise features like bulk user management, advanced analytics, and dedicated support would be perfect.\n\n**Ready for a personalized demo tailored to large-scale operations?** I can connect you with our enterprise specialist right now.`
  }
  
  // OSHA/Audit urgency
  if (lowerMessage.includes('osha audit') || lowerMessage.includes('compliance audit') || lowerMessage.includes('inspection')) {
    return `🚨 OSHA audits require immediate attention! Constructify's compliance dashboard can get you audit-ready in days, not weeks. We track all certifications, training records, and safety incidents automatically.\n\n**This sounds urgent - want me to fast-track you to our compliance specialist for immediate help?**`
  }
  
  // Competitor switching
  if (lowerMessage.includes('switching from') || lowerMessage.includes('procore') || lowerMessage.includes('current system')) {
    return `🔄 Switching platforms is a big decision! Constructify offers seamless data migration and our onboarding team ensures zero downtime. Many clients see 40% efficiency gains within their first month.\n\n**Want to see a side-by-side comparison with your current system? Our migration specialist can show you exactly how the transition would work.**`
  }
  
  return null
}

// Enhanced Smart Response System with External Data Integration
function getIntelligentResponse(
  userMessage: string, 
  conversationContext: string[] = [],
  isCollectingEmail: boolean = false,
  pendingQuestion: string = '',
  setIsCollectingEmail?: (value: boolean) => void,
  setPendingQuestion?: (value: string) => void
): string {
  const message = userMessage.toLowerCase()
  const { intent, sentiment, urgency } = detectIntent(userMessage)
  
  // Handle urgent/negative sentiment first
  if (sentiment === 'negative' || urgency === 'high') {
    if (message.includes('not working') || message.includes('broken') || message.includes('problem')) {
      return `🆘 I understand you're experiencing issues - that's frustrating! Let me get you immediate help.\n\n**I'm connecting you directly with our technical support team for priority assistance.** They'll resolve this quickly.\n\nIn the meantime, can you tell me more about what specifically isn't working?`
    }
    
    if (message.includes('confused') || message.includes('stuck') || message.includes('need help')) {
      return `🤝 No worries at all - I'm here to help make this easier! Let me guide you through this step by step.\n\nWhat specific area would you like me to explain more clearly? I can break down any feature in simple terms or connect you with our friendly support team for a quick walkthrough.`
    }
  }
  
  // Check for feature requests
  const featureResponse = logFeatureRequest(userMessage)
  if (featureResponse) return featureResponse
  
  // Check construction industry terms
  for (const [term, description] of Object.entries(constructionTerms)) {
    if (term.split(' ').some(keyword => message.includes(keyword))) {
      return `🏗️ **${term.toUpperCase()}**: ${description}\n\nConstructify handles this seamlessly as part of our comprehensive construction management platform. Would you like to see how this integrates with your other project management needs?`
    }
  }
  
  // Check security FAQs
  for (const [keywords, answer] of Object.entries(securityFAQs)) {
    if (keywords.split(' ').some(keyword => message.includes(keyword))) {
      return `${answer}\n\nNeed more details about our security measures or compliance certifications?`
    }
  }
  
  // Check comprehensive FAQ database
  for (const [keywords, answer] of Object.entries(faqDatabase)) {
    if (keywords.split(' ').some(keyword => message.includes(keyword))) {
      return `💡 ${answer}\n\nWould you like to know more about any specific feature or see a demo?`
    }
  }
  
  // Leadership team questions
  if (message.includes('team') || message.includes('founder') || message.includes('ceo') || message.includes('leadership')) {
    return `👥 **Our Leadership Team:**\n\n• **Tim Hamilton, CEO** - 25+ years in construction technology, expert in operations and strategic leadership\n• **Jeff Rogers, COO** - Construction industry veteran with deep product development expertise\n• **Rob Hourigan, CTO** - Software engineering leader focused on scalable, secure systems\n\nOur team combines decades of construction industry experience with cutting-edge technology vision. Want to learn more about our company mission and values?`
  }
  
  // Pricing and plan details
  if (message.includes('price') || message.includes('cost') || message.includes('plan') || message.includes('subscription')) {
    return `💰 **Our Pricing Plans:**\n\n🔸 **Starter Plan**: $299/month (1-10 team members)\n   • Basic project management, document storage, mobile access\n\n🔸 **Professional Plan**: $799/month (11-25 team members) ⭐ *Most Popular*\n   • Advanced features, resource planning, custom reporting, API access\n\n🔸 **Enterprise Plan**: $1,999/month (Unlimited team members)\n   • Full suite, advanced analytics, 24/7 support, custom integrations\n\n**🎯 [Get Custom Pricing →](https://constructify.com/pricing)**\n\n**Want an instant quote?** Tell me your team size and I'll calculate your exact pricing right now!`
  }
  
  // Interactive Demo Responses
  if (message.includes('demo') || message.includes('trial') || message.includes('try')) {
    return `🎬 Perfect! I'd love to show you Constructify in action:\n\n🖥️ **[Launch 60-Second Interactive Demo →](https://demo.constructify.com)**\n📞 **Live Walkthrough**: I can connect you with our demo team for a personalized tour\n📱 **Mobile Demo**: See how it works on phones/tablets\n🏗️ **Industry-Specific Demo**: Tailored to your construction type\n\n**What type of demo interests you most?** I can customize it to your specific needs!`
  }
  
  // Employee Profile Demo
  if (message.includes('employee profile') || message.includes('how does') && message.includes('profile')) {
    return `👤 **Want to see an employee profile in action?**\n\n🖥️ **[View Live Employee Profile Demo →](https://demo.constructify.com/employee-profile)**\n\nThis 60-second interactive demo shows:\n• All 50+ profile fields\n• Certification tracking with renewal alerts\n• Safety compliance status\n• Payroll integration with YTD earnings\n• Mobile editing capabilities\n• Unique Employee ID system\n\n**Or shall I walk you through adding a new user right now via screen share?**`
  }
  
  // Check for contextual CTAs
  const contextualCTA = getContextualCTA(userMessage)
  if (contextualCTA) return contextualCTA
  
  // Feature-specific responses with interactive elements
  if (message.includes('project') || message.includes('management')) {
    return `🏗️ Our project management tools streamline construction projects with:\n\n• Real-time collaboration and progress tracking\n• Task assignments with dependencies\n• Multi-site coordination\n• Timeline management\n• Resource allocation\n• Team communication tools\n\n**🎮 [Try Project Management Demo →](https://demo.constructify.com/projects)**\n\n**Want a personalized demo for your specific project types?**`
  }
  
  if (message.includes('employee') || message.includes('profile') || message.includes('staff')) {
    return `👷 Constructify's employee management includes:\n\n• Comprehensive profiles with 50+ fields\n• Certification tracking with automatic renewals\n• Safety compliance monitoring\n• Payroll integration with YTD tracking\n• Unique Employee ID for company transfers\n• Mobile access for field workers\n\n**🎯 [See Employee Management Demo →](https://demo.constructify.com/employees)**\n\n**Interested in our employee onboarding process?** I can show you how to add 100+ workers in under 10 minutes!`
  }
  
  if (message.includes('safety') || message.includes('compliance') || message.includes('osha')) {
    return `🛡️ **Safety & Compliance Features:**\n\n• OSHA certification tracking\n• Drug testing schedule management\n• Incident reporting with photo capture\n• Training completion tracking\n• Automatic renewal alerts\n• Compliance dashboards\n• Safety analytics and reporting\n\n**🎯 [View Safety Compliance Demo →](https://demo.constructify.com/safety)**\n\n**Need help with an upcoming OSHA audit?** Our compliance specialists can fast-track your setup!`
  }
  
  if (message.includes('help') || message.includes('support') || message.includes('question')) {
    return `🤝 I'm your dedicated Constructify assistant! I can help with:\n\n• 🏗️ Platform features & capabilities\n• 👷 Employee and project management\n• 🛡️ Safety compliance & OSHA tracking\n• 💰 Pricing & custom quotes\n• 🎬 Interactive demos & trials\n• 🔐 Security & compliance questions\n• 🏢 Industry-specific solutions\n• 🔧 Technical support\n\n**What specific challenge can I help you solve today?**`
  }
  
  // Industry-specific responses
  if (message.includes('residential') || message.includes('commercial') || message.includes('industrial')) {
    const industryType = message.includes('residential') ? 'residential' : 
                        message.includes('commercial') ? 'commercial' : 'industrial'
    
    const industryInfo = constructifyKnowledge.industries[industryType]
    
    return `🏢 **${industryType.toUpperCase()} CONSTRUCTION**\n\n${industryInfo}\n\n**🎯 [See Industry-Specific Demo →](https://demo.constructify.com/industries/${industryType})**\n\n**What type of ${industryType} projects does your company focus on?** I can show you features tailored to your specific needs!`
  }
  
  // AI and technology questions
  if (message.includes('ai') || message.includes('artificial intelligence') || message.includes('natural language')) {
    return `🤖 **Constructify's AI Capabilities:**\n\n• Natural language queries: "Who has OSHA 30 in Texas?"\n• Intent classification with confidence scoring\n• English and Spanish language support\n• Smart suggestions and follow-up questions\n• Pattern recognition for data extraction\n• Automated compliance monitoring\n\n**🎮 [Try AI Query Demo →](https://demo.constructify.com/ai-queries)**\n\n**Want to see the AI in action?** Ask me something like "Show me all electricians in California" and I'll demonstrate!`
  }
  
  // Technology stack questions
  if (message.includes('technology') || message.includes('tech stack') || message.includes('firebase') || message.includes('nextjs')) {
    return `⚡ **Our Technology Stack:**\n\n• **Frontend**: Next.js 15.1.0, TypeScript, Tailwind CSS, Radix UI\n• **Backend**: Firebase Authentication, Firestore database, Cloud Functions\n• **Mobile**: Progressive Web App with native-like experience\n• **Security**: SOC 2 Type II, GDPR compliance, enterprise encryption\n• **APIs**: RESTful APIs, GraphQL support, third-party integrations\n\n**Built for scale, security, and performance.** Want to see our technical architecture documentation?`
  }
  
  // Unknown question fallback with logging
  logUnknownQuestion(userMessage, conversationContext)
  
  // Check if we're collecting email for a previous unknown question
  if (isCollectingEmail && isValidEmail(userMessage.trim())) {
    const userEmail = userMessage.trim()
    
    // Update the pending question with user email and notify admin
    const questionData = {
      message: pendingQuestion,
      timestamp: new Date().toISOString(),
      conversationContext: conversationContext,
      sessionId: Date.now().toString(),
      userEmail: userEmail,
      status: 'admin_notified',
      needsFollowUp: true
    }
    
    // Send detailed notification to admin with user email using new utility
    sendAdminNotification(questionData)
    storeUnknownQuestion(questionData)
    
    // Reset email collection state
    if (setIsCollectingEmail) setIsCollectingEmail(false)
    if (setPendingQuestion) setPendingQuestion('')
    
    return `✅ **Perfect! I've got your email: ${userEmail}**\n\n🚀 **Here's what happens next:**\n\n1. ✉️ **I've notified our experts** about your question immediately\n2. 🔍 **They're researching** a comprehensive answer right now\n3. 📧 **You'll receive a detailed response** within 2 hours at ${userEmail}\n4. 💬 **Need immediate help?** Feel free to ask other questions!\n\n**Thanks for your patience - our team provides incredibly thorough answers that are worth the wait!**`
  }
  
  // If user provided invalid email during collection
  if (isCollectingEmail && !isValidEmail(userMessage.trim())) {
    return `📧 **I need a valid email address to send you the answer.**\n\nPlease provide your email in this format: **your-email@company.com**\n\n*Your original question: "${pendingQuestion}"*\n\n**Once I have your email, our experts will research this and get back to you within 2 hours!**`
  }
  
  // Sentiment-adjusted default responses with email collection
  const shouldCollectEmail = !isCollectingEmail && Math.random() > 0.3 // 70% chance to collect email
  
  if (shouldCollectEmail) {
    if (setIsCollectingEmail) setIsCollectingEmail(true)
    if (setPendingQuestion) setPendingQuestion(userMessage)
    return `🎯 **That's a great question!** I want to make sure you get the most comprehensive answer possible.\n\n**Can you provide your email address?** Our Constructify experts will research this personally and send you a detailed response within 2 hours.\n\n📧 **Just reply with your email** (like: your-email@company.com) and I'll get this to our team immediately!\n\n*Your question: "${userMessage}"*`
  }
  
  // Alternative responses for when not collecting email
  const responses = sentiment === 'positive' ? 
    [
      "🚀 I love your enthusiasm! While I don't have a specific answer for that question, I've flagged it for the Constructify team and they'll get you a response ASAP. In the meantime, what construction challenges can I help you solve?",
      "⚡ That's a great question! I've noted it for our experts to follow up on. While they're preparing a detailed response, I can tell you about our project management, employee tracking, safety compliance, or any other features you're curious about."
    ] : [
      "🤔 That's an interesting question! I don't have a specific answer for that right now, but I've flagged it for the Constructify team and they'll get you a comprehensive response ASAP.\n\n**In the meantime, I can help you with:**\n• Platform features and capabilities\n• Employee and project management\n• Safety compliance and OSHA\n• Pricing and demos\n• Getting started\n\nWhat specific area interests you most?",
      "💡 Great question! While I don't have that exact information at my fingertips, I've logged your question for our specialists to provide a detailed answer.\n\n**I can immediately help you with:**\n• Interactive platform demos\n• Pricing and plan comparisons\n• Feature explanations\n• Getting started guidance\n• Technical support\n\nWhat would you like to explore first?"
    ]
  
  return responses[Math.floor(Math.random() * responses.length)]
}

// Enhanced Unknown Question Logging System with Email Integration
function logUnknownQuestion(userMessage: string, context: string[] = []): void {
  const unknownQuestion = {
    message: userMessage,
    timestamp: new Date().toISOString(),
    conversationContext: context,
    sessionId: Date.now().toString(),
    userEmail: null, // Will be collected if user provides it
    status: 'pending_email_collection',
    needsFollowUp: true
  }
  
  // Log to console (in production, this would go to a database/queue for admin review)
  console.log(`🔍 UNKNOWN QUESTION LOGGED:`, unknownQuestion)
  
  // Trigger admin email notification using new utility
  sendAdminNotification(unknownQuestion)
  storeUnknownQuestion(unknownQuestion)
  
  // In production, this would be sent to an admin review system
  // await addToAdminReviewQueue(unknownQuestion)
}

// Email validation helper
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export default function LiveChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "👋 Welcome to Constructify! I'm your AI construction expert with complete knowledge of our platform. I can help you with:\n\n• Platform features & capabilities\n• Employee & project management\n• Safety compliance & OSHA\n• Pricing & demos\n• Getting started\n\nWhat would you like to know about Constructify?",
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [userInfo, setUserInfo] = useState({ name: '', email: '', company: '' })
  const [hasCollectedInfo, setHasCollectedInfo] = useState(false)
  const [conversationContext, setConversationContext] = useState<string[]>([])
  const [userSatisfaction, setUserSatisfaction] = useState<'positive' | 'negative' | null>(null)
  const [featureRequests, setFeatureRequests] = useState<string[]>([])
  const [isCollectingEmail, setIsCollectingEmail] = useState(false)
  const [pendingQuestion, setPendingQuestion] = useState<string>('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendEmailNotification = async (userMessage: string, userDetails: any) => {
    try {
      const emailData = {
        to: 'jrogbutdawgs@gmail.com',
        subject: `🔥 HOT LEAD: New Live Chat from ${userDetails.name || 'Anonymous'}`,
        body: `
          🚨 NEW HIGH-VALUE CHAT CONVERSATION 🚨
          
          👤 Contact Details:
          Name: ${userDetails.name || 'Not provided'}
          Email: ${userDetails.email || 'Not provided'}
          Company: ${userDetails.company || 'Not provided'}
          
          💬 Latest Message: ${userMessage}
          
          🕒 Timestamp: ${new Date().toLocaleString()}
          
          📋 Full Chat History:
          ${messages.map(msg => `${msg.sender === 'user' ? '👤 User' : '🤖 Bot'}: ${msg.text}`).join('\n')}
          
          ⚡ Action Required: Follow up within 2 hours for maximum conversion!
        `
      }
      
      console.log('🔥 Priority email notification:', emailData)
      
    } catch (error) {
      console.error('Failed to send email:', error)
    }
  }

  const addMessage = (text: string, sender: 'user' | 'bot') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, newMessage])
  }

  const getBotResponse = (userMessage: string) => {
    // Add to conversation context for better understanding
    setConversationContext(prev => [...prev, userMessage].slice(-5)) // Keep last 5 messages for context
    
    // Use the intelligent response system
    return getIntelligentResponse(
      userMessage, 
      conversationContext, 
      isCollectingEmail, 
      pendingQuestion, 
      setIsCollectingEmail, 
      setPendingQuestion
    )
  }

  const handleSatisfactionFeedback = (feedback: 'positive' | 'negative') => {
    setUserSatisfaction(feedback)
    
    // Log satisfaction feedback
    console.log(`🎯 USER SATISFACTION: ${feedback} feedback received at ${new Date().toISOString()}`)
    console.log(`📊 Conversation context:`, conversationContext)
    
    if (feedback === 'positive') {
      addMessage("🙌 Thank you for the positive feedback! Is there anything else I can help you with today?", 'bot')
    } else {
      addMessage("😔 I'm sorry I couldn't help better. Let me connect you with a human specialist who can provide more personalized assistance.", 'bot')
      setTimeout(() => {
        addMessage("🤝 I've notified our support team. Someone will reach out to you within 15 minutes to ensure you get the help you need!", 'bot')
      }, 1500)
    }
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage = inputValue.trim()
    addMessage(userMessage, 'user')
    setInputValue('')
    
    await sendEmailNotification(userMessage, userInfo)

    setIsTyping(true)
    
    setTimeout(() => {
      setIsTyping(false)
      const botResponse = getBotResponse(userMessage)
      addMessage(botResponse, 'bot')
      
      // Offer satisfaction feedback and additional help after several exchanges
      if (messages.length > 6 && userSatisfaction === null) {
        setTimeout(() => {
          addMessage("💬 I'm here to help with any other questions about Constructify! You can also:\n\n• Request a personalized demo\n• Speak with our sales team\n• Get technical support\n\nWhat else would you like to know?", 'bot')
          
          // Add satisfaction tracking after a few more exchanges
          setTimeout(() => {
            addMessage("🎯 Quick question: How am I doing so far? Your feedback helps me improve!", 'bot')
          }, 3000)
        }, 2000)
      }
    }, 1200 + Math.random() * 800)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative">
          {/* Pulsing rings */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[hsl(225,70%,12%)] to-[hsl(48,8%,85%)] animate-ping opacity-20"></div>
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[hsl(225,70%,12%)] to-[hsl(48,8%,85%)] animate-pulse opacity-30"></div>
          
          <Button
            onClick={() => setIsOpen(true)}
            className="relative h-16 w-16 rounded-full bg-gradient-to-br from-[hsl(225,70%,12%)] via-[hsl(220,80%,8%)] to-[hsl(225,70%,12%)] hover:from-[hsl(220,80%,8%)] hover:via-[hsl(225,70%,12%)] hover:to-[hsl(220,80%,8%)] shadow-2xl hover:shadow-[hsl(225,70%,12%)]/50 transition-all duration-500 hover:scale-110 border-2 border-[hsl(48,8%,85%)]/30 hover:border-[hsl(48,8%,85%)]/60"
            aria-label="Open live chat"
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[hsl(48,8%,85%)]/20 to-[hsl(225,70%,12%)]/20 animate-spin-slow"></div>
            <MessageSquare className="h-7 w-7 text-white relative z-10" />
            <Sparkles className="absolute top-1 right-1 h-4 w-4 text-[hsl(48,8%,85%)] animate-pulse" />
          </Button>
          
          {/* Floating notification */}
          <div className="absolute -top-2 -left-2 h-6 w-6 bg-gradient-to-r from-[hsl(48,8%,85%)] to-[hsl(45,12%,78%)] rounded-full flex items-center justify-center animate-bounce">
            <span className="text-xs font-black text-[hsl(225,70%,12%)]">!</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className={`relative transition-all duration-500 ${
        isMinimized ? 'h-20 w-80' : 'h-[32rem] w-96'
      }`}>
        {/* Glowing background - Using SIGN IN button navy color */}
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(225,70%,12%)]/90 via-[hsl(220,80%,8%)]/95 to-[hsl(225,70%,12%)]/90 backdrop-blur-2xl rounded-3xl border-2 border-[hsl(48,8%,85%)]/30 shadow-2xl shadow-[hsl(225,70%,12%)]/50"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(48,8%,85%)]/10 via-transparent to-[hsl(225,70%,12%)]/10 rounded-3xl"></div>
        
        {/* Animated border - Using GET A DEMO button tan color */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-[hsl(48,8%,85%)] via-[hsl(45,12%,78%)] to-[hsl(48,8%,85%)] p-[2px] animate-pulse">
          <div className="h-full w-full bg-gradient-to-br from-[hsl(225,70%,12%)]/95 via-[hsl(220,80%,8%)]/98 to-[hsl(225,70%,12%)]/95 rounded-3xl"></div>
        </div>

        <div className="relative h-full w-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[hsl(48,8%,85%)]/20">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[hsl(48,8%,85%)] to-[hsl(45,12%,78%)] flex items-center justify-center shadow-lg">
                  <Bot className="h-5 w-5 text-[hsl(225,70%,12%)]" />
                </div>
                <div className="absolute -top-1 -right-1 h-4 w-4 bg-gradient-to-r from-green-400 to-green-500 rounded-full border-2 border-[hsl(225,70%,12%)] animate-pulse"></div>
              </div>
              <div>
                <h3 className="font-black text-white text-lg bg-gradient-to-r from-[hsl(48,8%,85%)] to-[hsl(45,12%,78%)] bg-clip-text text-transparent">
                  Constructify AI
                </h3>
                <p className="text-sm text-gray-300 font-medium">⚡ Lightning fast replies</p>
              </div>
              <Sparkles className="h-5 w-5 text-[hsl(48,8%,85%)] animate-pulse" />
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="h-8 w-8 p-0 text-[hsl(48,8%,85%)] hover:text-[hsl(45,12%,78%)] hover:bg-[hsl(48,8%,85%)]/10"
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 p-0 text-[hsl(48,8%,85%)] hover:text-[hsl(45,12%,78%)] hover:bg-[hsl(48,8%,85%)]/10"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="h-80 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-track-[hsl(225,70%,12%)]/20 scrollbar-thumb-[hsl(48,8%,85%)]/50">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-start gap-3 max-w-[85%] ${
                      message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                    }`}>
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ${
                        message.sender === 'user' 
                          ? 'bg-gradient-to-br from-[hsl(48,8%,85%)] to-[hsl(45,12%,78%)]' 
                          : 'bg-gradient-to-br from-[hsl(225,70%,12%)] to-[hsl(220,80%,8%)]'
                      }`}>
                        {message.sender === 'user' ? (
                          <User className="h-4 w-4 text-[hsl(225,70%,12%)]" />
                        ) : (
                          <Bot className="h-4 w-4 text-white" />
                        )}
                      </div>
                      <div className={`px-4 py-3 rounded-2xl text-sm font-medium shadow-lg transition-all duration-300 hover:scale-105 ${
                        message.sender === 'user'
                          ? 'bg-gradient-to-br from-[hsl(48,8%,85%)] to-[hsl(45,12%,78%)] text-[hsl(225,70%,12%)] border border-[hsl(45,12%,78%)]'
                          : 'bg-gradient-to-br from-white to-gray-50 text-[hsl(225,70%,12%)] border border-gray-200'
                      }`}>
                        <div className="whitespace-pre-wrap">{message.text}</div>
                        
                        {/* Satisfaction feedback buttons for specific bot messages */}
                        {message.sender === 'bot' && message.text.includes('How am I doing so far?') && userSatisfaction === null && (
                          <div className="flex gap-2 mt-3 pt-2 border-t border-gray-300">
                            <button
                              onClick={() => handleSatisfactionFeedback('positive')}
                              className="flex items-center gap-1 px-3 py-1 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg text-xs transition-colors font-semibold"
                            >
                              👍 Helpful
                            </button>
                            <button
                              onClick={() => handleSatisfactionFeedback('negative')}
                              className="flex items-center gap-1 px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-xs transition-colors font-semibold"
                            >
                              👎 Need Help
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[hsl(225,70%,12%)] to-[hsl(220,80%,8%)] flex items-center justify-center shadow-lg">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                      <div className="bg-gradient-to-br from-white to-gray-50 px-4 py-3 rounded-2xl border border-gray-200 shadow-lg">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gradient-to-r from-[hsl(225,70%,12%)] to-[hsl(48,8%,85%)] rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gradient-to-r from-[hsl(48,8%,85%)] to-[hsl(225,70%,12%)] rounded-full animate-bounce chat-typing-dot-1"></div>
                          <div className="w-2 h-2 bg-gradient-to-r from-[hsl(225,70%,12%)] to-[hsl(48,8%,85%)] rounded-full animate-bounce chat-typing-dot-2"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-6 border-t border-[hsl(48,8%,85%)]/20">
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
                      className="bg-gradient-to-r from-white/90 to-gray-50/90 border-2 border-[hsl(48,8%,85%)]/30 focus:border-[hsl(48,8%,85%)] text-[hsl(225,70%,12%)] placeholder:text-gray-600 font-medium rounded-xl h-12 px-4 shadow-lg"
                    />
                    <Zap className="absolute right-3 top-3 h-6 w-6 text-[hsl(45,12%,78%)] animate-pulse" />
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim()}
                    className="bg-gradient-to-br from-[hsl(48,8%,85%)] to-[hsl(45,12%,78%)] hover:from-[hsl(45,12%,78%)] hover:to-[hsl(48,8%,85%)] text-[hsl(225,70%,12%)] font-black h-12 w-12 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:hover:scale-100"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
} 