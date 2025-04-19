import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface KakaoMapProps {
  latitude: number;
  longitude: number;
  placeName?: string;
}

const KakaoMap: React.FC<KakaoMapProps> = ({ latitude, longitude, placeName }) => {
  const handleOpenMap = () => {
    const url = `https://map.kakao.com/link/map/${placeName},${latitude},${longitude}`;
    Linking.openURL(url);
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handleOpenMap}>
      <View style={styles.mapButton}>
        <Ionicons name="map" size={24} color="#fff" />
        <Text style={styles.buttonText}>카카오맵에서 보기</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 50,
    marginVertical: 10,
  },
  mapButton: {
    backgroundColor: '#FEE500',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#000',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default KakaoMap; 