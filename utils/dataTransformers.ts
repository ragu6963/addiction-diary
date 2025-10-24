/**
 * 코드 품질 개선을 위한 유틸리티 함수들
 */

// import { DrinkType } from "./drinkConstants";

/**
 * 데이터 변환 유틸리티 함수들
 */

/**
 * 음주 기록 데이터를 UI용으로 변환하는 함수
 */
export const transformAlcoholRecordForUI = (record: any) => {
  return {
    id: record.id,
    date: record.date,
    time: record.time,
    timestamp: record.timestamp,
    drinks: record.drinks.map((drink: any) => ({
      type: drink.type,
      originalType: drink.type,
      volume: drink.volume,
      alcoholPercentage: drink.alcoholPercentage,
      quantity: drink.quantity,
      alcoholContent: drink.alcoholContent,
    })),
    totalAlcoholContent: record.totalAlcoholContent,
    totalVolume: record.totalVolume,
  };
};

/**
 * 날짜별 데이터를 기록 배열로 변환하는 함수
 */
export const convertDateDataToRecords = (data: any) => {
  const recordMap = new Map();

  Object.entries(data).forEach(([date, dayData]: [string, any]) => {
    dayData.records.forEach((record: any) => {
      const key = `${date}-${record.time}`;
      recordMap.set(key, transformAlcoholRecordForUI(record));
    });
  });

  return Array.from(recordMap.values());
};

/**
 * 통계 계산 유틸리티 함수들
 */

/**
 * 총 기록 수와 일수를 계산하는 함수
 */
export const calculateRecordStats = (data: any) => {
  let totalRecords = 0;
  let totalDays = 0;

  Object.values(data).forEach((dayData: any) => {
    totalRecords += dayData.records?.length || 0;
    totalDays += 1;
  });

  return { totalRecords, totalDays };
};

/**
 * 연속일 계산을 위한 헬퍼 함수
 */
export const calculateStreakHelper = (dates: string[]) => {
  if (dates.length === 0) return 0;

  const sortedDates = [...new Set(dates)].sort();
  const lastFailureDate = new Date(sortedDates[sortedDates.length - 1]);
  lastFailureDate.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - lastFailureDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  return diffDays === 0 ? 0 : diffDays;
};

/**
 * 검증 유틸리티 함수들
 */

/**
 * 음료 데이터 유효성 검사
 */
export const validateDrinkData = (drink: any): boolean => {
  return (
    drink &&
    typeof drink.volume === "number" &&
    typeof drink.alcoholPercentage === "number" &&
    typeof drink.quantity === "number" &&
    drink.volume > 0 &&
    drink.alcoholPercentage >= 0 &&
    drink.quantity > 0
  );
};

/**
 * 날짜 문자열 유효성 검사
 */
export const isValidDateString = (dateStr: string): boolean => {
  const date = new Date(dateStr);
  return !isNaN(date.getTime()) && /^\d{4}-\d{2}-\d{2}$/.test(dateStr);
};

/**
 * 포맷팅 유틸리티 함수들
 */

/**
 * 알코올 함량을 포맷팅하는 함수
 */
export const formatAlcoholContent = (content: number): string => {
  return `${content.toFixed(1)}g`;
};

/**
 * 용량을 포맷팅하는 함수
 */
export const formatVolume = (volume: number): string => {
  return `${volume.toFixed(0)}ml`;
};

/**
 * 시간을 포맷팅하는 함수
 */
export const formatTime = (time: string): string => {
  return time || "시간 없음";
};

/**
 * 배열 처리 유틸리티 함수들
 */

/**
 * 배열을 안전하게 정렬하는 함수
 */
export const safeSortArray = <T>(
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
 * 배열에서 중복을 제거하는 함수
 */
export const removeArrayDuplicates = <T>(array: T[], key: keyof T): T[] => {
  const seen = new Set();
  return array.filter((item) => {
    const value = item[key];
    if (seen.has(value)) return false;
    seen.add(value);
    return true;
  });
};
