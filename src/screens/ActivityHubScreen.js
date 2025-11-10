import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

const WellnessScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");

  // Sample data with images
  const featuredContent = [
    {
      id: "1",
      title: "Morning Meditation",
      type: "music",
      duration: "15 min",
      image:
        "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop",
      color: ["#667eea", "#764ba2"],
      featured: true,
    },
    {
      id: "2",
      title: "Stress Relief Yoga",
      type: "video",
      duration: "25 min",
      image:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
      color: ["#ec4899", "#f43f5e"],
      featured: true,
    },
  ];

  const musicContent = [
    {
      id: "1",
      title: "Calm Ocean Waves",
      artist: "Nature Sounds",
      duration: "30 min",
      listeners: "12.4K",
      image:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop",
    },
    {
      id: "2",
      title: "Peaceful Piano",
      artist: "Classical Melodies",
      duration: "45 min",
      listeners: "8.7K",
      image:
        "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop",
    },
    {
      id: "3",
      title: "Sleep Meditation",
      artist: "Mindfulness Guide",
      duration: "20 min",
      listeners: "15.2K",
      image:
        "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=300&h=300&fit=crop",
    },
  ];

  const videoContent = [
    {
      id: "1",
      title: "Morning Yoga Flow",
      instructor: "Sarah Johnson",
      duration: "25 min",
      views: "24.8K",
      image:
        "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=300&fit=crop",
    },
    {
      id: "2",
      title: "Breathing Techniques",
      instructor: "Dr. Michael Chen",
      duration: "15 min",
      views: "18.3K",
      image:
        "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=300&h=300&fit=crop",
    },
  ];

  const gameContent = [
    {
      id: "1",
      title: "Mindful Journey",
      description: "Relaxing puzzle adventure",
      players: "45.2K",
      image:
        "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=300&h=300&fit=crop",
    },
    {
      id: "2",
      title: "Breath Trainer",
      description: "Interactive breathing guide",
      players: "28.7K",
      image:
        "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=300&h=300&fit=crop",
    },
  ];

  const bookContent = [
    {
      id: "1",
      title: "The Power of Now",
      author: "Eckhart Tolle",
      category: "Mindfulness",
      rating: "4.8",
      image:
        "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=300&fit=crop",
    },
    {
      id: "2",
      title: "Atomic Habits",
      author: "James Clear",
      category: "Self-Improvement",
      rating: "4.9",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
    },
  ];

  const blogContent = [
    {
      id: "1",
      title: "10 Science-Backed Tips for Better Sleep",
      author: "Sleep Expert",
      readTime: "8 min",
      date: "2 days ago",
      image:
        "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=300&h=200&fit=crop",
    },
    {
      id: "2",
      title: "Mindfulness Meditation for Beginners",
      author: "Meditation Coach",
      readTime: "6 min",
      date: "1 week ago",
      image:
        "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=300&h=200&fit=crop",
    },
  ];

  const FeaturedCard = ({ item }) => (
    <TouchableOpacity style={styles.featuredCard}>
      <Image source={{ uri: item.image }} style={styles.featuredImage} />
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.8)"]}
        style={styles.featuredGradient}
      >
        <View style={styles.featuredContent}>
          <View style={styles.featuredBadge}>
            <Text style={styles.featuredBadgeText}>FEATURED</Text>
          </View>
          <Text style={styles.featuredTitle}>{item.title}</Text>
          <View style={styles.featuredMeta}>
            <Text style={styles.featuredDuration}>{item.duration}</Text>
            <Text style={styles.featuredType}>
              {item.type === "music" ? "🎵 Music" : "🎥 Video"}
            </Text>
          </View>
        </View>
      </LinearGradient>
      <TouchableOpacity style={styles.featuredPlayButton}>
        <Ionicons name="play" size={24} color="white" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const MusicCard = ({ item }) => (
    <TouchableOpacity style={styles.musicCard}>
      <Image source={{ uri: item.image }} style={styles.musicImage} />
      <View style={styles.musicContent}>
        <Text style={styles.musicTitle}>{item.title}</Text>
        <Text style={styles.musicArtist}>{item.artist}</Text>
        <View style={styles.musicMeta}>
          <Text style={styles.musicDuration}>{item.duration}</Text>
          <Text style={styles.musicListeners}>{item.listeners} listeners</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.playButton}>
        <Ionicons name="play" size={20} color="white" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const VideoCard = ({ item }) => (
    <TouchableOpacity style={styles.videoCard}>
      <Image source={{ uri: item.image }} style={styles.videoImage} />
      <View style={styles.videoOverlay}>
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.7)"]}
          style={styles.videoGradient}
        >
          <View style={styles.videoContent}>
            <Text style={styles.videoTitle}>{item.title}</Text>
            <Text style={styles.videoInstructor}>With {item.instructor}</Text>
            <View style={styles.videoMeta}>
              <Text style={styles.videoDuration}>{item.duration}</Text>
              <Text style={styles.videoViews}>{item.views} views</Text>
            </View>
          </View>
        </LinearGradient>
      </View>
      <TouchableOpacity style={styles.videoPlayButton}>
        <Ionicons name="play" size={24} color="white" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const GameCard = ({ item }) => (
    <TouchableOpacity style={styles.gameCard}>
      <Image source={{ uri: item.image }} style={styles.gameImage} />
      <View style={styles.gameContent}>
        <Text style={styles.gameTitle}>{item.title}</Text>
        <Text style={styles.gameDescription}>{item.description}</Text>
        <View style={styles.gameMeta}>
          <Ionicons name="people" size={16} color="#6b7280" />
          <Text style={styles.gamePlayers}>{item.players} players</Text>
        </View>
      </View>
      <View style={styles.gameIcon}>
        <Ionicons name="play" size={20} color="white" />
      </View>
    </TouchableOpacity>
  );

  const BookCard = ({ item }) => (
    <TouchableOpacity style={styles.bookCard}>
      <Image source={{ uri: item.image }} style={styles.bookImage} />
      <View style={styles.bookContent}>
        <Text style={styles.bookTitle}>{item.title}</Text>
        <Text style={styles.bookAuthor}>By {item.author}</Text>
        <View style={styles.bookMeta}>
          <View style={styles.rating}>
            <Ionicons name="star" size={16} color="#f59e0b" />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
          <Text style={styles.bookCategory}>{item.category}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const BlogCard = ({ item }) => (
    <TouchableOpacity style={styles.blogCard}>
      <Image source={{ uri: item.image }} style={styles.blogImage} />
      <View style={styles.blogContent}>
        <Text style={styles.blogTitle}>{item.title}</Text>
        <View style={styles.blogMeta}>
          <Text style={styles.blogAuthor}>By {item.author}</Text>
          <Text style={styles.blogReadTime}>{item.readTime} read</Text>
        </View>
        <Text style={styles.blogDate}>{item.date}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Wellness Library</Text>
            <Text style={styles.headerSubtitle}>
              Discover peace and mindfulness
            </Text>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="search" size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="heart-outline" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#9ca3af"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search in Wellness Library..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#9ca3af"
        />
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options-outline" size={20} color="#6366f1" />
        </TouchableOpacity>
      </View>

      {/* Main Content - Vertical Scroll */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Featured Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Content</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollContent}
          >
            {featuredContent.map((item) => (
              <FeaturedCard key={item.id} item={item} />
            ))}
          </ScrollView>
        </View>

        {/* Music Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Relaxing Music</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          {musicContent.map((item) => (
            <MusicCard key={item.id} item={item} />
          ))}
        </View>

        {/* Videos Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Mindful Videos</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollContent}
          >
            {videoContent.map((item) => (
              <VideoCard key={item.id} item={item} />
            ))}
          </ScrollView>
        </View>

        {/* Games Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Relaxing Games</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.gamesGrid}>
            {gameContent.map((item) => (
              <GameCard key={item.id} item={item} />
            ))}
          </View>
        </View>

        {/* Books Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Wellness Books</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          {bookContent.map((item) => (
            <BookCard key={item.id} item={item} />
          ))}
        </View>

        {/* Blogs Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Expert Blogs</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          {blogContent.map((item) => (
            <BlogCard key={item.id} item={item} />
          ))}
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  // Header Styles
  header: {
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  backButton: {
    padding: 8,
  },
  headerText: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "white",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
  },
  headerIcons: {
    flexDirection: "row",
  },
  iconButton: {
    padding: 8,
    marginLeft: 8,
  },
  // Search Bar Styles
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    margin: 20,
    marginTop: -10,
    borderRadius: 16,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    height: 56,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: 56,
    color: "#1f2937",
    fontSize: 16,
  },
  filterButton: {
    padding: 8,
  },
  // Content Styles
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1f2937",
  },
  seeAllText: {
    color: "#6366f1",
    fontWeight: "600",
    fontSize: 14,
  },
  horizontalScrollContent: {
    paddingHorizontal: 20,
  },
  // Featured Cards
  featuredCard: {
    width: width - 80,
    height: 200,
    borderRadius: 20,
    marginRight: 16,
    overflow: "hidden",
    position: "relative",
  },
  featuredImage: {
    width: "100%",
    height: "100%",
  },
  featuredGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "60%",
    justifyContent: "flex-end",
    padding: 20,
  },
  featuredContent: {
    flex: 1,
    justifyContent: "flex-end",
  },
  featuredBadge: {
    backgroundColor: "#6366f1",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  featuredBadgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "700",
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "white",
    marginBottom: 8,
  },
  featuredMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  featuredDuration: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    fontWeight: "600",
  },
  featuredType: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
  },
  featuredPlayButton: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  // Music Cards
  musicCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  musicImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
  },
  musicContent: {
    flex: 1,
    marginLeft: 16,
  },
  musicTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 4,
  },
  musicArtist: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 8,
  },
  musicMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  musicDuration: {
    fontSize: 12,
    color: "#9ca3af",
    fontWeight: "500",
  },
  musicListeners: {
    fontSize: 12,
    color: "#9ca3af",
  },
  playButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#6366f1",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
  // Video Cards
  videoCard: {
    width: 280,
    height: 180,
    borderRadius: 16,
    marginRight: 16,
    overflow: "hidden",
    position: "relative",
  },
  videoImage: {
    width: "100%",
    height: "100%",
  },
  videoOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
  },
  videoGradient: {
    padding: 16,
    paddingTop: 40,
  },
  videoContent: {
    flex: 1,
    justifyContent: "flex-end",
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
    marginBottom: 4,
  },
  videoInstructor: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginBottom: 8,
  },
  videoMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  videoDuration: {
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
    fontWeight: "600",
  },
  videoViews: {
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
  },
  videoPlayButton: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  // Game Cards
  gamesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  gameCard: {
    width: (width - 60) / 2,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  gameImage: {
    width: "100%",
    height: 100,
    borderRadius: 12,
    marginBottom: 12,
  },
  gameContent: {
    flex: 1,
  },
  gameTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 4,
  },
  gameDescription: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 8,
  },
  gameMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  gamePlayers: {
    fontSize: 12,
    color: "#6b7280",
    marginLeft: 4,
  },
  gameIcon: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f59e0b",
    justifyContent: "center",
    alignItems: "center",
  },
  // Book Cards
  bookCard: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  bookImage: {
    width: 80,
    height: 100,
    borderRadius: 8,
  },
  bookContent: {
    flex: 1,
    marginLeft: 16,
    justifyContent: "center",
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 4,
  },
  bookAuthor: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 8,
  },
  bookMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 12,
    color: "#1f2937",
    fontWeight: "600",
    marginLeft: 4,
  },
  bookCategory: {
    fontSize: 12,
    color: "#6366f1",
    fontWeight: "600",
  },
  // Blog Cards
  blogCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  blogImage: {
    width: "100%",
    height: 120,
    borderRadius: 12,
    marginBottom: 12,
  },
  blogContent: {
    flex: 1,
  },
  blogTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 8,
    lineHeight: 22,
  },
  blogMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  blogAuthor: {
    fontSize: 12,
    color: "#6b7280",
  },
  blogReadTime: {
    fontSize: 12,
    color: "#9ca3af",
  },
  blogDate: {
    fontSize: 11,
    color: "#6366f1",
    fontWeight: "600",
  },
  bottomSpacing: {
    height: 20,
  },
});

export default WellnessScreen;
