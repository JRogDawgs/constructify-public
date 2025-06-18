// 🤖 AI Query Service for Natural Language Employee Data Queries
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
export type AIQueryType = 
  | 'certification_lookup'
  | 'skill_location_search'
  | 'drug_test_status'
  | 'equipment_certification'
  | 'expiring_certifications'
  | 'safety_compliance'
  | 'project_staffing'
  | 'general_employee_search';

// AI Query Interface
export interface AIQuery {
  query: string;
  type?: AIQueryType;
  parameters?: Record<string, any>;
  context?: {
    userId?: string;
    projectId?: string;
    location?: string;
  };
}

// AI Query Response
export interface AIQueryResponse {
  success: boolean;
  data?: any;
  message: string;
  queryType: AIQueryType;
  executionTime: number;
  suggestedActions?: string[];
}

// 🧠 Natural Language Query Parser
export class AIQueryParser {
  
  // Keywords and patterns for different query types
  private static certificationKeywords = [
    'osha', 'certification', 'certified', 'license', 'training', 
    'safety', 'cpr', 'first aid', 'forklift', 'crane'
  ];
  
  private static equipmentKeywords = [
    'scissor lift', 'forklift', 'crane', 'excavator', 'bulldozer', 
    'cherry picker', 'backhoe', 'loader', 'operate', 'operator'
  ];
  
  private static safetyKeywords = [
    'drug test', 'background check', 'safety record', 'incident', 
    'accident', 'violation', 'compliant', 'compliance'
  ];
  
  private static skillKeywords = [
    'apprentice', 'journeyman', 'master', 'supervisor', 'experience',
    'years', 'electrician', 'plumber', 'carpenter', 'welder'
  ];

  // Parse natural language query to determine intent and extract parameters
  static parseQuery(query: string): {
    type: AIQueryType;
    parameters: Record<string, any>;
    confidence: number;
  } {
    const lowerQuery = query.toLowerCase();
    
    // Check for certification queries
    if (this.containsKeywords(lowerQuery, this.certificationKeywords)) {
      return {
        type: 'certification_lookup',
        parameters: this.extractCertificationParams(lowerQuery),
        confidence: 0.8
      };
    }
    
    // Check for equipment certification queries
    if (this.containsKeywords(lowerQuery, this.equipmentKeywords)) {
      return {
        type: 'equipment_certification',
        parameters: this.extractEquipmentParams(lowerQuery),
        confidence: 0.85
      };
    }
    
    // Check for drug test/safety queries
    if (this.containsKeywords(lowerQuery, this.safetyKeywords)) {
      return {
        type: 'drug_test_status',
        parameters: this.extractSafetyParams(lowerQuery),
        confidence: 0.75
      };
    }
    
    // Check for skill/experience queries
    if (this.containsKeywords(lowerQuery, this.skillKeywords)) {
      return {
        type: 'skill_location_search',
        parameters: this.extractSkillParams(lowerQuery),
        confidence: 0.7
      };
    }
    
    // Default to general search
    return {
      type: 'general_employee_search',
      parameters: { searchTerm: query },
      confidence: 0.3
    };
  }
  
  private static containsKeywords(query: string, keywords: string[]): boolean {
    return keywords.some(keyword => query.includes(keyword));
  }
  
