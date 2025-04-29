// 앱의 전체 레이아웃을 관리하는 파일
// - 로그인/회원가입 화면과 메인 탭 네비게이션을 구분하여 관리
// - 인증 상태에 따라 적절한 화면을 보여줌

import { Slot } from "expo-router";
import { AuthProvider } from "../context/auth";
import { UserProvider } from './contexts/UserContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <UserProvider>
        <Slot />
      </UserProvider>
    </AuthProvider>
  );
} 