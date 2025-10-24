import { useTheme } from "@/hooks/use-styles";
import React from "react";
import { View, ViewStyle } from "react-native";

export interface CardProps {
  children: React.ReactNode;
  containerStyle?: ViewStyle;
  elevation?: "none" | "sm" | "base" | "md" | "lg";
  padding?: "none" | "sm" | "base" | "lg";
  backgroundColor?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  containerStyle,
  elevation = "base",
  padding = "base",
  backgroundColor,
}) => {
  const theme = useTheme();

  const getElevationStyles = (): ViewStyle => {
    if (elevation === "none") {
      return {};
    }

    const elevationConfig = theme.shadows[elevation];
    return {
      shadowColor: theme.colors.neutral[900],
      shadowOffset: elevationConfig.shadowOffset,
      shadowOpacity: elevationConfig.shadowOpacity,
      shadowRadius: elevationConfig.shadowRadius,
      elevation: elevationConfig.elevation,
    };
  };

  const getPaddingStyles = (): ViewStyle => {
    const paddingMap = {
      none: 0,
      sm: theme.spacing[2],
      base: theme.spacing[4],
      lg: theme.spacing[6],
    };
    return { padding: paddingMap[padding] };
  };

  const cardStyles: ViewStyle = {
    backgroundColor: backgroundColor || theme.colors.background,
    marginVertical: theme.spacing[2],
    marginHorizontal: theme.spacing[3],
    ...getElevationStyles(),
    ...getPaddingStyles(),
  };

  return <View style={[cardStyles, containerStyle]}>{children}</View>;
};
