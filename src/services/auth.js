import AsyncStorage from '@react-native-async-storage/async-storage';



// In src/services/auth.js, update these constants:
const USER_KEY = 'user';           // Changed from '@user'
const TOKEN_KEY = 'token';         // Changed from '@token'
const EMAIL_KEY = 'email';         // Changed from '@email'
const PAID_STATUS_KEY = 'paid_status'; // Changed from '@paid_status'
const USER_ID_KEY = 'user_id';     // Changed from '@user_id'

export const authService = {
  // Login user
  login: async (email, password) => {
    try {
      // TODO: Replace with actual API call
      const mockUser = {
        id: '1',
        email,
        name: 'User Name',
        isPremium: false,
        country: 'India',
      };
      await AsyncStorage.multiSet([
        [USER_KEY, JSON.stringify(mockUser)],
        [TOKEN_KEY, 'mock_token_123'],
        [EMAIL_KEY, email],
        [PAID_STATUS_KEY, 'false'],
        [USER_ID_KEY, '1']
      ]);
      return { success: true, user: mockUser };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Signup user
  signup: async (name, email, password, country) => {
    try {
      // TODO: Replace with actual API call
      const mockUser = {
        id: '1',
        email,
        name,
        isPremium: false,
        country,
      };
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(mockUser));
      await AsyncStorage.setItem(TOKEN_KEY, 'mock_token_123');
      return { success: true, user: mockUser };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Logout user
  logout: async () => {
    try {
      await AsyncStorage.multiRemove([
        USER_KEY,
        TOKEN_KEY,
        EMAIL_KEY,
        PAID_STATUS_KEY,
        USER_ID_KEY
      ]);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const userJson = await AsyncStorage.getItem(USER_KEY);
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      return null;
    }
  },

  // Update user subscription status
  updateSubscription: async (isPremium) => {
    try {
      const userJson = await AsyncStorage.getItem(USER_KEY);
      if (userJson) {
        const user = JSON.parse(userJson);
        user.isPremium = isPremium;
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
        return { success: true, user };
      }
      return { success: false, error: 'User not found' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get authentication token
  getToken: async () => {
    try {
      return await AsyncStorage.getItem(TOKEN_KEY);
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  },

  // Get user email
  getEmail: async () => {
    try {
      return await AsyncStorage.getItem(EMAIL_KEY);
    } catch (error) {
      console.error('Error getting email:', error);
      return null;
    }
  },

  // Check if user is authenticated
  isAuthenticated: async () => {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      return !!token;
    } catch (error) {
      console.error('Error checking authentication status:', error);
      return false;
    }
  },

  // Check if user has premium access
  hasPremiumAccess: async () => {
    try {
      const paidStatus = await AsyncStorage.getItem(PAID_STATUS_KEY);
      return paidStatus === 'true';
    } catch (error) {
      console.error('Error checking premium status:', error);
      return false;
    }
  },

  // Check if user exists (for Gmail login/signup flow)
  checkUserExists: async (email) => {
    try {
      // TODO: Replace with actual API call to check if email exists in database
      // For demo purposes, check if we have stored user data
      const existingUsers = await AsyncStorage.getItem('@existing_users');
      if (existingUsers) {
        const users = JSON.parse(existingUsers);
        return users.includes(email.toLowerCase());
      }
      return false; // New user
    } catch (error) {
      return false;
    }
  },

  // Register new user with Gmail
  registerWithGmail: async (email) => {
    try {
      // TODO: Replace with actual API call
      const mockUser = {
        id: Date.now().toString(),
        email,
        name: email.split('@')[0], // Use email prefix as default name
        isPremium: false,
        country: 'India',
      };
      
      // Store user
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(mockUser));
      await AsyncStorage.setItem(TOKEN_KEY, 'mock_token_' + Date.now());
      
      // Add to existing users list
      const existingUsers = await AsyncStorage.getItem('@existing_users');
      const users = existingUsers ? JSON.parse(existingUsers) : [];
      users.push(email.toLowerCase());
      await AsyncStorage.setItem('@existing_users', JSON.stringify(users));
      
      return { success: true, user: mockUser };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Login existing user with Gmail
  loginWithGmail: async (email) => {
    try {
      // TODO: Replace with actual API call
      const mockUser = {
        id: '1',
        email,
        name: email.split('@')[0],
        isPremium: false,
        country: 'India',
      };
      
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(mockUser));
      await AsyncStorage.setItem(TOKEN_KEY, 'mock_token_' + Date.now());
      
      return { success: true, user: mockUser };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
};