  private static extractCertificationParams(query: string): Record<string, any> {
    const params: Record<string, any> = {};
    
    // Extract certification name
    if (query.includes('osha')) {
      params.certificationName = 'OSHA';
      if (query.includes('10')) params.level = '10-hour';
      if (query.includes('30')) params.level = '30-hour';
    }
    
    if (query.includes('cpr')) params.certificationName = 'CPR';
    if (query.includes('first aid')) params.certificationName = 'First Aid';
    
    // Extract person's name if mentioned
    const nameMatch = query.match(/when was (\w+)'s/);
    if (nameMatch) params.employeeName = nameMatch[1];
    
    return params;
  }
  
  private static extractEquipmentParams(query: string): Record<string, any> {
    const params: Record<string, any> = {};
    
    if (query.includes('scissor lift')) params.equipmentType = 'Scissor Lift';
    if (query.includes('forklift')) params.equipmentType = 'Forklift';
    if (query.includes('crane')) params.equipmentType = 'Crane';
    
    // Extract location
    const locationMatch = query.match(/in (\w+)/);
    if (locationMatch) params.location = locationMatch[1];
    
    return params;
  }
  
  private static extractSafetyParams(query: string): Record<string, any> {
    const params: Record<string, any> = {};
    
    // Extract time period
    const monthMatch = query.match(/(\d+)\s*months?/);
    if (monthMatch) params.monthsBack = parseInt(monthMatch[1]);
    
    const yearMatch = query.match(/(\d+)\s*years?/);
    if (yearMatch) params.yearsBack = parseInt(yearMatch[1]);
    
    return params;
  }
  
  private static extractSkillParams(query: string): Record<string, any> {
    const params: Record<string, any> = {};
    
    // Extract experience level
    if (query.includes('more than')) {
      const expMatch = query.match(/more than (\d+)\s*years?/);
      if (expMatch) params.minYearsExperience = parseInt(expMatch[1]);
    }
    
    // Extract skill level
    if (query.includes('apprentice')) params.skillLevel = 'Apprentice';
    if (query.includes('journeyman')) params.skillLevel = 'Journeyman';
    if (query.includes('master')) params.skillLevel = 'Master';
    
    // Extract trade
    if (query.includes('electrician')) params.primaryTrade = 'Electrician';
    if (query.includes('plumber')) params.primaryTrade = 'Plumber';
    if (query.includes('carpenter')) params.primaryTrade = 'Carpenter';
    
    return params;
  }
}

// 🤖 Main AI Query Service
export class AIQueryService {
  
  // Process natural language query
  static async processQuery(query: string, context?: AIQuery['context']): Promise<AIQueryResponse> {
    const startTime = Date.now();
    
    try {
      // Parse the query
      const parsed = AIQueryParser.parseQuery(query);
      
      console.log(`🤖 AI Query: "${query}"`);
      console.log(`🎯 Detected Type: ${parsed.type} (confidence: ${parsed.confidence})`);
      console.log(`📊 Parameters:`, parsed.parameters);
      
      // Route to appropriate function
      let data: any;
      let message: string;
      
      switch (parsed.type) {
        case 'certification_lookup':
          data = await findEmployeesByCertification(
            parsed.parameters.certificationName,
            parsed.parameters.certType
          );
          message = `Found ${data.length} employees with ${parsed.parameters.certificationName} certification`;
          break;
          
        case 'equipment_certification':
          data = await findEquipmentCertifiedEmployees(
            parsed.parameters.equipmentType,
            parsed.parameters.location
          );
          message = `Found ${data.length} employees certified for ${parsed.parameters.equipmentType}`;
          break;
          
        case 'drug_test_status':
          data = await findEmployeesWithRecentDrugTests(
            parsed.parameters.monthsBack || 6
          );
          message = `Found ${data.length} employees with recent drug tests`;
          break;
          
        case 'skill_location_search':
          data = await findEmployeesBySkillAndLocation(
            parsed.parameters.skillLevel || 'Any',
            parsed.parameters.location || 'Any',
            parsed.parameters.primaryTrade
          );
          message = `Found ${data.length} matching employees`;
          break;
          
        case 'expiring_certifications':
          data = await findExpiringCertifications(30);
          message = `Found ${data.length} expiring certifications`;
          break;
          
        default:
          data = [];
          message = `Query type ${parsed.type} not fully implemented yet`;
      }
      
      const executionTime = Date.now() - startTime;
      
      return {
        success: true,
        data,
        message,
        queryType: parsed.type,
        executionTime,
        suggestedActions: this.generateSuggestedActions(parsed.type, data)
      };
      
    } catch (error) {
      console.error('❌ AI Query Error:', error);
      
      return {
        success: false,
        message: `Error processing query: ${error}`,
        queryType: 'general_employee_search',
        executionTime: Date.now() - startTime
      };
    }
  }
  
  // Generate suggested actions based on query results
  private static generateSuggestedActions(type: AIQueryType, data: any[]): string[] {
    const actions: string[] = [];
    
    switch (type) {
      case 'certification_lookup':
        if (data.length === 0) {
          actions.push('Schedule certification training');
          actions.push('Find external training providers');
        } else {
          actions.push('View detailed certification records');
          actions.push('Check renewal dates');
        }
        break;
        
      case 'equipment_certification':
        if (data.length === 0) {
          actions.push('Schedule equipment training');
          actions.push('Find qualified trainers');
        } else {
          actions.push('Assign to project');
          actions.push('Check availability');
        }
        break;
        
      case 'expiring_certifications':
        actions.push('Send renewal reminders');
        actions.push('Schedule training sessions');
        actions.push('Update compliance tracking');
        break;
    }
    
    return actions;
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