import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Keyboard,
  Alert,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// API 기본 URL
const API_BASE_URL = 'http://192.168.200.181:5000';

// 검색 결과 타입 정의
interface VolunteerSearchResult {
  progrmRegistNo: string;  // 프로그램 등록번호 (id)
  prgramSj: string;        // 프로그램 제목 (name)
  actPlace: string;        // 활동 장소 (address)
  actBeginDe: string;      // 활동 시작일
  actEndDe: string;        // 활동 종료일
  progrmSttusSe: string;   // 프로그램 상태
  nanmmbyNm: string;       // 기관명 (category)
}

const RECENT_SEARCHES_KEY = 'recent_volunteer_searches';

export default function SearchScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<VolunteerSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // 최근 검색어 불러오기
  useEffect(() => {
    loadRecentSearches();
  }, []);

  const loadRecentSearches = async () => {
    try {
      const storedSearches = await AsyncStorage.getItem(RECENT_SEARCHES_KEY);
      if (storedSearches) {
        setRecentSearches(JSON.parse(storedSearches));
      }
    } catch (error) {
      console.error('최근 검색어 불러오기 실패:', error);
    }
  };

  // 최근 검색어 저장
  const saveRecentSearch = async (query: string) => {
    try {
      const updatedSearches = [
        query, 
        ...recentSearches.filter(item => item !== query)
      ].slice(0, 5);
      
      setRecentSearches(updatedSearches);
      await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updatedSearches));
    } catch (error) {
      console.error('최근 검색어 저장 실패:', error);
    }
  };

  // 검색 함수
  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    try {
      console.log('봉사 활동 검색 시작:', query);
      
      // 1365 API 호출
      const response = await axios.get(`${API_BASE_URL}/volunteer/meals`, {
        params: {
          keyword: query,
          start_date: getCurrentDate(), // 오늘 날짜 이후
          end_date: getFutureDate(365) // 1년 후까지
        },
        timeout: 10000
      });
      
      console.log('검색 응답 상태:', response.status);
      
      if (response.data && response.data.items) {
        console.log('검색 결과 수:', response.data.items.length);
        setSearchResults(response.data.items);
        
        // 검색 결과가 있을 경우 최근 검색어에 추가
        if (response.data.items.length > 0) {
          saveRecentSearch(query);
        }
      } else {
        console.log('검색 결과 없음');
        setSearchResults([]);
      }
    } catch (error) {
      console.error('봉사 활동 검색 실패:', error);
      Alert.alert('검색 오류', '봉사 활동 검색 중 오류가 발생했습니다. 다시 시도해주세요.');
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 현재 날짜를 YYYYMMDD 형식으로 반환
  const getCurrentDate = () => {
    const now = new Date();
    return formatDate(now);
  };
  
  // 미래 날짜를 YYYYMMDD 형식으로 반환
  const getFutureDate = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return formatDate(date);
  };
  
  // 날짜를 YYYYMMDD 형식으로 변환
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  };
  
  // 날짜 형식 변환 (YYYYMMDD -> YYYY-MM-DD)
  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr || dateStr.length !== 8) return '날짜 정보 없음';
    return `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`;
  };

  // 장소 선택 처리
  const handleSelectPlace = (place: VolunteerSearchResult) => {
    // 봉사 상세 정보 화면으로 이동
    router.push({
      pathname: '/volunteer/[id]',
      params: { 
        id: place.progrmRegistNo
      }
    });
  };

  const renderSearchResult = ({ item }: { item: VolunteerSearchResult }) => (
    <TouchableOpacity 
      style={styles.resultItem}
      onPress={() => handleSelectPlace(item)}
    >
      <View style={styles.resultContent}>
        <Text style={styles.placeName}>{item.prgramSj || '제목 없음'}</Text>
        <Text style={styles.placeAddress}>{item.actPlace || '장소 정보 없음'}</Text>
        <View style={styles.infoRow}>
          <Text style={styles.placeCategory}>{item.nanmmbyNm || '기관 정보 없음'}</Text>
          <Text style={styles.dateInfo}>
            {formatDisplayDate(item.actBeginDe)} ~ {formatDisplayDate(item.actEndDe)}
          </Text>
        </View>
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>{item.progrmSttusSe || '상태 정보 없음'}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#666" />
    </TouchableOpacity>
  );

  const renderRecentSearch = ({ item }: { item: string }) => (
    <TouchableOpacity 
      style={styles.recentItem}
      onPress={() => {
        setSearchQuery(item);
        handleSearch(item);
      }}
    >
      <Ionicons name="time-outline" size={20} color="#666" />
      <Text style={styles.recentText}>{item}</Text>
      <TouchableOpacity 
        onPress={() => {
          setRecentSearches(prev => prev.filter(search => search !== item));
          AsyncStorage.setItem(
            RECENT_SEARCHES_KEY, 
            JSON.stringify(recentSearches.filter(search => search !== item))
          );
        }}
        style={styles.removeButton}
      >
        <Ionicons name="close" size={20} color="#666" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      
      {/* 검색 헤더 */}
      <View style={styles.searchHeader}>
        <TouchableOpacity 
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="봉사활동 검색 (제목, 장소, 기관명)"
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
            }}
            onSubmitEditing={() => handleSearch(searchQuery)}
            returnKeyType="search"
            autoFocus
          />
          {searchQuery ? (
            <TouchableOpacity
              onPress={() => {
                setSearchQuery('');
                setSearchResults([]);
                Keyboard.dismiss();
              }}
            >
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* 검색 결과 */}
      {isLoading ? (
        <ActivityIndicator style={styles.loading} size="large" color="#FF6B00" />
      ) : searchQuery ? (
        <FlatList
          data={searchResults}
          renderItem={renderSearchResult}
          keyExtractor={item => item.progrmRegistNo}
          ListEmptyComponent={
            <View style={styles.emptyResult}>
              <Ionicons name="search-outline" size={48} color="#ccc" />
              <Text style={styles.emptyText}>검색 결과가 없습니다.</Text>
              <Text style={styles.emptySubText}>다른 키워드로 검색해보세요.</Text>
            </View>
          }
        />
      ) : (
        <FlatList
          data={recentSearches}
          renderItem={renderRecentSearch}
          keyExtractor={(item, index) => index.toString()}
          ListHeaderComponent={
            recentSearches.length > 0 ? (
              <View style={styles.recentHeader}>
                <Text style={styles.recentTitle}>최근 검색어</Text>
                <TouchableOpacity 
                  onPress={() => {
                    setRecentSearches([]);
                    AsyncStorage.removeItem(RECENT_SEARCHES_KEY);
                  }}
                >
                  <Text style={styles.clearAll}>전체 삭제</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.searchTipsContainer}>
                <Text style={styles.searchTipsTitle}>검색 도움말</Text>
                <Text style={styles.searchTip}>• 봉사활동 제목으로 검색해보세요.</Text>
                <Text style={styles.searchTip}>• 봉사활동 장소나 지역명으로 검색해보세요.</Text>
                <Text style={styles.searchTip}>• 봉사 기관명으로 검색해보세요.</Text>
              </View>
            )
          }
          ListEmptyComponent={
            recentSearches.length === 0 ? null : (
              <View style={styles.emptyResult}>
                <Text style={styles.emptyText}>최근 검색 내역이 없습니다.</Text>
              </View>
            )
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 5,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginLeft: 10,
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    marginLeft: 10,
    fontSize: 16,
  },
  loading: {
    marginTop: 20,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  resultContent: {
    flex: 1,
  },
  placeName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  placeAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  placeCategory: {
    fontSize: 13,
    color: '#0078FF',
  },
  dateInfo: {
    fontSize: 12,
    color: '#888',
  },
  statusContainer: {
    marginTop: 4,
  },
  statusText: {
    fontSize: 12,
    color: '#FF6B00',
    fontWeight: '500',
  },
  emptyResult: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  emptySubText: {
    marginTop: 5,
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  recentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  clearAll: {
    fontSize: 14,
    color: '#FF6B00',
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  recentText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  removeButton: {
    padding: 5,
  },
  searchTipsContainer: {
    padding: 20,
    backgroundColor: '#f9f9f9',
    marginBottom: 10,
  },
  searchTipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  searchTip: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
}); 