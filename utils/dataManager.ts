import AsyncStorage from "@react-native-async-storage/async-storage";

export interface RecordData {
  [key: string]: {
    count: number;
    lastRecordTime: string;
    records: {
      id: string;
      timestamp: string;
      time: string;
    }[];
  };
}

// 새로운 음주 기록 데이터 구조
export interface AlcoholRecord {
  id: string;
  date: string; // YYYY-MM-DD
  timestamp: string; // ISO string
  time: string; // HH:MM 형식

  // 음주 상세 정보
  drinks: DrinkItem[];
  totalAlcoholContent: number; // 총 알코올 함량 (g)
  totalVolume: number; // 총 음주량 (ml)
}

export interface DrinkItem {
  id: string;
  type: DrinkType; // 음료 종류
  volume: number; // 용량 (ml)
  alcoholPercentage: number; // 알코올 도수 (%)
  alcoholContent: number; // 알코올 함량 (g)
  quantity: number; // 수량
  unit: DrinkUnit; // 단위 (병, 캔, 잔 등)
}

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
  | "shot" // 잔
  | "cup" // 컵
  | "ml"; // 밀리리터

// 새로운 음주 기록 데이터 구조
export interface AlcoholRecordData {
  [date: string]: {
    records: AlcoholRecord[];
    totalAlcoholContent: number;
    totalVolume: number;
    lastRecordTime: string;
  };
}

export interface MarkedDates {
  [key: string]: {
    marked?: boolean;
    dotColor?: string;
    dots?: { color: string }[];
    count?: number;
    lastRecordTime?: string;
    // 음주 기록 추가 정보
    totalAlcoholContent?: number;
    totalVolume?: number;
  };
}

const STORAGE_KEY = "masturbationRecords";
const ALCOHOL_STORAGE_KEY = "alcoholRecords";

// 음료 프리셋 데이터
export const DRINK_PRESETS: Record<DrinkType, Partial<DrinkItem>[]> = {
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
};

// 알코올 함량 계산 함수
export const calculateAlcoholContent = (
  volume: number,
  alcoholPercentage: number
): number => {
  // 알코올 밀도: 0.789 g/ml
  return ((volume * alcoholPercentage) / 100) * 0.789;
};

// 음료 단위별 기본 용량 (ml)
export const UNIT_VOLUMES: Record<DrinkUnit, number> = {
  bottle: 500, // 기본 병 용량
  can: 330, // 기본 캔 용량
  glass: 200, // 기본 잔 용량
  shot: 30, // 기본 잔 용량
  cup: 250, // 기본 컵 용량
  ml: 1, // 밀리리터
};

// 데이터 캐시 (메모리 캐싱)
let dataCache: RecordData | null = null;
let cacheTimestamp: number = 0;
let alcoholDataCache: AlcoholRecordData | null = null;
let alcoholCacheTimestamp: number = 0;
const CACHE_DURATION = 5000; // 5초 캐시

/**
 * 저장된 데이터를 로드합니다 (캐시 최적화)
 */
export const loadRecordData = async (): Promise<RecordData> => {
  try {
    // 캐시된 데이터가 유효한지 확인
    const now = Date.now();
    if (dataCache && now - cacheTimestamp < CACHE_DURATION) {
      return dataCache;
    }

    const savedData = await AsyncStorage.getItem(STORAGE_KEY);
    if (!savedData) {
      dataCache = {};
      cacheTimestamp = now;
      return {};
    }

    const parsedData = JSON.parse(savedData);

    // 기존 데이터가 배열인 경우 (하위 호환성)
    if (Array.isArray(parsedData)) {
      const convertedData: RecordData = {};
      parsedData.forEach((date: string) => {
        convertedData[date] = {
          count: 1,
          lastRecordTime: "기록 시간 없음",
          records: [
            {
              id: `${date}-1`,
              timestamp: new Date(date).toISOString(),
              time: "기록 시간 없음",
            },
          ],
        };
      });
      dataCache = convertedData;
      cacheTimestamp = now;
      return convertedData;
    }

    // 새로운 객체 형태인 경우
    const recordData: RecordData = {};
    Object.keys(parsedData).forEach((date) => {
      const data = parsedData[date];
      recordData[date] = {
        count: data.count || 1,
        lastRecordTime: data.lastRecordTime || "기록 시간 없음",
        records: data.records || [
          {
            id: `${date}-1`,
            timestamp: new Date(date).toISOString(),
            time: data.lastRecordTime || "기록 시간 없음",
          },
        ],
      };
    });

    dataCache = recordData;
    cacheTimestamp = now;
    return recordData;
  } catch (error) {
    console.error("데이터 로드 실패:", error);
    return {};
  }
};

