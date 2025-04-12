// 커뮤니티 화면 컴포넌트
// - 공지사항과 스토리 섹션을 표시
// - 검색 기능 제공
// - 게시글 목록 표시

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, SectionList, FlatList, Dimensions } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { router, Link, useRouter } from "expo-router";
import { useAuth } from '../../context/auth';

const { width } = Dimensions.get('window');
const POST_WIDTH = (width - 2) / 3;

// 임시 게시물 데이터
const DUMMY_POSTS = [
  {
    id: '1',
    user: {
      name: '김봉사',
      avatar: 'https://picsum.photos/200',
    },
    content: '오늘 첫 봉사활동 다녀왔어요! 보람찼습니다 😊',
    image: 'https://picsum.photos/400',
    likes: 24,
    comments: 5,
    createdAt: '10분 전',
  },
  {
    id: '2',
    user: {
      name: '이나눔',
      avatar: 'https://picsum.photos/201',
    },
    content: '주말 봉사 모임 함께하실 분 구해요~\n이번 주 토요일 오전 10시, 시청 앞 집결입니다!',
    likes: 15,
    comments: 8,
    createdAt: '1시간 전',
  },
];

interface Post {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  content: string;
  image?: string;
  likes: number;
  comments: number;
  createdAt: string;
}

interface Notice {
  id: number;
  title: string;
  date: string;
  isImportant: boolean;
}

interface Story {
  id: number;
  author: string;
  title: string;
  content: string;
  date: string;
  likes: number;
  comments: number;
  image: string;
}

interface SectionData {
  type: 'notices' | 'stories' | 'posts';
  items: Notice[] | Story[] | Post[];
}

interface SectionType {
  title: string;
  data: SectionData[];
}

