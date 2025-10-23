import { Theme } from "@/constants/design-tokens";
import { createCalendarVariantStyles } from "./calendar-base.styles";

// 금욕 달력 화면 전용 스타일
export const createCalendarStyles = (theme: Theme) => {
  return createCalendarVariantStyles(theme, "addiction");
};
