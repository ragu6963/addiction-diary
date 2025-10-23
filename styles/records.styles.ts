import { Theme } from "@/constants/design-tokens";
import { createCommonStyles } from "./common.styles";

// 기록 화면 전용 스타일
export const createRecordsStyles = (theme: Theme) => {
  const commonStyles = createCommonStyles(theme);

  return {
    ...commonStyles,
    // 기록 전용 스타일
    recordInfo: {
      flex: 1,
    },
    recordHeader: {
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
      alignItems: "center" as const,
      marginBottom: theme.spacing[1],
    },
    recordType: {
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.bold,
    },
    recordCount: {
      fontSize: theme.typography.fontSize.xs,
      color: theme.colors.text,
      opacity: 0.7,
    },
    recordDate: {
      fontSize: theme.typography.fontSize.base,
      fontWeight: theme.typography.fontWeight.semibold,
      color: theme.colors.text,
    },
    recordActions: {
      alignItems: "center" as const,
      gap: theme.spacing[2],
    },
    deleteButtonText: {
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.secondary,
    },
    listItem: {
      backgroundColor: "transparent",
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing[4],
      marginBottom: theme.spacing[2],
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
      alignItems: "center" as const,
    },
    // 타입별 통계 스타일
    typeStatsContainer: {
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
      gap: theme.spacing[4],
    },
    typeStatsColumn: {
      flex: 1,
      padding: theme.spacing[3],
    },
    typeStatsTitle: {
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.bold,
      marginBottom: theme.spacing[2],
      textAlign: "center" as const,
    },
  };
};
