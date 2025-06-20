// 🎯 Lead Scoring System for Constructify Demo Requests
// Analyzes incoming demo data and assigns lead scores

export interface LeadScore {
  score: number
  isHotLead: boolean
  reasons: string[]
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'HOT'
  emailSubjectPrefix: string
}

export interface DemoRequestData {
  userName: string
  userEmail: string
  companyName: string
  teamSize: string
  industryType: string
  specificInterests: string[]
  urgency: 'immediate' | 'this_week' | 'next_week' | 'flexible'
  conversationContext?: string[]
  triggerMessage?: string
}

/**
 * Analyzes team size and assigns points
 */
function scoreTeamSize(teamSize: string): { points: number; reason?: string } {
  const size = teamSize.toLowerCase()
  
  if (size.includes('100+') || size.includes('large') || size.includes('enterprise')) {
    return { points: 25, reason: 'Large enterprise team (100+ employees)' }
  }
  
  if (size.includes('26-100') || size.includes('medium')) {
    return { points: 20, reason: 'Medium-sized team (26-100 employees)' }
  }
  
  if (size.includes('11-25') || size.includes('growing')) {
    return { points: 15, reason: 'Growing team (11-25 employees)' }
  }
  
  if (size.includes('1-10') || size.includes('small')) {
    return { points: 5, reason: 'Small team (1-10 employees)' }
  }
  
  return { points: 0 }
}

/**
 * Analyzes industry type and assigns points
 */
function scoreIndustry(industryType: string): { points: number; reason?: string } {
  const industry = industryType.toLowerCase()
  
  if (industry.includes('commercial')) {
    return { points: 20, reason: 'Commercial construction (high-value projects)' }
  }
  
  if (industry.includes('industrial')) {
    return { points: 20, reason: 'Industrial construction (complex operations)' }
  }
  
  if (industry.includes('infrastructure')) {
    return { points: 15, reason: 'Infrastructure projects (large scale)' }
  }
  
  if (industry.includes('mixed') || industry.includes('multiple')) {
    return { points: 15, reason: 'Multiple construction types (diverse needs)' }
  }
  
  if (industry.includes('residential')) {
    return { points: 10, reason: 'Residential construction' }
  }
  
  return { points: 0 }
}

/**
 * Analyzes specific interests and assigns points
 */
function scoreInterests(interests: string[]): { points: number; reasons: string[] } {
  let points = 0
  const reasons: string[] = []
  
  const interestScores = {
    'full platform': { points: 25, reason: 'Interested in full platform (comprehensive solution)' },
    'all features': { points: 25, reason: 'Wants all features (high-value prospect)' },
    'payroll': { points: 20, reason: 'Payroll integration interest (high-value feature)' },
    'payroll integration': { points: 20, reason: 'Payroll integration interest (high-value feature)' },
    'employee management': { points: 15, reason: 'Employee management focus' },
    'project management': { points: 15, reason: 'Project management needs' },
    'safety compliance': { points: 15, reason: 'Safety compliance requirements' },
    'analytics': { points: 10, reason: 'Analytics and reporting interest' },
    'reporting': { points: 10, reason: 'Analytics and reporting interest' },
    'mobile access': { points: 10, reason: 'Mobile workforce needs' },
    'api access': { points: 15, reason: 'API integration needs (technical sophistication)' }
  }
  
  interests.forEach(interest => {
    const interestLower = interest.toLowerCase()
    
    Object.entries(interestScores).forEach(([key, value]) => {
      if (interestLower.includes(key)) {
        points += value.points
        reasons.push(value.reason)
      }
    })
  })
  
  return { points, reasons }
}

/**
 * Analyzes urgency and assigns points
 */
function scoreUrgency(urgency: string): { points: number; reason?: string } {
  switch (urgency) {
    case 'immediate':
      return { points: 25, reason: 'Immediate urgency (ready to buy)' }
    case 'this_week':
      return { points: 20, reason: 'This week urgency (high interest)' }
    case 'next_week':
      return { points: 15, reason: 'Next week timing (moderate urgency)' }
    case 'flexible':
      return { points: 5, reason: 'Flexible timing' }
    default:
      return { points: 0 }
  }
}

/**
 * Analyzes conversation context for buying signals
 */
function scoreConversationContext(context?: string[], triggerMessage?: string): { points: number; reasons: string[] } {
  let points = 0
  const reasons: string[] = []
  
  const buyingSignals = [
    { keywords: ['budget', 'cost', 'price', 'investment'], points: 15, reason: 'Discussed pricing/budget (buying signal)' },
    { keywords: ['when can we start', 'implementation', 'onboarding'], points: 20, reason: 'Asked about implementation (ready to proceed)' },
    { keywords: ['roi', 'return', 'savings', 'efficiency'], points: 15, reason: 'Focused on ROI and benefits' },
    { keywords: ['competitor', 'comparing', 'alternatives'], points: 10, reason: 'Comparing solutions (active buyer)' },
    { keywords: ['team', 'employees', 'staff', 'workers'], points: 10, reason: 'Discussed team size/needs' },
    { keywords: ['problems', 'challenges', 'pain', 'frustrated'], points: 15, reason: 'Expressed pain points (motivated buyer)' }
  ]
  
  const allContext = [...(context || []), triggerMessage || ''].join(' ').toLowerCase()
  
  buyingSignals.forEach(signal => {
    if (signal.keywords.some(keyword => allContext.includes(keyword))) {
      points += signal.points
      reasons.push(signal.reason)
    }
  })
  
  return { points, reasons }
}

