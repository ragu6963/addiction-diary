import { useTheme } from "@/hooks/use-styles";
import React, { useState } from "react";
import {
  Text as RNText,
  TextInput,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

export interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
  secureTextEntry?: boolean;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  label?: string;
  errorMessage?: string;
  disabled?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  size?: "small" | "medium" | "large";
  variant?: "default" | "outlined" | "filled";
  // 접근성 속성
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
}

export const Input: React.FC<InputProps> = ({
  value,
  onChangeText,
  placeholder,
  keyboardType = "default",
  secureTextEntry = false,
  containerStyle,
  inputStyle,
  label,
  errorMessage,
  disabled = false,
  multiline = false,
  numberOfLines = 1,
  size = "medium",
  variant = "outlined",
}) => {
  const theme = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const getContainerStyles = (): ViewStyle => {
    return {
      marginVertical: theme.spacing[2],
      ...containerStyle,
    };
  };

  const getInputStyles = (): TextStyle => {
    const baseStyle: TextStyle = {
      color: theme.colors.text,
      fontSize: theme.typography.fontSize.base,
      minHeight: 44,
    };

    // 크기별 스타일
    const sizeStyles: Record<string, TextStyle> = {
      small: {
        fontSize: theme.typography.fontSize.sm,
        minHeight: 36,
        paddingVertical: theme.spacing[1],
        paddingHorizontal: theme.spacing[2],
      },
      medium: {
        fontSize: theme.typography.fontSize.base,
        minHeight: 44,
        paddingVertical: theme.spacing[2],
        paddingHorizontal: theme.spacing[3],
      },
      large: {
        fontSize: theme.typography.fontSize.lg,
        minHeight: 52,
        paddingVertical: theme.spacing[3],
        paddingHorizontal: theme.spacing[4],
      },
    };

    // 변형별 스타일
    const variantStyles: Record<string, TextStyle> = {
      default: {
        borderBottomWidth: 1,
        borderBottomColor: errorMessage
          ? theme.colors.error[500]
          : isFocused
          ? theme.colors.primary
          : theme.colors.neutral[300],
        backgroundColor: "transparent",
      },
      outlined: {
        borderWidth: 1,
        borderColor: errorMessage
          ? theme.colors.error[500]
          : isFocused
          ? theme.colors.primary
          : theme.colors.neutral[300],
        backgroundColor: disabled
          ? theme.colors.neutral[100]
          : theme.colors.background,
      },
      filled: {
        backgroundColor: disabled
          ? theme.colors.neutral[100]
          : theme.colors.neutral[50],
        borderWidth: 0,
      },
    };

    const multilineStyle: TextStyle = multiline
      ? {
          minHeight: 80,
          textAlignVertical: "top",
        }
      : {};

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...multilineStyle,
    };
  };

  const getLabelStyles = (): TextStyle => {
    return {
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.medium,
      color: theme.colors.text,
      marginBottom: theme.spacing[1],
    };
  };

  const getErrorStyles = (): TextStyle => {
    return {
      fontSize: theme.typography.fontSize.xs,
      color: theme.colors.error[500],
      marginTop: theme.spacing[1],
    };
  };

  return (
    <View style={getContainerStyles()}>
      {label && <RNText style={getLabelStyles()}>{label}</RNText>}
      <TextInput
        style={[getInputStyles(), inputStyle]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textTertiary}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        editable={!disabled}
        multiline={multiline}
        numberOfLines={numberOfLines}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {errorMessage && <RNText style={getErrorStyles()}>{errorMessage}</RNText>}
    </View>
  );
};
