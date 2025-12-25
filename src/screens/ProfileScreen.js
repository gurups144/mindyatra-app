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
      const userId = await AsyncStorage.getItem('user_id');
      
      if (email) {
        setUser(prev => ({
          ...prev,
          email,
          name,
          userId,
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

  const handleEditProfile = () => {
    navigation.navigate('EditProfile');
  };

  const menuItems = [
    {
      icon: 'person-outline',
      title: 'Edit Profile',
      subtitle: 'Update your personal information',
      onPress: handleEditProfile,
    },
    {
      icon: 'notifications-outline',
      title: 'Notifications',
      subtitle: 'View your notifications',
      onPress: () => navigation.navigate('Notifications'),
    },
    {
      icon: 'document-text-outline',
      title: 'Terms & Conditions',
      subtitle: 'Read our terms and conditions',
      onPress: () => navigation.navigate('TermsConditions'),
    },
    {
      icon: 'shield-checkmark-outline',
      title: 'Privacy Policy',
      subtitle: 'Read our privacy policy',
      onPress: () => navigation.navigate('PrivacyPolicy'),
    },
    {
      icon: 'help-circle-outline',
      title: 'Help & Support',
      subtitle: 'Get help and contact support',
      onPress: () => Alert.alert('Help & Support', 'Email: info@mindyatra.in\nPhone: +91 9886668700'),
    },
    {
      icon: 'information-circle-outline',
      title: 'About MindYatra',
      subtitle: 'Learn more about us',
      onPress: () => Alert.alert('About MindYatra', 'Version 1.0.0\n\nMindyatra is a mental health and wellness platform dedicated to helping you unlock mental clarity through a unique blend of psychological expertise and AI-powered tools. We also offer soothing music, calming videos, and mindful games to support relaxation and emotional balance, all crafted to make self-care fun, simple, and effective..'),
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
        {/* Profile Card - Now clickable for edit */}
        <TouchableOpacity 
          style={styles.profileCard}
          onPress={handleEditProfile}
          activeOpacity={0.7}
        >
          <View style={styles.avatar}>
            <Ionicons name="person" size={48} color={COLORS.white} />
          </View>
          <View style={styles.profileInfo}>
            <View style={styles.nameContainer}>
              <Text style={styles.userName}>{user?.name || 'User'}</Text>
              <Ionicons name="pencil" size={16} color={COLORS.primary} style={styles.editIcon} />
            </View>
            <Text style={styles.userEmail}>{user?.email || 'email@example.com'}</Text>
            <Text style={styles.userCountry}>
              <Ionicons name="location" size={14} color={COLORS.gray} /> {user?.country || 'India'}
            </Text>
            
            {/* {user?.userId && (
              <View style={styles.userIdContainer}>
                <Text style={styles.userIdText}>ID: {user.userId}</Text>
              </View>
            )} */}
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
        </TouchableOpacity>

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
              activeOpacity={0.7}
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
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontSize: SIZES.h3,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  editIcon: {
    marginLeft: 8,
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
  userIdContainer: {
    marginTop: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: COLORS.lightGray,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  userIdText: {
    fontSize: 12,
    color: COLORS.darkGray,
    fontFamily: 'monospace',
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