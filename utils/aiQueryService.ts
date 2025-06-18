// 🤖 AI-Powered Natural Language Query Service for Construction Management
// Handles complex employee data queries with semantic understanding

import { 
  EmployeeProfile, 
  findEmployeesByCertification,
  findEmployeesBySkillAndLocation,
  findEmployeesWithRecentDrugTests,
  findEquipmentCertifiedEmployees,
  findExpiringCertifications,
  getSafetyComplianceStatus,
  getProjectStaffingRecommendations
} from '@/components/Google Auth/userService';

// Query types that the AI can handle
export type QueryType = 
  | 'certification_lookup'
  | 'equipment_certification' 
  | 'drug_test_status'
  | 'skill_location_search'
  | 'safety_compliance'
  | 'project_staffing'
  | 'payroll_inquiry'           // NEW: Payroll and compensation queries
  | 'banking_info'              // NEW: Banking and financial info
  | 'expense_tracking'          // NEW: Expense and reimbursement queries
  | 'financial_analytics'       // NEW: Financial metrics and analytics
  | 'contractor_payments'       // NEW: Vendor/contractor payment info
  | 'benefits_inquiry'          // NEW: Benefits and deduction queries
  | 'general_employee_info';

// AI Query Interface
export interface QueryResult {
  success: boolean;
  data: any[];
  confidence: number;
  queryType: QueryType;
  interpretation: string;
  suggestions?: string[];
}

// 🧠 Natural Language Query Parser
export class AIQueryParser {
  
  // Enhanced keyword mappings for financial queries
  private static readonly KEYWORD_MAPPINGS = {
    // Existing mappings...
    certification: ['cert', 'certification', 'license', 'qualified', 'certified'],
    equipment: ['equipment', 'machinery', 'tool', 'crane', 'excavator', 'forklift'],
    drug_test: ['drug test', 'screening', 'clean', 'substance'],
    safety: ['safety', 'osha', 'incident', 'accident', 'compliance'],
    location: ['location', 'site', 'area', 'region', 'city', 'state'],
    skill: ['skill', 'trade', 'experience', 'level', 'apprentice', 'journeyman', 'master'],
    
    // NEW: Financial and banking keywords
    payroll: ['payroll', 'pay', 'salary', 'wage', 'compensation', 'earnings'],
    banking: ['bank', 'account', 'routing', 'deposit', 'direct deposit', 'payment method'],
    expense: ['expense', 'reimbursement', 'receipt', 'corporate card', 'spending'],
    financial: ['financial', 'money', 'income', 'ytd', 'year to date', 'gross', 'net'],
    overtime: ['overtime', 'ot', 'double time', 'time and a half'],
    bonus: ['bonus', 'incentive', 'performance', 'safety bonus', 'completion'],
    deduction: ['deduction', 'withholding', 'insurance', 'benefits', 'union dues'],
    contractor: ['contractor', 'vendor', '1099', 'invoice', 'payment terms'],
    benefits: ['benefits', '401k', 'retirement', 'health insurance', 'vacation'],
    tax: ['tax', 'w4', 'withholding', 'federal', 'state', 'fica']
  };

  // Parse natural language query to determine intent and extract parameters
  public static parseQuery(query: string): { type: QueryType; confidence: number; parameters: any } {
    const lowerQuery = query.toLowerCase();
    
    // Enhanced pattern matching for financial queries
    const patterns = [
      // Existing patterns...
      { 
        regex: /(?:who|which employees?|find|show).*(has|have|with).*(cert|certification|license)/i,
        type: 'certification_lookup' as QueryType,
        confidence: 0.9
      },
      { 
        regex: /(?:who|which).*(certified|qualified).*(equipment|crane|forklift|excavator)/i,
        type: 'equipment_certification' as QueryType,
        confidence: 0.85
      },
      { 
        regex: /(?:drug test|screening).*(recent|last|within|passed|clean)/i,
        type: 'drug_test_status' as QueryType,
        confidence: 0.8
      },
      
      // NEW: Financial query patterns
      { 
        regex: /(?:what|how much|show|find).*(pay|salary|wage|earning|compensation)/i,
        type: 'payroll_inquiry' as QueryType,
        confidence: 0.9
      },
      { 
        regex: /(?:bank|banking|account|direct deposit|payment method)/i,
        type: 'banking_info' as QueryType,
        confidence: 0.85
      },
      { 
        regex: /(?:expense|reimbursement|receipt|corporate card|spending)/i,
        type: 'expense_tracking' as QueryType,
        confidence: 0.8
      },
      { 
        regex: /(?:overtime|ot|double time|time and a half)/i,
        type: 'payroll_inquiry' as QueryType,
        confidence: 0.85
      },
      { 
        regex: /(?:ytd|year to date|gross|net|financial|analytics)/i,
        type: 'financial_analytics' as QueryType,
        confidence: 0.8
      },
      { 
        regex: /(?:contractor|vendor|1099|invoice|payment terms)/i,
        type: 'contractor_payments' as QueryType,
        confidence: 0.8
      },
      { 
        regex: /(?:benefits|401k|retirement|health insurance|vacation|deduction)/i,
        type: 'benefits_inquiry' as QueryType,
        confidence: 0.8
      }
    ];

    // Find the best matching pattern
    for (const pattern of patterns) {
      if (pattern.regex.test(query)) {
        return {
          type: pattern.type,
          confidence: pattern.confidence,
          parameters: this.extractParameters(query, pattern.type)
        };
      }
    }

    // Default fallback
    return {
      type: 'general_employee_info',
      confidence: 0.3,
      parameters: {}
    };
  }
  