/**
 * 데이터를 저장합니다 (캐시 무효화)
 */
export const saveRecordData = async (data: RecordData): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    // 캐시 업데이트
    dataCache = data;
    cacheTimestamp = Date.now();
  } catch (error) {
    console.error("데이터 저장 실패:", error);
    throw error;
  }
};

/**
 * 새로운 기록을 추가합니다
 */
export const addNewRecord = async (dateStr: string): Promise<RecordData> => {
  const data = await loadRecordData();
  const now = new Date();
  const timeStr = now.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const recordId = `${dateStr}-${Date.now()}`;

  if (!data[dateStr]) {
    data[dateStr] = {
      count: 1,
      lastRecordTime: timeStr,
      records: [
        {
          id: recordId,
          timestamp: now.toISOString(),
          time: timeStr,
        },
      ],
    };
  } else {
    data[dateStr].count += 1;
    data[dateStr].lastRecordTime = timeStr;
    data[dateStr].records.push({
      id: recordId,
      timestamp: now.toISOString(),
      time: timeStr,
    });
  }

  await saveRecordData(data);
  return data;
};

/**
 * 특정 기록을 삭제합니다
 */
export const deleteRecord = async (
  dateStr: string,
  recordId: string
): Promise<RecordData> => {
  const data = await loadRecordData();

  if (data[dateStr]) {
    data[dateStr].records = data[dateStr].records.filter(
      (r) => r.id !== recordId
    );
    data[dateStr].count = data[dateStr].records.length;

    if (data[dateStr].count === 0) {
      delete data[dateStr];
    } else {
      // 마지막 기록 시간 업데이트
      const lastRecord =
        data[dateStr].records[data[dateStr].records.length - 1];
      data[dateStr].lastRecordTime = lastRecord.time;
    }
  }

  await saveRecordData(data);
  return data;
};

/**
 * 모든 기록을 삭제합니다
 */
export const clearAllRecords = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
    // 캐시 초기화
    dataCache = null;
    cacheTimestamp = 0;
  } catch (error) {
    console.error("기록 초기화 실패:", error);
    throw error;
  }
};

/**
 * 연속 금욕/금주 일수를 계산합니다
 * 기록이 있는 날 = 실패한 날이므로, 마지막 기록 이후 경과된 일수를 계산
 */
export const calculateStreakDays = (dates: string[]): number => {
  if (dates.length === 0) {
    // 기록이 전혀 없으면 앱 설치 후 계속 성공한 것으로 간주
    // 실제로는 사용자가 언제부터 시작했는지 알 수 없으므로 0으로 반환
    return 0;
  }

  // 날짜를 정렬하고 중복 제거
  const sortedDates = [...new Set(dates)].sort();

  // 가장 최근 기록(실패) 날짜
  const lastFailureDate = new Date(sortedDates[sortedDates.length - 1]);
  lastFailureDate.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 마지막 실패 이후 경과된 일수 계산
  const diffTime = today.getTime() - lastFailureDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // 오늘 기록이 있으면 연속일은 0
  if (diffDays === 0) {
    return 0;
  }

  // 마지막 기록 이후 경과된 일수가 연속 성공 일수
  return diffDays;
};

