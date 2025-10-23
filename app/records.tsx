import { ThemedView } from "@/components/themed-view";
import { useStyles, useTheme } from "@/hooks/use-styles";
import { createRecordsStyles } from "@/styles/records.styles";
import {
  clearAllCombinedRecords,
  CombinedRecordItem,
  deleteCombinedRecord,
  loadCombinedRecords,
} from "@/utils/dataManager";
import { Button, Card, Text } from "@rneui/themed";
import React, { memo, useCallback, useEffect, useState } from "react";
import { Alert, FlatList, TouchableOpacity } from "react-native";

const RecordsScreen = memo(() => {
  const theme = useTheme();
  const styles = useStyles(createRecordsStyles);

  const [records, setRecords] = useState<CombinedRecordItem[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalDays, setTotalDays] = useState(0);
  const [addictionRecords, setAddictionRecords] = useState(0);
  const [alcoholRecords, setAlcoholRecords] = useState(0);
  const [addictionDays, setAddictionDays] = useState(0);
  const [alcoholDays, setAlcoholDays] = useState(0);
  const loadRecords = useCallback(async () => {
    try {
      const data = await loadCombinedRecords();

      setRecords(data.records);
      setTotalRecords(data.totalRecords);
      setTotalDays(data.totalDays);
      setAddictionRecords(data.addictionRecords);
      setAlcoholRecords(data.alcoholRecords);
      setAddictionDays(data.addictionDays);
      setAlcoholDays(data.alcoholDays);
    } catch (error) {
      console.error("기록 로드 실패:", error);
    }
  }, []);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  const onDeleteRecord = useCallback(
    (recordId: string, date: string, type: "addiction" | "alcohol") => {
      const typeText = type === "addiction" ? "금욕" : "금주";
      Alert.alert("기록 삭제", `이 ${typeText} 기록을 삭제하시겠습니까?`, [
        { text: "취소", style: "cancel" },
        {
          text: "삭제",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteCombinedRecord(recordId, date, type);
              await loadRecords();
              Alert.alert("완료", "기록이 삭제되었습니다.");
            } catch (error) {
              console.error("기록 삭제 실패:", error);
              Alert.alert("오류", "기록 삭제 중 오류가 발생했습니다.");
            }
          },
        },
      ]);
    },
    [loadRecords]
  );

  const onResetPress = useCallback(() => {
    Alert.alert(
      "모든 기록 삭제",
      "모든 금욕/금주 기록을 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.",
      [
        { text: "취소", style: "cancel" },
        {
          text: "삭제",
          style: "destructive",
          onPress: async () => {
            try {
              await clearAllCombinedRecords();
              await loadRecords();
              Alert.alert("완료", "모든 기록이 삭제되었습니다.");
            } catch (error) {
              console.error("기록 초기화 실패:", error);
              Alert.alert("오류", "기록 초기화 중 오류가 발생했습니다.");
            }
          },
        },
      ]
    );
  }, [loadRecords]);

  // 기록 아이템 렌더링 함수
  const renderRecordItem = useCallback(
    ({ item }: { item: CombinedRecordItem }) => {
      const typeIcon = item.type === "addiction" ? "🔴" : "🟠";
      const typeText = item.type === "addiction" ? "금욕" : "금주";
      const typeColor =
        item.type === "addiction"
          ? theme.appColors.addiction.primary
          : theme.appColors.alcohol.primary;

      return (
        <ThemedView style={styles.listItem}>
          <ThemedView style={styles.recordInfo}>
            <ThemedView style={styles.recordHeader}>
              <Text style={[styles.recordType, { color: typeColor }]}>
                {typeIcon} {typeText}
              </Text>
              <Text style={styles.recordCount}>
                {item.count > 1 ? `${item.recordNumber}/${item.count}` : ""}
              </Text>
            </ThemedView>
            <Text style={styles.recordDate}>
              {item.formattedDate} {item.recordTime}
            </Text>
          </ThemedView>
          <ThemedView style={styles.recordActions}>
            <TouchableOpacity
              onPress={() => onDeleteRecord(item.id, item.date, item.type)}
            >
              <Text style={styles.deleteButtonText}>삭제</Text>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
      );
    },
    [onDeleteRecord, styles]
  );

  // 키 추출 함수
  const keyExtractor = useCallback((item: CombinedRecordItem) => item.id, []);

  // 빈 상태 렌더링 함수
  const renderEmptyComponent = useCallback(
    () => <Text style={styles.noDataText}>아직 기록된 데이터가 없습니다.</Text>,
    [styles.noDataText]
  );

  // 헤더 컴포넌트 (통계 정보)
  const renderHeader = useCallback(
    () => (
      <>
        <Card containerStyle={styles.cardContainer}>
          <ThemedView style={styles.typeStatsContainer}>
            <ThemedView style={styles.typeStatsColumn}>
              <Text
                style={[
                  styles.typeStatsTitle,
                  { color: theme.appColors.addiction.primary },
                ]}
              >
                🔴 금욕 기록
              </Text>
              <ThemedView style={styles.statsRow}>
                <Text style={styles.statLabel}>기록 일수</Text>
                <Text style={styles.statValue}>{addictionDays}일</Text>
              </ThemedView>
              <ThemedView style={styles.statsRow}>
                <Text style={styles.statLabel}>기록 횟수</Text>
                <Text style={styles.statValue}>{addictionRecords}회</Text>
              </ThemedView>
            </ThemedView>

            <ThemedView style={styles.typeStatsColumn}>
              <Text
                style={[
                  styles.typeStatsTitle,
                  { color: theme.appColors.alcohol.primary },
                ]}
              >
                🟠 금주 기록
              </Text>
              <ThemedView style={styles.statsRow}>
                <Text style={styles.statLabel}>기록 일수</Text>
                <Text style={styles.statValue}>{alcoholDays}일</Text>
              </ThemedView>
              <ThemedView style={styles.statsRow}>
                <Text style={styles.statLabel}>기록 횟수</Text>
                <Text style={styles.statValue}>{alcoholRecords}회</Text>
              </ThemedView>
            </ThemedView>
          </ThemedView>
        </Card>

        <Card containerStyle={styles.cardContainer}>
          <Button
            containerStyle={{ marginBottom: 16 }}
            title="모든 기록 삭제"
            onPress={onResetPress}
            buttonStyle={styles.deleteAllButton}
          />
        </Card>
      </>
    ),
    [
      totalDays,
      totalRecords,
      addictionDays,
      addictionRecords,
      alcoholDays,
      alcoholRecords,
      onResetPress,
      styles,
    ]
  );

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      data={records}
      renderItem={renderRecordItem}
      keyExtractor={keyExtractor}
      ListHeaderComponent={renderHeader}
      ListEmptyComponent={renderEmptyComponent}
      showsVerticalScrollIndicator={false}
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      windowSize={10}
      initialNumToRender={20}
      updateCellsBatchingPeriod={50}
      getItemLayout={(data, index) => ({
        length: 60, // 예상 아이템 높이
        offset: 60 * index,
        index,
      })}
    />
  );
});

RecordsScreen.displayName = "RecordsScreen";

export default RecordsScreen;

// 기존 스타일은 새로운 스타일 시스템으로 대체됨
