import { Theme } from "@/constants/design-tokens";
import { StyleSheet } from "react-native";

// 음주 기록 스타일
export const createAlcoholRecordsStyles = (theme: Theme) => {
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
    title: {
      fontSize: theme.typography.fontSize["2xl"],
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.text,
      marginBottom: theme.spacing[6],
      textAlign: "center",
    },
    loadingText: {
      fontSize: theme.typography.fontSize.base,
      color: theme.colors.textSecondary,
      textAlign: "center",
      marginTop: theme.spacing[8],
    },
    listContainer: {
      paddingBottom: theme.spacing[4],
    },

    // 기록 아이템
    recordItem: {
      backgroundColor: "transparent",
      paddingVertical: theme.spacing[3],
      paddingHorizontal: 0,
      marginBottom: theme.spacing[2],
    },
    recordMainRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: theme.spacing[2],
    },
    recordSubRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing[2],
    },
    recordInfo: {
      flex: 1,
    },
    recordType: {
      fontSize: theme.typography.fontSize.base,
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.appColors.alcohol.primary,
    },
    recordDate: {
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.textSecondary,
    },
    recordSummary: {
      fontSize: theme.typography.fontSize.xs,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing[1],
    },
    drinkSummary: {
      fontSize: theme.typography.fontSize.xs,
      color: theme.colors.textSecondary,
      fontStyle: "italic",
    },
    recordActions: {
      marginLeft: theme.spacing[2],
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing[1],
    },
    toggleButton: {
      backgroundColor: "transparent",
      paddingHorizontal: theme.spacing[1],
      paddingVertical: theme.spacing[1],
      minWidth: 24,
      alignItems: "center",
      justifyContent: "center",
    },
    toggleButtonText: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.medium,
    },
    editButton: {
      backgroundColor: "transparent",
      paddingHorizontal: theme.spacing[1],
      paddingVertical: theme.spacing[1],
    },
    editButtonText: {
      color: theme.colors.primary,
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.medium,
    },
    deleteButton: {
      backgroundColor: "transparent",
      paddingHorizontal: theme.spacing[1],
      paddingVertical: theme.spacing[1],
    },
    deleteButtonText: {
      color: theme.colors.error,
      fontSize: theme.typography.fontSize.sm,
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
    totalVolumeText: {
      fontSize: theme.typography.fontSize.base,
      fontWeight: theme.typography.fontWeight.medium,
      color: theme.colors.text,
      marginBottom: theme.spacing[1],
    },
    totalAlcoholText: {
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.error,
      fontWeight: theme.typography.fontWeight.medium,
    },
    summaryText: {
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.textSecondary,
      fontStyle: "italic",
      marginTop: theme.spacing[2],
    },

    // 음료 목록
    drinksContainer: {
      gap: theme.spacing[2],
    },
    drinkItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: theme.spacing[2],
      paddingHorizontal: 0,
      backgroundColor: "transparent",
    },
    drinkInfo: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    drinkIcon: {
      fontSize: theme.typography.fontSize.lg,
      marginRight: theme.spacing[2],
    },
    drinkDetails: {
      flex: 1,
    },
    drinkName: {
      fontSize: theme.typography.fontSize.base,
      fontWeight: theme.typography.fontWeight.medium,
      color: theme.colors.text,
      marginBottom: theme.spacing[1],
    },
    drinkSpecs: {
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.textSecondary,
    },
    drinkAlcoholContent: {
      fontSize: theme.typography.fontSize.base,
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.error,
    },

    // 빈 상태
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: theme.spacing[8],
    },
    emptyText: {
      fontSize: theme.typography.fontSize.lg,
      fontWeight: theme.typography.fontWeight.medium,
      color: theme.colors.textSecondary,
      textAlign: "center",
      marginBottom: theme.spacing[2],
    },
    emptySubText: {
      fontSize: theme.typography.fontSize.base,
      color: theme.colors.textSecondary,
      textAlign: "center",
      opacity: 0.7,
    },
  });
};
