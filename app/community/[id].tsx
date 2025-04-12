// 커뮤니티 게시글 상세 화면 컴포넌트
// - 게시글의 상세 내용 표시
// - 댓글 목록 표시
// - 댓글 작성 기능

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Image,
  BackHandler,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, Stack, useRouter } from "expo-router";

// 커뮤니티 게시글 상세 화면 컴포넌트
export default function PostDetailScreen() {
  const { id } = useLocalSearchParams();
  const [isLiked, setIsLiked] = useState(false);
  const [comment, setComment] = useState("");
  const router = useRouter();

  // 안드로이드 뒤로가기 버튼 처리
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      router.push('/(tabs)/community');
      return true;
    });

    return () => backHandler.remove();
  }, []);

  // 임시 데이터
  const post = {
    id: '1',
    image: 'https://picsum.photos/400',
    description: '오늘 키우는 식물의 성장 과정을 공유합니다 🌱',
    likes: 120,
    commentCount: 15,
    createdAt: '2시간 전',
    user: {
      id: '1',
      name: 'plant_lover',
      avatar: 'https://picsum.photos/200'
    },
    commentList: [
      {
        id: '1',
        user: {
          name: 'plant_friend',
          avatar: 'https://picsum.photos/201'
        },
        text: '정말 예쁘네요!',
        createdAt: '1시간 전'
      },
      // ... 더 많은 댓글
    ]
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: '게시물',
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => router.push('/(tabs)/community')}
              style={{ marginLeft: 10 }}
            >
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      
      <ScrollView>
        {/* 게시물 헤더 */}
        <View style={styles.header}>
          <Image source={{ uri: post.user.avatar }} style={styles.avatar} />
          <Text style={styles.username}>{post.user.name}</Text>
        </View>

        {/* 게시물 이미지 */}
        <Image source={{ uri: post.image }} style={styles.postImage} />

        {/* 게시물 액션 버튼 */}
        <View style={styles.actions}>
          <TouchableOpacity onPress={() => setIsLiked(!isLiked)}>
            <Ionicons 
              name={isLiked ? "heart" : "heart-outline"} 
              size={28} 
              color={isLiked ? "red" : "black"} 
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="chatbubble-outline" size={28} color="black" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="paper-plane-outline" size={28} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.bookmark}>
            <Ionicons name="bookmark-outline" size={28} color="black" />
          </TouchableOpacity>
        </View>

        {/* 좋아요 수 */}
        <Text style={styles.likes}>{post.likes}명이 좋아합니다</Text>

        {/* 게시물 설명 */}
        <View style={styles.description}>
          <Text style={styles.username}>{post.user.name}</Text>
          <Text style={styles.text}>{post.description}</Text>
        </View>

        {/* 댓글 */}
        <View style={styles.comments}>
          {post.commentList.map(comment => (
            <View key={comment.id} style={styles.comment}>
              <Image source={{ uri: comment.user.avatar }} style={styles.commentAvatar} />
              <View style={styles.commentContent}>
                <Text style={styles.commentUsername}>{comment.user.name}</Text>
                <Text style={styles.commentText}>{comment.text}</Text>
                <Text style={styles.commentTime}>{comment.createdAt}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* 댓글 입력 */}
      <View style={styles.commentInput}>
        <Image source={{ uri: post.user.avatar }} style={styles.inputAvatar} />
        <TextInput
          style={styles.input}
          placeholder="댓글 달기..."
          value={comment}
          onChangeText={setComment}
        />
        <TouchableOpacity>
          <Text style={styles.postButton}>게시</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// 스타일 정의
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    fontWeight: "bold",
    fontSize: 16,
  },
  postImage: {
    width: "100%",
    aspectRatio: 1,
  },
  actions: {
    flexDirection: "row",
    padding: 10,
  },
  bookmark: {
    marginLeft: "auto",
  },
  likes: {
    fontWeight: "bold",
    paddingHorizontal: 10,
    paddingBottom: 5,
  },
  description: {
    flexDirection: "row",
    padding: 10,
  },
  text: {
    marginLeft: 5,
  },
  comments: {
    padding: 10,
  },
  comment: {
    flexDirection: "row",
    marginBottom: 10,
  },
  commentAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  commentContent: {
    flex: 1,
  },
  commentUsername: {
    fontWeight: "bold",
  },
  commentText: {
    marginTop: 2,
  },
  commentTime: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  commentInput: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  inputAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
  },
  postButton: {
    color: "#0095f6",
    fontWeight: "bold",
  },
}); 