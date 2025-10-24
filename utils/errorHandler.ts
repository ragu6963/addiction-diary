/**
 * 향상된 에러 처리 시스템
 */

// AppError 타입 정의 (types.ts와 중복 제거)
export type AppError = Error | string | { message: string } | null | undefined;

// 에러 타입 정의
export enum ErrorType {
  NETWORK = "NETWORK",
  STORAGE = "STORAGE",
  VALIDATION = "VALIDATION",
  PERMISSION = "PERMISSION",
  UNKNOWN = "UNKNOWN",
}

// 에러 정보 인터페이스
export interface ErrorInfo {
  type: ErrorType;
  message: string;
  code?: string;
  details?: any;
  timestamp: number;
  userMessage: string;
}

// 에러 메시지 매핑
const ERROR_MESSAGES = {
  [ErrorType.NETWORK]: {
    userMessage: "네트워크 연결을 확인해주세요.",
    logMessage: "네트워크 오류가 발생했습니다.",
  },
  [ErrorType.STORAGE]: {
    userMessage: "데이터 저장 중 오류가 발생했습니다.",
    logMessage: "스토리지 오류가 발생했습니다.",
  },
  [ErrorType.VALIDATION]: {
    userMessage: "입력한 정보를 확인해주세요.",
    logMessage: "데이터 유효성 검사 실패",
  },
  [ErrorType.PERMISSION]: {
    userMessage: "권한이 필요합니다.",
    logMessage: "권한 오류가 발생했습니다.",
  },
  [ErrorType.UNKNOWN]: {
    userMessage: "알 수 없는 오류가 발생했습니다.",
    logMessage: "예상치 못한 오류가 발생했습니다.",
  },
};

/**
 * 에러 타입을 자동으로 감지하는 함수
 */
export const detectErrorType = (error: AppError): ErrorType => {
  if (!error) return ErrorType.UNKNOWN;

  const errorString = error instanceof Error ? error.message : String(error);

  if (errorString.includes("network") || errorString.includes("fetch")) {
    return ErrorType.NETWORK;
  }
  if (errorString.includes("storage") || errorString.includes("AsyncStorage")) {
    return ErrorType.STORAGE;
  }
  if (errorString.includes("validation") || errorString.includes("invalid")) {
    return ErrorType.VALIDATION;
  }
  if (errorString.includes("permission") || errorString.includes("denied")) {
    return ErrorType.PERMISSION;
  }

  return ErrorType.UNKNOWN;
};

/**
 * 에러 정보를 생성하는 함수
 */
export const createErrorInfo = (
  error: AppError,
  type?: ErrorType,
  details?: any
): ErrorInfo => {
  const detectedType = type || detectErrorType(error);
  const errorMessages = ERROR_MESSAGES[detectedType];

  return {
    type: detectedType,
    message: error instanceof Error ? error.message : String(error),
    code: error instanceof Error ? (error as any).code : undefined,
    details,
    timestamp: Date.now(),
    userMessage: errorMessages.userMessage,
  };
};

/**
 * 에러를 로깅하는 함수
 */
export const logError = (errorInfo: ErrorInfo, context?: string): void => {
  const logMessage = ERROR_MESSAGES[errorInfo.type].logMessage;
  const contextInfo = context ? ` [${context}]` : "";

  console.error(`${logMessage}${contextInfo}:`, {
    type: errorInfo.type,
    message: errorInfo.message,
    code: errorInfo.code,
    details: errorInfo.details,
    timestamp: new Date(errorInfo.timestamp).toISOString(),
  });
};

/**
 * 사용자에게 표시할 에러 메시지를 반환하는 함수
 */
export const getUserErrorMessage = (errorInfo: ErrorInfo): string => {
  return errorInfo.userMessage;
};

/**
 * 에러 처리를 위한 고차 함수
 */
export const withErrorHandling = <T extends any[], R>(
  fn: (...args: T) => R,
  context?: string,
  errorType?: ErrorType
) => {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args);
    } catch (error) {
      const errorInfo = createErrorInfo(error as AppError, errorType);
      logError(errorInfo, context);
      throw errorInfo;
    }
  };
};

/**
 * AsyncStorage 작업을 위한 에러 처리 래퍼
 */
export const withStorageErrorHandling = <T extends any[], R>(
  fn: (...args: T) => R
) => {
  return withErrorHandling(fn, "Storage", ErrorType.STORAGE);
};

/**
 * 네트워크 작업을 위한 에러 처리 래퍼
 */
export const withNetworkErrorHandling = <T extends any[], R>(
  fn: (...args: T) => R
) => {
  return withErrorHandling(fn, "Network", ErrorType.NETWORK);
};
