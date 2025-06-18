'use client';

import { useAuth } from '@/components/Google Auth/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Users
} from 'lucide-react';
import { Loader2 } from 'lucide-react';

export default function ProfilePage() {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
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
          <p className="text-xl text-white font-medium">Building your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
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
                  {profileData.displayName || 'Your Profile'}
                </h1>
                <p className="text-xl text-blue-100 mb-6 font-medium">
                  {profileData.position || 'Construction Professional'}
                </p>
                
                <div className="flex flex-wrap gap-3 mb-8 justify-center lg:justify-start">
                  <Badge className="bg-gradient-to-r from-blue-600/80 to-slate-600/80 hover:from-blue-500/90 hover:to-slate-500/90 text-white border-white/20 backdrop-blur-sm transition-all duration-300 px-4 py-2">
                    {profileData.profileType === 'company' ? (
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
                    Verified Member
                  </Badge>
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
                    <Button 
                      onClick={() => setIsEditing(true)} 
                      className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white border-0 shadow-lg transform hover:scale-105 transition-all duration-200 px-6 py-3"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
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
                  {userProfile?.createdAt ? new Date().getFullYear() - new Date(userProfile.createdAt.toDate()).getFullYear() + 1 : 1}
                </div>
                <div className="text-sm text-slate-600 font-medium">Years Active</div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-xl bg-gradient-to-br from-white/95 to-emerald-50/95 backdrop-blur-sm hover:scale-105 transition-transform duration-300">
              <CardContent className="p-6 text-center">
                <div className="bg-gradient-to-br from-emerald-600 to-green-700 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <Target className="h-6 w-6" />
                </div>
                <div className="text-2xl font-bold text-emerald-800">12</div>
                <div className="text-sm text-slate-600 font-medium">Projects</div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-xl bg-gradient-to-br from-white/95 to-amber-50/95 backdrop-blur-sm hover:scale-105 transition-transform duration-300">
              <CardContent className="p-6 text-center">
                <div className="bg-gradient-to-br from-amber-600 to-yellow-700 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <Award className="h-6 w-6" />
                </div>
                <div className="text-2xl font-bold text-amber-800">8</div>
                <div className="text-sm text-slate-600 font-medium">Certifications</div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-xl bg-gradient-to-br from-white/95 to-slate-50/95 backdrop-blur-sm hover:scale-105 transition-transform duration-300">
              <CardContent className="p-6 text-center">
                <div className="bg-gradient-to-br from-slate-600 to-gray-700 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div className="text-2xl font-bold text-slate-800">
                  {userProfile?.role === 'admin' ? 'MAX' : 'L3'}
                </div>
                <div className="text-sm text-slate-600 font-medium">Access Level</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Professional Tabs Section */}
      <div className="px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="personal" className="space-y-8">
            <TabsList className="grid w-full grid-cols-3 bg-gradient-to-r from-slate-800/90 to-blue-900/90 backdrop-blur-sm border border-white/10 p-2 rounded-xl">
              <TabsTrigger 
                value="personal" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-700 data-[state=active]:text-white text-blue-100 font-medium transition-all duration-200"
              >
                Personal Information
              </TabsTrigger>
              <TabsTrigger 
                value="professional" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-green-700 data-[state=active]:text-white text-blue-100 font-medium transition-all duration-200"
              >
                Professional
              </TabsTrigger>
              <TabsTrigger 
                value="account" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-600 data-[state=active]:to-yellow-700 data-[state=active]:text-white text-blue-100 font-medium transition-all duration-200"
              >
                Account Settings
              </TabsTrigger>
            </TabsList>

            {/* Personal Information Tab */}
            <TabsContent value="personal" className="space-y-6">
              <Card className="border-0 shadow-xl bg-gradient-to-br from-white/95 to-blue-50/95 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <User className="h-6 w-6" />
                    Personal Information
                  </CardTitle>
                  <CardDescription className="text-blue-100">
                    Your personal details and contact information.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="displayName" className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                        <User className="h-5 w-5 text-blue-600" />
                        Full Name
                      </Label>
                      {isEditing ? (
                        <Input
                          id="displayName"
                          value={profileData.displayName}
                          onChange={(e) => setProfileData({...profileData, displayName: e.target.value})}
                          placeholder="Enter your full name"
                          className="border-2 border-blue-200 focus:border-blue-600 rounded-lg p-3 text-lg transition-all duration-200"
                        />
                      ) : (
                        <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-blue-100 hover:shadow-md transition-all duration-200">
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          <span className="text-lg font-medium text-slate-800">{profileData.displayName || 'Not set'}</span>
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
                        <span className="text-lg font-medium text-slate-800">{profileData.email}</span>
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
                          value={profileData.phone}
                          onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                          placeholder="(555) 123-4567"
                          className="border-2 border-amber-200 focus:border-amber-600 rounded-lg p-3 text-lg transition-all duration-200"
                        />
                      ) : (
                        <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-gray-50 to-amber-50 rounded-lg border border-amber-100 hover:shadow-md transition-all duration-200">
                          <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
                          <span className="text-lg font-medium text-slate-800">{profileData.phone || 'Not set'}</span>
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
                          value={profileData.location}
                          onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                          placeholder="City, State"
                          className="border-2 border-slate-200 focus:border-slate-600 rounded-lg p-3 text-lg transition-all duration-200"
                        />
                      ) : (
                        <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg border border-slate-100 hover:shadow-md transition-all duration-200">
                          <div className="w-2 h-2 bg-slate-600 rounded-full"></div>
                          <span className="text-lg font-medium text-slate-800">{profileData.location || 'Not set'}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="bio" className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                      <Users className="h-5 w-5 text-blue-600" />
                      Professional Bio
                    </Label>
                    {isEditing ? (
                      <Textarea
                        id="bio"
                        value={profileData.bio}
                        onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                        placeholder="Tell us about your construction experience and expertise..."
                        rows={4}
                        className="border-2 border-blue-200 focus:border-blue-600 rounded-lg p-4 text-lg transition-all duration-200 resize-none"
                      />
                    ) : (
                      <div className="p-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg border border-blue-100 hover:shadow-md transition-all duration-200 min-h-[120px]">
                        <p className="text-lg leading-relaxed text-slate-700">
                          {profileData.bio || 'Add your professional bio to showcase your construction expertise and experience.'}
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
                      <Label htmlFor="company" className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-emerald-600" />
                        Company
                      </Label>
                      {isEditing ? (
                        <Input
                          id="company"
                          value={profileData.company}
                          onChange={(e) => setProfileData({...profileData, company: e.target.value})}
                          placeholder="Construction Company Name"
                          className="border-2 border-emerald-200 focus:border-emerald-600 rounded-lg p-3 text-lg transition-all duration-200"
                        />
                      ) : (
                        <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-gray-50 to-emerald-50 rounded-lg border border-emerald-100 hover:shadow-md transition-all duration-200">
                          <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                          <span className="text-lg font-medium text-slate-800">{profileData.company || 'Not set'}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="position" className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                        <HardHat className="h-5 w-5 text-amber-600" />
                        Position/Title
                      </Label>
                      {isEditing ? (
                        <Input
                          id="position"
                          value={profileData.position}
                          onChange={(e) => setProfileData({...profileData, position: e.target.value})}
                          placeholder="Job Title"
                          className="border-2 border-amber-200 focus:border-amber-600 rounded-lg p-3 text-lg transition-all duration-200"
                        />
                      ) : (
                        <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-gray-50 to-amber-50 rounded-lg border border-amber-100 hover:shadow-md transition-all duration-200">
                          <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
                          <span className="text-lg font-medium text-slate-800">{profileData.position || 'Not set'}</span>
                        </div>
                      )}
                    </div>
                  </div>

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
                          {userProfile?.createdAt ? new Date().getFullYear() - new Date(userProfile.createdAt.toDate()).getFullYear() + 1 : 1}
                        </div>
                        <div className="text-sm text-slate-600 font-medium">Years Experience</div>
                      </div>
                      
                      <div className="text-center group hover:scale-105 transition-transform duration-200">
                        <div className="bg-gradient-to-br from-emerald-600 to-green-700 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:shadow-xl transition-shadow duration-200">
                          <Target className="h-8 w-8" />
                        </div>
                        <div className="text-3xl font-bold text-emerald-700">12</div>
                        <div className="text-sm text-slate-600 font-medium">Projects Completed</div>
                      </div>
                      
                      <div className="text-center group hover:scale-105 transition-transform duration-200">
                        <div className="bg-gradient-to-br from-amber-600 to-yellow-700 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:shadow-xl transition-shadow duration-200">
                          <Award className="h-8 w-8" />
                        </div>
                        <div className="text-3xl font-bold text-amber-700">8</div>
                        <div className="text-sm text-slate-600 font-medium">Certifications</div>
                      </div>
                      
                      <div className="text-center group hover:scale-105 transition-transform duration-200">
                        <div className="bg-gradient-to-br from-slate-600 to-gray-700 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:shadow-xl transition-shadow duration-200">
                          <TrendingUp className="h-8 w-8" />
                        </div>
                        <div className="text-3xl font-bold text-slate-700">
                          {userProfile?.role === 'admin' ? 'MAX' : 'L3'}
                        </div>
                        <div className="text-sm text-slate-600 font-medium">Security Level</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Account Settings Tab */}
            <TabsContent value="account" className="space-y-6">
              <Card className="border-0 shadow-xl bg-gradient-to-br from-white/95 to-amber-50/95 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-amber-600 to-yellow-700 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Settings className="h-6 w-6" />
                    Account Settings
                  </CardTitle>
                  <CardDescription className="text-amber-100">
                    Manage your account preferences and security settings.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-6 border border-amber-200 rounded-xl bg-gradient-to-r from-amber-50 to-yellow-50 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center gap-4">
                        <div className="bg-gradient-to-br from-amber-600 to-yellow-700 text-white rounded-full w-12 h-12 flex items-center justify-center">
                          <User className="h-6 w-6" />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-slate-800">Profile Type</h4>
                          <p className="text-slate-600">Choose between individual or company profile</p>
                        </div>
                      </div>
                      <Badge className="bg-gradient-to-r from-amber-600 to-yellow-700 text-white border-0 shadow-lg px-4 py-2">
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
    </div>
  );
} 