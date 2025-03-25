import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { emailService } from '../services/emailService';

interface EmailVerificationProps {
  email: string;
  onVerificationComplete: () => void;
}

export default function EmailVerification({ email, onVerificationComplete }: EmailVerificationProps) {
  const [verificationCode, setVerificationCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(180); // 3분
  const [isLoading, setIsLoading] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);

  useEffect(() => {
    sendVerificationCode();
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && isCodeSent) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, isCodeSent]);

  const sendVerificationCode = async () => {
    setIsLoading(true);
    try {
      const success = await emailService.sendVerificationCode(email);
      if (success) {
        setIsCodeSent(true);
        Alert.alert('알림', '인증 코드가 이메일로 전송되었습니다.');
      } else {
        Alert.alert('오류', '인증 코드 전송에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      Alert.alert('오류', '인증 코드 전송 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (timeLeft > 0) {
      Alert.alert('알림', `${timeLeft}초 후에 다시 시도해주세요.`);
      return;
    }
    setTimeLeft(180);
    await sendVerificationCode();
  };

  const handleVerify = async () => {
    if (!verificationCode) {
      Alert.alert('오류', '인증 코드를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      const success = await emailService.verifyCode(email, verificationCode);
      if (success) {
        onVerificationComplete();
      } else {
        Alert.alert('오류', '잘못된 인증 코드입니다.');
      }
    } catch (error) {
      Alert.alert('오류', '인증 코드 확인 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>이메일 인증</Text>
      <Text style={styles.subtitle}>
        {email}로 전송된 인증 코드를 입력해주세요.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="인증 코드 6자리"
        value={verificationCode}
        onChangeText={setVerificationCode}
        keyboardType="number-pad"
        maxLength={6}
        editable={!isLoading}
      />

      <View style={styles.timerContainer}>
        <Text style={styles.timer}>
          남은 시간: {formatTime(timeLeft)}
        </Text>
        {timeLeft === 0 && (
          <TouchableOpacity onPress={handleResendCode}>
            <Text style={styles.resendText}>코드 재전송</Text>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity 
        style={[styles.button, (!verificationCode || isLoading) && styles.buttonDisabled]} 
        onPress={handleVerify}
        disabled={!verificationCode || isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>인증하기</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    textAlign: 'center',
    letterSpacing: 8,
  },
  timerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  timer: {
    fontSize: 16,
    color: '#666',
  },
  resendText: {
    fontSize: 16,
    color: '#007AFF',
    marginLeft: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 