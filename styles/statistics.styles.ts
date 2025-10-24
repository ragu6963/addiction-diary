import { Theme } from "@/constants/design-tokens";
import { StyleSheet } from "react-native";

// 단순화된 통계 스타일
export const createStatisticsStyles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      padding: theme.spacing[4],
    },
    scrollView: {
      flex: 1,
    },
    title: {
      fontSize: theme.typography.fontSize["2xl"],
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.text,
      marginBottom: theme.spacing[6],
      textAlign: "center",
    },
    section: {
      marginBottom: theme.spacing[6],
    },
    sectionTitle: {
      fontSize: theme.typography.fontSize.lg,
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.text,
      marginBottom: theme.spacing[4],
      textAlign: "center",
    },
    statsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: theme.spacing[3],
    },
    statCard: {
      width: "48%",
      backgroundColor: "transparent",
      padding: theme.spacing[3],
      alignItems: "center",
      justifyContent: "center",
    },
    statValue: {
      fontSize: theme.typography.fontSize["3xl"],
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.text,
      marginBottom: theme.spacing[2],
    },
    statLabel: {
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.textSecondary,
      textAlign: "center",
    },
  });
};
