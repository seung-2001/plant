// 회원가입 화면 컴포넌트
// - 새로운 사용자 등록을 처리하는 화면
// - 이메일, 비밀번호, 이름 입력을 받아 회원가입 처리
// - 로그인 화면으로의 네비게이션 제공

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

// 회원가입 화면 컴포넌트
export default function SignUpScreen() {
  // 입력 필드 상태 관리
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  // 회원가입 처리 함수
  const handleSignUp = () => {
    // 입력값 검증
    if (!email || !password || !name) {
      Alert.alert("회원가입 실패", "모든 필드를 입력해주세요.");
      return;
    }

    // 회원가입 성공 시 로그인 화면으로 이동
    Alert.alert("회원가입 성공", "로그인 화면으로 이동합니다.", [
      {
        text: "확인",
        onPress: () => router.replace("/login"),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* 앱 로고 */}
      <Text style={styles.logo}>Plant</Text>

      {/* 회원가입 폼 */}
      <View style={styles.form}>
        {/* 이름 입력 필드 */}
        <TextInput
          style={styles.input}
          placeholder="이름"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />

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

        {/* 회원가입 버튼 */}
        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>회원가입</Text>
        </TouchableOpacity>

        {/* 로그인 화면으로 돌아가는 링크 */}
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.linkText}>이미 계정이 있으신가요? 로그인</Text>
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