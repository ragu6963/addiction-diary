/**
 * 빌드 성능을 위한 최적화된 컴포넌트 로딩
 * 동적 import를 사용하여 코드 분할
 */

import { lazy, Suspense } from "react";
import { ActivityIndicator, View } from "react-native";

// 지연 로딩을 위한 로딩 컴포넌트
export const LoadingSpinner = () => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <ActivityIndicator size="large" />
  </View>
);

// 동적 import로 컴포넌트 지연 로딩
export const LazyCalendar = lazy(() => import("@/app/calendar"));
export const LazyAlcoholCalendar = lazy(() => import("@/app/alcohol-calendar"));
export const LazyAlcoholRecords = lazy(() => import("@/app/alcohol-records"));
export const LazyAddictionRecords = lazy(
  () => import("@/app/addiction-records")
);
export const LazyStatistics = lazy(() => import("@/app/statistics"));

// Suspense로 감싸는 HOC
export const withSuspense = (Component: React.ComponentType<any>) => {
  return (props: any) => (
    <Suspense fallback={<LoadingSpinner />}>
      <Component {...props} />
    </Suspense>
  );
};

// 최적화된 컴포넌트들
export const OptimizedCalendar = withSuspense(LazyCalendar);
export const OptimizedAlcoholCalendar = withSuspense(LazyAlcoholCalendar);
export const OptimizedAlcoholRecords = withSuspense(LazyAlcoholRecords);
export const OptimizedAddictionRecords = withSuspense(LazyAddictionRecords);
export const OptimizedStatistics = withSuspense(LazyStatistics);
