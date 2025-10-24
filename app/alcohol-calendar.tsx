import AlcoholRecordModal from "@/components/alcohol/AlcoholRecordModal";
import { ThemedView } from "@/components/themed-view";
import { Button, Card, Text } from "@/components/ui";
import { createCalendarTheme, useStyles, useTheme } from "@/hooks/use-styles";
import { createAlcoholCalendarStyles } from "@/styles/alcohol-calendar.styles";
import {
  addNewAlcoholRecord,
  AlcoholRecord,
  calculateStreakDays,
  getAlcoholMarkedDates,
} from "@/utils/dataManager";
import { formatDateToISO, formatMonth } from "@/utils/formatters";
import { CalendarDay } from "@/utils/types";
import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Alert, TouchableOpacity } from "react-native";
import { Calendar } from "react-native-calendars";

const AlcoholCalendarScreen = memo(() => {
  const theme = useTheme();
  const styles = useStyles(createAlcoholCalendarStyles);

  const [markedDates, setMarkedDates] = useState({});
  const [streakDays, setStreakDays] = useState(0);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

  // 달력 테마 메모이제이션 (금주용 주황색 테마)
  const calendarTheme = useMemo(() => {
    const baseTheme = createCalendarTheme(theme);
    return {
      ...baseTheme,
      // 금주 달력용 색상 커스터마이징
      todayTextColor: theme.appColors.alcohol.primary,
      selectedDayBackgroundColor: theme.appColors.alcohol.primary,
      selectedDayTextColor: theme.appColors.common.white,
      arrowColor: theme.appColors.alcohol.primary,
    };
  }, [theme]);

  const loadData = useCallback(async () => {
    try {
      const marked = await getAlcoholMarkedDates();
      setMarkedDates(marked);

      // 연속 금주 일수 계산 (음주 기록이 있는 날짜들)
      const alcoholDates = Object.keys(marked);
      setStreakDays(calculateStreakDays(alcoholDates));
    } catch (error) {
      console.error("음주 데이터 로드 실패:", error);
    }
  }, []);

  // 저장된 데이터 로드
  useEffect(() => {
    loadData();
  }, [loadData]);

  // 음주 기록 모달 열기
  const openRecordModal = useCallback((dateStr: string) => {
    setSelectedDate(dateStr);
    setModalVisible(true);
  }, []);

  // 음주 기록 저장
  const handleSaveRecord = useCallback(
    async (record: AlcoholRecord) => {
      try {
        await addNewAlcoholRecord(record);
        await loadData(); // 데이터 새로고침
      } catch (error) {
        console.error("음주 기록 저장 실패:", error);
        Alert.alert("오류", "기록을 저장하는 중 오류가 발생했습니다.");
      }
    },
    [loadData]
  );

  // 오늘 날짜 기록 추가
  const onRecordPress = async () => {
    const today = new Date();
    const dateStr = formatDateToISO(today);
    openRecordModal(dateStr);
  };

  // 선택한 날짜 기록 추가
  const onDayPress = async (day: CalendarDay) => {
    const dateStr = day.dateString; // YYYY-MM-DD 형식
    openRecordModal(dateStr);
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today);
  };

  const navigateMonth = (direction: "prev" | "next") => {
    const newMonth = new Date(currentMonth);
    if (direction === "prev") {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: "transparent" }]}>
      {/* 연속 금주 표시 */}
      <Card containerStyle={styles.cardContainer}>
        <Text h4 style={styles.streakTitle}>
          연속 금주
        </Text>
        <Text style={styles.streakDays}>{streakDays}일</Text>
        <Text style={styles.streakSubtext}>
          {streakDays === 0 ? "새로운 시작!" : "건강한 생활! 🌱"}
        </Text>
      </Card>

      {/* 커스텀 달력 헤더 */}
      <Card containerStyle={styles.cardContainer}>
        <ThemedView
          style={[styles.calendarHeader, { backgroundColor: "transparent" }]}
        >
          <Button
            title="‹"
            onPress={() => navigateMonth("prev")}
            buttonStyle={styles.navButton}
          />
          <TouchableOpacity onPress={goToToday}>
            <Text style={styles.monthText}>{formatMonth(currentMonth)}</Text>
          </TouchableOpacity>

          <Button
            title="›"
            onPress={() => navigateMonth("next")}
            buttonStyle={styles.navButton}
          />
        </ThemedView>

        {/* 달력 */}
        <Calendar
          key={`alcohol-${currentMonth.getFullYear()}-${currentMonth.getMonth()}`}
          markedDates={markedDates}
          markingType={"multi-dot"}
          theme={calendarTheme}
          style={styles.calendar}
          monthFormat={""}
          hideExtraDays={true}
          firstDay={1}
          current={`${currentMonth.getFullYear()}-${(
            currentMonth.getMonth() + 1
          )
            .toString()
            .padStart(2, "0")}`}
          hideArrows={true}
          onMonthChange={(month) => {
            setCurrentMonth(new Date(month.year, month.month - 1));
          }}
          onDayPress={onDayPress}
          renderHeader={() => null}
        />
      </Card>

      {/* 음주 기록 버튼 */}
      <Card containerStyle={styles.cardContainer}>
        <Button
          title="기록하기"
          onPress={onRecordPress}
          buttonStyle={styles.recordButton as any}
          titleStyle={styles.recordButtonText}
        />
      </Card>

      {/* 음주 기록 모달 */}
      <AlcoholRecordModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveRecord}
        selectedDate={selectedDate}
      />
    </ThemedView>
  );
});

AlcoholCalendarScreen.displayName = "AlcoholCalendarScreen";

export default AlcoholCalendarScreen;
