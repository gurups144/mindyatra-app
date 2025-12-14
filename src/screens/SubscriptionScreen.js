import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

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
      title: 'Beta version ( Trail plan ) Other Countries',
      price: '$50',
      originalPrice: '@$100',
      discount: '50% Off – Now Only @$50',
      description: 'Unlock Mental Clarity – Just $50',
      subDescription: 'Get personalized mental health insights from your written thoughts or voice notes, with expert feedback in 48 hours.',
      buttonText: 'Coming Soon',
      disabled: true,
    },
    {
      id: 'india',
      title: 'Beta version ( Trail plan ) India',
      price: '₹250',
      originalPrice: '@₹500',
      discount: '50% Off – Now Only @₹250',
      description: 'Unlock Mental Clarity – Just ₹250',
      subDescription: 'Get personalized mental health insights from your written thoughts or voice notes, with expert feedback in 48 hours.',
      buttonText: 'Pay Now',
      disabled: false,
    },
  ];

  const features = [
    'AI + Astro-based mental health insights',
    'Expert feedback from your voice or writing in 48 hours',
    '1-day access to our Activity Hub — music, stories & mind games',
  ];

const handleSubscribe = async (planId, promoCode) => {
  if (planId !== "india") return;

  if (!userId) {
    alert("Please login to continue");
    return;
  }

  if (paidStatus === "1") {
    alert("You already have an active subscription");
    return;
  }

  const response = await fetch(
  "https://mindyatra.in/Api/create_payment",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${token}`,
    },
    body: `amount=1&email=${encodeURIComponent(email)}&name=MindYatra User`,
  }
);

  const data = await response.json();

  navigation.navigate("PayUWebView", { payuData: data });
};



  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Subscription</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.cardsContainer}>
          {plans.map((plan) => (
            <View key={plan.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{plan.title}</Text>
              </View>
              
              <View style={styles.cardBody}>
                <Text style={styles.price}>{plan.price}</Text>
                
                <View style={styles.discountContainer}>
                  <Text style={styles.discountEmoji}>🎉</Text>
                  <Text style={styles.discountText}>
                    {plan.discount} <Text style={styles.originalPrice}>{plan.originalPrice}</Text>
                  </Text>
                </View>

                <Text style={styles.descriptionBold}>{plan.description}</Text>
                <Text style={styles.description}>{plan.subDescription}</Text>

                <Text style={styles.featuresTitle}>What's included:</Text>

                <View style={styles.featuresList}>
                  {features.map((feature, index) => (
                    <View key={index} style={styles.featureItem}>
                      <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />
                      <Text style={styles.featureText}>{feature}</Text>
                    </View>
                  ))}
                </View>

                <Text style={styles.journeyText}>
                  Start your journey to clarity — simple, personalized, and judgment-free.
                </Text>

                <TextInput
                  style={styles.promoInput}
                  placeholder="Enter Promo Code (if any)"
                  value={plan.id === 'global' ? promoCodeGlobal : promoCodeIndia}
                  onChangeText={plan.id === 'global' ? setPromoCodeGlobal : setPromoCodeIndia}
                />

                <TouchableOpacity
                  style={[
                    styles.subscribeButton,
                    plan.disabled && styles.disabledButton
                  ]}
                  onPress={() => handleSubscribe(plan.id, plan.id === 'global' ? promoCodeGlobal : promoCodeIndia)}
                  disabled={plan.disabled}
                >
                  <Text style={styles.subscribeButtonText}>
                    {plan.buttonText}
                  </Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
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
  price: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginVertical: 10,
  },
  discountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  discountEmoji: {
    fontSize: 16,
    marginRight: 5,
  },
  discountText: {
    fontSize: 13,
    color: '#333',
    fontWeight: '600',
  },
  originalPrice: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  descriptionBold: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 15,
  },
  featuresTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  featuresList: {
    marginBottom: 15,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  featureText: {
    marginLeft: 8,
    fontSize: 12,
    color: '#555',
    flex: 1,
    lineHeight: 18,
  },
  journeyText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 15,
  },
  promoInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 12,
    fontSize: 13,
    backgroundColor: '#fff',
    marginBottom: 15,
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
    opacity: 1,
  },
});

export default SubscriptionScreen;