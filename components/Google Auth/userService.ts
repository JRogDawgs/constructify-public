import { doc, setDoc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { db } from './firebase';

// Legacy UserProfile interface for backward compatibility
export interface UserProfile {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  createdAt: any;
  lastLoginAt: any;
  provider: string;
  role?: string; // Added role field for admin functionality
  
  // Extended profile fields
  phone?: string;
  location?: string;
  bio?: string;
  company?: string;
  position?: string;
  profileType?: 'individual' | 'company'; // Profile type differentiation
  
  // Company-specific fields (when profileType === 'company')
  companyName?: string;
  companyLogo?: string;
  licenseNumber?: string;
  certifications?: string[];
  
  // Individual-specific fields  
  skills?: string[];
  certifications_individual?: string[];
}

// 🧠 AI-Ready Comprehensive Employee Data Model
export interface EmployeeProfile {
  // Identity
  id: string
  profileType: 'individual' | 'company'
  fullName: string
  preferredName?: string
  dateOfBirth?: string
  ssnEncrypted?: string

  // Contact Info
  email: string
  secondaryEmail?: string
  phoneMobile: string
  phoneHome?: string
  phoneWork?: string
  address: string
  mailingAddress?: string
  location?: string // city/state for filtering
  profilePhotoUrl?: string
  bio?: string

  // Emergency
  emergencyContacts: {
    name: string
    relationship: string
    phone: string
    address?: string
  }[]
  medicalInfo?: {
    allergies?: string
    medications?: string
    conditions?: string
    restrictions?: string
  }

  // Employment
  employeeId: string
  hireDate: string
  status: 'Full-time' | 'Part-time' | 'Contractor' | 'Temp'
  jobTitle: string
  department?: string
  supervisorId?: string
  payRate?: number
  payFrequency?: 'Weekly' | 'Bi-weekly' | 'Monthly'
  unionMembership?: {
    unionName: string
    localNumber: string
    memberId: string
  }

  // Skills & Certifications
  primaryTrade: string
  secondarySkills?: string[]
  yearsExperience?: number
  skillLevel?: 'Apprentice' | 'Journeyman' | 'Master' | 'Supervisor'
  certifications?: {
    name: string
    type: 'OSHA' | 'Safety' | 'Equipment' | 'Trade' | 'Other'
    level?: string
    issueDate: string
    expirationDate?: string
    certId?: string
  }[]

  // Safety & Compliance
  safetyTrainingRecords?: {
    name: string
    completedOn: string
    renewBy?: string
  }[]
  drugTests?: {
    date: string
    result: 'Pass' | 'Fail'
  }[]
  backgroundCheck?: {
    date: string
    passed: boolean
    notes?: string
  }
  incidents?: {
    date: string
    description: string
    outcome?: string
  }[]
  ppeRequirements?: {
    hardHatSize?: string
    bootSize?: string
    other?: string[]
  }

  // Legal & Docs
  workAuthorizationStatus?: 'Citizen' | 'Green Card' | 'Work Visa'
  i9FormStatus?: 'Submitted' | 'Missing'
  driversLicense?: {
    number: string
    state: string
    expiration: string
    type?: 'Standard' | 'CDL'
  }
  insurance?: {
    health?: string
    dental?: string
    vision?: string
    life?: string
  }
  workersComp?: {
    policyNumber: string
    claims?: {
      date: string
      type: string
      outcome?: string
    }[]
  }
  taxInfo?: {
    filingStatus: string
    dependents: number
    w4Submitted?: boolean
  }
  directDeposit?: {
    bankName: string
    accountType: string
    last4?: string
  }

  // Work History
  previousEmployers?: {
    companyName: string
    jobTitle: string
    startDate: string
    endDate?: string
    reasonForLeaving?: string
  }[]
  projectHistory?: {
    projectId: string
    name: string
    role: string
    startDate: string
    endDate?: string
    performanceNotes?: string
  }[]
  performanceReviews?: {
    date: string
    reviewer: string
    rating: number
    goals?: string
    notes?: string
  }[]
  disciplinaryActions?: {
    date: string
    issue: string
    resolution: string
  }[]

  // Equipment
  assignedEquipment?: {
    name: string
    id: string
    issueDate: string
    returnDate?: string
  }[]
  personalTools?: string[]
  equipmentTraining?: string[]
  uniformPPE?: {
    shirtSize?: string
    pantSize?: string
    bootSize?: string
    issueDates?: {
      item: string
      date: string
    }[]
  }

  // Schedule
  availability?: {
    daysAvailable: string[]
    shift: 'Day' | 'Night' | 'Swing'
  }
  timeOffRequests?: {
    type: 'Vacation' | 'Sick' | 'Personal'
    dateStart: string
    dateEnd: string
    status: 'Approved' | 'Pending' | 'Denied'
  }[]
  overtimeAuthorized?: boolean

  // Benefits
  benefits?: {
    health: boolean
    dental: boolean
    vision: boolean
    401k: {
      participating: boolean
      contributionPercent?: number
    }
    vacationDays?: number
    sickDays?: number
    personalDays?: number
  }

  // Technology
  login?: {
    username: string
    passwordHash: string
  }
  systemAccessLevel: 'Admin' | 'Manager' | 'Field'
  appPermissions?: string[]
  issuedDevices?: string[]
  softwareLicenses?: string[]

  // Current Project
  currentProject?: {
    id: string
    name: string
    role: string
    startDate: string
    hourlyRateOverride?: number
    supervisor?: string
  }

  // Communication
  contactPreference?: 'Email' | 'Text' | 'Phone'
  preferredLanguage?: string
  commsWindow?: string // "8am–5pm"
  socialProfiles?: {
    linkedin?: string
    other?: string
  }

  // Metadata for AI queries and system management
  createdAt: any
  lastLoginAt: any
  lastUpdatedAt?: any
  lastUpdatedBy?: string
  provider: string
  role?: string
}

// Create or update user document in Firestore
export const createOrUpdateUser = async (user: User): Promise<UserProfile> => {
  const userRef = doc(db, 'users', user.uid);
  
  try {
    // Check if user document exists
    const userSnap = await getDoc(userRef);
    
    const userData: UserProfile = {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName,
      photoURL: user.photoURL,
      createdAt: userSnap.exists() ? userSnap.data().createdAt : serverTimestamp(),
      lastLoginAt: serverTimestamp(),
      provider: 'google'
    };

    if (userSnap.exists()) {
      // Update existing user's last login
      await updateDoc(userRef, {
        lastLoginAt: serverTimestamp(),
        displayName: user.displayName,
        photoURL: user.photoURL,
        email: user.email
      });
      console.log('✅ User updated in Firestore:', user.email);
    } else {
      // Create new user document
      await setDoc(userRef, userData);
      console.log('✅ New user created in Firestore:', user.email);
    }

    return userData;
  } catch (error) {
    console.error('❌ Error creating/updating user in Firestore:', error);
    throw error;
  }
};

// Get user profile from Firestore
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return userSnap.data() as UserProfile;
    } else {
      console.log('No user document found');
      return null;
    }
  } catch (error) {
    console.error('❌ Error getting user profile:', error);
    throw error;
  }
};

