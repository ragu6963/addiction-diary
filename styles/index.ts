// 통합된 스타일 시스템
// React 훅과 달력 테마는 hooks/use-styles.ts에서 import
export { createCalendarTheme, useStyles, useTheme } from "@/hooks/use-styles";

// 베이스 스타일 팩토리들
export {
  createBaseCalendarStyles,
  createCalendarVariantStyles,
} from "./calendar-base.styles";

// 화면별 스타일 팩토리들
export { createAlcoholCalendarStyles } from "./alcohol-calendar.styles";
export {
  createAlcoholRecordModalStyles,
  staticAlcoholRecordModalStyles,
} from "./alcohol-record-modal.styles";
export { createCalendarStyles } from "./calendar.styles";
export {
  createCommonStyles,
  createMixins,
  staticCommonStyles,
} from "./common.styles";
export { createMainStyles, staticMainStyles } from "./main.styles";
export { createModalStyles, modalStyles } from "./modal.styles";
export { createRecordsStyles } from "./records.styles";
export { createStatisticsStyles } from "./statistics.styles";
