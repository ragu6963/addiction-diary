import AlcoholRecordModal from "@/components/alcohol/AlcoholRecordModal";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useTheme } from "@/hooks/use-styles";
import { createAlcoholRecordsStyles } from "@/styles";
import {
  AlcoholRecord,
  clearAllAlcoholRecords,
  deleteAlcoholRecord,
  loadAlcoholRecordData,
  updateAlcoholRecord,
} from "@/utils/dataManager";
import { Button } from "@rneui/themed";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  View,
} from "react-native";

interface AlcoholRecordItem {
  id: string;
  date: string;
  time: string;
  timestamp: string; // 원본 timestamp 추가
  drinks: {
    type: string;
    originalType: string;
    volume: number;
    alcoholPercentage: number;
    quantity: number;
    alcoholContent: number;
  }[];
  totalAlcoholContent: number;
  totalVolume: number;
}

const AlcoholRecordsScreen: React.FC = () => {
  const theme = useTheme();
  const styles = createAlcoholRecordsStyles(theme);
  const [records, setRecords] = useState<AlcoholRecordItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<AlcoholRecord | null>(
    null
  );
  const [expandedRecords, setExpandedRecords] = useState<Set<string>>(
    new Set()
  );
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalDays, setTotalDays] = useState(0);

  const getDrinkName = (type: string): string => {
    const drinkNames: { [key: string]: string } = {
      beer: "맥주",
      soju: "소주",
      wine: "와인",
      whiskey: "위스키",
      cocktail: "칵테일",
      makgeolli: "막걸리",
      other: "기타",
    };
    return drinkNames[type] || type;
  };

  const getDrinkIcon = (type: string): string => {
    const drinkIcons: { [key: string]: string } = {
      beer: "🍺",
      soju: "🍶",
      wine: "🍷",
      whiskey: "🥃",
      cocktail: "🍸",
      makgeolli: "🍶",
      other: "🍻",
    };
    return drinkIcons[type] || "🍻";
  };

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const alcoholData = await loadAlcoholRecordData();

      // 데이터를 날짜별로 그룹화하고 상세 정보 포함
      const recordMap = new Map<string, AlcoholRecordItem>();

      Object.entries(alcoholData).forEach(([date, dayData]) => {
        dayData.records.forEach((record) => {
          const key = `${date}-${record.time}`;
          recordMap.set(key, {
            id: record.id,
            date: date,
            time: record.time,
            timestamp: record.timestamp, // 원본 timestamp 추가
            drinks: record.drinks.map((drink) => ({
              type: getDrinkName(drink.type),
              originalType: drink.type,
              volume: drink.volume,
              alcoholPercentage: drink.alcoholPercentage,
              quantity: drink.quantity,
              alcoholContent: drink.alcoholContent,
            })),
            totalAlcoholContent: record.totalAlcoholContent,
            totalVolume: record.totalVolume,
          });
        });
      });

      // 최신 순으로 정렬
      const sortedRecords = Array.from(recordMap.values()).sort((a, b) => {
        return (
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
      });

      setRecords(sortedRecords);
      setTotalRecords(sortedRecords.length);
      setTotalDays(Object.keys(alcoholData).length);
    } catch (error) {
      console.error("음주 기록 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // 기록 삭제
  const handleDeleteRecord = useCallback(
    async (recordId: string, date: string) => {
      Alert.alert("기록 삭제", "이 음주 기록을 삭제하시겠습니까?", [
        {
          text: "취소",
          style: "cancel",
        },
        {
          text: "삭제",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteAlcoholRecord(date, recordId);
              await loadData(); // 데이터 새로고침
            } catch (error) {
              console.error("기록 삭제 실패:", error);
              Alert.alert("오류", "기록 삭제에 실패했습니다.");
            }
          },
        },
      ]);
    },
    [loadData]
  );

  // 기록 수정
  const handleEditRecord = useCallback((record: AlcoholRecordItem) => {
    // AlcoholRecordItem을 AlcoholRecord로 변환
    const alcoholRecord: AlcoholRecord = {
      id: record.id,
      date: record.date,
      timestamp: record.timestamp, // 원본 timestamp 사용
      time: record.time,
      drinks: record.drinks.map((drink) => ({
        id: `${Date.now()}-${Math.random()}`,
        type: drink.originalType as any,
        volume: drink.volume,
        alcoholPercentage: drink.alcoholPercentage,
        alcoholContent: drink.alcoholContent,
        quantity: drink.quantity,
        unit: "ml" as any,
      })),
      totalAlcoholContent: record.totalAlcoholContent,
      totalVolume: record.totalVolume,
    };

    setEditingRecord(alcoholRecord);
    setEditModalVisible(true);
  }, []);

  // 수정된 기록 저장
  const handleSaveEditedRecord = useCallback(
    async (updatedRecord: AlcoholRecord) => {
      try {
        await updateAlcoholRecord(
          updatedRecord.date,
          updatedRecord.id,
          updatedRecord
        );
        await loadData(); // 데이터 새로고침
        setEditModalVisible(false);
        setEditingRecord(null);
      } catch (error) {
        console.error("기록 수정 실패:", error);
        Alert.alert("오류", "기록 수정에 실패했습니다.");
      }
    },
    [loadData]
  );

  // 토글 기능
  const toggleRecordExpansion = useCallback((recordId: string) => {
    setExpandedRecords((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(recordId)) {
        newSet.delete(recordId);
      } else {
        newSet.add(recordId);
      }
      return newSet;
    });
  }, []);

  // 전체 삭제 기능
  const onResetPress = useCallback(() => {
    Alert.alert(
      "모든 음주 기록 삭제",
      "모든 음주 기록을 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.",
      [
        { text: "취소", style: "cancel" },
        {
          text: "삭제",
          style: "destructive",
          onPress: async () => {
            try {
              await clearAllAlcoholRecords();
              await loadData();
              Alert.alert("완료", "모든 음주 기록이 삭제되었습니다.");
            } catch (error) {
              console.error("기록 초기화 실패:", error);
              Alert.alert("오류", "기록 초기화 중 오류가 발생했습니다.");
            }
          },
        },
      ]
    );
  }, [loadData]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayOfWeek = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];
    return `${month}/${day} (${dayOfWeek})`;
  };

  // 헤더 컴포넌트 (통계 정보)
  const renderHeader = useCallback(
    () => (
      <>
        <View style={styles.cardContainer}>
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
            title="모든 음주 기록 삭제"
            onPress={onResetPress}
            buttonStyle={styles.deleteAllButton}
            titleStyle={styles.deleteAllButtonText}
          />
        </View>
      </>
    ),
    [totalDays, totalRecords, onResetPress, styles]
  );

  const renderRecordItem = ({ item }: { item: AlcoholRecordItem }) => {
    const isExpanded = expandedRecords.has(item.id);

    return (
      <View style={styles.recordItem}>
        <View style={styles.recordInfo}>
          <ThemedText style={styles.recordDate}>
            {formatDate(item.date)} {item.time}
          </ThemedText>
          <ThemedText style={styles.recordSummary}>
            총 {item.totalVolume.toFixed(0)}ml • 알코올{" "}
            {item.totalAlcoholContent.toFixed(1)}g
          </ThemedText>
          <ThemedText style={styles.drinkSummary}>
            {item.drinks.length}종류의 음료 •{" "}
            {item.drinks
              .map((drink) => getDrinkIcon(drink.originalType))
              .join(" ")}
          </ThemedText>
        </View>
        <View style={styles.recordActions}>
          {/* 토글 버튼 */}
          <TouchableOpacity
            style={styles.toggleButton}
            onPress={() => toggleRecordExpansion(item.id)}
          >
            <ThemedText style={styles.toggleButtonText}>
              {isExpanded ? "▼" : "▶"}
            </ThemedText>
          </TouchableOpacity>
          {/* 수정/삭제 버튼 */}
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => handleEditRecord(item)}
          >
            <ThemedText style={styles.editButtonText}>수정</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteRecord(item.id, item.date)}
          >
            <ThemedText style={styles.deleteButtonText}>삭제</ThemedText>
          </TouchableOpacity>
        </View>

        {/* 음료 상세 목록 (토글에 따라 표시/숨김) */}
        {isExpanded && (
          <View style={styles.drinksContainer}>
            {item.drinks.map((drink, index) => (
              <View key={index} style={styles.drinkItem}>
                <View style={styles.drinkInfo}>
                  <ThemedText style={styles.drinkIcon}>
                    {getDrinkIcon(drink.originalType)}
                  </ThemedText>
                  <View style={styles.drinkDetails}>
                    <ThemedText style={styles.drinkName}>
                      {drink.type}
                    </ThemedText>
                    <ThemedText style={styles.drinkSpecs}>
                      {drink.volume}ml × {drink.quantity}개 (
                      {drink.alcoholPercentage}%)
                    </ThemedText>
                  </View>
                </View>
                <ThemedText style={styles.drinkAlcoholContent}>
                  {drink.alcoholContent.toFixed(1)}g
                </ThemedText>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <ThemedText style={styles.emptyText}>
        아직 음주 기록이 없습니다.
      </ThemedText>
      <ThemedText style={styles.emptySubText}>
        음주 달력에서 음주 기록을 추가해보세요.
      </ThemedText>
    </View>
  );

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.loadingText}>로딩 중...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <FlatList
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        data={records}
        renderItem={renderRecordItem}
        keyExtractor={(item: AlcoholRecordItem) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
        initialNumToRender={20}
        updateCellsBatchingPeriod={50}
        getItemLayout={(data, index) => ({
          length: 80, // 예상 아이템 높이
          offset: 80 * index,
          index,
        })}
      />

      {/* 수정 모달 */}
      <AlcoholRecordModal
        visible={editModalVisible}
        onClose={() => {
          setEditModalVisible(false);
          setEditingRecord(null);
        }}
        onSave={handleSaveEditedRecord}
        selectedDate={editingRecord?.date || ""}
        editingRecord={editingRecord || undefined}
        isEditMode={true}
      />
    </ThemedView>
  );
};

export default AlcoholRecordsScreen;
