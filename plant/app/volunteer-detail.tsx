import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { fetchVolunteerDetail } from '../services/volunteerService';

export default function VolunteerDetailScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const inset = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [volunteerData, setVolunteerData] = useState<any>(null);

  useEffect(() => {
    const id = params.id as string;
    if (id) {
      loadVolunteerDetail(id);
    } else {
      setError('봉사 활동 ID가 유효하지 않습니다.');
      setLoading(false);
    }
  }, [params.id]);

  const loadVolunteerDetail = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      console.log('봉사 활동 상세 정보 요청:', id);
      const data = await fetchVolunteerDetail(id);
      console.log('봉사 활동 상세 정보 응답:', data);
      setVolunteerData(data);
    } catch (err: any) {
      console.error('봉사 활동 상세 정보 불러오기 실패:', err);
      setError('봉사 활동 정보를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { paddingTop: inset.top }]}>
        <ActivityIndicator size="large" color="#FF6B00" />
        <Text style={styles.loadingText}>봉사 활동 정보를 불러오는 중...</Text>
      </View>
    );
  }

  if (error || !volunteerData) {
    return (
      <View style={[styles.errorContainer, { paddingTop: inset.top }]}>
        <Ionicons name="alert-circle-outline" size={48} color="#f44336" />
        <Text style={styles.errorText}>{error || '봉사 활동 정보를 찾을 수 없습니다.'}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => loadVolunteerDetail(params.id as string)}
        >
          <Text style={styles.retryButtonText}>다시 시도</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 기간 표시 포맷
  const formatDate = (beginDate: string, endDate: string) => {
    if (!beginDate || !endDate) return '기간 정보 없음';
    
    // YYYYMMDD 형식을 YYYY-MM-DD 형식으로 변환
    const formatYMD = (dateStr: string) => {
      if (dateStr.length !== 8) return dateStr;
      return `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`;
    };
    
    return `${formatYMD(beginDate)} ~ ${formatYMD(endDate)}`;
  };

  return (
    <View style={[styles.container, { paddingTop: inset.top }]}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.headerTabs}>
          <Text style={styles.activeTab}>봉사정보</Text>
          <Text style={styles.tab}>후기</Text>
          <Text style={styles.tab}>문의</Text>
        </View>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        {/* 제목 섹션 */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>{volunteerData.prgramSj || '제목 없음'}</Text>
          <View style={styles.statusContainer}>
            <Text style={styles.status}>{volunteerData.progrmSttusSe || '상태 정보 없음'}</Text>
          </View>
        </View>

        {/* 지도 섹션 */}
        <View style={styles.mapContainer}>
          <Text style={styles.mapPlaceholder}>지도 영역</Text>
          <Text style={styles.addressText}>{volunteerData.actPlace || '주소 정보 없음'}</Text>
        </View>

        {/* 기본 정보 */}
        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={20} color="#666" />
            <Text style={styles.infoLabel}>봉사기간</Text>
            <Text style={styles.infoValue}>
              {formatDate(volunteerData.actBeginDe, volunteerData.actEndDe)}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={20} color="#666" />
            <Text style={styles.infoLabel}>봉사시간</Text>
            <Text style={styles.infoValue}>{volunteerData.actTime || '시간 정보 없음'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={20} color="#666" />
            <Text style={styles.infoLabel}>봉사장소</Text>
            <Text style={styles.infoValue}>{volunteerData.actPlace || '장소 정보 없음'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="people-outline" size={20} color="#666" />
            <Text style={styles.infoLabel}>모집인원</Text>
            <Text style={styles.infoValue}>
              {volunteerData.rcritNmpr || '인원 정보 없음'}
            </Text>
          </View>
        </View>

        {/* 상세 설명 */}
        <View style={styles.descriptionSection}>
          <Text style={styles.sectionTitle}>상세내용</Text>
          <Text style={styles.description}>{volunteerData.progrmCn || '상세 내용 정보 없음'}</Text>
        </View>

        {/* 기관 정보 */}
        <View style={styles.organizationSection}>
          <Text style={styles.sectionTitle}>기관정보</Text>
          <View style={styles.organizationInfo}>
            <Text style={styles.organizationName}>{volunteerData.nanmmbyNm || '기관명 정보 없음'}</Text>
            <Text style={styles.organizationContact}>
              담당자: {volunteerData.nanmmbyNmAdmn || '담당자 정보 없음'} 
            </Text>
            <Text style={styles.organizationContact}>
              문의: {volunteerData.nanmmbyNmAdmnTelno || volunteerData.telno || '문의처 정보 없음'}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* 하단 신청 버튼 */}
      <View style={[styles.bottomButton, { paddingBottom: inset.bottom + 10 }]}>
        <TouchableOpacity 
          style={styles.applyButton}
          onPress={() => {
            // 신청 처리
            Alert.alert('신청 알림', '봉사활동 신청이 완료되었습니다.');
          }}
        >
          <Text style={styles.applyButtonText}>신청하기</Text>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTabs: {
    flexDirection: 'row',
    gap: 20,
  },
  tab: {
    fontSize: 16,
    color: '#666',
  },
  activeTab: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  titleSection: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  statusContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  status: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: 'bold',
  },
  mapContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPlaceholder: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  addressText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  infoSection: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    gap: 10,
  },
  infoLabel: {
    width: 80,
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  descriptionSection: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
  },
  organizationSection: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 80,
  },
  organizationInfo: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
  },
  organizationName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  organizationContact: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  bottomButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  applyButton: {
    backgroundColor: '#FF6B00',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  errorText: {
    marginTop: 10,
    marginBottom: 20,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#FF6B00',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
}); 