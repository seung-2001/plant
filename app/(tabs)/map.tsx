// 지도 화면 컴포넌트
// - 봉사 활동 위치를 지도에 표시
// - 마커 클릭 시 봉사 활동 정보 표시
// - 검색, 홈, 프로필 버튼이 있는 하단 네비게이션 바

import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Platform, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// 위치 정보 인터페이스 정의
interface Location {
  id: number;
  title: string;
  time: string;
  status: string;
  latitude: number;
  longitude: number;
}

export default function MapScreen() {
  const router = useRouter();
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  const locations: Location[] = [
    {
      id: 1,
      title: '위례동 보육원봉사자 모집',
      time: '09:00 - 18:00',
      status: '모집중',
      latitude: 37.5665,
      longitude: 126.9780,
    },
    // 추가 위치 데이터...
  ];

  const handleMarkerPress = (location: Location) => {
    setSelectedLocation(location);
  };

  const handleDetailPress = () => {
    if (selectedLocation) {
      router.push(`/volunteer/${selectedLocation.id}`);
    }
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
          latitude: 37.5665,
          longitude: 126.9780,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {locations.map((location) => (
          <Marker
            key={location.id}
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            onPress={() => handleMarkerPress(location)}
          />
        ))}
      </MapView>
    );
  };

  return (
    <View style={styles.container}>
      {/* 지도 컴포넌트 */}
      {renderMap()}

      {/* 선택된 위치 정보 카드 */}
      {selectedLocation && (
        <TouchableOpacity style={styles.locationInfo} onPress={handleDetailPress}>
          <View style={styles.locationHeader}>
            <Text style={styles.locationTitle}>{selectedLocation.title}</Text>
            <View style={styles.statusContainer}>
              <Text style={styles.statusText}>{selectedLocation.status}</Text>
              <TouchableOpacity style={styles.detailButton}>
                <Text style={styles.detailButtonText}>자세히</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.locationTime}>
            <FontAwesome name="clock-o" size={16} color="#666" />
            <Text style={styles.timeText}>{selectedLocation.time}</Text>
          </View>
        </TouchableOpacity>
      )}

      {/* 하단 네비게이션 바 */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton}>
          <FontAwesome name="search" size={20} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.homeButton}>
          <View style={styles.homeButtonInner}>
            <FontAwesome name="home" size={24} color="#fff" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <FontAwesome name="user" size={20} color="#666" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height - 100,
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  locationInfo: {
    position: 'absolute',
    bottom: 120,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    color: '#FF6B00',
    fontSize: 14,
    marginRight: 10,
  },
  detailButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  detailButtonText: {
    fontSize: 12,
    color: '#666',
  },
  locationTime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    marginLeft: 5,
    color: '#666',
    fontSize: 14,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    height: 60,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingBottom: 0,
  },
  navButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  homeButton: {
    width: 56,
    height: 56,
    backgroundColor: '#fff',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  homeButtonInner: {
    width: 50,
    height: 50,
    backgroundColor: '#FF6B00',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 