// 🧠 AI-Ready Employee Profile Service Functions

// Create or update comprehensive employee profile
export const createOrUpdateEmployeeProfile = async (
  user: User, 
  additionalData?: Partial<EmployeeProfile>
): Promise<EmployeeProfile> => {
  const employeeRef = doc(db, 'employees', user.uid);
  
  try {
    const employeeSnap = await getDoc(employeeRef);
    
    const baseEmployeeData: EmployeeProfile = {
      id: user.uid,
      profileType: 'individual',
      fullName: user.displayName || '',
      email: user.email || '',
      phoneMobile: '',
      address: '',
      emergencyContacts: [],
      employeeId: user.uid, // Can be overridden with company-specific ID
      hireDate: new Date().toISOString(),
      status: 'Full-time',
      jobTitle: '',
      primaryTrade: '',
      systemAccessLevel: 'Field',
      createdAt: employeeSnap.exists() ? employeeSnap.data().createdAt : serverTimestamp(),
      lastLoginAt: serverTimestamp(),
      lastUpdatedAt: serverTimestamp(),
      provider: 'google',
      profilePhotoUrl: user.photoURL || undefined,
      ...additionalData
    };

    if (employeeSnap.exists()) {
      // Update existing employee
      const updateData = {
        ...additionalData,
        lastLoginAt: serverTimestamp(),
        lastUpdatedAt: serverTimestamp(),
        fullName: user.displayName || employeeSnap.data().fullName,
        email: user.email || employeeSnap.data().email,
        profilePhotoUrl: user.photoURL || employeeSnap.data().profilePhotoUrl
      };
      
      await updateDoc(employeeRef, updateData);
      console.log('✅ Employee profile updated:', user.email);
      
      return { ...employeeSnap.data(), ...updateData } as EmployeeProfile;
    } else {
      // Create new employee profile
      await setDoc(employeeRef, baseEmployeeData);
      console.log('✅ New employee profile created:', user.email);
      
      return baseEmployeeData;
    }
  } catch (error) {
    console.error('❌ Error creating/updating employee profile:', error);
    throw error;
  }
};

