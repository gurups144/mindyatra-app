import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from '../components/Button';
import { COLORS, SIZES, SUBSCRIPTION_PRICES } from '../utils/constants';
import { authService } from '../services/auth';
import { paymentService } from '../services/payment';

const SubscriptionScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [priceInfo, setPriceInfo] = useState({ amount: 0, currency: '₹' });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const currentUser = await authService.getCurrentUser();
    setUser(currentUser);
    if (currentUser) {
      const pricing = paymentService.getSubscriptionPrice(currentUser.country);
      setPriceInfo(pricing);
    }
  };

  const handleSubscribe = async () => {
    Alert.alert(
      'Confirm Subscription',
      `You will be charged ${priceInfo.currency}${priceInfo.amount}. Continue?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Continue',
          onPress: async () => {
            setLoading(true);
            const response = await paymentService.processSubscription(user.country);
            setLoading(false);

            if (response.success) {
              Alert.alert(
                'Success!',
                response.message,
                [
                  {
                    text: 'OK',
                    onPress: () => navigation.navigate('Home'),
                  },
                ]
              );
            } else {
              Alert.alert('Payment Failed', response.error);
            }
          },
        },
      ]
    );
  };

  const features = [
    {
      icon: 'medical',
      title: 'Unarathma Service',
      description: 'AI + Doctor reports with direct consultation',
    },
    {
      icon: 'grid',
      title: 'Activity Hub Access',
      description: 'Music, videos, games, books, and blogs',
    },
    {
      icon: 'flash',
      title: 'Priority Support',
      description: 'Get faster responses from our support team',
    },
    {
      icon: 'trending-up',
      title: 'Advanced Analytics',
      description: 'Detailed insights and progress tracking',
    },
    {
      icon: 'notifications',
      title: 'Premium Content',
      description: 'Exclusive articles and resources',
    },
    {
      icon: 'lock-closed',
      title: 'Ad-Free Experience',
      description: 'Enjoy distraction-free mental wellness',
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} color={COLORS.white} onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Get Premium</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Ionicons name="star" size={80} color={COLORS.warning} />
          <Text style={styles.heroTitle}>Unlock Premium Features</Text>
          <Text style={styles.heroSubtitle}>
            Get full access to all mental wellness tools and services
          </Text>
        </View>

        {/* Pricing Card */}
        <View style={styles.pricingCard}>
          <View style={styles.pricingHeader}>
            <View>
              <Text style={styles.pricingLabel}>One-Time Payment</Text>
              <Text style={styles.priceAmount}>
                {priceInfo.currency}{priceInfo.amount}
              </Text>
              <Text style={styles.pricingSubtext}>Lifetime Access</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>BEST VALUE</Text>
            </View>
          </View>
        </View>

        {/* Features List */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>What's Included:</Text>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: COLORS.primary + '20' }]}>
                <Ionicons name={feature.icon} size={24} color={COLORS.primary} />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
              <Ionicons name="checkmark-circle" size={24} color={COLORS.success} />
            </View>
          ))}
        </View>

        {/* Testimonials */}
        <View style={styles.testimonialsSection}>
          <Text style={styles.sectionTitle}>What Our Users Say:</Text>
          
          <View style={styles.testimonialCard}>
            <View style={styles.stars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Ionicons key={star} name="star" size={16} color={COLORS.warning} />
              ))}
            </View>
            <Text style={styles.testimonialText}>
              "The Unarathma service changed my life. Getting both AI and doctor insights was incredibly helpful!"
            </Text>
            <Text style={styles.testimonialAuthor}>- Priya, Mumbai</Text>
          </View>

          <View style={styles.testimonialCard}>
            <View style={styles.stars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Ionicons key={star} name="star" size={16} color={COLORS.warning} />
              ))}
            </View>
            <Text style={styles.testimonialText}>
              "Activity Hub is amazing! The relaxation music and guided videos help me manage stress daily."
            </Text>
            <Text style={styles.testimonialAuthor}>- Raj, Delhi</Text>
          </View>
        </View>

        {/* Money Back Guarantee */}
        <View style={styles.guaranteeCard}>
          <Ionicons name="shield-checkmark" size={48} color={COLORS.success} />
          <View style={styles.guaranteeContent}>
            <Text style={styles.guaranteeTitle}>7-Day Money Back Guarantee</Text>
            <Text style={styles.guaranteeText}>
              Not satisfied? Get a full refund within 7 days, no questions asked.
            </Text>
          </View>
        </View>

        {/* CTA Button */}
        <Button
          title={`Subscribe for ${priceInfo.currency}${priceInfo.amount}`}
          onPress={handleSubscribe}
          loading={loading}
          style={styles.subscribeButton}
        />

        {/* Info Note */}
        <View style={styles.infoNote}>
          <Ionicons name="information-circle" size={20} color={COLORS.info} />
          <Text style={styles.infoText}>
            Secure payment. Your data is encrypted and protected.
          </Text>
        </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: SIZES.padding,
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: SIZES.h3,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  heroSection: {
    alignItems: 'center',
    padding: SIZES.padding * 2,
    backgroundColor: COLORS.white,
  },
  heroTitle: {
    fontSize: SIZES.h1,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginTop: SIZES.padding,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: SIZES.medium,
    color: COLORS.gray,
    textAlign: 'center',
    marginTop: SIZES.base,
  },
  pricingCard: {
    backgroundColor: COLORS.primary,
    margin: SIZES.padding,
    padding: SIZES.padding * 1.5,
    borderRadius: SIZES.radius,
    elevation: 4,
  },
  pricingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  pricingLabel: {
    color: COLORS.white,
    fontSize: SIZES.medium,
    opacity: 0.9,
  },
  priceAmount: {
    color: COLORS.white,
    fontSize: 48,
    fontWeight: 'bold',
    marginTop: 4,
  },
  pricingSubtext: {
    color: COLORS.white,
    fontSize: SIZES.medium,
    marginTop: 4,
    opacity: 0.9,
  },
  badge: {
    backgroundColor: COLORS.warning,
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.base / 2,
    borderRadius: SIZES.radius / 2,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: SIZES.small,
    fontWeight: 'bold',
  },
  featuresSection: {
    padding: SIZES.padding,
  },
  sectionTitle: {
    fontSize: SIZES.h3,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: SIZES.padding,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.padding,
    elevation: 1,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureContent: {
    flex: 1,
    marginLeft: SIZES.padding,
  },
  featureTitle: {
    fontSize: SIZES.medium,
    fontWeight: '600',
    color: COLORS.dark,
  },
  featureDescription: {
    fontSize: SIZES.font,
    color: COLORS.gray,
    marginTop: 2,
  },
  testimonialsSection: {
    padding: SIZES.padding,
    backgroundColor: COLORS.light,
  },
  testimonialCard: {
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.padding,
  },
  stars: {
    flexDirection: 'row',
    marginBottom: SIZES.base,
  },
  testimonialText: {
    fontSize: SIZES.medium,
    color: COLORS.dark,
    lineHeight: 22,
    fontStyle: 'italic',
    marginBottom: SIZES.base,
  },
  testimonialAuthor: {
    fontSize: SIZES.font,
    color: COLORS.gray,
    fontWeight: '600',
  },
  guaranteeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.success + '20',
    margin: SIZES.padding,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
  },
  guaranteeContent: {
    flex: 1,
    marginLeft: SIZES.padding,
  },
  guaranteeTitle: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  guaranteeText: {
    fontSize: SIZES.font,
    color: COLORS.gray,
    marginTop: 4,
    lineHeight: 20,
  },
  subscribeButton: {
    marginHorizontal: SIZES.padding,
    marginBottom: SIZES.padding,
  },
  infoNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SIZES.padding,
    paddingBottom: SIZES.padding * 2,
  },
  infoText: {
    fontSize: SIZES.font,
    color: COLORS.gray,
    marginLeft: SIZES.base,
  },
});

export default SubscriptionScreen;
