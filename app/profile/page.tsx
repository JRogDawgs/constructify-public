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
  X
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading profile...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
              <AvatarFallback className="text-lg">
                {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold">
                {profileData.displayName || 'Your Profile'}
              </h1>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant={profileData.profileType === 'company' ? 'default' : 'secondary'}>
                  {profileData.profileType === 'company' ? (
                    <>
                      <Building2 className="h-3 w-3 mr-1" />
                      Company Profile
                    </>
                  ) : (
                    <>
                      <User className="h-3 w-3 mr-1" />
                      Individual Profile
                    </>
                  )}
                </Badge>
                {userProfile?.role === 'admin' && (
                  <Badge variant="destructive">
                    <Shield className="h-3 w-3 mr-1" />
                    Admin
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex space-x-2">
            {isEditing ? (
              <>
                <Button onClick={handleSave} size="sm">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
                <Button onClick={handleCancel} variant="outline" size="sm">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)} size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>

        {/* Profile Content */}
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="professional">Professional</TabsTrigger>
            <TabsTrigger value="account">Account Settings</TabsTrigger>
          </TabsList>

          {/* Personal Information Tab */}
          <TabsContent value="personal" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Your basic profile information and contact details.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Full Name</Label>
                    {isEditing ? (
                      <Input
                        id="displayName"
                        value={profileData.displayName}
                        onChange={(e) => setProfileData({...profileData, displayName: e.target.value})}
                      />
                    ) : (
                      <div className="flex items-center space-x-2 p-2 bg-muted rounded">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{profileData.displayName || 'Not set'}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="flex items-center space-x-2 p-2 bg-muted rounded">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{profileData.email}</span>
                      <Badge variant="outline" className="ml-auto text-xs">Verified</Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                        placeholder="(555) 123-4567"
                      />
                    ) : (
                      <div className="flex items-center space-x-2 p-2 bg-muted rounded">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{profileData.phone || 'Not set'}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    {isEditing ? (
                      <Input
                        id="location"
                        value={profileData.location}
                        onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                        placeholder="City, State"
                      />
                    ) : (
                      <div className="flex items-center space-x-2 p-2 bg-muted rounded">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{profileData.location || 'Not set'}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  {isEditing ? (
                    <Textarea
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                      placeholder="Tell us about yourself..."
                      rows={3}
                    />
                  ) : (
                    <div className="p-3 bg-muted rounded min-h-[80px]">
                      <p className="text-sm">
                        {profileData.bio || 'No bio provided yet.'}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Professional Information Tab */}
          <TabsContent value="professional" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Professional Information</CardTitle>
                <CardDescription>
                  Your work experience and professional details.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    {isEditing ? (
                      <Input
                        id="company"
                        value={profileData.company}
                        onChange={(e) => setProfileData({...profileData, company: e.target.value})}
                        placeholder="Company Name"
                      />
                    ) : (
                      <div className="flex items-center space-x-2 p-2 bg-muted rounded">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span>{profileData.company || 'Not set'}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="position">Position/Title</Label>
                    {isEditing ? (
                      <Input
                        id="position"
                        value={profileData.position}
                        onChange={(e) => setProfileData({...profileData, position: e.target.value})}
                        placeholder="Job Title"
                      />
                    ) : (
                      <div className="flex items-center space-x-2 p-2 bg-muted rounded">
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                        <span>{profileData.position || 'Not set'}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Account Stats */}
                <div className="pt-4 border-t">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {userProfile?.createdAt ? new Date(userProfile.createdAt.toDate()).getFullYear() : new Date().getFullYear()}
                      </div>
                      <div className="text-sm text-muted-foreground">Member Since</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">0</div>
                      <div className="text-sm text-muted-foreground">Projects</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {userProfile?.role === 'admin' ? '∞' : '0'}
                      </div>
                      <div className="text-sm text-muted-foreground">Access Level</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {userProfile?.lastLoginAt ? 'Active' : 'New'}
                      </div>
                      <div className="text-sm text-muted-foreground">Status</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Account Settings Tab */}
          <TabsContent value="account" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your account preferences and security settings.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Profile Type</h4>
                      <p className="text-sm text-muted-foreground">
                        Choose between individual or company profile
                      </p>
                    </div>
                    <Badge variant={profileData.profileType === 'company' ? 'default' : 'secondary'}>
                      {profileData.profileType === 'company' ? 'Company' : 'Individual'}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Account Status</h4>
                      <p className="text-sm text-muted-foreground">
                        Your account is active and verified
                      </p>
                    </div>
                    <Badge variant="default">Active</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Data Export</h4>
                      <p className="text-sm text-muted-foreground">
                        Download your account data and activity
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Export Data
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 