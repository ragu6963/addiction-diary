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
      marginBottom: theme.spacing[3],
      paddingVertical: theme.spacing[2],
      width: "100%",
    },
    streakNumber: {
      fontSize: theme.typography.fontSize["3xl"],
      fontWeight: theme.typography.fontWeight.bold,
      marginBottom: theme.spacing[1],
    },
    streakMessage: {
      fontSize: theme.typography.fontSize.sm,
      opacity: 0.8,
      textAlign: "center" as const,
      color: theme.colors.text,
      paddingHorizontal: theme.spacing[1],
      lineHeight: theme.typography.lineHeight.sm,
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
    // 비교 섹션 스타일
    comparisonContainer: {
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
      gap: theme.spacing[4],
    },
    comparisonColumn: {
      flex: 1,
      padding: theme.spacing[3],
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.md,
    },
    comparisonTitle: {
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.bold,
      marginBottom: theme.spacing[2],
      textAlign: "center" as const,
    },
    // 최근 통계 섹션 스타일
    recentStatsContainer: {
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
      gap: theme.spacing[4],
    },
    recentStatsColumn: {
      flex: 1,
      padding: theme.spacing[3],
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.md,
    },
    recentStatsTitle: {
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.bold,
      marginBottom: theme.spacing[2],
      textAlign: "center" as const,
    },
    // 연속 현황 비교 스타일
    streakComparisonContainer: {
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
      gap: theme.spacing[2],
      paddingHorizontal: theme.spacing[2],
    },
    streakComparisonColumn: {
      flex: 1,
      alignItems: "center" as const,
      paddingVertical: theme.spacing[2],
      minHeight: 200, // 최소 높이 보장
    },
    streakComparisonTitle: {
      fontSize: theme.typography.fontSize.base,
      fontWeight: theme.typography.fontWeight.bold,
      marginBottom: theme.spacing[2],
      textAlign: "center" as const,
    },
  };
};
