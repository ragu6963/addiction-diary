import { Theme } from "@/constants/design-tokens";
import { StyleSheet } from "react-native";

// 공통 믹스인 패턴
export const createMixins = (theme: Theme) => ({
  // 중앙 정렬 텍스트
  centerText: {
    textAlign: "center" as const,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text,
  },

  // Flex 행 레이아웃 (양쪽 정렬)
  flexRowBetween: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
  },

  // Flex 행 레이아웃 (중앙 정렬)
  flexRowCenter: {
    flexDirection: "row" as const,
    justifyContent: "center" as const,
    alignItems: "center" as const,
  },

  // 컬럼 레이아웃
  columnLayout: {
    flex: 1,
    padding: theme.spacing[3],
    backgroundColor: theme.colors.background,
  },

  // 제목 스타일 변형
  titleVariants: {
    large: {
      fontSize: theme.typography.fontSize["3xl"],
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.text,
    },
    medium: {
      fontSize: theme.typography.fontSize["2xl"],
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.text,
    },
    small: {
      fontSize: theme.typography.fontSize.lg,
      fontWeight: theme.typography.fontWeight.semibold,
      color: theme.colors.text,
    },
  },

  // 버튼 스타일 변형
  buttonVariants: {
    primary: {
      backgroundColor: theme.colors.primary,
      paddingVertical: theme.spacing[3],
      paddingHorizontal: theme.spacing[4],
      width: "50%",
      alignSelf: "center" as const,
    },
    secondary: {
      backgroundColor: theme.colors.secondary,
      paddingVertical: theme.spacing[3],
      paddingHorizontal: theme.spacing[4],
      width: "50%",
      alignSelf: "center" as const,
    },
  },
});

// 공통 컴포넌트 스타일
export const createCommonStyles = (theme: Theme) => ({
  // 카드 컨테이너 스타일 (모든 화면에서 공통 사용)
  cardContainer: {
    backgroundColor: "transparent",
    borderWidth: 0,
    borderColor: "transparent",
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
    marginBottom: theme.spacing[4],
    paddingHorizontal: 0,
    margin: 0,
  },

  // 섹션 제목 스타일 (모든 화면에서 공통 사용)
  sectionTitle: {
    marginBottom: theme.spacing[4],
    fontWeight: theme.typography.fontWeight.bold,
    fontSize: theme.typography.fontSize["2xl"],
    color: theme.colors.text,
  },

  // 통계 행 스타일 (records, statistics에서 공통 사용)
  statsRow: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    paddingVertical: theme.spacing[3],
    paddingHorizontal: theme.spacing[1],
    backgroundColor: "transparent",
  },

  // 통계 라벨 스타일
  statLabel: {
    fontSize: theme.typography.fontSize.base,
    flex: 1,
    color: theme.colors.text,
  },

  // 통계 값 스타일
  statValue: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.secondary,
  },

  // 데이터 없음 텍스트 스타일
  noDataText: {
    textAlign: "center" as const,
    fontSize: theme.typography.fontSize.base,
    opacity: 0.7,
    fontStyle: "italic" as const,
    paddingVertical: theme.spacing[5],
    color: theme.colors.text,
  },

  // 컨테이너 스타일
  container: {
    flex: 1,
  },

  // 스크롤 콘텐츠 스타일
  scrollContent: {
    paddingHorizontal: theme.spacing[4],
    paddingTop: theme.spacing[5],
    paddingBottom: theme.spacing[5],
  },
});

// 정적 공통 스타일
export const staticCommonStyles = StyleSheet.create({
  // 버튼 텍스트 스타일
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
  },

  // 푸터 텍스트 스타일
  footerText: {
    textAlign: "center",
    fontSize: 14,
    opacity: 0.7,
    marginTop: 12,
    lineHeight: 20,
  },
});
