import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function VolunteerDetailScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const inset = useSafeAreaInsets();

  // 실제로는 API에서 데이터를 가져와야 합니다
  const volunteerData = {
    id: params.id,
    title: '하계동 제자백왕원길 봄맞이행사',
    status: '모집중',
    category: '환경보호',
    period: '2025-01-12 ~ 2025-03-22',
    time: '10:00 ~ 14:00',
    location: '서울 노원구 제자백왕길 26',
    currentParticipants: 0,
    maxParticipants: 20,
    description: `봄맞이 대청소에 참여하실 봉사자분들을 모집합니다.

주요활동
- 제자백왕원길 주변 쓰레기 수거
- 불법투기 쓰레기 정리
- 잡초 제거

준비물
- 편한 복장
- 장갑

활동 시 유의사항
- 봉사활동 시작 10분 전까지 도착해주세요
- 봉사활동 전 안전교육이 진행됩니다
- 우천시 일정이 변경될 수 있습니다

문의사항
02-123-4567`,
    organization: '하계1동 주민센터',
    organizationContact: '02-123-4567',
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
          <Text style={styles.title}>{volunteerData.title}</Text>
          <View style={styles.statusContainer}>
            <Text style={styles.status}>{volunteerData.status}</Text>
          </View>
        </View>

        {/* 지도 섹션 */}
        <View style={styles.mapContainer}>
          <Text style={styles.mapPlaceholder}>지도 영역</Text>
        </View>

        {/* 기본 정보 */}
        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={20} color="#666" />
            <Text style={styles.infoLabel}>봉사기간</Text>
            <Text style={styles.infoValue}>{volunteerData.period}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={20} color="#666" />
            <Text style={styles.infoLabel}>봉사시간</Text>
            <Text style={styles.infoValue}>{volunteerData.time}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={20} color="#666" />
            <Text style={styles.infoLabel}>봉사장소</Text>
            <Text style={styles.infoValue}>{volunteerData.location}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="people-outline" size={20} color="#666" />
            <Text style={styles.infoLabel}>모집인원</Text>
            <Text style={styles.infoValue}>
              {volunteerData.currentParticipants}/{volunteerData.maxParticipants}명
            </Text>
          </View>
        </View>

        {/* 상세 설명 */}
        <View style={styles.descriptionSection}>
          <Text style={styles.sectionTitle}>상세내용</Text>
          <Text style={styles.description}>{volunteerData.description}</Text>
        </View>

        {/* 기관 정보 */}
        <View style={styles.organizationSection}>
          <Text style={styles.sectionTitle}>기관정보</Text>
          <View style={styles.organizationInfo}>
            <Text style={styles.organizationName}>{volunteerData.organization}</Text>
            <Text style={styles.organizationContact}>
              문의: {volunteerData.organizationContact}
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
            console.log('신청하기');
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
}); 