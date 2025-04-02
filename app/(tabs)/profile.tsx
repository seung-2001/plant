// 프로필 화면 컴포넌트
// - 사용자 정보 표시
// - 봉사 활동 통계 표시
// - 봉사 활동 기록 목록 표시

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
} from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { useAuth } from '../../context/auth';
import { router } from 'expo-router';

// 임시 데이터
const MY_STORIES = [
  {
    id: 1,
    title: '첫 봉사활동 후기',
    content: '오늘은 양로원에서 봉사활동을 했어요. 어르신들과 함께한 시간이 너무 뜻깊었습니다.',
    date: '2024-03-20',
    likes: 24,
    comments: 5,
    image: 'https://via.placeholder.com/300',
  },
];

const MY_POSTS = [
  {
    id: 1,
    content: '이번 주말 봉사활동 함께하실 분 계신가요?',
    date: '2024-03-21',
    likes: 15,
    comments: 3,
  },
];

// 임시 봉사 활동 데이터
const MY_ACTIVITIES = [
  {
    id: '1',
    title: '서울시립어린이집 봉사활동',
    date: '2024-03-15',
    hours: 4,
    status: '완료',
    organization: '서울시립어린이집',
    category: '아동/청소년',
  },
  {
    id: '2',
    title: '강남구 노인복지관 봉사활동',
    date: '2024-03-10',
    hours: 3,
    status: '완료',
    organization: '강남구 노인복지관',
    category: '노인/실버',
  },
];

// 프로필 화면 컴포넌트
export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<'activities' | 'content' | 'settings'>('activities');
  const [contentType, setContentType] = useState<'stories' | 'posts'>('stories');
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);

  // 봉사 활동 통계 계산
  const totalHours = MY_ACTIVITIES.reduce((sum, activity) => sum + activity.hours, 0);
  const completedActivities = MY_ACTIVITIES.filter(activity => activity.status === '완료').length;

  const renderStories = () => {
    return MY_STORIES.map((story) => (
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
    ));
  };

  const renderPosts = () => {
    return MY_POSTS.map((post) => (
      <View key={post.id} style={styles.storyItem}>
        <Text style={styles.postContent}>{post.content}</Text>
        <View style={styles.postFooter}>
          <Text style={styles.postDate}>{post.date}</Text>
          <View style={styles.postStats}>
            <TouchableOpacity style={styles.statButton}>
              <Text>❤️ {post.likes}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.statButton}>
              <Text>💬 {post.comments}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    ));
  };

  const renderActivities = () => {
    return (
      <View style={styles.activitiesContainer}>
        {/* 봉사 활동 통계 */}
        <View style={styles.statsSection}>
          <View style={styles.statBox}>
            <Text style={styles.statBoxNumber}>{totalHours}</Text>
            <Text style={styles.statBoxLabel}>총 봉사시간</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statBoxNumber}>{MY_ACTIVITIES.length}</Text>
            <Text style={styles.statBoxLabel}>참여활동</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statBoxNumber}>{completedActivities}</Text>
            <Text style={styles.statBoxLabel}>완료활동</Text>
          </View>
        </View>

        {/* 봉사 활동 목록 */}
        {MY_ACTIVITIES.map((activity) => (
          <View key={activity.id} style={styles.activityItem}>
            <View style={styles.activityHeader}>
              <View style={styles.activityCategory}>
                <Text style={styles.activityCategoryText}>{activity.category}</Text>
              </View>
              <Text style={styles.activityStatus}>{activity.status}</Text>
            </View>
            <Text style={styles.activityTitle}>{activity.title}</Text>
            <View style={styles.activityInfo}>
              <Text style={styles.activityOrg}>{activity.organization}</Text>
              <View style={styles.activityMeta}>
                <Text style={styles.activityDate}>{activity.date}</Text>
                <Text style={styles.activityHours}>{activity.hours}시간</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    );
  };

  const renderContent = () => {
    return (
      <View style={styles.contentContainer}>
        {/* 컨텐츠 타입 선택 */}
        <View style={styles.contentTypeSelector}>
          <TouchableOpacity 
            style={[styles.contentTypeButton, contentType === 'stories' && styles.activeContentTypeButton]}
            onPress={() => setContentType('stories')}
          >
            <Text style={[styles.contentTypeText, contentType === 'stories' && styles.activeContentTypeText]}>
              봉사자 이야기
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.contentTypeButton, contentType === 'posts' && styles.activeContentTypeButton]}
            onPress={() => setContentType('posts')}
          >
            <Text style={[styles.contentTypeText, contentType === 'posts' && styles.activeContentTypeText]}>
              게시물
            </Text>
          </TouchableOpacity>
        </View>

        {/* 컨텐츠 목록 */}
        {contentType === 'stories' ? renderStories() : renderPosts()}
      </View>
    );
  };

  const renderSettings = () => {
    return (
      <View style={styles.settingsContainer}>
        {/* 계정 설정 */}
        <View style={styles.settingSection}>
          <Text style={styles.settingSectionTitle}>계정 설정</Text>
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="person-outline" size={24} color="#666" />
              <Text style={styles.settingText}>프로필 수정</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="lock-closed-outline" size={24} color="#666" />
              <Text style={styles.settingText}>비밀번호 변경</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        {/* 알림 설정 */}
        <View style={styles.settingSection}>
          <Text style={styles.settingSectionTitle}>알림 설정</Text>
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="notifications-outline" size={24} color="#666" />
              <Text style={styles.settingText}>푸시 알림</Text>
            </View>
            <Switch
              value={pushNotifications}
              onValueChange={setPushNotifications}
              trackColor={{ false: '#ddd', true: '#FFB74D' }}
              thumbColor={pushNotifications ? '#FF9500' : '#f4f3f4'}
            />
          </View>
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="mail-outline" size={24} color="#666" />
              <Text style={styles.settingText}>이메일 알림</Text>
            </View>
            <Switch
              value={emailNotifications}
              onValueChange={setEmailNotifications}
              trackColor={{ false: '#ddd', true: '#FFB74D' }}
              thumbColor={emailNotifications ? '#FF9500' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* 기타 설정 */}
        <View style={styles.settingSection}>
          <Text style={styles.settingSectionTitle}>기타</Text>
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="information-circle-outline" size={24} color="#666" />
              <Text style={styles.settingText}>앱 정보</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="document-text-outline" size={24} color="#666" />
              <Text style={styles.settingText}>이용약관</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="shield-checkmark-outline" size={24} color="#666" />
              <Text style={styles.settingText}>개인정보 처리방침</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        {/* 로그아웃 */}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={signOut}
        >
          <Text style={styles.logoutButtonText}>로그아웃</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* 프로필 정보 */}
      <View style={styles.profileHeader}>
        <Image
          source={{ uri: 'https://via.placeholder.com/100' }}
          style={styles.profileImage}
        />
        <View style={styles.profileInfo}>
          <Text style={styles.userName}>{user?.email || '사용자'}</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{totalHours}</Text>
              <Text style={styles.statLabel}>봉사시간</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{MY_STORIES.length + MY_POSTS.length}</Text>
              <Text style={styles.statLabel}>작성글</Text>
            </View>
          </View>
        </View>
      </View>

      {/* 탭 메뉴 */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'activities' && styles.activeTab]}
          onPress={() => setActiveTab('activities')}
        >
          <Text style={[styles.tabText, activeTab === 'activities' && styles.activeTabText]}>
            봉사실적
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'content' && styles.activeTab]}
          onPress={() => setActiveTab('content')}
        >
          <Text style={[styles.tabText, activeTab === 'content' && styles.activeTabText]}>
            작성글
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'settings' && styles.activeTab]}
          onPress={() => setActiveTab('settings')}
        >
          <Text style={[styles.tabText, activeTab === 'settings' && styles.activeTabText]}>
            설정
          </Text>
        </TouchableOpacity>
      </View>

      {/* 컨텐츠 */}
      <ScrollView style={styles.content}>
        {activeTab === 'activities' ? renderActivities() :
         activeTab === 'content' ? renderContent() : 
         renderSettings()}
      </ScrollView>
    </View>
  );
}

