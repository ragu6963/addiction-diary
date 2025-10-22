import { ThemedView } from "@/components/themed-view";
import { useTheme } from "@/hooks/use-styles";
import { createStatisticsStyles } from "@/styles/statistics.styles";
import {
  calculateLongestStreak,
  calculateStreakDays,
  loadRecordData,
} from "@/utils/dataManager";
import { Card, Text } from "@rneui/themed";
import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { FlatList } from "react-native";

const StatisticsScreen = memo(() => {
  const theme = useTheme();
  const styles = createStatisticsStyles(theme);

  const [totalRecordedDays, setTotalRecordedDays] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [averagePerDay, setAveragePerDay] = useState(0);
  const [thisMonthRecords, setThisMonthRecords] = useState(0);
  const [thisWeekRecords, setThisWeekRecords] = useState(0);

  const loadStatistics = useCallback(async () => {
    try {
      const recordData = await loadRecordData();
      const dates = Object.keys(recordData);

      if (dates.length === 0) {
        // 모든 상태를 0으로 초기화
        setTotalRecordedDays(0);
        setTotalRecords(0);
        setCurrentStreak(0);
        setLongestStreak(0);
        setAveragePerDay(0);
        setThisMonthRecords(0);
        setThisWeekRecords(0);
        return;
      }

      // 기본 통계
      const totalRecordsCount = Object.values(recordData).reduce(
        (sum, data) => sum + data.count,
        0
      );

      setTotalRecordedDays(dates.length);
      setTotalRecords(totalRecordsCount);
      setCurrentStreak(calculateStreakDays(dates));
      setLongestStreak(calculateLongestStreak(dates));
      setAveragePerDay(totalRecordsCount / dates.length);

      // 이번 달 통계
      const now = new Date();
      const thisMonth = `${now.getFullYear()}-${(now.getMonth() + 1)
        .toString()
        .padStart(2, "0")}`;
      const thisMonthCount = Object.keys(recordData)
        .filter((date) => date.startsWith(thisMonth))
        .reduce((sum, date) => sum + recordData[date].count, 0);
      setThisMonthRecords(thisMonthCount);

      // 이번 주 통계
      const startOfWeek = new Date(now);
      const day = startOfWeek.getDay();
      const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // 월요일부터 시작
      startOfWeek.setDate(diff);
      startOfWeek.setHours(0, 0, 0, 0);

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);

      const thisWeekCount = Object.keys(recordData)
        .filter((dateStr) => {
          const date = new Date(dateStr);
          return date >= startOfWeek && date <= endOfWeek;
        })
        .reduce((sum, date) => sum + recordData[date].count, 0);
      setThisWeekRecords(thisWeekCount);
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
        id: "streak",
        component: (
          <Card containerStyle={styles.cardContainer}>
            <Text h4 style={styles.sectionTitle}>
              연속 금욕 현황
            </Text>
            <ThemedView style={styles.streakDisplay}>
              <Text
                style={[
                  styles.streakNumber,
                  { color: getStreakColor(currentStreak) },
                ]}
              >
                {currentStreak}일
              </Text>
              <Text style={styles.streakMessage}>
                {getStreakMessage(currentStreak)}
              </Text>
            </ThemedView>
            <ThemedView style={styles.statsRow}>
              <Text style={styles.statLabel}>최장 연속 금욕</Text>
              <Text
                style={[
                  styles.statValue,
                  { color: getStreakColor(longestStreak) },
                ]}
              >
                {longestStreak}일
              </Text>
            </ThemedView>
          </Card>
        ),
      },
      {
        id: "overall",
        component: (
          <Card containerStyle={styles.cardContainer}>
            <Text h4 style={styles.sectionTitle}>
              전체 통계
            </Text>
            <ThemedView style={styles.statsRow}>
              <Text style={styles.statLabel}>총 기록 일수</Text>
              <Text style={styles.statValue}>{totalRecordedDays}일</Text>
            </ThemedView>
            <ThemedView style={styles.statsRow}>
              <Text style={styles.statLabel}>총 기록 횟수</Text>
              <Text style={styles.statValue}>{totalRecords}회</Text>
            </ThemedView>
            {totalRecordedDays > 0 && (
              <ThemedView style={styles.statsRow}>
                <Text style={styles.statLabel}>일평균 기록</Text>
                <Text style={styles.statValue}>
                  {averagePerDay.toFixed(1)}회
                </Text>
              </ThemedView>
            )}
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
            <ThemedView style={styles.statsRow}>
              <Text style={styles.statLabel}>이번 주 기록</Text>
              <Text
                style={[
                  styles.statValue,
                  {
                    color:
                      thisWeekRecords === 0
                        ? theme.colors.success
                        : theme.colors.secondary,
                  },
                ]}
              >
                {thisWeekRecords}회
              </Text>
            </ThemedView>
            <ThemedView style={styles.statsRow}>
              <Text style={styles.statLabel}>이번 달 기록</Text>
              <Text
                style={[
                  styles.statValue,
                  {
                    color:
                      thisMonthRecords === 0
                        ? theme.colors.success
                        : theme.colors.secondary,
                  },
                ]}
              >
                {thisMonthRecords}회
              </Text>
            </ThemedView>
          </Card>
        ),
      },
      {
        id: "goal",
        component: (
          <Card containerStyle={styles.cardContainer}>
            <Text h4 style={styles.sectionTitle}>
              목표 달성도
            </Text>
            <ThemedView style={styles.goalSection}>
              <Text style={styles.goalTitle}>다음 목표까지</Text>
              {currentStreak < 1 && (
                <Text style={styles.goalText}>
                  1일 연속 금욕까지 {1 - currentStreak}일 남았어요!
                </Text>
              )}
              {currentStreak >= 1 && currentStreak < 3 && (
                <Text style={styles.goalText}>
                  3일 연속 금욕까지 {3 - currentStreak}일 남았어요!
                </Text>
              )}
              {currentStreak >= 3 && currentStreak < 7 && (
                <Text style={styles.goalText}>
                  7일 연속 금욕까지 {7 - currentStreak}일 남았어요!
                </Text>
              )}
              {currentStreak >= 7 && (
                <Text style={styles.goalText}>
                  놀라운 성취입니다! 계속 유지해보세요! 🌟
                </Text>
              )}
            </ThemedView>
          </Card>
        ),
      },
      ...(totalRecordedDays === 0
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
      currentStreak,
      longestStreak,
      totalRecordedDays,
      totalRecords,
      averagePerDay,
      thisWeekRecords,
      thisMonthRecords,
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
