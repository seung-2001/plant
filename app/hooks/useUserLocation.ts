import {useEffect, useState} from 'react';
import {LatLng} from 'react-native-maps';
import * as Location from 'expo-location';
import useAppState from './useAppState';

function useUserLocation() {
  const [userLocation, setUserLocation] = useState<LatLng>({
    latitude: 37.5516032365118,
    longitude: 126.98989626020192,
  });
  const [isUserLocationError, setIsUserLocationError] = useState(false);
  const {isComeback} = useAppState();

  useEffect(() => {
    let isMounted = true;

    const getLocation = async () => {
      try {
        // 위치 권한 상태 확인
        const {status} = await Location.getForegroundPermissionsAsync();
        
        if (status !== 'granted') {
          // 권한이 없으면 요청
          const {status: newStatus} = await Location.requestForegroundPermissionsAsync();
          if (newStatus !== 'granted') {
            if (isMounted) {
              setIsUserLocationError(true);
            }
            return;
          }
        }

        // 위치 정보 가져오기
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        
        if (isMounted) {
          setUserLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
          setIsUserLocationError(false);
        }
      } catch (error) {
        console.error('위치 정보를 가져오는 중 오류 발생:', error);
        if (isMounted) {
          setIsUserLocationError(true);
        }
      }
    };

    getLocation();

    // 컴포넌트 언마운트 시 isMounted 플래그 설정
    return () => {
      isMounted = false;
    };
  }, [isComeback]);

  return {userLocation, isUserLocationError};
}

export default useUserLocation; 