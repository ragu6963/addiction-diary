import { Theme } from "@/constants/design-tokens";
import { StyleSheet } from "react-native";

// 메인 화면 전용 스타일
export const createMainStyles = (theme: Theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  navBar: {
    backgroundColor: "transparent",
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[3],
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    height: 44,
  },
  // 햄버거 버튼 동적 스타일
  hamburgerButton: {
    width: 28,
    height: 24,
    justifyContent: "space-between" as const,
    paddingVertical: theme.spacing[1],
    paddingHorizontal: theme.spacing[1],
  },
  hamburgerLine: {
    height: 3,
    backgroundColor: theme.colors.text,
    borderRadius: 2,
  },
  menuOverlay: {
    backgroundColor: theme.colors.text,
    opacity: 0.1,
  },
  menuPanel: {
    backgroundColor: theme.colors.background,
    paddingTop: 44,
    paddingHorizontal: theme.spacing[3],
  },
  menuItem: {
    backgroundColor: "transparent",
    marginVertical: theme.spacing[1],
    marginHorizontal: 0,
    paddingVertical: theme.spacing[3],
    paddingHorizontal: theme.spacing[3],
  },
});

// 정적 스타일 (테마에 의존하지 않는 스타일)
export const staticMainStyles = StyleSheet.create({
  navTitle: {
    fontSize: 16,
    fontWeight: "400",
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
    fontWeight: "400",
  },
});
