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

  // Flex 행 레이아웃 (시작 정렬)
  flexRowStart: {
    flexDirection: "row" as const,
    justifyContent: "flex-start" as const,
    alignItems: "center" as const,
  },

  // Flex 행 레이아웃 (끝 정렬)
  flexRowEnd: {
    flexDirection: "row" as const,
    justifyContent: "flex-end" as const,
    alignItems: "center" as const,
  },

  // 컬럼 레이아웃 (미니멀)
  columnLayout: {
    flex: 1,
    padding: theme.spacing[2],
    backgroundColor: "transparent",
  },

  // 투명 배경
  transparentBackground: {
    backgroundColor: "transparent",
  },

  // 제목 스타일 변형 (미니멀)
  titleVariants: {
    large: {
      fontSize: theme.typography.fontSize["2xl"],
      fontWeight: theme.typography.fontWeight.normal,
      color: theme.colors.text,
    },
    medium: {
      fontSize: theme.typography.fontSize.xl,
      fontWeight: theme.typography.fontWeight.normal,
      color: theme.colors.text,
    },
    small: {
      fontSize: theme.typography.fontSize.base,
      fontWeight: theme.typography.fontWeight.normal,
      color: theme.colors.text,
    },
  },

  // 버튼 스타일 변형
  buttonVariants: {
    primary: {
      backgroundColor: theme.colors.primary,
      paddingVertical: theme.spacing[2],
      paddingHorizontal: theme.spacing[3],
      borderRadius: 0,
    },
    secondary: {
      backgroundColor: theme.colors.secondary,
      paddingVertical: theme.spacing[2],
      paddingHorizontal: theme.spacing[3],
      borderRadius: 0,
    },
    outline: {
      backgroundColor: "transparent",
      borderWidth: 1,
      borderColor: theme.colors.primary,
      paddingVertical: theme.spacing[2],
      paddingHorizontal: theme.spacing[3],
    },
    ghost: {
      backgroundColor: "transparent",
      paddingVertical: theme.spacing[2],
      paddingHorizontal: theme.spacing[3],
    },
  },

  // 카드 스타일 변형
  cardVariants: {
    default: {
      backgroundColor: "transparent",
      padding: theme.spacing[3],
      marginBottom: theme.spacing[3],
    },
    elevated: {
      backgroundColor: theme.colors.background,
      padding: theme.spacing[3],
      marginBottom: theme.spacing[3],
      shadowColor: theme.colors.neutral[900],
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    minimal: {
      backgroundColor: "transparent",
      padding: 0,
      marginBottom: theme.spacing[2],
    },
  },

  // 텍스트 스타일 변형
  textVariants: {
    heading: {
      fontSize: theme.typography.fontSize.lg,
      fontWeight: theme.typography.fontWeight.semibold,
      color: theme.colors.text,
    },
    body: {
      fontSize: theme.typography.fontSize.base,
      fontWeight: theme.typography.fontWeight.normal,
      color: theme.colors.text,
    },
    caption: {
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.normal,
      color: theme.colors.textSecondary,
    },
    label: {
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.medium,
      color: theme.colors.text,
    },
  },
});

// 공통 컴포넌트 스타일
export const createCommonStyles = (theme: Theme) => ({
  // 카드 컨테이너 스타일 (완전 미니멀)
  cardContainer: {
    backgroundColor: "transparent",
    borderWidth: 0,
    borderColor: "transparent",
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
    marginBottom: theme.spacing[3],
    paddingHorizontal: 0,
    margin: 0,
    padding: 0,
  },

  // 섹션 제목 스타일 (미니멀)
  sectionTitle: {
    marginBottom: theme.spacing[3],
    fontWeight: theme.typography.fontWeight.normal,
    fontSize: theme.typography.fontSize.lg,
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

  // 스크롤 콘텐츠 스타일 (미니멀)
  scrollContent: {
    paddingHorizontal: theme.spacing[3],
    paddingTop: theme.spacing[3],
    paddingBottom: theme.spacing[3],
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
