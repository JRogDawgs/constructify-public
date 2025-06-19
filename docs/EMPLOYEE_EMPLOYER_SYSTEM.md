# Employee-Employer Data Management System

## Overview
This document explains the new data architecture that separates employee-controlled data from employer-controlled data, implements unique employee IDs, and enables seamless company transfers.

## Data Separation

### Employee-Controlled Data ✅
**These fields can be edited by employees:**

#### Personal Information
- Full Name, Preferred Name, Date of Birth
- Email addresses (primary & secondary)
- Phone numbers (mobile, home, work)
- Address & mailing address
- City, State, Bio

#### Professional Information
- Primary Trade
- Years of Experience

#### Banking Information (for Direct Deposit)
- Bank Name, Account Holder Name
- Account Type, Routing Number, Account Number
- Deposit Percentage

#### Legal Information
- Work Authorization Status
- I-9 Form Status
- Driver's License Information
- Social Security Number

#### Lists & Contacts
- Emergency Contacts
- Certifications & Training Records

#### Preferences
- Language Preference
- Notification Preferences

### Employer-Controlled Data 🔒
**These fields are READ-ONLY for employees and can only be managed by employers:**

#### Employment Information
- Job Title
- Department
- Skill Level (Apprentice, Journeyman, Master, Supervisor)
- Hire Date
- Employment Status (Full-time, Part-time, Contractor, Temp)
- **Pay Rate** - CRITICAL: Employees cannot edit their own pay
- **Pay Frequency** - CRITICAL: Employees cannot edit pay frequency

#### Insurance Benefits
- Health Insurance
- Dental Insurance
- Vision Insurance
- Life Insurance

#### Company Assignment
- Current Employer ID
- Employment relationship data

## Unique Employee ID System

### Employee ID Generation
- Format: `EMP-{timestamp}-{random9chars}`
- Example: `EMP-1703123456789-ABC123XYZ`
- Generated automatically on first profile save
- **Permanent and unique across the entire system**

### Company Transfer Process

#### For Employees:
1. Employee completes profile and receives unique Employee ID
2. When changing jobs, employee provides their Employee ID to new employer
3. Employee's personal data transfers automatically
4. Only employer-controlled data is reset/updated by new employer

#### For Employers:
1. Employer receives Employee ID from new hire
2. Employer looks up employee by ID in system
3. Employer assigns new employment data:
   - Job title, department, skill level
   - Pay rate and frequency
   - Insurance benefits
   - Hire date and status
4. Employee automatically moves under new company's "umbrella"

## Security & Data Integrity

### Employee Protections
- Employees cannot inflate their own pay rates
- Employees cannot change their employment status
- Employees cannot assign themselves insurance benefits
- Employees cannot modify employer-assigned skill levels

### Employer Controls
- Employers control all compensation data
- Employers manage insurance assignments
- Employers set job titles and departments
- Employers determine skill level classifications

### Data Persistence
- Employee personal data persists across company changes
- Banking information stays with employee for continuous payroll
- Certifications and training records follow employee
- Emergency contacts remain accessible

## Technical Implementation

### Database Structure
```javascript
{
  // EMPLOYEE-CONTROLLED (saved by employee interface)
  personalInfo: { ... },
  professionalInfo: { ... },
  bankingInfo: { ... },
  legalInfo: { ... },
  emergencyContacts: [ ... ],
  certifications: [ ... ],
  preferences: { ... },
  
  // SYSTEM-CONTROLLED
  employeeId: "EMP-1703123456789-ABC123XYZ",
  
  // EMPLOYER-CONTROLLED (saved by employer interface only)
  employment: {
    currentEmployerId: "COMP-...",
    jobTitle: "...",
    department: "...",
    skillLevel: "...",
    hireDate: "...",
    status: "...",
    payRate: "...",        // READ-ONLY for employee
    payFrequency: "..."    // READ-ONLY for employee
  },
  insurance: {
    health: "...",         // READ-ONLY for employee
    dental: "...",         // READ-ONLY for employee
    vision: "...",         // READ-ONLY for employee
    life: "..."            // READ-ONLY for employee
  }
}
```

### UI Indicators
- 🔒 **Orange badges** indicate employer-controlled fields
- **Disabled inputs** with gray background for read-only fields
- **Help text** explaining who controls each field
- **Warning messages** about employer-managed benefits

## Benefits of This System

### For Employees
- ✅ Complete control over personal information
- ✅ Portable profile across companies
- ✅ Secure banking information management
- ✅ Persistent certification records
- ✅ Protection from pay rate manipulation

### For Employers
- ✅ Full control over compensation data
- ✅ Easy employee onboarding with ID lookup
- ✅ Secure insurance benefit management
- ✅ Proper role-based access control
- ✅ Compliance with employment regulations

### For the System
- ✅ Clear data ownership boundaries
- ✅ Audit trail for sensitive changes
- ✅ Scalable multi-company architecture
- ✅ Reduced data duplication
- ✅ Enhanced security posture

## Next Steps

### Employee Portal (Current - ✅ Complete)
- Employee profile setup with proper field restrictions
- Unique ID generation and display
- Read-only employer data display

### Employer Portal (Next Phase - 🚧 To Build)
- Employee lookup by ID
- Employment data management interface
- Insurance benefit assignment
- Pay rate and frequency controls
- Company transfer approval workflow

### System Administration (Future - 📋 Planned)
- Cross-company employee transfer reports
- System-wide employee ID management
- Data integrity monitoring
- Compliance reporting tools

---

This architecture ensures proper separation of concerns while enabling the flexibility needed for modern workforce mobility in the construction industry. 