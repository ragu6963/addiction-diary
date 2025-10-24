import { useTheme } from "@/hooks/use-styles";
import React from "react";
import { Text as RNText, TextStyle } from "react-native";

export interface TextProps {
  children: React.ReactNode;
  style?: TextStyle;
  h1?: boolean;
  h2?: boolean;
  h3?: boolean;
  h4?: boolean;
  h5?: boolean;
  h6?: boolean;
  color?: string;
}

export const Text: React.FC<TextProps> = ({
  children,
  style,
  h1 = false,
  h2 = false,
  h3 = false,
  h4 = false,
  h5 = false,
  h6 = false,
  color,
}) => {
  const theme = useTheme();

  const getTextStyles = (): TextStyle => {
    const baseStyle: TextStyle = {
      color: color || theme.colors.text,
    };

    // 헤딩 스타일
    if (h1) {
      return {
        ...baseStyle,
        fontSize: theme.typography.fontSize["4xl"],
        fontWeight: theme.typography.fontWeight.bold,
        lineHeight: theme.typography.lineHeight["4xl"],
      };
    }
    if (h2) {
      return {
        ...baseStyle,
        fontSize: theme.typography.fontSize["3xl"],
        fontWeight: theme.typography.fontWeight.bold,
        lineHeight: theme.typography.lineHeight["3xl"],
      };
    }
    if (h3) {
      return {
        ...baseStyle,
        fontSize: theme.typography.fontSize["2xl"],
        fontWeight: theme.typography.fontWeight.semibold,
        lineHeight: theme.typography.lineHeight["2xl"],
      };
    }
    if (h4) {
      return {
        ...baseStyle,
        fontSize: theme.typography.fontSize.xl,
        fontWeight: theme.typography.fontWeight.semibold,
        lineHeight: theme.typography.lineHeight.xl,
      };
    }
    if (h5) {
      return {
        ...baseStyle,
        fontSize: theme.typography.fontSize.lg,
        fontWeight: theme.typography.fontWeight.medium,
        lineHeight: theme.typography.lineHeight.lg,
      };
    }
    if (h6) {
      return {
        ...baseStyle,
        fontSize: theme.typography.fontSize.base,
        fontWeight: theme.typography.fontWeight.medium,
        lineHeight: theme.typography.lineHeight.base,
      };
    }

    // 기본 텍스트 스타일
    return {
      ...baseStyle,
      fontSize: theme.typography.fontSize.base,
      fontWeight: theme.typography.fontWeight.normal,
      lineHeight: theme.typography.lineHeight.base,
    };
  };

  return <RNText style={[getTextStyles(), style]}>{children}</RNText>;
};
