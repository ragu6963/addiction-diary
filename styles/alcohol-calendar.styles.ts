import { Theme } from "@/constants/design-tokens";
import { createCalendarVariantStyles } from "./calendar-base.styles";

// 금주 달력 화면 전용 스타일 (금욕 달력과 구별되는 색상 사용)
export const createAlcoholCalendarStyles = (theme: Theme) => {
  return createCalendarVariantStyles(theme, "alcohol");
};
