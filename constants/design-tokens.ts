import { Platform } from "react-native";

// 디자인 토큰 기반 색상 시스템
export const colors = {
  // Primary Colors
  primary: {
    50: "#E6F4FE",
    100: "#CCE9FD",
    200: "#99D3FB",
    300: "#66BDF9",
    400: "#33A7F7",
    500: "#007AFF", // 메인 프라이머리
    600: "#0062CC",
    700: "#004999",
    800: "#003166",
    900: "#001833",
  },

  // Secondary Colors
  secondary: {
    50: "#FFF5F5",
    100: "#FFE6E6",
    200: "#FFCCCC",
    300: "#FFB3B3",
    400: "#FF9999",
    500: "#FF6B6B", // 메인 세컨더리
    600: "#E55A5A",
    700: "#CC4949",
    800: "#B23838",
    900: "#992727",
  },

  // Neutral Colors
  neutral: {
    0: "#FFFFFF",
    50: "#F8F9FA",
    100: "#F1F3F4",
    200: "#E8EAED",
    300: "#DADCE0",
    400: "#BDC1C6",
    500: "#9AA0A6",
    600: "#80868B",
    700: "#5F6368",
    800: "#3C4043",
    900: "#202124",
    950: "#171717",
  },

  // Semantic Colors
  success: {
    50: "#F0FDF4",
    500: "#22C55E",
    600: "#16A34A",
    700: "#15803D",
  },

  warning: {
    50: "#FFFBEB",
    500: "#F59E0B",
    600: "#D97706",
    700: "#B45309",
  },

  error: {
    50: "#FEF2F2",
    500: "#EF4444",
    600: "#DC2626",
    700: "#B91C1C",
  },

  info: {
    50: "#EFF6FF",
    500: "#3B82F6",
    600: "#2563EB",
    700: "#1D4ED8",
  },
} as const;

// 스페이싱 시스템
export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
  24: 96,
  32: 128,
} as const;

// 타이포그래피 시스템
export const typography = {
  fontFamily: Platform.select({
    ios: {
      regular: "System",
      medium: "System",
      semibold: "System",
      bold: "System",
    },
    android: {
      regular: "Roboto",
      medium: "Roboto-Medium",
      semibold: "Roboto-Medium",
      bold: "Roboto-Bold",
    },
    default: {
      regular: "System",
      medium: "System",
      semibold: "System",
      bold: "System",
    },
  }),

  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    "2xl": 24,
    "3xl": 30,
    "4xl": 36,
    "5xl": 48,
    "6xl": 60,
  },

  lineHeight: {
    xs: 16,
    sm: 20,
    base: 24,
    lg: 28,
    xl: 28,
    "2xl": 32,
    "3xl": 40,
    "4xl": 44,
    "5xl": 56,
    "6xl": 72,
  },

  fontWeight: {
    normal: "400" as const,
    medium: "500" as const,
    semibold: "600" as const,
    bold: "700" as const,
  },
} as const;

// 보더 반지름 시스템 (사용하지 않음)
// export const borderRadius = {
//   none: 0,
//   sm: 4,
//   base: 8,
//   md: 12,
//   lg: 16,
//   xl: 20,
//   "2xl": 24,
//   "3xl": 32,
//   full: 9999,
// } as const;

// 그림자 시스템
export const shadows = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  base: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 8,
  },
  xl: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 12,
  },
} as const;

// 앱 전용 색상 시스템
export const appColors = {
  // 금욕 관련 색상
  addiction: {
    primary: "#ff6b6b",
    light: "#ff9999",
    dark: "#e55a5a",
  },
  // 금주 관련 색상
  alcohol: {
    primary: "#ff8c00",
    light: "#ffb347",
    dark: "#e67e00",
  },
  // 공통 색상
  common: {
    white: "#ffffff",
    black: "#000000",
    transparent: "transparent",
  },
} as const;

// 다크/라이트 테마 정의
export const lightTheme = {
  colors: {
    background: colors.neutral[0],
    surface: colors.neutral[50],
    surfaceVariant: colors.neutral[100],
    primary: colors.primary[500],
    primaryVariant: colors.primary[600],
    secondary: colors.secondary[500],
    secondaryVariant: colors.secondary[600],
    text: colors.neutral[900],
    textSecondary: colors.neutral[600],
    textTertiary: colors.neutral[500],
    border: colors.neutral[200],
    borderVariant: colors.neutral[300],
    success: colors.success[500],
    warning: colors.warning[500],
    error: colors.error[500],
    info: colors.info[500],
    // neutral 색상도 포함
    neutral: colors.neutral,
  },
  // 앱 전용 색상 포함
  appColors,
  spacing,
  typography,
  shadows,
} as const;

export const darkTheme = {
  colors: {
    background: colors.neutral[950],
    surface: colors.neutral[900],
    surfaceVariant: colors.neutral[800],
    primary: colors.primary[400],
    primaryVariant: colors.primary[500],
    secondary: colors.secondary[400],
    secondaryVariant: colors.secondary[500],
    text: colors.neutral[50],
    textSecondary: colors.neutral[300],
    textTertiary: colors.neutral[400],
    border: colors.neutral[700],
    borderVariant: colors.neutral[600],
    success: colors.success[500],
    warning: colors.warning[500],
    error: colors.error[500],
    info: colors.info[500],
    // neutral 색상도 포함
    neutral: colors.neutral,
  },
  // 앱 전용 색상 포함
  appColors,
  spacing,
  typography,
  shadows,
} as const;

export type Theme = typeof lightTheme;
export type ColorScheme = "light" | "dark";
