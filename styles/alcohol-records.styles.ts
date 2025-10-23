import { Theme } from "@/constants/design-tokens";
import { StyleSheet } from "react-native";

// 음주 기록 스타일
export const createAlcoholRecordsStyles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      padding: theme.spacing[4],
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
      paddingVertical: theme.spacing[4],
      paddingHorizontal: 0,
      marginBottom: theme.spacing[4],
    },
    recordHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: theme.spacing[4],
      paddingBottom: theme.spacing[2],
    },
    dateTimeContainer: {
      flex: 1,
    },
    dateText: {
      fontSize: theme.typography.fontSize.lg,
      fontWeight: theme.typography.fontWeight.medium,
      color: theme.colors.text,
      marginBottom: theme.spacing[1],
    },
    timeText: {
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.textSecondary,
    },
    summaryContainer: {
      alignItems: "flex-end",
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
