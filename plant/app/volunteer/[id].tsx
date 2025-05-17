import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { fetchVolunteerDetail, fetchVolunteerMeals, VolunteerMeal } from '../../services/volunteerService';
import type { VolunteerDetail } from '../../services/volunteerService';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import Geocoder from 'react-native-geocoding';

// Google Maps API 키 설정
Geocoder.init("AIzaSyDZAfEAzvDgy6AUR0ZosNREDOEq8wSv720");

export default function VolunteerDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [volunteer, setVolunteer] = useState<VolunteerDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  
  // 지도 참조 추가
  const mapRef = React.useRef<MapView>(null);
  // 초기 위치만 저장 (확대/축소 수준 제외)
  const [initialLocation, setInitialLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  useEffect(() => {
    loadVolunteerDetail();
  }, [id]);

  const loadVolunteerDetail = async () => {
    try {
      setLoading(true);
      
      // 두 API 동시에 요청
      const [detail, mealsResponse] = await Promise.all([
        fetchVolunteerDetail(id as string),
        fetchVolunteerMeals({
          start_date: '2024-03-01',
          end_date: '2024-12-31'
        })
      ]);
      
      // 디버깅을 위한 로그 추가
      console.log('봉사 상세 정보 로드 성공:', JSON.stringify(detail, null, 2));
      
      // meals API에서 동일한 ID를 가진 봉사활동 찾기
      let matchedMeal: VolunteerMeal | undefined;
      if (mealsResponse.items && mealsResponse.items.length > 0) {
        matchedMeal = mealsResponse.items.find(
          (item: VolunteerMeal) => item.progrmRegistNo === id
        );
        
        if (matchedMeal) {
          console.log('목록 API에서 일치하는 봉사활동 찾음:', matchedMeal);
          
          // 상세 정보에 주소 정보 복사
          if (matchedMeal.actPlace && (!detail.actPlace || detail.actPlace.trim() === '')) {
            detail.actPlace = matchedMeal.actPlace;
          }
          
          if (matchedMeal.postAdres && (!detail.postAdres || detail.postAdres.trim() === '')) {
            detail.postAdres = matchedMeal.postAdres;
          }
        }
      }
      
      // 여전히 주소 정보가 없으면 기본값 설정
      if (!detail.actPlace || detail.actPlace.trim() === '') {
        detail.actPlace = '서울특별시 중구 세종대로 110 (서울시청)';
      }
      
      if (!detail.postAdres || detail.postAdres.trim() === '') {
        detail.postAdres = detail.actPlace;
      }
      
      console.log('최종 주소 정보:', detail.actPlace);
      console.log('최종 우편 주소 정보:', detail.postAdres);
      
      setVolunteer(detail);
      
      // 주소를 좌표로 변환
      try {
        console.log(`주소 변환 시도: "${detail.actPlace}"`);
        const response = await Geocoder.from(detail.actPlace);
        
        if (response.results && response.results.length > 0 && 
            response.results[0].geometry && response.results[0].geometry.location) {
          const { lat, lng } = response.results[0].geometry.location;
          console.log(`주소 변환 성공: ${detail.actPlace} -> 위도:${lat}, 경도:${lng}`);
          setLocation({ latitude: lat, longitude: lng });
        } else {
          console.error('주소 변환 결과가 유효하지 않습니다:', JSON.stringify(response));
          // 기본 좌표 설정 (서울시청)
          setLocation({ latitude: 37.5666805, longitude: 126.9784147 });
        }
      } catch (error) {
        console.error('주소 변환 실패:', error);
        // 기본 좌표 설정 (서울시청)
        setLocation({ latitude: 37.5666805, longitude: 126.9784147 });
      }
    } catch (error) {
      console.error('봉사 상세 정보 로드 실패:', error);
      Alert.alert('오류', '봉사 정보를 불러오는 중 오류가 발생했습니다.');
      router.back();
    } finally {
      setLoading(false);
    }
  };

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

  // 봉사 상태 색상 함수
  const getStatusColor = (status: string) => {
    switch (status) {
      case '모집중':
      case '자원봉사자 모집중':
        return '#4CAF50';
      case '모집완료':
      case '접수마감':
        return '#FF6B00';
      case '모집마감':
      case '완료':
        return '#9E9E9E';
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

  if (loading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color="#FF6B00" />
      </View>
    );
  }

  if (!volunteer) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Text style={styles.errorText}>봉사 정보를 찾을 수 없습니다.</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>봉사 상세 정보</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.title}>{volunteer.prgramSj || '제목 없음'}</Text>
          <Text style={[styles.status, { color: getStatusColor(volunteer.progrmSttusSe) }]}>
            {formatStatus(volunteer.progrmSttusSe)}
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={20} color="#666" />
            <Text style={styles.infoText}>
              {formatDate(volunteer.actBeginDe)} ~ {formatDate(volunteer.actEndDe)}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={20} color="#666" />
            <Text style={styles.infoText}>
              {volunteer.actWkdy ? `${volunteer.actWkdy}, ` : ''}{volunteer.actTime || '시간 정보 없음'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={20} color="#666" />
            <Text style={styles.infoText}>{volunteer.actPlace || '장소 정보 없음'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="people-outline" size={20} color="#666" />
            <Text style={styles.infoText}>모집인원: {volunteer.rcritNmpr || '미정'}명</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="business-outline" size={20} color="#666" />
            <Text style={styles.infoText}>주최기관: {volunteer.nanmmbyNm || '정보 없음'}</Text>
          </View>
        </View>

        {volunteer.participants && volunteer.participants.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>참여자 목록</Text>
            {volunteer.participants.map((participant) => (
              <View key={participant.id} style={styles.participantRow}>
                <Text style={styles.participantName}>{participant.name}</Text>
                <Text style={[
                  styles.participantStatus,
                  { color: participant.status === 'approved' ? '#4CAF50' : 
                          participant.status === 'rejected' ? '#FF6B00' : '#666' }
                ]}>
                  {participant.status === 'approved' ? '승인됨' :
                   participant.status === 'rejected' ? '거절됨' : '대기중'}
                </Text>
              </View>
            ))}
          </View>
        )}

        {location && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>활동 장소</Text>
            <View style={styles.locationAddressContainer}>
              <Ionicons name="location" size={18} color="#FF6B00" />
              <Text style={styles.locationAddressText}>{volunteer.actPlace || '주소 정보 없음'}</Text>
            </View>
            <View style={styles.mapContainer}>
              <MapView
                ref={mapRef}
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={{
                  latitude: location.latitude,
                  longitude: location.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
                onMapReady={() => {
                  // 지도가 로드되면 초기 위치 정보만 저장
                  setInitialLocation({
                    latitude: location.latitude,
                    longitude: location.longitude,
                  });
                }}
                customMapStyle={[
                  {
                    "featureType": "all",
                    "elementType": "labels.text.fill",
                    "stylers": [
                      {
                        "color": "#333333"
                      }
                    ]
                  },
                  {
                    "featureType": "all",
                    "elementType": "labels.text.stroke",
                    "stylers": [
                      {
                        "visibility": "off"
                      }
                    ]
                  },
                  {
                    "featureType": "administrative",
                    "elementType": "geometry.fill",
                    "stylers": [
                      {
                        "color": "#fefefe"
                      }
                    ]
                  },
                  {
                    "featureType": "landscape",
                    "elementType": "geometry",
                    "stylers": [
                      {
                        "color": "#f5f5f5"
                      }
                    ]
                  },
                  {
                    "featureType": "poi",
                    "elementType": "geometry",
                    "stylers": [
                      {
                        "color": "#f5f5f5"
                      }
                    ]
                  },
                  {
                    "featureType": "road.highway",
                    "elementType": "geometry.fill",
                    "stylers": [
                      {
                        "color": "#ffffff"
                      }
                    ]
                  },
                  {
                    "featureType": "road.highway",
                    "elementType": "geometry.stroke",
                    "stylers": [
                      {
                        "color": "#d9d9d9"
                      }
                    ]
                  },
                  {
                    "featureType": "road.arterial",
                    "elementType": "geometry",
                    "stylers": [
                      {
                        "color": "#ffffff"
                      }
                    ]
                  },
                  {
                    "featureType": "road.local",
                    "elementType": "geometry",
                    "stylers": [
                      {
                        "color": "#ffffff"
                      }
                    ]
                  },
                  {
                    "featureType": "transit",
                    "elementType": "geometry",
                    "stylers": [
                      {
                        "color": "#f5f5f5"
                      }
                    ]
                  },
                  {
                    "featureType": "water",
                    "elementType": "geometry",
                    "stylers": [
                      {
                        "color": "#c9c9c9"
                      }
                    ]
                  }
                ]}
              >
                <Marker
                  coordinate={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                  }}
                  title={volunteer.prgramSj || '봉사 활동'}
                  description={volunteer.actPlace}
                  pinColor="#FF6B00"
                />
              </MapView>
              
              {/* 지도 위에 위치 재설정 버튼 */}
              <TouchableOpacity 
                style={styles.resetLocationButton}
                onPress={() => {
                  if (mapRef.current && initialLocation) {
                    // 현재 지도의 zoomLevel(delta 값)을 가져옴
                    mapRef.current.getCamera().then((camera) => {
                      // 현재 확대/축소 수준은 유지하고 위치만 변경
                      mapRef.current?.animateCamera({
                        center: {
                          latitude: initialLocation.latitude,
                          longitude: initialLocation.longitude
                        },
                        // 현재 zoomLevel 유지
                        zoom: camera.zoom
                      }, { duration: 500 });
                    });
                  }
                }}
              >
                <Ionicons name="locate" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.addressContainer}>
              <Ionicons name="location" size={18} color="#FF6B00" style={styles.addressIcon} />
              <Text style={styles.addressText}>{volunteer.actPlace || '주소 정보 없음'}</Text>
            </View>
          </View>
        )}

        {!location && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>활동 장소</Text>
            <View style={styles.locationAddressContainer}>
              <Ionicons name="location" size={18} color="#FF6B00" />
              <Text style={styles.locationAddressText}>{volunteer.actPlace || '주소 정보 없음'}</Text>
            </View>
            <View style={styles.noMapContainer}>
              <Ionicons name="map-outline" size={40} color="#9E9E9E" />
              <Text style={styles.noMapText}>지도를 불러오는 중 오류가 발생했습니다</Text>
              <Text style={styles.addressText}>{volunteer.actPlace || '주소 정보 없음'}</Text>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>프로그램 내용</Text>
          <ScrollView style={volunteer.progrmCn && volunteer.progrmCn.length > 200 ? styles.contentScrollView : undefined}>
            <Text style={styles.description}>{volunteer.progrmCn || '프로그램 내용 정보가 없습니다.'}</Text>
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>연락처 정보</Text>
          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={20} color="#666" />
            <Text style={styles.infoText}>{volunteer.telno || '연락처 정보 없음'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="mail-outline" size={20} color="#666" />
            <Text style={styles.infoText}>{volunteer.email || '이메일 정보 없음'}</Text>
          </View>
          
          {/* 주소 정보 강조 표시 */}
          <View style={styles.addressInfoContainer}>
            <Ionicons name="home-outline" size={22} color="#FF6B00" />
            <View style={styles.addressInfoTextContainer}>
              <Text style={styles.addressInfoTitle}>주소:</Text>
              <Text style={styles.addressInfoText}>
                {volunteer.postAdres || volunteer.actPlace || '서울특별시 중구 세종대로 110 (서울시청)'}
              </Text>
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="people-outline" size={20} color="#666" />
            <Text style={styles.infoText}>{volunteer.nanmmbyNmAdmn || '담당자 정보 없음'} {volunteer.nanmmbyNmAdmnTelno ? `(${volunteer.nanmmbyNmAdmnTelno})` : ''}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.applyButton}>
          <Text style={styles.applyButtonText}>신청하기</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  status: {
    fontSize: 16,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 12,
    flex: 1,
  },
  description: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  map: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  mapContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
    marginTop: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  locationAddressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  locationAddressText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
    flex: 1,
    fontWeight: '500',
  },
  addressContainer: {
    flexDirection: 'row', 
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 4,
  },
  addressIcon: {
    marginRight: 6,
  },
  addressText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  noMapContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    paddingVertical: 30,
    paddingHorizontal: 20,
    marginTop: 8,
  },
  noMapText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    marginBottom: 15,
  },
  applyButton: {
    backgroundColor: '#FF6B00',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 16,
    color: '#FF0000',
    textAlign: 'center',
    margin: 16,
  },
  participantRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  participantName: {
    fontSize: 16,
    color: '#333',
  },
  participantStatus: {
    fontSize: 14,
    fontWeight: '500',
  },
  contentScrollView: {
    maxHeight: 200,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  addressInfoContainer: {
    flexDirection: 'row',
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#FF6B00',
  },
  addressInfoTextContainer: {
    marginLeft: 10,
    flex: 1,
  },
  addressInfoTitle: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    marginBottom: 4,
  },
  addressInfoText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  resetLocationButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: '#FF6B00',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 5,
  },
}); 