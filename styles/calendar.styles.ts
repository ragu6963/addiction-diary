import { Theme } from "@/constants/design-tokens";
import { createCommonStyles } from "./common.styles";

// 달력 화면 전용 스타일
export const createCalendarStyles = (theme: Theme) => {
  const commonStyles = createCommonStyles(theme);

  return {
    ...commonStyles,
    // 달력 전용 스타일
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
      color: theme.colors.primary,
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
  };
};