// 스타일 정의
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  profileHeader: {
    backgroundColor: '#fff',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 20,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF9500',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#FF9500',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#FF9500',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  storyItem: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    padding: 15,
    borderWidth: 1,
    borderColor: '#eee',
  },
  storyImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  storyContent: {
    gap: 8,
  },
  storyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  storyPreview: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  storyFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  storyDate: {
    fontSize: 12,
    color: '#666',
  },
  storyStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  storyStatText: {
    marginLeft: 5,
    color: '#666',
  },
  commentIcon: {
    marginLeft: 10,
  },
  postContent: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 10,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  postDate: {
    fontSize: 12,
    color: '#666',
  },
  postStats: {
    flexDirection: 'row',
    gap: 15,
  },
  statButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  settingsContainer: {
    paddingBottom: 30,
  },
  settingSection: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 20,
    overflow: 'hidden',
  },
  settingSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  settingText: {
    fontSize: 16,
    color: '#333',
  },
  logoutButton: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  logoutButtonText: {
    fontSize: 16,
    color: '#FF3B30',
    fontWeight: 'bold',
  },
  activitiesContainer: {
    paddingBottom: 30,
  },
  statsSection: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statBoxNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF9500',
    marginBottom: 5,
  },
  statBoxLabel: {
    fontSize: 14,
    color: '#666',
  },
  activityItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#eee',
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  activityCategory: {
    backgroundColor: '#FFE5CC',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  activityCategoryText: {
    color: '#FF9500',
    fontSize: 12,
    fontWeight: 'bold',
  },
  activityStatus: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: 'bold',
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  activityInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activityOrg: {
    fontSize: 14,
    color: '#666',
  },
  activityMeta: {
    flexDirection: 'row',
    gap: 15,
  },
  activityDate: {
    fontSize: 14,
    color: '#666',
  },
  activityHours: {
    fontSize: 14,
    color: '#FF9500',
    fontWeight: 'bold',
  },
  contentContainer: {
    paddingBottom: 30,
  },
  contentTypeSelector: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 20,
    padding: 5,
  },
  contentTypeButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeContentTypeButton: {
    backgroundColor: '#FF9500',
  },
  contentTypeText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeContentTypeText: {
    color: '#fff',
  },
}); 
 