/**
 * Determines if lead qualifies as HOT based on specific criteria
 */
function isHotLead(data: DemoRequestData, teamSizePoints: number, industryPoints: number, interestPoints: number): boolean {
  // HOT LEAD criteria from requirements
  const hasLargeTeam = teamSizePoints >= 15 // 11+ employees
  const isHighValueIndustry = data.industryType.toLowerCase().includes('commercial') || 
                              data.industryType.toLowerCase().includes('industrial')
  const hasHighValueInterests = data.specificInterests.some(interest => 
    interest.toLowerCase().includes('full platform') || 
    interest.toLowerCase().includes('all features') ||
    interest.toLowerCase().includes('payroll')
  )
  const hasUrgency = data.urgency === 'immediate' || data.urgency === 'this_week'
  
  return hasLargeTeam || isHighValueIndustry || hasHighValueInterests || hasUrgency
}

/**
 * Main lead scoring function
 */
export function scoreLeadData(data: DemoRequestData): LeadScore {
  const teamSizeResult = scoreTeamSize(data.teamSize)
  const industryResult = scoreIndustry(data.industryType)
  const interestsResult = scoreInterests(data.specificInterests)
  const urgencyResult = scoreUrgency(data.urgency)
  const contextResult = scoreConversationContext(data.conversationContext, data.triggerMessage)
  
  // Calculate total score
  const totalScore = teamSizeResult.points + industryResult.points + interestsResult.points + 
                     urgencyResult.points + contextResult.points
  
  // Collect all reasons
  const reasons: string[] = []
  if (teamSizeResult.reason) reasons.push(teamSizeResult.reason)
  if (industryResult.reason) reasons.push(industryResult.reason)
  reasons.push(...interestsResult.reasons)
  if (urgencyResult.reason) reasons.push(urgencyResult.reason)
  reasons.push(...contextResult.reasons)
  
  // Determine if HOT lead
  const hotLead = isHotLead(data, teamSizeResult.points, industryResult.points, interestsResult.points)
  
  // Determine priority and email prefix
  let priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'HOT'
  let emailSubjectPrefix: string
  
  if (hotLead) {
    priority = 'HOT'
    emailSubjectPrefix = '[🔥 HOT LEAD]'
  } else if (totalScore >= 60) {
    priority = 'HIGH'
    emailSubjectPrefix = '[⚡ HIGH PRIORITY]'
  } else if (totalScore >= 30) {
    priority = 'MEDIUM'
    emailSubjectPrefix = '[📈 QUALIFIED LEAD]'
  } else {
    priority = 'LOW'
    emailSubjectPrefix = '[📝 NEW LEAD]'
  }
  
  return {
    score: totalScore,
    isHotLead: hotLead,
    reasons,
    priority,
    emailSubjectPrefix
  }
}

/**
 * Generates a detailed lead score report
 */
export function generateLeadScoreReport(data: DemoRequestData, score: LeadScore): string {
  return `
🎯 LEAD SCORE ANALYSIS for ${data.companyName}

📊 TOTAL SCORE: ${score.score}/100
🏷️ PRIORITY: ${score.priority}
${score.isHotLead ? '🔥 HOT LEAD QUALIFIED!' : ''}

📋 SCORING BREAKDOWN:
${score.reasons.map(reason => `• ${reason}`).join('\n')}

🏢 COMPANY PROFILE:
• Name: ${data.companyName}
• Contact: ${data.userName} (${data.userEmail})
• Team Size: ${data.teamSize}
• Industry: ${data.industryType}
• Interests: ${data.specificInterests.join(', ')}
• Urgency: ${data.urgency.replace('_', ' ').toUpperCase()}

🎯 RECOMMENDED ACTION:
${score.isHotLead ? 
  '⚡ IMMEDIATE FOLLOW-UP REQUIRED - Call within 1 hour!' : 
  score.priority === 'HIGH' ? 
    '📞 Follow up within 2-4 hours' : 
    score.priority === 'MEDIUM' ? 
      '📧 Follow up within 24 hours' : 
      '📝 Add to nurture sequence'
}
  `.trim()
}

/**
 * Gets lead score summary for display
 */
export function getLeadScoreSummary(score: LeadScore): string {
  const emoji = score.isHotLead ? '🔥' : 
                score.priority === 'HIGH' ? '⚡' : 
                score.priority === 'MEDIUM' ? '📈' : '📝'
  
  return `${emoji} ${score.priority} (${score.score}/100)`
} 