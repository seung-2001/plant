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
import { fetchVolunteerMeals, VolunteerMeal } from '../../services/volunteerService';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Geocoder from 'react-native-geocoding';

// Google Maps API 키 설정
Geocoder.init("AIzaSyDZAfEAzvDgy6AUR0ZosNREDOEq8wSv720");

export default function VolunteerDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [volunteer, setVolunteer] = useState<VolunteerMeal | null>(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  useEffect(() => {
    loadVolunteerDetail();
  }, [id]);

  const loadVolunteerDetail = async () => {
    try {
      setLoading(true);
      const response = await fetchVolunteerMeals({
        start_date: '2024-03-01',
        end_date: '2024-12-31'
      });
      
      if (response.items) {
        const found = response.items.find((item: VolunteerMeal) => item.progrmRegistNo === id);
        if (found) {
          setVolunteer(found);
          // 주소를 좌표로 변환
          if (found.actPlace) {
            try {
              const response = await Geocoder.from(found.actPlace);
              const { lat, lng } = response.results[0].geometry.location;
              setLocation({ latitude: lat, longitude: lng });
            } catch (error) {
              console.error('주소 변환 실패:', error);
            }
          }
        } else {
          Alert.alert('오류', '봉사 정보를 찾을 수 없습니다.');
          router.back();
        }
      }
    } catch (error) {
      console.error('봉사 상세 정보 로드 실패:', error);
      Alert.alert('오류', '봉사 정보를 불러오는 중 오류가 발생했습니다.');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    return `${dateStr.substring(0, 4)}-${dateStr.substring(4, 6)}-${dateStr.substring(6, 8)}`;
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
          <Text style={styles.title}>{volunteer.prgramSj}</Text>
          <Text style={[styles.status, { color: volunteer.progrmSttusSe === '모집중' ? '#4CAF50' : '#FF6B00' }]}>
            {volunteer.progrmSttusSe}
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
            <Text style={styles.infoText}>{volunteer.actTime}</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={20} color="#666" />
            <Text style={styles.infoText}>{volunteer.actPlace}</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="people-outline" size={20} color="#666" />
            <Text style={styles.infoText}>모집인원: {volunteer.rcritNmpr}명</Text>
          </View>
        </View>

        {location && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>활동 장소</Text>
            <MapView
              provider={PROVIDER_GOOGLE}
              style={styles.map}
              initialRegion={{
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
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
                title={volunteer.prgramSj}
                description={volunteer.actPlace}
                pinColor="#FF6B00"
              />
            </MapView>
            <Text style={styles.addressText}>{volunteer.actPlace}</Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>프로그램 내용</Text>
          <Text style={styles.description}>{volunteer.progrmCn}</Text>
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
          <View style={styles.infoRow}>
            <Ionicons name="home-outline" size={20} color="#666" />
            <Text style={styles.infoText}>{volunteer.postAdres || '주소 정보 없음'}</Text>
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
    width: Dimensions.get('window').width - 32,
    height: 200,
    borderRadius: 8,
    marginTop: 8,
  },
  addressText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
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
}); 