// Get comprehensive employee profile
export const getEmployeeProfile = async (uid: string): Promise<EmployeeProfile | null> => {
  try {
    const employeeRef = doc(db, 'employees', uid);
    const employeeSnap = await getDoc(employeeRef);
    
    if (employeeSnap.exists()) {
      return employeeSnap.data() as EmployeeProfile;
    } else {
      console.log('No employee profile found');
      return null;
    }
  } catch (error) {
    console.error('❌ Error getting employee profile:', error);
    throw error;
  }
};

// 🤖 AI-Ready Query Functions for Natural Language Processing

// Find employees by certification
export const findEmployeesByCertification = async (
  certificationName: string,
  certType?: 'OSHA' | 'Safety' | 'Equipment' | 'Trade' | 'Other'
): Promise<EmployeeProfile[]> => {
  // This would use Firestore compound queries
  // Implementation would depend on your specific query needs
  console.log(`🔍 AI Query: Finding employees with certification: ${certificationName}`);
  return []; // Placeholder
};

// Find employees by skill level and location
export const findEmployeesBySkillAndLocation = async (
  skillLevel: string,
  location: string,
  primaryTrade?: string
): Promise<EmployeeProfile[]> => {
  console.log(`🔍 AI Query: Finding ${skillLevel} level employees in ${location}`);
  return []; // Placeholder
};

// Find employees with recent drug tests
export const findEmployeesWithRecentDrugTests = async (
  monthsBack: number = 6
): Promise<EmployeeProfile[]> => {
  console.log(`🔍 AI Query: Finding employees with drug tests in last ${monthsBack} months`);
  return []; // Placeholder
};

// Get equipment-certified employees
export const findEquipmentCertifiedEmployees = async (
  equipmentType: string,
  location?: string
): Promise<EmployeeProfile[]> => {
  console.log(`🔍 AI Query: Finding employees certified for ${equipmentType}${location ? ` in ${location}` : ''}`);
  return []; // Placeholder
};

// Expiring certifications alert
export const findExpiringCertifications = async (
  daysAhead: number = 30
): Promise<{employee: EmployeeProfile, expiring: any[]}[]> => {
  console.log(`🔍 AI Query: Finding certifications expiring in next ${daysAhead} days`);
  return []; // Placeholder
};

// Safety compliance check
export const getSafetyComplianceStatus = async (
  employeeId: string
): Promise<{
  compliant: boolean;
  missingRequirements: string[];
  expiringItems: string[];
}> => {
  console.log(`🔍 AI Query: Checking safety compliance for employee ${employeeId}`);
  return {
    compliant: false,
    missingRequirements: [],
    expiringItems: []
  }; // Placeholder
};

// Project staffing recommendations
export const getProjectStaffingRecommendations = async (
  projectRequirements: {
    skills: string[];
    certifications: string[];
    location: string;
    startDate: string;
    endDate: string;
  }
): Promise<{
  recommended: EmployeeProfile[];
  qualified: EmployeeProfile[];
  available: EmployeeProfile[];
}> => {
  console.log(`🔍 AI Query: Finding staff recommendations for project`);
  return {
    recommended: [],
    qualified: [],
    available: []
  }; // Placeholder
}; 