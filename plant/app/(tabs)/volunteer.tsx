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
      const response = await fetchVolunteerMeals({
        start_date: '2024-03-01',
        end_date: '2024-12-31'
      });
      
      if (response.items) {
        setMeals(response.items);
      } else {
        setError('봉사 정보를 불러올 수 없습니다.');
        Alert.alert('에러', '봉사 정보를 불러올 수 없습니다.');
      }
    } catch (error) {
      console.error('봉사자 목록 로드 실패:', error);
      setError('봉사 정보를 불러오는 중 오류가 발생했습니다.');
      Alert.alert('에러', '봉사 정보를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    return `${dateStr.substring(0, 4)}-${dateStr.substring(4, 6)}-${dateStr.substring(6, 8)}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case '모집중':
        return '#4CAF50';
      case '모집완료':
        return '#FF6B00';
      case '모집마감':
        return '#9E9E9E';
      default:
        return '#666666';
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
        <Text style={styles.placeName}>{item.prgramSj}</Text>
        <Text style={[styles.status, { color: getStatusColor(item.progrmSttusSe) }]}>
          {item.progrmSttusSe}
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
        <Text style={styles.infoText}>{item.actTime}</Text>
      </View>

      <View style={styles.infoRow}>
        <Ionicons name="location-outline" size={16} color="#666" />
        <Text style={styles.infoText}>{item.actPlace}</Text>
      </View>

      <View style={styles.infoRow}>
        <Ionicons name="people-outline" size={16} color="#666" />
        <Text style={styles.infoText}>모집인원: {item.rcritNmpr}명</Text>
      </View>

      <View style={styles.infoRow}>
        <Ionicons name="call-outline" size={16} color="#666" />
        <Text style={styles.infoText}>{item.telno || '연락처 정보 없음'}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} />;
  if (error) return <Text style={{ color: 'red', margin: 20 }}>{error}</Text>;

  return (
    <View style={[styles.container, { paddingTop: inset.top }]}> 
      <View style={styles.header}>
        <Text style={styles.title}>봉사 활동</Text>
      </View>
      <FlatList
        data={meals}
        renderItem={renderItem}
        keyExtractor={(item) => item.progrmRegistNo}
        contentContainerStyle={styles.listContainer}
        refreshing={loading}
        onRefresh={loadVolunteers}
      />
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
}); 