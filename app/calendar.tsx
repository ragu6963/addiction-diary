import { ThemedView } from "@/components/themed-view";
import { createCalendarTheme, useStyles, useTheme } from "@/hooks/use-styles";
import { createCalendarStyles } from "@/styles/calendar.styles";
import {
  addNewRecord,
  calculateStreakDays,
  loadRecordData,
  MarkedDates,
} from "@/utils/dataManager";
import { Button, Card, Text } from "@rneui/themed";
import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Alert, TouchableOpacity } from "react-native";
import { Calendar } from "react-native-calendars";

const CalendarScreen = memo(() => {
  const theme = useTheme();
  const styles = useStyles(createCalendarStyles);

  const [markedDates, setMarkedDates] = useState<MarkedDates>({});
  const [streakDays, setStreakDays] = useState(0);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // 달력 테마 메모이제이션
  const calendarTheme = useMemo(() => createCalendarTheme(theme), [theme]);

  const loadData = useCallback(async () => {
    try {
      const recordData = await loadRecordData();
      const marked: MarkedDates = {};

      Object.keys(recordData).forEach((date) => {
        const count = recordData[date].count;
        // 최대 5개까지 dot 표시 (너무 많으면 UI가 복잡해짐)
        const maxDots = Math.min(count, 5);
        const dots = Array.from({ length: maxDots }, () => ({
          color: theme.appColors.addiction.primary,
        }));

        marked[date] = {
          dots: dots,
          count: count,
          lastRecordTime: recordData[date].lastRecordTime,
        };
      });

      setMarkedDates(marked);
      setStreakDays(calculateStreakDays(Object.keys(marked)));
    } catch (error) {
      console.error("데이터 로드 실패:", error);
    }
  }, [theme.appColors.addiction.primary]);

  // 저장된 데이터 로드
  useEffect(() => {
    loadData();
  }, [loadData]);

  // 통합된 기록 추가 함수
  const addRecordForDate = useCallback(
    async (dateStr: string) => {
      try {
        const now = new Date();
        const timeStr = now.toLocaleTimeString("ko-KR", {
          hour: "2-digit",
          minute: "2-digit",
        });

        const isMarked = markedDates[dateStr]?.marked || false;
        const currentCount = markedDates[dateStr]?.count || 0;

        // 날짜 포맷팅 (한국어)
        const selectedDate = new Date(dateStr);
        const year = selectedDate.getFullYear();
        const month = selectedDate.getMonth() + 1;
        const date = selectedDate.getDate();
        const dayOfWeek = ["일", "월", "화", "수", "목", "금", "토"][
          selectedDate.getDay()
        ];
        const formattedDate = `${year}년 ${month}월 ${date}일 (${dayOfWeek})`;

        const message = isMarked
          ? `${formattedDate}에 기록을 추가하시겠습니까?\n\n현재 기록: ${currentCount}회\n기록 시간: ${timeStr}`
          : `${formattedDate}에 기록을 추가하시겠습니까?\n\n기록 시간: ${timeStr}`;

        Alert.alert("기록 추가", message, [
          { text: "취소", style: "cancel" },
          {
            text: isMarked ? "추가" : "기록",
            onPress: async () => {
              await addNewRecord(dateStr);
              await loadData(); // 데이터 새로고침
            },
          },
        ]);
      } catch (error) {
        console.error("기록 추가 실패:", error);
        Alert.alert("오류", "기록을 저장하는 중 오류가 발생했습니다.");
      }
    },
    [markedDates, loadData]
  );

  // 오늘 날짜 기록 추가
  const onRecordPress = async () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const date = now.getDate().toString().padStart(2, "0");
    const dateStr = `${year}-${month}-${date}`;
    await addRecordForDate(dateStr);
  };

  // 선택한 날짜 기록 추가
  const onDayPress = async (day: any) => {
    const dateStr = day.dateString; // YYYY-MM-DD 형식
    await addRecordForDate(dateStr);
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
      {/* 연속 금욕 표시 */}
      <Card containerStyle={styles.cardContainer}>
        <Text h4 style={styles.streakTitle}>
          연속 금욕
        </Text>
        <Text style={styles.streakDays}>{streakDays}일</Text>
        <Text style={styles.streakSubtext}>
          {streakDays === 0 ? "새로운 시작!" : "계속 화이팅! 💪"}
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
            <Text style={styles.monthText}>
              {currentMonth.getFullYear()}년 {currentMonth.getMonth() + 1}월
            </Text>
          </TouchableOpacity>

          <Button
            title="›"
            onPress={() => navigateMonth("next")}
            buttonStyle={styles.navButton}
          />
        </ThemedView>

        {/* 달력 */}
        <Calendar
          key={`${currentMonth.getFullYear()}-${currentMonth.getMonth()}`}
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

      {/* 기록 버튼 */}
      <Card containerStyle={styles.cardContainer}>
        <Button
          title="기록하기"
          onPress={onRecordPress}
          buttonStyle={styles.recordButton}
        />
      </Card>
    </ThemedView>
  );
});

CalendarScreen.displayName = "CalendarScreen";

export default CalendarScreen;
