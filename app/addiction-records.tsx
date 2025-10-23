import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/hooks/use-styles";
import { createAddictionRecordsStyles } from "@/styles";
import {
  clearAllAddictionRecords,
  deleteAddictionRecord,
  loadRecordData,
} from "@/utils/dataManager";
import { Button } from "@rneui/themed";
import React, { memo, useCallback, useEffect, useState } from "react";
import { Alert, FlatList, TouchableOpacity, View } from "react-native";

interface AddictionRecordItem {
  id: string;
  date: string;
  time: string;
  formattedDate: string;
}

const AddictionRecordsScreen = memo(() => {
  const theme = useTheme();
  const styles = createAddictionRecordsStyles(theme);

  const [records, setRecords] = useState<AddictionRecordItem[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalDays, setTotalDays] = useState(0);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayOfWeek = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];
    return `${month}/${day} (${dayOfWeek})`;
  };

  const loadRecords = useCallback(async () => {
    try {
      const data = await loadRecordData();

      // 데이터를 날짜별로 그룹화하고 상세 정보 포함
      const recordList: AddictionRecordItem[] = [];

      Object.entries(data).forEach(([date, dayData]) => {
        dayData.records.forEach((record) => {
          recordList.push({
            id: record.id,
            date: date,
            time: record.time,
            formattedDate: formatDate(date),
          });
        });
      });

      // 최신 순으로 정렬
      const sortedRecords = recordList.sort((a, b) => {
        const dateA = new Date(`${a.date} ${a.time}`);
        const dateB = new Date(`${b.date} ${b.time}`);
        return dateB.getTime() - dateA.getTime();
      });

      setRecords(sortedRecords);
      setTotalRecords(recordList.length);
      setTotalDays(Object.keys(data).length);
    } catch (error) {
      console.error("금욕 기록 로드 실패:", error);
    }
  }, []);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  const onDeleteRecord = useCallback(
    (recordId: string, date: string) => {
      Alert.alert("기록 삭제", "이 금욕 기록을 삭제하시겠습니까?", [
        { text: "취소", style: "cancel" },
        {
          text: "삭제",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteAddictionRecord(recordId, date);
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
      "모든 금욕 기록 삭제",
      "모든 금욕 기록을 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.",
      [
        { text: "취소", style: "cancel" },
        {
          text: "삭제",
          style: "destructive",
          onPress: async () => {
            try {
              await clearAllAddictionRecords();
              await loadRecords();
              Alert.alert("완료", "모든 금욕 기록이 삭제되었습니다.");
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
    ({ item }: { item: AddictionRecordItem }) => {
      return (
        <View style={styles.recordItem}>
          <View style={styles.recordInfo}>
            <View style={styles.recordHeader}>
              <ThemedText style={styles.recordType}>🔴 금욕 기록</ThemedText>
            </View>
            <ThemedText style={styles.recordDate}>
              {item.formattedDate} {item.time}
            </ThemedText>
          </View>
          <View style={styles.recordActions}>
            <TouchableOpacity
              onPress={() => onDeleteRecord(item.id, item.date)}
            >
              <ThemedText style={styles.deleteButtonText}>삭제</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      );
    },
    [onDeleteRecord, styles]
  );

  // 키 추출 함수
  const keyExtractor = useCallback((item: AddictionRecordItem) => item.id, []);

  // 빈 상태 렌더링 함수
  const renderEmptyComponent = useCallback(
    () => (
      <ThemedText style={styles.emptyText}>
        아직 금욕 기록이 없습니다.
      </ThemedText>
    ),
    [styles.emptyText]
  );

  // 헤더 컴포넌트 (통계 정보)
  const renderHeader = useCallback(
    () => (
      <>
        <View style={styles.cardContainer}>
          <ThemedText style={styles.statsTitle}>욕구 기록</ThemedText>
          <View style={styles.statsContainer}>
            <View style={styles.statsRow}>
              <ThemedText style={styles.statLabel}>기록 일수</ThemedText>
              <ThemedText style={styles.statValue}>{totalDays}일</ThemedText>
            </View>
            <View style={styles.statsRow}>
              <ThemedText style={styles.statLabel}>기록 횟수</ThemedText>
              <ThemedText style={styles.statValue}>{totalRecords}회</ThemedText>
            </View>
          </View>
        </View>

        <View style={styles.cardContainer}>
          <Button
            title="모든 금욕 기록 삭제"
            onPress={onResetPress}
            buttonStyle={styles.deleteAllButton}
            titleStyle={styles.deleteAllButtonText}
          />
        </View>
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

AddictionRecordsScreen.displayName = "AddictionRecordsScreen";

export default AddictionRecordsScreen;

// 기존 스타일은 새로운 스타일 시스템으로 대체됨
