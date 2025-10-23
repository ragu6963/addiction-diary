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

export interface MarkedDates {
  [key: string]: {
    marked?: boolean;
    dotColor?: string;
    dots?: { color: string }[];
    count?: number;
    lastRecordTime?: string;
  };
}

const STORAGE_KEY = "masturbationRecords";
const ALCOHOL_STORAGE_KEY = "alcoholRecords";

// 데이터 캐시 (메모리 캐싱)
let dataCache: RecordData | null = null;
let cacheTimestamp: number = 0;
let alcoholDataCache: RecordData | null = null;
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
 * 금주 데이터를 로드합니다 (캐시 최적화)
 */
export const loadAlcoholRecordData = async (): Promise<RecordData> => {
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
      alcoholDataCache = convertedData;
      alcoholCacheTimestamp = now;
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

    alcoholDataCache = recordData;
    alcoholCacheTimestamp = now;
    return recordData;
  } catch (error) {
    console.error("금주 데이터 로드 실패:", error);
    return {};
  }
};

/**
 * 금주 데이터를 저장합니다 (캐시 무효화)
 */
export const saveAlcoholRecordData = async (
  data: RecordData
): Promise<void> => {
  try {
    await AsyncStorage.setItem(ALCOHOL_STORAGE_KEY, JSON.stringify(data));
    // 캐시 업데이트
    alcoholDataCache = data;
    alcoholCacheTimestamp = Date.now();
  } catch (error) {
    console.error("금주 데이터 저장 실패:", error);
    throw error;
  }
};

/**
 * 새로운 금주 기록을 추가합니다
 */
export const addNewAlcoholRecord = async (
  dateStr: string
): Promise<RecordData> => {
  const data = await loadAlcoholRecordData();
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

  await saveAlcoholRecordData(data);
  return data;
};

/**
 * 특정 금주 기록을 삭제합니다
 */
export const deleteAlcoholRecord = async (
  dateStr: string,
  recordId: string
): Promise<RecordData> => {
  const data = await loadAlcoholRecordData();

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

    // 금주 기록 처리
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
 * 캐시 무효화 함수
 */
export const invalidateCache = (): void => {
  dataCache = null;
  cacheTimestamp = 0;
  alcoholDataCache = null;
  alcoholCacheTimestamp = 0;
  dateFormatCache.clear();
};