export default function CommunityScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'stories' | 'posts'>('stories');
  const { user } = useAuth();
  const [posts, setPosts] = useState(DUMMY_POSTS);
  const router = useRouter();

  const notices = [
    {
      id: 1,
      title: '2024년 봄맞이 봉사자 모집',
      date: '2024-03-20',
      isImportant: true,
    },
    {
      id: 2,
      title: '봉사자 안전 교육 안내',
      date: '2024-03-18',
      isImportant: true,
    },
  ];

  const stories = [
    {
      id: 1,
      author: '김봉사',
      title: '보육원에서의 특별한 하루',
      content: '오늘은 아이들과 함께 미술 활동을 했습니다...',
      date: '2024-03-19',
      likes: 12,
      comments: 3,
      image: 'https://picsum.photos/402',
    },
    {
      id: 2,
      author: '이봉사',
      title: '노인 복지관 봉사 후기',
      content: '어르신들과 함께 노래를 부르고 이야기를 나누었습니다...',
      date: '2024-03-18',
      likes: 8,
      comments: 2,
      image: 'https://picsum.photos/403',
    },
  ];

  const renderNotices = (data: SectionData) => {
    if (data.type !== 'notices') return <View />;
    const items = data.items as Notice[];
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>공지사항</Text>
        {items.map((notice) => (
          <TouchableOpacity
            key={notice.id}
            style={styles.noticeItem}
            onPress={() => router.push(`/community/${notice.id}`)}
          >
            <View style={styles.noticeContent}>
              {notice.isImportant && (
                <Text style={styles.importantBadge}>중요</Text>
              )}
              <Text style={styles.noticeTitle}>{notice.title}</Text>
            </View>
            <Text style={styles.noticeDate}>{notice.date}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderStories = (data: SectionData) => {
    if (data.type !== 'stories') return <View />;
    const items = data.items as Story[];
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>봉사자 이야기</Text>
        {items.map((story) => (
          <TouchableOpacity
            key={story.id}
            style={styles.storyItem}
            onPress={() => router.push(`/community/${story.id}`)}
          >
            <Image source={{ uri: story.image }} style={styles.storyImage} />
            <View style={styles.storyContent}>
              <Text style={styles.storyTitle}>{story.title}</Text>
              <Text style={styles.storyPreview} numberOfLines={2}>
                {story.content}
              </Text>
              <View style={styles.storyFooter}>
                <Text style={styles.storyAuthor}>{story.author}</Text>
                <Text style={styles.storyDate}>{story.date}</Text>
                <View style={styles.storyStats}>
                  <FontAwesome name="heart" size={14} color="#FF6B00" />
                  <Text style={styles.storyStatText}>{story.likes}</Text>
                  <FontAwesome name="comment" size={14} color="#666" style={styles.commentIcon} />
                  <Text style={styles.storyStatText}>{story.comments}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderPosts = (data: SectionData) => {
    if (data.type !== 'posts') return <View />;
    const items = data.items as Post[];
    return (
      <View style={styles.section}>
        {items.map((post) => (
          <TouchableOpacity
            key={post.id}
            style={styles.storyItem}
            onPress={() => router.push(`/community/${post.id}`)}
          >
            <Image source={{ uri: post.image }} style={styles.storyImage} />
            <View style={styles.storyContent}>
              <View style={styles.storyHeader}>
                <Image source={{ uri: post.user.avatar }} style={styles.storyAvatar} />
                <Text style={styles.storyUsername}>{post.user.name}</Text>
              </View>
              <Text style={styles.storyPreview}>{post.content}</Text>
              <View style={styles.storyFooter}>
                <Text style={styles.storyDate}>{post.createdAt}</Text>
                <View style={styles.storyStats}>
                  <FontAwesome name="heart" size={14} color="#FF6B00" />
                  <Text style={styles.storyStatText}>{post.likes}</Text>
                  <FontAwesome name="comment" size={14} color="#666" style={styles.commentIcon} />
                  <Text style={styles.storyStatText}>{post.comments}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const sections: SectionType[] = [
    {
      title: '공지사항',
      data: [{ type: 'notices' as const, items: notices }],
    },
    ...(activeTab === 'stories' ? [{
      title: '봉사자 이야기',
      data: [{ type: 'stories' as const, items: stories }],
    }] : [{
      title: '게시물',
      data: [{ type: 'posts' as const, items: DUMMY_POSTS }],
    }]),
  ];

  const renderItem = ({ item }: { item: SectionData }) => {
    switch (item.type) {
      case 'notices':
        return renderNotices(item);
      case 'stories':
        return renderStories(item);
      case 'posts':
        return renderPosts(item);
      default:
        return <View />;
    }
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>커뮤니티</Text>
        <TouchableOpacity 
          style={styles.writeButton}
          onPress={() => router.push('/community/write')}
        >
          <Text style={styles.writeButtonText}>글쓰기</Text>
        </TouchableOpacity>
      </View>

      {/* 검색바 */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="검색어를 입력하세요"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* 탭 메뉴 */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'stories' && styles.activeTab]}
          onPress={() => setActiveTab('stories')}
        >
          <Text style={[styles.tabText, activeTab === 'stories' && styles.activeTabText]}>
            봉사자 이야기
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'posts' && styles.activeTab]}
          onPress={() => setActiveTab('posts')}
        >
          <Text style={[styles.tabText, activeTab === 'posts' && styles.activeTabText]}>
            게시물
          </Text>
        </TouchableOpacity>
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item, index) => String(index)}
        renderItem={renderItem}
        renderSectionHeader={({ section }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderTitle}>{section.title}</Text>
          </View>
        )}
        stickySectionHeadersEnabled={true}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  writeButton: {
    backgroundColor: '#FF9500',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  writeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 15,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  noticeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  noticeContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  importantBadge: {
    backgroundColor: '#FF6B00',
    color: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 12,
    marginRight: 10,
  },
  noticeTitle: {
    fontSize: 16,
    flex: 1,
  },
  noticeDate: {
    fontSize: 14,
    color: '#666',
  },
  storyItem: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eee',
  },
  storyImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  storyContent: {
    padding: 15,
  },
  storyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  storyAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  storyUsername: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  storyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  storyPreview: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  storyFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  storyAuthor: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  storyDate: {
    fontSize: 14,
    color: '#666',
  },
  storyStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  storyStatText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  commentIcon: {
    marginLeft: 15,
  },
  postContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  moreButton: {
    fontSize: 20,
    color: '#666',
  },
  postContent: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 10,
  },
  postImage: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    marginBottom: 10,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: 15,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  timestamp: {
    color: '#666',
    fontSize: 14,
  },
  sectionHeader: {
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionHeaderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#000',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#000',
    fontWeight: 'bold',
  },
  postOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
    padding: 8,
  },
  postStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    color: 'white',
    marginLeft: 4,
    marginRight: 12,
    fontWeight: '600',
  },
}); 