import { Theme } from "@/constants/design-tokens";
import { createCommonStyles, createMixins } from "./common.styles";

// 기록 화면 전용 스타일
export const createRecordsStyles = (theme: Theme) => {
  const commonStyles = createCommonStyles(theme);
  const mixins = createMixins(theme);

  return {
    ...commonStyles,
    // 기록 전용 스타일
    recordInfo: {
      flex: 1,
    },
    recordHeader: {
      ...mixins.flexRowBetween,
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
      ...mixins.flexRowBetween,
      backgroundColor: "transparent",
      padding: theme.spacing[2],
      marginBottom: theme.spacing[2],
    },
    // 타입별 통계 스타일
    typeStatsContainer: {
      ...mixins.flexRowBetween,
      gap: theme.spacing[4],
    },
    typeStatsColumn: {
      flex: 1,
      padding: theme.spacing[2],
    },
    typeStatsTitle: {
      ...mixins.titleVariants.small,
      marginBottom: theme.spacing[2],
      textAlign: "center" as const,
    },
    // 삭제 버튼 스타일 (눈에 띄는 색상)
    deleteAllButton: {
      backgroundColor: theme.colors.error,
      paddingVertical: theme.spacing[2],
      paddingHorizontal: theme.spacing[3],
      width: "40%" as any,
      alignSelf: "center" as const,
      borderWidth: 0,
    },
    // 삭제 버튼 텍스트 스타일
    deleteAllButtonText: {
      color: theme.appColors.common.white,
      fontWeight: theme.typography.fontWeight.normal,
    },
  };
};
