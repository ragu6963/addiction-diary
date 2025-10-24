import { AppError } from "./errorHandler";
import { AnyFunction, DeepCloneable, SafeValue } from "./types";

/**
 * 고유 ID 생성 함수
 * @param prefix - ID 접두사
 * @returns 고유 ID 문자열
 */
export const generateId = (prefix: string = ""): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  return prefix ? `${prefix}-${timestamp}-${random}` : `${timestamp}-${random}`;
};

/**
 * 배열을 안전하게 정렬하는 함수
 * @param array - 정렬할 배열
 * @param key - 정렬 기준 키
 * @param order - 정렬 순서 ('asc' | 'desc')
 * @returns 정렬된 새 배열
 */
export const safeSort = <T>(
  array: T[],
  key: keyof T,
  order: "asc" | "desc" = "desc"
): T[] => {
  if (!Array.isArray(array)) return [];

  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];

    if (aVal < bVal) return order === "asc" ? -1 : 1;
    if (aVal > bVal) return order === "asc" ? 1 : -1;
    return 0;
  });
};

/**
 * 객체 배열에서 중복 제거
 * @param array - 중복 제거할 배열
 * @param key - 중복 판단 기준 키
 * @returns 중복이 제거된 새 배열
 */
export const removeDuplicates = <T>(array: T[], key: keyof T): T[] => {
  const seen = new Set();
  return array.filter((item) => {
    const value = item[key];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
};

/**
 * 숫자를 안전하게 파싱하는 함수
 * @param value - 파싱할 값
 * @param defaultValue - 기본값
 * @returns 파싱된 숫자 또는 기본값
 */
export const safeParseNumber = (
  value: SafeValue,
  defaultValue: number = 0
): number => {
  if (typeof value === "number" && !isNaN(value)) return value;
  if (typeof value === "string") {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? defaultValue : parsed;
  }
  return defaultValue;
};

/**
 * 문자열을 안전하게 처리하는 함수
 * @param value - 처리할 값
 * @param defaultValue - 기본값
 * @returns 처리된 문자열 또는 기본값
 */
export const safeString = (
  value: SafeValue,
  defaultValue: string = ""
): string => {
  if (typeof value === "string") return value;
  if (value === null || value === undefined) return defaultValue;
  return String(value);
};

/**
 * 객체의 깊은 복사
 * @param obj - 복사할 객체
 * @returns 복사된 새 객체
 */
export const deepClone = <T extends DeepCloneable>(obj: T): T => {
  if (obj === null || typeof obj !== "object") return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as T;
  if (obj instanceof Array) return obj.map((item) => deepClone(item)) as T;
  if (typeof obj === "object") {
    const clonedObj = {} as Record<string, any>;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj as T;
  }
  return obj;
};

/**
 * 디바운스 함수
 * @param func - 실행할 함수
 * @param delay - 지연 시간 (ms)
 * @returns 디바운스된 함수
 */
export const debounce = <T extends AnyFunction>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * 스로틀 함수
 * @param func - 실행할 함수
 * @param limit - 제한 시간 (ms)
 * @returns 스로틀된 함수
 */
export const throttle = <T extends AnyFunction>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * 배열을 청크로 나누는 함수
 * @param array - 나눌 배열
 * @param size - 청크 크기
 * @returns 청크 배열
 */
export const chunk = <T>(array: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

/**
 * 객체에서 빈 값들을 제거하는 함수
 * @param obj - 처리할 객체
 * @returns 빈 값이 제거된 새 객체
 */
export const removeEmptyValues = <T extends Record<string, any>>(
  obj: T
): Partial<T> => {
  const result: Partial<T> = {};

  for (const key in obj) {
    const value = obj[key];
    if (value !== null && value !== undefined && value !== "") {
      result[key] = value;
    }
  }

  return result;
};

/**
 * 두 날짜 사이의 일수를 계산하는 함수
 * @param startDate - 시작 날짜
 * @param endDate - 종료 날짜
 * @returns 일수 차이
 */
export const getDaysBetween = (startDate: Date, endDate: Date): number => {
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * 현재 시간을 한국어 형식으로 반환하는 함수
 * @returns 포맷팅된 시간 문자열
 */
export const getCurrentTimeString = (): string => {
  const now = new Date();
  return now.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * 에러를 안전하게 처리하는 함수
 * @param error - 에러 객체
 * @param defaultMessage - 기본 에러 메시지
 * @returns 에러 메시지 문자열
 */
export const getErrorMessage = (
  error: AppError,
  defaultMessage: string = "알 수 없는 오류가 발생했습니다"
): string => {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  if (error && typeof error === "object" && "message" in error) {
    return error.message;
  }
  return defaultMessage;
};
