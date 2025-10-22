import { darkTheme, lightTheme, Theme } from "@/constants/design-tokens";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useMemo } from "react";
import { StyleSheet } from "react-native";

// 테마 훅
export const useTheme = (): Theme => {
  const colorScheme = useColorScheme();
  return useMemo(() => {
    return colorScheme === "dark"
      ? (darkTheme as unknown as Theme)
      : (lightTheme as unknown as Theme);
  }, [colorScheme]);
};

// 스타일 생성 훅 (메모이제이션)
export const useStyles = <T extends Record<string, any>>(
  styleFactory: (theme: Theme) => T
): T => {
  const theme = useTheme();

  return useMemo(() => {
    return StyleSheet.create(styleFactory(theme));
  }, [theme, styleFactory]);
};

// 달력 라이브러리 전용 테마 생성
// react-native-calendars는 특별한 테마 구조를 요구함
export const createCalendarTheme = (theme: Theme) => ({
  // 달력 배경 관련
  backgroundColor: "transparent",
  calendarBackground: "transparent",

  // 텍스트 색상
  textSectionTitleColor: theme.colors.text,
  dayTextColor: theme.colors.text,
  monthTextColor: theme.colors.text,
  textDisabledColor: theme.colors.textTertiary,

  // 선택/오늘 날짜 색상
  selectedDayBackgroundColor: theme.colors.secondary,
  selectedDayTextColor: theme.colors.neutral[0],
  todayTextColor: theme.colors.secondary,

  // 점 표시 색상
  dotColor: theme.colors.secondary,
  selectedDotColor: theme.colors.neutral[0],

  // 네비게이션 색상
  arrowColor: theme.colors.primary,
  indicatorColor: theme.colors.secondary,

  // 커스텀 스타일시트 (라이브러리 내부 스타일 오버라이드)
  "stylesheet.calendar.header": {
    week: {
      marginTop: theme.spacing[1],
      marginBottom: theme.spacing[1],
      flexDirection: "row" as const,
      justifyContent: "space-around" as const,
      height: 30,
    },
    dayHeader: {
      fontSize: theme.typography.fontSize.xs,
      fontWeight: theme.typography.fontWeight.semibold,
      color: theme.colors.text,
    },
  },
});