/**
 * 최장 연속 금욕 일수를 계산합니다 (최적화된 버전)
 */
export const calculateLongestStreak = (dates: string[]): number => {
  if (dates.length === 0) return 0;

  const sortedDates = [...new Set(dates)].sort();
  let maxStreak = 0;
  let currentStreak = 1;

  for (let i = 1; i < sortedDates.length; i++) {
    const prevDate = new Date(sortedDates[i - 1]);
    const currentDate = new Date(sortedDates[i]);

    const diffTime = currentDate.getTime() - prevDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      currentStreak++;
    } else {
      maxStreak = Math.max(maxStreak, currentStreak);
      currentStreak = 1;
    }
  }

  return Math.max(maxStreak, currentStreak);
};

/**
 * 날짜 포맷팅 함수 (메모이제이션)
 */
const dateFormatCache = new Map<string, string>();

export const formatDate = (dateStr: string): string => {
  if (dateFormatCache.has(dateStr)) {
    return dateFormatCache.get(dateStr)!;
  }

  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dayOfWeek = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];

  const formatted = `${year}년 ${month}월 ${day}일 (${dayOfWeek})`;
  dateFormatCache.set(dateStr, formatted);

  return formatted;
};

/**
 * 새로운 음주 기록 데이터를 로드합니다 (캐시 최적화)
 */
export const loadAlcoholRecordData = async (): Promise<AlcoholRecordData> => {
  try {
    // 캐시된 데이터가 유효한지 확인
    const now = Date.now();
    if (alcoholDataCache && now - alcoholCacheTimestamp < CACHE_DURATION) {
      return alcoholDataCache;
    }

    const savedData = await AsyncStorage.getItem(ALCOHOL_STORAGE_KEY);
    if (!savedData) {
      alcoholDataCache = {};
      alcoholCacheTimestamp = now;
      return {};
    }

    const parsedData = JSON.parse(savedData);
    alcoholDataCache = parsedData;
    alcoholCacheTimestamp = now;
    return parsedData;
  } catch (error) {
    console.error("음주 데이터 로드 실패:", error);
    return {};
  }
};

/**
 * 새로운 음주 기록 데이터를 저장합니다 (캐시 무효화)
 */
export const saveAlcoholRecordData = async (
  data: AlcoholRecordData
): Promise<void> => {
  try {
    await AsyncStorage.setItem(ALCOHOL_STORAGE_KEY, JSON.stringify(data));
    // 캐시 업데이트
    alcoholDataCache = data;
    alcoholCacheTimestamp = Date.now();
  } catch (error) {
    console.error("음주 데이터 저장 실패:", error);
    throw error;
  }
};

/**
 * 새로운 음주 기록을 추가합니다
 */
export const addNewAlcoholRecord = async (
  alcoholRecord: AlcoholRecord
): Promise<AlcoholRecordData> => {
  const data = await loadAlcoholRecordData();
  const dateStr = alcoholRecord.date;

  if (!data[dateStr]) {
    data[dateStr] = {
      records: [alcoholRecord],
      totalAlcoholContent: alcoholRecord.totalAlcoholContent,
      totalVolume: alcoholRecord.totalVolume,
      lastRecordTime: alcoholRecord.time,
    };
  } else {
    data[dateStr].records.push(alcoholRecord);
    data[dateStr].totalAlcoholContent += alcoholRecord.totalAlcoholContent;
    data[dateStr].totalVolume += alcoholRecord.totalVolume;
    data[dateStr].lastRecordTime = alcoholRecord.time;
  }

  await saveAlcoholRecordData(data);
  return data;
};

/**
 * 특정 음주 기록을 삭제합니다
 */
