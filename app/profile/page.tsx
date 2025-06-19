'use client';

import { useAuth } from '@/components/Google Auth/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  User, 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase,
  Calendar,
  Shield,
  Edit,
  Save,
  X,
  HardHat,
  Wrench,
  Truck,
  Hammer,
  Settings,
  Award,
  Clock,
  TrendingUp,
  Star,
  Zap,
  Target,
  Users,
  CreditCard,
  DollarSign,
  FileText,
  AlertTriangle,
  BookOpen,
  Stethoscope,
  Car,
  Home,
  Building,
  Banknote,
  Plus,
  Trash2,
  Upload,
  Download
} from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { getEmployeeProfile, createOrUpdateEmployeeProfile, type EmployeeProfile } from '@/components/Google Auth/userService';

export default function ProfilePage() {
  const { t } = useTranslation();
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [employeeData, setEmployeeData] = useState<EmployeeProfile | null>(null);
  const [loadingEmployee, setLoadingEmployee] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Modal states for different sections
  const [showAddCertModal, setShowAddCertModal] = useState(false);
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [showAddTrainingModal, setShowAddTrainingModal] = useState(false);
  const [showBankingModal, setShowBankingModal] = useState(false);
  const [showEditPersonalModal, setShowEditPersonalModal] = useState(false);

  // Form states
  const [newCertification, setNewCertification] = useState({
    name: '',
    type: 'OSHA' as 'OSHA' | 'Safety' | 'Equipment' | 'Trade' | 'Other',
    level: '',
    issueDate: '',
    expirationDate: '',
    certId: ''
  });

  const [newEmergencyContact, setNewEmergencyContact] = useState({
    name: '',
    relationship: '',
    phone: '',
    address: ''
  });

  const [newTraining, setNewTraining] = useState({
    name: '',
    completedOn: '',
    renewBy: ''
  });

  const [personalInfo, setPersonalInfo] = useState({
    fullName: '',
    email: '',
    phoneMobile: '',
    location: '',
    bio: '',
    jobTitle: '',
    primaryTrade: '',
    skillLevel: 'Apprentice' as 'Apprentice' | 'Journeyman' | 'Master' | 'Supervisor'
  });

  const [profileData, setProfileData] = useState({
    displayName: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    company: '',
    position: '',
    profileType: 'individual' // 'individual' or 'company'
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  // Load comprehensive employee data
  useEffect(() => {
    const loadEmployeeData = async () => {
      if (user && !loadingEmployee) {
        setLoadingEmployee(true);
        try {
          const empData = await getEmployeeProfile(user.uid);
          setEmployeeData(empData);
          
          // Initialize form data if employee data exists
          if (empData) {
            setPersonalInfo({
              fullName: empData.fullName || '',
              email: empData.email || '',
              phoneMobile: empData.phoneMobile || '',
              location: empData.location || '',
              bio: empData.bio || '',
              jobTitle: empData.jobTitle || '',
              primaryTrade: empData.primaryTrade || '',
              skillLevel: empData.skillLevel || 'Apprentice'
            });
          }
          
          console.log('📊 Loaded comprehensive employee data:', empData);
        } catch (error) {
          console.error('❌ Error loading employee data:', error);
        } finally {
          setLoadingEmployee(false);
        }
      }
    };

    loadEmployeeData();
  }, [user, loadingEmployee]);

  // Initialize profile data
  useEffect(() => {
    if (user && userProfile) {
      setProfileData({
        displayName: user.displayName || '',
        email: user.email || '',
        phone: userProfile.phone || '',
        location: userProfile.location || '',
        bio: userProfile.bio || '',
        company: userProfile.company || '',
        position: userProfile.position || '',
        profileType: userProfile.profileType || 'individual'
      });
    }
  }, [user, userProfile]);

  // Save functions
  const savePersonalInfo = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      const updatedData: Partial<EmployeeProfile> = {
        fullName: personalInfo.fullName,
        email: personalInfo.email,
        phoneMobile: personalInfo.phoneMobile,
        location: personalInfo.location,
        bio: personalInfo.bio,
        jobTitle: personalInfo.jobTitle,
        primaryTrade: personalInfo.primaryTrade,
        skillLevel: personalInfo.skillLevel,
        lastUpdatedAt: new Date(),
        lastUpdatedBy: user.uid
      };

      await createOrUpdateEmployeeProfile(user, updatedData);
      
      // Reload employee data
      const refreshedData = await getEmployeeProfile(user.uid);
      setEmployeeData(refreshedData);
      
      setShowEditPersonalModal(false);
      console.log('✅ Personal info saved successfully');
    } catch (error) {
      console.error('❌ Error saving personal info:', error);
    } finally {
      setSaving(false);
    }
  };

  const addCertification = async () => {
    if (!user || !employeeData) return;
    
    setSaving(true);
    try {
      const updatedCertifications = [
        ...(employeeData.certifications || []),
        newCertification
      ];

      const updatedData: Partial<EmployeeProfile> = {
        certifications: updatedCertifications,
        lastUpdatedAt: new Date(),
        lastUpdatedBy: user.uid
      };

      await createOrUpdateEmployeeProfile(user, updatedData);
      
      // Reload employee data
      const refreshedData = await getEmployeeProfile(user.uid);
      setEmployeeData(refreshedData);
      
      // Reset form
      setNewCertification({
        name: '',
        type: 'OSHA',
        level: '',
        issueDate: '',
        expirationDate: '',
        certId: ''
      });
      
      setShowAddCertModal(false);
      console.log('✅ Certification added successfully');
    } catch (error) {
      console.error('❌ Error adding certification:', error);
    } finally {
      setSaving(false);
    }
  };

  const addEmergencyContact = async () => {
    if (!user || !employeeData) return;
    
    setSaving(true);
    try {
      const updatedContacts = [
        ...(employeeData.emergencyContacts || []),
        newEmergencyContact
      ];

      const updatedData: Partial<EmployeeProfile> = {
        emergencyContacts: updatedContacts,
        lastUpdatedAt: new Date(),
        lastUpdatedBy: user.uid
      };

      await createOrUpdateEmployeeProfile(user, updatedData);
      
      // Reload employee data
      const refreshedData = await getEmployeeProfile(user.uid);
      setEmployeeData(refreshedData);
      
      // Reset form
      setNewEmergencyContact({
        name: '',
        relationship: '',
        phone: '',
        address: ''
      });
      
      setShowAddContactModal(false);
      console.log('✅ Emergency contact added successfully');
    } catch (error) {
      console.error('❌ Error adding emergency contact:', error);
    } finally {
      setSaving(false);
    }
  };

  const addTraining = async () => {
    if (!user || !employeeData) return;
    
    setSaving(true);
    try {
      const updatedTraining = [
        ...(employeeData.safetyTrainingRecords || []),
        newTraining
      ];

      const updatedData: Partial<EmployeeProfile> = {
        safetyTrainingRecords: updatedTraining,
        lastUpdatedAt: new Date(),
        lastUpdatedBy: user.uid
      };

      await createOrUpdateEmployeeProfile(user, updatedData);
      
      // Reload employee data
      const refreshedData = await getEmployeeProfile(user.uid);
      setEmployeeData(refreshedData);
      
      // Reset form
      setNewTraining({
        name: '',
        completedOn: '',
        renewBy: ''
      });
      
      setShowAddTrainingModal(false);
      console.log('✅ Training record added successfully');
    } catch (error) {
      console.error('❌ Error adding training record:', error);
    } finally {
      setSaving(false);
    }
  };

  const deleteCertification = async (index: number) => {
    if (!user || !employeeData) return;
    
    setSaving(true);
    try {
      const updatedCertifications = employeeData.certifications?.filter((_, i) => i !== index) || [];

      const updatedData: Partial<EmployeeProfile> = {
        certifications: updatedCertifications,
        lastUpdatedAt: new Date(),
        lastUpdatedBy: user.uid
      };

      await createOrUpdateEmployeeProfile(user, updatedData);
      
      // Reload employee data
      const refreshedData = await getEmployeeProfile(user.uid);
      setEmployeeData(refreshedData);
      
      console.log('✅ Certification deleted successfully');
    } catch (error) {
      console.error('❌ Error deleting certification:', error);
    } finally {
      setSaving(false);
    }
  };

  const deleteEmergencyContact = async (index: number) => {
    if (!user || !employeeData) return;
    
    setSaving(true);
    try {
      const updatedContacts = employeeData.emergencyContacts?.filter((_, i) => i !== index) || [];

      const updatedData: Partial<EmployeeProfile> = {
        emergencyContacts: updatedContacts,
        lastUpdatedAt: new Date(),
        lastUpdatedBy: user.uid
      };

      await createOrUpdateEmployeeProfile(user, updatedData);
      
      // Reload employee data
      const refreshedData = await getEmployeeProfile(user.uid);
      setEmployeeData(refreshedData);
      
      console.log('✅ Emergency contact deleted successfully');
    } catch (error) {
      console.error('❌ Error deleting emergency contact:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    // TODO: Implement profile update functionality
    console.log('Saving profile:', profileData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset to original data
    if (user && userProfile) {
      setProfileData({
        displayName: user.displayName || '',
        email: user.email || '',
        phone: userProfile.phone || '',
        location: userProfile.location || '',
        bio: userProfile.bio || '',
        company: userProfile.company || '',
        position: userProfile.position || '',
        profileType: userProfile.profileType || 'individual'
      });
    }
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
                    <div className="text-center space-y-6">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-amber-600/30 rounded-full animate-spin border-t-amber-600 mx-auto"></div>
                <HardHat className="h-8 w-8 text-amber-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
              </div>
              <p className="text-xl text-white font-medium">{t('forms.loading')}</p>
            </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-constructify-gradient">
      {/* Notre Dame Inspired Hero Section */}
      <div className="relative overflow-hidden">
        {/* Sophisticated Background Pattern */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        
        {/* Elegant Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-slate-800/60 to-emerald-900/80"></div>
        
        <div className="relative z-10 px-6 py-16 lg:py-24">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              
              {/* Professional Avatar Section */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative">
                  <Avatar className="w-32 h-32 lg:w-40 lg:h-40 border-4 border-white/20 shadow-2xl">
                    <AvatarImage src={user.photoURL || ''} alt={profileData.displayName} />
                    <AvatarFallback className="text-4xl font-bold bg-gradient-to-br from-slate-700 to-blue-800 text-white">
                      {profileData.displayName?.split(' ').map(n => n[0]).join('') || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  
                  {/* Professional Status Badge */}
                  <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-emerald-600 to-green-700 text-white rounded-full p-3 shadow-lg border-2 border-white/20">
                    <HardHat className="h-6 w-6" />
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div className="flex-1 text-white text-center lg:text-left">
                <h1 className="text-4xl lg:text-5xl font-bold mb-3 drop-shadow-lg bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  {employeeData?.fullName || profileData.displayName || 'Your Profile'}
                </h1>
                <p className="text-xl text-blue-100 mb-6 font-medium">
                  {employeeData?.jobTitle || profileData.position || 'Construction Professional'}
                </p>
                
                <div className="flex flex-wrap gap-3 mb-8 justify-center lg:justify-start">
                  <Badge className="bg-gradient-to-r from-blue-600/80 to-slate-600/80 hover:from-blue-500/90 hover:to-slate-500/90 text-white border-white/20 backdrop-blur-sm transition-all duration-300 px-4 py-2">
                    {employeeData?.profileType === 'company' ? (
                      <>
                        <Building2 className="h-4 w-4 mr-2" />
                        Company Profile
                      </>
                    ) : (
                      <>
                        <User className="h-4 w-4 mr-2" />
                        Individual Profile
                      </>
                    )}
                  </Badge>
                  {userProfile?.role === 'admin' && (
                    <Badge className="bg-gradient-to-r from-emerald-600 to-green-700 text-white border-0 shadow-lg animate-pulse px-4 py-2">
                      <Shield className="h-4 w-4 mr-2" />
                      Admin Access
                    </Badge>
                  )}
                  <Badge className="bg-gradient-to-r from-amber-600/80 to-yellow-600/80 hover:from-amber-500/90 hover:to-yellow-500/90 text-white border-white/20 backdrop-blur-sm px-4 py-2">
                    <Award className="h-4 w-4 mr-2" />
                    {employeeData?.systemAccessLevel || 'Verified Member'}
                  </Badge>
                  {employeeData?.skillLevel && (
                    <Badge className="bg-gradient-to-r from-emerald-600/80 to-green-600/80 text-white border-white/20 backdrop-blur-sm px-4 py-2">
                      <HardHat className="h-4 w-4 mr-2" />
                      {employeeData.skillLevel}
                    </Badge>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                  {isEditing ? (
                    <>
                      <Button 
                        onClick={handleSave} 
                        className="bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white border-0 shadow-lg transform hover:scale-105 transition-all duration-200 px-6 py-3"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                      <Button 
                        onClick={handleCancel} 
                        className="bg-gradient-to-r from-slate-600/80 to-gray-600/80 hover:from-slate-700/90 hover:to-gray-700/90 text-white border-white/20 backdrop-blur-sm transform hover:scale-105 transition-all duration-200 px-6 py-3"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button 
                        onClick={() => setShowEditPersonalModal(true)} 
                        className="bg-constructify-gold-gradient hover:bg-constructify-gold-dark text-black font-semibold border-0 shadow-lg transform hover:scale-105 transition-all duration-200 px-6 py-3"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        {t('profile.actions.editProfile')}
                      </Button>
                      <Button 
                        onClick={() => setShowAddContactModal(true)} 
                        className="bg-constructify-gold-gradient hover:bg-constructify-gold-dark text-black font-semibold border-0 shadow-lg transform hover:scale-105 transition-all duration-200 px-6 py-3"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Contact
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Subtle Construction Equipment Icons */}
        <div className="absolute bottom-0 right-0 opacity-5 pointer-events-none">
          <div className="flex space-x-8 p-8">
            <Truck className="h-16 w-16 text-white transform rotate-12" />
            <Hammer className="h-12 w-12 text-white transform -rotate-12" />
            <Wrench className="h-14 w-14 text-white transform rotate-45" />
          </div>
        </div>
      </div>
      
      {/* Floating Professional Stats */}
      <div className="relative z-20 -mt-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            <Card className="border-0 shadow-xl bg-gradient-to-br from-white/95 to-blue-50/95 backdrop-blur-sm hover:scale-105 transition-transform duration-300">
              <CardContent className="p-6 text-center">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <Calendar className="h-6 w-6" />
                </div>
                <div className="text-2xl font-bold text-blue-800">
                  {employeeData?.yearsExperience || (userProfile?.createdAt ? new Date().getFullYear() - new Date(userProfile.createdAt.toDate()).getFullYear() + 1 : 1)}
                </div>
                <div className="text-sm text-slate-600 font-medium">Years Experience</div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-xl bg-gradient-to-br from-white/95 to-emerald-50/95 backdrop-blur-sm hover:scale-105 transition-transform duration-300">
              <CardContent className="p-6 text-center">
                <div className="bg-gradient-to-br from-emerald-600 to-green-700 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <Target className="h-6 w-6" />
                </div>
                <div className="text-2xl font-bold text-emerald-800">
                  {employeeData?.projectHistory?.length || 12}
                </div>
                <div className="text-sm text-slate-600 font-medium">Projects</div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-xl bg-gradient-to-br from-white/95 to-amber-50/95 backdrop-blur-sm hover:scale-105 transition-transform duration-300">
              <CardContent className="p-6 text-center">
                <div className="bg-gradient-to-br from-amber-600 to-yellow-700 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <Award className="h-6 w-6" />
                </div>
                <div className="text-2xl font-bold text-amber-800">
                  {employeeData?.certifications?.length || 8}
                </div>
                <div className="text-sm text-slate-600 font-medium">Certifications</div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-xl bg-gradient-to-br from-white/95 to-slate-50/95 backdrop-blur-sm hover:scale-105 transition-transform duration-300">
              <CardContent className="p-6 text-center">
                <div className="bg-gradient-to-br from-slate-600 to-gray-700 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div className="text-2xl font-bold text-slate-800">
                  {employeeData?.systemAccessLevel || (userProfile?.role === 'admin' ? 'MAX' : 'L3')}
                </div>
                <div className="text-sm text-slate-600 font-medium">Access Level</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Comprehensive Data Tabs Section */}
      <div className="px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="personal" className="space-y-8">
            <TabsList className="grid w-full grid-cols-6 bg-gradient-to-r from-slate-800/90 to-blue-900/90 backdrop-blur-sm border border-white/10 p-2 rounded-xl">
              <TabsTrigger 
                value="personal" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-700 data-[state=active]:text-white text-blue-100 font-medium transition-all duration-200 text-xs"
              >
                {t('profile.tabs.personal')}
              </TabsTrigger>
              <TabsTrigger 
                value="professional" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-green-700 data-[state=active]:text-white text-blue-100 font-medium transition-all duration-200 text-xs"
              >
                {t('profile.tabs.professional')}
              </TabsTrigger>
              <TabsTrigger 
                value="banking" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-600 data-[state=active]:to-yellow-700 data-[state=active]:text-white text-blue-100 font-medium transition-all duration-200 text-xs"
              >
                {t('profile.tabs.banking')}
              </TabsTrigger>
              <TabsTrigger 
                value="certifications" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-violet-700 data-[state=active]:text-white text-blue-100 font-medium transition-all duration-200 text-xs"
              >
                {t('profile.tabs.certifications')}
              </TabsTrigger>
              <TabsTrigger 
                value="safety" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-orange-700 data-[state=active]:text-white text-blue-100 font-medium transition-all duration-200 text-xs"
              >
                {t('profile.tabs.safety')}
              </TabsTrigger>
              <TabsTrigger 
                value="account" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-slate-600 data-[state=active]:to-gray-700 data-[state=active]:text-white text-blue-100 font-medium transition-all duration-200 text-xs"
              >
                {t('profile.tabs.settings')}
              </TabsTrigger>
            </TabsList>

            {/* Personal Information Tab */}
            <TabsContent value="personal" className="space-y-6">
              <Card className="border-0 shadow-xl bg-gradient-to-br from-white/95 to-blue-50/95 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <User className="h-6 w-6" />
                    {t('profile.tabs.personal')}
                  </CardTitle>
                  <CardDescription className="text-blue-100">
                    {t('profile.personal.basicInfo')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="displayName" className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                        <User className="h-5 w-5 text-blue-600" />
                        {t('profile.personal.fullName')}
                      </Label>
                      {isEditing ? (
                        <Input
                          id="displayName"
                          value={personalInfo.fullName}
                          onChange={(e) => setPersonalInfo({...personalInfo, fullName: e.target.value})}
                          placeholder="Enter your full name"
                          className="border-2 border-blue-200 focus:border-blue-600 rounded-lg p-3 text-lg transition-all duration-200"
                        />
                      ) : (
                        <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-blue-100 hover:shadow-md transition-all duration-200">
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          <span className="text-lg font-medium text-slate-800">{employeeData?.fullName || personalInfo.fullName || 'Not set'}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="email" className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                        <Mail className="h-5 w-5 text-emerald-600" />
                        Email Address
                      </Label>
                      <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-gray-50 to-emerald-50 rounded-lg border border-emerald-100">
                        <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                        <span className="text-lg font-medium text-slate-800">{employeeData?.email || personalInfo.email}</span>
                        <Badge className="bg-gradient-to-r from-emerald-600 to-green-700 text-white text-xs px-2 py-1">Verified</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="phone" className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                        <Phone className="h-5 w-5 text-amber-600" />
                        Phone Number
                      </Label>
                      {isEditing ? (
                        <Input
                          id="phone"
                          value={personalInfo.phoneMobile}
                          onChange={(e) => setPersonalInfo({...personalInfo, phoneMobile: e.target.value})}
                          placeholder="(555) 123-4567"
                          className="border-2 border-amber-200 focus:border-amber-600 rounded-lg p-3 text-lg transition-all duration-200"
                        />
                      ) : (
                        <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-gray-50 to-amber-50 rounded-lg border border-amber-100 hover:shadow-md transition-all duration-200">
                          <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
                          <span className="text-lg font-medium text-slate-800">{employeeData?.phoneMobile || personalInfo.phoneMobile || 'Not set'}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="location" className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-slate-600" />
                        Location
                      </Label>
                      {isEditing ? (
                        <Input
                          id="location"
                          value={personalInfo.location}
                          onChange={(e) => setPersonalInfo({...personalInfo, location: e.target.value})}
                          placeholder="City, State"
                          className="border-2 border-slate-200 focus:border-slate-600 rounded-lg p-3 text-lg transition-all duration-200"
                        />
                      ) : (
                        <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg border border-slate-100 hover:shadow-md transition-all duration-200">
                          <div className="w-2 h-2 bg-slate-600 rounded-full"></div>
                          <span className="text-lg font-medium text-slate-800">{employeeData?.location || personalInfo.location || 'Not set'}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Emergency Contacts Section */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                        {t('profile.personal.emergencyContacts')}
                      </Label>
                      <Button 
                        onClick={() => setShowAddContactModal(true)}
                        size="sm"
                        className="bg-gradient-to-r from-red-600 to-orange-700 hover:from-red-700 hover:to-orange-800 text-white"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Contact
                      </Button>
                    </div>
                    
                    {employeeData?.emergencyContacts && employeeData.emergencyContacts.length > 0 ? (
                      <div className="space-y-3">
                        {employeeData.emergencyContacts.map((contact, index) => (
                          <div key={index} className="p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border border-red-100">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-semibold text-slate-800">{contact.name}</h4>
                                <p className="text-slate-600">{contact.relationship}</p>
                                <p className="text-slate-600">{contact.phone}</p>
                                {contact.address && <p className="text-slate-600 text-sm">{contact.address}</p>}
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className="bg-red-100 text-red-700">Emergency</Badge>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => deleteEmergencyContact(index)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-100"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 text-center bg-gradient-to-r from-gray-50 to-red-50 rounded-lg border border-red-100">
                        <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-3" />
                        <p className="text-slate-600 mb-4">No emergency contacts added yet</p>
                        <Button 
                          onClick={() => setShowAddContactModal(true)}
                          className="bg-gradient-to-r from-red-600 to-orange-700 hover:from-red-700 hover:to-orange-800 text-white"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Your First Emergency Contact
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="bio" className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                      <Users className="h-5 w-5 text-blue-600" />
                      Professional Bio
                    </Label>
                    {isEditing ? (
                      <Textarea
                        id="bio"
                        value={personalInfo.bio}
                        onChange={(e) => setPersonalInfo({...personalInfo, bio: e.target.value})}
                        placeholder="Tell us about your construction experience and expertise..."
                        rows={4}
                        className="border-2 border-blue-200 focus:border-blue-600 rounded-lg p-4 text-lg transition-all duration-200 resize-none"
                      />
                    ) : (
                      <div className="p-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg border border-blue-100 hover:shadow-md transition-all duration-200 min-h-[120px]">
                        <p className="text-lg leading-relaxed text-slate-700">
                          {employeeData?.bio || personalInfo.bio || 'Add your professional bio to showcase your construction expertise and experience.'}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Professional Information Tab */}
            <TabsContent value="professional" className="space-y-6">
              <Card className="border-0 shadow-xl bg-gradient-to-br from-white/95 to-emerald-50/95 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-emerald-600 to-green-700 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Briefcase className="h-6 w-6" />
                    Professional Information
                  </CardTitle>
                  <CardDescription className="text-emerald-100">
                    Your work experience and professional details.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-emerald-600" />
                        Employee ID
                      </Label>
                      <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-gray-50 to-emerald-50 rounded-lg border border-emerald-100">
                        <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                        <span className="text-lg font-medium text-slate-800">{employeeData?.employeeId || 'Not assigned'}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                        <HardHat className="h-5 w-5 text-amber-600" />
                        Job Title
                      </Label>
                      <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-gray-50 to-amber-50 rounded-lg border border-amber-100">
                        <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
                        <span className="text-lg font-medium text-slate-800">{employeeData?.jobTitle || personalInfo.jobTitle || 'Not set'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                        <Building className="h-5 w-5 text-blue-600" />
                        Primary Trade
                      </Label>
                      <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-blue-100">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <span className="text-lg font-medium text-slate-800">{employeeData?.primaryTrade || personalInfo.primaryTrade || 'Not specified'}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                        <Star className="h-5 w-5 text-purple-600" />
                        Skill Level
                      </Label>
                      <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-gray-50 to-purple-50 rounded-lg border border-purple-100">
                        <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                        <span className="text-lg font-medium text-slate-800">{employeeData?.skillLevel || personalInfo.skillLevel || 'Not assessed'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Current Project Section */}
                  {employeeData?.currentProject && (
                    <div className="space-y-3">
                      <Label className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                        <Target className="h-5 w-5 text-emerald-600" />
                        Current Project
                      </Label>
                      <div className="p-6 bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg border border-emerald-100">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-xl font-bold text-slate-800">{employeeData.currentProject.name}</h4>
                          <Badge className="bg-emerald-100 text-emerald-700">Active</Badge>
                        </div>
                        <p className="text-slate-600 mb-2">Role: {employeeData.currentProject.role}</p>
                        <p className="text-slate-600">Started: {new Date(employeeData.currentProject.startDate).toLocaleDateString()}</p>
                        {employeeData.currentProject.supervisor && (
                          <p className="text-slate-600">Supervisor: {employeeData.currentProject.supervisor}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Enhanced Professional Achievements */}
                  <div className="mt-8">
                    <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                      <Award className="h-6 w-6 text-emerald-600" />
                      Professional Achievements
                    </h3>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="text-center group hover:scale-105 transition-transform duration-200">
                        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:shadow-xl transition-shadow duration-200">
                          <Calendar className="h-8 w-8" />
                        </div>
                        <div className="text-3xl font-bold text-blue-700">
                          {employeeData?.yearsExperience || (userProfile?.createdAt ? new Date().getFullYear() - new Date(userProfile.createdAt.toDate()).getFullYear() + 1 : 1)}
                        </div>
                        <div className="text-sm text-slate-600 font-medium">Years Experience</div>
                      </div>
                      
                      <div className="text-center group hover:scale-105 transition-transform duration-200">
                        <div className="bg-gradient-to-br from-emerald-600 to-green-700 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:shadow-xl transition-shadow duration-200">
                          <Target className="h-8 w-8" />
                        </div>
                        <div className="text-3xl font-bold text-emerald-700">
                          {employeeData?.projectHistory?.length || 12}
                        </div>
                        <div className="text-sm text-slate-600 font-medium">Projects Completed</div>
                      </div>
                      
                      <div className="text-center group hover:scale-105 transition-transform duration-200">
                        <div className="bg-gradient-to-br from-amber-600 to-yellow-700 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:shadow-xl transition-shadow duration-200">
                          <Award className="h-8 w-8" />
                        </div>
                        <div className="text-3xl font-bold text-amber-700">
                          {employeeData?.certifications?.length || 8}
                        </div>
                        <div className="text-sm text-slate-600 font-medium">Certifications</div>
                      </div>
                      
                      <div className="text-center group hover:scale-105 transition-transform duration-200">
                        <div className="bg-gradient-to-br from-slate-600 to-gray-700 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:shadow-xl transition-shadow duration-200">
                          <TrendingUp className="h-8 w-8" />
                        </div>
                        <div className="text-3xl font-bold text-slate-700">
                          {employeeData?.systemAccessLevel || (userProfile?.role === 'admin' ? 'MAX' : 'L3')}
                        </div>
                        <div className="text-sm text-slate-600 font-medium">Security Level</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Banking Tab */}
            <TabsContent value="banking" className="space-y-6">
              <Card className="border-0 shadow-xl bg-gradient-to-br from-white/95 to-amber-50/95 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-amber-600 to-yellow-700 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <CreditCard className="h-6 w-6" />
                    Banking & Financial Information
                  </CardTitle>
                  <CardDescription className="text-amber-100">
                    Manage your banking details, payroll, and financial information.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  {/* Primary Banking Account */}
                  {employeeData?.bankingInfo?.primaryAccount && (
                    <div className="space-y-3">
                      <Label className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                        <Banknote className="h-5 w-5 text-emerald-600" />
                        Primary Direct Deposit Account
                      </Label>
                      <div className="p-6 bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg border border-emerald-100">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-slate-600">Bank Name</p>
                            <p className="text-lg font-semibold text-slate-800">{employeeData.bankingInfo.primaryAccount.bankName}</p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-600">Account Type</p>
                            <p className="text-lg font-semibold text-slate-800">{employeeData.bankingInfo.primaryAccount.accountType}</p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-600">Deposit Percentage</p>
                            <p className="text-lg font-semibold text-slate-800">{employeeData.bankingInfo.primaryAccount.depositPercentage}%</p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-600">Status</p>
                            <Badge className={employeeData.bankingInfo.primaryAccount.isVerified ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}>
                              {employeeData.bankingInfo.primaryAccount.isVerified ? 'Verified' : 'Pending Verification'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Payroll Information */}
                  {employeeData?.compensationDetails && (
                    <div className="space-y-3">
                      <Label className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-blue-600" />
                        Compensation Details
                      </Label>
                      <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm text-slate-600">Pay Type</p>
                            <p className="text-lg font-semibold text-slate-800">{employeeData.compensationDetails.basePay.payType}</p>
                          </div>
                          {employeeData.compensationDetails.basePay.hourlyRate && (
                            <div>
                              <p className="text-sm text-slate-600">Hourly Rate</p>
                              <p className="text-lg font-semibold text-slate-800">${employeeData.compensationDetails.basePay.hourlyRate.toFixed(2)}/hr</p>
                            </div>
                          )}
                          {employeeData.compensationDetails.basePay.annualSalary && (
                            <div>
                              <p className="text-sm text-slate-600">Annual Salary</p>
                              <p className="text-lg font-semibold text-slate-800">${employeeData.compensationDetails.basePay.annualSalary.toLocaleString()}</p>
                            </div>
                          )}
                          <div>
                            <p className="text-sm text-slate-600">Overtime Rate</p>
                            <p className="text-lg font-semibold text-slate-800">{employeeData.compensationDetails.overtimeRules.overtimeRate}x</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Financial Metrics */}
                  {employeeData?.financialMetrics && (
                    <div className="space-y-3">
                      <Label className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-purple-600" />
                        Year-to-Date Financial Summary
                      </Label>
                      <div className="p-6 bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg border border-purple-100">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                          <div className="text-center">
                            <p className="text-sm text-slate-600">Gross Pay</p>
                            <p className="text-xl font-bold text-purple-700">${employeeData.financialMetrics.yearToDate.grossPay.toLocaleString()}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-slate-600">Net Pay</p>
                            <p className="text-xl font-bold text-purple-700">${employeeData.financialMetrics.yearToDate.netPay.toLocaleString()}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-slate-600">Overtime Hours</p>
                            <p className="text-xl font-bold text-purple-700">{employeeData.financialMetrics.yearToDate.overtimeHours}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-slate-600">Bonus Pay</p>
                            <p className="text-xl font-bold text-purple-700">${employeeData.financialMetrics.yearToDate.bonusPay.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-6 border border-amber-200 rounded-xl bg-gradient-to-r from-amber-50 to-yellow-50 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center gap-4">
                        <div className="bg-gradient-to-br from-amber-600 to-yellow-700 text-white rounded-full w-12 h-12 flex items-center justify-center">
                          <DollarSign className="h-6 w-6" />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-slate-800">Payroll Management</h4>
                          <p className="text-slate-600">View pay stubs and tax documents</p>
                        </div>
                      </div>
                      <Badge className="bg-gradient-to-r from-amber-600 to-yellow-700 text-white border-0 shadow-lg px-4 py-2">
                        {employeeData?.payFrequency || 'Bi-weekly'}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-6 border border-emerald-200 rounded-xl bg-gradient-to-r from-emerald-50 to-green-50 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center gap-4">
                        <div className="bg-gradient-to-br from-emerald-600 to-green-700 text-white rounded-full w-12 h-12 flex items-center justify-center">
                          <FileText className="h-6 w-6" />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-slate-800">Expense Tracking</h4>
                          <p className="text-slate-600">Submit and track expense reimbursements</p>
                        </div>
                      </div>
                      <Badge className="bg-gradient-to-r from-emerald-600 to-green-700 text-white border-0 shadow-lg px-4 py-2">
                        {employeeData?.expenseManagement?.recentExpenses?.length || 0} pending
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Certifications Tab */}
            <TabsContent value="certifications" className="space-y-6">
              <Card className="border-0 shadow-xl bg-gradient-to-br from-white/95 to-purple-50/95 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-purple-600 to-violet-700 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <BookOpen className="h-6 w-6" />
                    Certifications & Training
                  </CardTitle>
                  <CardDescription className="text-purple-100">
                    Manage your certifications, licenses, and training records.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  {/* Active Certifications */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                        <Award className="h-5 w-5 text-purple-600" />
                        Certifications
                      </Label>
                      <Button 
                        onClick={() => setShowAddCertModal(true)}
                        size="sm"
                        className="bg-gradient-to-r from-purple-600 to-violet-700 hover:from-purple-700 hover:to-violet-800 text-white"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Certification
                      </Button>
                    </div>
                    
                    {employeeData?.certifications && employeeData.certifications.length > 0 ? (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {employeeData.certifications.map((cert, index) => (
                          <div key={index} className="p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg border border-purple-100">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-semibold text-slate-800">{cert.name}</h4>
                              <div className="flex items-center gap-2">
                                <Badge className={cert.expirationDate && new Date(cert.expirationDate) > new Date() ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}>
                                  {cert.expirationDate && new Date(cert.expirationDate) > new Date() ? 'Active' : 'Expired'}
                                </Badge>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => deleteCertification(index)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-100"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <p className="text-sm text-slate-600 mb-1">Type: {cert.type}</p>
                            {cert.level && <p className="text-sm text-slate-600 mb-1">Level: {cert.level}</p>}
                            <p className="text-sm text-slate-600 mb-1">Issued: {new Date(cert.issueDate).toLocaleDateString()}</p>
                            {cert.expirationDate && (
                              <p className="text-sm text-slate-600">Expires: {new Date(cert.expirationDate).toLocaleDateString()}</p>
                            )}
                            {cert.certId && (
                              <p className="text-xs text-slate-500 mt-2">Cert #: {cert.certId}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 text-center bg-gradient-to-r from-gray-50 to-purple-50 rounded-lg border border-purple-100">
                        <Award className="h-12 w-12 text-purple-400 mx-auto mb-3" />
                        <p className="text-slate-600 mb-4">No certifications added yet</p>
                        <Button 
                          onClick={() => setShowAddCertModal(true)}
                          className="bg-gradient-to-r from-purple-600 to-violet-700 hover:from-purple-700 hover:to-violet-800 text-white"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Your First Certification
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Safety Training Records */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-emerald-600" />
                        Safety Training Records
                      </Label>
                      <Button 
                        onClick={() => setShowAddTrainingModal(true)}
                        size="sm"
                        className="bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Training
                      </Button>
                    </div>
                    
                    {employeeData?.safetyTrainingRecords && employeeData.safetyTrainingRecords.length > 0 ? (
                      <div className="space-y-3">
                        {employeeData.safetyTrainingRecords.slice(0, 5).map((training, index) => (
                          <div key={index} className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border border-emerald-100">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-semibold text-slate-800">{training.name}</h4>
                                <p className="text-sm text-slate-600">Completed: {new Date(training.completedOn).toLocaleDateString()}</p>
                                {training.renewBy && (
                                  <p className="text-sm text-slate-600">Renew by: {new Date(training.renewBy).toLocaleDateString()}</p>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className="bg-emerald-100 text-emerald-700">Completed</Badge>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 text-center bg-gradient-to-r from-gray-50 to-emerald-50 rounded-lg border border-emerald-100">
                        <BookOpen className="h-12 w-12 text-emerald-400 mx-auto mb-3" />
                        <p className="text-slate-600 mb-4">No training records added yet</p>
                        <Button 
                          onClick={() => setShowAddTrainingModal(true)}
                          className="bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Your First Training Record
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Driver's License */}
                  {employeeData?.driversLicense && (
                    <div className="space-y-3">
                      <Label className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                        <FileText className="h-5 w-5 text-blue-600" />
                        Driver's License
                      </Label>
                      <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-slate-600">License Number</p>
                            <p className="text-lg font-semibold text-slate-800">{employeeData.driversLicense.number}</p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-600">State</p>
                            <p className="text-lg font-semibold text-slate-800">{employeeData.driversLicense.state}</p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-600">Type</p>
                            <p className="text-lg font-semibold text-slate-800">{employeeData.driversLicense.type || 'Standard'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-600">Expires</p>
                            <p className="text-lg font-semibold text-slate-800">{new Date(employeeData.driversLicense.expiration).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-6 border border-purple-200 rounded-xl bg-gradient-to-r from-purple-50 to-violet-50 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center gap-4">
                        <div className="bg-gradient-to-br from-purple-600 to-violet-700 text-white rounded-full w-12 h-12 flex items-center justify-center">
                          <FileText className="h-6 w-6" />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-slate-800">Upload Documents</h4>
                          <p className="text-slate-600">Upload new certification documents</p>
                        </div>
                      </div>
                      <Badge className="bg-gradient-to-r from-purple-600 to-violet-700 text-white border-0 shadow-lg px-4 py-2">
                        {employeeData?.certifications?.length || 0} total
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-6 border border-emerald-200 rounded-xl bg-gradient-to-r from-emerald-50 to-green-50 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center gap-4">
                        <div className="bg-gradient-to-br from-emerald-600 to-green-700 text-white rounded-full w-12 h-12 flex items-center justify-center">
                          <Clock className="h-6 w-6" />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-slate-800">Renewal Reminders</h4>
                          <p className="text-slate-600">Track expiration dates and renewals</p>
                        </div>
                      </div>
                      <Badge className="bg-gradient-to-r from-emerald-600 to-green-700 text-white border-0 shadow-lg px-4 py-2">
                        {employeeData?.certifications?.filter(cert => {
                          if (!cert.expirationDate) return false;
                          const expirationDate = new Date(cert.expirationDate);
                          const threeMonthsFromNow = new Date();
                          threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
                          return expirationDate <= threeMonthsFromNow;
                        }).length || 0} expiring soon
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Safety Tab */}
            <TabsContent value="safety" className="space-y-6">
              <Card className="border-0 shadow-xl bg-gradient-to-br from-white/95 to-red-50/95 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-red-600 to-orange-700 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <AlertTriangle className="h-6 w-6" />
                    Safety & Health Records
                  </CardTitle>
                  <CardDescription className="text-red-100">
                    Manage your safety records, training, and health information.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  {/* Drug Tests */}
                  {employeeData?.drugTests && employeeData.drugTests.length > 0 && (
                    <div className="space-y-3">
                      <Label className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                        <Stethoscope className="h-5 w-5 text-green-600" />
                        Drug Test Records
                      </Label>
                      <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-100">
                        <div className="space-y-3">
                          {employeeData.drugTests.slice(0, 3).map((test, index) => (
                            <div key={index} className="flex justify-between items-center p-3 bg-white rounded-lg border border-green-200">
                              <div>
                                <p className="text-sm text-slate-600">Test Date: {new Date(test.date).toLocaleDateString()}</p>
                              </div>
                              <Badge className={test.result === 'Pass' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}>
                                {test.result}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Background Check */}
                  {employeeData?.backgroundCheck && (
                    <div className="space-y-3">
                      <Label className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                        <Shield className="h-5 w-5 text-blue-600" />
                        Background Check
                      </Label>
                      <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-slate-600">Check Date</p>
                            <p className="text-lg font-semibold text-slate-800">{new Date(employeeData.backgroundCheck.date).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-600">Status</p>
                            <Badge className={employeeData.backgroundCheck.passed ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}>
                              {employeeData.backgroundCheck.passed ? 'Passed' : 'Failed'}
                            </Badge>
                          </div>
                          {employeeData.backgroundCheck.notes && (
                            <div className="col-span-2">
                              <p className="text-sm text-slate-600">Notes</p>
                              <p className="text-slate-800">{employeeData.backgroundCheck.notes}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Safety Incidents */}
                  {employeeData?.incidents && employeeData.incidents.length > 0 && (
                    <div className="space-y-3">
                      <Label className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                        Safety Incidents
                      </Label>
                      <div className="space-y-3">
                        {employeeData.incidents.slice(0, 3).map((incident, index) => (
                          <div key={index} className="p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border border-red-100">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <p className="text-sm text-slate-600 mb-1">Date: {new Date(incident.date).toLocaleDateString()}</p>
                                <p className="text-sm text-slate-800">{incident.description}</p>
                                {incident.outcome && (
                                  <p className="text-xs text-slate-500 mt-2">Outcome: {incident.outcome}</p>
                                )}
                              </div>
                              <Badge className="bg-red-100 text-red-700">Incident</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-6 border border-red-200 rounded-xl bg-gradient-to-r from-red-50 to-orange-50 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center gap-4">
                        <div className="bg-gradient-to-br from-red-600 to-orange-700 text-white rounded-full w-12 h-12 flex items-center justify-center">
                          <AlertTriangle className="h-6 w-6" />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-slate-800">Report Incident</h4>
                          <p className="text-slate-600">Report a new safety incident or near miss</p>
                        </div>
                      </div>
                      <Badge className="bg-gradient-to-r from-red-600 to-orange-700 text-white border-0 shadow-lg px-4 py-2">
                        {employeeData?.incidents?.length || 0} total incidents
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-6 border border-emerald-200 rounded-xl bg-gradient-to-r from-emerald-50 to-green-50 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center gap-4">
                        <div className="bg-gradient-to-br from-emerald-600 to-green-700 text-white rounded-full w-12 h-12 flex items-center justify-center">
                          <HardHat className="h-6 w-6" />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-slate-800">Safety Resources</h4>
                          <p className="text-slate-600">Access safety manuals and training materials</p>
                        </div>
                      </div>
                      <Badge className="bg-gradient-to-r from-emerald-600 to-green-700 text-white border-0 shadow-lg px-4 py-2">
                        {employeeData?.safetyTrainingRecords?.length || 0} courses completed
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Account Settings Tab */}
            <TabsContent value="account" className="space-y-6">
              <Card className="border-0 shadow-xl bg-gradient-to-br from-white/95 to-slate-50/95 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-slate-600 to-gray-700 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Settings className="h-6 w-6" />
                    Account Settings
                  </CardTitle>
                  <CardDescription className="text-slate-100">
                    Manage your account preferences and security settings.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-6 border border-slate-200 rounded-xl bg-gradient-to-r from-slate-50 to-gray-50 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center gap-4">
                        <div className="bg-gradient-to-br from-slate-600 to-gray-700 text-white rounded-full w-12 h-12 flex items-center justify-center">
                          <User className="h-6 w-6" />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-slate-800">Profile Type</h4>
                          <p className="text-slate-600">Choose between individual or company profile</p>
                        </div>
                      </div>
                      <Badge className="bg-gradient-to-r from-slate-600 to-gray-700 text-white border-0 shadow-lg px-4 py-2">
                        {profileData.profileType === 'company' ? 'Company' : 'Individual'}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-6 border border-emerald-200 rounded-xl bg-gradient-to-r from-emerald-50 to-green-50 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center gap-4">
                        <div className="bg-gradient-to-br from-emerald-600 to-green-700 text-white rounded-full w-12 h-12 flex items-center justify-center">
                          <Shield className="h-6 w-6" />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-slate-800">Security Level</h4>
                          <p className="text-slate-600">Your current system access permissions</p>
                        </div>
                      </div>
                      <Badge className="bg-gradient-to-r from-emerald-600 to-green-700 text-white border-0 shadow-lg px-4 py-2">
                        {userProfile?.role === 'admin' ? 'Administrator' : 'Standard User'}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-6 border border-blue-200 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center gap-4">
                        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-full w-12 h-12 flex items-center justify-center">
                          <Clock className="h-6 w-6" />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-slate-800">Account Status</h4>
                          <p className="text-slate-600">Your account verification and status</p>
                        </div>
                      </div>
                      <Badge className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white border-0 shadow-lg px-4 py-2">
                        Active & Verified
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Loading Overlay for Employee Data */}
      {loadingEmployee && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 shadow-2xl">
            <div className="flex items-center space-x-4">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <p className="text-lg font-medium text-slate-800">Loading comprehensive employee data...</p>
            </div>
          </div>
        </div>
      )}

      {/* Edit Personal Information Modal */}
      <Dialog open={showEditPersonalModal} onOpenChange={setShowEditPersonalModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5 text-blue-600" />
              Edit Personal Information
            </DialogTitle>
            <DialogDescription>
              Update your personal and professional details.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-fullName">Full Name</Label>
                <Input
                  id="edit-fullName"
                  value={personalInfo.fullName}
                  onChange={(e) => setPersonalInfo({...personalInfo, fullName: e.target.value})}
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={personalInfo.email}
                  onChange={(e) => setPersonalInfo({...personalInfo, email: e.target.value})}
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-phone">Phone Number</Label>
                <Input
                  id="edit-phone"
                  value={personalInfo.phoneMobile}
                  onChange={(e) => setPersonalInfo({...personalInfo, phoneMobile: e.target.value})}
                  placeholder="(555) 123-4567"
                />
              </div>
              <div>
                <Label htmlFor="edit-location">Location</Label>
                <Input
                  id="edit-location"
                  value={personalInfo.location}
                  onChange={(e) => setPersonalInfo({...personalInfo, location: e.target.value})}
                  placeholder="City, State"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-jobTitle">Job Title</Label>
                <Input
                  id="edit-jobTitle"
                  value={personalInfo.jobTitle}
                  onChange={(e) => setPersonalInfo({...personalInfo, jobTitle: e.target.value})}
                  placeholder="Your job title"
                />
              </div>
              <div>
                <Label htmlFor="edit-primaryTrade">Primary Trade</Label>
                <Input
                  id="edit-primaryTrade"
                  value={personalInfo.primaryTrade}
                  onChange={(e) => setPersonalInfo({...personalInfo, primaryTrade: e.target.value})}
                  placeholder="Your primary trade"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="edit-skillLevel">Skill Level</Label>
              <Select value={personalInfo.skillLevel} onValueChange={(value: 'Apprentice' | 'Journeyman' | 'Master' | 'Supervisor') => setPersonalInfo({...personalInfo, skillLevel: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your skill level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Apprentice">Apprentice</SelectItem>
                  <SelectItem value="Journeyman">Journeyman</SelectItem>
                  <SelectItem value="Master">Master</SelectItem>
                  <SelectItem value="Supervisor">Supervisor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="edit-bio">Professional Bio</Label>
              <Textarea
                id="edit-bio"
                value={personalInfo.bio}
                onChange={(e) => setPersonalInfo({...personalInfo, bio: e.target.value})}
                placeholder="Tell us about your construction experience and expertise..."
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditPersonalModal(false)}>
              Cancel
            </Button>
            <Button 
              onClick={savePersonalInfo} 
              disabled={saving}
              className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Emergency Contact Modal */}
      <Dialog open={showAddContactModal} onOpenChange={setShowAddContactModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-red-600" />
              Add Emergency Contact
            </DialogTitle>
            <DialogDescription>
              Add a new emergency contact to your profile.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="contact-name">Full Name</Label>
              <Input
                id="contact-name"
                value={newEmergencyContact.name}
                onChange={(e) => setNewEmergencyContact({...newEmergencyContact, name: e.target.value})}
                placeholder="Contact's full name"
              />
            </div>
            <div>
              <Label htmlFor="contact-relationship">Relationship</Label>
              <Input
                id="contact-relationship"
                value={newEmergencyContact.relationship}
                onChange={(e) => setNewEmergencyContact({...newEmergencyContact, relationship: e.target.value})}
                placeholder="e.g., Spouse, Parent, Sibling"
              />
            </div>
            <div>
              <Label htmlFor="contact-phone">Phone Number</Label>
              <Input
                id="contact-phone"
                value={newEmergencyContact.phone}
                onChange={(e) => setNewEmergencyContact({...newEmergencyContact, phone: e.target.value})}
                placeholder="(555) 123-4567"
              />
            </div>
            <div>
              <Label htmlFor="contact-address">Address (Optional)</Label>
              <Input
                id="contact-address"
                value={newEmergencyContact.address}
                onChange={(e) => setNewEmergencyContact({...newEmergencyContact, address: e.target.value})}
                placeholder="Street address"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddContactModal(false)}>
              Cancel
            </Button>
            <Button 
              onClick={addEmergencyContact} 
              disabled={saving || !newEmergencyContact.name || !newEmergencyContact.phone}
              className="bg-gradient-to-r from-red-600 to-orange-700 hover:from-red-700 hover:to-orange-800 text-white"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
              Add Contact
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Certification Modal */}
      <Dialog open={showAddCertModal} onOpenChange={setShowAddCertModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-purple-600" />
              Add Certification
            </DialogTitle>
            <DialogDescription>
              Add a new certification to your profile.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="cert-name">Certification Name</Label>
              <Input
                id="cert-name"
                value={newCertification.name}
                onChange={(e) => setNewCertification({...newCertification, name: e.target.value})}
                placeholder="e.g., OSHA 30-Hour Construction"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cert-type">Type</Label>
                <Select value={newCertification.type} onValueChange={(value: 'OSHA' | 'Safety' | 'Equipment' | 'Trade' | 'Other') => setNewCertification({...newCertification, type: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select certification type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OSHA">OSHA</SelectItem>
                    <SelectItem value="Safety">Safety</SelectItem>
                    <SelectItem value="Equipment">Equipment</SelectItem>
                    <SelectItem value="Trade">Trade</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="cert-level">Level (Optional)</Label>
                <Input
                  id="cert-level"
                  value={newCertification.level}
                  onChange={(e) => setNewCertification({...newCertification, level: e.target.value})}
                  placeholder="e.g., Level 1, Advanced"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cert-issueDate">Issue Date</Label>
                <Input
                  id="cert-issueDate"
                  type="date"
                  value={newCertification.issueDate}
                  onChange={(e) => setNewCertification({...newCertification, issueDate: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="cert-expirationDate">Expiration Date (Optional)</Label>
                <Input
                  id="cert-expirationDate"
                  type="date"
                  value={newCertification.expirationDate}
                  onChange={(e) => setNewCertification({...newCertification, expirationDate: e.target.value})}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="cert-id">Certification ID (Optional)</Label>
              <Input
                id="cert-id"
                value={newCertification.certId}
                onChange={(e) => setNewCertification({...newCertification, certId: e.target.value})}
                placeholder="Certificate number or ID"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddCertModal(false)}>
              Cancel
            </Button>
            <Button 
              onClick={addCertification} 
              disabled={saving || !newCertification.name || !newCertification.issueDate}
              className="bg-gradient-to-r from-purple-600 to-violet-700 hover:from-purple-700 hover:to-violet-800 text-white"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
              Add Certification
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Training Modal */}
      <Dialog open={showAddTrainingModal} onOpenChange={setShowAddTrainingModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-emerald-600" />
              Add Training Record
            </DialogTitle>
            <DialogDescription>
              Add a new safety training record to your profile.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="training-name">Training Name</Label>
              <Input
                id="training-name"
                value={newTraining.name}
                onChange={(e) => setNewTraining({...newTraining, name: e.target.value})}
                placeholder="e.g., Fall Protection Training"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="training-completed">Completion Date</Label>
                <Input
                  id="training-completed"
                  type="date"
                  value={newTraining.completedOn}
                  onChange={(e) => setNewTraining({...newTraining, completedOn: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="training-renew">Renewal Date (Optional)</Label>
                <Input
                  id="training-renew"
                  type="date"
                  value={newTraining.renewBy}
                  onChange={(e) => setNewTraining({...newTraining, renewBy: e.target.value})}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddTrainingModal(false)}>
              Cancel
            </Button>
            <Button 
              onClick={addTraining} 
              disabled={saving || !newTraining.name || !newTraining.completedOn}
              className="bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
              Add Training
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 