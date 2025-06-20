import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'

// Google Sheets configuration
const SHEET_ID = process.env.GOOGLE_SHEET_ID || '1234567890abcdef' // Replace with actual sheet ID
const SHEET_NAME = 'Demo Requests' // Name of the sheet tab

// Service account credentials (stored in environment variables)
const GOOGLE_SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n')

interface DemoData {
  name: string
  email: string
  company: string
  teamSize: string
  industry: string
  interests: string[]
  timing: string
  timestamp: string
  source: string
}

/**
 * Authenticates with Google Sheets API using service account
 */
async function getGoogleSheetsAuth() {
  if (!GOOGLE_SERVICE_ACCOUNT_EMAIL || !GOOGLE_PRIVATE_KEY) {
    throw new Error('Google Service Account credentials not configured')
  }

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: GOOGLE_PRIVATE_KEY,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })

  return auth
}

/**
 * Initializes Google Sheets with headers if needed
 */
async function initializeSheet(sheets: any, spreadsheetId: string) {
  try {
    // Check if sheet exists and has headers
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${SHEET_NAME}!A1:K1`,
    })

    // If no data or wrong headers, set up the sheet
    if (!response.data.values || response.data.values.length === 0) {
      const headers = [
        'Timestamp',
        'Name',
        'Email',
        'Company',
        'Team Size',
        'Industry',
        'Interests',
        'Timing',
        'Source',
        'Status',
        'Notes'
      ]

      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${SHEET_NAME}!A1:K1`,
        valueInputOption: 'RAW',
        requestBody: {
          values: [headers],
        },
      })

      console.log('✅ Google Sheet initialized with headers')
    }
  } catch (error) {
    console.error('❌ Error initializing sheet:', error)
    // If sheet doesn't exist, create it
    try {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [
            {
              addSheet: {
                properties: {
                  title: SHEET_NAME,
                },
              },
            },
          ],
        },
      })
      
      // Now add headers
      await initializeSheet(sheets, spreadsheetId)
    } catch (createError) {
      console.error('❌ Error creating sheet:', createError)
      throw createError
    }
  }
}

/**
 * Syncs demo data to Google Sheets
 */
async function syncToGoogleSheets(demoData: DemoData): Promise<boolean> {
  try {
    const auth = await getGoogleSheetsAuth()
    const sheets = google.sheets({ version: 'v4', auth })

    // Initialize sheet if needed
    await initializeSheet(sheets, SHEET_ID)

    // Prepare row data
    const rowData = [
      demoData.timestamp,
      demoData.name,
      demoData.email,
      demoData.company,
      demoData.teamSize,
      demoData.industry,
      demoData.interests.join(', '),
      demoData.timing,
      demoData.source || 'Chatbot',
      'New Lead',
      `Demo requested via ${demoData.source || 'chatbot'}`
    ]

    // Append data to sheet
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_NAME}!A:K`,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [rowData],
      },
    })

    console.log('✅ Demo data synced to Google Sheets:', {
      updatedCells: response.data.updates?.updatedCells,
      updatedRange: response.data.updates?.updatedRange,
    })

    return true
  } catch (error) {
    console.error('❌ Error syncing to Google Sheets:', error)
    throw error
  }
}

/**
 * Retry mechanism for failed sync attempts
 */
async function syncWithRetry(demoData: DemoData, maxRetries = 3): Promise<boolean> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`📊 Attempting to sync to Google Sheets (attempt ${attempt}/${maxRetries})`)
      const success = await syncToGoogleSheets(demoData)
      
      if (success) {
        console.log(`✅ Successfully synced to Google Sheets on attempt ${attempt}`)
        return true
      }
    } catch (error) {
      console.error(`❌ Sync attempt ${attempt} failed:`, error)
      
      if (attempt === maxRetries) {
        console.error('❌ All sync attempts failed')
        throw error
      }
      
      // Wait before retrying (exponential backoff)
      const delay = Math.pow(2, attempt) * 1000 // 2s, 4s, 8s
      console.log(`⏳ Waiting ${delay}ms before retry...`)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
  
  return false
}

/**
 * POST /api/sync-to-sheet
 * Syncs demo request data to Google Sheets
 */
export async function POST(request: NextRequest) {
  try {
    const demoData: DemoData = await request.json()
    
    // Validate required fields
    if (!demoData.name || !demoData.email || !demoData.company) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, or company' },
        { status: 400 }
      )
    }

    // Add timestamp if not provided
    if (!demoData.timestamp) {
      demoData.timestamp = new Date().toISOString()
    }

    console.log('📊 Syncing demo data to Google Sheets:', {
      name: demoData.name,
      email: demoData.email,
      company: demoData.company,
      timestamp: demoData.timestamp
    })

    // Check if Google Sheets is configured
    if (!GOOGLE_SERVICE_ACCOUNT_EMAIL || !GOOGLE_PRIVATE_KEY || !SHEET_ID) {
      console.warn('⚠️ Google Sheets not configured - skipping sync')
      return NextResponse.json({
        success: false,
        message: 'Google Sheets integration not configured',
        configured: false
      })
    }

    // Attempt to sync with retry mechanism
    const success = await syncWithRetry(demoData)

    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Demo data successfully synced to Google Sheets',
        timestamp: demoData.timestamp,
        sheetId: SHEET_ID
      })
    } else {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to sync to Google Sheets after retries' 
        },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('❌ Sync to Google Sheets error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error during Google Sheets sync',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/sync-to-sheet
 * Health check and configuration status
 */
export async function GET() {
  const isConfigured = !!(GOOGLE_SERVICE_ACCOUNT_EMAIL && GOOGLE_PRIVATE_KEY && SHEET_ID)
  
  return NextResponse.json({
    service: 'Google Sheets Sync',
    configured: isConfigured,
    sheetId: SHEET_ID ? `${SHEET_ID.substring(0, 8)}...` : 'Not configured',
    timestamp: new Date().toISOString()
  })
} 