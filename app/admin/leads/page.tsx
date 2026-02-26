'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card'
import styles from './page.module.css'
import { Badge } from '../../../components/ui/badge'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs'

interface DemoLead {
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
  interests: string[]
  urgency: string
  followedUp: boolean
  notes?: string
  reasons?: string[]
}

interface AnalyticsData {
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
  recentDemos: DemoLead[]
  hotLeads: DemoLead[]
}

export default function AdminLeadsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [filteredLeads, setFilteredLeads] = useState<DemoLead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [industryFilter, setIndustryFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('timestamp')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  // Fetch analytics data
  useEffect(() => {
    fetchAnalytics()
  }, [])

  // Apply filters
  useEffect(() => {
    if (analytics) {
      let filtered = [...analytics.recentDemos]
      
      // Search filter
      if (searchTerm) {
        filtered = filtered.filter(lead => 
          lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }
      
      // Industry filter
      if (industryFilter !== 'all') {
        filtered = filtered.filter(lead => lead.industry === industryFilter)
      }
      
      // Priority filter
      if (priorityFilter !== 'all') {
        filtered = filtered.filter(lead => lead.priority === priorityFilter)
      }
      
      // Status filter
      if (statusFilter !== 'all') {
        filtered = filtered.filter(lead => lead.status === statusFilter)
      }
      
      // Sort
      filtered.sort((a, b) => {
        let aValue: any = a[sortBy as keyof DemoLead]
        let bValue: any = b[sortBy as keyof DemoLead]
        
        if (sortBy === 'timestamp') {
          aValue = new Date(aValue).getTime()
          bValue = new Date(bValue).getTime()
        } else if (sortBy === 'score') {
          aValue = Number(aValue)
          bValue = Number(bValue)
        }
        
        if (sortOrder === 'asc') {
          return aValue > bValue ? 1 : -1
        } else {
          return aValue < bValue ? 1 : -1
        }
      })
      
      setFilteredLeads(filtered)
    }
  }, [analytics, searchTerm, industryFilter, priorityFilter, statusFilter, sortBy, sortOrder])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/analytics/demos')
      const result = await response.json()
      
      if (result.success) {
        setAnalytics(result.data)
      } else {
        setError('Failed to load analytics data')
      }
    } catch (err) {
      setError('Error fetching analytics')
      console.error('Analytics fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const getPriorityBadge = (priority: string) => {
    const variants = {
      'HOT': 'destructive',
      'HIGH': 'default',
      'MEDIUM': 'secondary',
      'LOW': 'outline'
    } as const
    
    const emojis = {
      'HOT': '🔥',
      'HIGH': '⚡',
      'MEDIUM': '📈',
      'LOW': '📝'
    }
    
    return (
      <Badge variant={variants[priority as keyof typeof variants] || 'outline'}>
        {emojis[priority as keyof typeof emojis]} {priority}
      </Badge>
    )
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      'Pending': 'outline',
      'Scheduled': 'default',
      'Completed': 'secondary',
      'Cancelled': 'destructive'
    } as const
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {status}
      </Badge>
    )
  }

  const exportToCSV = () => {
    if (!analytics) return
    
    const headers = [
      'Timestamp',
      'Company',
      'Contact',
      'Email',
      'Industry',
      'Team Size',
      'Priority',
      'Score',
      'Status',
      'Urgency',
      'Interests',
      'Followed Up'
    ]
    
    const rows = filteredLeads.map(lead => [
      new Date(lead.timestamp).toLocaleString(),
      lead.company,
      lead.contact,
      lead.email,
      lead.industry,
      lead.teamSize,
      lead.priority,
      lead.score.toString(),
      lead.status,
      lead.urgency,
      lead.interests?.join('; ') || '',
      lead.followedUp ? 'Yes' : 'No'
    ])
    
    const csvContent = [headers, ...rows].map(row => 
      row.map(cell => `"${cell}"`).join(',')
    ).join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `constructify-leads-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              <h3 className="text-lg font-semibold">Error Loading Data</h3>
              <p>{error}</p>
              <Button onClick={fetchAnalytics} className="mt-4">
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Demo Analytics & Lead Tracker</h1>
          <p className="text-muted-foreground">
            Track demo performance and manage leads with Excel-style functionality
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportToCSV} variant="outline">
            📊 Export CSV
          </Button>
          <Button onClick={fetchAnalytics}>
            🔄 Refresh
          </Button>
        </div>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList>
          <TabsTrigger value="dashboard">📊 Dashboard</TabsTrigger>
          <TabsTrigger value="leads">📋 Lead Tracker</TabsTrigger>
          <TabsTrigger value="hot-leads">🔥 Hot Leads</TabsTrigger>
          <TabsTrigger value="analytics">📈 Analytics</TabsTrigger>
        </TabsList>

        {/* Dashboard Overview */}
        <TabsContent value="dashboard" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Demos Today</CardTitle>
                <span className="text-2xl">📅</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics?.totalDemos.daily}</div>
                <p className="text-xs text-muted-foreground">
                  +{Math.floor(Math.random() * 20)}% from yesterday
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">This Week</CardTitle>
                <span className="text-2xl">📊</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics?.totalDemos.weekly}</div>
                <p className="text-xs text-muted-foreground">
                  +{Math.floor(Math.random() * 15)}% from last week
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                <span className="text-2xl">💰</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics?.conversionRate.demoToTrial}%</div>
                <p className="text-xs text-muted-foreground">
                  Demo to trial conversion
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Hot Leads</CardTitle>
                <span className="text-2xl">🔥</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics?.hotLeads.length}</div>
                <p className="text-xs text-muted-foreground">
                  Require immediate follow-up
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {analytics && (
              <style
                dangerouslySetInnerHTML={{
                  __html: [
                    ...analytics.breakdown.byIndustry.map((item, i) =>
                      `[data-progress="industry-${i}"]{--progress-width:${item.percentage}%}`
                    ),
                    ...analytics.breakdown.byTeamSize.map((item, i) =>
                      `[data-progress="teamsize-${i}"]{--progress-width:${item.percentage}%}`
                    ),
                    ...analytics.breakdown.byPriority.map((item, i) =>
                      `[data-progress="priority-${i}"]{--progress-width:${item.percentage}%}`
                    ),
                  ].join(''),
                }}
              />
            )}
            <Card>
              <CardHeader>
                <CardTitle>Industry Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics?.breakdown.byIndustry.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{item.industry}</span>
                      <div className="flex items-center gap-2">
                        <div className={`${styles.progressTrack} ${styles.progressTrackIndustry}`}>
                          <div className={styles.progressFillIndustry} data-progress={`industry-${index}`} />
                        </div>
                        <span className="text-sm font-medium">{item.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Trigger Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics?.triggerMessages.slice(0, 5).map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm flex-1">{item.message}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{item.count}</Badge>
                        <span className="text-sm text-green-600">{item.conversionRate}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Lead Tracker */}
        <TabsContent value="leads" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Lead Filters & Search</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                <Input
                  placeholder="Search leads..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                
                <Select value={industryFilter} onValueChange={setIndustryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Industries</SelectItem>
                    <SelectItem value="Commercial">Commercial</SelectItem>
                    <SelectItem value="Residential">Residential</SelectItem>
                    <SelectItem value="Industrial">Industrial</SelectItem>
                    <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="HOT">🔥 Hot</SelectItem>
                    <SelectItem value="HIGH">⚡ High</SelectItem>
                    <SelectItem value="MEDIUM">📈 Medium</SelectItem>
                    <SelectItem value="LOW">📝 Low</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Scheduled">Scheduled</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="timestamp">Date</SelectItem>
                    <SelectItem value="score">Score</SelectItem>
                    <SelectItem value="company">Company</SelectItem>
                    <SelectItem value="priority">Priority</SelectItem>
                  </SelectContent>
                </Select>

                <Button 
                  variant="outline" 
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                >
                  {sortOrder === 'asc' ? '↑' : '↓'} {sortOrder.toUpperCase()}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Excel-Style Lead Table */}
          <Card>
            <CardHeader>
              <CardTitle>Lead Tracker ({filteredLeads.length} leads)</CardTitle>
              <CardDescription>
                Excel-style lead management with sorting and filtering
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Industry</TableHead>
                      <TableHead>Team Size</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Followed Up</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLeads.map((lead) => (
                      <TableRow key={lead.id} className="hover:bg-muted/50">
                        <TableCell className="font-mono text-xs">
                          {new Date(lead.timestamp).toLocaleString()}
                        </TableCell>
                        <TableCell className="font-medium">{lead.company}</TableCell>
                        <TableCell>{lead.contact}</TableCell>
                        <TableCell>
                          <a href={`mailto:${lead.email}`} className="text-blue-600 hover:underline">
                            {lead.email}
                          </a>
                        </TableCell>
                        <TableCell>{lead.industry}</TableCell>
                        <TableCell className="text-sm">{lead.teamSize}</TableCell>
                        <TableCell>{getPriorityBadge(lead.priority)}</TableCell>
                        <TableCell>
                          <Badge variant={lead.score >= 70 ? 'default' : lead.score >= 40 ? 'secondary' : 'outline'}>
                            {lead.score}
                          </Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(lead.status)}</TableCell>
                        <TableCell>
                          <Badge variant={lead.followedUp ? 'default' : 'destructive'}>
                            {lead.followedUp ? '✅' : '❌'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Hot Leads */}
        <TabsContent value="hot-leads" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🔥 Hot Leads Requiring Immediate Action
                <Badge variant="destructive">{analytics?.hotLeads.filter(lead => !lead.followedUp).length} pending</Badge>
              </CardTitle>
              <CardDescription>
                High-priority leads that need follow-up within 1 hour
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics?.hotLeads.map((lead) => (
                  <Card key={lead.id} className={`border-l-4 ${lead.followedUp ? 'border-l-green-500' : 'border-l-red-500'}`}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{lead.company}</h3>
                            <Badge variant="destructive">Score: {lead.score}</Badge>
                            <Badge variant={lead.followedUp ? 'default' : 'destructive'}>
                              {lead.followedUp ? '✅ Followed Up' : '❌ Pending'}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {lead.contact} • {lead.email}
                          </p>
                          <div className="text-sm">
                            <strong>Why this is a hot lead:</strong>
                            <ul className="list-disc list-inside mt-1 space-y-1">
                              {lead.reasons?.map((reason: string, index: number) => (
                                <li key={index}>{reason}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        <div className="text-right text-sm text-muted-foreground">
                          {new Date(lead.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Team Size Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics?.breakdown.byTeamSize.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{item.size}</span>
                      <div className="flex items-center gap-2">
                        <div className={`${styles.progressTrack} ${styles.progressTrackTeamSize}`}>
                          <div className={styles.progressFillTeamSize} data-progress={`teamsize-${index}`} />
                        </div>
                        <span className="text-sm font-medium">{item.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Priority Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics?.breakdown.byPriority.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{getPriorityBadge(item.priority)}</span>
                      <div className="flex items-center gap-2">
                        <div className={`${styles.progressTrack} ${styles.progressTrackPriority}`}>
                          <div className={styles.progressFillPriority} data-progress={`priority-${index}`} />
                        </div>
                        <span className="text-sm font-medium">{item.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 