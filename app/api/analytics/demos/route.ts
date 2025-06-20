import { NextRequest, NextResponse } from 'next/server'

// Mock data for analytics (in production, this would come from database)
interface DemoAnalytics {
  totalDemos: {
    daily: number
    weekly: number
    monthly: number
  }
  conversionRate: {
    demoToTrial: number
    demoToSale: number
  }
  triggerMessages: {
    message: string
    count: number
    conversionRate: number
  }[]
  breakdown: {
    byIndustry: { industry: string; count: number; percentage: number }[]
    byTeamSize: { size: string; count: number; percentage: number }[]
    byUrgency: { urgency: string; count: number; percentage: number }[]
    byPriority: { priority: string; count: number; percentage: number }[]
  }
  recentDemos: {
    id: string
    company: string
    contact: string
    email: string
    industry: string
    teamSize: string
    priority: string
    score: number
    timestamp: string
    status: string
  }[]
  hotLeads: {
    id: string
    company: string
    contact: string
    email: string
    score: number
    reasons: string[]
    timestamp: string
    followedUp: boolean
  }[]
}

/**
 * Generates mock analytics data (replace with real database queries in production)
 */
function generateMockAnalytics(): DemoAnalytics {
  const currentDate = new Date()
  const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
  
  return {
    totalDemos: {
      daily: Math.floor(Math.random() * 15) + 5, // 5-20 demos per day
      weekly: Math.floor(Math.random() * 80) + 30, // 30-110 demos per week
      monthly: Math.floor(Math.random() * 300) + 120 // 120-420 demos per month
    },
    conversionRate: {
      demoToTrial: Math.round((Math.random() * 20 + 15) * 100) / 100, // 15-35%
      demoToSale: Math.round((Math.random() * 10 + 5) * 100) / 100 // 5-15%
    },
    triggerMessages: [
      { message: "I would like to see a demo", count: 45, conversionRate: 78.5 },
      { message: "Schedule a demo", count: 38, conversionRate: 82.1 },
      { message: "Show me how it works", count: 32, conversionRate: 65.2 },
      { message: "Can we set up a meeting", count: 28, conversionRate: 71.4 },
      { message: "I'm interested in pricing", count: 25, conversionRate: 88.0 },
      { message: "Tell me about your platform", count: 22, conversionRate: 59.1 },
      { message: "Book a demo", count: 19, conversionRate: 84.2 },
      { message: "What does this cost", count: 17, conversionRate: 76.5 }
    ],
    breakdown: {
      byIndustry: [
        { industry: "Commercial", count: 52, percentage: 31.5 },
        { industry: "Residential", count: 48, percentage: 29.1 },
        { industry: "Industrial", count: 35, percentage: 21.2 },
        { industry: "Infrastructure", count: 20, percentage: 12.1 },
        { industry: "Mixed/Multiple", count: 10, percentage: 6.1 }
      ],
      byTeamSize: [
        { size: "1-10 employees", count: 68, percentage: 41.2 },
        { size: "11-25 employees", count: 45, percentage: 27.3 },
        { size: "26-100 employees", count: 32, percentage: 19.4 },
        { size: "100+ employees", count: 20, percentage: 12.1 }
      ],
      byUrgency: [
        { urgency: "This Week", count: 58, percentage: 35.2 },
        { urgency: "Flexible", count: 42, percentage: 25.5 },
        { urgency: "Next Week", count: 38, percentage: 23.0 },
        { urgency: "Immediate", count: 27, percentage: 16.4 }
      ],
      byPriority: [
        { priority: "MEDIUM", count: 62, percentage: 37.6 },
        { priority: "LOW", count: 48, percentage: 29.1 },
        { priority: "HIGH", count: 32, percentage: 19.4 },
        { priority: "HOT", count: 23, percentage: 13.9 }
      ]
    },
    recentDemos: [
      {
        id: "demo_1703123456789",
        company: "BuildRight Construction",
        contact: "John Smith",
        email: "john@buildright.com",
        industry: "Commercial",
        teamSize: "26-100 employees",
        priority: "HOT",
        score: 85,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        status: "Pending"
      },
      {
        id: "demo_1703123456788",
        company: "Metro Builders LLC",
        contact: "Sarah Johnson",
        email: "sarah@metrobuilders.com",
        industry: "Residential",
        teamSize: "11-25 employees",
        priority: "HIGH",
        score: 72,
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
        status: "Scheduled"
      },
      {
        id: "demo_1703123456787",
        company: "Summit Construction",
        contact: "Mike Wilson",
        email: "mike@summitconstruction.com",
        industry: "Industrial",
        teamSize: "100+ employees",
        priority: "HOT",
        score: 92,
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
        status: "Completed"
      },
      {
        id: "demo_1703123456786",
        company: "Precision Contractors",
        contact: "Lisa Davis",
        email: "lisa@precisioncontractors.com",
        industry: "Commercial",
        teamSize: "11-25 employees",
        priority: "MEDIUM",
        score: 58,
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
        status: "Pending"
      },
      {
        id: "demo_1703123456785",
        company: "Elite Construction Group",
        contact: "Robert Brown",
        email: "robert@eliteconstruction.com",
        industry: "Infrastructure",
        teamSize: "26-100 employees",
        priority: "HIGH",
        score: 78,
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
        status: "Scheduled"
      }
    ],
    hotLeads: [
      {
        id: "demo_1703123456789",
        company: "BuildRight Construction",
        contact: "John Smith",
        email: "john@buildright.com",
        score: 85,
        reasons: [
          "Medium-sized team (26-100 employees)",
          "Commercial construction (high-value projects)",
          "Interested in full platform (comprehensive solution)",
          "This week urgency (high interest)"
        ],
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        followedUp: false
      },
      {
        id: "demo_1703123456787",
        company: "Summit Construction",
        contact: "Mike Wilson",
        email: "mike@summitconstruction.com",
        score: 92,
        reasons: [
          "Large enterprise team (100+ employees)",
          "Industrial construction (complex operations)",
          "Payroll integration interest (high-value feature)",
          "Immediate urgency (ready to buy)"
        ],
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        followedUp: true
      },
      {
        id: "demo_1703123456785",
        company: "Elite Construction Group",
        contact: "Robert Brown",
        email: "robert@eliteconstruction.com",
        score: 78,
        reasons: [
          "Medium-sized team (26-100 employees)",
          "Infrastructure projects (large scale)",
          "Employee management focus",
          "This week urgency (high interest)"
        ],
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        followedUp: false
      }
    ]
  }
}

