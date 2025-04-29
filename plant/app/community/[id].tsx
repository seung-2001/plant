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
  SafeAreaView,
  Dimensions,
  Alert,
} from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { useLocalSearchParams, Stack, useRouter, Link } from "expo-router";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getPost, createComment, updateComment, deleteComment } from '@/services/communityService';
import { useAuth } from '../../context/auth';
import { useUser } from '@/contexts/UserContext';
import { Post, Comment } from '@/types';

interface PostWithComments extends Post {
  comments: Comment[];
}

// 커뮤니티 게시글 상세 화면 컴포넌트
export default function PostDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const inset = useSafeAreaInsets();
  const { user } = useAuth();
  const { user: userContext } = useUser();
  const [post, setPost] = useState<PostWithComments | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");
  const [editingComment, setEditingComment] = useState<number | null>(null);
  const [editCommentText, setEditCommentText] = useState("");

  useEffect(() => {
    if (id) {
      fetchPost(Number(id));
    }
  }, [id]);

  const fetchPost = async (postId: number) => {
    try {
      const response = await getPost(postId);
      const postWithComments: PostWithComments = {
        ...response.post,
        comments: response.comments
      };
      setPost(postWithComments);
      setLoading(false);
    } catch (err) {
      setError('게시글을 불러오는데 실패했습니다.');
      setLoading(false);
    }
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim() || !post) return;
    
    try {
      const comment = await createComment(post.id, newComment);
      setPost(prevPost => {
        if (!prevPost) return null;
        return {
          ...prevPost,
          comments: [...prevPost.comments, comment],
        };
      });
      setNewComment('');
    } catch (error) {
      console.error('댓글 작성 실패:', error);
      Alert.alert('오류', '댓글 작성 중 오류가 발생했습니다.');
    }
  };

  const handleCommentEdit = async (commentId: number) => {
    if (!editCommentText.trim()) {
      Alert.alert('오류', '댓글 내용을 입력해주세요.');
      return;
    }

    try {
      const updatedComment = await updateComment(post!.id, commentId, editCommentText);
      setPost(prevPost => {
        if (!prevPost) return null;
        return {
          ...prevPost,
          comments: prevPost.comments.map(comment => 
            comment.id === commentId ? updatedComment : comment
          ),
        };
      });
      setEditingComment(null);
      setEditCommentText('');
    } catch (error) {
      console.error('댓글 수정 실패:', error);
      Alert.alert('오류', '댓글 수정 중 오류가 발생했습니다.');
    }
  };

  const handleCommentDelete = async (commentId: number) => {
    try {
      await deleteComment(post!.id, commentId);
      setPost(prevPost => ({
        ...prevPost!,
        comments: prevPost!.comments.filter(comment => comment.id !== commentId),
      }));
    } catch (error) {
      console.error('댓글 삭제 실패:', error);
      Alert.alert('오류', '댓글 삭제 중 오류가 발생했습니다.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>로딩 중...</Text>
      </View>
    );
  }

  if (error || !post) {
    return (
      <View style={styles.errorContainer}>
        <Text>{error || '게시물을 찾을 수 없습니다.'}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { paddingTop: inset.top }]}>
      <Stack.Screen
        options={{
          title: '',
          headerShown: true,
          headerLeft: () => (
            <View style={styles.headerContainer}>
              <TouchableOpacity 
                onPress={() => router.push('/(tabs)/community')}
                style={styles.backButton}
              >
                <Ionicons name="arrow-back" size={24} color="black" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>게시물</Text>
            </View>
          ),
        }}
      />
      
      <ScrollView>
        <View style={styles.postContainer}>
          <View style={styles.postHeader}>
            <View style={styles.userInfo}>
              <View style={styles.avatarPlaceholder} />
              <Text style={styles.postAuthor}>{post.author_email}</Text>
            </View>
            <TouchableOpacity>
              <Ionicons name="ellipsis-horizontal" size={20} color="black" />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.postTitle}>{post.title}</Text>
          <Text style={styles.postContent}>{post.content}</Text>
          <Text style={styles.postDate}>{post.created_at}</Text>
          
          <View style={styles.postActions}>
            <View style={styles.leftActions}>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="heart-outline" size={24} color="black" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="chatbubble-outline" size={24} color="black" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="paper-plane-outline" size={24} color="black" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="bookmark-outline" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.commentsSection}>
          <Text style={styles.commentsTitle}>댓글 {post.comments?.length}</Text>
          {post.comments?.map((comment) => (
            <View key={comment.id} style={styles.comment}>
              <View style={styles.commentHeader}>
                <View style={styles.userInfo}>
                  <View style={styles.avatarPlaceholder} />
                  <View>
                    <Text style={styles.commentAuthor}>{comment.author_email}</Text>
                    {editingComment === comment.id ? (
                      <View style={styles.editCommentContainer}>
                        <TextInput
                          style={styles.editCommentInput}
                          value={editCommentText}
                          onChangeText={setEditCommentText}
                          multiline
                        />
                        <View style={styles.editCommentButtons}>
                          <TouchableOpacity
                            style={[styles.editCommentButton, styles.saveButton]}
                            onPress={() => handleCommentEdit(comment.id)}
                          >
                            <Text style={styles.editCommentButtonText}>저장</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[styles.editCommentButton, styles.cancelButton]}
                            onPress={() => {
                              setEditingComment(null);
                              setEditCommentText('');
                            }}
                          >
                            <Text style={styles.editCommentButtonText}>취소</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ) : (
                      <Text style={styles.commentContent}>{comment.content}</Text>
                    )}
                  </View>
                </View>
                {user?.email === comment.author_email && !editingComment && (
                  <View style={styles.commentActions}>
                    <TouchableOpacity
                      onPress={() => {
                        setEditingComment(comment.id);
                        setEditCommentText(comment.content);
                      }}
                    >
                      <Text style={styles.commentAction}>수정</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleCommentDelete(comment.id)}>
                      <Text style={styles.commentAction}>삭제</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={[styles.commentInput, { paddingBottom: inset.bottom }]}>
        <View style={styles.avatarPlaceholder} />
        <TextInput
          style={styles.input}
          placeholder="댓글 달기..."
          value={newComment}
          onChangeText={setNewComment}
        />
        <TouchableOpacity 
          style={[styles.postButton, !newComment.trim() && styles.disabledButton]}
          onPress={handleCommentSubmit}
          disabled={!newComment.trim()}
        >
          <Text style={[styles.postButtonText, !newComment.trim() && styles.disabledButtonText]}>
            게시
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// 스타일 정의
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 8,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  postContainer: {
    backgroundColor: "#fff",
    padding: 12,
    marginBottom: 8,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#dbdbdb',
    marginRight: 12,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#262626",
    marginBottom: 8,
  },
  postAuthor: {
    fontSize: 14,
    fontWeight: "600",
    color: "#262626",
  },
  postDate: {
    fontSize: 12,
    color: "#8e8e8e",
    marginTop: 8,
  },
  postContent: {
    fontSize: 14,
    lineHeight: 20,
    color: "#262626",
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#dbdbdb',
  },
  leftActions: {
    flexDirection: 'row',
  },
  actionButton: {
    marginRight: 16,
  },
  commentsSection: {
    backgroundColor: "#fff",
    padding: 12,
  },
  commentsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#262626",
    marginBottom: 12,
  },
  comment: {
    marginBottom: 12,
  },
  commentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: 'flex-start',
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: "600",
    color: "#262626",
    marginBottom: 4,
  },
  commentDate: {
    fontSize: 12,
    color: "#8e8e8e",
  },
  commentContent: {
    fontSize: 14,
    lineHeight: 20,
    color: "#262626",
  },
  editCommentContainer: {
    marginTop: 8,
  },
  editCommentInput: {
    borderWidth: 1,
    borderColor: "#dbdbdb",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fafafa",
    minHeight: 80,
    marginBottom: 8,
  },
  editCommentButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  editCommentButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  saveButton: {
    backgroundColor: "#0095f6",
  },
  cancelButton: {
    backgroundColor: "#dbdbdb",
  },
  editCommentButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  commentActions: {
    flexDirection: "row",
    gap: 16,
  },
  commentAction: {
    fontSize: 12,
    color: "#0095f6",
    fontWeight: "600",
  },
  commentInput: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#dbdbdb",
  },
  input: {
    flex: 1,
    height: 36,
    paddingHorizontal: 12,
    backgroundColor: "#fafafa",
    borderRadius: 8,
    marginHorizontal: 12,
    fontSize: 14,
  },
  postButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  disabledButton: {
    opacity: 0.5,
  },
  postButtonText: {
    color: "#0095f6",
    fontWeight: "600",
    fontSize: 14,
  },
  disabledButtonText: {
    color: "#8e8e8e",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
}); 