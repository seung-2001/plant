import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { fetchVolunteerMeals, VolunteerMeal } from '../../services/volunteerService';
import { Ionicons } from '@expo/vector-icons';

export default function VolunteerScreen() {
  const router = useRouter();
  const inset = useSafeAreaInsets();
  const [meals, setMeals] = useState<VolunteerMeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadVolunteers();
  }, []);

  const loadVolunteers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 오늘 날짜
      const today = new Date();
      const startDate = today.toISOString().split('T')[0]; // YYYY-MM-DD 형식
      
      // 1년 후 날짜
      const endDate = new Date(today);
      endDate.setFullYear(today.getFullYear() + 1);
      const endDateStr = endDate.toISOString().split('T')[0]; // YYYY-MM-DD 형식
      
      console.log(`날짜 범위: ${startDate} ~ ${endDateStr}`);
      
      const response = await fetchVolunteerMeals({
        start_date: startDate,
        end_date: endDateStr
      });
      
      console.log('응답 처리:', response);
      
      if (response && response.items && response.items.length > 0) {
        setMeals(response.items);
        console.log(`${response.items.length}개의 봉사 정보를 불러왔습니다.`);
      } else {
        console.warn('봉사 정보가 없습니다:', response);
        setError('봉사 정보를 불러올 수 없습니다.');
        Alert.alert('알림', '현재 등록된 봉사 정보가 없습니다.');
      }
    } catch (error: any) {
      console.error('봉사자 목록 로드 실패:', error);
      setError(error.message || '봉사 정보를 불러오는 중 오류가 발생했습니다.');
      Alert.alert('에러', '봉사 정보를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 빈 데이터일 경우 대체 UI를 보여줍니다
  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="alert-circle-outline" size={48} color="#9E9E9E" />
      <Text style={styles.emptyText}>봉사 정보가 없습니다.</Text>
      <TouchableOpacity 
        style={styles.retryButton}
        onPress={loadVolunteers}
      >
        <Text style={styles.retryButtonText}>다시 시도</Text>
      </TouchableOpacity>
    </View>
  );

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return '';
    // 이미 포맷이 YYYY-MM-DD 인 경우 그대로 반환
    if (dateStr.includes('-')) return dateStr;
    try {
      // YYYYMMDD 형식을 YYYY-MM-DD로 변환
      return `${dateStr.substring(0, 4)}-${dateStr.substring(4, 6)}-${dateStr.substring(6, 8)}`;
    } catch (error) {
      console.error('날짜 형식 변환 실패:', dateStr, error);
      return dateStr || ''; // 변환 실패 시 원본 반환 또는 빈 문자열
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case '모집중':
        return '#4CAF50';
      case '모집완료':
      case '접수마감':
        return '#FF6B00';
      case '모집마감':
      case '완료':
        return '#9E9E9E';
      case '자원봉사자 모집중':
        return '#4CAF50';
      default:
        return '#666666';
    }
  };

  // 봉사 상태 표시 변환 함수
  const formatStatus = (status: string) => {
    switch (status) {
      case '자원봉사자 모집중':
        return '모집중';
      case '접수마감':
        return '모집완료';
      default:
        return status || '상태 미정';
    }
  };

  const renderItem = ({ item }: { item: VolunteerMeal }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => {
        // 상세 페이지로 이동
        router.push({
          pathname: '/volunteer/[id]',
          params: { id: item.progrmRegistNo }
        });
      }}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.placeName}>{item.prgramSj || '제목 없음'}</Text>
        <Text style={[styles.status, { color: getStatusColor(item.progrmSttusSe) }]}>
          {formatStatus(item.progrmSttusSe)}
        </Text>
      </View>
      
      <View style={styles.infoRow}>
        <Ionicons name="calendar-outline" size={16} color="#666" />
        <Text style={styles.date}>
          {formatDate(item.actBeginDe)} ~ {formatDate(item.actEndDe)}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <Ionicons name="time-outline" size={16} color="#666" />
        <Text style={styles.infoText}>
          {item.actWkdy ? `${item.actWkdy}, ` : ''}{item.actTime || '시간 정보 없음'}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <Ionicons name="location-outline" size={16} color="#666" />
        <Text style={styles.infoText}>{item.actPlace || '장소 정보 없음'}</Text>
      </View>

      <View style={styles.infoRow}>
        <Ionicons name="people-outline" size={16} color="#666" />
        <Text style={styles.infoText}>모집인원: {item.rcritNmpr || '미정'}명</Text>
      </View>

      <View style={styles.infoRow}>
        <Ionicons name="business-outline" size={16} color="#666" />
        <Text style={styles.infoText}>{item.nanmmbyNm || '주최기관 정보 없음'}</Text>
      </View>

      <View style={styles.infoRow}>
        <Ionicons name="call-outline" size={16} color="#666" />
        <Text style={styles.infoText}>{item.telno || '연락처 정보 없음'}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: inset.top }]}> 
      <View style={styles.header}>
        <Text style={styles.title}>봉사 활동</Text>
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>봉사 정보를 불러오는 중...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#FF6B6B" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={loadVolunteers}
          >
            <Text style={styles.retryButtonText}>다시 시도</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={meals}
          renderItem={renderItem}
          keyExtractor={(item) => item.progrmRegistNo}
          contentContainerStyle={styles.listContainer}
          refreshing={loading}
          onRefresh={loadVolunteers}
          ListEmptyComponent={renderEmptyComponent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  listContainer: {
    padding: 16,
    flexGrow: 1,
  },
  card: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  placeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  status: {
    fontSize: 14,
    fontWeight: '500',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    padding: 20,
  },
  errorText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: 300,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
}); 