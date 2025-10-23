import { Theme } from "@/constants/design-tokens";
import { StyleSheet } from "react-native";

// 메인 화면 전용 스타일
export const createMainStyles = (theme: Theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  navBar: {
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[2],
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    height: 44,
  },
  menuOverlay: {
    backgroundColor: theme.colors.text,
    opacity: 0.3,
  },
  menuPanel: {
    backgroundColor: theme.colors.surface,
    paddingTop: 44,
    paddingHorizontal: theme.spacing[4],
    ...theme.shadows.lg,
  },
  menuItem: {
    backgroundColor: "transparent",
    marginVertical: theme.spacing[1],
    marginHorizontal: theme.spacing[2],
    paddingVertical: theme.spacing[4],
    paddingHorizontal: theme.spacing[5],
  },
});

// 정적 스타일 (테마에 의존하지 않는 스타일)
export const staticMainStyles = StyleSheet.create({
  hamburgerButton: {
    width: 24,
    height: 20,
    justifyContent: "space-between",
    paddingVertical: 2,
  },
  hamburgerLine: {
    height: 2,
    backgroundColor: "#333",
  },
  navTitle: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 12,
  },
  navSpacer: {
    width: 24,
  },
  content: {
    flex: 1,
  },
  menuOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 998,
  },
  menuPanel: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: 300, // 동적 너비는 컴포넌트에서 설정
    zIndex: 999,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
