import { Theme } from "@/constants/design-tokens";
import { StyleSheet } from "react-native";

// 금욕 기록 스타일
export const createAddictionRecordsStyles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      padding: theme.spacing[4],
    },
    scrollContent: {
      paddingBottom: theme.spacing[4],
    },

    // 카드 컨테이너
    cardContainer: {
      backgroundColor: "transparent",
      marginBottom: theme.spacing[6],
      padding: 0,
    },

    // 통계 섹션
    statsTitle: {
      fontSize: theme.typography.fontSize.lg,
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.text,
      marginBottom: theme.spacing[3],
      textAlign: "center",
    },
    statsContainer: {
      gap: theme.spacing[2],
    },
    statsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: theme.spacing[2],
    },
    statLabel: {
      fontSize: theme.typography.fontSize.base,
      color: theme.colors.textSecondary,
    },
    statValue: {
      fontSize: theme.typography.fontSize.base,
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.text,
    },

    // 기록 아이템
    recordItem: {
      backgroundColor: "transparent",
      paddingVertical: theme.spacing[3],
      paddingHorizontal: 0,
      marginBottom: theme.spacing[2],
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    recordInfo: {
      flex: 1,
    },
    recordHeader: {
      marginBottom: theme.spacing[1],
    },
    recordType: {
      fontSize: theme.typography.fontSize.base,
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.appColors.addiction.primary,
    },
    recordDate: {
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.textSecondary,
    },
    recordActions: {
      marginLeft: theme.spacing[2],
    },
    deleteButtonText: {
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.error,
      fontWeight: theme.typography.fontWeight.medium,
    },

    // 삭제 버튼
    deleteAllButton: {
      backgroundColor: theme.colors.error,
      borderRadius: 8,
      marginTop: theme.spacing[2],
    },
    deleteAllButtonText: {
      color: "white",
      fontSize: theme.typography.fontSize.base,
      fontWeight: theme.typography.fontWeight.medium,
    },

    // 빈 상태
    emptyText: {
      fontSize: theme.typography.fontSize.base,
      color: theme.colors.textSecondary,
      textAlign: "center",
      marginTop: theme.spacing[8],
      opacity: 0.7,
    },
  });
};
