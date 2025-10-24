import { useTheme } from "@/hooks/use-styles";
import React from "react";
import {
  Text as RNText,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

export interface ButtonProps {
  title: string;
  onPress: () => void;
  buttonStyle?: ViewStyle | any;
  titleStyle?: TextStyle;
  disabled?: boolean;
  type?: "primary" | "secondary" | "outline" | "ghost";
  size?: "small" | "medium" | "large";
  fullWidth?: boolean;
  // 접근성 속성
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: "button" | "link" | "imagebutton";
  testID?: string;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  buttonStyle,
  titleStyle,
  disabled = false,
  type = "primary",
  size = "medium",
  fullWidth = false,
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole = "button",
  testID,
}) => {
  const theme = useTheme();

  const getButtonStyles = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      alignItems: "center",
      justifyContent: "center",
      opacity: disabled ? 0.6 : 1,
      minHeight: 44, // 접근성을 위한 최소 높이
    };

    // 크기별 스타일
    const sizeStyles: Record<string, ViewStyle> = {
      small: {
        paddingVertical: theme.spacing[1],
        paddingHorizontal: theme.spacing[3],
        minHeight: 36,
      },
      medium: {
        paddingVertical: theme.spacing[2],
        paddingHorizontal: theme.spacing[4],
        minHeight: 44,
      },
      large: {
        paddingVertical: theme.spacing[3],
        paddingHorizontal: theme.spacing[5],
        minHeight: 52,
      },
    };

    // 타입별 스타일
    const typeStyles: Record<string, ViewStyle> = {
      primary: {
        backgroundColor: theme.colors.primary,
      },
      secondary: {
        backgroundColor: theme.colors.secondary,
      },
      outline: {
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: theme.colors.primary,
      },
      ghost: {
        backgroundColor: "transparent",
      },
    };

    // 너비 설정
    const widthStyle: ViewStyle = fullWidth ? { width: "100%" } : {};

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...typeStyles[type],
      ...widthStyle,
    };
  };

  const getTitleStyles = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontWeight: theme.typography.fontWeight.semibold,
      textAlign: "center",
    };

    // 크기별 텍스트 스타일
    const sizeStyles: Record<string, TextStyle> = {
      small: {
        fontSize: theme.typography.fontSize.sm,
      },
      medium: {
        fontSize: theme.typography.fontSize.base,
      },
      large: {
        fontSize: theme.typography.fontSize.lg,
      },
    };

    // 타입별 텍스트 색상
    const typeStyles: Record<string, TextStyle> = {
      primary: {
        color: theme.colors.neutral[0],
      },
      secondary: {
        color: theme.colors.neutral[0],
      },
      outline: {
        color: theme.colors.primary,
      },
      ghost: {
        color: theme.colors.text,
      },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...typeStyles[type],
    };
  };

  return (
    <TouchableOpacity
      style={[getButtonStyles(), buttonStyle as any]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      accessible={true}
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint}
      accessibilityRole={accessibilityRole}
      testID={testID}
    >
      <RNText style={[getTitleStyles(), titleStyle]}>{title}</RNText>
    </TouchableOpacity>
  );
};
