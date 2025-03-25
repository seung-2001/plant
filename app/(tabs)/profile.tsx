// 프로필 화면 컴포넌트
// - 사용자 정보 표시
// - 봉사 활동 통계 표시
// - 봉사 활동 기록 목록 표시

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// 프로필 화면 컴포넌트
export default function ProfileScreen() {
  // 사용자 정보
  const user = {
    name: "김봉사",
    email: "volunteer@example.com",
    profileImage: "https://via.placeholder.com/100",
  };

  // 봉사 활동 통계
  const stats = {
    totalHours: 120,
    totalActivities: 15,
    completedActivities: 12,
  };

  // 봉사 활동 기록
  const activities = [
    {
      id: "1",
      title: "서울시립어린이집 봉사활동",
      date: "2024-03-15",
      hours: 4,
      status: "완료",
    },
    {
      id: "2",
      title: "강남구립어린이집 봉사활동",
      date: "2024-03-10",
      hours: 3,
      status: "완료",
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* 프로필 헤더 */}
      <View style={styles.header}>
        <Image source={{ uri: user.profileImage }} style={styles.profileImage} />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
        </View>
      </View>

      {/* 통계 섹션 */}
      <View style={styles.statsSection}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.totalHours}</Text>
          <Text style={styles.statLabel}>총 봉사시간</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.totalActivities}</Text>
          <Text style={styles.statLabel}>참여활동</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.completedActivities}</Text>
          <Text style={styles.statLabel}>완료활동</Text>
        </View>
      </View>

      {/* 봉사 활동 기록 */}
      <View style={styles.activitiesSection}>
        <Text style={styles.sectionTitle}>봉사 활동 기록</Text>
        {activities.map((activity) => (
          <TouchableOpacity key={activity.id} style={styles.activityItem}>
            <View style={styles.activityInfo}>
              <Text style={styles.activityTitle}>{activity.title}</Text>
              <Text style={styles.activityDate}>{activity.date}</Text>
            </View>
            <View style={styles.activityMeta}>
              <Text style={styles.activityHours}>{activity.hours}시간</Text>
              <Text style={styles.activityStatus}>{activity.status}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

// 스타일 정의
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: "#666",
  },
  statsSection: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FF9500",
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
  },
  activitiesSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  activityItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    marginBottom: 10,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    marginBottom: 5,
  },
  activityDate: {
    fontSize: 14,
    color: "#666",
  },
  activityMeta: {
    alignItems: "flex-end",
  },
  activityHours: {
    fontSize: 16,
    color: "#FF9500",
    marginBottom: 5,
  },
  activityStatus: {
    fontSize: 14,
    color: "#4CAF50",
  },
}); 
}); 