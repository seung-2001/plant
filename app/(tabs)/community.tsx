// 커뮤니티 화면 컴포넌트
// - 공지사항과 스토리 섹션을 표시
// - 검색 기능 제공
// - 게시글 목록 표시

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { router } from "expo-router";

export default function CommunityScreen() {
  const [searchQuery, setSearchQuery] = useState('');

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
      image: 'https://via.placeholder.com/300x200',
    },
    {
      id: 2,
      author: '이봉사',
      title: '노인 복지관 봉사 후기',
      content: '어르신들과 함께 노래를 부르고 이야기를 나누었습니다...',
      date: '2024-03-18',
      likes: 8,
      comments: 2,
      image: 'https://via.placeholder.com/300x200',
    },
  ];

  return (
    <View style={styles.container}>
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

      <ScrollView style={styles.content}>
        {/* 공지사항 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>공지사항</Text>
          {notices.map((notice) => (
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

        {/* 스토리 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>봉사자 이야기</Text>
          {stories.map((story) => (
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
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  },
  storyImage: {
    width: '100%',
    height: 200,
  },
  storyContent: {
    padding: 15,
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
}); 