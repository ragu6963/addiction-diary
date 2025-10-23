import { Theme } from "@/constants/design-tokens";
import { createCommonStyles, createMixins } from "./common.styles";

// 달력 화면 공통 베이스 스타일 팩토리
export const createBaseCalendarStyles = (theme: Theme, accentColor: string) => {
  const commonStyles = createCommonStyles(theme);
  const mixins = createMixins(theme);

  return {
    ...commonStyles,

    // 연속일 제목 스타일
    streakTitle: {
      ...mixins.centerText,
      ...mixins.titleVariants.medium,
      marginBottom: theme.spacing[2],
    },

    // 연속일 숫자 스타일
    streakDays: {
      ...mixins.titleVariants.large,
      textAlign: "center" as const,
      color: accentColor, // 각 달력의 테마 색상
      marginBottom: theme.spacing[2],
    },

    // 연속일 서브텍스트 스타일
    streakSubtext: {
      ...mixins.centerText,
      opacity: 0.8,
    },

    // 달력 헤더 스타일
    calendarHeader: {
      ...mixins.flexRowBetween,
      paddingVertical: theme.spacing[4],
      paddingHorizontal: theme.spacing[5],
    },

    // 월 텍스트 스타일
    monthText: {
      fontSize: theme.typography.fontSize.lg,
      fontWeight: theme.typography.fontWeight.semibold,
      color: theme.colors.text,
    },

    // 달력 컨테이너 스타일
    calendar: {},
  };
};

// 달력별 특화 스타일 팩토리들
export const createCalendarVariantStyles = (
  theme: Theme,
  variant: "addiction" | "alcohol"
) => {
  const accentColor =
    variant === "addiction"
      ? theme.appColors.addiction.primary
      : theme.appColors.alcohol.primary;

  const baseStyles = createBaseCalendarStyles(theme, accentColor);

  // 각 달력별 추가 스타일
  const mixins = createMixins(theme);
  const variantStyles =
    variant === "alcohol"
      ? {
          // 금주 달력 전용 버튼 스타일
          recordButton: {
            ...mixins.buttonVariants.primary,
            backgroundColor: accentColor,
          },
        }
      : {};

  return {
    ...baseStyles,
    ...variantStyles,
  };
};