  private static extractParameters(query: string, type: QueryType): any {
    const lowerQuery = query.toLowerCase();
    const params: any = {};

    // Enhanced parameter extraction for financial queries
    switch (type) {
      case 'payroll_inquiry':
        // Extract employee names, pay periods, amounts
        const nameMatch = lowerQuery.match(/(?:for|of)\s+([a-z]+(?:\s+[a-z]+)?)/);
        if (nameMatch) params.employeeName = nameMatch[1];
        
        const periodMatch = lowerQuery.match(/(last|current|this)\s+(week|month|year|pay period)/);
        if (periodMatch) params.period = `${periodMatch[1]} ${periodMatch[2]}`;
        
        const amountMatch = lowerQuery.match(/(\$[\d,]+(?:\.\d{2})?)/);
        if (amountMatch) params.amount = amountMatch[1];
        break;

      case 'banking_info':
        // Extract bank names, account types
        const bankMatch = lowerQuery.match(/(bank of america|chase|wells fargo|citibank|[a-z\s]+bank)/);
        if (bankMatch) params.bankName = bankMatch[1];
        
        const accountTypeMatch = lowerQuery.match(/(checking|savings|payroll card)/);
        if (accountTypeMatch) params.accountType = accountTypeMatch[1];
        break;

      case 'expense_tracking':
        // Extract expense categories, amounts, dates
        const categoryMatch = lowerQuery.match(/(fuel|materials|tools|travel|meals|equipment)/);
        if (categoryMatch) params.category = categoryMatch[1];
        
        const statusMatch = lowerQuery.match(/(pending|approved|reimbursed|denied)/);
        if (statusMatch) params.status = statusMatch[1];
        break;

      case 'financial_analytics':
        // Extract time periods, metrics
        const metricMatch = lowerQuery.match(/(gross|net|overtime|bonus|average)/);
        if (metricMatch) params.metric = metricMatch[1];
        
        const timeframeMatch = lowerQuery.match(/(ytd|year to date|monthly|weekly|quarterly)/);
        if (timeframeMatch) params.timeframe = timeframeMatch[1];
        break;

      case 'contractor_payments':
        // Extract business info, payment terms
        const businessMatch = lowerQuery.match(/([a-z\s]+(?:llc|inc|corp|company))/);
        if (businessMatch) params.businessName = businessMatch[1];
        
        const termsMatch = lowerQuery.match(/(net 15|net 30|net 45|net 60|due on receipt)/);
        if (termsMatch) params.paymentTerms = termsMatch[1];
        break;

      case 'benefits_inquiry':
        // Extract benefit types
        const benefitMatch = lowerQuery.match(/(401k|retirement|health|dental|vision|vacation|sick)/);
        if (benefitMatch) params.benefitType = benefitMatch[1];
        break;

      // Existing parameter extraction...
      case 'certification_lookup':
        const certMatch = lowerQuery.match(/(osha|safety|equipment|trade)\s*(?:certification|cert|license)?/);
        if (certMatch) params.certificationType = certMatch[1];
        
        const certNameMatch = lowerQuery.match(/(?:with|has|have)\s+([a-z0-9\s]+)(?:\s+cert|\s+certification|\s+license)?/);
        if (certNameMatch) params.certificationName = certNameMatch[1].trim();
        break;

      case 'equipment_certification':
        const equipMatch = lowerQuery.match(/(crane|forklift|excavator|bulldozer|loader|equipment)/);
        if (equipMatch) params.equipmentType = equipMatch[1];
        break;

      case 'skill_location_search':
        const skillMatch = lowerQuery.match(/(apprentice|journeyman|master|supervisor)/);
        if (skillMatch) params.skillLevel = skillMatch[1];
        
        const locationMatch = lowerQuery.match(/(?:in|at|near)\s+([a-z\s]+(?:,\s*[a-z]{2})?)/);
        if (locationMatch) params.location = locationMatch[1];
        break;
    }

    return params;
  }
}

