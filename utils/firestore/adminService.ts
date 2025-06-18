import { collection, getDocs, query, orderBy, limit, startAfter, DocumentSnapshot } from 'firebase/firestore';
import { db } from '@/components/Google Auth/firebase';
import { UserProfile } from '@/components/Google Auth/userService';

/**
 * Admin service for managing users and system operations
 * These functions should only be called by authenticated admin users
 */

/**
 * Get all users from Firestore
 * @param limitCount - Number of users to fetch (default: 100)
 * @param lastDoc - Last document for pagination
 * @returns Promise<UserProfile[]>
 */
export async function getAllUsers(limitCount: number = 100, lastDoc?: DocumentSnapshot): Promise<UserProfile[]> {
  try {
    console.log('🔍 Fetching all users from Firestore...');
    
    const usersRef = collection(db, 'users');
    
    // Build query with ordering and pagination
    let q = query(
      usersRef,
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    // Add pagination if lastDoc is provided
    if (lastDoc) {
      q = query(
        usersRef,
        orderBy('createdAt', 'desc'),
        startAfter(lastDoc),
        limit(limitCount)
      );
    }
    
    const querySnapshot = await getDocs(q);
    
    const users: UserProfile[] = [];
    querySnapshot.forEach((doc) => {
      const userData = doc.data() as UserProfile;
      users.push({
        ...userData,
        uid: doc.id, // Ensure UID is set from document ID
      });
    });
    
    console.log(`✅ Successfully fetched ${users.length} users`);
    return users;
    
  } catch (error) {
    console.error('❌ Error fetching users:', error);
    throw new Error('Failed to fetch users from database');
  }
}

/**
 * Get users with pagination support
 * @param page - Page number (1-based)
 * @param pageSize - Number of users per page
 * @returns Promise<{ users: UserProfile[], hasMore: boolean, lastDoc?: DocumentSnapshot }>
 */
export async function getUsersPaginated(
  page: number = 1, 
  pageSize: number = 10
): Promise<{ users: UserProfile[], hasMore: boolean, lastDoc?: DocumentSnapshot }> {
  try {
    console.log(`🔍 Fetching users page ${page} with ${pageSize} users per page...`);
    
    const usersRef = collection(db, 'users');
    const q = query(
      usersRef,
      orderBy('createdAt', 'desc'),
      limit(pageSize)
    );
    
    const querySnapshot = await getDocs(q);
    
    const users: UserProfile[] = [];
    let lastDoc: DocumentSnapshot | undefined;
    
    querySnapshot.forEach((doc) => {
      const userData = doc.data() as UserProfile;
      users.push({
        ...userData,
        uid: doc.id,
      });
      lastDoc = doc;
    });
    
    // Check if there are more users
    const hasMore = users.length === pageSize;
    
    console.log(`✅ Successfully fetched ${users.length} users for page ${page}`);
    return { users, hasMore, lastDoc };
    
  } catch (error) {
    console.error('❌ Error fetching paginated users:', error);
    throw new Error('Failed to fetch paginated users from database');
  }
}

/**
 * Get user statistics
 * @returns Promise<{ totalUsers: number, adminUsers: number, recentLogins: number }>
 */
export async function getUserStats(): Promise<{
  totalUsers: number;
  adminUsers: number;
  recentLogins: number;
}> {
  try {
    console.log('📊 Fetching user statistics...');
    
    const users = await getAllUsers(1000); // Get up to 1000 users for stats
    
    const totalUsers = users.length;
    const adminUsers = users.filter(user => user.role === 'admin').length;
    
    // Count users who logged in within the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentLogins = users.filter(user => {
      if (!user.lastLoginAt) return false;
      
      try {
        const loginDate = user.lastLoginAt.toDate ? user.lastLoginAt.toDate() : new Date(user.lastLoginAt);
        return loginDate > sevenDaysAgo;
      } catch {
        return false;
      }
    }).length;
    
    const stats = { totalUsers, adminUsers, recentLogins };
    console.log('✅ User statistics:', stats);
    
    return stats;
    
  } catch (error) {
    console.error('❌ Error fetching user statistics:', error);
    throw new Error('Failed to fetch user statistics');
  }
}

/**
 * Search users by email or display name
 * @param searchTerm - Search term to match against email or display name
 * @param limitCount - Maximum number of results to return
 * @returns Promise<UserProfile[]>
 */
export async function searchUsers(searchTerm: string, limitCount: number = 50): Promise<UserProfile[]> {
  try {
    console.log(`🔍 Searching users for term: "${searchTerm}"`);
    
    // Note: Firestore doesn't support full-text search natively
    // For production, consider using Algolia, Elasticsearch, or Firebase Extensions
    // This is a basic implementation that fetches all users and filters client-side
    
    const allUsers = await getAllUsers(1000); // Fetch more users for search
    
    const searchTermLower = searchTerm.toLowerCase();
    const filteredUsers = allUsers.filter(user => {
      const email = user.email?.toLowerCase() || '';
      const displayName = user.displayName?.toLowerCase() || '';
      
      return email.includes(searchTermLower) || displayName.includes(searchTermLower);
    }).slice(0, limitCount);
    
    console.log(`✅ Found ${filteredUsers.length} users matching "${searchTerm}"`);
    return filteredUsers;
    
  } catch (error) {
    console.error('❌ Error searching users:', error);
    throw new Error('Failed to search users');
  }
}

/**
 * Update user role (admin only)
 * @param userId - User ID to update
 * @param newRole - New role to assign
 * @returns Promise<void>
 */
export async function updateUserRole(userId: string, newRole: string): Promise<void> {
  try {
    console.log(`🔄 Updating user ${userId} role to ${newRole}...`);
    
    // Import updateDoc here to avoid circular dependencies
    const { doc, updateDoc } = await import('firebase/firestore');
    
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      role: newRole,
      updatedAt: new Date(),
    });
    
    console.log(`✅ Successfully updated user ${userId} role to ${newRole}`);
    
  } catch (error) {
    console.error('❌ Error updating user role:', error);
    throw new Error('Failed to update user role');
  }
}

/**
 * Get admin-specific user data
 * Note: This would typically include additional fields not exposed to regular users
 * @param userId - User ID to fetch
 * @returns Promise<UserProfile | null>
 */
export async function getAdminUserData(userId: string): Promise<UserProfile | null> {
  try {
    console.log(`🔍 Fetching admin data for user ${userId}...`);
    
    const { doc, getDoc } = await import('firebase/firestore');
    
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      console.log(`❌ User ${userId} not found`);
      return null;
    }
    
    const userData = userSnap.data() as UserProfile;
    console.log(`✅ Successfully fetched admin data for user ${userId}`);
    
    return {
      ...userData,
      uid: userSnap.id,
    };
    
  } catch (error) {
    console.error('❌ Error fetching admin user data:', error);
    throw new Error('Failed to fetch user data');
  }
} 