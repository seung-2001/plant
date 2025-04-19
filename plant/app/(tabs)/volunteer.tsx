import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface VolunteerPlace {
  id: string;
  name: string;
  address: string;
  type: 'nursing_home' | 'child_care' | 'disabled_facility' | 'environment';
  date: string;
  participants: number;
  maxParticipants: number;
}

export default function VolunteerScreen() {
  const router = useRouter();
  const inset = useSafeAreaInsets();
  const [selectedType, setSelectedType] = useState<'all' | VolunteerPlace['type']>('all');

  // TODO: API에서 봉사활동 데이터 가져오기
  const mockPlaces: VolunteerPlace[] = [
    {
      id: '1',
      name: '행복요양원',
      address: '서울시 중구 세종대로 110',
      type: 'nursing_home',
      date: '2024-03-15',
      participants: 5,
      maxParticipants: 10,
    },
    {
      id: '2',
      name: '사랑어린이집',
      address: '서울시 중구 세종대로 111',
      type: 'child_care',
      date: '2024-03-16',
      participants: 3,
      maxParticipants: 8,
    },
    {
      id: '3',
      name: '희망복지관',
      address: '서울시 중구 세종대로 112',
      type: 'disabled_facility',
      date: '2024-03-17',
      participants: 7,
      maxParticipants: 12,
    },
    {
      id: '4',
      name: '청계천 환경정화',
      address: '서울시 중구 청계천로',
      type: 'environment',
      date: '2024-03-18',
      participants: 15,
      maxParticipants: 20,
    },
  ];

  const getTypeName = (type: VolunteerPlace['type']) => {
    switch (type) {
      case 'nursing_home':
        return '요양원';
      case 'child_care':
        return '어린이집';
      case 'disabled_facility':
        return '장애인시설';
      case 'environment':
        return '환경정화';
      default:
        return '';
    }
  };

  const getTypeIcon = (type: VolunteerPlace['type']) => {
    switch (type) {
      case 'nursing_home':
        return 'people';
      case 'child_care':
        return 'happy';
      case 'disabled_facility':
        return 'accessibility';
      case 'environment':
        return 'leaf';
      default:
        return 'help';
    }
  };

  const filteredPlaces = selectedType === 'all' 
    ? mockPlaces 
    : mockPlaces.filter(place => place.type === selectedType);

  const renderItem = ({ item }: { item: VolunteerPlace }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push({
        pathname: '/volunteer-detail',
        params: {
          id: item.id,
          name: item.name,
          address: item.address,
          date: item.date,
          participants: item.participants.toString(),
          maxParticipants: item.maxParticipants.toString(),
        },
      })}
    >
      <View style={styles.cardHeader}>
        <View style={styles.typeContainer}>
          <Ionicons name={getTypeIcon(item.type)} size={20} color="#4CAF50" />
          <Text style={styles.typeText}>{getTypeName(item.type)}</Text>
        </View>
        <Text style={styles.date}>{item.date}</Text>
      </View>
      
      <Text style={styles.placeName}>{item.name}</Text>
      <Text style={styles.address}>{item.address}</Text>
      
      <View style={styles.participantsInfo}>
        <Text style={styles.participantsText}>
          참가자: {item.participants} / {item.maxParticipants}명
        </Text>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${(item.participants / item.maxParticipants) * 100}%` 
              }
            ]} 
          />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: inset.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>봉사 활동</Text>
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity 
          style={[styles.filterButton, selectedType === 'all' && styles.selectedFilter]}
          onPress={() => setSelectedType('all')}
        >
          <Text style={[styles.filterText, selectedType === 'all' && styles.selectedFilterText]}>
            전체
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterButton, selectedType === 'nursing_home' && styles.selectedFilter]}
          onPress={() => setSelectedType('nursing_home')}
        >
          <Text style={[styles.filterText, selectedType === 'nursing_home' && styles.selectedFilterText]}>
            요양원
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterButton, selectedType === 'child_care' && styles.selectedFilter]}
          onPress={() => setSelectedType('child_care')}
        >
          <Text style={[styles.filterText, selectedType === 'child_care' && styles.selectedFilterText]}>
            어린이집
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterButton, selectedType === 'disabled_facility' && styles.selectedFilter]}
          onPress={() => setSelectedType('disabled_facility')}
        >
          <Text style={[styles.filterText, selectedType === 'disabled_facility' && styles.selectedFilterText]}>
            장애인시설
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterButton, selectedType === 'environment' && styles.selectedFilter]}
          onPress={() => setSelectedType('environment')}
        >
          <Text style={[styles.filterText, selectedType === 'environment' && styles.selectedFilterText]}>
            환경정화
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredPlaces}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />

      <View style={[styles.navigationBar, { paddingBottom: inset.bottom }]}>
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => router.push('/map')}
        >
          <Ionicons name="map" size={24} color="#666" />
          <Text style={styles.navText}>지도</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => router.push('/volunteer')}
        >
          <Ionicons name="heart" size={24} color="#4CAF50" />
          <Text style={[styles.navText, { color: '#4CAF50' }]}>봉사</Text>
        </TouchableOpacity>
      </View>
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
  filterContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: '#f5f5f5',
  },
  selectedFilter: {
    backgroundColor: '#4CAF50',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
  },
  selectedFilterText: {
    color: 'white',
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
    marginBottom: 8,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#4CAF50',
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
  placeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  address: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  participantsInfo: {
    marginTop: 12,
  },
  participantsText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#eee',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  navigationBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 80,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  navButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  navText: {
    marginTop: 4,
    fontSize: 12,
    color: '#666',
  },
}); 