import { NextRequest, NextResponse } from 'next/server'

// Mock user profile storage (in production, use database)
interface UserProfile {
  email: string
  sessionId?: string
  demoHistory: {
    id: string
    userName: string
    companyName: string
    phoneNumber?: string
    teamSize: string
    industryType: string
    specificInterests: string[]
    urgency: string
    timestamp: string
    status: string
    leadScore?: number
    priority?: string
  }[]
  preferences: {
    preferredContactMethod?: 'email' | 'phone'
    timezone?: string
    bestTimeToCall?: string
  }
  lastActive: string
  totalDemoRequests: number
}

// Mock storage (replace with database in production)
const userProfiles = new Map<string, UserProfile>()

/**
 * GET /api/user-profile?email=user@example.com
 * Retrieves user profile and demo history
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const sessionId = searchParams.get('sessionId')
    
    if (!email && !sessionId) {
      return NextResponse.json(
        { error: 'Email or sessionId required' },
        { status: 400 }
      )
    }
    
    // Find user profile by email or sessionId
    let userProfile: UserProfile | undefined
    
    if (email) {
      userProfile = userProfiles.get(email.toLowerCase())
    } else if (sessionId) {
      // Find by sessionId (fallback)
      for (const [userEmail, profile] of userProfiles.entries()) {
        if (profile.sessionId === sessionId || 
            profile.demoHistory.some(demo => demo.id.includes(sessionId))) {
          userProfile = profile
          break
        }
      }
    }
    
    if (!userProfile) {
      return NextResponse.json({
        success: true,
        profile: null,
        message: 'No previous demo history found'
      })
    }
    
    // Get latest demo data for pre-filling
    const latestDemo = userProfile.demoHistory[userProfile.demoHistory.length - 1]
    
    console.log('👤 USER PROFILE RETRIEVED:', {
      email: userProfile.email,
      totalDemos: userProfile.totalDemoRequests,
      latestDemo: latestDemo?.companyName
    })
    
    return NextResponse.json({
      success: true,
      profile: userProfile,
      prefillData: latestDemo ? {
        userName: latestDemo.userName,
        companyName: latestDemo.companyName,
        phoneNumber: latestDemo.phoneNumber,
        teamSize: latestDemo.teamSize,
        industryType: latestDemo.industryType,
        specificInterests: latestDemo.specificInterests,
        urgency: latestDemo.urgency
      } : null,
      isReturningUser: userProfile.totalDemoRequests > 1
    })
    
  } catch (error) {
    console.error('❌ User profile retrieval error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve user profile' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/user-profile
 * Creates or updates user profile with demo data
 */
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    const {
      email,
      sessionId,
      demoData,
      preferences
    } = data
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }
    
    const userEmail = email.toLowerCase()
    const currentTime = new Date().toISOString()
    
    // Get existing profile or create new one
    let userProfile = userProfiles.get(userEmail) || {
      email: userEmail,
      demoHistory: [],
      preferences: {},
      lastActive: currentTime,
      totalDemoRequests: 0
    }
    
    // Update session ID if provided
    if (sessionId) {
      userProfile.sessionId = sessionId
    }
    
    // Add demo data if provided
    if (demoData) {
      const demoRecord = {
        id: demoData.id || `demo_${Date.now()}`,
        userName: demoData.userName,
        companyName: demoData.companyName,
        phoneNumber: demoData.phoneNumber,
        teamSize: demoData.teamSize,
        industryType: demoData.industryType,
        specificInterests: demoData.specificInterests || [],
        urgency: demoData.urgency,
        timestamp: currentTime,
        status: demoData.status || 'pending',
        leadScore: demoData.leadScore,
        priority: demoData.priority
      }
      
      userProfile.demoHistory.push(demoRecord)
      userProfile.totalDemoRequests++
    }
    
    // Update preferences if provided
    if (preferences) {
      userProfile.preferences = {
        ...userProfile.preferences,
        ...preferences
      }
    }
    
    // Update last active time
    userProfile.lastActive = currentTime
    
    // Save to storage
    userProfiles.set(userEmail, userProfile)
    
    console.log('👤 USER PROFILE UPDATED:', {
      email: userEmail,
      totalDemos: userProfile.totalDemoRequests,
      isNewUser: userProfile.totalDemoRequests === 1
    })
    
    return NextResponse.json({
      success: true,
      profile: userProfile,
      isNewUser: userProfile.totalDemoRequests === 1,
      message: 'User profile updated successfully'
    })
    
  } catch (error) {
    console.error('❌ User profile update error:', error)
    return NextResponse.json(
      { error: 'Failed to update user profile' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/user-profile
 * Updates demo status or adds notes
 */
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()
    
    const {
      email,
      demoId,
      updates
    } = data
    
    if (!email || !demoId) {
      return NextResponse.json(
        { error: 'Email and demoId are required' },
        { status: 400 }
      )
    }
    
    const userEmail = email.toLowerCase()
    const userProfile = userProfiles.get(userEmail)
    
    if (!userProfile) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      )
    }
    
    // Find and update the demo record
    const demoIndex = userProfile.demoHistory.findIndex(demo => demo.id === demoId)
    
    if (demoIndex === -1) {
      return NextResponse.json(
        { error: 'Demo record not found' },
        { status: 404 }
      )
    }
    
    // Apply updates
    userProfile.demoHistory[demoIndex] = {
      ...userProfile.demoHistory[demoIndex],
      ...updates
    }
    
    userProfile.lastActive = new Date().toISOString()
    
    // Save updated profile
    userProfiles.set(userEmail, userProfile)
    
    console.log('👤 DEMO RECORD UPDATED:', {
      email: userEmail,
      demoId,
      updates
    })
    
    return NextResponse.json({
      success: true,
      updatedDemo: userProfile.demoHistory[demoIndex],
      message: 'Demo record updated successfully'
    })
    
  } catch (error) {
    console.error('❌ Demo record update error:', error)
    return NextResponse.json(
      { error: 'Failed to update demo record' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/user-profile?email=user@example.com
 * Deletes user profile (for privacy/GDPR compliance)
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }
    
    const userEmail = email.toLowerCase()
    const deleted = userProfiles.delete(userEmail)
    
    console.log('👤 USER PROFILE DELETED:', {
      email: userEmail,
      success: deleted
    })
    
    return NextResponse.json({
      success: deleted,
      message: deleted ? 'User profile deleted successfully' : 'User profile not found'
    })
    
  } catch (error) {
    console.error('❌ User profile deletion error:', error)
    return NextResponse.json(
      { error: 'Failed to delete user profile' },
      { status: 500 }
    )
  }
}

/**
 * Utility function to get all user profiles (admin only)
 */
export async function getAllUserProfiles(): Promise<UserProfile[]> {
  return Array.from(userProfiles.values())
}

/**
 * Utility function to search user profiles
 */
export function searchUserProfiles(query: string): UserProfile[] {
  const searchTerm = query.toLowerCase()
  return Array.from(userProfiles.values()).filter(profile => 
    profile.email.toLowerCase().includes(searchTerm) ||
    profile.demoHistory.some(demo => 
      demo.userName.toLowerCase().includes(searchTerm) ||
      demo.companyName.toLowerCase().includes(searchTerm)
    )
  )
} 