// 🤖 Main AI Query Service
export class AIQueryService {
  
  // Enhanced query examples with financial scenarios
  public static readonly EXAMPLE_QUERIES = [
    // Existing examples...
    "When was Juan's last OSHA certification?",
    "Who is certified to operate the crane on site 3?",
    "Find all employees with recent drug tests in California",
    "Which journeyman electricians are available in Texas?",
    
    // NEW: Financial query examples
    "What is Maria's current hourly rate?",
    "Show me John's year-to-date earnings",
    "Who has direct deposit set up with Chase Bank?",
    "Find employees with pending expense reimbursements",
    "What's the average overtime pay this month?",
    "Show contractors requiring 1099 forms",
    "Who is enrolled in the 401k plan?",
    "What are Sarah's current payroll deductions?",
    "Find employees with corporate credit cards",
    "Show me all bonus payments this quarter",
    "Which contractors have Net 30 payment terms?",
    "Who has health insurance deductions?",
    "What's the total payroll for this pay period?",
    "Find employees with savings account direct deposit splits"
  ];

  // Process natural language query
  static async processQuery(query: string): Promise<QueryResult> {
    console.log(`🤖 AI Processing Financial Query: "${query}"`);
    
    const parsed = AIQueryParser.parseQuery(query);
    console.log(`🎯 Query Type: ${parsed.type}, Confidence: ${parsed.confidence}`);
    console.log(`📊 Parameters:`, parsed.parameters);

    try {
      let result: QueryResult;

      switch (parsed.type) {
        // NEW: Financial query handlers
        case 'payroll_inquiry':
          result = await this.handlePayrollQuery(parsed.parameters);
          break;
          
        case 'banking_info':
          result = await this.handleBankingQuery(parsed.parameters);
          break;
          
        case 'expense_tracking':
          result = await this.handleExpenseQuery(parsed.parameters);
          break;
          
        case 'financial_analytics':
          result = await this.handleFinancialAnalyticsQuery(parsed.parameters);
          break;
          
        case 'contractor_payments':
          result = await this.handleContractorPaymentQuery(parsed.parameters);
          break;
          
        case 'benefits_inquiry':
          result = await this.handleBenefitsQuery(parsed.parameters);
          break;

        // Existing handlers...
        case 'certification_lookup':
          result = await this.handleCertificationQuery(parsed.parameters);
          break;
          
        case 'equipment_certification':
          result = await this.handleEquipmentQuery(parsed.parameters);
          break;
          
        case 'drug_test_status':
          result = await this.handleDrugTestQuery(parsed.parameters);
          break;
          
        case 'skill_location_search':
          result = await this.handleSkillLocationQuery(parsed.parameters);
          break;
          
        default:
          result = await this.handleGeneralQuery(parsed.parameters);
      }

      result.queryType = parsed.type;
      result.confidence = parsed.confidence;
      
      console.log(`✅ Query processed successfully:`, result);
      return result;
      
    } catch (error) {
      console.error(`❌ Error processing query:`, error);
      return {
        success: false,
        data: [],
        confidence: 0,
        queryType: parsed.type,
        interpretation: `Error processing query: ${error}`,
        suggestions: ['Please try rephrasing your question', 'Check if the employee name is correct']
      };
    }
  }

  // NEW: Financial query handlers
  private static async handlePayrollQuery(params: any): Promise<QueryResult> {
    console.log('💰 Processing payroll query:', params);
    
    // Mock implementation - replace with actual Firestore queries
    const mockResults = [
      {
        employeeName: params.employeeName || "John Smith",
        currentRate: "$28.50/hour",
        ytdGross: "$45,670.00",
        ytdNet: "$34,250.00",
        lastPayPeriod: {
          gross: "$2,280.00",
          net: "$1,710.00",
          hours: 80,
          overtimeHours: 8
        }
      }
    ];

    return {
      success: true,
      data: mockResults,
      confidence: 0.9,
      queryType: 'payroll_inquiry',
      interpretation: `Found payroll information${params.employeeName ? ` for ${params.employeeName}` : ''}`,
      suggestions: ['View detailed pay stub', 'Check overtime calculations', 'Review year-to-date summary']
    };
  }

