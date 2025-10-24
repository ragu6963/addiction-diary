import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useTheme } from "@/hooks/use-styles";
import { createStatisticsStyles } from "@/styles/statistics.styles";
import {
  calculateLongestStreak,
  calculateStreakDays,
  getAlcoholStatistics,
  loadRecordData,
} from "@/utils/dataManager";
import React, { memo, useCallback, useEffect, useState } from "react";
import { ScrollView, View } from "react-native";

const StatisticsScreen = memo(() => {
  const theme = useTheme();
  const styles = createStatisticsStyles(theme);

  // 금욕 통계
  const [addictionCurrentStreak, setAddictionCurrentStreak] = useState(0);
  const [addictionLongestStreak, setAddictionLongestStreak] = useState(0);
  const [addictionTotalRecords, setAddictionTotalRecords] = useState(0);
  const [addictionTotalDays, setAddictionTotalDays] = useState(0);

  // 금주 통계
  const [alcoholCurrentStreak, setAlcoholCurrentStreak] = useState(0);
  const [alcoholLongestStreak, setAlcoholLongestStreak] = useState(0);
  const [alcoholTotalRecords, setAlcoholTotalRecords] = useState(0);
  const [alcoholTotalDays, setAlcoholTotalDays] = useState(0);
  const [alcoholTotalContent, setAlcoholTotalContent] = useState(0);
  const [alcoholTotalVolume, setAlcoholTotalVolume] = useState(0);

  const loadStatistics = useCallback(async () => {
    try {
      const [addictionData, alcoholStats] = await Promise.all([
        loadRecordData(),
        getAlcoholStatistics(),
      ]);

      // 금욕 통계
      const addictionDates = Object.keys(addictionData);
      setAddictionCurrentStreak(calculateStreakDays(addictionDates));
      setAddictionLongestStreak(calculateLongestStreak(addictionDates));
      setAddictionTotalRecords(
        Object.values(addictionData).reduce((sum, day) => sum + day.count, 0)
      );
      setAddictionTotalDays(addictionDates.length);

      // 금주 통계
      setAlcoholCurrentStreak(alcoholStats.currentStreak);
      setAlcoholLongestStreak(alcoholStats.longestStreak);
      setAlcoholTotalRecords(alcoholStats.totalRecords);
      setAlcoholTotalDays(alcoholStats.totalDays);
      setAlcoholTotalContent(alcoholStats.totalAlcoholContent);
      setAlcoholTotalVolume(alcoholStats.totalVolume);
    } catch (error) {
      console.error("통계 로드 실패:", error);
    }
  }, []);

  useEffect(() => {
    loadStatistics();
  }, [loadStatistics]);

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* 금욕 통계 */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>🔴 금욕</ThemedText>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <ThemedText style={styles.statValue}>
                {addictionCurrentStreak}
              </ThemedText>
              <ThemedText style={styles.statLabel}>현재 연속일</ThemedText>
            </View>
            <View style={styles.statCard}>
              <ThemedText style={styles.statValue}>
                {addictionLongestStreak}
              </ThemedText>
              <ThemedText style={styles.statLabel}>최장 연속일</ThemedText>
            </View>
            <View style={styles.statCard}>
              <ThemedText style={styles.statValue}>
                {addictionTotalRecords}
              </ThemedText>
              <ThemedText style={styles.statLabel}>총 기록 수</ThemedText>
            </View>
            <View style={styles.statCard}>
              <ThemedText style={styles.statValue}>
                {addictionTotalDays}
              </ThemedText>
              <ThemedText style={styles.statLabel}>기록 일수</ThemedText>
            </View>
          </View>
        </View>

        {/* 금주 통계 */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>🍺 금주</ThemedText>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <ThemedText style={styles.statValue}>
                {alcoholCurrentStreak}
              </ThemedText>
              <ThemedText style={styles.statLabel}>현재 연속일</ThemedText>
            </View>
            <View style={styles.statCard}>
              <ThemedText style={styles.statValue}>
                {alcoholLongestStreak}
              </ThemedText>
              <ThemedText style={styles.statLabel}>최장 연속일</ThemedText>
            </View>
            <View style={styles.statCard}>
              <ThemedText style={styles.statValue}>
                {alcoholTotalRecords}
              </ThemedText>
              <ThemedText style={styles.statLabel}>총 기록 수</ThemedText>
            </View>
            <View style={styles.statCard}>
              <ThemedText style={styles.statValue}>
                {alcoholTotalDays}
              </ThemedText>
              <ThemedText style={styles.statLabel}>기록 일수</ThemedText>
            </View>
          </View>
        </View>

        {/* 음주 상세 통계 */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>🍻 음주 상세</ThemedText>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <ThemedText style={styles.statValue}>
                {alcoholTotalVolume.toFixed(0)}
              </ThemedText>
              <ThemedText style={styles.statLabel}>총 음주량 (ml)</ThemedText>
            </View>
            <View style={styles.statCard}>
              <ThemedText style={styles.statValue}>
                {alcoholTotalContent.toFixed(1)}
              </ThemedText>
              <ThemedText style={styles.statLabel}>
                총 알코올 함량 (g)
              </ThemedText>
            </View>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
});

StatisticsScreen.displayName = "StatisticsScreen";

export default StatisticsScreen;
