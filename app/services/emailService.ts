// 테스트용 인증 코드 저장소
const verificationCodes: { [key: string]: string } = {};

export const emailService = {
  sendVerificationCode: async (email: string): Promise<boolean> => {
    try {
      // 테스트용 6자리 랜덤 코드 생성
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      verificationCodes[email] = code;
      
      // 콘솔에 코드 출력 (실제 환경에서는 이메일로 전송)
      console.log(`[테스트] ${email}로 전송된 인증 코드: ${code}`);
      
      return true;
    } catch (error) {
      console.error('이메일 전송 실패:', error);
      return false;
    }
  },

  verifyCode: async (email: string, code: string): Promise<boolean> => {
    try {
      // 저장된 코드와 입력된 코드 비교
      const savedCode = verificationCodes[email];
      const isValid = savedCode === code;
      
      if (isValid) {
        // 인증 성공 시 코드 삭제
        delete verificationCodes[email];
      }
      
      return isValid;
    } catch (error) {
      console.error('코드 검증 실패:', error);
      return false;
    }
  },
};

// 이메일 유효성 검사
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Expo Router를 위한 빈 컴포넌트 export
export default function EmailService() {
  return null;
} 