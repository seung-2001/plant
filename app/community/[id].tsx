// 커뮤니티 게시글 상세 화면 컴포넌트
// - 게시글의 상세 내용 표시
// - 댓글 목록 표시
// - 댓글 작성 기능

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";

// 커뮤니티 게시글 상세 화면 컴포넌트
export default function CommunityDetailScreen() {
  const { id } = useLocalSearchParams();
  const [comment, setComment] = useState("");

  // 게시글 정보
  const post = {
    author: "김봉사",
    title: "어린이집 봉사활동 후기",
    content:
      "오늘 서울시립어린이집에서 봉사활동을 다녀왔습니다. 아이들과 함께 놀이를 하고, 간식을 나누며 즐거운 시간을 보냈습니다. 특히 아이들의 순수한 미소가 인상적이었습니다. 다음에도 기회가 된다면 또 참여하고 싶습니다.",
    date: "2024-03-15",
    likes: 12,
    comments: [
      {
        id: "1",
        author: "이봉사",
        content: "저도 참여했는데 정말 좋은 경험이었어요!",
        date: "2024-03-15",
        likes: 3,
      },
      {
        id: "2",
        author: "박봉사",
        content: "다음 봉사활동도 함께 가요!",
        date: "2024-03-15",
        likes: 2,
      },
    ],
  };

  // 댓글 작성 처리 함수
  const handleCommentSubmit = () => {
    if (comment.trim()) {
      // TODO: 댓글 작성 로직 구현
      setComment("");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView style={styles.content}>
        {/* 게시글 헤더 */}
        <View style={styles.header}>
          <View style={styles.authorInfo}>
            <Text style={styles.author}>{post.author}</Text>
            <Text style={styles.date}>{post.date}</Text>
          </View>
          <TouchableOpacity>
            <Ionicons name="ellipsis-horizontal" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        {/* 게시글 내용 */}
        <View style={styles.postContent}>
          <Text style={styles.title}>{post.title}</Text>
          <Text style={styles.postContentText}>{post.content}</Text>
        </View>

        {/* 게시글 통계 */}
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Ionicons name="heart-outline" size={20} color="#FF9500" />
            <Text style={styles.statText}>{post.likes}</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="chatbubble-outline" size={20} color="#FF9500" />
            <Text style={styles.statText}>{post.comments.length}</Text>
          </View>
        </View>

        {/* 댓글 목록 */}
        <View style={styles.commentsSection}>
          <Text style={styles.sectionTitle}>댓글</Text>
          {post.comments.map((comment) => (
            <View key={comment.id} style={styles.commentItem}>
              <View style={styles.commentHeader}>
                <Text style={styles.commentAuthor}>{comment.author}</Text>
                <Text style={styles.commentDate}>{comment.date}</Text>
              </View>
              <Text style={styles.commentContent}>{comment.content}</Text>
              <View style={styles.commentFooter}>
                <TouchableOpacity style={styles.commentAction}>
                  <Ionicons name="heart-outline" size={16} color="#666" />
                  <Text style={styles.commentActionText}>{comment.likes}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.commentAction}>
                  <Ionicons name="chatbubble-outline" size={16} color="#666" />
                  <Text style={styles.commentActionText}>답글</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* 댓글 입력 */}
      <View style={styles.commentInput}>
        <TextInput
          style={styles.input}
          placeholder="댓글을 입력하세요"
          value={comment}
          onChangeText={setComment}
          multiline
        />
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleCommentSubmit}
        >
          <Text style={styles.submitButtonText}>전송</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

// 스타일 정의
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  authorInfo: {
    flex: 1,
  },
  author: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  date: {
    fontSize: 14,
    color: "#666",
  },
  postContent: {
    padding: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  postContentText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
  },
  stats: {
    flexDirection: "row",
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  statText: {
    marginLeft: 5,
    fontSize: 14,
    color: "#666",
  },
  commentsSection: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  commentItem: {
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  commentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: "bold",
  },
  commentDate: {
    fontSize: 12,
    color: "#666",
  },
  commentContent: {
    fontSize: 14,
    marginBottom: 10,
  },
  commentFooter: {
    flexDirection: "row",
  },
  commentAction: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  commentActionText: {
    marginLeft: 5,
    fontSize: 12,
    color: "#666",
  },
  commentInput: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    maxHeight: 100,
  },
  submitButton: {
    justifyContent: "center",
    paddingHorizontal: 15,
  },
  submitButtonText: {
    color: "#FF9500",
    fontWeight: "bold",
  },
}); 