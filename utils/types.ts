import { DrinkItem } from "./dataManager";

// 달력 컴포넌트의 day 객체 타입
export interface CalendarDay {
  dateString: string;
  day: number;
  month: number;
  year: number;
  timestamp: number;
}

// 음료 아이템 업데이트를 위한 타입
export interface DrinkItemUpdate {
  id: string;
  field: keyof DrinkItem;
  value: string | number;
}

// 버튼 스타일 타입 (width 속성 포함)
export interface ButtonStyle {
  width?: string | number;
  [key: string]: any;
}

// 안전한 값 타입
export type SafeValue = string | number | boolean | null | undefined;

// 깊은 복사를 위한 타입
export type DeepCloneable =
  | string
  | number
  | boolean
  | null
  | undefined
  | Date
  | any[]
  | Record<string, any>;

// 함수 타입 정의
export type AnyFunction = (...args: any[]) => any;
export type AsyncFunction = (...args: any[]) => Promise<any>;