  private static async handleBankingQuery(params: any): Promise<QueryResult> {
    console.log('🏦 Processing banking query:', params);
    
    const mockResults = [
      {
        employeeName: "Maria Garcia",
        primaryAccount: {
          bankName: params.bankName || "Chase Bank",
          accountType: "Checking",
          isVerified: true,
          depositPercentage: 100
        },
        secondaryAccount: null,
        lastUpdate: "2024-01-15"
      }
    ];

    return {
      success: true,
      data: mockResults,
      confidence: 0.85,
      queryType: 'banking_info',
      interpretation: `Found banking information${params.bankName ? ` for ${params.bankName}` : ''}`,
      suggestions: ['Verify account information', 'Update banking details', 'Set up secondary account']
    };
  }

  private static async handleExpenseQuery(params: any): Promise<QueryResult> {
    console.log('💳 Processing expense query:', params);
    
    const mockResults = [
      {
        employeeName: "David Johnson",
        pendingExpenses: [
          {
            date: "2024-01-20",
            amount: 85.50,
            category: params.category || "Fuel",
            description: "Gas for company truck",
            status: params.status || "Pending"
          }
        ],
        totalPending: "$425.75",
        corporateCard: {
          hasCard: true,
          lastTransaction: "2024-01-19",
          monthlySpending: "$1,250.00"
        }
      }
    ];

    return {
      success: true,
      data: mockResults,
      confidence: 0.8,
      queryType: 'expense_tracking',
      interpretation: `Found expense information${params.category ? ` for ${params.category}` : ''}`,
      suggestions: ['Submit missing receipts', 'Review corporate card usage', 'Check reimbursement status']
    };
  }

  private static async handleFinancialAnalyticsQuery(params: any): Promise<QueryResult> {
    console.log('📊 Processing financial analytics query:', params);
    
    const mockResults = [
      {
        period: params.timeframe || "Year to Date",
        totalPayroll: "$2,450,000",
        averageHourlyRate: "$26.75",
        overtimePercentage: "12.5%",
        topEarners: [
          { name: "Mike Wilson", ytdGross: "$68,500" },
          { name: "Sarah Chen", ytdGross: "$65,200" }
        ],
        metrics: {
          totalHours: 91500,
          overtimeHours: 11440,
          bonusPaid: "$45,000"
        }
      }
    ];

    return {
      success: true,
      data: mockResults,
      confidence: 0.8,
      queryType: 'financial_analytics',
      interpretation: `Generated financial analytics${params.metric ? ` for ${params.metric}` : ''}`,
      suggestions: ['Export detailed report', 'Compare to previous period', 'View department breakdown']
    };
  }

  private static async handleContractorPaymentQuery(params: any): Promise<QueryResult> {
    console.log('🏗️ Processing contractor payment query:', params);
    
    const mockResults = [
      {
        businessName: params.businessName || "ABC Construction LLC",
        paymentTerms: params.paymentTerms || "Net 30",
        requires1099: true,
        w9OnFile: true,
        preferredPaymentMethod: "ACH",
        outstandingInvoices: [
          {
            invoiceNumber: "INV-2024-001",
            amount: "$15,500.00",
            dueDate: "2024-02-15",
            status: "Pending"
          }
        ]
      }
    ];

    return {
      success: true,
      data: mockResults,
      confidence: 0.8,
      queryType: 'contractor_payments',
      interpretation: `Found contractor payment information${params.businessName ? ` for ${params.businessName}` : ''}`,
      suggestions: ['Process pending payments', 'Update W-9 forms', 'Review payment terms']
    };
  }

  private static async handleBenefitsQuery(params: any): Promise<QueryResult> {
    console.log('🎯 Processing benefits query:', params);
    
    const mockResults = [
      {
        employeeName: "Lisa Thompson",
        benefits: {
          health: { enrolled: true, deduction: "$125.00" },
          dental: { enrolled: true, deduction: "$25.00" },
          vision: { enrolled: false, deduction: "$0.00" },
          retirement401k: {
            participating: true,
            contributionPercent: 6,
            employerMatch: 3,
            ytdContribution: "$2,400.00"
          }
        },
        totalDeductions: "$150.00",
        benefitType: params.benefitType
      }
    ];

    return {
      success: true,
      data: mockResults,
      confidence: 0.8,
      queryType: 'benefits_inquiry',
      interpretation: `Found benefits information${params.benefitType ? ` for ${params.benefitType}` : ''}`,
      suggestions: ['Update benefit elections', 'Review 401k contribution', 'Compare plan options']
    };
  }

