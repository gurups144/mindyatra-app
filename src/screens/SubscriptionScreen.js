import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.9;

const SubscriptionScreen = ({ navigation }) => {
  const [promoCodeGlobal, setPromoCodeGlobal] = useState('');
  const [promoCodeIndia, setPromoCodeIndia] = useState('');
  const [userId, setUserId] = useState(null);
  const [email, setEmail] = useState(null);
  const [token, setToken] = useState(null);
  const [paidStatus, setPaidStatus] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const uid = await AsyncStorage.getItem("user_id");
      const em = await AsyncStorage.getItem("email");
      const tk = await AsyncStorage.getItem("token");
      const ps = await AsyncStorage.getItem("paid_status");
      console.log("SUB SCREEN USER:", uid);
      setUserId(uid);
      setEmail(em);
      setToken(tk);
      setPaidStatus(ps);
    };
    loadUser();
  }, []);

  const plans = [
    {
      id: 'global',
      title: 'Mental Health Insight Assessment - Other Countries',
      price: '$50',
      originalPrice: '$100',
      discount: '50% off',
      buttonText: 'Coming Soon',
      disabled: true,
    },
    {
      id: 'india',
      title: 'Mental Health Insight Assessment - India',
      price: '₹150',
      originalPrice: '₹300',
      discount: '50% off',
      buttonText: 'Pay Now',
      disabled: false,
    },
  ];

  const features = [
    'Write your thoughts',
    'Answer a few guided questions',
    'Submit a short voice recording',
  ];

  const benefits = [
    'Personalized psychologist-reviewed report',
    'AI-based mental insight assessment',
    'Astro-based personality analysis',
  ];

  const handleSubscribe = async (planId, promoCode) => {
    try {
      console.log("Making payment request...");
      const response = await fetch("https://mindyatra.in/Api/create_payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `amount=1&email=${encodeURIComponent(email)}&name=MindYatra User`,
      });

      const data = await response.json();
      console.log("API Response:", JSON.stringify(data, null, 2));

      if (data.payu_url && data.params) {
        console.log("Navigating to PayUWebView...");
        setTimeout(() => {
          navigation.navigate("PayUWebView", { payuData: data });
        }, 100);
      } else {
        alert("Payment initialization failed: " + JSON.stringify(data));
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Something went wrong!");
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.cardsContainer}>
          {plans.map((plan) => (
            <View key={plan.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{plan.title}</Text>
              </View>

              <View style={styles.cardBody}>
                <View style={styles.priceSection}>
                  <Text style={styles.priceLabel}>💰 Price:</Text>
                  <View style={styles.priceRow}>
                    <Text style={styles.originalPrice}>{plan.originalPrice}</Text>
                    <Text style={styles.discountBadge}>{plan.discount}</Text>
                  </View>
                  <Text style={styles.price}>{plan.price}</Text>
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>✔ What You Do:</Text>
                  {features.map((feature, index) => (
                    <View key={index} style={styles.featureItem}>
                      <Text style={styles.bullet}>✔</Text>
                      <Text style={styles.featureText}>{feature}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>🔍 You Receive:</Text>
                  {benefits.map((benefit, index) => (
                    <View key={index} style={styles.featureItem}>
                      <Text style={styles.bullet}>*</Text>
                      <Text style={styles.featureText}>{benefit}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.emailNotice}>
                  <Text style={styles.emailNoticeText}>
                    📩 The analysis report will be sent to your email within 24 hours.
                  </Text>
                </View>

                <View style={styles.noteSection}>
                  <Text style={styles.noteTitle}>📌 Note:</Text>
                  <Text style={styles.noteText}>
                    This is a non-clinical assessment meant for self-awareness and initial analytical understanding only.
                  </Text>
                  <Text style={styles.noteText}>
                    💬 For counseling or therapy, we strongly recommend booking a professional appointment.
                  </Text>
                </View>

                <View style={styles.betaNotice}>
                  <Text style={styles.betaText}>
                    🔗 To book an appointment and explore more features, visit{' '}
                    <Text style={styles.linkText}>mindyatra.in</Text>.
                  </Text>
                  <Text style={styles.betaText}>
                    This application is currently in its beta version.
                  </Text>
                </View>

                <TouchableOpacity
                  style={[styles.subscribeButton, plan.disabled && styles.disabledButton]}
                  onPress={() => handleSubscribe(plan.id, plan.id === 'global' ? promoCodeGlobal : promoCodeIndia)}
                  disabled={plan.disabled}
                >
                  <Text style={styles.subscribeButtonText}>{plan.buttonText}</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    paddingVertical: 20,
  },
  cardsContainer: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 30,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    overflow: 'hidden',
  },
  cardHeader: {
    backgroundColor: '#E91E63',
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  cardBody: {
    padding: 20,
  },
  priceSection: {
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  priceLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  originalPrice: {
    fontSize: 16,
    color: '#999',
    textDecorationLine: 'line-through',
    marginRight: 10,
  },
  discountBadge: {
    fontSize: 13,
    color: '#E91E63',
    fontWeight: 'bold',
  },
  price: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#E91E63',
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    paddingLeft: 10,
  },
  bullet: {
    fontSize: 12,
    color: '#555',
    marginRight: 8,
    lineHeight: 18,
  },
  featureText: {
    fontSize: 12,
    color: '#555',
    flex: 1,
    lineHeight: 18,
  },
  emailNotice: {
    backgroundColor: '#f0f8ff',
    padding: 12,
    borderRadius: 6,
    marginVertical: 15,
  },
  emailNoticeText: {
    fontSize: 12,
    color: '#333',
    lineHeight: 18,
  },
  noteSection: {
    backgroundColor: '#fff9e6',
    padding: 12,
    borderRadius: 6,
    marginBottom: 15,
  },
  noteTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  noteText: {
    fontSize: 11,
    color: '#555',
    lineHeight: 17,
    marginBottom: 5,
  },
  betaNotice: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 6,
    marginBottom: 20,
  },
  betaText: {
    fontSize: 11,
    color: '#666',
    lineHeight: 17,
    marginBottom: 4,
  },
  linkText: {
    color: '#E91E63',
    fontWeight: '600',
  },
  subscribeButton: {
    backgroundColor: '#E91E63',
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
  },
  subscribeButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#E91E63',
    opacity: 0.6,
  },
});

export default SubscriptionScreen;