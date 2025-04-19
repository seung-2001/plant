import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';
import { getPosts, createPost, getPost, updatePost, deletePost, getComments, createComment, updateComment, deleteComment, Post, Comment } from '../services/api';

export default function CommunityScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const data = await getPosts();
      setPosts(data);
    } catch (error) {
      console.error('게시글 로드 실패:', error);
    }
  };

  const handleCreatePost = async () => {
    if (!newPostTitle || !newPostContent) {
      Alert.alert('오류', '제목과 내용을 모두 입력해주세요.');
      return;
    }

    try {
      await createPost({
        user_name: newPostTitle,
        content: newPostContent,
        images: [],
        like_count: 0,
        comment_count: 0
      });
      setNewPostTitle('');
      setNewPostContent('');
      loadPosts();
    } catch (error) {
      console.error('게시글 작성 실패:', error);
    }
  };

  const handlePostPress = async (post: Post) => {
    setSelectedPost(post);
    try {
      const postData = await getPost(Number(post.id));
      const commentsData = await getComments(Number(post.id));
      setComments(commentsData);
    } catch (error) {
      console.error('게시글 상세 로드 실패:', error);
    }
  };

  const handleCreateComment = async () => {
    if (!selectedPost || !newComment) return;

    try {
      await createComment(Number(selectedPost.id), newComment);
      setNewComment('');
      const commentsData = await getComments(Number(selectedPost.id));
      setComments(commentsData);
    } catch (error) {
      console.error('댓글 작성 실패:', error);
    }
  };

  const renderPost = ({ item }: { item: Post }) => (
    <TouchableOpacity style={styles.postItem} onPress={() => handlePostPress(item)}>
      <Text style={styles.postTitle}>{item.user_name}</Text>
      <Text style={styles.postContent}>{item.content}</Text>
      <Text style={styles.postDate}>{item.created_at}</Text>
    </TouchableOpacity>
  );

  const renderComment = ({ item }: { item: Comment }) => (
    <View style={styles.commentItem}>
      <Text style={styles.commentContent}>{item.content}</Text>
      <Text style={styles.commentAuthor}>{item.user_name}</Text>
      <Text style={styles.commentDate}>{item.created_at}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.postForm}>
        <TextInput
          style={styles.input}
          placeholder="제목"
          value={newPostTitle}
          onChangeText={setNewPostTitle}
        />
        <TextInput
          style={[styles.input, styles.contentInput]}
          placeholder="내용"
          value={newPostContent}
          onChangeText={setNewPostContent}
          multiline
        />
        <TouchableOpacity style={styles.button} onPress={handleCreatePost}>
          <Text style={styles.buttonText}>게시글 작성</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        style={styles.postList}
      />

      {selectedPost && (
        <View style={styles.commentSection}>
          <Text style={styles.commentTitle}>댓글</Text>
          <FlatList
            data={comments}
            renderItem={renderComment}
            keyExtractor={(item) => item.id.toString()}
          />
          <View style={styles.commentForm}>
            <TextInput
              style={styles.input}
              placeholder="댓글 작성"
              value={newComment}
              onChangeText={setNewComment}
            />
            <TouchableOpacity style={styles.button} onPress={handleCreateComment}>
              <Text style={styles.buttonText}>댓글 작성</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  postForm: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 8,
    marginBottom: 8,
    borderRadius: 4,
  },
  contentInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  postList: {
    flex: 1,
  },
  postItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  postContent: {
    fontSize: 16,
    marginBottom: 8,
  },
  postAuthor: {
    fontSize: 14,
    color: '#666',
  },
  postDate: {
    fontSize: 12,
    color: '#999',
  },
  commentSection: {
    marginTop: 16,
  },
  commentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  commentItem: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  commentContent: {
    fontSize: 16,
    marginBottom: 4,
  },
  commentAuthor: {
    fontSize: 14,
    color: '#666',
  },
  commentDate: {
    fontSize: 12,
    color: '#999',
  },
  commentForm: {
    marginTop: 16,
  },
}); 
