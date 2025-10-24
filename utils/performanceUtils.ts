/**
 * 빌드 성능을 위한 최적화된 유틸리티 함수들
 * 메모이제이션과 캐싱을 활용한 성능 최적화
 */

// 메모이제이션을 위한 WeakMap 캐시
const memoCache = new WeakMap();

/**
 * 메모이제이션된 함수 생성기
 * @param fn - 메모이제이션할 함수
 * @param keyGenerator - 캐시 키 생성 함수
 * @returns 메모이제이션된 함수
 */
export const memoize = <T extends (...args: any[]) => any>(
  fn: T,
  keyGenerator?: (...args: Parameters<T>) => string
): T => {
  const cache = new Map();

  return ((...args: Parameters<T>) => {
    const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
};

/**
 * 디바운스된 함수 (빌드 시 불필요한 재계산 방지)
 */
export const debounce = <T extends (...args: any[]) => any>(
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
 * 스로틀된 함수 (빌드 시 과도한 호출 방지)
 */
export const throttle = <T extends (...args: any[]) => any>(
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
 * 조건부 함수 실행 (빌드 시 불필요한 실행 방지)
 */
export const conditional = <T>(
  condition: boolean,
  trueValue: T,
  falseValue: T
): T => {
  return condition ? trueValue : falseValue;
};

/**
 * 안전한 객체 접근 (빌드 시 오류 방지)
 */
export const safeGet = <T>(obj: any, path: string, defaultValue: T): T => {
  try {
    return (
      path.split(".").reduce((current, key) => current?.[key], obj) ??
      defaultValue
    );
  } catch {
    return defaultValue;
  }
};

/**
 * 빈 값 체크 최적화
 */
export const isEmpty = (value: any): boolean => {
  if (value == null) return true;
  if (typeof value === "string") return value.length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object") return Object.keys(value).length === 0;
  return false;
};

/**
 * 타입 가드 함수들 (빌드 시 타입 체크 최적화)
 */
export const isString = (value: any): value is string =>
  typeof value === "string";
export const isNumber = (value: any): value is number =>
  typeof value === "number";
export const isBoolean = (value: any): value is boolean =>
  typeof value === "boolean";
export const isFunction = (value: any): value is Function =>
  typeof value === "function";
export const isObject = (value: any): value is object =>
  value !== null && typeof value === "object" && !Array.isArray(value);
export const isArray = (value: any): value is any[] => Array.isArray(value);

/**
 * 성능 측정 유틸리티 (개발 시에만 사용)
 */
export const measurePerformance = <T>(name: string, fn: () => T): T => {
  if (__DEV__) {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    console.log(`${name} 실행 시간: ${end - start}ms`);
    return result;
  }
  return fn();
};
