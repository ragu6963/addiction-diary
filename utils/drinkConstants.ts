/**
 * 음료 타입 관련 상수 및 유틸리티 함수들
 */

export type DrinkType =
  | "beer" // 맥주
  | "soju" // 소주
  | "wine" // 와인
  | "whiskey" // 위스키
  | "cocktail" // 칵테일
  | "makgeolli" // 막걸리
  | "other"; // 기타

export type DrinkUnit =
  | "bottle" // 병
  | "can" // 캔
  | "glass" // 잔
  | "shot" // 술잔
  | "cup" // 컵
  | "ml"; // 밀리리터

/**
 * 음료 타입별 한국어 이름 매핑
 */
export const DRINK_NAMES: Record<DrinkType, string> = {
  beer: "맥주",
  soju: "소주",
  wine: "와인",
  whiskey: "위스키",
  cocktail: "칵테일",
  makgeolli: "막걸리",
  other: "기타",
} as const;

/**
 * 음료 타입별 아이콘 매핑
 */
export const DRINK_ICONS: Record<DrinkType, string> = {
  beer: "🍺",
  soju: "🍶",
  wine: "🍷",
  whiskey: "🥃",
  cocktail: "🍸",
  makgeolli: "🍶",
  other: "🥤",
} as const;

/**
 * 음료 단위별 한국어 이름 매핑
 */
export const DRINK_UNIT_NAMES: Record<DrinkUnit, string> = {
  bottle: "병",
  can: "캔",
  glass: "잔",
  shot: "잔",
  cup: "컵",
  ml: "ml",
} as const;

/**
 * 음료 타입의 한국어 이름을 반환합니다
 * @param type - 음료 타입
 * @returns 한국어 이름
 */
export const getDrinkName = (type: DrinkType): string => {
  return DRINK_NAMES[type] || type;
};

/**
 * 음료 타입의 아이콘을 반환합니다
 * @param type - 음료 타입
 * @returns 아이콘 이모지
 */
export const getDrinkIcon = (type: DrinkType): string => {
  return DRINK_ICONS[type] || "🍻";
};

/**
 * 음료 단위의 한국어 이름을 반환합니다
 * @param unit - 음료 단위
 * @returns 한국어 이름
 */
export const getDrinkUnitName = (unit: DrinkUnit): string => {
  return DRINK_UNIT_NAMES[unit] || unit;
};

/**
 * 음료 프리셋 데이터
 */
export const DRINK_PRESETS: Record<
  DrinkType,
  Array<{
    type: DrinkType;
    volume: number;
    alcoholPercentage: number;
    unit: DrinkUnit;
  }>
> = {
  beer: [
    { type: "beer", volume: 500, alcoholPercentage: 4.5, unit: "bottle" }, // 일반 맥주
    { type: "beer", volume: 330, alcoholPercentage: 5.0, unit: "can" }, // 캔 맥주
    { type: "beer", volume: 250, alcoholPercentage: 4.5, unit: "glass" }, // 맥주 잔
  ],
  soju: [
    { type: "soju", volume: 360, alcoholPercentage: 17.0, unit: "bottle" }, // 일반 소주
    { type: "soju", volume: 50, alcoholPercentage: 17.0, unit: "shot" }, // 소주 잔
  ],
  wine: [
    { type: "wine", volume: 750, alcoholPercentage: 12.0, unit: "bottle" }, // 와인 병
    { type: "wine", volume: 150, alcoholPercentage: 12.0, unit: "glass" }, // 와인 잔
  ],
  whiskey: [
    { type: "whiskey", volume: 30, alcoholPercentage: 40.0, unit: "shot" }, // 위스키 잔
    { type: "whiskey", volume: 700, alcoholPercentage: 40.0, unit: "bottle" }, // 위스키 병
  ],
  cocktail: [
    { type: "cocktail", volume: 200, alcoholPercentage: 15.0, unit: "glass" }, // 칵테일 잔
  ],
  makgeolli: [
    { type: "makgeolli", volume: 750, alcoholPercentage: 6.0, unit: "bottle" }, // 막걸리 병
    { type: "makgeolli", volume: 200, alcoholPercentage: 6.0, unit: "cup" }, // 막걸리 컵
  ],
  other: [
    { type: "other", volume: 100, alcoholPercentage: 0, unit: "ml" }, // 기타
  ],
} as const;

/**
 * 음료 단위별 기본 용량 매핑
 */
export const UNIT_VOLUMES: Record<DrinkUnit, number> = {
  bottle: 500, // 기본 병 용량
  can: 330, // 기본 캔 용량
  glass: 200, // 기본 잔 용량
  shot: 50, // 기본 술잔 용량
  cup: 200, // 기본 컵 용량
  ml: 1, // 밀리리터
} as const;
