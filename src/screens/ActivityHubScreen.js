import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../utils/constants';
import { apiService } from '../services/api';

const TABS = [
  { id: 'music', label: 'Music', icon: 'musical-notes' },
  { id: 'videos', label: 'Videos', icon: 'play-circle' },
  { id: 'games', label: 'Games', icon: 'game-controller' },
  { id: 'books', label: 'Books', icon: 'book' },
  { id: 'blogs', label: 'Blogs', icon: 'newspaper' },
];

const ActivityHubScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('music');
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadContent(activeTab);
  }, [activeTab]);

  const loadContent = async (type) => {
    setLoading(true);
    const response = await apiService.getActivityContent(type);
    setLoading(false);

    if (response.success) {
      setContent(response.data);
    } else {
      Alert.alert('Error', 'Failed to load content');
    }
  };

  const renderMusicItem = ({ item }) => (
    <TouchableOpacity style={styles.contentCard}>
      <View style={styles.iconCircle}>
        <Ionicons name="musical-notes" size={28} color={COLORS.primary} />
      </View>
      <View style={styles.contentInfo}>
        <Text style={styles.contentTitle}>{item.title}</Text>
        <Text style={styles.contentMeta}>{item.duration}</Text>
      </View>
      <Ionicons name="play" size={24} color={COLORS.primary} />
    </TouchableOpacity>
  );

  const renderVideoItem = ({ item }) => (
    <TouchableOpacity style={styles.contentCard}>
      <View style={styles.iconCircle}>
        <Ionicons name="videocam" size={28} color={COLORS.secondary} />
      </View>
      <View style={styles.contentInfo}>
        <Text style={styles.contentTitle}>{item.title}</Text>
        <Text style={styles.contentMeta}>{item.duration}</Text>
      </View>
      <Ionicons name="play-circle" size={24} color={COLORS.secondary} />
    </TouchableOpacity>
  );

  const renderGameItem = ({ item }) => (
    <TouchableOpacity style={styles.gameCard}>
      <Text style={styles.gameIcon}>{item.icon}</Text>
      <Text style={styles.contentTitle}>{item.title}</Text>
      <Text style={styles.gameDescription}>{item.description}</Text>
      <View style={styles.playButton}>
        <Text style={styles.playButtonText}>Play Now</Text>
      </View>
    </TouchableOpacity>
  );

  const renderBookItem = ({ item }) => (
    <TouchableOpacity style={styles.bookCard}>
      <View style={styles.bookCover}>
        <Ionicons name="book" size={40} color={COLORS.white} />
      </View>
      <View style={styles.bookInfo}>
        <Text style={styles.contentTitle}>{item.title}</Text>
        <Text style={styles.bookAuthor}>{item.author}</Text>
        <Text style={styles.contentMeta}>{item.pages} pages</Text>
      </View>
    </TouchableOpacity>
  );

  const renderBlogItem = ({ item }) => (
    <TouchableOpacity style={styles.blogCard}>
      <View style={styles.blogHeader}>
        <Text style={styles.blogTitle}>{item.title}</Text>
        <Text style={styles.blogDate}>{item.date}</Text>
      </View>
      <Text style={styles.blogExcerpt}>{item.excerpt}</Text>
      <Text style={styles.readMore}>Read More →</Text>
    </TouchableOpacity>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'music':
        return <FlatList data={content} renderItem={renderMusicItem} keyExtractor={(item) => item.id} />;
      case 'videos':
        return <FlatList data={content} renderItem={renderVideoItem} keyExtractor={(item) => item.id} />;
      case 'games':
        return (
          <View style={styles.gamesGrid}>
            {content.map((item) => (
              <View key={item.id} style={styles.gameCardWrapper}>
                {renderGameItem({ item })}
              </View>
            ))}
          </View>
        );
      case 'books':
        return <FlatList data={content} renderItem={renderBookItem} keyExtractor={(item) => item.id} />;
      case 'blogs':
        return <FlatList data={content} renderItem={renderBlogItem} keyExtractor={(item) => item.id} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} color={COLORS.white} onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Activity Hub</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContent}
        >
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, activeTab === tab.id && styles.activeTab]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Ionicons 
                name={tab.icon} 
                size={20} 
                color={activeTab === tab.id ? COLORS.white : COLORS.gray} 
              />
              <Text style={[
                styles.tabLabel, 
                activeTab === tab.id && styles.activeTabLabel
              ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        ) : (
          renderContent()
        )}
      </View>
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
  tabsContainer: {
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  tabsContent: {
    paddingHorizontal: SIZES.base,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.padding,
    paddingHorizontal: SIZES.padding,
    marginHorizontal: SIZES.base / 2,
    borderRadius: SIZES.radius,
  },
  activeTab: {
    backgroundColor: COLORS.primary,
  },
  tabLabel: {
    marginLeft: SIZES.base / 2,
    fontSize: SIZES.medium,
    color: COLORS.gray,
    fontWeight: '500',
  },
  activeTabLabel: {
    color: COLORS.white,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: SIZES.padding,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: SIZES.medium,
    color: COLORS.gray,
  },
  contentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.padding,
    elevation: 2,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentInfo: {
    flex: 1,
    marginLeft: SIZES.padding,
  },
  contentTitle: {
    fontSize: SIZES.medium,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: 4,
  },
  contentMeta: {
    fontSize: SIZES.font,
    color: COLORS.gray,
  },
  gamesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gameCardWrapper: {
    width: '48%',
    marginBottom: SIZES.padding,
  },
  gameCard: {
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    elevation: 2,
  },
  gameIcon: {
    fontSize: 48,
    marginBottom: SIZES.base,
  },
  gameDescription: {
    fontSize: SIZES.font,
    color: COLORS.gray,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: SIZES.padding,
  },
  playButton: {
    backgroundColor: COLORS.success,
    paddingVertical: SIZES.base,
    paddingHorizontal: SIZES.padding,
    borderRadius: SIZES.radius / 2,
    width: '100%',
    alignItems: 'center',
  },
  playButtonText: {
    color: COLORS.white,
    fontSize: SIZES.font,
    fontWeight: '600',
  },
  bookCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.padding,
    elevation: 2,
  },
  bookCover: {
    width: 80,
    height: 100,
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookInfo: {
    flex: 1,
    marginLeft: SIZES.padding,
    justifyContent: 'center',
  },
  bookAuthor: {
    fontSize: SIZES.font,
    color: COLORS.gray,
    fontStyle: 'italic',
    marginBottom: 4,
  },
  blogCard: {
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.padding,
    elevation: 2,
  },
  blogHeader: {
    marginBottom: SIZES.base,
  },
  blogTitle: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: 4,
  },
  blogDate: {
    fontSize: SIZES.small,
    color: COLORS.gray,
  },
  blogExcerpt: {
    fontSize: SIZES.medium,
    color: COLORS.dark,
    lineHeight: 22,
    marginBottom: SIZES.base,
  },
  readMore: {
    fontSize: SIZES.medium,
    color: COLORS.primary,
    fontWeight: '600',
  },
});

export default ActivityHubScreen;
