import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Button from '../components/Button';
import { authService } from '../services/auth';
import { COLORS, SIZES } from '../utils/constants';

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState({ 
    email: 'Loading...',
    name: 'User',
    isPremium: false,
    country: 'India' 
  });

  useEffect(() => {
    loadUser();
  }, []);

  // Reload user when screen is focused
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadUser);
    return unsubscribe;
  }, [navigation]);

  const loadUser = async () => {
    try {
      // Get email from AsyncStorage
      const email = await AsyncStorage.getItem('email');
      const name = await AsyncStorage.getItem('name') || email?.split('@')[0] || 'User';
      
      if (email) {
        setUser(prev => ({
          ...prev,
          email,
          name,
          country: 'India',
          isPremium: false
        }));
      }
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await authService.logout();
            navigation.replace('Login');
          },
        },
      ]
    );
  };

  const menuItems = [
    {
      icon: 'person-outline',
      title: 'Edit Profile',
      subtitle: 'Update your personal information',
      onPress: () => Alert.alert('Coming Soon', 'Edit profile feature will be available soon'),
    },
    {
      icon: 'notifications-outline',
      title: 'Notifications',
      subtitle: 'Manage notification preferences',
      onPress: () => Alert.alert('Coming Soon', 'Notification settings will be available soon'),
    },
    {
      icon: 'calendar-outline',
      title: 'My Bookings',
      subtitle: 'View your session history',
      onPress: () => Alert.alert('Coming Soon', 'Booking history will be available soon'),
    },
    {
      icon: 'document-text-outline',
      title: 'My Reports',
      subtitle: 'Access your assessment reports',
      onPress: () => Alert.alert('Coming Soon', 'Reports section will be available soon'),
    },
    {
      icon: 'help-circle-outline',
      title: 'Help & Support',
      subtitle: 'Get help and contact support',
      onPress: () => Alert.alert('Help & Support', 'Email: support@mindyatra.com\nPhone: +91 1234567890'),
    },
    {
      icon: 'shield-checkmark-outline',
      title: 'Privacy Policy',
      subtitle: 'Read our privacy policy',
      onPress: () => Alert.alert('Privacy Policy', 'Your privacy is important to us. Visit our website for full details.'),
    },
    {
      icon: 'information-circle-outline',
      title: 'About MindYatra',
      subtitle: 'Learn more about us',
      onPress: () => Alert.alert('About MindYatra', 'Version 1.0.0\n\nMindYatra is your companion for mental wellness.'),
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Profile</Text>
          <Text style={styles.headerSubtitle}>Manage your account</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={48} color={COLORS.white} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{user?.name || 'User'}</Text>
            <Text style={styles.userEmail}>{user?.email || 'email@example.com'}</Text>
            <Text style={styles.userCountry}>
              <Ionicons name="location" size={14} color={COLORS.gray} /> {user?.country || 'India'}
            </Text>
          </View>
        </View>

        {/* Subscription Status */}
        <View style={[
          styles.subscriptionCard,
          { backgroundColor: user?.isPremium ? COLORS.success + '20' : COLORS.warning + '20' }
        ]}>
          <View style={styles.subscriptionHeader}>
            <Ionicons 
              name={user?.isPremium ? 'star' : 'lock-closed'} 
              size={32} 
              color={user?.isPremium ? COLORS.success : COLORS.warning} 
            />
            <View style={styles.subscriptionInfo}>
              <Text style={styles.subscriptionTitle}>
                {user?.isPremium ? 'Premium Member' : 'Free Member'}
              </Text>
              <Text style={styles.subscriptionSubtitle}>
                {user?.isPremium 
                  ? 'You have access to all premium features' 
                  : 'Upgrade to unlock premium features'}
              </Text>
            </View>
          </View>
          {!user?.isPremium && (
            <Button
              title="Upgrade to Premium"
              onPress={() => navigation.navigate('Subscription')}
              variant="secondary"
              style={styles.upgradeButton}
            />
          )}
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="calendar" size={24} color={COLORS.primary} />
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Sessions</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="document-text" size={24} color={COLORS.secondary} />
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Reports</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="trending-up" size={24} color={COLORS.success} />
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Activities</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <View style={styles.menuIconContainer}>
                <Ionicons name={item.icon} size={24} color={COLORS.primary} />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <Button
          title="Logout"
          onPress={handleLogout}
          variant="danger"
          style={styles.logoutButton}
        />

        {/* App Version */}
        <Text style={styles.versionText}>MindYatra v1.0.0</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: SIZES.padding,
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: SIZES.h1,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: COLORS.white,
    fontSize: SIZES.medium,
    opacity: 0.9,
    marginTop: 4,
  },
  content: {
    flex: 1,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    margin: SIZES.padding,
    padding: SIZES.padding * 1.5,
    borderRadius: SIZES.radius,
    elevation: 2,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    flex: 1,
    marginLeft: SIZES.padding,
  },
  userName: {
    fontSize: SIZES.h3,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  userEmail: {
    fontSize: SIZES.medium,
    color: COLORS.gray,
    marginTop: 4,
  },
  userCountry: {
    fontSize: SIZES.font,
    color: COLORS.gray,
    marginTop: 4,
  },
  subscriptionCard: {
    marginHorizontal: SIZES.padding,
    marginBottom: SIZES.padding,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
  },
  subscriptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subscriptionInfo: {
    flex: 1,
    marginLeft: SIZES.padding,
  },
  subscriptionTitle: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  subscriptionSubtitle: {
    fontSize: SIZES.font,
    color: COLORS.gray,
    marginTop: 4,
  },
  upgradeButton: {
    marginTop: SIZES.padding,
  },
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: SIZES.padding,
    marginBottom: SIZES.padding,
    gap: SIZES.padding,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    elevation: 1,
  },
  statNumber: {
    fontSize: SIZES.h2,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginTop: SIZES.base,
  },
  statLabel: {
    fontSize: SIZES.font,
    color: COLORS.gray,
    marginTop: 4,
  },
  menuContainer: {
    marginHorizontal: SIZES.padding,
    marginBottom: SIZES.padding,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.padding,
    elevation: 1,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuContent: {
    flex: 1,
    marginLeft: SIZES.padding,
  },
  menuTitle: {
    fontSize: SIZES.medium,
    fontWeight: '600',
    color: COLORS.dark,
  },
  menuSubtitle: {
    fontSize: SIZES.font,
    color: COLORS.gray,
    marginTop: 2,
  },
  logoutButton: {
    marginHorizontal: SIZES.padding,
    marginBottom: SIZES.padding,
  },
  versionText: {
    textAlign: 'center',
    fontSize: SIZES.small,
    color: COLORS.gray,
    marginBottom: SIZES.padding * 2,
  },
});

export default ProfileScreen;