/**
 * GET /api/analytics/demos
 * Returns demo analytics dashboard data
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const timeframe = searchParams.get('timeframe') || 'monthly'
    const format = searchParams.get('format') || 'json'
    
    console.log('📊 Analytics request:', { timeframe, format })
    
    // In production, this would query your database
    // const analytics = await getDemoAnalyticsFromDB(timeframe)
    const analytics = generateMockAnalytics()
    
    // Add metadata
    const response = {
      success: true,
      timeframe,
      generatedAt: new Date().toISOString(),
      data: analytics,
      summary: {
        totalLeads: analytics.recentDemos.length,
        hotLeads: analytics.hotLeads.length,
        conversionRate: analytics.conversionRate.demoToTrial,
        topIndustry: analytics.breakdown.byIndustry[0]?.industry || 'Commercial',
        averageScore: Math.round(analytics.recentDemos.reduce((sum, demo) => sum + demo.score, 0) / analytics.recentDemos.length)
      }
    }
    
    if (format === 'csv') {
      // Generate CSV format for export
      const csvData = generateCSVReport(analytics)
      return new NextResponse(csvData, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="demo-analytics.csv"'
        }
      })
    }
    
    return NextResponse.json(response)
    
  } catch (error) {
    console.error('❌ Analytics error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics data' },
      { status: 500 }
    )
  }
}

/**
 * Generates CSV report for export
 */
function generateCSVReport(analytics: DemoAnalytics): string {
  const headers = [
    'Demo ID',
    'Company',
    'Contact',
    'Email',
    'Industry',
    'Team Size',
    'Priority',
    'Score',
    'Timestamp',
    'Status'
  ]
  
  const rows = analytics.recentDemos.map(demo => [
    demo.id,
    demo.company,
    demo.contact,
    demo.email,
    demo.industry,
    demo.teamSize,
    demo.priority,
    demo.score.toString(),
    demo.timestamp,
    demo.status
  ])
  
  return [headers, ...rows].map(row => row.join(',')).join('\n')
}

/**
 * POST /api/analytics/demos
 * Updates demo status or adds new analytics data
 */
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    console.log('📊 Analytics update:', data)
    
    // In production, this would update your database
    // await updateDemoAnalytics(data)
    
    return NextResponse.json({
      success: true,
      message: 'Analytics data updated successfully',
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('❌ Analytics update error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update analytics data' },
      { status: 500 }
    )
  }
} 