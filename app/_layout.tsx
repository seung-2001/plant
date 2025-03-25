// 앱의 전체 레이아웃을 관리하는 파일
// - 로그인/회원가입 화면과 메인 탭 네비게이션을 구분하여 관리
// - 인증 상태에 따라 적절한 화면을 보여줌

import { Stack } from "expo-router";
import { useEffect } from "react";
import { useRouter, useSegments } from "expo-router";
import { useAuth } from "../context/auth";

// 인증 상태에 따른 라우팅을 처리하는 컴포넌트
function useProtectedRoute(isAuthenticated: boolean) {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inAuthGroup = segments[0] === "(auth)";

    if (!isAuthenticated && !inAuthGroup) {
      // 인증되지 않은 사용자는 로그인 화면으로 리다이렉트
      router.replace("/login");
    } else if (isAuthenticated && inAuthGroup) {
      // 인증된 사용자가 로그인/회원가입 화면에 접근하면 메인 화면으로 리다이렉트
      router.replace("/tabs/map");
    }
  }, [isAuthenticated, segments]);
}

// 앱의 루트 레이아웃 컴포넌트
export default function RootLayout() {
  const { isAuthenticated } = useAuth();
  useProtectedRoute(isAuthenticated);

  return (
    <Stack>
      {/* 인증 관련 화면 그룹 */}
      <Stack.Screen
        name="(auth)"
        options={{
          headerShown: false,
        }}
      />
      {/* 메인 탭 네비게이션 그룹 */}
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
} 