  // Existing query handlers remain the same...
  private static async handleCertificationQuery(params: any): Promise<QueryResult> {
    console.log('🏅 Processing certification query:', params);
    
    const mockResults = [
      {
        employeeName: "Juan Rodriguez",
        certifications: [
          {
            name: "OSHA 30-Hour Construction",
            type: "Safety",
            issueDate: "2023-03-15",
            expirationDate: "2026-03-15",
            status: "Valid"
          }
        ]
      }
    ];

    return {
      success: true,
      data: mockResults,
      confidence: 0.9,
      queryType: 'certification_lookup',
      interpretation: `Found certification records${params.certificationName ? ` for ${params.certificationName}` : ''}`,
      suggestions: ['Check expiration dates', 'Schedule renewal training', 'Update certification records']
    };
  }

  private static async handleEquipmentQuery(params: any): Promise<QueryResult> {
    console.log('🚜 Processing equipment certification query:', params);
    
    const mockResults = [
      {
        employeeName: "Mike Chen",
        equipmentCertifications: [
          {
            equipment: params.equipmentType || "Crane",
            certification: "Certified Crane Operator",
            level: "Class A",
            expirationDate: "2024-12-31"
          }
        ]
      }
    ];

    return {
      success: true,
      data: mockResults,
      confidence: 0.85,
      queryType: 'equipment_certification',
      interpretation: `Found equipment certifications${params.equipmentType ? ` for ${params.equipmentType}` : ''}`,
      suggestions: ['Verify current certifications', 'Schedule equipment training', 'Check safety compliance']
    };
  }

  private static async handleDrugTestQuery(params: any): Promise<QueryResult> {
    console.log('🧪 Processing drug test query:', params);
    
    const mockResults = [
      {
        employeeName: "Sarah Johnson",
        lastDrugTest: {
          date: "2024-01-10",
          result: "Pass",
          type: "Random"
        },
        nextScheduled: "2024-07-10"
      }
    ];

    return {
      success: true,
      data: mockResults,
      confidence: 0.8,
      queryType: 'drug_test_status',
      interpretation: "Found recent drug test records",
      suggestions: ['Schedule upcoming tests', 'Review compliance status', 'Update safety records']
    };
  }

  private static async handleSkillLocationQuery(params: any): Promise<QueryResult> {
    console.log('🔧 Processing skill/location query:', params);
    
    const mockResults = [
      {
        employeeName: "Robert Wilson",
        skillLevel: params.skillLevel || "Journeyman",
        primaryTrade: "Electrician",
        location: params.location || "Houston, TX",
        availability: "Available"
      }
    ];

    return {
      success: true,
      data: mockResults,
      confidence: 0.75,
      queryType: 'skill_location_search',
      interpretation: `Found skilled workers${params.location ? ` in ${params.location}` : ''}`,
      suggestions: ['Check availability calendar', 'Review skill assessments', 'Contact for assignment']
    };
  }

  private static async handleGeneralQuery(params: any): Promise<QueryResult> {
    console.log('❓ Processing general employee query:', params);
    
    return {
      success: true,
      data: [],
      confidence: 0.3,
      queryType: 'general_employee_info',
      interpretation: "I understand you're looking for employee information, but could you be more specific?",
      suggestions: [
        'Try asking about certifications: "Who has OSHA certification?"',
        'Ask about equipment: "Who can operate the crane?"',
        'Ask about payroll: "What is John\'s hourly rate?"',
        'Ask about banking: "Who has direct deposit with Chase?"',
        'Ask about expenses: "Show pending reimbursements"'
      ]
    };
  }
}

// 🎯 Example Usage Functions
export const exampleQueries = {
  certificationQuery: "When was Juan's last OSHA certification?",
  equipmentQuery: "Who's certified to operate a scissor lift in Colorado?",
  experienceQuery: "Which field techs have more than 5 years of experience and passed a drug test in the last 6 months?",
  safetyQuery: "Show me all employees with expiring safety certifications",
  staffingQuery: "Find qualified electricians available for the downtown project"
};

// Test function for AI queries
export const testAIQueries = async () => {
  console.log('🧪 Testing AI Query System...');
  
  for (const [key, query] of Object.entries(exampleQueries)) {
    console.log(`\n🔍 Testing: ${key}`);
    const result = await AIQueryService.processQuery(query);
    console.log(`✅ Result:`, result);
  }
}; 