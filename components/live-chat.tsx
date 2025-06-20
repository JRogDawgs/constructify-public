"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageSquare, Send, X, Minimize2, Maximize2, Bot, User, Sparkles, Zap } from "lucide-react"

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}

const botResponses = [
  "🚀 Welcome to Constructify! I'm your AI construction expert. What amazing project can I help you build today?",
  "💡 That sounds like an incredible project! Tell me more about your vision - I love helping bring construction dreams to life!",
  "🏗️ Excellent choice! Our platform specializes in that exact type of project. What's your biggest challenge right now?",
  "⚡ Perfect! I can see this is going to be something special. Can you share your contact details so our expert team can give you VIP treatment?",
  "🎯 Outstanding! I've flagged your conversation as HIGH PRIORITY and sent it directly to our construction specialists. They'll contact you within 2 hours with a custom solution!",
]

export default function LiveChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "🎉 Hey there, future construction legend! I'm your AI assistant, ready to help you build something extraordinary. What's your next big project?",
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [userInfo, setUserInfo] = useState({ name: '', email: '', company: '' })
  const [hasCollectedInfo, setHasCollectedInfo] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [responseIndex, setResponseIndex] = useState(0)

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

  const getBotResponse = () => {
    if (responseIndex < botResponses.length) {
      const response = botResponses[responseIndex]
      setResponseIndex(prev => prev + 1)
      return response
    }
    return "🎯 Your message is with our elite team now! Expect a response that'll blow your mind. Anything else I can help you dominate today?"
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
      const botResponse = getBotResponse()
      addMessage(botResponse, 'bot')
      
      if (!hasCollectedInfo && messages.length > 4) {
        setTimeout(() => {
          addMessage("🎯 To give you VIP treatment, I need your name, email, and company. Ready to unlock premium support?", 'bot')
        }, 1500)
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
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-yellow-500 animate-ping opacity-20"></div>
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-yellow-500 animate-pulse opacity-30"></div>
          
          <Button
            onClick={() => setIsOpen(true)}
            className="relative h-16 w-16 rounded-full bg-gradient-to-br from-blue-800 via-blue-700 to-blue-900 hover:from-blue-700 hover:via-blue-600 hover:to-blue-800 shadow-2xl hover:shadow-blue-500/50 transition-all duration-500 hover:scale-110 border-2 border-yellow-400/30 hover:border-yellow-400/60"
            aria-label="Open live chat"
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400/20 to-blue-600/20 animate-spin-slow"></div>
            <MessageSquare className="h-7 w-7 text-white relative z-10" />
            <Sparkles className="absolute top-1 right-1 h-4 w-4 text-yellow-400 animate-pulse" />
          </Button>
          
          {/* Floating notification */}
          <div className="absolute -top-2 -left-2 h-6 w-6 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center animate-bounce">
            <span className="text-xs font-black text-blue-900">!</span>
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
        {/* Glowing background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-blue-800/95 to-blue-900/90 backdrop-blur-2xl rounded-3xl border-2 border-yellow-400/30 shadow-2xl shadow-blue-900/50"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 via-transparent to-blue-600/10 rounded-3xl"></div>
        
        {/* Animated border */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-yellow-400 via-blue-500 to-yellow-400 p-[2px] animate-pulse">
          <div className="h-full w-full bg-gradient-to-br from-blue-900/95 via-blue-800/98 to-blue-900/95 rounded-3xl"></div>
        </div>

        <div className="relative h-full w-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-yellow-400/20">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center shadow-lg">
                  <Bot className="h-5 w-5 text-blue-900" />
                </div>
                <div className="absolute -top-1 -right-1 h-4 w-4 bg-gradient-to-r from-green-400 to-green-500 rounded-full border-2 border-blue-900 animate-pulse"></div>
              </div>
              <div>
                <h3 className="font-black text-white text-lg bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent">
                  Constructify AI
                </h3>
                <p className="text-sm text-blue-200 font-medium">⚡ Lightning fast replies</p>
              </div>
              <Sparkles className="h-5 w-5 text-yellow-400 animate-pulse" />
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="h-8 w-8 p-0 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/10"
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 p-0 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/10"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="h-80 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-track-blue-900/20 scrollbar-thumb-yellow-400/50">
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
                          ? 'bg-gradient-to-br from-yellow-400 to-yellow-500' 
                          : 'bg-gradient-to-br from-blue-600 to-blue-700'
                      }`}>
                        {message.sender === 'user' ? (
                          <User className="h-4 w-4 text-blue-900" />
                        ) : (
                          <Bot className="h-4 w-4 text-white" />
                        )}
                      </div>
                      <div className={`px-4 py-3 rounded-2xl text-sm font-medium shadow-lg transition-all duration-300 hover:scale-105 ${
                        message.sender === 'user'
                          ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-blue-900 border border-yellow-300'
                          : 'bg-gradient-to-br from-white to-blue-50 text-blue-900 border border-blue-200'
                      }`}>
                        {message.text}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                      <div className="bg-gradient-to-br from-white to-blue-50 px-4 py-3 rounded-2xl border border-blue-200 shadow-lg">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gradient-to-r from-blue-600 to-yellow-500 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gradient-to-r from-yellow-500 to-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gradient-to-r from-blue-600 to-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-6 border-t border-yellow-400/20">
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
                      className="bg-gradient-to-r from-white/90 to-blue-50/90 border-2 border-yellow-400/30 focus:border-yellow-400 text-blue-900 placeholder:text-blue-600 font-medium rounded-xl h-12 px-4 shadow-lg"
                    />
                    <Zap className="absolute right-3 top-3 h-6 w-6 text-yellow-500 animate-pulse" />
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim()}
                    className="bg-gradient-to-br from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 text-blue-900 font-black h-12 w-12 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:hover:scale-100"
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