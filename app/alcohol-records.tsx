import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useTheme } from "@/hooks/use-styles";
import { createAlcoholRecordsStyles } from "@/styles";
import { loadAlcoholRecordData } from "@/utils/dataManager";
import React, { useCallback, useEffect, useState } from "react";
import { FlatList, RefreshControl, View } from "react-native";

interface AlcoholRecordItem {
  id: string;
  date: string;
  time: string;
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
        const dateA = new Date(`${a.date} ${a.time}`);
        const dateB = new Date(`${b.date} ${b.time}`);
        return dateB.getTime() - dateA.getTime();
      });

      setRecords(sortedRecords);
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

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayOfWeek = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];
    return `${month}/${day} (${dayOfWeek})`;
  };

  const renderRecordItem = ({ item }: { item: AlcoholRecordItem }) => (
    <View style={styles.recordItem}>
      {/* 날짜와 시간 헤더 */}
      <View style={styles.recordHeader}>
        <View style={styles.dateTimeContainer}>
          <ThemedText style={styles.dateText}>
            {formatDate(item.date)}
          </ThemedText>
          <ThemedText style={styles.timeText}>{item.time}</ThemedText>
        </View>
        <View style={styles.summaryContainer}>
          <ThemedText style={styles.totalVolumeText}>
            총 {item.totalVolume.toFixed(0)}ml
          </ThemedText>
          <ThemedText style={styles.totalAlcoholText}>
            알코올 {item.totalAlcoholContent.toFixed(1)}g
          </ThemedText>
        </View>
      </View>

      {/* 음료 상세 목록 */}
      <View style={styles.drinksContainer}>
        {item.drinks.map((drink, index) => (
          <View key={index} style={styles.drinkItem}>
            <View style={styles.drinkInfo}>
              <ThemedText style={styles.drinkIcon}>
                {getDrinkIcon(drink.originalType)}
              </ThemedText>
              <View style={styles.drinkDetails}>
                <ThemedText style={styles.drinkName}>{drink.type}</ThemedText>
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
    </View>
  );

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
      <ThemedText style={styles.title}>음주 기록</ThemedText>

      <FlatList
        data={records}
        renderItem={renderRecordItem}
        keyExtractor={(item: AlcoholRecordItem) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={renderEmptyState}
      />
    </ThemedView>
  );
};

export default AlcoholRecordsScreen;
