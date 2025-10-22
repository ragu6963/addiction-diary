import { Theme } from "@/constants/design-tokens";
import { createCommonStyles } from "./common.styles";

// 통계 화면 전용 스타일
export const createStatisticsStyles = (theme: Theme) => {
  const commonStyles = createCommonStyles(theme);

  return {
    ...commonStyles,
    // 통계 전용 스타일
    streakDisplay: {
      alignItems: "center" as const,
      marginBottom: theme.spacing[5],
      paddingVertical: theme.spacing[4],
    },
    streakNumber: {
      fontSize: theme.typography.fontSize["5xl"],
      fontWeight: theme.typography.fontWeight.bold,
      marginBottom: theme.spacing[2],
    },
    streakMessage: {
      fontSize: theme.typography.fontSize.base,
      opacity: 0.8,
      textAlign: "center" as const,
      color: theme.colors.text,
    },
    goalSection: {
      alignItems: "center" as const,
      paddingVertical: theme.spacing[4],
    },
    goalTitle: {
      fontSize: theme.typography.fontSize.lg,
      fontWeight: theme.typography.fontWeight.bold,
      marginBottom: theme.spacing[3],
      color: theme.colors.text,
    },
    goalText: {
      fontSize: theme.typography.fontSize.base,
      textAlign: "center" as const,
      lineHeight: theme.typography.lineHeight.base,
      opacity: 0.8,
      color: theme.colors.text,
    },
  };
};
