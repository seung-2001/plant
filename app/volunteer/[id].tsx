import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function VolunteerDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const volunteerData = {
    id: 1,
    title: '우리동네 보육원',
    description: '보육원 아이들과 함께 미술 활동을 진행합니다. 아이들의 창의성을 키우고 즐거운 시간을 보내보세요.',
    date: '2024-03-25',
    time: '10:00 - 12:00',
    location: {
      latitude: 37.5665,
      longitude: 126.9780,
      address: '서울특별시 중구 세종대로 110',
    },
    requirements: [
      '미술 활동 경험자 우대',
      '아이들과 함께할 수 있는 따뜻한 마음',
      '기본적인 미술 도구 사용 가능',
    ],
    contact: {
      name: '김원장',
      phone: '02-1234-5678',
      email: 'kim@example.com',
    },
    status: '모집중',
    currentVolunteers: 5,
    maxVolunteers: 10,
  };

  const renderMap = () => {
    if (Platform.OS === 'web') {
      return (
        <View style={styles.mapPlaceholder}>
          <Text>지도는 모바일에서만 사용 가능합니다.</Text>
        </View>
      );
    }

    return (
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: volunteerData.location.latitude,
          longitude: volunteerData.location.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker
          coordinate={{
            latitude: volunteerData.location.latitude,
            longitude: volunteerData.location.longitude,
          }}
          title={volunteerData.title}
          description={volunteerData.location.address}
        />
      </MapView>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* 헤더 이미지 */}
      <Image
        source={{ uri: 'https://via.placeholder.com/400x200' }}
        style={styles.headerImage}
      />

      {/* 기본 정보 */}
      <View style={styles.section}>
        <Text style={styles.title}>{volunteerData.title}</Text>
        <View style={styles.dateTimeContainer}>
          <FontAwesome name="calendar" size={16} color="#666" />
          <Text style={styles.dateTimeText}>{volunteerData.date}</Text>
          <FontAwesome name="clock-o" size={16} color="#666" style={styles.timeIcon} />
          <Text style={styles.dateTimeText}>{volunteerData.time}</Text>
        </View>
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>{volunteerData.status}</Text>
          <Text style={styles.volunteerCount}>
            {volunteerData.currentVolunteers}/{volunteerData.maxVolunteers}명 참여
          </Text>
        </View>
      </View>

      {/* 설명 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>봉사 내용</Text>
        <Text style={styles.description}>{volunteerData.description}</Text>
      </View>

      {/* 지도 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>위치</Text>
        {renderMap()}
        <Text style={styles.address}>{volunteerData.location.address}</Text>
      </View>

      {/* 요구사항 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>요구사항</Text>
        {volunteerData.requirements.map((req, index) => (
          <View key={index} style={styles.requirementItem}>
            <FontAwesome name="check-circle" size={16} color="#FF6B00" />
            <Text style={styles.requirementText}>{req}</Text>
          </View>
        ))}
      </View>

      {/* 연락처 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>연락처</Text>
        <View style={styles.contactItem}>
          <FontAwesome name="user" size={16} color="#666" />
          <Text style={styles.contactText}>{volunteerData.contact.name}</Text>
        </View>
        <View style={styles.contactItem}>
          <FontAwesome name="phone" size={16} color="#666" />
          <Text style={styles.contactText}>{volunteerData.contact.phone}</Text>
        </View>
        <View style={styles.contactItem}>
          <FontAwesome name="envelope" size={16} color="#666" />
          <Text style={styles.contactText}>{volunteerData.contact.email}</Text>
        </View>
      </View>

      {/* 신청 버튼 */}
      <TouchableOpacity style={styles.applyButton}>
        <Text style={styles.applyButtonText}>봉사 신청하기</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerImage: {
    width: '100%',
    height: 200,
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  dateTimeText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 5,
  },
  timeIcon: {
    marginLeft: 15,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusText: {
    backgroundColor: '#FF6B00',
    color: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    fontSize: 14,
    marginRight: 10,
  },
  volunteerCount: {
    fontSize: 14,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  map: {
    width: '100%',
    height: 200,
    marginBottom: 10,
    borderRadius: 8,
  },
  mapPlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 10,
  },
  address: {
    fontSize: 14,
    color: '#666',
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  requirementText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#333',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  contactText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#333',
  },
  applyButton: {
    backgroundColor: '#FF6B00',
    padding: 15,
    borderRadius: 8,
    margin: 20,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 