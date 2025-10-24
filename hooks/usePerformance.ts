/**
 * 성능 최적화를 위한 커스텀 훅들
 */

import { useCallback, useMemo, useRef } from "react";

/**
 * 값이 변경되지 않았을 때 이전 값을 반환하는 훅
 * @param value - 메모이제이션할 값
 * @param isEqual - 비교 함수
 * @returns 메모이제이션된 값
 */
export const useMemoizedValue = <T>(
  value: T,
  isEqual: (prev: T, next: T) => boolean = Object.is
): T => {
  const ref = useRef<T>(value);

  if (!isEqual(ref.current, value)) {
    ref.current = value;
  }

  return ref.current;
};

/**
 * 객체의 깊은 비교를 위한 훅
 * @param obj - 메모이제이션할 객체
 * @returns 메모이제이션된 객체
 */
export const useDeepMemo = <T extends Record<string, any>>(obj: T): T => {
  return useMemo(() => obj, [JSON.stringify(obj)]);
};

/**
 * 함수를 메모이제이션하는 훅 (의존성 배열 없이)
 * @param fn - 메모이제이션할 함수
 * @returns 메모이제이션된 함수
 */
export const useStableCallback = <T extends (...args: any[]) => any>(
  fn: T
): T => {
  const ref = useRef<T>(fn);
  ref.current = fn;

  return useCallback((...args: Parameters<T>) => {
    return ref.current(...args);
  }, []) as T;
};

/**
 * 배열을 메모이제이션하는 훅
 * @param array - 메모이제이션할 배열
 * @param compareFn - 비교 함수
 * @returns 메모이제이션된 배열
 */
export const useMemoizedArray = <T>(
  array: T[],
  compareFn?: (prev: T[], next: T[]) => boolean
): T[] => {
  const defaultCompare = (prev: T[], next: T[]) => {
    if (prev.length !== next.length) return false;
    return prev.every((item, index) => Object.is(item, next[index]));
  };

  return useMemo(() => array, [array, compareFn || defaultCompare]);
};

/**
 * 객체 배열을 키 기준으로 메모이제이션하는 훅
 * @param array - 메모이제이션할 객체 배열
 * @param key - 비교 기준 키
 * @returns 메모이제이션된 배열
 */
export const useMemoizedArrayByKey = <T extends Record<string, any>>(
  array: T[],
  key: keyof T
): T[] => {
  return useMemo(() => array, [array.map((item) => item[key]).join(",")]);
};
