import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';

export default function PlaceDetailScreen() {
  const router = useRouter();
  const { name, address, latitude, longitude } = useLocalSearchParams();

  const kakaoMapHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
        <script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.EXPO_PUBLIC_KAKAO_MAP_API_KEY}"></script>
      </head>
      <body style="margin:0">
        <div id="map" style="width:100%;height:100%;"></div>
        <script>
          var container = document.getElementById('map');
          var options = {
            center: new kakao.maps.LatLng(${latitude}, ${longitude}),
            level: 3
          };
          var map = new kakao.maps.Map(container, options);
          
          // 마커 생성
          var marker = new kakao.maps.Marker({
            position: new kakao.maps.LatLng(${latitude}, ${longitude})
          });
          marker.setMap(map);
          
          // 인포윈도우 생성
          var infowindow = new kakao.maps.InfoWindow({
            content: '<div style="padding:5px;">${name}</div>'
          });
          infowindow.open(map, marker);
        </script>
      </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>{name}</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.mapContainer}>
          <WebView
            source={{ html: kakaoMapHtml }}
            style={styles.map}
            javaScriptEnabled={true}
            domStorageEnabled={true}
          />
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Ionicons name="location" size={20} color="#4CAF50" />
            <Text style={styles.address}>{address}</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="time" size={20} color="#4CAF50" />
            <Text style={styles.time}>09:00 - 18:00</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="call" size={20} color="#4CAF50" />
            <Text style={styles.phone}>02-123-4567</Text>
          </View>
        </View>

        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionTitle}>장소 소개</Text>
          <Text style={styles.description}>
            이 장소는 식물을 키우고 관리하는 공간입니다. 다양한 종류의 식물을 만나보실 수 있으며,
            식물 관리에 대한 전문적인 조언도 받으실 수 있습니다.
          </Text>
        </View>
      </ScrollView>
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
  },
  mapContainer: {
    width: '100%',
    height: 300,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  address: {
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  time: {
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  phone: {
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  descriptionContainer: {
    padding: 16,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
  },
}); 