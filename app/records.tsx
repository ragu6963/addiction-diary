import { ThemedView } from "@/components/themed-view";
import { useTheme } from "@/hooks/use-styles";
import { createRecordsStyles } from "@/styles/records.styles";
import {
  clearAllRecords,
  deleteRecord,
  formatDate,
  loadRecordData,
} from "@/utils/dataManager";
import { Button, Card, Text } from "@rneui/themed";
import React, { memo, useCallback, useEffect, useState } from "react";
import { Alert, FlatList, TouchableOpacity } from "react-native";

interface RecordItem {
  id: string;
  date: string;
  formattedDate: string;
  recordTime: string;
  recordNumber: number;
  timestamp: string;
}

const RecordsScreen = memo(() => {
  const theme = useTheme();
  const styles = createRecordsStyles(theme);

  const [records, setRecords] = useState<RecordItem[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalDays, setTotalDays] = useState(0);
  const loadRecords = useCallback(async () => {
    try {
      const recordData = await loadRecordData();
      const allRecords: RecordItem[] = [];
      const uniqueDates = new Set<string>();

      Object.keys(recordData)
        .sort()
        .reverse() // 최신 날짜부터 표시
        .forEach((date) => {
          uniqueDates.add(date);
          const dayRecords = recordData[date].records || [];

          dayRecords
            .sort(
              (a, b) =>
                new Date(b.timestamp).getTime() -
                new Date(a.timestamp).getTime()
            ) // 최신 기록부터
            .forEach((record, index) => {
              allRecords.push({
                id: record.id,
                date,
                formattedDate: formatDate(date),
                recordTime: record.time,
                recordNumber: dayRecords.length - index, // 역순으로 번호 매기기
                timestamp: record.timestamp,
              });
            });
        });

      setRecords(allRecords);
      setTotalRecords(allRecords.length);
      setTotalDays(uniqueDates.size);
    } catch (error) {
      console.error("기록 로드 실패:", error);
    }
  }, []);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  const onDeleteRecord = useCallback(
    (recordId: string, date: string) => {
      Alert.alert("기록 삭제", "이 기록을 삭제하시겠습니까?", [
        { text: "취소", style: "cancel" },
        {
          text: "삭제",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteRecord(date, recordId);
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
      "모든 기록을 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.",
      [
        { text: "취소", style: "cancel" },
        {
          text: "삭제",
          style: "destructive",
          onPress: async () => {
            try {
              await clearAllRecords();
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
    ({ item }: { item: RecordItem }) => (
      <ThemedView style={styles.listItem}>
        <ThemedView style={styles.recordInfo}>
          <Text style={styles.recordDate}>
            {item.formattedDate} {item.recordTime}
          </Text>
        </ThemedView>
        <ThemedView style={styles.recordActions}>
          <TouchableOpacity onPress={() => onDeleteRecord(item.id, item.date)}>
            <Text style={styles.deleteButtonText}>삭제</Text>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    ),
    [onDeleteRecord, styles]
  );

  // 키 추출 함수
  const keyExtractor = useCallback((item: RecordItem) => item.id, []);

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
          <Text h4 style={styles.sectionTitle}>
            기록 현황
          </Text>
          <ThemedView style={styles.statsRow}>
            <Text style={styles.statLabel}>총 기록 일수</Text>
            <Text style={styles.statValue}>{totalDays}일</Text>
          </ThemedView>
          <ThemedView style={styles.statsRow}>
            <Text style={styles.statLabel}>총 기록 횟수</Text>
            <Text style={styles.statValue}>{totalRecords}회</Text>
          </ThemedView>
        </Card>

        <Card containerStyle={styles.cardContainer}>
          <Button
            containerStyle={{ marginBottom: 16 }}
            title="모든 기록 삭제"
            onPress={onResetPress}
          />
        </Card>
      </>
    ),
    [totalDays, totalRecords, onResetPress, styles]
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
