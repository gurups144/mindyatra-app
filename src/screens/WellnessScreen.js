import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

const WellnessScreen = () => {
  const navigation = useNavigation();
  const scrollViewRef = useRef(null);
  const [activeSection, setActiveSection] = useState(0);

  const sectionTitles = [
    "Music Therapy",
    "Mindful Videos",
    "Relaxing Games",
    "Wellness Books",
    "Expert Blogs",
  ];

  // Sample data with images
  const musicData = [
    {
      id: "1",
      title: "Calm Ocean Waves",
      artist: "Nature Sounds",
      duration: "30 min",
      listeners: "12.4K",
      image:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop",
      color: ["#667eea", "#764ba2"],
    },
    {
      id: "2",
      title: "Peaceful Piano",
      artist: "Classical Melodies",
      duration: "45 min",
      listeners: "8.7K",
      image:
        "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop",
      color: ["#ec4899", "#f43f5e"],
    },
    {
      id: "3",
      title: "Meditation Guide",
      artist: "Mindfulness Expert",
      duration: "20 min",
      listeners: "15.2K",
      image:
        "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop",
      color: ["#14b8a6", "#06b6d4"],
    },
  ];

  const videosData = [
    {
      id: "1",
      title: "Morning Yoga Flow",
      instructor: "Sarah Johnson",
      duration: "25 min",
      views: "24.8K",
      image:
        "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop",
      color: ["#f59e0b", "#ef4444"],
    },
    {
      id: "2",
      title: "Breathing Techniques",
      instructor: "Dr. Michael Chen",
      duration: "15 min",
      views: "18.3K",
      image:
        "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=400&h=400&fit=crop",
      color: ["#8b5cf6", "#a855f7"],
    },
    {
      id: "3",
      title: "Stress Relief Session",
      instructor: "Emma Wilson",
      duration: "30 min",
      views: "32.1K",
      image:
        "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=400&fit=crop",
      color: ["#10b981", "#059669"],
    },
  ];

  const gamesData = [
    {
      id: "1",
      title: "Mindful Journey",
      description: "Relaxing puzzle adventure",
      players: "45.2K",
      image:
        "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=400&fit=crop",
      color: "#f59e0b",
    },
    {
      id: "2",
      title: "Breath Trainer",
      description: "Interactive breathing exercises",
      players: "28.7K",
      image:
        "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop",
      color: "#06b6d4",
    },
    {
      id: "3",
      title: "Zen Garden",
      description: "Create peaceful spaces",
      players: "63.4K",
      image:
        "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&h=400&fit=crop",
      color: "#10b981",
    },
  ];

  const booksData = [
    {
      id: "1",
      title: "The Power of Now",
      author: "Eckhart Tolle",
      category: "Mindfulness",
      rating: "4.8",
      image:
        "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop",
    },
    {
      id: "2",
      title: "Atomic Habits",
      author: "James Clear",
      category: "Self-Improvement",
      rating: "4.9",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    },
    {
      id: "3",
      title: "Why We Sleep",
      author: "Matthew Walker",
      category: "Health",
      rating: "4.7",
      image:
        "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop",
    },
  ];

  const blogsData = [
    {
      id: "1",
      title: "10 Science-Backed Tips for Better Sleep",
      author: "Sleep Expert",
      readTime: "8 min",
      date: "2 days ago",
      image:
        "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400&h=400&fit=crop",
    },
    {
      id: "2",
      title: "Mindfulness Meditation for Beginners",
      author: "Meditation Coach",
      readTime: "6 min",
      date: "1 week ago",
      image:
        "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=400&fit=crop",
    },
    {
      id: "3",
      title: "Natural Ways to Reduce Anxiety",
      author: "Wellness Guru",
      readTime: "10 min",
      date: "3 days ago",
      image:
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop",
    },
  ];

  const scrollToSection = (index) => {
    setActiveSection(index);
    scrollViewRef.current?.scrollTo({
      x: index * width,
      animated: true,
    });
  };

  const renderMusicSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Music Therapy</Text>
      <Text style={styles.sectionSubtitle}>Soothing sounds for your mind</Text>

      <FlatList
        data={musicData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.musicCard}>
            <LinearGradient colors={item.color} style={styles.musicGradient}>
              <Image source={{ uri: item.image }} style={styles.musicImage} />
              <View style={styles.musicContent}>
                <Text style={styles.musicTitle}>{item.title}</Text>
                <Text style={styles.musicArtist}>{item.artist}</Text>
                <View style={styles.musicMeta}>
                  <Text style={styles.musicDuration}>{item.duration}</Text>
                  <Text style={styles.musicListeners}>
                    {item.listeners} listeners
                  </Text>
                </View>
              </View>
              <TouchableOpacity style={styles.playButton}>
                <Ionicons name="play" size={24} color="white" />
              </TouchableOpacity>
            </LinearGradient>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );

  const renderVideosSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Mindful Videos</Text>
      <Text style={styles.sectionSubtitle}>Guided practices for peace</Text>

      <FlatList
        data={videosData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.videoCard}>
            <Image source={{ uri: item.image }} style={styles.videoImage} />
            <View style={styles.videoOverlay}>
              <LinearGradient
                colors={["transparent", "rgba(0,0,0,0.8)"]}
                style={styles.videoGradient}
              >
                <View style={styles.videoContent}>
                  <Text style={styles.videoTitle}>{item.title}</Text>
                  <Text style={styles.videoInstructor}>
                    With {item.instructor}
                  </Text>
                  <View style={styles.videoMeta}>
                    <Text style={styles.videoDuration}>{item.duration}</Text>
                    <Text style={styles.videoViews}>{item.views} views</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.videoPlayButton}>
                  <Ionicons name="play" size={28} color="white" />
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );

  const renderGamesSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Relaxing Games</Text>
      <Text style={styles.sectionSubtitle}>Fun ways to unwind</Text>

      <View style={styles.gamesGrid}>
        {gamesData.map((item) => (
          <TouchableOpacity key={item.id} style={styles.gameCard}>
            <Image source={{ uri: item.image }} style={styles.gameImage} />
            <View style={styles.gameContent}>
              <Text style={styles.gameTitle}>{item.title}</Text>
              <Text style={styles.gameDescription}>{item.description}</Text>
              <View style={styles.gameMeta}>
                <Ionicons name="people" size={16} color="#6b7280" />
                <Text style={styles.gamePlayers}>{item.players} players</Text>
              </View>
            </View>
            <View style={[styles.gameIcon, { backgroundColor: item.color }]}>
              <Ionicons name="play" size={20} color="white" />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderBooksSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Wellness Books</Text>
      <Text style={styles.sectionSubtitle}>Expand your knowledge</Text>

      <FlatList
        data={booksData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
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
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );

  const renderBlogsSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Expert Blogs</Text>
      <Text style={styles.sectionSubtitle}>Insights from professionals</Text>

      <FlatList
        data={blogsData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
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
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Minimal Header */}
      <View style={styles.minimalHeader}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Wellness Library</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search" size={24} color="#1f2937" />
        </TouchableOpacity>
      </View>

      {/* Section Indicator */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.sectionIndicator}
        contentContainerStyle={styles.sectionIndicatorContent}
      >
        {sectionTitles.map((title, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.sectionTab,
              activeSection === index && styles.activeSectionTab,
            ]}
            onPress={() => scrollToSection(index)}
          >
            <Text
              style={[
                styles.sectionTabText,
                activeSection === index && styles.activeSectionTabText,
              ]}
            >
              {title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Main Content - Horizontal Scroll */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const newIndex = Math.round(
            event.nativeEvent.contentOffset.x / width
          );
          setActiveSection(newIndex);
        }}
        style={styles.horizontalScroll}
      >
        {renderMusicSection()}
        {renderVideosSection()}
        {renderGamesSection()}
        {renderBooksSection()}
        {renderBlogsSection()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  minimalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1f2937",
  },
  searchButton: {
    padding: 8,
  },
  sectionIndicator: {
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  sectionIndicatorContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionTab: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginRight: 12,
    borderRadius: 25,
    backgroundColor: "#f3f4f6",
  },
  activeSectionTab: {
    backgroundColor: "#6366f1",
  },
  sectionTabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6b7280",
  },
  activeSectionTabText: {
    color: "white",
  },
  horizontalScroll: {
    flex: 1,
  },
  section: {
    width: width - 40,
    marginHorizontal: 20,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: "#6b7280",
    marginBottom: 24,
  },
  listContent: {
    paddingBottom: 40,
  },
  // Music Section Styles
  musicCard: {
    borderRadius: 20,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  musicGradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    minHeight: 120,
  },
  musicImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  musicContent: {
    flex: 1,
    marginLeft: 16,
  },
  musicTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "white",
    marginBottom: 4,
  },
  musicArtist: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginBottom: 8,
  },
  musicMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  musicDuration: {
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
    fontWeight: "600",
  },
  musicListeners: {
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
  },
  playButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
  // Video Section Styles
  videoCard: {
    borderRadius: 20,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  videoImage: {
    width: "100%",
    height: 200,
  },
  videoOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
  },
  videoGradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    paddingTop: 40,
  },
  videoContent: {
    flex: 1,
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: "700",
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
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 16,
  },
  // Games Section Styles
  gamesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
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
    justifyContent: "center",
    alignItems: "center",
  },
  // Books Section Styles
  bookCard: {
    flexDirection: "row",
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
  // Blogs Section Styles
  blogCard: {
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
});

export default WellnessScreen;
