import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../context/auth';

export default function WriteScreen() {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    // TODO: API 연동
    console.log('게시물 작성:', { content, image });
    router.back();
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.cancelButton}>취소</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>새 게시물</Text>
        <TouchableOpacity 
          onPress={handleSubmit}
          disabled={!content.trim()}
          style={[styles.submitButton, !content.trim() && styles.submitButtonDisabled]}
        >
          <Text style={[styles.submitButtonText, !content.trim() && styles.submitButtonTextDisabled]}>
            게시
          </Text>
        </TouchableOpacity>
      </View>

      {/* 작성 영역 */}
      <View style={styles.content}>
        <View style={styles.userInfo}>
          <Image 
            source={{ uri: 'https://via.placeholder.com/50' }} 
            style={styles.avatar} 
          />
          <Text style={styles.userName}>{user?.email || '사용자'}</Text>
        </View>

        <TextInput
          style={styles.input}
          placeholder="무슨 생각을 하고 계신가요?"
          multiline
          value={content}
          onChangeText={setContent}
        />

        {image && (
          <View style={styles.imagePreview}>
            <Image source={{ uri: image }} style={styles.previewImage} />
            <TouchableOpacity 
              style={styles.removeImageButton}
              onPress={() => setImage(null)}
            >
              <Text style={styles.removeImageButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* 하단 도구 모음 */}
      <View style={styles.toolbar}>
        <TouchableOpacity onPress={pickImage} style={styles.toolbarButton}>
          <Text style={styles.toolbarButtonText}>🖼️ 사진 추가</Text>
        </TouchableOpacity>
      </View>
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
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelButton: {
    fontSize: 16,
    color: '#666',
  },
  submitButton: {
    backgroundColor: '#FF9500',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  submitButtonDisabled: {
    backgroundColor: '#FFE5CC',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  submitButtonTextDisabled: {
    color: '#FFC580',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
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
  input: {
    fontSize: 16,
    lineHeight: 24,
    minHeight: 100,
  },
  imagePreview: {
    marginTop: 15,
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: 300,
    borderRadius: 10,
  },
  removeImageButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeImageButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  toolbar: {
    flexDirection: 'row',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  toolbarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  toolbarButtonText: {
    fontSize: 16,
    color: '#666',
  },
}); 