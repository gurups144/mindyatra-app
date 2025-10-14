import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  Animated,
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { authService } from "../services/auth";
import { COLORS, SERVICES, SIZES } from "../utils/constants";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - SIZES.padding * 3) / 2;

const HomeScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(50))[0];

  useEffect(() => {
    loadUser();
    animateScreen();
  }, []);

  const animateScreen = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const loadUser = async () => {
    const currentUser = await authService.getCurrentUser();
    setUser(currentUser);
    setIsPremium(currentUser?.isPremium || false);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", loadUser);
    return unsubscribe;
  }, [navigation]);

  const services = [
    {
      id: SERVICES.AI_ANALYSIS,
      title: "AI Text Analysis",
      description: "Analyze your thoughts & get advice",
      icon: "analytics",
      gradient: ["#8E2DE2", "#4A00E0"],
      route: "AIAnalysis",
      premium: false,
    },
    {
      id: SERVICES.DEPRESSION_METER,
      title: "Depression Meter",
      description: "Assess your mental health",
      icon: "pulse",
      gradient: ["#06B6D4", "#3B82F6"],
      route: "DepressionMeter",
      premium: false,
    },
    {
      id: SERVICES.UNARATHMA,
      title: "Unarathma Service",
      description: "AI + Doctor reports with consultation",
      icon: "medical",
      gradient: ["#10B981", "#34D399"],
      route: "Unarathma",
      premium: true,
    },
    {
      id: SERVICES.ACTIVITY_HUB,
      title: "Activity Hub",
      description: "Music, videos, games, books, blogs",
      icon: "grid",
      gradient: ["#F59E0B", "#FBBF24"],
      route: "ActivityHub",
      premium: true,
    },
  ];

  const handleServicePress = (service) => {
    if (service.premium && !isPremium) {
      return Alert.alert(
        "Premium Service",
        `${service.title} requires a premium subscription. Subscribe now?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Subscribe",
            onPress: () => navigation.navigate("Subscription"),
          },
        ]
      );
    }
    navigation.navigate(service.route);
  };

  const ServiceCard = ({ service, index }) => (
    <Animated.View
      style={[
        styles.serviceCard,
        {
          opacity: fadeAnim,
          transform: [
            { translateY: slideAnim },
            {
              scale: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.9, 1],
              }),
            },
          ],
        },
      ]}
    >
      <TouchableOpacity
        onPress={() => handleServicePress(service)}
        activeOpacity={0.85}
        style={styles.serviceTouchable}
      >
        <LinearGradient
          colors={service.gradient}
          style={styles.iconGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons name={service.icon} size={28} color={COLORS.white} />
          {service.premium && (
            <View style={styles.premiumBadge}>
              <Ionicons name="star" size={10} color={COLORS.warning} />
            </View>
          )}
        </LinearGradient>

        <Text style={styles.serviceTitle}>{service.title}</Text>
        <Text style={styles.serviceDescription}>{service.description}</Text>

        {service.premium && !isPremium && (
          <View style={styles.lockContainer}>
            <Ionicons name="lock-closed" size={14} color={COLORS.gray} />
            <Text style={styles.lockText}>Premium</Text>
          </View>
        )}

        <View style={styles.serviceArrow}>
          <Ionicons name="chevron-forward" size={16} color={COLORS.gray} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Header */}
      <LinearGradient
        colors={["#6D5DFB", "#8E2DE2"]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Hello,</Text>
            <Text style={styles.userName}>{user?.name || "User"}</Text>
            <View style={styles.statusContainer}>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: isPremium ? "#FFD700" : "#E0E0E0" },
                ]}
              />
              <Text style={styles.statusText}>
                {isPremium ? "Premium Member" : "Free Member"}
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.notificationBtn}>
            <Ionicons
              name="notifications-outline"
              size={24}
              color={COLORS.white}
            />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.servicesContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Premium Banner */}
        {!isPremium && (
          <Animated.View
            style={[
              styles.premiumBanner,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
            ]}
          >
            <LinearGradient
              colors={["#FF6A00", "#EE0979"]}
              style={styles.premiumGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.premiumContent}>
                <Ionicons
                  name="diamond"
                  size={28}
                  color={COLORS.white}
                  style={{ marginRight: 12 }}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.premiumTitle}>Upgrade to Premium</Text>
                  <Text style={styles.premiumSubtitle}>
                    Unlock all features & expert support
                  </Text>
                </View>
                <Ionicons name="arrow-forward" size={24} color={COLORS.white} />
              </View>
            </LinearGradient>
          </Animated.View>
        )}

        {/* Services Section */}
        <Text style={styles.sectionTitle}>Our Services</Text>
        <View style={styles.grid}>
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </View>

        {/* Booking / CTA Card */}
        <Animated.View
          style={[
            styles.bookingCard,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <TouchableOpacity
            onPress={() => navigation.navigate("Booking")}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={["#FF4D4D", "#FF8C42"]}
              style={styles.bookingGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.bookingTitle}>Book a Session</Text>
              <Text style={styles.bookingSubtitle}>
                Connect with psychologists & therapists
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Quick Stats */}
        <Animated.View
          style={[
            styles.statsContainer,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View style={styles.statItem}>
            <Text style={styles.statValue}>24/7</Text>
            <Text style={styles.statLabel}>Support</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>100%</Text>
            <Text style={styles.statLabel}>Private</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>50+</Text>
            <Text style={styles.statLabel}>Experts</Text>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F8" },
  header: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  greeting: { color: COLORS.white, fontSize: 16, opacity: 0.9 },
  userName: {
    color: COLORS.white,
    fontSize: 28,
    fontWeight: "bold",
    marginVertical: 4,
  },
  statusContainer: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  statusText: { color: COLORS.white, fontSize: 12, opacity: 0.9 },
  notificationBtn: { padding: 8, position: "relative" },
  notificationDot: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#EF4444",
  },
  servicesContainer: { flex: 1 },
  scrollContent: { padding: 24, paddingBottom: 80 },
  premiumBanner: { borderRadius: 24, marginBottom: 24 },
  premiumGradient: { borderRadius: 24, padding: 20 },
  premiumContent: { flexDirection: "row", alignItems: "center" },
  premiumTitle: { fontSize: 18, fontWeight: "bold", color: COLORS.white },
  premiumSubtitle: {
    fontSize: 14,
    color: COLORS.white,
    opacity: 0.9,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 16,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  serviceCard: { width: CARD_WIDTH, marginBottom: 20 },
  serviceTouchable: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 16,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    height: 180,
    justifyContent: "space-between",
  },
  iconGradient: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    position: "relative",
  },
  premiumBadge: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 4,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 12,
    color: COLORS.gray,
    flex: 1,
    lineHeight: 18,
  },
  lockContainer: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  lockText: {
    fontSize: 12,
    color: COLORS.gray,
    marginLeft: 4,
    fontWeight: "500",
  },
  serviceArrow: { position: "absolute", bottom: 16, right: 16 },
  bookingCard: { borderRadius: 20, marginVertical: 16 },
  bookingGradient: { borderRadius: 20, padding: 20 },
  bookingTitle: { fontSize: 18, fontWeight: "bold", color: COLORS.white },
  bookingSubtitle: {
    fontSize: 14,
    color: COLORS.white,
    opacity: 0.9,
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    marginTop: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  statItem: { flex: 1, alignItems: "center" },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 4,
  },
  statLabel: { fontSize: 12, color: COLORS.gray, fontWeight: "500" },
  statDivider: { width: 1, backgroundColor: "#E5E7EB", marginHorizontal: 12 },
});

export default HomeScreen;
