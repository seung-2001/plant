import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { updatePassword } from '../services/api';
import { useAuth, AuthContextType } from '../../context/auth';

export default function ChangePasswordScreen() {
  const { refreshToken } = useAuth() as AuthContextType;
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('오류', '새 비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      // 토큰 갱신 시도
      await refreshToken();
      
      // 비밀번호 변경 시도
      const response = await updatePassword(currentPassword, newPassword);
      if (response.message) {
        Alert.alert('성공', response.message);
        router.back();
      } else {
        Alert.alert('오류', '비밀번호 변경에 실패했습니다.');
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        Alert.alert('오류', '세션이 만료되었습니다. 다시 로그인해주세요.');
        router.replace('/login');
      } else {
        Alert.alert('오류', error.response?.data?.error || '비밀번호 변경에 실패했습니다.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>비밀번호 변경</Text>
        <TouchableOpacity onPress={handleUpdatePassword} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>저장</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.form}>
          <Text style={styles.label}>현재 비밀번호</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            value={currentPassword}
            onChangeText={setCurrentPassword}
            placeholder="현재 비밀번호를 입력하세요"
          />

          <Text style={styles.label}>새 비밀번호</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="새 비밀번호를 입력하세요"
          />

          <Text style={styles.label}>새 비밀번호 확인</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="새 비밀번호를 다시 입력하세요"
          />
        </View>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 24,
    color: '#333',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  saveButton: {
    padding: 8,
  },
  saveButtonText: {
    fontSize: 16,
    color: '#FF9500',
    fontWeight: '600',
  },
  content: {
    padding: 20,
  },
  form: {
    gap: 15,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  input: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    fontSize: 16,
  },
}); 