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
    recordDate: {
      fontSize: theme.typography.fontSize.base,
      fontWeight: theme.typography.fontWeight.semibold,
      marginBottom: theme.spacing[1],
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
  };
};
