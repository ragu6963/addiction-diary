import { Theme } from "@/constants/design-tokens";
import { createCommonStyles } from "./common.styles";

// 금주 달력 화면 전용 스타일 (금욕 달력과 구별되는 색상 사용)
export const createAlcoholCalendarStyles = (theme: Theme) => {
  const commonStyles = createCommonStyles(theme);

  return {
    ...commonStyles,
    // 금주 달력 전용 스타일 - 녹색 계열로 차별화
    streakTitle: {
      textAlign: "center" as const,
      marginBottom: theme.spacing[2],
      fontWeight: theme.typography.fontWeight.bold,
      fontSize: theme.typography.fontSize["2xl"],
      color: theme.colors.text,
    },
    streakDays: {
      fontSize: theme.typography.fontSize["3xl"],
      fontWeight: theme.typography.fontWeight.bold,
      textAlign: "center" as const,
      color: "#28a745", // 녹색 계열로 금욕 달력과 구별
      marginBottom: theme.spacing[2],
    },
    streakSubtext: {
      textAlign: "center" as const,
      fontSize: theme.typography.fontSize.base,
      opacity: 0.8,
      color: theme.colors.text,
    },
    calendarHeader: {
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
      alignItems: "center" as const,
      paddingVertical: theme.spacing[4],
      paddingHorizontal: theme.spacing[5],
    },
    monthText: {
      fontSize: theme.typography.fontSize.lg,
      fontWeight: theme.typography.fontWeight.semibold,
      color: theme.colors.text,
    },
    calendar: {},
    // 금주 전용 버튼 스타일
    recordButton: {
      backgroundColor: "#28a745", // 녹색 계열
    },
  };
};
