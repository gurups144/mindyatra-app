import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";

import {
  Alert,
  Animated,
  Dimensions,
  Easing,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

const HomeScreen = ({ navigation }) => {
  const [user] = useState({ name: "Sarah", isPremium: false });
  const [isPremium] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
    const [userName, setUserName] = useState("Friend");
    const [user_id, setuser_id] = useState(0);
    const [paid_fn, setpaid_status] = useState(0);
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("music");

  // Bounce animation for floating particles
  const bounceAnim1 = useRef(new Animated.Value(0)).current;
  const bounceAnim2 = useRef(new Animated.Value(0)).current;
  const bounceAnim3 = useRef(new Animated.Value(0)).current;

useEffect(() => {

  const loadUser = async () => {
    const email = await AsyncStorage.getItem("email");
    const user_id = await AsyncStorage.getItem("user_id");

   setuser_id(user_id);
    const paid_status = await AsyncStorage.getItem("paid_status");

   
      setpaid_status(paid_status);
      

    if (email) {
      const namePart = email.split("@")[0]; // extract before '@'
      const formatted =
        namePart.charAt(0).toUpperCase() + namePart.slice(1); // capitalize first letter
      setUserName(formatted);
    }
  };

  loadUser();  // <-- correct place

  setIsVisible(true);

  const animate = (anim, delay = 0) =>
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, {
          toValue: -10,
          duration: 700,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
          delay,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration: 700,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
      ])
    );

  animate(bounceAnim1).start();
  animate(bounceAnim2, 300).start();
  animate(bounceAnim3, 500).start();

}, []);


  const moodOptions = [
    {
      emoji: "😊",
      label: "Great",
      color: "#4ade80",
    },
    {
      emoji: "😌",
      label: "Calm",
      color: "#60a5fa",
    },
    {
      emoji: "😐",
      label: "Okay",
      color: "#fbbf24",
    },
    {
      emoji: "😔",
      label: "Down",
      color: "#f87171",
    },
    {
      emoji: "😴",
      label: "Tired",
      color: "#a78bfa",
    },
  ];

  // AI Features Cards
  const aiFeatures = [
    {
      id: 1,
      title: "AI Depression Test",
      subtitle: "Comprehensive mental health assessment",
      icon: "psychology",
      gradient: ["#667eea", "#764ba2"],
      premium: false,
    },
    {
      id: 2,
      title: "AI Mood Analysis",
      subtitle: "Deep emotional intelligence insights",
      icon: "mood",
      gradient: ["#ec4899", "#f43f5e"],
      premium: false,
    },
  ];

  const premiumFeatures = [
    {
      id: 3,
      title: "Unarathma Pro",
      subtitle: "Unlock premium mental",
      icon: "diamond",
      gradient: ["#14b8a6", "#06b6d4"],
      premium: true,
      features: [
        "Advanced AI Reports",
        "Expert Doctor Access",
        "24/7 Support",
        "Personalized Plans",
      ],
    },
    // {
    //   id: 4,
    //   title: "Wellness Library",
    //   subtitle: "Music, videos, games & more",
    //   icon: "library-books",
    //   gradient: ["#f59e0b", "#ef4444"],
    //   premium: true,
    //   features: ["Premium Content", "Daily Updates", "Exclusive Access"],
    // },
  ];

  const quickTools = [
    { icon: "headset", label: "Relax", color: "#8b5cf6" },
    { icon: "self-improvement", label: "Meditate", color: "#06b6d4" },
    { icon: "access-time", label: "Book", color: "#f59e0b" },
    { icon: "menu-book", label: "Journal", color: "#ec4899" },
  ];

  const relaxationMusic = [
    {
      id: 1,
      title: "Calm Ocean Waves",
      artist: "Nature Sounds",
      duration: "30 min",
      image:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop",
      type: "Nature",
    },
    {
      id: 2,
      title: "Peaceful Piano",
      artist: "Classical Instrumental",
      duration: "45 min",
      image:
        "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop",
      type: "Instrumental",
    },
    {
      id: 3,
      title: "Meditation Guide",
      artist: "Mindfulness Expert",
      duration: "20 min",
      image:
        "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=300&fit=crop",
      type: "Guided",
    },
    {
      id: 4,
      title: "Sleep Sounds",
      artist: "Ambient Collection",
      duration: "60 min",
      image:
        "https://images.unsplash.com/photo-1511882150382-421056c89033?w=300&h=300&fit=crop",
      type: "Ambient",
    },
  ];

  const smoothVideos = [
    {
      id: 1,
      title: "Morning Meditation",
      instructor: "Yoga Master",
      duration: "15 min",
      image:
        "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=300&fit=crop",
      type: "Meditation",
    },
    {
      id: 2,
      title: "Stress Relief Yoga",
      instructor: "Wellness Coach",
      duration: "25 min",
      image:
        "https://images.unsplash.com/photo-1545389336-cf090694435e?w=300&h=300&fit=crop",
      type: "Yoga",
    },
    {
      id: 3,
      title: "Breathing Exercises",
      instructor: "Breathwork Expert",
      duration: "10 min",
      image:
        "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=300&h=300&fit=crop",
      type: "Breathing",
    },
    {
      id: 4,
      title: "Mindfulness Practice",
      instructor: "Therapist Guided",
      duration: "20 min",
      image:
        "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=300&h=300&fit=crop",
      type: "Mindfulness",
    },
  ];

  const additionalIdeas = [
    {
      title: "Daily Check-ins",
      description: "Track your mood daily",
      icon: "calendar-today",
      color: "#10b981",
    },
    {
      title: "Progress Analytics",
      description: "View your mental health journey",
      icon: "analytics",
      color: "#3b82f6",
    },
    {
      title: "Community Support",
      description: "Connect with others",
      icon: "groups",
      color: "#8b5cf6",
    },
    {
      title: "Emergency Resources",
      description: "Get immediate help",
      icon: "emergency",
      color: "#ef4444",
    },
  ];

  const handleFeaturePress = (feature) => {
    if (feature.premium && !user.isPremium) {
      Alert.alert(
        "Premium Feature",
        "Upgrade to Unarathma Pro to access this feature",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Upgrade",
            onPress: () => navigation.navigate("Subscription"),
          },
        ]
      );
    } else {
      // Handle feature press
      switch (feature.id) {
        case 1: // AI Depression Test
          navigation.navigate("DepressionMeter");
          break;
        case 2: // AI Mood Analysis
          navigation.navigate("AIAnalysis");
          break;
        case 3: // Unarathma Pro
          navigation.navigate("Unarathma");
          break;
        case 4: // Wellness Library
          navigation.navigate("ActivityHub");
          break;
        default:
          console.log("Feature pressed:", feature.title);
      }
    }
  };

  const AICard = ({ feature }) => (
    <TouchableOpacity
      onPress={() => handleFeaturePress(feature)}
      style={[styles.aiCard, { backgroundColor: feature.gradient[0] }]}
    >
      <View style={styles.aiCardHeader}>
        <View style={styles.aiIconContainer}>
          <MaterialIcons name={feature.icon} size={32} color="white" />
        </View>
        <View style={styles.freeBadge}>
          <Text style={styles.freeText}>FREE</Text>
        </View>
      </View>
      <View style={styles.aiCardContent}>
        <Text style={styles.aiCardTitle}>{feature.title}</Text>
        <Text style={styles.aiCardSubtitle}>{feature.subtitle}</Text>
      </View>
      <View style={styles.aiCardButton}>
        <Text style={styles.aiCardButtonText}>Start Now</Text>
        <Ionicons name="arrow-forward" size={20} color="white" />
      </View>
    </TouchableOpacity>
  );

  const PremiumCard = ({ feature }) => (
    <TouchableOpacity
      onPress={() => handleFeaturePress(feature)}
      style={styles.premiumCard}
    >
      <LinearGradient colors={feature.gradient} style={styles.premiumGradient}>
        {!user.isPremium && (
          <View style={styles.lockBadge}>
            <Feather name="lock" size={20} color="white" />
          </View>
        )}
        <View style={styles.premiumContent}>
          <View style={styles.premiumHeader}>
            <MaterialIcons name={feature.icon} size={40} color="white" />
            <View style={styles.premiumBadge}>
              <Text style={styles.premiumBadgeText}>PRO</Text>
            </View>
          </View>

          <Text style={styles.premiumTitle}>{feature.title}</Text>
          <Text style={styles.premiumSubtitle}>{feature.subtitle}</Text>

          <View style={styles.featuresList}>
            {feature.features.map((item, idx) => (
              <View key={idx} style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={20} color="white" />
                <Text style={styles.featureText}>{item}</Text>
              </View>
            ))}
          </View>

<TouchableOpacity
  style={styles.premiumButton}
  onPress={() => {
    
    if (!paid_fn) {
      navigation.navigate("Subscription");
    } else {
      const url = `https://mindyatra.in/Api/know_mental_health/${user_id}`;
      navigation.navigate("KnowYourMentalHealth", { url });
    }
  }}
  
>
  <Text style={styles.premiumButtonText}>
    {paid_fn ? "Access Now" : "Upgrade to Pro"}
  </Text>
  <Ionicons
    name={paid_fn ? "arrow-forward" : "diamond"}
    size={20}
    color="white"
  />
</TouchableOpacity>


        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const QuickTool = ({ tool }) => (
    <TouchableOpacity
      style={[styles.quickTool, { backgroundColor: tool.color }]}
      onPress={() => {
        if (tool.label === "Relax") {
          navigation.navigate("ActivityHub", { initialTab: "music" });
        } else if (tool.label === "Meditate") {
          navigation.navigate("ActivityHub", { initialTab: "videos" });
        } else if (tool.label === "Journal") {
          navigation.navigate("ActivityHub", { initialTab: "journal" });
        } else {
          // Default action for other tools
          console.log(tool.label, "pressed");
        }
      }}
    >
      <MaterialIcons name={tool.icon} size={28} color="white" />
      <Text style={styles.quickLabel}>{tool.label}</Text>
    </TouchableOpacity>
  );

  const MediaItem = ({ item, type }) => (
    <TouchableOpacity style={styles.mediaItem}>
      <Image
        source={{ uri: item.image }}
        style={styles.mediaImage}
        defaultSource={{
          uri: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=300&fit=crop",
        }}
      />
      <View style={styles.mediaContent}>
        <Text style={styles.mediaTitle}>{item.title}</Text>
        <Text style={styles.mediaSubtitle}>
          {type === "music" ? item.artist : item.instructor}
        </Text>
        <View style={styles.mediaMeta}>
          <Text style={styles.mediaDuration}>{item.duration}</Text>
          <View
            style={[
              styles.typeBadge,
              { backgroundColor: type === "music" ? "#8b5cf6" : "#ec4899" },
            ]}
          >
            <Text style={styles.typeText}>{item.type}</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity style={styles.playButton}>
        <Ionicons name="play" size={20} color="white" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const IdeaCard = ({ idea }) => (
    <TouchableOpacity
      style={[styles.ideaCard, { borderLeftColor: idea.color }]}
    >
      <View style={styles.ideaHeader}>
        <MaterialIcons name={idea.icon} size={24} color={idea.color} />
        <Text style={styles.ideaTitle}>{idea.title}</Text>
      </View>
      <Text style={styles.ideaDescription}>{idea.description}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <View style={styles.userInfo}>
          <Text style={styles.greeting}>Good Morning,</Text>
          <Text style={styles.userName}>
            {userName}
          </Text>
        </View>
        <TouchableOpacity style={styles.profileButton}>
          <MaterialIcons name="person" size={24} color="#4f46e5" />
        </TouchableOpacity>
      </View>

      {/* Enhanced Mood Tracker Banner */}
      <LinearGradient colors={["#9EC5FF", "#A6E7FF"]} style={styles.banner}>
        <View style={styles.bannerContent}>
          <Text style={styles.bannerQuestion}>How are you feeling today?</Text>
          <Text style={styles.bannerSubtitle}>
            Take a moment to check in with yourself
          </Text>

          {/* Enhanced Mood Selector */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.moodScrollContainer}
            contentContainerStyle={styles.moodScrollContent}
          >
            {moodOptions.map((mood, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.moodItem,
                  selectedMood?.label === mood.label && styles.moodItemSelected,
                ]}
                onPress={() => setSelectedMood(mood)}
              >
                <View
                  style={[
                    styles.moodEmoji,
                    { backgroundColor: mood.color },
                    selectedMood?.label === mood.label &&
                      styles.moodEmojiSelected,
                  ]}
                >
                  <Text style={styles.emoji}>{mood.emoji}</Text>
                </View>
                <Text style={styles.moodLabel}>{mood.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </LinearGradient>

      {/* AI Features Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>AI Mental Health Assessment</Text>
        <View style={styles.aiCardsContainer}>
          {aiFeatures.map((feature) => (
            <AICard key={feature.id} feature={feature} />
          ))}
        </View>
      </View>

      {/* Premium Unarathma Pro Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Unlock Premium Benefits</Text>
        {premiumFeatures.map((feature) => (
          <PremiumCard key={feature.id} feature={feature} />
        ))}
      </View>

      {/* Quick Tools */}
      {/* <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Tools</Text>
        <View style={styles.quickToolContainer}>
          {quickTools.map((tool, idx) => (
            <QuickTool key={idx} tool={tool} />
          ))}
        </View>
      </View> */}

      {/* Relaxation Content Section with Images */}
      {/* <View style={styles.section}>
        <View style={styles.categoryTabs}>
          <TouchableOpacity
            style={[
              styles.categoryTab,
              selectedCategory === "music" && styles.categoryTabActive,
            ]}
            onPress={() => setSelectedCategory("music")}
          >
            <Ionicons
              name="musical-notes"
              size={20}
              color={selectedCategory === "music" ? "#4f46e5" : "#6b7280"}
            />
            <Text
              style={[
                styles.categoryTabText,
                selectedCategory === "music" && styles.categoryTabTextActive,
              ]}
            >
              Relaxing Music
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.categoryTab,
              selectedCategory === "videos" && styles.categoryTabActive,
            ]}
            onPress={() => setSelectedCategory("videos")}
          >
            <Ionicons
              name="videocam"
              size={20}
              color={selectedCategory === "videos" ? "#4f46e5" : "#6b7280"}
            />
            <Text
              style={[
                styles.categoryTabText,
                selectedCategory === "videos" && styles.categoryTabTextActive,
              ]}
            >
              Smooth Videos
            </Text>
          </TouchableOpacity>
        </View>

        {selectedCategory === "music" ? (
          <View style={styles.mediaList}>
            {relaxationMusic.map((item) => (
              <MediaItem key={item.id} item={item} type="music" />
            ))}
          </View>
        ) : (
          <View style={styles.mediaList}>
            {smoothVideos.map((item) => (
              <MediaItem key={item.id} item={item} type="video" />
            ))}
          </View>
        )}
      </View> */}

      {/* Additional Features Ideas */}
      {/* <View style={styles.section}>
        <Text style={styles.sectionTitle}>More Wellness Features</Text>
        <View style={styles.ideasGrid}>
          {additionalIdeas.map((idea, index) => (
            <IdeaCard key={index} idea={idea} />
          ))}
        </View>
      </View> */}

      {/* Bottom Spacing */}
      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: "#ffffff",
  },
  userInfo: {
    flex: 1,
  },
  greeting: {
    fontSize: 16,
    color: "#6b7280",
    marginBottom: 4,
  },
  userName: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1f2937",
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#e5e7eb",
    justifyContent: "center",
    alignItems: "center",
  },
  banner: {
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  bannerContent: {
    alignItems: "center",
  },
  bannerQuestion: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 8,
    textAlign: "center",
  },
  bannerSubtitle: {
    fontSize: 14,
    color: "#4b5563",
    marginBottom: 24,
    textAlign: "center",
    lineHeight: 20,
  },
  moodScrollContainer: {
    width: "100%",
  },
  moodScrollContent: {
    paddingHorizontal: 8,
  },
  moodItem: {
    alignItems: "center",
    marginHorizontal: 8,
    padding: 8,
    borderRadius: 16,
  },
  moodItemSelected: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  moodEmoji: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  moodEmojiSelected: {
    transform: [{ scale: 1.1 }],
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  emoji: {
    fontSize: 20,
  },
  moodLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#374151",
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
    color: "#1f2937",
  },
  // AI Cards Styles
  aiCardsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  aiCard: {
    flex: 1,
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  aiCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  aiIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  aiCardContent: {
    flex: 1,
    marginBottom: 20,
  },
  aiCardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "white",
    marginBottom: 4,
  },
  aiCardSubtitle: {
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
    lineHeight: 16,
  },
  aiCardButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  aiCardButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
    marginRight: 8,
  },
  // Premium Card Styles
  premiumCard: {
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
    marginTop: 10,
  },
  premiumGradient: {
    padding: 24,
  },
  premiumContent: {
    alignItems: "center",
  },
  premiumHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
  },
  premiumBadge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  premiumBadgeText: {
    color: "white",
    fontWeight: "700",
    fontSize: 12,
  },
  premiumTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "white",
    marginBottom: 8,
    textAlign: "center",
  },
  premiumSubtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    marginBottom: 24,
    textAlign: "center",
  },
  featuresList: {
    width: "100%",
    marginBottom: 24,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  featureText: {
    color: "white",
    fontSize: 16,
    marginLeft: 12,
    fontWeight: "500",
  },
  premiumButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 16,
    width: "100%",
  },
  premiumButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
    marginRight: 12,
  },
  lockBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  freeBadge: {
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  freeText: {
    color: "white",
    fontWeight: "700",
    fontSize: 12,
  },
  // Quick Tools
  quickToolContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  quickTool: {
    width: (width - 64) / 4,
    height: (width - 64) / 4,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  quickLabel: {
    fontSize: 12,
    marginTop: 4,
    textAlign: "center",
    color: "white",
    fontWeight: "600",
  },
  // Media Content Styles with Images
  categoryTabs: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  categoryTab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  categoryTabActive: {
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryTabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6b7280",
  },
  categoryTabTextActive: {
    color: "#4f46e5",
  },
  mediaList: {
    gap: 16,
  },
  mediaItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 12,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  mediaImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 12,
  },
  mediaContent: {
    flex: 1,
  },
  mediaTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 4,
  },
  mediaSubtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 6,
  },
  mediaMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  mediaDuration: {
    fontSize: 12,
    color: "#9ca3af",
    fontWeight: "500",
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  typeText: {
    fontSize: 10,
    color: "white",
    fontWeight: "600",
  },
  playButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#4f46e5",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
  // Ideas Section
  ideasGrid: {
    gap: 12,
  },
  ideaCard: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 16,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  ideaHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  ideaTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    marginLeft: 12,
  },
  ideaDescription: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
  },
  bottomSpacing: {
    height: 40,
  },
});

export default HomeScreen;
