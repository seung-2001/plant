// 로그인 화면 컴포넌트
// - 사용자 인증을 처리하는 메인 화면
// - 이메일과 비밀번호 입력을 받아 로그인 처리
// - 회원가입 화면으로의 네비게이션 제공

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { useAuth } from '../../context/auth';

// 로그인 화면 컴포넌트
export default function LoginScreen() {
  // 이메일과 비밀번호 상태 관리
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn } = useAuth();

  // 로그인 처리 함수
  const handleLogin = async () => {
    try {
      console.log('로그인 시도:', { email });
      await signIn(email, password);
      console.log('로그인 성공');
    } catch (error: any) {
      console.error('로그인 에러:', error);
      const errorMessage = error.response?.data?.error || error.message || '이메일과 비밀번호를 확인해주세요.';
      Alert.alert('로그인 실패', errorMessage);
    }
  };

  // 회원가입 화면으로 이동하는 함수
  const handleSignUp = () => {
    router.push("/(auth)/signup");
  };

  return (
    <View style={styles.container}>
      {/* 앱 로고 */}
      <Text style={styles.logo}>Plant</Text>

      {/* 로그인 폼 */}
      <View style={styles.form}>
        {/* 이메일 입력 필드 */}
        <TextInput
          style={styles.input}
          placeholder="이메일"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        {/* 비밀번호 입력 필드 */}
        <TextInput
          style={styles.input}
          placeholder="비밀번호"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {/* 로그인 버튼 */}
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>로그인</Text>
        </TouchableOpacity>

        {/* 회원가입 링크 */}
        <TouchableOpacity onPress={handleSignUp}>
          <Text style={styles.linkText}>회원가입</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// 스타일 정의
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  logo: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#FF9500",
    textAlign: "center",
    marginBottom: 40,
  },
  form: {
    width: "100%",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#FF9500",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  linkText: {
    color: "#FF9500",
    textAlign: "center",
    fontSize: 16,
  },
}); 