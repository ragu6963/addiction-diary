import { Theme } from "@/constants/design-tokens";
import { createCommonStyles, createMixins } from "./common.styles";

// 금주 달력 화면 전용 스타일 (금욕 달력과 구별되는 색상 사용)
export const createAlcoholCalendarStyles = (theme: Theme) => {
  const commonStyles = createCommonStyles(theme);
  const mixins = createMixins(theme);

  return {
    ...commonStyles,
    // 금주 달력 전용 스타일
    streakTitle: {
      ...mixins.centerText,
      ...mixins.titleVariants.medium,
      marginBottom: theme.spacing[2],
    },
    streakDays: {
      ...mixins.titleVariants.large,
      textAlign: "center" as const,
      color: theme.appColors.alcohol.primary,
      marginBottom: theme.spacing[2],
    },
    streakSubtext: {
      ...mixins.centerText,
      opacity: 0.8,
    },
    calendarHeader: {
      ...mixins.flexRowBetween,
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
      backgroundColor: theme.appColors.alcohol.primary,
      borderRadius: theme.borderRadius.md,
      paddingVertical: theme.spacing[3],
      paddingHorizontal: theme.spacing[4],
    },
  };
};