export const deleteAlcoholRecord = async (
  dateStr: string,
  recordId: string
): Promise<AlcoholRecordData> => {
  const data = await loadAlcoholRecordData();

  if (data[dateStr]) {
    const recordIndex = data[dateStr].records.findIndex(
      (r) => r.id === recordId
    );
    if (recordIndex !== -1) {
      const deletedRecord = data[dateStr].records[recordIndex];
      data[dateStr].records.splice(recordIndex, 1);

      // 총합 업데이트
      data[dateStr].totalAlcoholContent -= deletedRecord.totalAlcoholContent;
      data[dateStr].totalVolume -= deletedRecord.totalVolume;

      if (data[dateStr].records.length === 0) {
        delete data[dateStr];
      } else {
        // 마지막 기록 시간 업데이트
        const lastRecord =
          data[dateStr].records[data[dateStr].records.length - 1];
        data[dateStr].lastRecordTime = lastRecord.time;
      }
    }
  }

  await saveAlcoholRecordData(data);
  return data;
};

/**
 * 특정 음주 기록을 수정합니다
 */
export const updateAlcoholRecord = async (
  dateStr: string,
  recordId: string,
  updatedRecord: AlcoholRecord
): Promise<AlcoholRecordData> => {
  const data = await loadAlcoholRecordData();

  if (data[dateStr]) {
    const recordIndex = data[dateStr].records.findIndex(
      (r) => r.id === recordId
    );
    if (recordIndex !== -1) {
      const oldRecord = data[dateStr].records[recordIndex];

      // 총합에서 기존 기록 제거
      data[dateStr].totalAlcoholContent -= oldRecord.totalAlcoholContent;
      data[dateStr].totalVolume -= oldRecord.totalVolume;

      // 새로운 기록으로 교체
      data[dateStr].records[recordIndex] = updatedRecord;

      // 총합에 새로운 기록 추가
      data[dateStr].totalAlcoholContent += updatedRecord.totalAlcoholContent;
      data[dateStr].totalVolume += updatedRecord.totalVolume;

      // 마지막 기록 시간 업데이트
      const lastRecord =
        data[dateStr].records[data[dateStr].records.length - 1];
      data[dateStr].lastRecordTime = lastRecord.time;
    }
  }

  await saveAlcoholRecordData(data);
  return data;
};

/**
 * 모든 금주 기록을 삭제합니다
 */
export const clearAllAlcoholRecords = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(ALCOHOL_STORAGE_KEY);
    // 캐시 초기화
    alcoholDataCache = null;
    alcoholCacheTimestamp = 0;
  } catch (error) {
    console.error("금주 기록 초기화 실패:", error);
    throw error;
  }
};

/**
 * 금욕과 금주 기록을 합쳐서 반환하는 함수
 */
export interface CombinedRecordItem {
  id: string;
  date: string;
  formattedDate: string;
  recordTime: string;
  timestamp: string;
  type: "addiction" | "alcohol"; // 기록 타입 구분
  count: number; // 해당 날짜의 총 기록 수
  recordNumber: number; // 해당 날짜 내에서의 순번
}

