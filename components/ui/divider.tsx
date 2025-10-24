import { useTheme } from "@/hooks/use-styles";
import React from "react";
import { View, ViewStyle } from "react-native";

export interface DividerProps {
  orientation?: "horizontal" | "vertical";
  thickness?: number;
  color?: string;
  margin?: number;
  style?: ViewStyle;
}

export const Divider: React.FC<DividerProps> = ({
  orientation = "horizontal",
  thickness = 1,
  color,
  margin = 0,
  style,
}) => {
  const theme = useTheme();

  const dividerStyles: ViewStyle = {
    backgroundColor: color || theme.colors.border,
    margin,
    ...(orientation === "horizontal"
      ? {
          height: thickness,
          width: "100%",
        }
      : {
          width: thickness,
          height: "100%",
        }),
  };

  return <View style={[dividerStyles, style]} />;
};
