import { Theme } from "@/constants/design-tokens";
import { StyleSheet } from "react-native";

// 음주 기록 모달 스타일
export const createAlcoholRecordModalStyles = (theme: Theme) => {
  return StyleSheet.create({
    // 헤더 스타일
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: theme.spacing[4],
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      backgroundColor: theme.colors.background,
    },
    headerButton: {
      color: theme.colors.primary,
      fontSize: theme.typography.fontSize.base,
    },
    headerTitle: {
      fontSize: theme.typography.fontSize.lg,
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.text,
    },
    headerSaveButton: {
      color: theme.colors.primary,
      fontSize: theme.typography.fontSize.base,
      fontWeight: theme.typography.fontWeight.bold,
    },

    // 스크롤 컨테이너
    scrollContainer: {
      flex: 1,
    },
    scrollContent: {
      padding: theme.spacing[4],
      paddingBottom: 100,
    },

    // 날짜 표시 섹션
    dateSection: {
      marginBottom: theme.spacing[6],
    },
    dateTitle: {
      fontSize: theme.typography.fontSize.lg,
      fontWeight: theme.typography.fontWeight.normal,
      marginBottom: theme.spacing[2],
      color: theme.colors.text,
    },
    dateText: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.fontSize.base,
    },

    // 음료 추가 섹션
    drinkAddSection: {
      marginBottom: theme.spacing[6],
    },
    drinkAddTitle: {
      fontSize: theme.typography.fontSize.lg,
      fontWeight: theme.typography.fontWeight.normal,
      marginBottom: theme.spacing[3],
      color: theme.colors.text,
    },
    drinkButtonsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: theme.spacing[2],
    },
    drinkButton: {
      backgroundColor: theme.colors.surfaceVariant,
      paddingHorizontal: theme.spacing[4],
      paddingVertical: theme.spacing[2],
      marginRight: theme.spacing[2],
      marginBottom: theme.spacing[2],
    },
    drinkButtonText: {
      color: "white",
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.medium,
    },

    // 음료 목록 아이템
    drinkItem: {
      marginBottom: theme.spacing[4],
      paddingBottom: theme.spacing[4],
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    drinkItemHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: theme.spacing[3],
    },
    drinkItemTitle: {
      fontSize: theme.typography.fontSize.base,
      fontWeight: theme.typography.fontWeight.medium,
      color: theme.colors.text,
    },
    deleteButton: {
      color: theme.colors.error,
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.medium,
    },

    // 입력 필드 컨테이너
    inputContainer: {
      gap: theme.spacing[3],
    },
    inputField: {
      // 빈 객체 - Input 컴포넌트의 기본 스타일 사용
    },
    inputLabel: {
      fontSize: theme.typography.fontSize.sm,
      marginBottom: theme.spacing[1],
      color: theme.colors.textSecondary,
    },
    inputStyle: {
      fontSize: theme.typography.fontSize.base,
      color: theme.colors.text,
    },
    inputContainerStyle: {
      paddingHorizontal: 0,
    },

    // 알코올 함량 표시
    alcoholContentContainer: {
      backgroundColor: theme.colors.surfaceVariant,
      padding: theme.spacing[3],
      borderRadius: 8,
    },
    alcoholContentText: {
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.textSecondary,
      textAlign: "center",
    },

    // 총합 섹션
    totalSection: {
      marginTop: theme.spacing[6],
    },
    totalTitle: {
      fontSize: theme.typography.fontSize.lg,
      fontWeight: theme.typography.fontWeight.medium,
      marginBottom: theme.spacing[3],
      color: theme.colors.text,
    },
    totalItemsContainer: {
      gap: theme.spacing[2],
    },
    totalItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    totalItemLabel: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.fontSize.base,
    },
    totalItemValue: {
      fontWeight: theme.typography.fontWeight.medium,
      color: theme.colors.text,
      fontSize: theme.typography.fontSize.base,
    },
    totalItemValueError: {
      fontWeight: theme.typography.fontWeight.medium,
      color: theme.colors.error,
      fontSize: theme.typography.fontSize.base,
    },
  });
};

// 정적 스타일 (테마에 의존하지 않는 스타일)
export const staticAlcoholRecordModalStyles = StyleSheet.create({
  // 모달 컨테이너
  modalContainer: {
    flex: 1,
    backgroundColor: "transparent",
  },
  // 키보드 회피 뷰
  keyboardAvoidingView: {
    flex: 1,
  },
  // 스크롤뷰
  scrollView: {
    flex: 1,
  },
});
