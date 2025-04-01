// 앱의 전체 레이아웃을 관리하는 파일
// - 로그인/회원가입 화면과 메인 탭 네비게이션을 구분하여 관리
// - 인증 상태에 따라 적절한 화면을 보여줌

import { Stack, Slot } from "expo-router";
import { useEffect, useState } from "react";
import { useRouter, useSegments } from "expo-router";
import { useAuth, AuthProvider } from "@context/auth";
import { View } from "react-native";

// 인증 상태에 따른 라우팅을 처리하는 컴포넌트
function useProtectedRoute(isAuthenticated: boolean) {
  const segments = useSegments();
  const router = useRouter();
  const [isInitialMount, setIsInitialMount] = useState(true);

  useEffect(() => {
    if (isInitialMount) {
      setIsInitialMount(false);
      return;
    }

    const inAuthGroup = segments[0] === "(auth)";

    if (!isAuthenticated && !inAuthGroup) {
      // 인증되지 않은 사용자는 로그인 화면으로 리다이렉트
      router.replace("/(auth)/login");
    } else if (isAuthenticated && inAuthGroup) {
      // 인증된 사용자가 로그인/회원가입 화면에 접근하면 메인 화면으로 리다이렉트
      router.replace("/(tabs)/map");
    }
  }, [isAuthenticated, segments, isInitialMount]);
}

// 앱의 루트 레이아웃 컴포넌트
function RootLayoutNav() {
  const { user, isLoading } = useAuth();
  useProtectedRoute(!!user);

  if (isLoading) {
    return <View style={{ flex: 1, backgroundColor: '#fff' }} />;
  }

  return <Slot />;
}

// AuthProvider로 감싸진 루트 레이아웃
export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
} 