export const loadCombinedRecords = async (): Promise<{
  records: CombinedRecordItem[];
  totalRecords: number;
  totalDays: number;
  addictionRecords: number;
  alcoholRecords: number;
  addictionDays: number;
  alcoholDays: number;
}> => {
  try {
    const [addictionData, alcoholData] = await Promise.all([
      loadRecordData(),
      loadAlcoholRecordData(),
    ]);

    const allRecords: CombinedRecordItem[] = [];
    const uniqueDates = new Set<string>();
    const addictionDates = new Set<string>();
    const alcoholDates = new Set<string>();
    let addictionRecordCount = 0;
    let alcoholRecordCount = 0;

    // 금욕 기록 처리
    Object.keys(addictionData).forEach((date) => {
      uniqueDates.add(date);
      addictionDates.add(date);
      const dayRecords = addictionData[date].records || [];
      addictionRecordCount += dayRecords.length;

      dayRecords.forEach((record, index) => {
        allRecords.push({
          id: record.id,
          date,
          formattedDate: formatDate(date),
          recordTime: record.time,
          timestamp: record.timestamp,
          type: "addiction",
          count: dayRecords.length,
          recordNumber: index + 1,
        });
      });
    });

    // 새로운 음주 기록 처리
    Object.keys(alcoholData).forEach((date) => {
      uniqueDates.add(date);
      alcoholDates.add(date);
      const dayRecords = alcoholData[date].records || [];
      alcoholRecordCount += dayRecords.length;

      dayRecords.forEach((record, index) => {
        allRecords.push({
          id: record.id,
          date,
          formattedDate: formatDate(date),
          recordTime: record.time,
          timestamp: record.timestamp,
          type: "alcohol",
          count: dayRecords.length,
          recordNumber: index + 1,
        });
      });
    });

    // 타임스탬프 기준으로 정렬 (최신순)
    allRecords.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return {
      records: allRecords,
      totalRecords: allRecords.length,
      totalDays: uniqueDates.size,
      addictionRecords: addictionRecordCount,
      alcoholRecords: alcoholRecordCount,
      addictionDays: addictionDates.size,
      alcoholDays: alcoholDates.size,
    };
  } catch (error) {
    console.error("통합 기록 로드 실패:", error);
    return {
      records: [],
      totalRecords: 0,
      totalDays: 0,
      addictionRecords: 0,
      alcoholRecords: 0,
      addictionDays: 0,
      alcoholDays: 0,
    };
  }
};

/**
 * 통합 기록 삭제 함수
 */
export const deleteCombinedRecord = async (
  recordId: string,
  date: string,
  type: "addiction" | "alcohol"
): Promise<void> => {
  if (type === "addiction") {
    await deleteRecord(date, recordId);
  } else {
    await deleteAlcoholRecord(date, recordId);
  }
};

/**
 * 모든 기록 삭제 (금욕 + 금주)
 */
export const clearAllCombinedRecords = async (): Promise<void> => {
  await Promise.all([clearAllRecords(), clearAllAlcoholRecords()]);
};

/**
 * 음주 기록을 달력 표시용으로 변환합니다
 */
export const getAlcoholMarkedDates = async (): Promise<MarkedDates> => {
  const data = await loadAlcoholRecordData();
  const marked: MarkedDates = {};

  Object.keys(data).forEach((date) => {
    const dayData = data[date];
    const recordCount = dayData.records.length;

    // 알코올 함량에 따른 색상 강도 조절
    const alcoholContent = dayData.totalAlcoholContent;
    let colorIntensity = 0.3; // 기본 투명도

    if (alcoholContent > 0) {
      if (alcoholContent <= 20) colorIntensity = 0.4; // 적음
      else if (alcoholContent <= 40) colorIntensity = 0.6; // 보통
      else if (alcoholContent <= 60) colorIntensity = 0.8; // 많음
      else colorIntensity = 1.0; // 매우 많음
    }

    // 최대 5개까지 dot 표시
    const maxDots = Math.min(recordCount, 5);
    const dots = Array.from({ length: maxDots }, () => ({
      color: `rgba(255, 140, 0, ${colorIntensity})`, // 주황색 투명도 적용
    }));

    marked[date] = {
      dots: dots,
      count: recordCount,
      lastRecordTime: dayData.lastRecordTime,
      // 추가 정보
      totalAlcoholContent: dayData.totalAlcoholContent,
      totalVolume: dayData.totalVolume,
    };
  });

  return marked;
};

/**
 * 음주 통계 데이터를 계산합니다
 */
