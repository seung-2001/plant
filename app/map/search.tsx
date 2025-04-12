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
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// 임시 데이터 - 나중에 실제 API로 대체
const DUMMY_PLACES = [
  {
    id: '1',
    name: '서울시립미술관',
    address: '서울특별시 중구 덕수궁길 61',
    category: '문화시설',
  },
  {
    id: '2',
    name: '서울숲',
    address: '서울특별시 성동구 뚝섬로 273',
    category: '공원',
  },
];

export default function SearchScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);

  // 검색 함수
  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    try {
      // TODO: 실제 API 호출로 대체
      // 임시로 더미 데이터에서 필터링
      const results = DUMMY_PLACES.filter(
        place => 
          place.name.toLowerCase().includes(query.toLowerCase()) ||
          place.address.toLowerCase().includes(query.toLowerCase())
      );
      
      setSearchResults(results);
      
      // 최근 검색어 저장
      if (!recentSearches.includes(query)) {
        setRecentSearches(prev => [query, ...prev].slice(0, 5));
      }
    } catch (error) {
      console.error('검색 중 오류 발생:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 장소 선택 처리
  const handleSelectPlace = (place) => {
    // TODO: 선택한 장소의 좌표로 지도 이동
    router.push({
      pathname: '/(tabs)/map',
      params: { 
        selectedPlace: JSON.stringify(place)
      }
    });
  };

  const renderSearchResult = ({ item }) => (
    <TouchableOpacity 
      style={styles.resultItem}
      onPress={() => handleSelectPlace(item)}
    >
      <View style={styles.resultContent}>
        <Text style={styles.placeName}>{item.name}</Text>
        <Text style={styles.placeAddress}>{item.address}</Text>
        <Text style={styles.placeCategory}>{item.category}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#666" />
    </TouchableOpacity>
  );

  const renderRecentSearch = ({ item }) => (
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
            placeholder="장소, 주소 검색"
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              handleSearch(text);
            }}
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
        <ActivityIndicator style={styles.loading} size="large" color="#0000ff" />
      ) : searchQuery ? (
        <FlatList
          data={searchResults}
          renderItem={renderSearchResult}
          keyExtractor={item => item.id}
          ListEmptyComponent={
            <View style={styles.emptyResult}>
              <Text style={styles.emptyText}>검색 결과가 없습니다.</Text>
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
                <TouchableOpacity onPress={() => setRecentSearches([])}>
                  <Text style={styles.clearAll}>전체 삭제</Text>
                </TouchableOpacity>
              </View>
            ) : null
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
    marginBottom: 2,
  },
  placeCategory: {
    fontSize: 12,
    color: '#999',
  },
  emptyResult: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
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
  },
  clearAll: {
    fontSize: 14,
    color: '#666',
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
    fontSize: 16,
    marginLeft: 10,
  },
  removeButton: {
    padding: 5,
  },
}); 