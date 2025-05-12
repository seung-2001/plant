// 지도 화면 컴포넌트
// - 봉사 활동 위치를 지도에 표시
// - 마커 클릭 시 봉사 활동 정보 표시
// - 검색, 홈, 프로필 버튼이 있는 하단 네비게이션 바

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert, Dimensions, SafeAreaView, Image } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useUserLocation from '../hooks/useUserLocation';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

interface VolunteerPlace {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  type: 'nursing_home' | 'child_care' | 'disabled_facility' | 'environment';
  date: string;
  participants: number;
  maxParticipants: number;
}

export default function MapScreen() {
  const mapRef = useRef<MapView>(null);
  const router = useRouter();
  const inset = useSafeAreaInsets();
  const { userLocation, isUserLocationError } = useUserLocation();
  const [selectedType, setSelectedType] = useState<'all' | VolunteerPlace['type']>('all');
  const [places, setPlaces] = useState<VolunteerPlace[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showNearbyOnly, setShowNearbyOnly] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<VolunteerPlace | null>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['30%'], []);

  useEffect(() => {
    // TODO: API에서 봉사활동 장소 데이터 가져오기
    const mockPlaces: VolunteerPlace[] = [
      {
        id: '1',
        name: '행복요양원',
        latitude: 37.5665,
        longitude: 126.9780,
        address: '서울시 중구 세종대로 110',
        type: 'nursing_home',
        date: '2024-03-15',
        participants: 5,
        maxParticipants: 10,
      },
      {
        id: '2',
        name: '사랑어린이집',
        latitude: 37.5666,
        longitude: 126.9781,
        address: '서울시 중구 세종대로 111',
        type: 'child_care',
        date: '2024-03-16',
        participants: 3,
        maxParticipants: 8,
      },
      {
        id: '3',
        name: '희망복지관',
        latitude: 37.5667,
        longitude: 126.9782,
        address: '서울시 중구 세종대로 112',
        type: 'disabled_facility',
        date: '2024-03-17',
        participants: 7,
        maxParticipants: 12,
      },
      {
        id: '4',
        name: '청계천 환경정화',
        latitude: 37.5668,
        longitude: 126.9783,
        address: '서울시 중구 청계천로',
        type: 'environment',
        date: '2024-03-18',
        participants: 15,
        maxParticipants: 20,
      },
    ];
    setPlaces(mockPlaces);
  }, []);

  const handleMarkerPress = useCallback((place: VolunteerPlace) => {
    setSelectedPlace(place);
    bottomSheetRef.current?.snapToIndex(0);
  }, []);

  const handleFilterPress = (type: 'all' | VolunteerPlace['type']) => {
    setSelectedType(type);
  };

  const getMarkerColor = (type: VolunteerPlace['type']) => {
    switch (type) {
      case 'nursing_home':
        return '#FF6B6B'; // 요양원
      case 'child_care':
        return '#4CAF50'; // 어린이집
      case 'disabled_facility':
        return '#2196F3'; // 장애인시설
      case 'environment':
        return '#9C27B0'; // 환경정화
      default:
        return '#666666';
    }
  };

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

  const getNearbyPlaces = (places: VolunteerPlace[]) => {
    if (!showNearbyOnly) return places;
    
    const NEARBY_DISTANCE = 3; // 3km 이내
    return places.filter(place => {
      const distance = getDistanceFromLatLonInKm(
        userLocation.latitude,
        userLocation.longitude,
        place.latitude,
        place.longitude
      );
      return distance <= NEARBY_DISTANCE;
    });
  };

  const getDistanceFromLatLonInKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // 지구의 반경 (km)
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const deg2rad = (deg: number) => {
    return deg * (Math.PI/180);
  };

  const filteredPlaces = getNearbyPlaces(
    selectedType === 'all' 
      ? places 
      : places.filter((place: VolunteerPlace) => place.type === selectedType)
  );

  const handleMoveToUserLocation = () => {
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 1000);
    }
  };

  const handleBottomSheetPress = useCallback(() => {
    if (selectedPlace) {
      router.push({
        pathname: '/volunteer-detail',
        params: {
          id: selectedPlace.id,
          name: selectedPlace.name,
          address: selectedPlace.address,
          date: selectedPlace.date,
          participants: selectedPlace.participants,
          maxParticipants: selectedPlace.maxParticipants
        }
      });
    }
  }, [selectedPlace]);

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      setSelectedPlace(null);
    }
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.container}>
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={{
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          showsUserLocation={true}
          showsMyLocationButton={false}
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
          {/* 현재 위치 마커 */}
          <Marker
            coordinate={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            }}
            title="현재 위치"
            pinColor="blue"
          />

          {/* 봉사활동 장소 마커들 */}
          {filteredPlaces.map((place) => (
            <Marker
              key={place.id}
              coordinate={{
                latitude: place.latitude,
                longitude: place.longitude,
              }}
              title={place.name}
              description={`${getTypeName(place.type)} | ${place.date}`}
              onPress={() => handleMarkerPress(place)}
              pinColor={getMarkerColor(place.type)}
            />
          ))}
        </MapView>

        {/* 상단 버튼들 */}
        <View style={[styles.topBar, { marginTop: inset.top + 20 }]}>
          {/* 검색 버튼 */}
          <TouchableOpacity 
            style={styles.topButton}
            onPress={() => router.push('/map/search')}
          >
            <Ionicons name="search" size={24} color="#666" />
          </TouchableOpacity>

          <View style={styles.rightButtons}>
            {/* 현재 위치 버튼 */}
            <TouchableOpacity 
              style={styles.topButton}
              onPress={handleMoveToUserLocation}
            >
              <Ionicons name="locate" size={24} color="#666" />
            </TouchableOpacity>

            {/* 필터 버튼 */}
            <TouchableOpacity 
              style={styles.topButton}
              onPress={() => setShowFilters(!showFilters)}
            >
              <Ionicons name="filter" size={24} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        {/* 필터 메뉴 */}
        {showFilters && (
          <View style={[styles.filterMenu, { top: inset.top + 80 }]}>
            <TouchableOpacity 
              style={[
                styles.filterOption,
                showNearbyOnly && styles.selectedFilter
              ]}
              onPress={() => setShowNearbyOnly(!showNearbyOnly)}
            >
              <Ionicons 
                name="location" 
                size={20} 
                color={showNearbyOnly ? '#fff' : '#666'} 
              />
              <Text style={[
                styles.filterText,
                showNearbyOnly && styles.selectedFilterText
              ]}>
                내 주변 3km
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* 바텀 시트 */}
        <BottomSheet
          ref={bottomSheetRef}
          snapPoints={snapPoints}
          enablePanDownToClose={true}
          index={-1}
          onChange={handleSheetChanges}
        >
          <TouchableOpacity 
            style={styles.bottomSheetContainer}
            onPress={handleBottomSheetPress}
            activeOpacity={0.9}
          >
            <BottomSheetView style={styles.bottomSheetContent}>
              {selectedPlace && (
                <>
                  <View style={styles.placeHeader}>
                    <Text style={styles.placeName}>{selectedPlace.name}</Text>
                    <Text style={styles.placeType}>{getTypeName(selectedPlace.type)}</Text>
                  </View>
                  <View style={styles.infoContainer}>
                    <View style={styles.infoRow}>
                      <Ionicons name="location-outline" size={20} color="#666" />
                      <Text style={styles.infoText}>{selectedPlace.address}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Ionicons name="calendar-outline" size={20} color="#666" />
                      <Text style={styles.infoText}>{selectedPlace.date}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Ionicons name="people-outline" size={20} color="#666" />
                      <Text style={styles.infoText}>
                        참여인원: {selectedPlace.participants}/{selectedPlace.maxParticipants}명
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.tapToView}>
                    탭하여 상세 정보 보기
                  </Text>
                </>
              )}
            </BottomSheetView>
          </TouchableOpacity>
        </BottomSheet>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  topBar: {
    position: 'absolute',
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rightButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  topButton: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  filterMenu: {
    position: 'absolute',
    right: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    gap: 8,
  },
  selectedFilter: {
    backgroundColor: '#4CAF50',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
  },
  selectedFilterText: {
    color: '#fff',
  },
  bottomSheetContainer: {
    flex: 1,
  },
  bottomSheetContent: {
    padding: 20,
  },
  placeHeader: {
    marginBottom: 15,
  },
  placeName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  placeType: {
    fontSize: 14,
    color: '#666',
  },
  infoContainer: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  tapToView: {
    marginTop: 15,
    textAlign: 'center',
    fontSize: 14,
    color: '#4CAF50',
  },
}); 