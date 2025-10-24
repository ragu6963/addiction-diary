import { spacing } from "@/constants/design-tokens";
import { useTheme } from "@/hooks/use-styles";
import React from "react";
import { View, ViewStyle } from "react-native";

export interface SpacerProps {
  size?: keyof typeof spacing;
  horizontal?: boolean;
  style?: ViewStyle;
}

export const Spacer: React.FC<SpacerProps> = ({
  size = 2,
  horizontal = false,
  style,
}) => {
  const theme = useTheme();

  const spacerStyles: ViewStyle = {
    ...(horizontal
      ? {
          width: theme.spacing[size],
          height: 1,
        }
      : {
          height: theme.spacing[size],
          width: 1,
        }),
  };

  return <View style={[spacerStyles, style]} />;
};
