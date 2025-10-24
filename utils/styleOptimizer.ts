/**
 * 빌드 성능을 위한 최적화된 스타일 시스템
 * 스타일 컴파일 시간 단축을 위한 최적화
 */

import { StyleSheet, TextStyle, ViewStyle } from "react-native";

// 스타일 캐시
const styleCache = new Map<string, any>();

/**
 * 메모이제이션된 스타일 생성기
 * @param styles - 스타일 객체
 * @returns 최적화된 스타일시트
 */
export const createOptimizedStyles = <
  T extends Record<string, ViewStyle | TextStyle>
>(
  styles: T
): T => {
  const cacheKey = JSON.stringify(styles);

  if (styleCache.has(cacheKey)) {
    return styleCache.get(cacheKey);
  }

  const optimizedStyles = StyleSheet.create(styles);
  styleCache.set(cacheKey, optimizedStyles);

  return optimizedStyles;
};

/**
 * 조건부 스타일 적용
 * @param baseStyle - 기본 스타일
 * @param conditionalStyles - 조건부 스타일들
 * @returns 최적화된 스타일 배열
 */
export const conditionalStyles = (
  baseStyle: ViewStyle | TextStyle,
  ...conditionalStyles: (ViewStyle | TextStyle | null | undefined)[]
): (ViewStyle | TextStyle)[] => {
  return [baseStyle, ...conditionalStyles.filter(Boolean)];
};

/**
 * 스타일 병합 최적화
 * @param styles - 병합할 스타일들
 * @returns 병합된 스타일
 */
export const mergeStyles = (
  ...styles: (ViewStyle | TextStyle | null | undefined)[]
): ViewStyle | TextStyle => {
  return styles.reduce((acc, style) => {
    if (!style) return acc;
    return { ...acc, ...style };
  }, {} as ViewStyle | TextStyle);
};

/**
 * 반응형 스타일 생성기
 * @param breakpoints - 브레이크포인트 정의
 * @param styles - 각 브레이크포인트별 스타일
 * @returns 반응형 스타일 함수
 */
export const createResponsiveStyles = <T extends Record<string, any>>(
  breakpoints: Record<string, number>,
  styles: Record<string, T>
) => {
  return (screenWidth: number) => {
    const sortedBreakpoints = Object.entries(breakpoints).sort(
      ([, a], [, b]) => b - a
    );

    for (const [breakpoint, width] of sortedBreakpoints) {
      if (screenWidth >= width) {
        return styles[breakpoint] || {};
      }
    }

    return styles.mobile || {};
  };
};

/**
 * 애니메이션 스타일 최적화
 * @param animatedStyles - 애니메이션 스타일들
 * @returns 최적화된 애니메이션 스타일
 */
export const optimizeAnimatedStyles = (animatedStyles: any[]) => {
  // 애니메이션 스타일을 최적화하여 빌드 시간 단축
  return animatedStyles.map((style) => {
    if (typeof style === "object" && style !== null) {
      // 불필요한 속성 제거
      const { transform, ...rest } = style;
      return {
        ...rest,
        ...(transform && { transform: transform.filter(Boolean) }),
      };
    }
    return style;
  });
};

/**
 * 스타일 프리셋 (자주 사용되는 스타일 패턴)
 */
export const stylePresets = {
  // 레이아웃 프리셋
  centerContent: {
    justifyContent: "center" as const,
    alignItems: "center" as const,
  },

  flexRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
  },

  flexColumn: {
    flexDirection: "column" as const,
  },

  // 텍스트 프리셋
  textCenter: {
    textAlign: "center" as const,
  },

  textBold: {
    fontWeight: "bold" as const,
  },

  // 컨테이너 프리셋
  fullWidth: {
    width: "100%" as const,
  },

  fullHeight: {
    height: "100%" as const,
  },

  // 마진/패딩 프리셋
  noMargin: {
    margin: 0,
  },

  noPadding: {
    padding: 0,
  },
} as const;
