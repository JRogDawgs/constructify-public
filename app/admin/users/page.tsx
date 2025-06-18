'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/Google Auth/AuthContext';
import { useRouter } from 'next/navigation';
import UserTable from '@/components/Admin/UserTable';
import { getAllUsers } from '@/utils/firestore/adminService';
import { UserProfile } from '@/components/Google Auth/userService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Shield, Users } from 'lucide-react';

export default function AdminUsersPage() {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check authentication and admin role
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/');
        return;
      }
      
      // Check if user has admin role (for now, we'll check if email contains 'admin' or specific emails)
      // TODO: Implement proper role-based access control
      const isAdmin = userProfile?.email?.includes('admin') || 
                     userProfile?.email === 'jeff.rogers@example.com' || // Replace with your admin email
                     userProfile?.role === 'admin';
      
      if (!isAdmin) {
        router.push('/');
        return;
      }
    }
  }, [user, userProfile, loading, router]);

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      if (!user || loading) return;
      
      try {
        setLoadingUsers(true);
        setError(null);
        const allUsers = await getAllUsers();
        setUsers(allUsers);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users. Please try again.');
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, [user, loading]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  // Show unauthorized if not logged in or not admin
  if (!user || !userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center space-x-2 text-red-600">
              <Shield className="h-6 w-6" />
              <span>Unauthorized Access</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-2">
          <Users className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        </div>
        <p className="text-gray-600">Manage users and system settings</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>User Management</span>
          </CardTitle>
          <CardDescription>
            View and manage all registered users in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600">{error}</p>
            </div>
          )}
          
          {loadingUsers ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center space-x-2">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span>Loading users...</span>
              </div>
            </div>
          ) : (
            <UserTable users={users} />
          )}
        </CardContent>
      </Card>
    </div>
  );
} 