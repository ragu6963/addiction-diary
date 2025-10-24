/**
 * 날짜 및 시간 포맷팅 유틸리티 함수들
 */

// 요일 배열
const DAYS_OF_WEEK = ["일", "월", "화", "수", "목", "금", "토"] as const;

/**
 * 날짜를 한국어 형식으로 포맷팅합니다 (년월일 포함)
 * @param dateStr - 포맷팅할 날짜 문자열 (YYYY-MM-DD)
 * @returns 포맷팅된 날짜 문자열 (예: "2024년 1월 15일 (월)")
 */
export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dayOfWeek = DAYS_OF_WEEK[date.getDay()];

  return `${year}년 ${month}월 ${day}일 (${dayOfWeek})`;
};

/**
 * 날짜를 간단한 형식으로 포맷팅합니다 (월일만 포함)
 * @param dateStr - 포맷팅할 날짜 문자열 (YYYY-MM-DD)
 * @returns 포맷팅된 날짜 문자열 (예: "1/15 (월)")
 */
export const formatDateShort = (dateStr: string): string => {
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dayOfWeek = DAYS_OF_WEEK[date.getDay()];

  return `${month}/${day} (${dayOfWeek})`;
};

/**
 * 현재 시간을 한국어 형식으로 포맷팅합니다
 * @returns 포맷팅된 시간 문자열 (예: "14:30")
 */
export const formatCurrentTime = (): string => {
  const now = new Date();
  return now.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * 날짜를 YYYY-MM-DD 형식으로 포맷팅합니다
 * @param date - 포맷팅할 Date 객체
 * @returns 포맷팅된 날짜 문자열 (예: "2024-01-15")
 */
export const formatDateToISO = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
};

/**
 * 월을 한국어 형식으로 포맷팅합니다
 * @param date - 포맷팅할 Date 객체
 * @returns 포맷팅된 월 문자열 (예: "2024년 1월")
 */
export const formatMonth = (date: Date): string => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;

  return `${year}년 ${month}월`;
};

/**
 * 두 날짜 사이의 일수를 계산합니다
 * @param startDate - 시작 날짜
 * @param endDate - 종료 날짜
 * @returns 일수 차이
 */
export const getDaysDifference = (startDate: Date, endDate: Date): number => {
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * 주의 시작일(월요일)을 계산합니다
 * @param date - 기준 날짜
 * @returns 주의 시작일 Date 객체
 */
export const getStartOfWeek = (date: Date): Date => {
  const startOfWeek = new Date(date);
  const day = startOfWeek.getDay();
  const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
  startOfWeek.setDate(diff);
  startOfWeek.setHours(0, 0, 0, 0);

  return startOfWeek;
};

/**
 * 주의 종료일(일요일)을 계산합니다
 * @param date - 기준 날짜
 * @returns 주의 종료일 Date 객체
 */
export const getEndOfWeek = (date: Date): Date => {
  const startOfWeek = getStartOfWeek(date);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  return endOfWeek;
};
