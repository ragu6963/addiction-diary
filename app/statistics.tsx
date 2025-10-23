import { ThemedView } from "@/components/themed-view";
import { useStyles, useTheme } from "@/hooks/use-styles";
import { createStatisticsStyles } from "@/styles/statistics.styles";
import {
  calculateLongestStreak,
  calculateStreakDays,
  getAlcoholStatistics,
  loadCombinedRecords,
  loadRecordData,
} from "@/utils/dataManager";
import { Card, Text } from "@rneui/themed";
import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { FlatList } from "react-native";

const StatisticsScreen = memo(() => {
  const theme = useTheme();
  const styles = useStyles(createStatisticsStyles);

  // 금욕 통계
  const [addictionTotalDays, setAddictionTotalDays] = useState(0);
  const [addictionTotalRecords, setAddictionTotalRecords] = useState(0);
  const [addictionCurrentStreak, setAddictionCurrentStreak] = useState(0);
  const [addictionLongestStreak, setAddictionLongestStreak] = useState(0);
  const [addictionThisWeek, setAddictionThisWeek] = useState(0);
  const [addictionThisMonth, setAddictionThisMonth] = useState(0);

  // 금주 통계
  const [alcoholTotalDays, setAlcoholTotalDays] = useState(0);
  const [alcoholTotalRecords, setAlcoholTotalRecords] = useState(0);
  const [alcoholCurrentStreak, setAlcoholCurrentStreak] = useState(0);
  const [alcoholLongestStreak, setAlcoholLongestStreak] = useState(0);
  const [alcoholThisWeek, setAlcoholThisWeek] = useState(0);
  const [alcoholThisMonth, setAlcoholThisMonth] = useState(0);
  const [alcoholTotalContent, setAlcoholTotalContent] = useState(0);
  const [alcoholTotalVolume, setAlcoholTotalVolume] = useState(0);

  // 전체 통계
  const [totalCombinedDays, setTotalCombinedDays] = useState(0);
  const [totalCombinedRecords, setTotalCombinedRecords] = useState(0);

  const loadStatistics = useCallback(async () => {
    try {
      const [addictionData, alcoholStats, combinedData] = await Promise.all([
        loadRecordData(),
        getAlcoholStatistics(),
        loadCombinedRecords(),
      ]);

      const now = new Date();
      const thisMonth = `${now.getFullYear()}-${(now.getMonth() + 1)
        .toString()
        .padStart(2, "0")}`;

      // 이번 주 범위 계산
      const startOfWeek = new Date(now);
      const day = startOfWeek.getDay();
      const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
      startOfWeek.setDate(diff);
      startOfWeek.setHours(0, 0, 0, 0);

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);

      // 금욕 통계 계산
      const addictionDates = Object.keys(addictionData);
      const addictionTotalCount = Object.values(addictionData).reduce(
        (sum, data) => sum + data.count,
        0
      );
      const addictionThisMonthCount = addictionDates
        .filter((date) => date.startsWith(thisMonth))
        .reduce((sum, date) => sum + addictionData[date].count, 0);
      const addictionThisWeekCount = addictionDates
        .filter((dateStr) => {
          const date = new Date(dateStr);
          return date >= startOfWeek && date <= endOfWeek;
        })
        .reduce((sum, date) => sum + addictionData[date].count, 0);

      setAddictionTotalDays(addictionDates.length);
      setAddictionTotalRecords(addictionTotalCount);
      setAddictionCurrentStreak(calculateStreakDays(addictionDates));
      setAddictionLongestStreak(calculateLongestStreak(addictionDates));
      setAddictionThisWeek(addictionThisWeekCount);
      setAddictionThisMonth(addictionThisMonthCount);

      // 새로운 음주 통계 설정
      setAlcoholTotalDays(alcoholStats.totalDays);
      setAlcoholTotalRecords(alcoholStats.totalRecords);
      setAlcoholCurrentStreak(alcoholStats.currentStreak);
      setAlcoholLongestStreak(alcoholStats.longestStreak);
      setAlcoholThisWeek(alcoholStats.thisWeekRecords);
      setAlcoholThisMonth(alcoholStats.thisMonthRecords);
      setAlcoholTotalContent(alcoholStats.totalAlcoholContent);
      setAlcoholTotalVolume(alcoholStats.totalVolume);

      // 전체 통합 통계
      setTotalCombinedDays(combinedData.totalDays);
      setTotalCombinedRecords(combinedData.totalRecords);
    } catch (error) {
      console.error("통계 로드 실패:", error);
    }
  }, []);

  useEffect(() => {
    loadStatistics();
  }, [loadStatistics]);

  const getStreakColor = useCallback(
    (streak: number) => {
      if (streak === 0) return theme.colors.error;
      if (streak < 3) return theme.colors.warning;
      if (streak < 7) return theme.colors.info;
      return theme.colors.success;
    },
    [theme.colors]
  );

  const getStreakMessage = useCallback((streak: number) => {
    if (streak === 0) return "새로운 시작이에요! 💪";
    if (streak < 3) return "좋은 시작이에요! 🌱";
    if (streak < 7) return "꾸준히 하고 있어요! 🌟";
    if (streak < 30) return "정말 대단해요! 🎉";
    return "놀라운 성취입니다! 🏆";
  }, []);

  // 통계 카드 데이터
  const statisticsData = useMemo(
    () => [
      {
        id: "overall",
        component: (
          <Card containerStyle={styles.cardContainer}>
            <Text h4 style={styles.sectionTitle}>
              전체 통계
            </Text>
            <ThemedView style={styles.statsRow}>
              <Text style={styles.statLabel}>총 기록 일수</Text>
              <Text style={styles.statValue}>{totalCombinedDays}일</Text>
            </ThemedView>
            <ThemedView style={styles.statsRow}>
              <Text style={styles.statLabel}>총 기록 횟수</Text>
              <Text style={styles.statValue}>{totalCombinedRecords}회</Text>
            </ThemedView>
          </Card>
        ),
      },
      {
        id: "streak-comparison",
        component: (
          <Card containerStyle={styles.cardContainer}>
            <Text h4 style={styles.sectionTitle}>
              연속 현황
            </Text>
            <ThemedView
              style={[
                styles.streakComparisonContainer,
                { backgroundColor: "transparent" },
              ]}
            >
              <ThemedView
                style={[
                  styles.streakComparisonColumn,
                  { backgroundColor: "transparent" },
                ]}
              >
                <Text
                  h4
                  style={[
                    styles.streakComparisonTitle,
                    { color: theme.appColors.addiction.primary },
                  ]}
                >
                  🔴 금욕
                </Text>
                <ThemedView style={styles.streakDisplay}>
                  <Text
                    style={[
                      styles.streakNumber,
                      { color: getStreakColor(addictionCurrentStreak) },
                    ]}
                  >
                    {addictionCurrentStreak}일
                  </Text>
                  <Text style={styles.streakMessage}>
                    {getStreakMessage(addictionCurrentStreak)}
                  </Text>
                </ThemedView>
                <ThemedView style={styles.statsRow}>
                  <Text style={styles.statLabel}>최장 연속</Text>
                  <Text
                    style={[
                      styles.statValue,
                      { color: getStreakColor(addictionLongestStreak) },
                    ]}
                  >
                    {addictionLongestStreak}일
                  </Text>
                </ThemedView>
              </ThemedView>

              <ThemedView
                style={[
                  styles.streakComparisonColumn,
                  { backgroundColor: "transparent" },
                ]}
              >
                <Text
                  h4
                  style={[
                    styles.streakComparisonTitle,
                    { color: theme.appColors.alcohol.primary },
                  ]}
                >
                  🟠 금주
                </Text>
                <ThemedView style={styles.streakDisplay}>
                  <Text
                    style={[
                      styles.streakNumber,
                      { color: getStreakColor(alcoholCurrentStreak) },
                    ]}
                  >
                    {alcoholCurrentStreak}일
                  </Text>
                  <Text style={styles.streakMessage}>
                    {getStreakMessage(alcoholCurrentStreak)}
                  </Text>
                </ThemedView>
                <ThemedView style={styles.statsRow}>
                  <Text style={styles.statLabel}>최장 연속</Text>
                  <Text
                    style={[
                      styles.statValue,
                      { color: getStreakColor(alcoholLongestStreak) },
                    ]}
                  >
                    {alcoholLongestStreak}일
                  </Text>
                </ThemedView>
              </ThemedView>
            </ThemedView>
          </Card>
        ),
      },
      {
        id: "type-comparison",
        component: (
          <Card containerStyle={styles.cardContainer}>
            <Text h4 style={styles.sectionTitle}>
              타입별 비교
            </Text>
            <ThemedView
              style={[
                styles.comparisonContainer,
                { backgroundColor: "transparent" },
              ]}
            >
              <ThemedView
                style={[
                  styles.comparisonColumn,
                  { backgroundColor: "transparent" },
                ]}
              >
                <Text
                  style={[
                    styles.comparisonTitle,
                    { color: theme.appColors.addiction.primary },
                  ]}
                >
                  🔴 금욕 기록
                </Text>
                <ThemedView style={styles.statsRow}>
                  <Text style={styles.statLabel}>기록 일수</Text>
                  <Text style={styles.statValue}>{addictionTotalDays}일</Text>
                </ThemedView>
                <ThemedView style={styles.statsRow}>
                  <Text style={styles.statLabel}>기록 횟수</Text>
                  <Text style={styles.statValue}>
                    {addictionTotalRecords}회
                  </Text>
                </ThemedView>
              </ThemedView>

              <ThemedView
                style={[
                  styles.comparisonColumn,
                  { backgroundColor: "transparent" },
                ]}
              >
                <Text
                  style={[
                    styles.comparisonTitle,
                    { color: theme.appColors.alcohol.primary },
                  ]}
                >
                  🟠 금주 기록
                </Text>
                <ThemedView style={styles.statsRow}>
                  <Text style={styles.statLabel}>기록 일수</Text>
                  <Text style={styles.statValue}>{alcoholTotalDays}일</Text>
                </ThemedView>
                <ThemedView style={styles.statsRow}>
                  <Text style={styles.statLabel}>기록 횟수</Text>
                  <Text style={styles.statValue}>{alcoholTotalRecords}회</Text>
                </ThemedView>
                <ThemedView style={styles.statsRow}>
                  <Text style={styles.statLabel}>총 알코올 함량</Text>
                  <Text style={styles.statValue}>
                    {alcoholTotalContent.toFixed(1)}g
                  </Text>
                </ThemedView>
                <ThemedView style={styles.statsRow}>
                  <Text style={styles.statLabel}>총 음주량</Text>
                  <Text style={styles.statValue}>
                    {alcoholTotalVolume.toFixed(0)}ml
                  </Text>
                </ThemedView>
              </ThemedView>
            </ThemedView>
          </Card>
        ),
      },
      {
        id: "recent",
        component: (
          <Card containerStyle={styles.cardContainer}>
            <Text h4 style={styles.sectionTitle}>
              최근 통계
            </Text>
            <ThemedView
              style={[
                styles.recentStatsContainer,
                { backgroundColor: "transparent" },
              ]}
            >
              <ThemedView
                style={[
                  styles.recentStatsColumn,
                  { backgroundColor: "transparent" },
                ]}
              >
                <Text
                  style={[
                    styles.recentStatsTitle,
                    { color: theme.appColors.addiction.primary },
                  ]}
                >
                  🔴 금욕 기록
                </Text>
                <ThemedView style={styles.statsRow}>
                  <Text style={styles.statLabel}>이번 주</Text>
                  <Text
                    style={[
                      styles.statValue,
                      {
                        color:
                          addictionThisWeek === 0
                            ? theme.colors.success
                            : theme.colors.secondary,
                      },
                    ]}
                  >
                    {addictionThisWeek}회
                  </Text>
                </ThemedView>
                <ThemedView style={styles.statsRow}>
                  <Text style={styles.statLabel}>이번 달</Text>
                  <Text
                    style={[
                      styles.statValue,
                      {
                        color:
                          addictionThisMonth === 0
                            ? theme.colors.success
                            : theme.colors.secondary,
                      },
                    ]}
                  >
                    {addictionThisMonth}회
                  </Text>
                </ThemedView>
              </ThemedView>

              <ThemedView
                style={[
                  styles.recentStatsColumn,
                  { backgroundColor: "transparent" },
                ]}
              >
                <Text
                  style={[
                    styles.recentStatsTitle,
                    { color: theme.appColors.alcohol.primary },
                  ]}
                >
                  🟠 금주 기록
                </Text>
                <ThemedView style={styles.statsRow}>
                  <Text style={styles.statLabel}>이번 주</Text>
                  <Text
                    style={[
                      styles.statValue,
                      {
                        color:
                          alcoholThisWeek === 0
                            ? theme.colors.success
                            : theme.colors.secondary,
                      },
                    ]}
                  >
                    {alcoholThisWeek}회
                  </Text>
                </ThemedView>
                <ThemedView style={styles.statsRow}>
                  <Text style={styles.statLabel}>이번 달</Text>
                  <Text
                    style={[
                      styles.statValue,
                      {
                        color:
                          alcoholThisMonth === 0
                            ? theme.colors.success
                            : theme.colors.secondary,
                      },
                    ]}
                  >
                    {alcoholThisMonth}회
                  </Text>
                </ThemedView>
              </ThemedView>
            </ThemedView>
          </Card>
        ),
      },
      ...(totalCombinedRecords === 0
        ? [
            {
              id: "empty",
              component: (
                <Card containerStyle={styles.cardContainer}>
                  <Text style={styles.noDataText}>
                    아직 기록된 데이터가 없습니다.{"\n"}
                    달력에서 기록을 추가해보세요!
                  </Text>
                </Card>
              ),
            },
          ]
        : []),
    ],
    [
      addictionCurrentStreak,
      addictionLongestStreak,
      addictionTotalDays,
      addictionTotalRecords,
      addictionThisWeek,
      addictionThisMonth,
      alcoholCurrentStreak,
      alcoholLongestStreak,
      alcoholTotalDays,
      alcoholTotalRecords,
      alcoholThisWeek,
      alcoholThisMonth,
      totalCombinedDays,
      totalCombinedRecords,
      theme.colors,
      styles,
      getStreakColor,
      getStreakMessage,
    ]
  );

  // 카드 렌더링 함수
  const renderCard = useCallback(
    ({ item }: { item: any }) => item.component,
    []
  );

  // 키 추출 함수
  const keyExtractor = useCallback((item: any) => item.id, []);

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      data={statisticsData}
      renderItem={renderCard}
      keyExtractor={keyExtractor}
      showsVerticalScrollIndicator={false}
      removeClippedSubviews={true}
      maxToRenderPerBatch={5}
      windowSize={5}
      initialNumToRender={5}
      updateCellsBatchingPeriod={50}
      getItemLayout={(data, index) => ({
        length: 200, // 예상 카드 높이
        offset: 200 * index,
        index,
      })}
    />
  );
});

StatisticsScreen.displayName = "StatisticsScreen";

export default StatisticsScreen;