export const getAlcoholStatistics = async () => {
  const data = await loadAlcoholRecordData();
  const now = new Date();

  // 이번 주 범위 계산
  const startOfWeek = new Date(now);
  const day = startOfWeek.getDay();
  const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
  startOfWeek.setDate(diff);
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  // 이번 달
  const thisMonth = `${now.getFullYear()}-${(now.getMonth() + 1)
    .toString()
    .padStart(2, "0")}`;

  let totalDays = 0;
  let totalRecords = 0;
  let totalAlcoholContent = 0;
  let totalVolume = 0;
  let thisWeekAlcohol = 0;
  let thisWeekVolume = 0;
  let thisMonthAlcohol = 0;
  let thisMonthVolume = 0;
  let thisWeekRecords = 0;
  let thisMonthRecords = 0;

  // 음료 종류별 통계
  const drinkTypeStats: Record<
    DrinkType,
    { count: number; alcoholContent: number; volume: number }
  > = {
    beer: { count: 0, alcoholContent: 0, volume: 0 },
    soju: { count: 0, alcoholContent: 0, volume: 0 },
    wine: { count: 0, alcoholContent: 0, volume: 0 },
    whiskey: { count: 0, alcoholContent: 0, volume: 0 },
    cocktail: { count: 0, alcoholContent: 0, volume: 0 },
    makgeolli: { count: 0, alcoholContent: 0, volume: 0 },
    other: { count: 0, alcoholContent: 0, volume: 0 },
  };

  Object.keys(data).forEach((date) => {
    const dayData = data[date];
    const dateObj = new Date(date);

    totalDays++;
    totalRecords += dayData.records.length;
    totalAlcoholContent += dayData.totalAlcoholContent;
    totalVolume += dayData.totalVolume;

    // 이번 주 통계
    if (dateObj >= startOfWeek && dateObj <= endOfWeek) {
      thisWeekAlcohol += dayData.totalAlcoholContent;
      thisWeekVolume += dayData.totalVolume;
      thisWeekRecords += dayData.records.length;
    }

    // 이번 달 통계
    if (date.startsWith(thisMonth)) {
      thisMonthAlcohol += dayData.totalAlcoholContent;
      thisMonthVolume += dayData.totalVolume;
      thisMonthRecords += dayData.records.length;
    }

    // 음료 종류별 통계
    dayData.records.forEach((record) => {
      record.drinks.forEach((drink) => {
        drinkTypeStats[drink.type].count += drink.quantity;
        drinkTypeStats[drink.type].alcoholContent += drink.alcoholContent;
        drinkTypeStats[drink.type].volume += drink.volume * drink.quantity;
      });
    });
  });

  // 연속 금주 일수 계산
  const alcoholDates = Object.keys(data);
  const currentStreak = calculateStreakDays(alcoholDates);
  const longestStreak = calculateLongestStreak(alcoholDates);

  return {
    totalDays,
    totalRecords,
    totalAlcoholContent,
    totalVolume,
    thisWeekAlcohol,
    thisWeekVolume,
    thisWeekRecords,
    thisMonthAlcohol,
    thisMonthVolume,
    thisMonthRecords,
    currentStreak,
    longestStreak,
    drinkTypeStats,
  };
};

/**
 * 금욕 기록 삭제 함수
 */
export const deleteAddictionRecord = async (
  recordId: string,
  date: string
): Promise<void> => {
  try {
    const data = await loadRecordData();
    if (data[date]) {
      data[date].records = data[date].records.filter(
        (record: any) => record.id !== recordId
      );

      if (data[date].records.length === 0) {
        delete data[date];
      } else {
        // 마지막 기록 시간 업데이트
        const lastRecord = data[date].records[data[date].records.length - 1];
        data[date].lastRecordTime = lastRecord.time;
      }

      await saveRecordData(data);
      invalidateCache();
    }
  } catch (error) {
    console.error("금욕 기록 삭제 실패:", error);
    throw error;
  }
};

/**
 * 모든 금욕 기록 삭제 함수
 */
export const clearAllAddictionRecords = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
    invalidateCache();
  } catch (error) {
    console.error("금욕 기록 초기화 실패:", error);
    throw error;
  }
};

/**
 * 캐시 무효화 함수
 */
export const invalidateCache = (): void => {
  dataCache = null;
  cacheTimestamp = 0;
  alcoholDataCache = null;
  alcoholCacheTimestamp = 0;
  dateFormatCache.clear();
};
